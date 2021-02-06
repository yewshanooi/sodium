const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'status',
	description: 'Get the bot\'s current status',
	execute (message) {
        message.channel.send(`Bot currently started with ${client.users.cache.size} users, ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
	}
};


// This command shows 0 users, 0 channels and 0 guilds (which is an error), may be something to do with `client.once('ready', () => {.....`