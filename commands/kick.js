const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'kick',
	description: 'Tag a user to kick them',
    cooldown: '30',
	usage: '{@user} {reason}',
	execute (message, args) {
		if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('You have no permission to use this command.');
			const user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
				if (user.hasPermission('KICK_MEMBERS')) return message.reply('You have no permission to use this command.');

		let kickReason = args.join(' ').slice(22);
			if (!kickReason) {
				kickReason = 'None';
			}

		const embedChannelSend = new MessageEmbed()
			.setTitle('Kick')
			.setDescription(`User ${user} have been Kicked!`)
			.addField('Kicked by', message.author.tag)
			.addField('Reason', kickReason)
			.setColor('#FF0000')
			.setTimestamp();
		message.channel.send(embedChannelSend);

		message.delete().then(user.kick());
		}
	};