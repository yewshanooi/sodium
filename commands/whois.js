module.exports = {
	name: 'whois',
	description: 'Display info about the tagged user(s), or your own information',
	execute (message) {
		if (!message.mentions.users.size) {
			return message.channel.send(`**Username:** ${message.author.username}\n**User Tag:** ${message.author.tag}\n**User ID:** ${message.author.id}\n**User Creation Date:** ${message.author.createdAt}`);
		}

		const taggedUser = message.mentions.users.first();
		message.channel.send(`**Username:** ${taggedUser.username}\n**User Tag:** ${taggedUser.tag}\n**User ID:** ${taggedUser.id}\n**User Creation Date:** ${taggedUser.createdAt}`);
	}
};