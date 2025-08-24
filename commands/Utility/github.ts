import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Get the selected GitHub repository details')
        .addStringOption(option => option.setName('user').setDescription('Enter a user').setRequired(true))
        .addStringOption(option => option.setName('repository').setDescription('Enter a repository').setRequired(true)),
    cooldown: 5,
    category: 'Utility',
    guildOnly: false,
    execute: async (client, interaction) => {
        const userField = interaction.options.getString('user');
        const repositoryField = interaction.options.getString('repository');

        const Github: any = await fetch(`https://api.github.com/repos/${userField}/${repositoryField}`)
            .then(res => res.ok && res.json())
            .catch(() => null);

            if (!Github) return interaction.reply({ content: 'Error: No repository found.' });

        const size = Github.size <= 1024 ? `${Github.size} KB` : Math.floor(Github.size / 1024) > 1024 ? `${(Github.size / 1024 / 1024).toFixed(2)} GB` : `${(Github.size / 1024).toFixed(2)} MB`;

            const embed = new EmbedBuilder()
                .setTitle(`${Github.full_name}`)
                .setThumbnail(`${Github.owner.avatar_url}`)
                .setDescription(`${Github.description || 'No Description'}`)
                .addFields(
                    { name: 'Language', value: `\`${Github.language || 'None'}\``, inline: true },
                    { name: 'Forks', value: `\`${Github.forks_count}\``, inline: true },
                    { name: 'License', value: `\`${Github.license && Github.license.name || 'None'}\``, inline: true },
                    { name: 'Open Issues', value: `\`${Github.open_issues}\``, inline: true },
                    { name: 'Watchers', value: `\`${Github.subscribers_count}\``, inline: true },
                    { name: 'Stars', value: `\`${Github.stargazers_count}\``, inline: true },
                    { name: 'Size', value: `\`${size}\``, inline: true }
                )
                .setFooter({ text: 'Powered by GitHub' })
                .setColor('#ffffff');

                if (Github.archived) embed.addFields({ name: 'Archived', value: '`True`', inline: true });
                if (Github.fork) embed.addFields({ name: 'Forked From', value: `\`${Github.parent.full_name}\``, inline: true });

            const githubDevURL = `https://github.dev/${Github.full_name}`;

                const buttons = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setURL(`${Github.html_url}`)
                            .setLabel('View repository')
                            .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                            .setURL(`${githubDevURL}`)
                            .setLabel('Edit on github.dev')
                            .setStyle(ButtonStyle.Link));

            return interaction.reply({ embeds: [embed], components: [buttons] });
      }
} as Command;