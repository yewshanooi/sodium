const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'react',
    description: 'Reacts then reply to your message',
    usage: 'react',
    cooldown: '0',
    execute (message) {
        const embed = new MessageEmbed()
            .setDescription('Hey there, Im a bot that can react to your message!')
            .setColor(embedColor);
        message.channel.send(embed).then(message.react('😄'));
    }
};