const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'help',
	aliases: ['commands'],
	description: 'List every commands or info about a specific command',
	cooldown: '0',
	usage: '{command}',
	execute (message, args) {
		const { commands } = message.client;

		if (!args.length) {
			const embed = new MessageEmbed()
				.setTitle('Help')
				.setDescription(`You can send \`${prefix}help {command name}\` to get info on a specific command!`)
				.addField('Commands', commands.map(command => command.name).join(', '))
				.setColor(embedColor);

			return message.author.send(embed)
				.then(() => {
					if (message.channel.type === 'dm') return;
					const embed2 = new MessageEmbed()
						.setDescription(`<@${message.author.id}>, I've sent you a DM with all the commands!`)
						.setColor(embedColor);
					message.reply(embed2);
				})
				.catch(error => {
					message.channel.send(`It seems like I can't DM you!\n Error: \`${error.message}\``);
				});
			}

		const data = [];
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(com => com.aliases && com.aliases.includes(name));

			if (!command) {
				return message.reply('That is not a valid command!');
			}

			if (command.name) data.push(`**Name** - \`${command.name}\``);
			if (command.aliases) data.push(`**Aliases** - \`${command.aliases.join(', ')}\``);
			if (command.description) data.push(`**Description** - \`${command.description}\``);
			if (command.cooldown) data.push(`**Cooldown** - \`${command.cooldown || 3} second(s)\``);
			if (command.usage) data.push(`**Usage** - \`${prefix}${command.name} ${command.usage}\``);

			message.channel.send(data, { split: true });
		}
	};