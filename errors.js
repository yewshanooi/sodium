const Discord = require('discord.js');

const guildOnlyCmd = new Discord.EmbedBuilder()         // global.errors[0]
    .setTitle('Error')
    .setDescription('This command cannot be executed in Direct Messages.')
    .setColor('#ff5555');

const noAPIKey = new Discord.EmbedBuilder()             // global.errors[1]
    .setTitle('Error')
    .setDescription('No API key found. Please set one in the `.env` file to use this command.')
    .setColor('#ff5555');

const noPermission = new Discord.EmbedBuilder()         // global.errors[2]
    .setTitle('Error')
    .setDescription('You have no permission to use this command.')
    .setColor('#ff5555');

const noPrivateDM = new Discord.EmbedBuilder()          // global.errors[3]
    .setTitle('Error')
    .setDescription('Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety` to receive Direct Messages.')
    .setColor('#ff5555');

const executeFailCmd = new Discord.EmbedBuilder()       // global.errors[4]
    .setTitle('Error')
    .setDescription('There was an error while executing this command.')
    .setColor('#ff5555');

const noLogSchema = new Discord.EmbedBuilder()           // global.errors[5]
    .setTitle('Error')
    .setDescription('No existing moderation logs found. Guild administrator must run `/log initialize` to use this command.')
    .setColor('#ff5555');

module.exports = [guildOnlyCmd, noAPIKey, noPermission, noPrivateDM, executeFailCmd, noLogSchema];