const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'serverinfo',
	description: 'Display info about this server',
	usage: 'serverinfo',
	cooldown: '5',
	guildOnly: true,
	execute (message) {
		const embed = new MessageEmbed()
			.setTitle('Server Info')
			.setDescription(`Server Name : \`${message.guild.name}\`\nServer Region : \`${message.guild.region}\`\nCreation Date & Time : \`${message.guild.createdAt}\``)
			.addField('Total Members', `\`${message.guild.memberCount}\``, true)
			.addField('Total Channels', `\`${message.guild.channels.cache.filter(ch => ch.type !== 'category').size}\``, true)
			.setColor(embedColor);
		message.channel.send(embed);
	}
};