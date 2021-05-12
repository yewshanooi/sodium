const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'botnick',
    description: 'Change bot\'s nickname',
    usage: 'nick {nickname}',
    cooldown: '25',
    guildOnly: true,
    execute (message, args) {
        if (!message.member.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('Error: You have no permission to use this command.');

            const nickname = args.join(' ');
                if (!nickname) return message.channel.send('Error: Please provide a valid username.');

            const embed = new MessageEmbed()
                .setTitle('Bot Nickname')
                .setDescription(`Nickname successfully changed to **${nickname}**`)
                .setTimestamp()
                .setColor(embedColor);

            message.channel.send(embed).then(message.guild.member(message.client.user).setNickname(nickname));
        }
    };