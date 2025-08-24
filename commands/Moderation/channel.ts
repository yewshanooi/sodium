import { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Delete, lock, rename, or unlock a channel')
        .addSubcommand(subcommand => subcommand.setName('delete').setDescription('Delete the selected channel')
            .addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('lock').setDescription('Lock the current channel'))
        .addSubcommand(subcommand => subcommand.setName('rename').setDescription('Rename the current channel')
            .addStringOption(option => option.setName('name').setDescription('Enter a name (max 100 characters)').setMaxLength(100).setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('unlock').setDescription('Unlock the current channel')),
    cooldown: 15,
    category: 'Moderation',
    guildOnly: true,
	execute: (client, interaction) => {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Channels** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [client.errors.noPermission] });

        const channelField = interaction.options.getChannel('channel');
        const nameField = interaction.options.getString('name');

        const currentChannel = interaction.channel;

        // channel delete Subcommand
        if (interaction.options.getSubcommand() === 'delete') {
            if (channelField === interaction.channel) {
                const userDmEmbed = new EmbedBuilder()
                    .setDescription(`Successfully deleted **#${channelField.name}** channel in **${interaction.guild.name}** guild`)
                    .setColor(client.embedColor as any);

                interaction.user.send({ embeds: [userDmEmbed] })
                    .then(() => {
                        channelField.delete();
                    })
                    .catch(() => {
                        interaction.reply({ embeds: [client.errors.noPrivateDM] });
                    });
            } else {
                const deleteEmbed = new EmbedBuilder()
                    .setDescription(`Successfully deleted **#${channelField.name}** channel`)
                    .setColor(client.embedColor as any);

                interaction.reply({ embeds: [deleteEmbed] }).then(() => {channelField.delete();});
            }
        }

        // channel lock Subcommand
        if (interaction.options.getSubcommand() === 'lock') {
            const lockEmbed = new EmbedBuilder()
                .setDescription(`Successfully locked ${currentChannel} channel`)
                .setColor(client.embedColor as any);

            interaction.reply({ embeds: [lockEmbed] }).then(() => {
                if (!currentChannel || !('permissionOverwrites' in currentChannel)) return;
                interaction.guild.roles.cache.forEach(role => {
                    (currentChannel as any).permissionOverwrites.edit(role, { SendMessages: false, AddReactions: false, CreatePublicThreads: false });
                });
            });
        }

        // channel rename Subcommand
        if (interaction.options.getSubcommand() === 'rename') {
            const renameEmbed = new EmbedBuilder()
                .setDescription(`Successfully renamed channel to **${nameField}**`)
                .setColor(client.embedColor as any);
            interaction.reply({ embeds: [renameEmbed] }).then(() => {
                interaction.channel.setName(nameField);
            });
        }

        // channel unlock Subcommand
        if (interaction.options.getSubcommand() === 'unlock') {
            const unlockEmbed = new EmbedBuilder()
                .setDescription(`Successfully unlocked ${currentChannel} channel`)
                .setColor(client.embedColor as any);

            interaction.reply({ embeds: [unlockEmbed] }).then(() => {
                if (!currentChannel || !('permissionOverwrites' in currentChannel)) return;
                interaction.guild.roles.cache.forEach(role => {
                    (currentChannel as any).permissionOverwrites.edit(role, { SendMessages: true, AddReactions: true, CreatePublicThreads: true });
                });
            });
        }

    }
} as Command;

/*
 * channel lock & unlock Subcommand will override every existing role permissions.
 * channel rename Subcommand might crash the bot if executed frequently.
 */