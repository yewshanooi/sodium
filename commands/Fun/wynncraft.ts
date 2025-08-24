import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import { stringify } from 'uuid';
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('wynncraft')
        .setDescription('Get a Minecraft player\'s stats from Wynncraft')
        .addStringOption(option => option.setName('username').setDescription('Enter a username').setRequired(true)),
    cooldown: 5,
    category: 'Fun',
    guildOnly: false,
	execute: async (client, interaction) => {
        await interaction.deferReply();

        const usernameField = interaction.options.getString('username');

        const Mojang: any = await fetch(`https://api.mojang.com/users/profiles/minecraft/${usernameField}`)
            .then(res => res.json());

            if (!Mojang) return interaction.editReply({ content: 'Error: An error has occurred while trying to process your request.' });
            if (Mojang.errorMessage) return interaction.editReply({ content: 'Error: Invalid username or username does not exist.' });

            const compactUUID = Mojang.id;
            const byteArray = Buffer.from(compactUUID, 'hex');
            const formattedUUID = stringify(byteArray);

        const Wynncraft: any = await fetch(`https://api.wynncraft.com/v3/player/${formattedUUID}`)
            .then(res => res.json());

            if (Wynncraft.Error) return interaction.editReply({ content: 'Error: No player found with that username.' });

            let getStatus;
                if (Wynncraft.online === true) getStatus = 'Online';
                if (Wynncraft.online === false) getStatus = 'Offline';

            let getRankName;
                if (Wynncraft.supportRank) {
                    getRankName = `[${Wynncraft.supportRank.toUpperCase()}] ${Wynncraft.username}`;
                } else {
                    getRankName = `${Wynncraft.username}`;
                }

            const firstJoined = new Date(Wynncraft.firstJoin).toLocaleString();
            const lastSeen = new Date(Wynncraft.lastJoin).toLocaleString();

            const embed = new EmbedBuilder()
                .setTitle(`${getRankName}`)
                .addFields(
                    { name: 'Status', value: `\`${getStatus}\``, inline: true },
                    { name: 'Server', value: `\`${Wynncraft.server}\``, inline: true },
                    { name: 'Guild', value: `\`${Wynncraft.guild.name} [${Wynncraft.guild.prefix}]\``, inline: true },
                    { name: 'First Joined', value: `\`${firstJoined}\`` },
                    { name: 'Last Seen', value: `\`${lastSeen}\`` },
                    { name: 'Playtime', value: `\`${Wynncraft.playtime}\` hours`, inline: true },
                    { name: 'Mobs Killed', value: `\`${Wynncraft.globalData.killedMobs}\``, inline: true },
                    { name: 'Chests Found', value: `\`${Wynncraft.globalData.chestsFound}\``, inline: true },
                    { name: 'Quests Completed', value: `\`${Wynncraft.globalData.completedQuests}\``, inline: true },
                    { name: 'Dungeons Completed', value: `\`${Wynncraft.globalData.dungeons.total}\``, inline: true },
                    { name: 'Raids Completed', value: `\`${Wynncraft.globalData.raids.total}\``, inline: true }
                )
                .setFooter({ text: 'Powered by Wynncraft' })
                .setColor('#82c63c');

            const button = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(new ButtonBuilder()
                    .setURL(`https://wynncraft.com/stats/player/${formattedUUID}`)
                    .setLabel('View on Wynncraft')
                    .setStyle(ButtonStyle.Link));

            return interaction.editReply({ embeds: [embed], components: [button] });
        }
} as Command;