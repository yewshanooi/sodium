module.exports = {
	name: 'say',
	description: 'Get the bot to say your message',
	usage: '{message}',
	execute (message, args) {
        const sayMessage = args.join(' ');
        message.delete().catch(() => {});
        message.channel.send(sayMessage);
	}
};