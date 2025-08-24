import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    apis: ['GIPHY_API_KEY'],
    data: new SlashCommandBuilder()
        .setName('giphy')
        .setDescription('Search Giphy for a GIF')
        .addStringOption(option => option.setName('query').setDescription('Enter a query').setRequired(true)),
    cooldown: 5,
    category: 'Fun',
    guildOnly: false,
    execute: async (client, interaction) => {
        if (!process.env.GIPHY_API_KEY) return interaction.reply({ embeds: [client.errors.noAPIKey] });

        const queryField = interaction.options.getString('query');

        const randomGif = Math.floor(Math.random() * 19);

        const Gif = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${encodeURIComponent(queryField)}&limit=1&offset=${randomGif}`)
            .then(res => res.json())
            .then((body: any) => body.data[0]);

            if (!Gif) return interaction.reply({ content: 'Error: No results found.' });

            const embed = new EmbedBuilder()
                .setTitle(`${Gif.title}`)
                .setImage(`${Gif.images.original.url}`)
                .setFooter({ text: 'Powered by Giphy' })
                .setColor('#000000');

            return interaction.reply({ embeds: [embed] });
        }
} as Command;