const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List every commands or detailed info about a specific command',
	usage: 'help <command>',
	cooldown: '0',
	execute (message, args) {
		const { commands } = message.client;

		if (!args.length) {
			const embed = new MessageEmbed()
				.setTitle('Help')
				.setDescription(`Use \`${prefix}help {command}\` to get info on a specific command`)
				.addField('Commands', commands.map(command => command.name).join(', '))
				.setColor(embedColor);

			return message.author.send({ embeds: [embed] })
				.then(() => {
					if (message.channel.type === 'DM') return;
					const embedDM = new MessageEmbed()
						.setTitle('Help')
						.setDescription(`<@${message.author.id}>, I've sent you a DM with all the commands!`)
						.setColor(embedColor);
					message.channel.send({ embeds: [embedDM] });
				})
				.catch(error => {
					message.channel.send(`Error: It seems like I can't DM you!\nError: \`${error.message}\``);
				});
			}

		const name = args[0].toLowerCase();
		const command = commands.get(name);

			if (!command) return message.channel.send('Error: Please provide a valid command.');

			const guildOnlyCommand = command.guildOnly;
			let resultGuildOnly;
				if (guildOnlyCommand === true) resultGuildOnly = 'True';
				else resultGuildOnly = 'False';

			const embed = new MessageEmbed()
				.setTitle('Help')
				.addField('Name', `\`${command.name}\``)
				.addField('Description', `\`${command.description}\``)
				.addField('Usage', `\`${prefix}${command.usage}\``)
				.addField('Cooldown', `\`${command.cooldown || 3} second(s)\``)
				.addField('Guild Only', `\`${resultGuildOnly}\``)
				.setColor(embedColor);
			message.channel.send({ embeds: [embed] });
		}
	};