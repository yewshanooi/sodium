const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unmute',
	description: 'Unmute the tagged user with or without a reason',
	usage: 'unmute {@user} <reason>',
    cooldown: '25',
    guildOnly: true,
	execute (message, args) {
        if (!message.member.permissions.has('MUTE_MEMBERS')) return message.channel.send('Error: You have no permission to use this command.');

            if (!args[0]) return message.channel.send('Error: Please provide a user.');

			const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                if (!user) return message.channel.send('Error: Please provide a valid user.');
                if (user === message.member) return message.channel.send('Error: You cannot unmute yourself.');
				if (user.permissions.has('MUTE_MEMBERS')) return message.channel.send('Error: This user cannot be unmuted.');

                const userID = user.id;

            let unmuteReason = args.splice(1).join(' ');
                if (!unmuteReason) {
                    unmuteReason = 'None';
                }

        const mutedRole = message.guild.roles.cache.find(umt => umt.name === 'Muted');
            if (!mutedRole) return message.channel.send('Error: No existing mute role found. Create a new role, **Muted** in `Server settings > Roles` to use this command.');
            if (!user.roles.cache.has(mutedRole.id)) return message.channel.send('Error: This user is not muted.');

		const embedUser = new MessageEmbed()
            .setTitle('Unmute')
            .addField('Guild', `\`${message.guild.name}\``)
            .addField('By', `\`${message.author.tag}\``)
            .addField('Reason', `\`${unmuteReason}\``)
            .setTimestamp()
            .setColor('#FF0000');

        const embed = new MessageEmbed()
            .setTitle('Unmute')
            .addField('User', `${user}`)
            .addField('ID', `\`${userID}\``)
            .addField('By', `\`${message.author.tag}\``)
            .addField('Reason', `\`${unmuteReason}\``)
            .setTimestamp()
            .setColor('#FF0000');

        message.channel.send({ embeds: [embed] });
        user.send({ embeds: [embedUser] }).then(user.roles.remove(mutedRole));
    }
};