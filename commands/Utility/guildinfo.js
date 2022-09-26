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

		const { partnered } = interaction.guild;
		let resultPartnered;
			if (partnered === true) resultPartnered = 'Yes';
			else resultPartnered = 'No';

		const { premiumTier } = interaction.guild;
		let resultPremiumTier;
			if (premiumTier === 0) resultPremiumTier = 'None';
			if (premiumTier === 1) resultPremiumTier = 'Level 1';
			if (premiumTier === 2) resultPremiumTier = 'Level 2';
			if (premiumTier === 3) resultPremiumTier = 'Level 3';

		const totalRoles = interaction.guild.roles.cache.size - 1;

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
				{ name: 'Total Boosts', value: `\`${interaction.guild.premiumSubscriptionCount}\``, inline: true },
				{ name: 'Boost Level', value: `\`${resultPremiumTier}\``, inline: true }
			)
			.setColor(configuration.embedColor);
		interaction.reply({ embeds: [embed] });
	}
};