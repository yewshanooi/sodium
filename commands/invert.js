const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'invert',
    description: 'Reverses your text',
    usage: 'invert {text}',
    cooldown: '5',
    execute (message, args) {
        const original = args.join(' ');
        const inverted = args.join(' ').split('').reverse().join('');
          if (!inverted) return message.channel.send('Error: Please provide a valid text.');
            const embed = new MessageEmbed()
              .setTitle('Text Inverter')
              .addField('Original', original)
              .addField('Inverted', inverted)
              .setColor(embedColor);
          message.channel.send(embed);
        }
};