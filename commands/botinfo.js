const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'botinfo',
	description: 'Display information(s) about the bot',
	usage: 'botinfo',
	cooldown: '5',
	execute (message) {
		let totalSeconds = message.client.uptime / 1000;
			const days = Math.floor(totalSeconds / 86400);
				totalSeconds %= 86400;
			const hours = Math.floor(totalSeconds / 3600);
				totalSeconds %= 3600;
			const minutes = Math.floor(totalSeconds / 60);
			const seconds = Math.floor(totalSeconds % 60);

		const embed = new MessageEmbed()
			.setTitle('Bot Info')
			.addField('Name', `\`${message.client.user.username}\``, true)
			.addField('Discriminator', `\`${message.client.user.discriminator}\``, true)
			.addField('Creation Date & Time', `\`${message.client.user.createdAt}\``)
			.addField('Users', `\`${message.client.users.cache.size}\``, true)
			.addField('Channels', `\`${message.client.channels.cache.size}\``, true)
			.addField('Guilds', `\`${message.client.guilds.cache.size}\``, true)
			.addField('Embed Color (Hex)', `\`#${embedColor}\``, true)
			.addField('ID', `\`${message.client.user.id}\``, true)
			.addField('Uptime', `\`${days}\` *days(s)*, \`${hours}\` *hours(s)*, \`${minutes}\` *minute(s)*, \`${seconds}\` *second(s)*`)
			.setColor(embedColor);
        message.channel.send({ embeds: [embed] });
	}
};