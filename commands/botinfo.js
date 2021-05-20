const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'botinfo',
	description: 'Display information(s) about the bot',
	usage: 'botinfo',
	cooldown: '5',
	execute (message) {
		const embed = new MessageEmbed()
			.setTitle('Bot Info')
			.addField('Name', `\`${message.client.user.username}\``, true)
			.addField('Discriminator', `\`${message.client.user.discriminator}\``, true)
			.addField('Users', `\`${message.client.users.cache.size}\``)
			.addField('Channels', `\`${message.client.channels.cache.size}\``)
			.addField('Guilds', `\`${message.client.guilds.cache.size}\``)
			.setColor(embedColor);
        message.channel.send(embed);
	}
};