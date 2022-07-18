const Discord = require('discord.js');

const embed = new Discord.MessageEmbed()
    .setTitle('Error')
    .setDescription('You have no permission to use this command.')
    .setColor('#ff5555');

module.exports = embed;