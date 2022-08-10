const Discord = require('discord.js');
const color = '#ff5555';

const guildOnlyCmd = new Discord.EmbedBuilder() // 0
    .setTitle('Error')
    .setDescription('This command cannot be executed in Direct Messages.')
    .setColor(color);

const noAPIKey = new Discord.EmbedBuilder() // 1
    .setTitle('Warning')
    .setDescription('No API key found. Please set one in the `.env` file.')
    .setColor(color);

const noConfig = new Discord.EmbedBuilder() // 2
    .setTitle('Warning')
    .setDescription('The bot configuration is incomplete. Complete the `config.js` file and try again.')
    .setColor(color);

const noPermission = new Discord.EmbedBuilder() // 3
    .setTitle('Error')
    .setDescription('You have no permission to use this command.')
    .setColor(color);

const privateDM = new Discord.EmbedBuilder() // 4
    .setTitle('Error')
    .setDescription('Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety` to receive Direct Messages.')
    .setColor(color);

module.exports = [guildOnlyCmd, noAPIKey, noConfig, noPermission, privateDM];