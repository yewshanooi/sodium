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
			.addFields(
				{ name: 'Name', value: `\`${interaction.guild.name}\``, inline: true },
                { name: 'Creation Date & Time', value: `\`${interaction.guild.createdAt}\`` },
				{ name: 'Members', value: `\`${interaction.guild.memberCount}\``, inline: true },
				{ name: 'Channels', value: `\`${interaction.guild.channels.cache.filter(ch => ch.type !== 'category').size}\``, inline: true },
				{ name: 'ID', value: `\`${interaction.guild.id}\``, inline: true },
				{ name: 'Language', value: `\`${interaction.guild.preferredLocale}\``, inline: true },
				{ name: '2FA', value: `\`${resultMFA}\``, inline: true },
				{ name: 'Partnered', value: `\`${resultPartner}\``, inline: true },
				{ name: 'Total Boosts', value: `\`${interaction.guild.premiumSubscriptionCount}\`` },
                { name: 'Boost Level', value: `\`${resultPremium}\`` }
            )
			.setColor(embedColor);
		interaction.reply({ embeds: [embed] });
	}
};