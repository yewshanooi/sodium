const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	usage: 'reload {command}',
	cooldown: '0',
	args: true,
	execute (message, args) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName);

		if (!command) {
			return message.channel.send(`Error: There is no such command with name \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			const embed = new MessageEmbed()
				.setTitle('Reload')
				.setDescription(`Command \`${command.name}\` was reloaded!`)
				.setTimestamp()
				.setColor(embedColor);
			message.channel.send(embed);
		}
		catch (error) {
			message.channel.send(`Error: There was an error while reloading command \`${command.name}\`:\n\`${error.message}\``);
		}
	}
};