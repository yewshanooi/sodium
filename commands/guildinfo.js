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
		let resultMfaLevel;
			if (mfaLevel === 'NONE') resultMfaLevel = 'Disabled';
			if (mfaLevel === 'ELEVATED') resultMfaLevel = 'Enabled';

		const { partnered } = interaction.guild;
		let resultPartnered;
			if (partnered === true) resultPartnered = 'Yes';
			else resultPartnered = 'No';

		const { premiumTier } = interaction.guild;
		let resultPremiumTier;
			if (premiumTier === 'NONE') resultPremiumTier = 'None';
			if (premiumTier === 'TIER_1') resultPremiumTier = 'Level 1';
			if (premiumTier === 'TIER_2') resultPremiumTier = 'Level 2';
			if (premiumTier === 'TIER_3') resultPremiumTier = 'Level 3';

		const totalRoles = interaction.guild.roles.cache.size - 1;

		const embed = new MessageEmbed()
			.setTitle(`${interaction.guild.name}`)
			.addFields(
				{ name: 'Language', value: `\`${interaction.guild.preferredLocale}\``, inline: true },
				{ name: '2FA', value: `\`${resultMfaLevel}\``, inline: true },
				{ name: 'ID', value: `\`${interaction.guild.id}\``, inline: true },
				{ name: 'Creation Date & Time', value: `\`${interaction.guild.createdAt}\`` },
				{ name: 'Members', value: `\`${interaction.guild.memberCount}\``, inline: true },
				{ name: 'Channels', value: `\`${interaction.guild.channels.cache.filter(ch => ch.type !== 'category').size}\``, inline: true },
				{ name: 'Roles', value: `\`${totalRoles}\``, inline: true },
				{ name: 'Partnered', value: `\`${resultPartnered}\``, inline: true },
				{ name: 'Total Boosts', value: `\`${interaction.guild.premiumSubscriptionCount}\``, inline: true },
				{ name: 'Boost Level', value: `\`${resultPremiumTier}\``, inline: true }
			)
			.setColor(embedColor);
		interaction.reply({ embeds: [embed] });
	}
};