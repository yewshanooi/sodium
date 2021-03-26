const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'whois',
	description: 'Display info about the tagged user(s), or your own information',
	cooldown: '5',
	usage: '{@user}',
	execute (message) {
		if (!message.mentions.users.size) {
		const embed = new MessageEmbed()
			.setTitle('Whois')
			.setDescription(`Name : \`${message.author.username}\`\nDiscriminator : \`${message.author.tag}\`\nCreation Date : \`${message.author.createdAt}\``)
			.addField('User ID', `\`${message.author.id}\``)
			.setColor(embedColor);
		message.channel.send(embed);
	}
		if (message.mentions.users.size) {
		const taggedUser = message.mentions.users.first();
		const taggedUserEmbed = new MessageEmbed()
			.setTitle('Whois')
			.setDescription(`Name : \`${taggedUser.username}\`\nDiscriminator : \`${taggedUser.tag}\`\nCreation Date : \`${taggedUser.createdAt}\``)
			.addField('User ID', `\`${taggedUser.id}\``)
			.setColor(embedColor);
		message.channel.send(taggedUserEmbed);
		}
	}
};