const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leagueoflegends')
		.setDescription('Get a League of Legends player\'s details from Riot Games')
		.addStringOption(option => option.setName('name').setDescription('Enter a summoner name').setRequired(true))
		.addStringOption(option => option.setName('region').setDescription('Select a server region').addChoices({ name: 'Brazil (BR1)', value: 'BR1' }, { name: 'Europe Nordic & East (EUN1)', value: 'EUN1' }, { name: 'Europe West (EUW1)', value: 'EUW1' }, { name: 'Japan (JP1)', value: 'JP1' }, { name: 'Republic of Korea (KR)', value: 'KR' }, { name: 'Latin America North (LA1)', value: 'LA1' }, { name: 'Latin America South (LA2)', value: 'LA2' }, { name: 'North America (NA1)', value: 'NA1' }, { name: 'Oceania (OC1)', value: 'OC1' }, { name: 'The Philippines (PH2)', value: 'PH2' }, { name: 'Russia (RU)', value: 'RU' }, { name: 'Singapore, Malaysia & Indonesia (SG2)', value: 'SG2' }, { name: 'Thailand (TH2)', value: 'TH2' }, { name: 'Turkey (TR1)', value: 'TR1' }, { name: 'Taiwan, Hong Kong & Macao (TW2)', value: 'TW2' }, { name: 'Vietnam (VN2)', value: 'VN2' }).setRequired(true)),
	cooldown: '5',
	category: 'Fun',
	guildOnly: false,
	async execute (interaction) {
		const summonerName = interaction.options.getString('name');
		const summonerRegion = interaction.options.getString('region');

		const League = await fetch(`https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${process.env.RIOTGAMES_API_KEY}`)
			.then(res => res.json());

			if (!League.name) return interaction.reply({ content: 'Error: No such summoner name found.', ephemeral: true });

			const lastUpdated = new Date(League.revisionDate).toLocaleString('en-US', { timeZone: 'UTC' });

		const embed = new EmbedBuilder()
			.setTitle(`${League.name}`)
			.setFields(
				{ name: 'Level', value: `${League.summonerLevel}`, inline: true },
				{ name: 'Region', value: `${summonerRegion}` },
				{ name: 'Last Updated', value: `${lastUpdated}` }
			)
			.setFooter({ text: 'Powered by Riot Games' })
			.setColor('#eb0029');

		return interaction.reply({ embeds: [embed] });
	}
};