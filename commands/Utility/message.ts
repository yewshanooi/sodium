import { EmbedBuilder, SlashCommandBuilder, MessageFlags } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Sends a Direct Message to the selected user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true)),
    cooldown: 8,
    category: 'Utility',
    guildOnly: true,
    execute: (client, interaction) => {
		const userField = interaction.options.getUser('user');
            if (userField === interaction.client.user) return interaction.reply({ content: 'Error: You cannot send a message to the bot.' });
            if (userField.bot === true) return interaction.reply({ content: 'Error: You cannot send a message to a bot.' });

            if (userField === interaction.user) return interaction.reply({ content: 'Error: You cannot send a message to yourself.' });

        const messageField = interaction.options.getString('message');

            const embed = new EmbedBuilder()
                .setTitle('Message')
                .setDescription(`${messageField}\n\n*from \`${interaction.user.username}\`*`)
                .setColor(client.embedColor as any);

            const successEmbed = new EmbedBuilder()
                .setDescription(`Successfully send message to ${userField}`)
                .setColor(client.embedColor as any);

        userField.send({ embeds: [embed] })
            .then(() => {
                interaction.reply({ embeds: [successEmbed], flags: MessageFlags.Ephemeral });
            })
            .catch(() => {
                interaction.reply({ embeds: [client.errors.noPrivateDM] });
            });
        }
} as Command;