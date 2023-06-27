const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dogfact')
        .setDescription('Get a random dog fact'),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction, configuration) {
        const Fact = await fetch('https://dogapi.dog/api/v2/facts')
            .then(res => res.json());

            const embed = new EmbedBuilder()
                .setTitle('Dog Fact')
                .setDescription(`${Fact.data[0].attributes.body}`)
                .setColor(configuration.embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};