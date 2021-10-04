/* eslint-disable no-nested-ternary */
/* eslint-disable no-ternary */
/* eslint-disable multiline-ternary */

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
    cooldown: '10',
    guildOnly: false,
    async execute (interaction) {
        const userField = interaction.options.getString('user');
        const repoField = interaction.options.getString('repository');

        const body = await fetch(`https://api.github.com/repos/${userField}/${repoField}`)
            .then(res => res.ok && res.json())
            .catch(() => null);

            if (!body) return interaction.reply('Error: No repository found.');

        const size = body.size <= 1024 ? `${body.size} KB` : Math.floor(body.size / 1024) > 1024 ? `${(body.size / 1024 / 1024).toFixed(2)} GB` : `${(body.size / 1024).toFixed(2)} MB`;
        const license = body.license && body.license.name && body.license.url ? `[${body.license.name}](${body.license.url})` : body.license && body.license.name || 'None';
        const footer = [];
            if (body.fork) footer.push(`• **Forked** from [${body.parent.full_name}](${body.parent.html_url})`);
            if (body.archived) footer.push('• This repository is **Archived**');

            const embed = new MessageEmbed()
                .setTitle(body.full_name)
                .setThumbnail(body.owner.avatar_url)
                .setDescription(`${body.description || 'No Description.'}\n\n**Language:** ${body.language}\n**Forks:** ${body.forks_count.toLocaleString()}\n**License:** ${license}\n**Open Issues:** ${body.open_issues.toLocaleString()}\n**Watchers:** ${body.subscribers_count.toLocaleString()}\n**Stars:** ${body.stargazers_count.toLocaleString()}\n**Size:** ${size}${footer.length ? `\n${footer.join('\n')}` : ''}`)
                .setColor(embedColor);

                const button = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setURL(body.html_url)
                        .setLabel('View Repository')
                        .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [button] });
      }
};