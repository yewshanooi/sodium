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
        const repositoryField = interaction.options.getString('repository');

        const Github = await fetch(`https://api.github.com/repos/${userField}/${repositoryField}`)
            .then(res => res.ok && res.json())
            .catch(() => null);

            if (!Github) return interaction.reply({ content: 'Error: No repository found.' });

        const size = Github.size <= 1024 ? `${Github.size} KB` : Math.floor(Github.size / 1024) > 1024 ? `${(Github.size / 1024 / 1024).toFixed(2)} GB` : `${(Github.size / 1024).toFixed(2)} MB`;
        const footer = [];
            if (Github.fork) footer.push(`Forked from ${Github.parent.full_name}`);
            if (Github.archived) footer.push('This repository is Archived');

            const embed = new MessageEmbed()
                .setTitle(`${Github.full_name}`)
                .setThumbnail(`${Github.owner.avatar_url}`)
                .setDescription(`${Github.description || 'No Description'}`)
                .addFields(
                    { name: 'Language', value: `\`${Github.language || 'None'}\``, inline: true },
                    { name: 'Forks', value: `\`${Github.forks_count.toLocaleString()}\``, inline: true },
                    { name: 'License', value: `\`${Github.license && Github.license.name || 'None'}\``, inline: true },
                    { name: 'Open Issues', value: `\`${Github.open_issues.toLocaleString()}\``, inline: true },
                    { name: 'Watchers', value: `\`${Github.subscribers_count.toLocaleString()}\``, inline: true },
                    { name: 'Stars', value: `\`${Github.stargazers_count.toLocaleString()}\``, inline: true },
                    { name: 'Size', value: `\`${size}\``, inline: true }
                )
                .setFooter({ text: `${footer.length ? `\n${footer.join('\n')}` : ''}` })
                .setColor(embedColor);

            const githubDevUrl = `https://github.dev/${Github.full_name}`;

                const buttons = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setURL(`${Github.html_url}`)
                        .setLabel('View repository')
                        .setStyle('LINK'))
                    .addComponents(new MessageButton()
                        .setURL(`${githubDevUrl}`)
                        .setLabel('Edit on github.dev')
                        .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [buttons] });
      }
};