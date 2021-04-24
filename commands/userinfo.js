const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'userinfo',
	description: 'Display your own or the tagged user(s) info',
	usage: 'userinfo || {@user}',
	cooldown: '5',
	execute (message) {
		if (!message.mentions.users.size) {
		const embed = new MessageEmbed()
			.setTitle('User Info')
			.addField('Name', `\`${message.author.username}\``, true)
			.addField('Status', `\`${message.author.presence.status}\``, true)
			.addField('Creation Date & Time', `\`${message.author.createdAt}\``)
			.addField('Tag', `\`${message.author.tag}\``, true)
			.addField('Discriminator', `\`${message.author.discriminator}\``, true)
			.addField('ID', `\`${message.author.id}\``, true)
			.setColor(embedColor);
		message.channel.send(embed);
	}
		if (message.mentions.users.size) {
		const taggedUser = message.mentions.users.first();
		const embed = new MessageEmbed()
			.setTitle('User Info')
			.addField('Name', `\`${taggedUser.username}\``, true)
			.addField('Status', `\`${taggedUser.presence.status}\``, true)
			.addField('Creation Date & Time', `\`${taggedUser.createdAt}\``)
			.addField('Tag', `\`${taggedUser.tag}\``, true)
			.addField('Discriminator', `\`${taggedUser.discriminator}\``, true)
			.addField('ID', `\`${taggedUser.id}\``, true)
			.setColor(embedColor);
		message.channel.send(embed);
		}
	}
};