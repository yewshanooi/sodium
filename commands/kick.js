module.exports = {
	name: 'kick',
	description: 'Tag a member and kick them (but not really)',
	execute (message) {
		if (!message.mentions.users.size) {
			return message.reply('**You need to tag a user in order to kick them!**');
		}

		const taggedUser = message.mentions.users.first();
		message.channel.send(`**You wanted to kick: ${taggedUser.username}**`);
	}
};


// kick command currently not working because theres no proper permission setup