const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('View a GitHub repository details')
        .addStringOption(option => option.setName('user').setDescription('Enter a user').setRequired(true))
        .addStringOption(option => option.setName('repository').setDescription('Enter a repository').setRequired(true)),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const userField = interaction.options.getString('user');
        const repoField = interaction.options.getString('repository');

        const body = await fetch(`https://api.github.com/repos/${userField}/${repoField}`)
            .then(res => res.ok && res.json())
            .catch(() => null);

            if (!body) return interaction.reply({ content: 'Error: No repository found.' });

        const size = body.size <= 1024 ? `${body.size} KB` : Math.floor(body.size / 1024) > 1024 ? `${(body.size / 1024 / 1024).toFixed(2)} GB` : `${(body.size / 1024).toFixed(2)} MB`;
        const footer = [];
            if (body.fork) footer.push(`Forked from ${body.parent.full_name}`);
            if (body.archived) footer.push('This repository is Archived');

            const embed = new MessageEmbed()
                .setTitle(`${body.full_name}`)
                .setThumbnail(`${body.owner.avatar_url}`)
                .setDescription(`${body.description || 'No Description'}`)
                .addFields(
                    { name: 'Language', value: `\`${body.language || 'None'}\``, inline: true },
                    { name: 'Forks', value: `\`${body.forks_count.toLocaleString()}\``, inline: true },
                    { name: 'License', value: `\`${body.license && body.license.name || 'None'}\``, inline: true },
                    { name: 'Open Issues', value: `\`${body.open_issues.toLocaleString()}\``, inline: true },
                    { name: 'Watchers', value: `\`${body.subscribers_count.toLocaleString()}\``, inline: true },
                    { name: 'Stars', value: `\`${body.stargazers_count.toLocaleString()}\``, inline: true },
                    { name: 'Size', value: `\`${size}\``, inline: true }
                )
                .setFooter({ text: `${footer.length ? `\n${footer.join('\n')}` : ''}` })
                .setColor(embedColor);

            const devURL = `https://github.dev/${body.full_name}`;

                const buttons = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setURL(`${body.html_url}`)
                        .setLabel('View Repository')
                        .setStyle('LINK'))
                    .addComponents(new MessageButton()
                        .setURL(`${devURL}`)
                        .setLabel('Edit on github.dev')
                        .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [buttons] });
      }
};