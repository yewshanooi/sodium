const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Send a message with or without a spoiler')
		.addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true))
		.addBooleanOption(option => option.setName('spoiler').setDescription('Select whether message contains spoiler').setRequired(true)),
	cooldown: '3',
	guildOnly: true,
	execute (interaction, configuration, errors) {
		const messageField = interaction.options.getString('message');
		const spoilerField = interaction.options.getBoolean('spoiler');

		if (spoilerField === false) {
			const embed = new EmbedBuilder()
				.setDescription(`**${interaction.user.username} said:** ${messageField}`)
				.setColor(configuration.embedColor);
			interaction.reply({ embeds: [embed] });
        }

		if (spoilerField === true) {
			const embed = new EmbedBuilder()
                .setDescription(`**${interaction.user.username} said:** ||${messageField}||`)
                .setColor(configuration.embedColor);
            interaction.reply({ embeds: [embed] });
		}

	}
};