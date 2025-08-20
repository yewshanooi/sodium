const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Delete, lock, rename, or unlock a channel')
        .addSubcommand(subcommand => subcommand.setName('delete').setDescription('Delete the selected channel')
            .addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('lock').setDescription('Lock the current channel'))
        .addSubcommand(subcommand => subcommand.setName('rename').setDescription('Rename the current channel')
            .addStringOption(option => option.setName('name').setDescription('Enter a name (max 100 characters)').setMaxLength(100).setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('unlock').setDescription('Unlock the current channel')),
    cooldown: '15',
    category: 'Moderation',
    guildOnly: true,
	execute (interaction, configuration) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Channels** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [global.errors[2]] });

        const channelField = interaction.options.getChannel('channel');
        const nameField = interaction.options.getString('name');

        const currentChannel = interaction.channel;

        // channel delete Subcommand
        if (interaction.options.getSubcommand() === 'delete') {
            if (channelField === interaction.channel) {
                const userDmEmbed = new EmbedBuilder()
                    .setDescription(`Successfully deleted **#${channelField.name}** channel in **${interaction.guild.name}** guild`)
                    .setColor(configuration.embedColor);

                interaction.user.send({ embeds: [userDmEmbed] })
                    .then(() => {
                        channelField.delete();
                    })
                    .catch(() => {
                        interaction.reply({ embeds: [global.errors[3]] });
                    });
            } else {
                const deleteEmbed = new EmbedBuilder()
                    .setDescription(`Successfully deleted **#${channelField.name}** channel`)
                    .setColor(configuration.embedColor);

                interaction.reply({ embeds: [deleteEmbed] }).then(channelField.delete());
            }
        }

        // channel lock Subcommand
        if (interaction.options.getSubcommand() === 'lock') {
            const lockEmbed = new EmbedBuilder()
                .setDescription(`Successfully locked ${currentChannel} channel`)
                .setColor(configuration.embedColor);

            interaction.reply({ embeds: [lockEmbed] }).then(interaction.guild.roles.cache.forEach(roles => {
                currentChannel.permissionOverwrites.edit(roles, { SendMessages: false, AddReactions: false, CreatePublicThreads: false });
            }));
        }

        // channel rename Subcommand
        if (interaction.options.getSubcommand() === 'rename') {
            const renameEmbed = new EmbedBuilder()
                .setDescription(`Successfully renamed channel to **${nameField}**`)
                .setColor(configuration.embedColor);
            interaction.reply({ embeds: [renameEmbed] }).then(interaction.channel.setName(nameField));
        }

        // channel unlock Subcommand
        if (interaction.options.getSubcommand() === 'unlock') {
            const unlockEmbed = new EmbedBuilder()
                .setDescription(`Successfully unlocked ${currentChannel} channel`)
                .setColor(configuration.embedColor);

            interaction.reply({ embeds: [unlockEmbed] }).then(interaction.guild.roles.cache.forEach(roles => {
                currentChannel.permissionOverwrites.edit(roles, { SendMessages: true, AddReactions: true, CreatePublicThreads: true });
            }));
        }

    }
};

/*
 * channel lock & unlock Subcommand will override every existing role permissions.
 * channel rename Subcommand might crash the bot if executed frequently.
 */