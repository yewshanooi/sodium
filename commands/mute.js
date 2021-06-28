const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'mute',
	description: 'Mute the tagged user with or without a reason',
	usage: 'mute {@user} <reason>',
    cooldown: '0',
    // 25
    guildOnly: true,
	execute (message, args) {
        if (!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send('Error: You have no permission to use this command.');
			const user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
				if (user.hasPermission('MUTE_MEMBERS')) return message.channel.send('Error: This user cannot be muted.');

        let muteReason = args.splice(1).join(' ');
            if (!muteReason) {
                muteReason = 'None';
            }

        const mutedRole = message.guild.roles.cache.find(mR => mR.name === 'Muted');

        if (!mutedRole) {
            message.guild.roles.create({
                data: {
                    name: 'Muted',
                    color: '#FFFFFF',
                    permissions: []
                    // Add code to make sure that Bot-Created Muted role has proper "no speaking" permissions
                    }
                });
            user.roles.add(mutedRole);
        }

		const embedUser = new MessageEmbed()
            .setTitle('Mute')
            .addField('Guild', `\`${message.guild.name}\``)
            .addField('By', `\`${message.author.tag}\``)
            .addField('Reason', `\`${muteReason}\``)
            .setTimestamp()
            .setColor('#FF0000');

        const embed = new MessageEmbed()
            .setTitle('Mute')
            .addField('User', user)
            .addField('By', `\`${message.author.tag}\``)
            .addField('Reason', `\`${muteReason}\``)
            .setTimestamp()
            .setColor('#FF0000');

        message.channel.send(embed);
        user.send(embedUser).then(user.roles.add(mutedRole));
    }
};

// Current bot created 'mutedRole' doesn't have proper permissions to prevent the muted user from speaking