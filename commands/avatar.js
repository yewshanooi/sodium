const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar',
	cooldown: '5',
	usage: '{@user}',
	execute (message) {
		if (!message.mentions.users.size) {
		const embed = new MessageEmbed()
			.setDescription('Your Avatar:')
			.setImage(`${message.author.displayAvatarURL({ dynamic: true })}`)
			.setColor(message.guild.me.displayHexColor);
		message.channel.send(embed);
	}
		if (message.mentions.users.size) {
		const taggedUser = message.mentions.users.map(user => `${user.displayAvatarURL({ dynamic: true })}`);
		const taggedUserName = message.mentions.users.first();
		const embed2 = new MessageEmbed()
			.setDescription(`${taggedUserName}'s Avatar:`)
			.setImage(`${taggedUser}`)
			.setColor(message.guild.me.displayHexColor);
		message.channel.send(embed2);
		}
	}
};