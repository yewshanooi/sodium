const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warn',
	description: 'Tag a user to warn them with or without a reason',
	usage: 'warn {@user} || {reason}',
    cooldown: '20',
    guildOnly: true,
	execute (message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Error: You have no permission to use this command.');
			const user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
				if (user.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Error: This user cannot be warned.');

        let warnReason = args.join(' ').slice(22);
			if (!warnReason) {
				warnReason = 'None';
			}

		const embedUser = new MessageEmbed()
            .setTitle('Warn')
            .setDescription(`You have been Warned on guild \`${message.guild.name}\``)
            .addField('By', message.author.tag)
            .addField('Reason', warnReason)
            .setTimestamp()
            .setColor('#FF0000');
        user.send(embedUser);

        const embed = new MessageEmbed()
            .setTitle('Warn')
            .setDescription(`User ${user} have been Warned!`)
            .addField('By', message.author.tag)
            .addField('Reason', warnReason)
            .setTimestamp()
            .setColor('#FF0000');
        message.channel.send(embed);
    }
};