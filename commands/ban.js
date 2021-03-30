const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ban',
	description: 'Tag a user to ban them with or without reason',
	usage: 'ban {@user} || {reason}',
	cooldown: '30',
	guildOnly: true,
	execute (message, args) {
		if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('Error: You have no permission to use this command.');
			const user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
				if (user.hasPermission('BAN_MEMBERS')) return message.channel.send('Error: This user cannot be banned.');

		let banReason = args.join(' ').slice(22);
			if (!banReason) {
				banReason = 'None';
			}

		const embed = new MessageEmbed()
			.setTitle('Ban')
			.setDescription(`User ${user} have been Banned!`)
			.addField('Banned by', message.author.tag)
			.addField('Reason', banReason)
			.setTimestamp()
            .setColor('#FF0000');
		message.channel.send(embed);

		message.delete().then(user.ban({ reason: banReason }));
	}
};