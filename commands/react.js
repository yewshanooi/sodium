const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'react',
    description: 'Reacts then reply to your message',
    usage: 'react',
    cooldown: '0',
    execute (message) {
        const embed = new MessageEmbed()
            .setDescription('Hey there, Im a bot created by **JavaRuntime**!')
            .setColor(embedColor);
        message.react('😄').then(message.channel.send(embed));
    }
};