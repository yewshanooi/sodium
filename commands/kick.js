module.exports = {
	name: 'kick',
	description: 'Tag a user to kick them',
    cooldown: '20',
	execute (message, args) {
		if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('You have no permission to use this command.');
			const user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
		if (user.hasPermission('KICK_MEMBERS')) return message.reply('You have no permission to use this command.');

		let kickReason = args.join(' ').slice(22);
			if (!kickReason) {
				kickReason = 'None';
			}
		user.kick({ reason: kickReason });
			message.channel.send(`User ${user} have been kicked for**${kickReason}**`);
		}
	};