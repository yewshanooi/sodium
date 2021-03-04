const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'vdisconnect',
	description: 'Bot disconnects from a voice channel',
	cooldown: '5',
	execute (message) {
		if (message.member.voice.channel) {
            message.member.voice.channel.leave();
			const embed = new MessageEmbed()
				.setDescription(`<@${message.author.id}>, I've successfully left the voice channel!`)
				.setColor(message.guild.me.displayHexColor);
			message.channel.send(embed);
        }
        if (!message.member.voice.channel) {
			const embed2 = new MessageEmbed()
				.setDescription(`<@${message.author.id}>, It seems that you are not in a Voice Channel!`)
				.setColor(message.guild.me.displayHexColor);
			message.channel.send(embed2);
		}
	}
};