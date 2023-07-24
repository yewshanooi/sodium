const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('animequote')
		.setDescription('Get a random anime quote'),
	cooldown: '5',
	category: 'Fun',
	guildOnly: false,
	async execute (interaction, configuration) {
        const Quote = await fetch('https://animechan.xyz/api/random')
            .then(res => res.json());

        const embed = new EmbedBuilder()
            .setTitle('Anime Quote')
            .addFields(
                { name: 'Anime', value: `${Quote.anime}` },
                { name: 'Character', value: `${Quote.character}` },
                { name: 'Quote', value: `${Quote.quote}` }
            )
            .setColor(configuration.embedColor);

        return interaction.reply({ embeds: [embed] });
	}
};