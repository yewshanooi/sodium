module.exports = {
	name: 'bot-status',
	description: 'Get the bot\'s current status',
	cooldown: '5',
	execute (message) {
        message.channel.send(`Bot Discriminator: \`${message.client.user.tag}\`\nTotal Users \`${message.client.users.cache.size}\`, Total Channels \`${message.client.channels.cache.size}\`, Total Guilds \`${message.client.guilds.cache.size}\``);
	}
};