const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'whois',
	description: 'Display info about the tagged user(s), or your own information',
	cooldown: '5',
	usage: '{@user}',
	execute (message) {
		if (!message.mentions.users.size) {
		const embed = new MessageEmbed()
			.setTitle('Whois')
			.setDescription(`Username: \`${message.author.username}\`\nUser Tag: \`${message.author.tag}\`\nUser ID: \`${message.author.id}\`\nUser Creation Date: \`${message.author.createdAt}\``)
			.setColor(message.guild.me.displayHexColor);
		message.channel.send(embed);
	}
		const taggedUser = message.mentions.users.first();
		const embed2 = new MessageEmbed()
			.setTitle('Whois')
			.setDescription(`Username: \`${taggedUser.username}\`\nUser Tag: \`${taggedUser.tag}\`\nUser ID: \`${taggedUser.id}\`\nUser Creation Date: \`${taggedUser.createdAt}\``)
			.setColor(message.guild.me.displayHexColor);
		message.channel.send(embed2);
}
};