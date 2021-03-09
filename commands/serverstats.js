const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'serverstats',
	description: 'Display info about this server',
	cooldown: '5',
	execute (message) {
		const embed = new MessageEmbed()
		.setTitle('Server Status')
		.setDescription(`Server Name : \`${message.guild.name}\`\nServer Region : \`${message.guild.region}\`\nTotal Members : \`${message.guild.memberCount}\`\nCreation Date & Time : \`${message.guild.createdAt}\``)
		.setColor(message.guild.me.displayHexColor);
	message.channel.send(embed);
	}
};