const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warn',
	description: 'Warn the tagged user with or without a reason',
	usage: 'warn {@user} <reason>',
    cooldown: '20',
    guildOnly: true,
	execute (message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Error: You have no permission to use this command.');

            if (!args[0]) return message.channel.send('Error: Please provide a user.');

			const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
            const userID = user.id;
                if (!user) return message.channel.send('Error: Please provide a valid user.');
                if (user === message.member) return message.channel.send('Error: You cannot warn yourself.');
				if (user.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Error: This user cannot be warned.');

        let warnReason = args.splice(1).join(' ');
			if (!warnReason) {
				warnReason = 'None';
			}

		const embedUser = new MessageEmbed()
            .setTitle('Warn')
            .addField('Guild', `\`${message.guild.name}\``)
            .addField('By', `\`${message.author.tag}\``)
            .addField('Reason', `\`${warnReason}\``)
            .setTimestamp()
            .setColor('#FF0000');

        const embed = new MessageEmbed()
            .setTitle('Warn')
            .addField('User', user)
            .addField('ID', `\`${userID}\``)
            .addField('By', `\`${message.author.tag}\``)
            .addField('Reason', `\`${warnReason}\``)
            .setTimestamp()
            .setColor('#FF0000');

        user.send(embedUser).then(message.channel.send(embed));
    }
};