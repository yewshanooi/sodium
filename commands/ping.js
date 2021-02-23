module.exports = {
	name: 'ping',
	description: 'Calculates the API\'s Latency',
	cooldown: '5',
	execute (message) {
	message.channel.send('*Calculating latency...*').then(msg => {
		const ping = msg.createdTimestamp - message.createdTimestamp;
		message.channel.send(`API Latency is \`${ping}ms\``);
		});
	}
};