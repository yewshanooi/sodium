const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'say',
	description: 'Get the bot to say your message',
	usage: 'say {message}',
	cooldown: '5',
	guildOnly: true,
	execute (message, args) {
		const sayMsg = args.join(' ');
		if (!sayMsg) return message.channel.send('Please provide a message to say.');
			const embed = new MessageEmbed()
			.addField(`${message.author.username} said:`, `${sayMsg}`)
			.setColor(embedColor);
        message.delete();
        message.channel.send(embed);
	}
};