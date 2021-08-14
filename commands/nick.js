const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'nick',
    description: 'Change the tagged user\'s nickname',
    usage: 'nick {@user} {nickname}',
    cooldown: '10',
    guildOnly: true,
    execute (message, args) {
		if (!message.member.permissions.has('MANAGE_NICKNAMES')) return message.channel.send('Error: You have no permission to use this command.');

            if (!args[0]) return message.channel.send('Error: Please provide a user.');

			const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                if (!user) return message.channel.send('Error: Please provide a valid user.');
                if (user.permissions.has('MANAGE_NICKNAMES')) return message.channel.send('Error: This user\'s nickname cannot be changed.');

            const users = message.mentions.users.first();

                const nickname = args.join(' ').slice(22);
                    if (!nickname) return message.channel.send('Error: Please provide a valid username.');

                if (nickname.length <= '33') {
                    const embed = new MessageEmbed()
                        .setTitle('Nickname')
                        .setDescription(`**${users.username}**'s nickname successfully changed to **${nickname}**`)
                        .setTimestamp()
                        .setColor(embedColor);

                    message.channel.send({ embeds: [embed] }).then(user.setNickname(nickname));
                }
                else {
                    return message.channel.send('Error: Nickname must be 32 characters or fewer.');
                }
            }
    };