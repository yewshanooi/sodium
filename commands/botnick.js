const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'botnick',
    description: 'Change bot\'s nickname in the current server',
    usage: 'botnick {nickname}',
    cooldown: '25',
    guildOnly: true,
    execute (message, args) {
        if (!message.member.permissions.has('MANAGE_NICKNAMES')) return message.channel.send('Error: You have no permission to use this command.');

            const newNick = args.join(' ');
                if (!newNick) return message.channel.send('Error: Please provide a valid username.');

            if (newNick.length <= '32') {
                const embed = new MessageEmbed()
                    .setTitle('Bot Nickname')
                    .setDescription(`Nickname successfully changed to **${newNick}**`)
                    .setTimestamp()
                    .setColor(embedColor);

                message.guild.me.setNickname(newNick).then(message.channel.send({ embeds: [embed] }));
            }
            else {
                return message.channel.send('Error: Nickname must be 32 characters or fewer.');
            }
        }
};