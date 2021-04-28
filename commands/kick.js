const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'kick',
	description: 'Tag a user to kick them with or without a reason',
    usage: 'kick {@user} || {reason}',
	cooldown: '30',
	guildOnly: true,
	execute (message, args) {
		if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('Error: You have no permission to use this command.');
			const user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
				if (user.hasPermission('KICK_MEMBERS')) return message.channel.send('Error: This user cannot be kicked.');

		let kickReason = args.join(' ').slice(22);
			if (!kickReason) {
				kickReason = 'None';
			}

		const embed = new MessageEmbed()
			.setTitle('Kick')
			.setDescription(`User ${user} have been Kicked!`)
			.addField('By', message.author.tag)
			.addField('Reason', kickReason)
			.setTimestamp()
            .setColor('#FF0000');
		message.channel.send(embed);

		user.kick();
	}
};