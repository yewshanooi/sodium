import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import steamHelper from '../../Utils/steamHelper';
import { GuildModel, LeaderboardModel, LogModel } from '../../Utils/schemes';;
import mongoose from 'mongoose';
import fetch from 'node-fetch';

export default {
	apis: ["STEAM_API_KEY"],
	data: new SlashCommandBuilder()
		.setName('steam')
		.setDescription('Steam commands: link your SteamID or show a profile')
		.addSubcommand(sub =>
			sub
				.setName('link')
				.setDescription('Associate your SteamID64 to your Discord ID')
				.addStringOption(opt =>
					opt.setName('steamid64')
						.setDescription('Your SteamID64 (format 7656...)')
						.setRequired(true)
				)
		)
		.addSubcommand(sub =>
			sub
				.setName('profile')
				.setDescription('Show a Steam profile (by steamid64, username or linked account)')
				.addStringOption(opt =>
					opt.setName('id_or_username')
						.setDescription("User's SteamID64 or username")
						.setRequired(false)
				)
		),
	cooldown: 5,
    category: 'Utility',
    guildOnly: true,
    execute: async (client, interaction) => {
		const apiKey = process.env.STEAM_API_KEY;
		const sub = interaction.options.getSubcommand();
		// SUBCOMMAND: link
		if (sub === 'link') {
			const guildDB = await GuildModel.findOne({ 'guild.id': interaction.guild.id });
			if (!guildDB) return interaction.reply({ embeds: [client.errors.noGuildDB] });
			const steamid = interaction.options.getString('steamid64');
			if (!/^7656\d{13}$/.test(steamid)) {
				return interaction.reply({ content: 'The SteamID64 provided is invalid. It should start with 7656 and be 17 digits.', ephemeral: true });
			}
			
			const saved = await steamHelper.newUser(steamid, interaction.user.id, interaction.guild.id);
			if (!saved) return interaction.reply({ content: 'Failed to save your SteamID. Check logs.', ephemeral: true });

			return interaction.reply({ content: `SteamID \`${steamid}\` successfully associated to <@${interaction.user.id}>.`, ephemeral: false });
		}

		// SUBCOMMAND: profile
		try {
			const optIdOrUsername = interaction.options.getString('id_or_username');

			// Resolver a steamid (prioridad: steamid64 > username > linked)
			const resolved = await steamHelper.isLink({ steamIdOrUsername: optIdOrUsername, interaction, apiKey, guildId: interaction.guild.id });
			if (resolved.error) return interaction.reply({ content: resolved.error, ephemeral: true });

			const steamid = resolved.steamid;

			// ---------- Perfil ----------
			const profileURL = new URL('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/');
			profileURL.searchParams.set('key', apiKey);
			profileURL.searchParams.set('format', 'json');
			profileURL.searchParams.set('steamids', steamid);

			let res: any = await fetch(profileURL);
			if (!res.ok) return interaction.reply({ content: 'Steam API error (profile).', ephemeral: true });

			let profileData = await res.json();
			if (!profileData.response || !Array.isArray(profileData.response.players) || profileData.response.players.length === 0) {
				return interaction.reply({ content: 'No Steam profile found for that ID.', ephemeral: true });
			}

			const player = profileData.response.players[0];
			if (await steamHelper.isPrivate(profileData.response)) {
				return interaction.reply({ content: 'This profile appears to be private.', ephemeral: true });
			}

			// Level
			const levelRes: any = await fetch(
				`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${apiKey}&steamid=${steamid}`
			);
			const levelData = await levelRes.json();
			const level = levelData.response?.player_level ?? "0";

			// Status
			const statusColors = { 0: '#000000', 1: '#27b900', 2: '#fdc71c', 3: '#f04747', 4: '#a3a3a3', 5: '#a3a3a3' };
			const states = { 0: 'offline', 1: 'online', 2: 'busy', 3: 'away', 4: 'snooze', 5: 'unknown' };
			const color = statusColors[player.personastate] || '#2f3136';
			const statusText = player.gameextrainfo ? `In game: ${player.gameextrainfo}` : `Currently ${states[player.personastate] ?? 'unknown'}`;

			// ---------- Juegos (ordenar por playtime_forever desc y tomar top 15) ----------

			
			const gamesURL = new URL('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/');
			gamesURL.searchParams.set('key', apiKey);
			gamesURL.searchParams.set('format', 'json');
			gamesURL.searchParams.set('steamid', steamid);
			// include_appinfo para obtener nombres (si la cuenta lo permite)
			gamesURL.searchParams.set('include_appinfo', 'true');
			let gamesRes: any = await fetch(gamesURL);
			let gamesData = await gamesRes.json();

			let gamesCount = gamesData.response.game_count || 0;
			// Ordenar de mayor a menor tiempo jugado
			let gamesList = gamesData.response.games
				?.sort((a, b) => b.playtime_forever - a.playtime_forever)
				.slice(0, 15)
				.map(g => {
					const hours = g.playtime_forever ? Math.round(g.playtime_forever / 60) : 0;
					const name = g.name ?? `AppID ${g.appid}`;
					return `[${name}](https://store.steampowered.com/app/${g.appid})`;
					//return `[${name}](https://store.steampowered.com/app/${g.appid}) \`${hours}h\``;
				}).join('\n') || 'No games found';

			// ---------- Tiempo total jugado ----------
			const totalMinutes = gamesData.response.games.reduce((acc, g) => acc + (g.playtime_forever || 0), 0);
			const totalHours = Math.round(totalMinutes / 60);

			// ---------- Actividad reciente ----------
			const recentURL = new URL('http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/');
			recentURL.searchParams.set('key', apiKey);
			recentURL.searchParams.set('format', 'json');
			recentURL.searchParams.set('steamid', steamid);

			let recentRes: any = await fetch(recentURL);
			let recentData = await recentRes.json().catch(() => ({}));
			let recentText = 'No recent activity';
			if (recentData.response?.games?.length) {
				const recentGames = recentData.response.games;
				const recentMinutes = recentGames.reduce((a, g) => a + (g.playtime_2weeks || 0), 0);
				const recentHours = Math.round(recentMinutes / 60);
				const names = recentGames.slice(0, 15).map(g => `${g.name} \`${Math.round((g.playtime_2weeks || 0) / 60)} of ${Math.round((g.playtime_forever || 0) / 60)}h\``).join(', ');
				
				recentText = `${recentHours}h in last 2 weeks across ${recentData.response.total_count} games: ${names}`;
			}

			const embed = new EmbedBuilder()
				.setColor(color)
				.setTitle(`${player.personaname}'s Steam Profile (Level: ${level}) ${player.loccountrycode ? `${player.loccountrycode}` : ''}`)
				.setURL(player.profileurl)
				.setThumbnail(player.avatarfull || player.avatarmedium)
				.setDescription(player.realname ? `**${player.realname}**` : "Stats")
				.addFields(
					{ name: 'SteamID', value: player.steamid ?? 'N/A', inline: true },
					{ name: 'Status', value: statusText, inline: true },
					{ name: 'Last Online', value: player.lastlogoff ? `<t:${player.lastlogoff}:f>` : 'Now', inline: true },
					{ name: 'Creation Date', value: player.timecreated ? `<t:${player.timecreated}:F>` : 'Unknown', inline: true },
					{ name: 'Games Owned', value: `${gamesCount}`, inline: true },
					{ name: 'Total Playtime', value: `${totalHours} hours`, inline: true },
					{ name: 'Recent Activity', value: recentText },
					{ name: `Top 15 by playtime`, value: gamesList }
				)
				.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

			return interaction.reply({ embeds: [embed] });
		} catch (err) {
			console.error('Error in /steam profile:', err);
			return interaction.reply({ content: 'An internal error occurred while fetching Steam data.', ephemeral: true });
		}
	},
} as Command;
