const { EmbedBuilder, SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Remove messages from the guild text channel')
		.addIntegerOption(option => option.setName('amount').setDescription('Enter an amount (between 1 and 99)').setMinValue(1).setMaxValue(99).setRequired(true)),
	cooldown: '10',
	category: 'Moderation',
	guildOnly: true,
	execute (interaction, configuration) {
		if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Messages** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ embeds: [global.errors[2]] });

		const amountField = interaction.options.getInteger('amount');

			const embed = new EmbedBuilder()
				.setDescription(`Succesfully removed **${amountField}** message(s)`)
				.setColor(configuration.embedColor);
			interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).then(interaction.channel.bulkDelete(amountField, true));
		}
};