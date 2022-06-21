const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wikipedia')
        .setDescription('Find an article on Wikipedia')
        .addStringOption(option => option.setName('title').setDescription('Enter an article title').setRequired(true)),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const titleField = interaction.options.getString('title');

        const Article = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titleField)}`)
            .then(res => res.json())
            .catch(() => interaction.reply({ content: 'Error: No article found with that title.' }));

        if (!Article.content_urls) return interaction.reply({ content: 'Error: No article found with that title.' });

        const embed = new MessageEmbed()
            .setTitle(`${Article.title}`)
            .setDescription(`${Article.extract}`)
            .setFooter({ text: 'Powered by Wikipedia' })
            .setColor('#ffffff');

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL(`${Article.content_urls.desktop.page}`)
                    .setLabel('Read more')
                    .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};