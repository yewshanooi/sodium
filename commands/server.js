module.exports = {
	name: 'serverinfo',
	description: 'Display info about this server',
	execute (message) {
		message.channel.send(`**Server Name:** ${message.guild.name}\n**Server Region:** ${message.guild.region}\n**Total Members:** ${message.guild.memberCount}\n**Creation time:** ${message.guild.createdAt}`);
	}
};