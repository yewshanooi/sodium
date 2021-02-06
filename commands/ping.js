module.exports = {
	name: 'ping',
	description: 'Calculates the API\'s Latency',
	execute (message) {
	message.channel.send('*Latency is being calculated...*').then(msg => {
		const ping = msg.createdTimestamp - message.createdTimestamp;
		message.channel.send(`**API Latency is:** ${ping}ms`);
		});
	}
};