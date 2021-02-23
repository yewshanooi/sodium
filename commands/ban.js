module.exports = {
	name: 'ban',
	description: 'Tag a user to ban them',
	execute (message, args) {
		if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('Invalid Permissions');
			const User = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
		if (!User) return message.channel.send('Invalid User');
		if (User.hasPermission('BAN_MEMBERS')) return message.reply('Invalid Permissions');
			let banReason = args.join(' ').slice(22);
		if (!banReason) {
			banReason = 'None';
		}

		User.ban({ reason: banReason });
		}
	};

// ban command currently not finish yet, must do test before launching it