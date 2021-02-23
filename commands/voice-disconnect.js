module.exports = {
	name: 'voice-disconnect',
	description: 'Bot disconnects from a voice channel',
	execute (message) {
		if (message.member.voice.channel) {
            message.member.voice.channel.leave();
            message.channel.send(`<@${message.author.id}>, I've successfully left the voice channel!`);
        }
        else {
			message.channel.send(`<@${message.author.id}>, It seems that you are not in a Voice Channel!`);
		}
	}
};