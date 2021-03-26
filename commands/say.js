const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'say',
	description: 'Get the bot to say your message',
	cooldown: '5',
	usage: '{message}',
	guildOnly: true,
	execute (message, args) {
		const sayMsg = args.join(' ');
			const embed = new MessageEmbed()
			.addField(`${message.author.username} said:`, `${sayMsg}`)
			.setColor(embedColor);
        message.delete();
        message.channel.send(embed);
	}
};