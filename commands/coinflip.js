const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'coinflip',
    description: 'Flips a coin for you',
    usage: 'coinflip',
    cooldown: '5',
    execute (message) {
        const flip = Math.floor(Math.random() * 2);
            let result;
        if (flip === 1) result = 'heads';
            else result = 'tails';
            const embed = new MessageEmbed()
                .setTitle('Coin Flip')
                .setDescription(`I flipped a coin for you, <@${message.author.id}>!\n It was **${result}**.`)
                .setColor(embedColor);
            message.channel.send(embed);
        }
    };