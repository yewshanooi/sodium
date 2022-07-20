const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor } = require('../config.json');
const noPermission = require('../errors/noPermission.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channellock')
        .setDescription('Lock the current channel'),
    cooldown: '15',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.guild.members.me.permissions.has('ManageChannels')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Channels** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageChannels')) return interaction.reply({ embeds: [noPermission] });

        const currentChannel = interaction.channel;

            const embed = new EmbedBuilder()
                .setDescription(`Successfully locked ${currentChannel} channel`)
                .setColor(embedColor);

            interaction.reply({ embeds: [embed] }).then(interaction.guild.roles.cache.forEach(roles => {
                currentChannel.permissionOverwrites.edit(roles, { SendMessages: false, AddReactions: false, CreatePublicThreads: false });
            }));
        }
};

// Current command will override every existing role permissions.