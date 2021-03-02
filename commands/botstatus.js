const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'botstatus',
	description: 'Get the bot\'s current status',
	cooldown: '5',
	execute (message) {
		const embed = new MessageEmbed()
		.setTitle('Bot Status')
		.setDescription(`Bot Discriminator: \`${message.client.user.tag}\`\nTotal Users \`${message.client.users.cache.size}\`, Total Channels \`${message.client.channels.cache.size}\`, Total Guilds \`${message.client.guilds.cache.size}\``)
		.setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
	}
};