const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Send a message with or without a spoiler')
		.addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true))
		.addStringOption(option => option.setName('spoiler').setDescription('Select whether message contains spoiler').addChoices({ name: 'No', value: 'false' }, { name: 'Yes', value: 'true' }).setRequired(true)),
	cooldown: '3',
	category: 'Fun',
	guildOnly: true,
	execute (interaction, client) {
		const messageField = interaction.options.getString('message');
		const spoilerField = interaction.options.getString('spoiler');

		const message = spoilerField === 'true' ? `||${messageField}||` : messageField;

		const embed = new EmbedBuilder()
			.setDescription(`**${interaction.user.username} said:** ${message}`)
			.setColor(client.config.embedColor);

		interaction.reply({ embeds: [embed] });
	}
};