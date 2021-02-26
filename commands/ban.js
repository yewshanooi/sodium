module.exports = {
	name: 'ban',
	description: 'Tag a user to ban them',
	cooldown: '30',
	usage: '{@user} {reason}',
	execute (message, args) {
		if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You have no permission to use this command.');
			const user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
				if (user.hasPermission('BAN_MEMBERS')) return message.reply('You have no permission to use this command.');

		let banReason = args.join(' ').slice(22);
			if (!banReason) {
				banReason = 'None';
			}

		user.ban({ reason: banReason });
			message.channel.send(`User ${user} have been banned for**${banReason}**`);
		}
	};