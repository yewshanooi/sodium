const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'botinfo',
	description: 'Get the bot\'s information',
	cooldown: '5',
	execute (message) {
		const embed = new MessageEmbed()
			.setTitle('Bot Info')
			.setDescription(`Discriminator : \`${message.client.user.tag}\``)
			.addField('Total Users', `\`${message.client.users.cache.size}\``)
			.addField('Total Channels', `\`${message.client.channels.cache.size}\``)
			.addField('Total Guilds', `\`${message.client.guilds.cache.size}\``)
			.setColor(embedColor);
        message.channel.send(embed);
	}
};