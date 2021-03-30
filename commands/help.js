const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List every commands or info about a specific command',
	usage: 'help || {command}',
	cooldown: '0',
	execute (message, args) {
		const { commands } = message.client;

		if (!args.length) {
			const embedUserSend = new MessageEmbed()
				.setTitle('Help')
				.setDescription(`You can send \`${prefix}help {command name}\` to get info on a specific command!`)
				.addField('Commands', commands.map(command => command.name).join(', '))
				.setColor(embedColor);

			return message.author.send(embedUserSend)
				.then(() => {
					if (message.channel.type === 'dm') return;
					const embedChannelSend = new MessageEmbed()
						.setDescription(`<@${message.author.id}>, I've sent you a DM with all the commands!`)
						.setColor(embedColor);
					message.reply(embedChannelSend);
				})
				.catch(error => {
					message.channel.send(`It seems like I can't DM you!\n Error: \`${error.message}\``);
				});
			}

		const name = args[0].toLowerCase();
		const command = commands.get(name);

			if (!command) {
				return message.reply('That is not a valid command!');
			}

			const embedCommandHelp = new MessageEmbed()
				.setTitle('Help')
				.addField('Name', `\`${command.name}\``)
				.addField('Description', `\`${command.description}\``)
				.addField('Usage', `\`${prefix}${command.usage}\``)
				.addField('Cooldown', `\`${command.cooldown || 3} second(s)\``)
				.setColor(embedColor);

			message.channel.send(embedCommandHelp);
		}
	};