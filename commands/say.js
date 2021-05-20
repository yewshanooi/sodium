const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'say',
	description: 'Get the bot to say your text',
	usage: 'say {text}',
	cooldown: '10',
	guildOnly: true,
	execute (message, args) {
		const txt = args.join(' ');
          if (!txt) return message.channel.send('Error: Please provide a valid message.');
			const embed = new MessageEmbed()
				.setDescription(`**${message.author.username} said: ${txt}**`)
				.setColor(embedColor);
			message.delete().then(message.channel.send(embed));
		}
};