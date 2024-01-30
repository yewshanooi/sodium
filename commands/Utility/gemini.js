/* eslint-disable no-extra-parens */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gemini')
		.setDescription('Chat with an AI bot powered by Google\'s Gemini Pro language model')
		.addStringOption(option => option.setName('query').setDescription('Enter a query (max 1024 characters)').setMaxLength(1024).setRequired(true)),
	cooldown: '10',
	category: 'Utility',
	guildOnly: false,
	async execute (interaction) {
		if (!process.env.GOOGLE_API_KEY) return interaction.reply({ embeds: [global.errors[1]] });

		await interaction.deferReply();

		const queryField = interaction.options.getString('query');

		const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
			const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

			const generationConfig = {
				temperature: 0.5,
				topP: 0.5,
				topK: 20,
				maxOutputTokens: 1024
			};

			const safetySettings = [
				{
					category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
					threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
				},
				{
					category: HarmCategory.HARM_CATEGORY_HARASSMENT,
					threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
				},
				{
					category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
					threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
				},
				{
					category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
					threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
				}
			];

			const result = await model.generateContent({
				contents: [{ role: 'USER', parts: [{ text: queryField }] }],
				generationConfig,
				safetySettings
			});

		if (result.response.promptFeedback.blockReason === 'SAFETY' || result.response.promptFeedback.blockReason === 'BLOCKED_REASON_UNSPECIFIED' || result.response.promptFeedback.blockReason === 'OTHER') {
			return interaction.editReply({ content: `Error: This response is blocked due to \`${result.response.promptFeedback.blockReason}\` violation.` });
		}

		const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

		const capitalizedTitle = queryField.charAt(0).toUpperCase() + queryField.slice(1);

		const embed = new EmbedBuilder()
			.setTitle(`${trim(capitalizedTitle, 256)}`)
			.setDescription(`${trim(result.response.text(), 4096)}`)
			.setFooter({ text: 'Powered by Google' })
			.setColor('#4fabff');

		return interaction.editReply({ embeds: [embed] });
	}
};

// Use 'console.log(result.response.promptFeedback)' to get the safety rating probability for each category.