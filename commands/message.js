const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'message',
	description: 'Sends a private message to the user specified',
    usage: 'message {@user} {message}',
    cooldown: '10',
    guildOnly: true,
	execute (message, args) {
        const user = message.mentions.users.first();
          if (!user) return message.channel.send('Error: Please provide a valid user.');
            const msg = args.splice(1).join(' ');
              if (!msg) return message.channel.send('Error: Please provide a valid message.');
                const embed = new MessageEmbed()
                    .setTitle(`Incoming message from **${message.author.tag}**`)
                    .setDescription(`\`${msg}\``)
                    .setColor(embedColor);
                message.delete().then(user.send(embed));
            }
    };