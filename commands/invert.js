const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'invert',
    description: 'Reverses your text',
    usage: 'invert {text}',
    cooldown: '5',
    execute (message, args) {
        const text = args.join(' ').split('').reverse().join('');
        if (!text) return message.channel.send('Error: Please enter text to invert.');
            const embed = new MessageEmbed()
              .setTitle('Inverted Text')
              .setDescription(`${text}`)
              .setColor(embedColor);
          message.channel.send(embed);
        }
};