const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uselessfact')
        .setDescription('Get a random meaningless fact'),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction, configuration) {
        const Fact = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en')
            .then(res => res.json());

            const embed = new EmbedBuilder()
                .setTitle('Useless Fact')
                .setDescription(`${Fact.text}`)
                .setColor(configuration.embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};