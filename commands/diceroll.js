const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'diceroll',
	description: 'Rolls a random dice with x amount of sides',
	cooldown: '5',
	usage: '{sides}',
	execute (message, args) {
		let [limit] = args;
        if (!limit) limit = 6;
        const rand = Math.floor(Math.random() * limit + 1);
        if (!rand || limit <= 0) return message.channel.send('Please provide a valid number of dice sides.');
            const embed = new MessageEmbed()
            .setTitle('Dice Roll')
            .setDescription(`<@${message.author.id}>, you rolled a **${rand}**!`)
            .setColor(embedColor);
            message.channel.send(embed);
        }
};