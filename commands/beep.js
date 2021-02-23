module.exports = {
	name: 'beep',
	description: 'Boop!',
	execute (message) {
		message.channel.send('*Boop.*');
	}
};