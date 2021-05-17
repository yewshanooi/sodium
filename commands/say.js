const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'say',
	description: 'Get the bot to say your message',
	usage: 'say {message}',
	cooldown: '10',
	guildOnly: true,
	execute (message, args) {
		const msg = args.join(' ');
          if (!msg) return message.channel.send('Error: Please provide a valid message.');
			const embed = new MessageEmbed()
				.setDescription(`**${message.author.username} said: ${msg}**`)
				.setColor(embedColor);
			message.delete().then(message.channel.send(embed));
		}
};