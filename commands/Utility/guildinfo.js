const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guildinfo')
		.setDescription('Display information about the guild'),
	cooldown: '3',
	category: 'Utility',
	guildOnly: true,
	execute (interaction, configuration) {
		const { mfaLevel } = interaction.guild;
		let resultMfaLevel;
			if (mfaLevel === 0) resultMfaLevel = 'Disabled';
			if (mfaLevel === 1) resultMfaLevel = 'Enabled';

		const totalRoles = interaction.guild.roles.cache.size - 1;

		const { partnered } = interaction.guild;
		let resultPartnered;
			if (partnered === true) resultPartnered = 'Yes';
			else resultPartnered = 'No';

		const { verified } = interaction.guild;
		let resultVerified;
			if (verified === true) resultVerified = 'Yes';
			else resultVerified = 'No';

		const { premiumTier } = interaction.guild;
		let resultPremiumTier;
			if (premiumTier === 0) resultPremiumTier = 'Unboosted';
			if (premiumTier === 1) resultPremiumTier = 'Level 1';
			if (premiumTier === 2) resultPremiumTier = 'Level 2';
			if (premiumTier === 3) resultPremiumTier = 'Level 3';

		const { verificationLevel } = interaction.guild;
		let resultVerificationLevel;
			if (verificationLevel === 0) resultVerificationLevel = 'None';
			if (verificationLevel === 1) resultVerificationLevel = 'Low';
			if (verificationLevel === 2) resultVerificationLevel = 'Medium';
			if (verificationLevel === 3) resultVerificationLevel = 'High';
			if (verificationLevel === 4) resultVerificationLevel = 'Highest';

		const { explicitContentFilter } = interaction.guild;
		let resultExplicitContentFilter;
			if (explicitContentFilter === 0) resultExplicitContentFilter = 'Disabled';
			if (explicitContentFilter === 1) resultExplicitContentFilter = 'Members Without Roles';
			if (explicitContentFilter === 2) resultExplicitContentFilter = 'All Members';

		const embed = new EmbedBuilder()
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
				{ name: 'Verified', value: `\`${resultVerified}\``, inline: true },
				{ name: 'Boost Level', value: `\`${resultPremiumTier}\``, inline: true },
				{ name: 'Verification Level', value: `\`${resultVerificationLevel}\``, inline: true },
				{ name: 'Explicit Image Filter', value: `\`${resultExplicitContentFilter}\``, inline: true }
			)
			.setColor(configuration.embedColor);
		interaction.reply({ embeds: [embed] });
	}
};