const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'channellock',
    description: 'Locks the current channel',
    usage: 'channellock',
    cooldown: '25',
    guildOnly: true,
    execute (message) {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send('Error: You have no permission to use this command.');

        const currentChannel = message.channel;

            const embed = new MessageEmbed()
                .setTitle('Channel Lock')
                .setDescription(`Successfully locked channel ${currentChannel}`)
                .setTimestamp()
                .setColor(embedColor);

            message.channel.send({ embeds: [embed] }).then(message.guild.roles.cache.forEach(role => {
                currentChannel.permissionOverwrites.create(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            }));
    }
};