const { SlashCommandBuilder } = require('discord.js');
const noAPIKey = require('../errors/noAPIKey.js');
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
        const queryField = interaction.options.getString('query');

            if (process.env.GIPHY_API_KEY === '') return interaction.reply({ embeds: [noAPIKey], ephemeral: true });

        const Gif = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&limit=1&q=${encodeURIComponent(queryField)}`)
            .then(res => res.json())
            .then(body => body.data[0]);

        if (!Gif) return interaction.reply({ content: 'Error: No results found.' });

            return interaction.reply({ content: `${Gif.embed_url}` });
        }
};