const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'guildinfo',
	description: 'Display information(s) about the guild',
	usage: 'guildinfo',
	cooldown: '5',
	guildOnly: true,
	execute (message) {
		const MFA = message.guild.mfaLevel;
		let resultMFA;
			if (MFA === 1) resultMFA = 'Enabled';
			else resultMFA = 'Disabled';

		const partnered = message.guild;
		let resultPartner;
			if (partnered === true) resultPartner = 'Yes';
			else resultPartner = 'No';

		const embed = new MessageEmbed()
			.setTitle('Guild Info')
			.addField('Name', `\`${message.guild.name}\``, true)
			.addField('Region', `\`${message.guild.region}\``, true)
			.addField('Creation Date & Time', `\`${message.guild.createdAt}\``)
			.addField('Members', `\`${message.guild.memberCount}\``, true)
			.addField('Channels', `\`${message.guild.channels.cache.filter(ch => ch.type !== 'category').size}\``, true)
			.addField('ID', `\`${message.guild.id}\``, true)
			.addField('2FA', `\`${resultMFA}\``, true)
			.addField('Partnered', `\`${resultPartner}\``, true)
			.addField('Language', `\`${message.guild.preferredLocale}\``, true)
			.addField('Total Boosts', `\`${message.guild.premiumSubscriptionCount}\``, true)
			.addField('Boost Level', `\`${message.guild.premiumTier}\``, true)
			.setColor(embedColor);
		message.channel.send(embed);
	}
};