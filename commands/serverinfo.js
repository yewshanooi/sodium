const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'serverinfo',
	description: 'Display info about this server',
	cooldown: '5',
	guildOnly: true,
	execute (message) {
		const embed = new MessageEmbed()
			.setTitle('Server Info')
			.setDescription(`Server Name : \`${message.guild.name}\`\nServer Region : \`${message.guild.region}\`\nCreation Date & Time : \`${message.guild.createdAt}\``)
			.addField('Members', `\`${message.guild.memberCount}\``)
			.addField('Channels', `\`${message.guild.channels.cache.filter(ch => ch.type !== 'category').size}\``)
			.setColor(embedColor);
		message.channel.send(embed);
	}
};