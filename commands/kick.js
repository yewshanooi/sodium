const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'kick',
	description: 'Kick the tagged user with or without a reason',
    usage: 'kick {@user} <reason>',
	cooldown: '30',
	guildOnly: true,
	execute (message, args) {
		if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('Error: You have no permission to use this command.');

			if (!args[0]) return message.channel.send('Error: Please provide a user.');

			const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
			const userID = user.id;
				if (!user) return message.channel.send('Error: Please provide a valid user.');
				if (user === message.member) return message.channel.send('Error: You cannot kick yourself.');
				if (user.hasPermission('KICK_MEMBERS')) return message.channel.send('Error: This user cannot be kicked.');

		let kickReason = args.splice(1).join(' ');
			if (!kickReason) {
				kickReason = 'None';
			}

		const embed = new MessageEmbed()
			.setTitle('Kick')
			.addField('User', user)
			.addField('ID', `\`${userID}\``)
			.addField('By', `\`${message.author.tag}\``)
			.addField('Reason', `\`${kickReason}\``)
			.setTimestamp()
            .setColor('#FF0000');

		message.channel.send(embed).then(user.kick());
	}
};