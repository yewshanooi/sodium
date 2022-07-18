const Discord = require('discord.js');

const embed = new Discord.MessageEmbed()
    .setTitle('Error')
    .setDescription('Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety` to receive Direct Messages.')
    .setColor('#ff5555');

module.exports = embed;