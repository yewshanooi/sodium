const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warn',
	description: 'Warn\'s a tagged user',
	cooldown: '30',
	usage: '{@user} {reason}',
	execute (message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('You have no permission to use this command.');
            const user = message.mentions.users.first();
        if (message.mentions.users.size < 1) return message.reply('You must mention someone to warn them.');

            let warnReason = args.slice(1).join(' ');
			if (!warnReason) {
				warnReason = 'None';
			}

			const embed = new MessageEmbed()
                .setTitle('Warn')
                .setDescription(`You have been warned on server \`${message.guild.name}\``)
                .addField('Warned by', message.author.tag)
                .addField('Reason', warnReason)
                .setColor('#FF0000');
            user.send(embed);

            const embed2 = new MessageEmbed()
                .setTitle('Warn')
                .setDescription(`User ${user} have been warned!`)
                .addField('Warned by', message.author.tag)
                .addField('Reason', warnReason)
                .setColor(message.guild.me.displayHexColor);
            message.channel.send(embed2);

            message.delete();
        }
    };