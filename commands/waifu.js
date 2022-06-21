const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Get random anime waifu images'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const Anime = await fetch('https://nekos.best/api/v1/nekos')
            .then(res => res.json());

        const embed = new MessageEmbed()
            .setTitle('Waifu')
            .setImage(`${Anime.url}`)
            .setFooter({ text: `by ${Anime.artist_name}` })
            .setColor(embedColor);

            const buttons = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL(`${Anime.artist_href}`)
                    .setLabel('Artist')
                    .setStyle('LINK'))
                .addComponents(new MessageButton()
                    .setURL(`${Anime.source_url}`)
                    .setLabel('View source')
                    .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [buttons] });
        }
};