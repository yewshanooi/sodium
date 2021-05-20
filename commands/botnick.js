const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'botnick',
    description: 'Change bot\'s nickname in the current server',
    usage: 'botnick {nickname}',
    cooldown: '25',
    guildOnly: true,
    execute (message, args) {
        if (!message.member.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('Error: You have no permission to use this command.');
            const bot = message.guild.member(message.client.user);

            const nickname = args.join(' ');
                if (!nickname) return message.channel.send('Error: Please provide a valid username.');

            if (nickname.length <= '32') {
                const embed = new MessageEmbed()
                    .setTitle('Bot Nickname')
                    .setDescription(`Nickname successfully changed to **${nickname}**`)
                    .setTimestamp()
                    .setColor(embedColor);

                message.channel.send(embed).then(bot.setNickname(nickname));
            }
            else {
                return message.channel.send('Error: Nickname must be 32 characters or fewer.');
            }
        }
};