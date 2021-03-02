const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'coinflip',
    description: 'Flips a coin',
    cooldown: '3',
    execute (message) {
        const flip = Math.floor(Math.random() * 2);
        let result;
        if (flip === 1) result = 'heads';
        else result = 'tails';
            const embed = new MessageEmbed()
            .setTitle('Coinflip')
            .setDescription(`I flipped a coin for you, ${message.member}. It was **${result}**!`)
            .setColor(message.guild.me.displayHexColor);
            message.channel.send(embed);
        }
};