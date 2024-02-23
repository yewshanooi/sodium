/* eslint-disable no-extra-parens */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gemini')
		.setDescription('Chat with an AI bot powered by Gemini')
		.addStringOption(option => option.setName('query').setDescription('Enter a query (max 1024 characters)').setMaxLength(1024).setRequired(true)),
	cooldown: '5',
	category: 'Utility',
	guildOnly: false,
	async execute (interaction) {
		if (!process.env.GOOGLE_API_KEY) return interaction.reply({ embeds: [global.errors[1]] });

		await interaction.deferReply();

		const queryField = interaction.options.getString('query');

		const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
			const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

			const result = await model.generateContent({
				contents: [{ role: 'USER', parts: [{ text: queryField }] }],
				generationConfig: { temperature: 0.5, topP: 0.5, topK: 20, maxOutputTokens: 1024 },
				safetySettings: [
					{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
					{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
					{ category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
					{ category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE }
				]
			});

			const { totalTokens } = await model.countTokens(queryField);

		// blockReason === 'SAFETY' will only work if safetySettings above is other than BLOCK_NONE
		if (result.response.promptFeedback.blockReason === 'SAFETY') {
			return interaction.editReply({ content: `Error: This response is blocked due to \`${result.response.promptFeedback.blockReason}\` violation.` });
		}

		if (result.response.candidates[0].finishReason === 'RECITATION') {
			return interaction.editReply({ content: `Error: This response is blocked due to \`${result.response.candidates[0].finishReason}\` violation.` });
		}

		const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
		const capitalizedTitle = queryField.charAt(0).toUpperCase() + queryField.slice(1);

		const embed = new EmbedBuilder()
			.setTitle(`${trim(capitalizedTitle, 256)}`)
			.setDescription(`${trim(result.response.text(), 4096)}`)
			.setFooter({ text: `Prompt Tokens: ${totalTokens}\nPowered by Google` })
			.setColor('#4fabff');

		return interaction.editReply({ embeds: [embed] });
	}
};

// Response Docs: https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini.

/*
 * Use this code block to debug errors:
 *
 * return interaction.editReply({ embeds: [embed] }).then(
 *  console.log(result.response),
 *  console.log(result.response.promptFeedback),
 *  console.log(result.response.candidates[0].finishReason),
 *  console.log(result.response.candidates[0].safetyRatings)
 * );
 */

// Sometimes this "GoogleGenerativeAIError: [500 Internal Server Error] An internal error has occurred. Please retry or report in https://developers.generativeai.google/guide/troubleshooting" error might occur.