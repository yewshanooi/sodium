const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catfact')
        .setDescription('Get a random cat fact'),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction, configuration) {
        const Fact = await fetch('https://catfact.ninja/fact')
            .then(res => res.json());

            const embed = new EmbedBuilder()
                .setTitle('Cat Fact')
                .setDescription(`${Fact.fact}`)
                .setColor(configuration.embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};