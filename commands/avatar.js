module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar',
	cooldown: '5',
	usage: '{@user}',
	execute (message) {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your Avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
		}
		const avatarList = message.mentions.users.map(user => `**${user.username}**'s Avatar: ${user.displayAvatarURL({ dynamic: true })}`);
		message.channel.send(avatarList);
	}
};