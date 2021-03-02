const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'beep',
	description: 'Boop!',
	execute (message) {
		const embed = new MessageEmbed()
			.setTitle('Boop.')
			.setColor(message.guild.me.displayHexColor);
		message.channel.send(embed);
	}
};