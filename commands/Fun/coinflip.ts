import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a two-sided coin'),
    cooldown: 3,
    category: 'Fun',
    guildOnly: false,
    execute: (client, interaction) => {
        const coinFlip = Math.floor(Math.random() * 2);
        let resultCoinFlip;
            if (coinFlip === 1) resultCoinFlip = 'heads';
            else resultCoinFlip = 'tails';

        const embed = new EmbedBuilder()
            .setDescription('*Flipping coin..*')
            .setColor(client.embedColor as any);
        interaction.reply({ embeds: [embed], fetchReply: true }).then(() => {
            const newEmbed = new EmbedBuilder()
                .setTitle('Coin Flip')
                .setDescription(`${interaction.user} flipped **${resultCoinFlip}**`)
                .setColor(client.embedColor as any);
            interaction.editReply({ embeds: [newEmbed] });
        });

	}
} as Command;