module.exports = {
	name: 'delete',
	description: 'Delete up to 99 messages at one time',
	usage: 'delete {amount}',
	cooldown: '0',
	guildOnly: true,
	execute (message, args) {
		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.channel.send('Error: Please provide a valid number.');
		}
			else if (amount <= 1 || amount > 100) {
			return message.channel.send('Error: You need to input a number between `1` and `99`.');
		}

		message.channel.bulkDelete(amount, true).catch(error => {
			message.channel.send(`Error: There was an error trying to delete messages in this channel!\n Error: \`${error.message}\``);
		});
	}
};