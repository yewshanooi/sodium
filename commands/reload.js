const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	usage: 'reload {command}',
	cooldown: '0',
	execute (message, args) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName);

		if (!command) return message.channel.send('Error: Please provide a valid command.');

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			const embed = new MessageEmbed()
				.setTitle('Reload')
				.setDescription(`Command \`${command.name}\` was reloaded!`)
				.setColor(embedColor);
			message.channel.send(embed);
		}
		catch (error) {
			message.channel.send(`Error: There was an error while reloading command \`${command.name}\`.\n Error: \`${error.message}\``);
		}
	}
};