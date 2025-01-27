const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { env, pipeline } = require('@huggingface/transformers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('summarize')
        .setDescription('Summarize text with BART, a NLP model by Facebook')
        .addStringOption(option => option.setName('query').setDescription('Enter a query (max 3072 characters)').setMaxLength(3072).setRequired(true)),
    cooldown: '5',
    category: 'Utility',
    guildOnly: false,
    async execute (interaction) {
        await interaction.deferReply();

		const queryField = interaction.options.getString('query');

        try {
            env.localModelPath = './models';
            env.allowRemoteModels = false;

            const model = "facebook/bart-large-cnn";

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
            const end = Date.now();
            const runtime = Math.ceil((end - start) / 10) / 100;

            const embed = new EmbedBuilder()
                .setTitle('Summarize')
                .setDescription(`${result[0].summary_text}`)
                .setFooter({ text: `Model: facebook/bart-large-cnn\nRuntime: ${runtime}s\nPowered by Hugging Face` })
                .setColor('#ff9d00');

            return interaction.editReply({ embeds: [embed] });

            } catch (err) {
                console.error(err);
                return interaction.editReply({ content: 'Error: An error has occurred while trying to process your request.' });
        }

    }
};

// Alternative models: t5-small, t5-base, distilbart-cnn-6-6