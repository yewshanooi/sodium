const { SlashCommandBuilder } = require('@discordjs/builders');
const dotenv = require('dotenv');
    dotenv.config();
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giphy')
        .setDescription('Search a GIF from Giphy')
        .addStringOption(option => option.setName('query').setDescription('Enter a query').setRequired(true)),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const stringField = interaction.options.getString('query');

        const data = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&limit=1&q=${encodeURIComponent(stringField)}`)
            .then(res => res.json())
            .then(body => body.data[0]);

        if (!data) return interaction.reply({ content: 'Error: No results found.' });

            return interaction.reply({ content: `${data.embed_url}` });
      }
};