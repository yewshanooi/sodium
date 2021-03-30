const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'botinfo',
	description: 'Get the bot\'s current information',
	usage: 'botinfo',
	cooldown: '5',
	execute (message) {
		const embed = new MessageEmbed()
			.setTitle('Bot Info')
			.setDescription(`Logged in as \`${message.client.user.tag}\``)
			.addField('Users', `\`${message.client.users.cache.size}\``)
			.addField('Channels', `\`${message.client.channels.cache.size}\``)
			.addField('Guilds', `\`${message.client.guilds.cache.size}\``)
			.setColor(embedColor);
        message.channel.send(embed);
	}
};