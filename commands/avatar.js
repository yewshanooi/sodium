const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'avatar',
	description: 'Get your own avatar or the tagged user\'s avatar',
	usage: 'avatar <@user>',
	cooldown: '5',
	execute (message) {
		if (!message.mentions.users.size) {
			const embedOwn = new MessageEmbed()
				.setTitle('Your Avatar')
				.setImage(`${message.author.displayAvatarURL({ dynamic: true })}`)
				.setColor(embedColor);

				const buttonOwn = new MessageActionRow()
					.addComponents(new MessageButton()
						.setURL(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
						.setLabel('Avatar JPEG')
						.setStyle('LINK'));

			message.channel.send({ embeds: [embedOwn], components: [buttonOwn] });
		}

		if (message.mentions.users.size) {
			const taggedUser = message.mentions.users.first();
			const userAvatar = message.mentions.users.map(user => `${user.displayAvatarURL({ dynamic: true })}`);
			const embedTagged = new MessageEmbed()
				.setTitle(`${taggedUser.username}'s Avatar`)
				.setImage(`${userAvatar}`)
				.setColor(embedColor);

				const buttonTagged = new MessageActionRow()
					.addComponents(new MessageButton()
						.setURL(`https://cdn.discordapp.com/avatars/${taggedUser.id}/${taggedUser.avatar}.jpeg`)
						.setLabel('Avatar JPEG')
						.setStyle('LINK'));

			message.channel.send({ embeds: [embedTagged], components: [buttonTagged] });
		}
	}
};