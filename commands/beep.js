const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'beep',
	description: 'Boop!',
	cooldown: '0',
	execute (message) {
		const embed = new MessageEmbed()
			.setTitle('Boop.')
			.setColor(embedColor);
		message.channel.send(embed);
	}
};