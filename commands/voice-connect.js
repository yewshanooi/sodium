module.exports = {
	name: 'voice-connect',
	description: 'Bot connects to a voice channel',
	cooldown: '5',
	execute (message) {
		if (message.member.voice.channel) {
			message.member.voice.channel.join();
			message.channel.send(`<@${message.author.id}>, I've successfully joined the Voice Channel!`);
		}
		else {
			message.channel.send(`<@${message.author.id}>, It seems that you are not in a Voice Channel!`);
		}
	}
};