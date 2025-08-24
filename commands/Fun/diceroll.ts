import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName('diceroll')
        .setDescription('Roll a dice that has six sides'),
    cooldown: 3,
    category: 'Fun',
    guildOnly: false,
    execute: (client, interaction) => {
        const diceRoll = Math.floor(Math.random() * 6 + 1);

        const embed = new EmbedBuilder()
            .setDescription('*Rolling dice..*')
            .setColor(client.embedColor as any);
        interaction.reply({ embeds: [embed], fetchReply: true }).then(() => {
            const newEmbed = new EmbedBuilder()
                .setTitle('Dice Roll')
                .setDescription(`${interaction.user} rolled a **${diceRoll}**!`)
                .setColor(client.embedColor as any);
            interaction.editReply({ embeds: [newEmbed] });
        });

    }
} as Command;