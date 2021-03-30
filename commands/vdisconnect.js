const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'vdisconnect',
	description: 'Bot disconnects from a voice channel',
	usage: 'vdisconnect',
	cooldown: '3',
	guildOnly: true,
	execute (message) {
		if (message.member.voice.channel) {
            message.member.voice.channel.leave();
			const embed = new MessageEmbed()
				.setTitle('Voice Disconnect')
				.setDescription(`<@${message.author.id}>, I've successfully left the voice channel!`)
				.setColor(embedColor);
			message.channel.send(embed);
        }
        if (!message.member.voice.channel) {
			const embed = new MessageEmbed()
				.setTitle('Voice Disconnect')
				.setDescription(`<@${message.author.id}>, It seems that you are not in a Voice Channel!`)
				.setColor(embedColor);
			message.channel.send(embed);
		}
	}
};