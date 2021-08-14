const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'announce',
    description: 'Get the bot to announce something',
    usage: 'announce {message}',
    cooldown: '5',
    guildOnly: true,
    execute (message, args) {
        const announcement = args.join(' ');
          if (!announcement) return message.channel.send('Error: Please provide a valid message.');
            const embed = new MessageEmbed()
              .setTitle('Announcement')
              .setAuthor(message.author.username, message.author.displayAvatarURL({ size: 64 }))
              .setDescription(announcement)
              .setColor(embedColor);
          message.delete().then(message.channel.send({ embeds: [embed] }));
      }
};