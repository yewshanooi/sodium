const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Send a message with or without a spoiler')
		.addStringOption(option => option.setName('title').setDescription('Enter a title').setRequired(true))
		.addStringOption(option => option.setName('description').setDescription('Enter a description').setRequired(true))
		.addStringOption(option => option.setName('spoiler').setDescription('Select whether description contains spoiler').addChoices({ name: 'No', value: 'false' }, { name: 'Yes', value: 'true' }).setRequired(true)),
	cooldown: '3',
	category: 'Utility',
	guildOnly: true,
	execute (interaction, configuration) {
		const titleField = interaction.options.getString('title');
		const descriptionField = interaction.options.getString('description');
		const spoilerField = interaction.options.getString('spoiler');

		const message = spoilerField === 'true' ? `||${descriptionField}||` : descriptionField;

		const embed = new EmbedBuilder()
			.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ size: 64 })}` })
			.setTitle(`${titleField}`)
			.setDescription(`${message}`)
			.setColor(configuration.embedColor);

		interaction.reply({ embeds: [embed] });
	}
};