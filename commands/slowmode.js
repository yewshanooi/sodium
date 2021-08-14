const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'slowmode',
    description: 'Enable slowmode for the current channel',
    usage: 'slowmode {seconds}',
    cooldown: '15',
    guildOnly: true,
    execute (message, args) {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send('Error: You have no permission to use this command.');

        const duration = parseInt(args[0]);
            if (isNaN(duration)) return message.channel.send('Error: Please provide an integer.');
            if (duration < 0 || duration > '21600') return message.channel.send('Error: You need to input a number between `0` and `21600`.');

        const embed = new MessageEmbed()
            .setTitle('Channel Slowmode')
            .setDescription(`Successfully set slowmode to **${duration}** second(s)`)
            .setTimestamp()
            .setColor(embedColor);
        message.channel.send({ embeds: [embed] }).then(message.channel.setRateLimitPerUser(duration));
    }
};