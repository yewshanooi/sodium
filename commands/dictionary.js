const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription('Search the dictionary for a definition')
        .addStringOption(option => option.setName('query').setDescription('Enter a query').setRequired(true)),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const queryField = interaction.options.getString('query');

        const dictionary = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${queryField}`)
            .then(res => res.json());

        if (!dictionary[0]) return interaction.reply({ content: 'Error: No definition found with that query.' });

            const embed = new MessageEmbed()
                .setTitle(`${dictionary[0].word}`)
                .setDescription(`${dictionary[0].phonetics[0].text || ''}`)
                .addFields(
                    { name: 'Part of Speech', value: `${dictionary[0].meanings[0].partOfSpeech}` },
                    { name: 'Definition', value: `${dictionary[0].meanings[0].definitions[0].definition}` },
                    { name: 'Example', value: `${dictionary[0].meanings[0].definitions[0].example || 'None'}` }
                )
                .setColor(embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};