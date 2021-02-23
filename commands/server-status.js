module.exports = {
	name: 'server-status',
	description: 'Display info about this server',
	cooldown: '5',
	execute (message) {
		message.channel.send(`Server Name: \`${message.guild.name}\`\nServer Region: \`${message.guild.region}\`\nTotal Members \`${message.guild.memberCount}\`\nCreation Date & Time: \`${message.guild.createdAt}\``);
	}
};