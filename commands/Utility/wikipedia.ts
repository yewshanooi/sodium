import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('wikipedia')
        .setDescription('Find an article on Wikipedia')
        .addStringOption(option => option.setName('title').setDescription('Enter an article title').setRequired(true)),
    cooldown: 5,
    category: 'Utility',
    guildOnly: false,
    execute: async (client, interaction) => {
        const titleField = interaction.options.getString('title');

        const Article: any = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titleField)}`)
            .then(res => res.json())
            .catch(() => interaction.reply({ content: 'Error: No article found with that title.' }));

        if (!Article.content_urls) return interaction.reply({ content: 'Error: No article found with that title.' });

        const embed = new EmbedBuilder()
            .setTitle(`${Article.title}`)
            .setDescription(`${Article.extract}`)
            .setFooter({ text: 'Powered by Wikipedia' })
            .setColor('#ffffff');

            const button = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(new ButtonBuilder()
                    .setURL(`${Article.content_urls.desktop.page}`)
                    .setLabel('View article')
                    .setStyle(ButtonStyle.Link));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
} as Command;