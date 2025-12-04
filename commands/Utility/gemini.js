const { EmbedBuilder, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder, TextDisplayBuilder } = require('discord.js');
const { GoogleGenAI, HarmCategory, HarmBlockThreshold } = require('@google/genai');

const randomQueries = [
    // What..? questions
    'What is the meaning of life?',
    'What are the latest advancements in AI?',
    'What are some tips for improving mental health?',
    'What is the future of renewable energy?',
    'What are the benefits of meditation?',
    'What are the top trends in technology for the next decade?',
    'What are the best practices for personal productivity?',
    'What are the benefits of space exploration?',
    'What are the key principles of effective leadership?',

    // Can..? questions
    'Can you explain quantum mechanics in simple terms?',
    'Can you explain the theory of relativity?',
    'Can you explain how the internet works?',
    'Can you explain the concept of quantum computing?',

    // How..? questions
    'How does blockchain technology work?',
    'How do black holes work?',
    'How can we combat climate change effectively?',
    'How do vaccines work?',
    'How does the human immune system function?'
];

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

        const queryInput = new TextInputBuilder()
            .setCustomId('gmiQuery')
            .setPlaceholder(randomQueries[Math.floor(Math.random() * randomQueries.length)])
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1024)
            .setRequired(true);

        const queryLabel = new LabelBuilder()
            .setLabel('Prompt')
            .setTextInputComponent(queryInput);

        const disclaimer = new TextDisplayBuilder().setContent(
            '-# Gemini can make mistakes, so double-check it'
        );

        modal.addLabelComponents(queryLabel).addTextDisplayComponents(disclaimer);

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
                function addCitations(res) {
                    const { text: originalText, candidates } = res;
                    const supports = candidates[0]?.groundingMetadata?.groundingSupports || [];
                    const chunks = candidates[0]?.groundingMetadata?.groundingChunks || [];

                    const references = new Map();
                    supports
                        .filter(support => support.segment?.endIndex !== undefined && support.groundingChunkIndices?.length)
                        .sort((a, b) => (b.segment.endIndex ?? 0) - (a.segment.endIndex ?? 0))
                        .forEach(support => {
                            support.groundingChunkIndices.forEach(i => {
                                const uri = chunks[i]?.web?.uri;
                                if (uri && references.size < 3 && !references.has(uri)) {
                                    references.set(uri, references.size + 1);
                                }
                            });
                        });

                    const referencesText = references.size ? `\n\n**References:**\n${[...references].map(([uri, index]) => `[${index}](${uri})`).join(', ')}` : '';

                    // Ensure response text fits within description limit
                    const maxLength = 4096;
                    const availableLength = maxLength - referencesText.length;
                    const trimmedText = originalText.length > availableLength ? `${originalText.slice(0, availableLength - 3)}...` : originalText;

                    return trimmedText + referencesText;
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