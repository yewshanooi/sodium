const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const noPermission = require('../errors/noPermission.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channellock')
        .setDescription('Lock the current channel'),
    cooldown: '15',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_CHANNELS** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ embeds: [noPermission] });

        const currentChannel = interaction.channel;

            const embed = new MessageEmbed()
                .setDescription(`Successfully locked ${currentChannel} channel`)
                .setColor(embedColor);

            interaction.reply({ embeds: [embed] }).then(interaction.guild.roles.cache.forEach(roles => {
                currentChannel.permissionOverwrites.edit(roles, { SEND_MESSAGES: false, ADD_REACTIONS: false, CREATE_PUBLIC_THREADS: false });
            }));
        }
};