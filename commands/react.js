const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'react',
    description: 'Reacts then reply to your message',
    cooldown: '0',
    execute (message) {
        message.react('😄');
        const embed = new MessageEmbed()
            .setTitle('Hey there!')
            .setColor(embedColor);
        message.channel.send(embed);
    }
};