const Discord = require('discord.js');

// errors[0]
const guildOnlyCmd = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('This command cannot be executed in Direct Messages.')
    .setColor('#ff5555');

// errors[1]
const noAPIKey = new Discord.EmbedBuilder()
    .setTitle('Warning')
    .setDescription('No API key found. Please set one in the `.env` file.')
    .setColor('#ffaa00');

// errors[2]
const noConfig = new Discord.EmbedBuilder()
    .setTitle('Warning')
    .setDescription('Bot configuration is incomplete. Complete the `config.js` file and try again.')
    .setColor('#ffaa00');

// errors[3]
const noPermission = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('You have no permission to use this command.')
    .setColor('#ff5555');

// errors[4]
const privateDM = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety` to receive Direct Messages.')
    .setColor('#ff5555');

module.exports = [guildOnlyCmd, noAPIKey, noConfig, noPermission, privateDM];