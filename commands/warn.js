const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warn',
	description: 'Warn\'s a tagged user',
	cooldown: '30',
	usage: '{@user} {reason}',
    guildOnly: true,
	execute (message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('You have no permission to use this command.');
            const user = message.mentions.users.first();
        if (message.mentions.users.size < 1) return message.reply('You must mention someone to Warn them.');

            let warnReason = args.slice(1).join(' ');
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
            user.send(embedUserSend);

            const embedChannelSend = new MessageEmbed()
                .setTitle('Warn')
                .setDescription(`User ${user} have been Warned!`)
                .addField('Warned by', message.author.tag)
                .addField('Reason', warnReason)
                .setColor('#FF0000')
                .setTimestamp();
            message.channel.send(embedChannelSend);

            message.delete();
        }
    };