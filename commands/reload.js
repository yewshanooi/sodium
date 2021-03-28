const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	cooldown: '0',
	usage: '{command}',
	args: true,
	execute (message, args) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
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
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	}
};