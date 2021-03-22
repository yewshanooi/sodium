const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List every commands or info about a specific command',
	aliases: ['commands'],
	usage: '{command}',
	cooldown: '0',
	execute (message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Here\'s a list of all the commands: \n');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${prefix}help {command name}\` to get info on a specific command!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a D with all the commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('It seems like I can\'t DM you!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(com => com.aliases && com.aliases.includes(name));

		if (!command) {
			return message.reply('That is not a valid command!');
		}

		if (command.aliases) data.push(`**Name** : \`${command.name}\``);
		if (command.aliases) data.push(`**Aliases** : \`${command.aliases.join(', ')}\``);
		if (command.description) data.push(`**Description** : \`${command.description}\``);
		if (command.usage) data.push(`**Usage** : \`${prefix}${command.name} ${command.usage}\``);
		if (command.cooldown) data.push(`**Cooldown** : \`${command.cooldown || 3} second(s)\``);

		message.channel.send(data, { split: true });
	}
};