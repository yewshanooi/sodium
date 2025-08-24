import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import { connect } from 'mongoose';

export default {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Send a custom message, optionally impersonating another user.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('spoiler')
                .setDescription('Mark the message as a spoiler?')
                .addChoices(
                    { name: 'No', value: 'false' },
                    { name: 'Yes', value: 'true' }
                )
                .setRequired(false))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Optional user to impersonate.')
                .setRequired(false)),

    cooldown: 3,
    category: 'Fun',
    guildOnly: true,
    execute: async (client, interaction) => {
        const messageField = interaction.options.getString('message');
        const spoilerField = interaction.options.getString('spoiler') || 'false';
        const targetUser = interaction.options.getUser('user');

        const message = spoilerField === 'true'
            ? `||${messageField}||`
            : messageField;

        // Button that shows who actually sent the command
        const button = new ButtonBuilder()
            .setCustomId('sender')
            .setLabel(`Sent by ${interaction.user.username}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        if (!targetUser) {
            return interaction.reply({ content: message, components: [row] });
        }

        if (targetUser.bot) {
            return interaction.reply({ content: 'You cannot impersonate a bot.', ephemeral: true });
        }

        try {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                return interaction.reply({ content: 'You do not have permission to impersonate users.', ephemeral: true });
            }

            const channel = interaction.channel;
            if (!channel || !('fetchWebhooks' in channel) || typeof (channel as any).fetchWebhooks !== 'function') {
                return interaction.reply({ content: 'Cannot access webhooks in this channel.', ephemeral: true });
            }

            const webhooks = await (channel as any).fetchWebhooks();
            let webhook = webhooks.find(wh => wh.owner?.id === interaction.client.user.id);
            if (!webhook) {
                webhook = await (channel as any).createWebhook({
                    name: 'Say Webhook',
                    avatar: interaction.client.user.displayAvatarURL(),
                });
            }

            await webhook.send({
                content: message,
                username: targetUser.displayName,
                avatarURL: targetUser.displayAvatarURL(),
                components: [row]
            });

            await interaction.reply({ content: 'Message sent.', ephemeral: true });
        } catch (error) {
            console.error('Error in /say:', error);
            await interaction.reply({ content: 'There was an error trying to send the message.', ephemeral: true });
        }
    }
} as Command;
