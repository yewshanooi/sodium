import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    apis: ['NASA_API_KEY'],
    data: new SlashCommandBuilder()
        .setName('nasa')
        .setDescription('View the Astronomy Picture of the Day (APOD) from NASA'),
    cooldown: 25,
    category: 'Fun',
    guildOnly: false,
    execute: async (client, interaction) => {
        if (!process.env.NASA_API_KEY) return interaction.reply({ embeds: [client.errors.noAPIKey] });

        const Nasa: any = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
            .then(res => res.json());

        if (!Nasa.explanation) return interaction.reply({ content: 'Error: An error has occurred while trying to get the image.' });

        const embed = new EmbedBuilder()
            .setTitle(`${Nasa.title}`)
            .setDescription(`${Nasa.explanation}`)
            .setImage(`${Nasa.url}`)
            .setFooter({ text: 'Powered by NASA' })
            .setColor('#0b3d91');

            const button = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(new ButtonBuilder()
                    .setURL(`${Nasa.hdurl}`)
                    .setLabel('View source')
                    .setStyle(ButtonStyle.Link));

            return interaction.reply({ embeds: [embed], components: [button || button.toJSON()] });
        }
} as Command;