const Discord = require('discord.js');

const embed = new Discord.EmbedBuilder()
    .setTitle('Warning')
    .setDescription('No API key found. Please set one in the `.env` file.')
    .setColor('#ffaa00');

module.exports = embed;