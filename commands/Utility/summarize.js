const fs = require('fs').promises;
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { env, pipeline } = require('@huggingface/transformers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('summarize')
        .setDescription('Summarize text on-device using Machine Learning')
        .addStringOption(option => option.setName('query').setDescription('Enter a query (max 3072 characters)').setMaxLength(3072).setRequired(true)),
    cooldown: '10',
    category: 'Utility',
    guildOnly: false,
    async execute (interaction) {
        await interaction.deferReply();

        const queryField = interaction.options.getString('query');

        const model = "facebook/bart-large-cnn";

        try {
            await fs.access(`./models/${model}`);
        } catch (err) {
            return interaction.editReply({ content: 'Error: The model is unavailable. Please ensure it is properly installed in the correct path.' });
        }

        env.localModelPath = './models';
        env.allowRemoteModels = false;

        try {
            // Summarization runtime timer start
            const start = Date.now();

            const pipe = await pipeline('summarization', model, {
                dtype: 'fp32',
                device: 'cpu'
            });

            const result = await pipe(queryField, {
                min_length: 1,
                // 20% of the original text max characters
                max_length: 614
            });

            // Summarization runtime timer end
            const runtime = ((Date.now() - start) / 1000).toFixed(2);

            const embed = new EmbedBuilder()
                .setTitle('Summarize')
                .setDescription(`${result[0].summary_text}`)
                .setFooter({ text: `Model: ${model}\nRuntime: ${runtime}s\nPowered by Hugging Face` })
                .setColor('#ff9d00');

            return interaction.editReply({ embeds: [embed] });

            } catch (err) {
                console.error(err);
                return interaction.editReply({ content: 'Error: An error has occurred while trying to process your request.' });
        }

    }
};

// Alternative models: t5-small, t5-base, distilbart-cnn-6-6