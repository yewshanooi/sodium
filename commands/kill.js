module.exports = {
	name: 'kill',
	description: 'Terminates the bot',
	execute (message) {
			message.client.destroy();
	}
};

// Need to make a command to terminate the bot then restart it using token