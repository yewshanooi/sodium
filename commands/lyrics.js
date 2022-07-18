const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const noAPIKey = require('../errors/noAPIKey.js');
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
        const songField = interaction.options.getString('song');

            if (process.env.GENIUS_API_KEY === '') return interaction.reply({ embeds: [noAPIKey], ephemeral: true });

        const Song = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(songField)}&access_token=${process.env.GENIUS_API_KEY}`)
            .then(res => res.json())
            .then(body => body.response.hits);

        if (!Song.length) return interaction.reply({ content: 'Error: No results found.' });

        const embed = new MessageEmbed()
            .setTitle(`${Song[0].result.title}`)
            .setDescription(`by ${Song[0].result.artist_names}`)
            .setImage(`${Song[0].result.song_art_image_thumbnail_url}`)
            .setFooter({ text: 'Powered by Genius' })
            .setColor('#ffff64');

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL(`${Song[0].result.url}`)
                    .setLabel('View lyrics')
                    .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};