const Discord = require('discord.js');

const embed = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('This command cannot be executed in Direct Messages.')
    .setColor('#ff5555');

module.exports = embed;