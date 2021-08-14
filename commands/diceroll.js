const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'diceroll',
	description: 'Rolls a dice with up to 6 sides',
	usage: 'diceroll <sides>',
    cooldown: '0',
	execute (message, args) {
		let [limit] = args;
        if (!limit) limit = 6;
        const rand = Math.floor(Math.random() * limit + 1);
        if (!rand || limit <= 0) return message.channel.send('Error: Please provide a valid number.');
            const embed = new MessageEmbed()
                .setTitle('Dice Roll')
                .setDescription(`<@${message.author.id}>, you rolled a **${rand}**!`)
                .setColor(embedColor);
            message.channel.send({ embeds: [embed] });
        }
};