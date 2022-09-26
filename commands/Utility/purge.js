const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Remove messages from the guild text channel')
		.addIntegerOption(option => option.setName('amount').setDescription('Enter an amount (between 1 and 99)').setRequired(true)),
	cooldown: '10',
	category: 'Utility',
	guildOnly: true,
	execute (interaction, configuration) {
		if (!interaction.guild.members.me.permissions.has('ManageMessages')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Messages** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has('ManageMessages')) return interaction.reply({ embeds: [global.errors[3]] });

		const amountField = interaction.options.getInteger('amount');
			if (amountField < 1 || amountField > 99) return interaction.reply({ content: 'Error: You need to input a valid integer between `1` and `99`.' });

			const successEmbed = new EmbedBuilder()
				.setDescription(`Succesfully removed **${amountField}** message(s)`)
				.setColor(configuration.embedColor);
			interaction.reply({ embeds: [successEmbed], ephemeral: true }).then(interaction.channel.bulkDelete(amountField, true));
		}
};