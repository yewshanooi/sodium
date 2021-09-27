const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor, geniusAPIKey } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Get a song\'s lyrics from Genius.')
        .addStringOption(option => option.setName('song').setDescription('Enter a song name').setRequired(true)),
    cooldown: '10',
    guildOnly: false,
    async execute (interaction) {
        const stringField = interaction.options.getString('song');

        const hits = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(stringField)}`, {
          headers: { 'Authorization': `Bearer ${geniusAPIKey}` }
        })
          .then(res => res.json())
          .then(body => body.response.hits);

        if (!hits.length) return interaction.reply('Error: No results found.');

        const { url } = hits[0].result;
        const image = hits[0].result.song_art_image_thumbnail_url;
        const desc = hits[0].result.full_title;

        const embed = new MessageEmbed()
            .setTitle('Lyrics')
            .setDescription(`${desc}`)
            .setImage(`${image}`)
            .setColor(embedColor);

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                .setURL(`${url}`)
                .setLabel('View Lyrics')
                .setStyle('LINK'));

        return interaction.reply({ embeds: [embed], components: [button] });
      }
};