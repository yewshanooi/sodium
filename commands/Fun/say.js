const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { connect } = require('mongoose');

module.exports = {
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

    cooldown: '3',
    category: 'Fun',
    guildOnly: true,

    async execute(interaction) {
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

        const row = new ActionRowBuilder().addComponents(button);

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

            const webhooks = await interaction.channel.fetchWebhooks();
            let webhook = webhooks.find(wh => wh.owner.id === interaction.client.user.id);
            if (!webhook) {
                webhook = await interaction.channel.createWebhook({
                    name: 'Say Webhook',
                    avatar: interaction.client.user.displayAvatarURL(),
                });
            }

            await webhook.send({
                content: message,
                username: targetUser.displayName,
                avatarURL: targetUser.displayAvatarURL({ dynamic: true }),
                components: [row]
            });

            await interaction.reply({ content: 'Message sent.', ephemeral: true });
        } catch (error) {
            console.error('Error in /say:', error);
            await interaction.reply({ content: 'There was an error trying to send the message.', ephemeral: true });
        }
    }
};
