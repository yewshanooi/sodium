import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('word')
        .setDescription('Get random words')
        .addIntegerOption(option => option.setName('amount').setDescription('Enter an amount (between 1 and 10)').setMinValue(1).setMaxValue(10).setRequired(true)),
    cooldown: 3,
    category: 'Fun',
    guildOnly: false,
	execute: async (client, interaction) => {
        const amountField = interaction.options.getInteger('amount');

        const Word: any = await fetch(`https://random-word-api.vercel.app/api?words=${amountField}&type=capitalized`)
            .then(res => res.json());

            const wordList = Word.join('\n');

            const embed = new EmbedBuilder()
                .setDescription(wordList)
                .setColor(client.embedColor as any);

            if (amountField === 1) {
                embed.setTitle('Word');
            } else {
                embed.setTitle('Words');
            }

            return interaction.reply({ embeds: [embed] });
        }
} as Command;