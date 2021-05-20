const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'avatar',
	description: 'Get your own avatar or the tagged user\'s avatar',
	usage: 'avatar <@user>',
	cooldown: '5',
	execute (message) {
		if (!message.mentions.users.size) {
		const embed = new MessageEmbed()
			.setTitle('Avatar')
			.setDescription(`Link - [*discordapp.com*](https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg)`)
			.setImage(`${message.author.displayAvatarURL({ dynamic: true })}`)
			.setColor(embedColor);
		message.channel.send(embed);
	}
		if (message.mentions.users.size) {
		const taggedUser = message.mentions.users.first();
		const userAvatar = message.mentions.users.map(user => `${user.displayAvatarURL({ dynamic: true })}`);
		const embed = new MessageEmbed()
			.setTitle('Avatar')
			.setDescription(`Link - [*discordapp.com*](https://cdn.discordapp.com/avatars/${taggedUser.id}/${taggedUser.avatar}.jpeg)`)
			.setImage(`${userAvatar}`)
			.setColor(embedColor);
		message.channel.send(embed);
		}
	}
};