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
			.setDescription(`Server Name : \`${message.guild.name}\`\nServer Region : \`${message.guild.region}\`\nTotal Members : \`${message.guild.memberCount}\`\nCreation Date & Time : \`${message.guild.createdAt}\``)
			.setColor(embedColor);
		message.channel.send(embed);
	}
};