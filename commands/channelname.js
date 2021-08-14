const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'channelname',
    description: 'Renames the current channel',
    usage: 'channelname {name}',
    cooldown: '20',
    guildOnly: true,
    execute (message, args) {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send('Error: You have no permission to use this command.');

        const channelName = args.join(' ');
            if (!channelName) return message.channel.send('Error: Please provide a valid name.');
            if (channelName.length > '100') return message.channel.send('Error: Channel Name must be 100 characters or fewer.');

        const embed = new MessageEmbed()
            .setTitle('Channel Rename')
            .setDescription(`Successfully renamed channel to **${channelName}**`)
            .setTimestamp()
            .setColor(embedColor);
        message.channel.send({ embeds: [embed] }).then(message.channel.setName(channelName));
    }
};