const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const dotenv = require('dotenv');
    dotenv.config();
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Get a song\'s lyrics from Genius')
        .addStringOption(option => option.setName('song').setDescription('Enter a song name').setRequired(true)),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const stringField = interaction.options.getString('song');

        const hits = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(stringField)}&access_token=${process.env.GENIUS_API_KEY}`)
            .then(res => res.json())
            .then(body => body.response.hits);

        if (!hits.length) return interaction.reply({ content: 'Error: No results found.' });

        const embed = new MessageEmbed()
            .setTitle(`${hits[0].result.title}`)
            .setDescription(`by ${hits[0].result.artist_names}`)
            .setImage(`${hits[0].result.song_art_image_thumbnail_url}`)
            .setColor(embedColor);

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                .setURL(`${hits[0].result.url}`)
                .setLabel('View Lyrics')
                .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};