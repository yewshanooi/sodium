const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'message',
    description: 'Sends a private message to the tagged user',
    usage: 'message {@user} {message}',
    cooldown: '10',
    guildOnly: true,
    execute (message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if (!user) return message.channel.send('Error: Please provide a valid user.');
          if (user === message.member) return message.channel.send('Error: You cannot message yourself.');

          const msg = args.splice(1).join(' ');
            if (!msg) return message.channel.send('Error: Please provide a valid message.');

              const embed = new MessageEmbed()
                  .setTitle(`Incoming message from **${message.author.tag}**`)
                  .setDescription(`\`${msg}\``)
                  .setColor(embedColor);
              message.delete().then(user.send({ embeds: [embed] }));
          }
    };