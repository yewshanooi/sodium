const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'deafen',
    description: 'Deafen the tagged user with or without a reason',
    usage: 'deafen {@user} <reason>',
    cooldown: '25',
    guildOnly: true,
    execute (message, args) {
        if (!message.member.permissions.has('DEAFEN_MEMBERS')) return message.channel.send('Error: You have no permission to use this command.');

            if (!args[0]) return message.channel.send('Error: Please provide a user.');

            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                if (!user) return message.channel.send('Error: Please provide a valid user.');
                if (user === message.member) return message.channel.send('Error: You cannot deafen yourself.');
                if (user.permissions.has('DEAFEN_MEMBERS')) return message.channel.send('Error: This user cannot be deafen.');

                const currentGuildID = message.guild.id;
                const memberID = user.id;

                const Guild = message.client.guilds.cache.get(currentGuildID);
                const Member = Guild.members.cache.get(memberID);
                    if (!Member.voice.channel) return message.channel.send('Error: This user is currently not in a voice channel.');

            let deafReason = args.splice(1).join(' ');
                if (!deafReason) {
                    deafReason = 'None';
            }

        const embed = new MessageEmbed()
			.setTitle('Deafen')
			.addField('User', `${user}`)
            .addField('ID', `\`${memberID}\``)
			.addField('By', `\`${message.author.tag}\``)
			.addField('Reason', `\`${deafReason}\``)
			.setTimestamp()
            .setColor('#FF0000');

        message.channel.send({ embeds: [embed] }).then(user.voice.setDeaf(true));
    }
};