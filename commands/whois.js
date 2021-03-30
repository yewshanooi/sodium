const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'whois',
	description: 'Display your own info or the tagged user(s)',
	usage: 'whois || {@user}',
	cooldown: '5',
	execute (message) {
		if (!message.mentions.users.size) {
		const embed = new MessageEmbed()
			.setTitle('Whois')
			.setDescription(`Username : \`${message.author.username}\`\nStatus : \`${message.author.presence.status}\`\nCreation Date & Time : \`${message.author.createdAt}\``)
			.addField('User Tag', `\`${message.author.tag}\``, true)
			.addField('User Discriminator', `\`${message.author.discriminator}\``, true)
			.addField('User ID', `\`${message.author.id}\``, true)
			.setColor(embedColor);
		message.channel.send(embed);
	}
		if (message.mentions.users.size) {
		const taggedUser = message.mentions.users.first();
		const embed = new MessageEmbed()
			.setTitle('Whois')
			.setDescription(`Username : \`${taggedUser.username}\`\nStatus : \`${taggedUser.presence.status}\`\nCreation Date & Time : \`${taggedUser.createdAt}\``)
			.addField('User Tag', `\`${taggedUser.tag}\``, true)
			.addField('User Discriminator', `\`${taggedUser.discriminator}\``, true)
			.addField('User ID', `\`${taggedUser.id}\``, true)
			.setColor(embedColor);
		message.channel.send(embed);
		}
	}
};