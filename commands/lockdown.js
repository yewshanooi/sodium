const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'lockdown',
    description: 'Lock every text channel in the guild to prevent users from sending messages',
    usage: 'lockdown {true | false}',
    cooldown: '40',
    execute (message, args) {
        if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send('Error: You have no permission to use this command.');
         const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');

            if (!args[0]) return message.channel.send(`Error: You are missing some args.\n*(e.g: \`${prefix}lockdown true\` or \`${prefix}lockdown false\`)*`);

            const lockTrue = new MessageEmbed()
                .setTitle('Guild Lockdown')
                .setDescription(`Successfully locked text channels in guild **${message.guild}**`)
                .setTimestamp()
                .setColor(embedColor);

            const lockFalse = new MessageEmbed()
                .setTitle('Guild Lockdown')
                .setDescription(`Successfully unlocked text channels in guild **${message.guild}**`)
                .setTimestamp()
                .setColor(embedColor);

            if (args[0] === 'true') {
                message.channel.send(lockTrue).then(channels.forEach(channel => {
                    channel.updateOverwrite(message.guild.roles.everyone, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                }));
            }

            else if (args[0] === 'false') {
                message.channel.send(lockFalse).then(channels.forEach(channel => {
                    channel.updateOverwrite(message.guild.roles.everyone, {
                        SEND_MESSAGES: true,
                        ADD_REACTIONS: true
                    });
                }));
            }
      }
 };