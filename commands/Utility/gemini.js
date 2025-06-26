/* eslint-disable no-extra-parens */
const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { GoogleGenAI, HarmCategory, HarmBlockThreshold } = require('@google/genai');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gemini')
		.setDescription('Chat with Gemini, an AI-powered chatbot by Google'),
	cooldown: '5',
	category: 'Utility',
	guildOnly: false,
	async execute (interaction) {
        if (!process.env.GOOGLE_API_KEY) return interaction.reply({ embeds: [global.errors[1]] });

        const modal = new ModalBuilder()
            .setCustomId(`gmiModal-${interaction.id}`)
            .setTitle('Gemini');

        const queryField = new TextInputBuilder()
            .setCustomId('gmiQuery')
            .setLabel('Prompt')
            .setPlaceholder('Enter a prompt here')
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1024)
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(queryField);
            modal.addComponents(actionRow);

        await interaction.showModal(modal);

        try {
            const modalResponse = await interaction.awaitModalSubmit({
                filter: ft => ft.customId === `gmiModal-${interaction.id}` && ft.user.id === interaction.user.id,
                // 300 seconds timeout
                time: 300000
            });

            if (modalResponse.isModalSubmit()) {
                await modalResponse.deferReply();

                const description = modalResponse.fields.getTextInputValue('gmiQuery');

                const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [{ role: 'user', parts: [{ text: description }] }],

                    // Grounding with Google Search & Dynamic Thinking
                    config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: -1 } },

                    generationConfig: { temperature: 1, topP: 0.95, topK: 40, candidateCount: 1, maxOutputTokens: 1024 },
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_UNSPECIFIED, threshold: HarmBlockThreshold.BLOCK_NONE }
                    ]
                });

                if (response.candidates[0].finishReason === 'SAFETY' || response.candidates[0].finishReason === 'RECITATION') {
                    return modalResponse.editReply({ content: `Error: This response is blocked due to **${response.candidates[0].finishReason}** violation.` });
                }

                const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);


                // Add citations to response
                function addCitations(response) {
                    let text = response.text;
                    const supports = response.candidates[0]?.groundingMetadata?.groundingSupports || [];
                    const chunks = response.candidates[0]?.groundingMetadata?.groundingChunks || [];

                    const references = new Map();

                    // Sort supports by end_index in descending order
                    const sortedSupports = supports.filter(support => support.segment?.endIndex !== undefined && support.groundingChunkIndices?.length)
                                                   .sort((a, b) => (b.segment.endIndex ?? 0) - (a.segment.endIndex ?? 0));

                    for (const support of sortedSupports) {
                        for (const i of support.groundingChunkIndices) {
                            const uri = chunks[i]?.web?.uri;
                            if (uri && !references.has(uri)) {
                                references.set(uri, references.size + 1);
                                if (references.size >= 5) break;
                            }
                        }
                        if (references.size >= 5) break;
                    }

                    if (references.size > 0) {
                        text += `\n\n**References:**\n`;
                        text += [...references].map(([uri, index]) => `[${index}](${uri})`).join(', ');
                    }

                    return text;
                }


                const embed = new EmbedBuilder()
                    .setTitle(`${trim(description, 256)}`)
                    .setDescription(`${trim(addCitations(response), 4096)}`)
                    .setFooter({ text: 'Powered by Google' })
                    .setColor('#669df6');

                return modalResponse.editReply({ embeds: [embed] });
            }
        } catch (err) {
            console.error(err);
        }

    }
};

/*
 * Model Responses: https://ai.google.dev/api?lang=node
 * Model Versions: https://ai.google.dev/gemini-api/docs/models
 */

/*
 * Use this code block for further debugging:
 *
 *  return modalResponse.editReply({ embeds: [embed] }).then(
 *      console.log(result.response),
 *      console.log(result.response.candidates[0].safetyRatings)
 *  );
 */