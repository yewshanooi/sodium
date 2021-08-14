const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'beep',
	description: 'Boops back at you!',
	usage: 'beep',
	cooldown: '0',
	execute (message) {
		const embed = new MessageEmbed()
			.setDescription('Boop!')
			.setColor(embedColor);
		message.channel.send({ embeds: [embed] });
	}
};