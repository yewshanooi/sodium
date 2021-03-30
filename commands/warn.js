const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warn',
	description: 'Tag a user to warn them with or without reason',
	usage: 'warn {@user} || {reason}',
    cooldown: '20',
    guildOnly: true,
	execute (message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You have no permission to use this command.');
			const user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
				if (user.hasPermission('MANAGE_MESSAGES')) return message.channel.send('This user cannot be warned.');

        let warnReason = args.join(' ').slice(22);
			if (!warnReason) {
				warnReason = 'None';
			}

		const embedUserSend = new MessageEmbed()
            .setTitle('Warn')
            .setDescription(`You have been Warned on Server \`${message.guild.name}\``)
            .addField('Warned by', message.author.tag)
            .addField('Reason', warnReason)
            .setColor('#FF0000')
            .setTimestamp();
        message.delete().then(user.send(embedUserSend));

        const embedChannelSend = new MessageEmbed()
            .setTitle('Warn')
            .setDescription(`User ${user} have been Warned!`)
            .addField('Warned by', message.author.tag)
            .addField('Reason', warnReason)
            .setColor('#FF0000')
            .setTimestamp();
        message.channel.send(embedChannelSend);
    }
};