const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Get anime pictures from nekos.best'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const anime = await fetch('https://nekos.best/api/v1/nekos')
            .then(res => res.json());

            const embed = new MessageEmbed()
                .setTitle('Waifu')
                .setImage(`${anime.url}`)
                .setFooter(`by ${anime.artist_name}`)
                .setColor(embedColor);

                const button = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setURL(`${anime.artist_href}`)
                        .setLabel('Artist')
                        .setStyle('LINK'))
                    .addComponents(new MessageButton()
                        .setURL(`${anime.source_url}`)
                        .setLabel('Source URL')
                        .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};