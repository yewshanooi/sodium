const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('word')
        .setDescription('Get a random word'),
    cooldown: '3',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction, configuration) {
        const Word = await fetch('https://random-word-api.vercel.app/api?words=1&type=capitalized')
            .then(res => res.json());

            const embed = new EmbedBuilder()
                .setTitle(`${Word}`)
                .setColor(configuration.embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};