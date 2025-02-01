const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qrcode')
		.setDescription('Generates a QR code from a link')
        .addStringOption(option => option.setName('url').setDescription('Enter a web address').setRequired(true)),
	cooldown: '10',
	category: 'Utility',
	guildOnly: false,
	execute (interaction) {
		const webAddress = interaction.options.getString('url');

		const embed = new EmbedBuilder()
			.setTitle('QR Code')
			.setImage(`https://qrtag.net/api/qr.png?url=${webAddress}`)
			.setFooter({ text: 'Powered by QRtag' })
			.setColor('#0066ff');

		interaction.reply({ embeds: [embed] });
	}
};