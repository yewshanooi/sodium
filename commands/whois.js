module.exports = {
	name: 'whois',
	description: 'Display info about the tagged user(s), or your own information',
	cooldown: '5',
	execute (message) {
		if (!message.mentions.users.size) {
			return message.channel.send(`Username: \`${message.author.username}\`\nUser Tag: \`${message.author.tag}\`\nUser ID: \`${message.author.id}\`\nUser Creation Date: \`${message.author.createdAt}\``);
		}
			const taggedUser = message.mentions.users.first();
			message.channel.send(`Username: \`${taggedUser.username}\`\nUser Tag: \`${taggedUser.tag}\`\nUser ID: \`${taggedUser.id}\`\nUser Creation Date: \`${taggedUser.createdAt}\``);
	}
};