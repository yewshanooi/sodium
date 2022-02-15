const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guildinfo')
		.setDescription('Display information(s) about the guild'),
	cooldown: '3',
	guildOnly: true,
	execute (interaction) {
		const { mfaLevel } = interaction.guild;
		let resultMFA;
			if (mfaLevel === 'NONE') resultMFA = 'Disabled';
			if (mfaLevel === 'ELEVATED') resultMFA = 'Enabled';

		const { partnered } = interaction.guild;
		let resultPartner;
			if (partnered === true) resultPartner = 'Yes';
			else resultPartner = 'No';

		const { premiumTier } = interaction.guild;
		let resultPremium;
			if (premiumTier === 'NONE') resultPremium = 'None';
			if (premiumTier === 'TIER_1') resultPremium = 'Tier 1';
			if (premiumTier === 'TIER_2') resultPremium = 'Tier 2';
			if (premiumTier === 'TIER_3') resultPremium = 'Tier 3';

		const resultRoles = interaction.guild.roles.cache.size - 1;

		const embed = new MessageEmbed()
			.setTitle(`${interaction.guild.name}`)
			.addFields(
				{ name: 'Language', value: `\`${interaction.guild.preferredLocale}\``, inline: true },
				{ name: '2FA', value: `\`${resultMFA}\``, inline: true },
				{ name: 'ID', value: `\`${interaction.guild.id}\``, inline: true },
				{ name: 'Creation Date & Time', value: `\`${interaction.guild.createdAt}\`` },
				{ name: 'Members', value: `\`${interaction.guild.memberCount}\``, inline: true },
				{ name: 'Channels', value: `\`${interaction.guild.channels.cache.filter(ch => ch.type !== 'category').size}\``, inline: true },
				{ name: 'Roles', value: `\`${resultRoles}\``, inline: true },
				{ name: 'Partnered', value: `\`${resultPartner}\``, inline: true },
				{ name: 'Total Boosts', value: `\`${interaction.guild.premiumSubscriptionCount}\``, inline: true },
				{ name: 'Boost Level', value: `\`${resultPremium}\``, inline: true }
			)
			.setColor(embedColor);
		interaction.reply({ embeds: [embed] });
	}
};