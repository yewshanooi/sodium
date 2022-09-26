const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription('Search the dictionary for a definition')
        .addStringOption(option => option.setName('query').setDescription('Enter a query').setRequired(true)),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction, configuration) {
        const queryField = interaction.options.getString('query');

        const Dictionary = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${queryField}`)
            .then(res => res.json());

            if (!Dictionary[0]) return interaction.reply({ content: 'Error: No definition found with that query.' });

            const capitalizedPartOfSpeech = Dictionary[0].meanings[0].partOfSpeech.charAt(0).toUpperCase() + Dictionary[0].meanings[0].partOfSpeech.slice(1);

            const embed = new EmbedBuilder()
                .setTitle(`${Dictionary[0].word}`)
                .addFields(
                    { name: 'Part of Speech', value: `${capitalizedPartOfSpeech}` },
                    { name: 'Definition', value: `${Dictionary[0].meanings[0].definitions[0].definition}` },
                    { name: 'Example', value: `${Dictionary[0].meanings[0].definitions[0].example || 'None'}` }
                )
                .setColor(configuration.embedColor);

            return interaction.reply({ embeds: [embed] });
        }
};