const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leagueoflegends')
		.setDescription('Get a player\'s League of Legends details from Riot Games')
		.addStringOption(option => option.setName('username').setDescription('Enter a username').setRequired(true))
		.addStringOption(option => option.setName('tag').setDescription('Enter a tag').setRequired(true))
		.addStringOption(option => option.setName('region').setDescription('Select a server region').addChoices({ name: 'Brazil (BR1)', value: 'BR1' }, { name: 'Europe Nordic & East (EUN1)', value: 'EUN1' }, { name: 'Europe West (EUW1)', value: 'EUW1' }, { name: 'Japan (JP1)', value: 'JP1' }, { name: 'Republic of Korea (KR)', value: 'KR' }, { name: 'Latin America North (LA1)', value: 'LA1' }, { name: 'Latin America South (LA2)', value: 'LA2' }, { name: 'North America (NA1)', value: 'NA1' }, { name: 'Oceania (OC1)', value: 'OC1' }, { name: 'The Philippines (PH2)', value: 'PH2' }, { name: 'Russia (RU)', value: 'RU' }, { name: 'Singapore, Malaysia & Indonesia (SG2)', value: 'SG2' }, { name: 'Thailand (TH2)', value: 'TH2' }, { name: 'Turkey (TR1)', value: 'TR1' }, { name: 'Taiwan, Hong Kong & Macao (TW2)', value: 'TW2' }, { name: 'Vietnam (VN2)', value: 'VN2' }).setRequired(true)),
	cooldown: '5',
	category: 'Fun',
	guildOnly: false,
	async execute (interaction) {
		await interaction.deferReply();

		if (!process.env.RIOTGAMES_API_KEY) return interaction.editReply({ embeds: [global.errors[1]] });

		const gamename = interaction.options.getString('username');
		const tagline = interaction.options.getString('tag');
		const region = interaction.options.getString('region');

		const RiotAccount = await fetch(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gamename}/${tagline}?api_key=${process.env.RIOTGAMES_API_KEY}`)
			.then(res => res.json());

			if (!RiotAccount.puuid) return interaction.editReply({ content: 'Error: No such Riot ID found.' });

		const League = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${RiotAccount.puuid}?api_key=${process.env.RIOTGAMES_API_KEY}`)
			.then(res => res.json());

			if (!League.accountId) return interaction.editReply({ content: 'Error: No such Summoner found.' });

			const lastUpdated = new Date(League.revisionDate).toLocaleString('en-US', { timeZone: 'UTC' });

		const embed = new EmbedBuilder()
			.setTitle(`${RiotAccount.gameName}#${RiotAccount.tagLine}`)
			.setFields(
				{ name: 'Region', value: `\`${region}\``, inline: true },
				{ name: 'Level', value: `\`${League.summonerLevel}\`` },
				{ name: 'Last Updated', value: `\`${lastUpdated}\`` }
			)
			.setFooter({ text: 'Powered by Riot Games' })
			.setColor('#eb0029');

		return interaction.editReply({ embeds: [embed] });
	}
};

// There are three routing values for account-v1; americas, asia, and europe. You can query for any account in any region. We recommend using the nearest cluster.