import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Get a random color in HEX, RGB, and HSL format'),
    cooldown: 3,
    category: 'Fun',
    guildOnly: false,
    execute: async (client, interaction) => {
        const Color: any = await fetch('https://x-colors.yurace.pro/api/random')
            .then(res => res.json());

        if (Color.hex === '') return interaction.reply({ content: 'Error: There was an error getting a random color.' });
        if (Color.hex.length === 0) return interaction.reply({ content: 'Error: There was an error getting a random color.' });

        const embed = new EmbedBuilder()
            .setTitle('Color')
            .setThumbnail(`https://singlecolorimage.com/get/${Color.hex.replace("#", "")}/100x100`)
            .addFields(
                { name: 'HEX', value: `${Color.hex}` },
                { name: 'RGB', value: `${Color.rgb}` },
                { name: 'HSL', value: `${Color.hsl}` }
            )
            .setColor(`${Color.hex as `#${string}`}`);

        return interaction.reply({ embeds: [embed] });
    }
} as Command;