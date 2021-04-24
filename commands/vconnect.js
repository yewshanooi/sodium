const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'vconnect',
	description: 'Bot connects to a voice channel',
	usage: 'vconnect',
	cooldown: '0',
	guildOnly: true,
	execute (message) {
		if (message.member.voice.channel) {
			message.member.voice.channel.join();
			const embed = new MessageEmbed()
				.setTitle('Voice Connect')
				.setDescription(`<@${message.author.id}>, I've successfully joined the Voice Channel!`)
				.setColor(embedColor);
			message.channel.send(embed);
		}
		if (!message.member.voice.channel) {
			const embed = new MessageEmbed()
				.setTitle('Voice Connect')
				.setDescription(`<@${message.author.id}>, It seems that you are not in a Voice Channel!`)
				.setColor(embedColor);
			message.channel.send(embed);
		}
	}
};