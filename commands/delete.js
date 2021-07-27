const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'delete',
	description: 'Delete up to 99 messages at one time',
	usage: 'delete {amount}',
	cooldown: '0',
	guildOnly: true,
	execute (message, args) {
		if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Error: You have no permission to use this command.');
			const amount = parseInt(args[0]) + 1;
			const trueAmount = amount - 1;

			if (isNaN(amount)) return message.channel.send('Error: Please provide a valid number.');
			if (amount <= 1 || amount > 100) return message.channel.send('Error: You need to input a number between `1` and `99`.');

			const embed = new MessageEmbed()
				.setTitle('Delete')
				.setDescription(`Succesfully deleted **${trueAmount}** message(s)`)
				.setTimestamp()
				.setColor(embedColor);

			message.channel.bulkDelete(amount, true);
			message.channel.send(embed).then(msg => msg.delete({ timeout: 8000 }));
		}
};