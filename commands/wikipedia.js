const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wikipedia')
        .setDescription('Finds a Wikipedia article by title')
        .addStringOption(option => option.setName('title').setDescription('Enter an article title').setRequired(true)),
    cooldown: '10',
    guildOnly: false,
    async execute (interaction) {
        const titleField = interaction.options.getString('title');

        const article = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titleField)}`)
            .then(res => res.json())
            .catch(() => interaction.reply('Error: No article found with that title.'));

        if (!article.content_urls) return interaction.reply('Error: No article found with that title.');

        const embed = new MessageEmbed()
            .setTitle(article.title)
            .setDescription(article.extract)
            .setColor(embedColor);

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL(article.content_urls.desktop.page)
                    .setLabel('Read More')
                    .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};