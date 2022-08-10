const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('word')
        .setDescription('Get a random word with its definition and pronunciation'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction, configuration, errors) {
        const Word = await fetch('https://random-words-api.vercel.app/word')
            .then(res => res.json());

            const embed = new EmbedBuilder()
                .setTitle(`${Word[0].word}`)
                .addFields(
                    { name: 'Definition', value: `${Word[0].definition}` },
                    { name: 'Pronunciation', value: `${Word[0].pronunciation}` }
                )
                .setColor(configuration.embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};