const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channelunlock')
        .setDescription('Unlock the current channel'),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_CHANNELS** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

        const currentChannel = interaction.channel;

            const embed = new MessageEmbed()
                .setDescription(`Successfully unlocked ${currentChannel} channel`)
                .setColor(embedColor);

            interaction.reply({ embeds: [embed] }).then(interaction.guild.roles.cache.forEach(roles => {
                currentChannel.permissionOverwrites.edit(roles, { SEND_MESSAGES: true, ADD_REACTIONS: true, CREATE_PUBLIC_THREADS: true });
            }));
        }
};

// Current command will override every existing role permissions.