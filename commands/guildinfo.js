const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guildinfo')
		.setDescription('Display information(s) about the guild'),
	cooldown: '5',
	guildOnly: true,
	execute (interaction) {
		const MFA = interaction.guild.mfaLevel;
		let resultMFA;
			if (MFA === 1) resultMFA = 'Enabled';
			else resultMFA = 'Disabled';

		const partnered = interaction.guild;
		let resultPartner;
			if (partnered === true) resultPartner = 'Yes';
			else resultPartner = 'No';

		const premium = interaction.guild.premiumTier;
		let resultPremium;
			if (premium === 'NONE') resultPremium = 'None';
			if (premium === 'TIER_1') resultPremium = 'Tier 1';
			if (premium === 'TIER_2') resultPremium = 'Tier 2';
			if (premium === 'TIER_3') resultPremium = 'Tier 3';

		const embed = new MessageEmbed()
			.setTitle('Guild Info')
			.addField('Name', `\`${interaction.guild.name}\``, true)
			.addField('Creation Date & Time', `\`${interaction.guild.createdAt}\``)
			.addField('Members', `\`${interaction.guild.memberCount}\``, true)
			.addField('Channels', `\`${interaction.guild.channels.cache.filter(ch => ch.type !== 'category').size}\``, true)
			.addField('ID', `\`${interaction.guild.id}\``, true)
			.addField('Language', `\`${interaction.guild.preferredLocale}\``, true)
			.addField('2FA', `\`${resultMFA}\``, true)
			.addField('Partnered', `\`${resultPartner}\``, true)
			.addField('Total Boosts', `\`${interaction.guild.premiumSubscriptionCount}\``)
			.addField('Boost Level', `\`${resultPremium}\``)
			.setColor(embedColor);
		interaction.reply({ embeds: [embed] });
	}
};