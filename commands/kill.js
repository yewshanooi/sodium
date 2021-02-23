module.exports = {
	name: 'kill',
	description: 'Terminates the bot',
	execute (message) {
		message.channel.awaitMessages(msg => msg.author.id === message.author.id, { max: 1,
			time: 5000 }).then(collected => {
					if (collected.first().content.toLowerCase() === 'yes') {
							message.reply('Shutting down...');
							message.client.destroy();
					}
					else message.reply('Operation canceled.');
			}).catch(() => {
					message.reply('No answer after 5 seconds, operation canceled.');
			});
		}
};

// Need to make a command to terminate the bot then restart it using token