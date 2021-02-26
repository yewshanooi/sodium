module.exports = {
	name: 'kill',
	description: 'Terminates the bot',
	cooldown: '300',
	execute (message) {
		message.channel.send('Terminating bot...');
			message.client.destroy();
			process.exit(0);
	}
};

// Only works when starting bot with "node index.js", doesn't work with nodemon!