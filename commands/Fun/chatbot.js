/* eslint-disable no-extra-parens */

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatbot')
        .setDescription('Chat with an AI bot powered by the OpenAI GPT model')
        .addStringOption(option => option.setName('query').setDescription('Enter a query').setRequired(true)),
    cooldown: '10',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
        await interaction.deferReply();

        const queryField = interaction.options.getString('query');

        /*
         * Add limit for input field (to ensure token usage is balanced)
         * Add check for spelling errors & regex input
         */

            if (!process.env.OPENAI_API_KEY) return interaction.reply({ embeds: [global.errors[1]], ephemeral: true });

        const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `${queryField}`,
            max_tokens: 256,
            temperature: 1
        });

        // Change model to gpt-3.5-turbo

          const capitalizedTitle = queryField.charAt(0).toUpperCase() + queryField.slice(1);

        const embed = new EmbedBuilder()
            .setTitle(`${trim(capitalizedTitle, 256)}`)
            .setDescription(`${trim(response.data.choices[0].text, 4096)}`)
            .setFooter({ text: `Powered by OpenAI\nModel: ${response.data.model}\nPrompt Token(s): ${response.data.usage.prompt_tokens}, Completion Token(s): ${response.data.usage.completion_tokens}, Total Token(s): ${response.data.usage.total_tokens}` })
            .setColor('#ffffff');

        await interaction.editReply({ embeds: [embed] });
      }
};


/*
 * Embed titles are limited to 256 characters
 * Embed descriptions are limited to 4096 characters
 * A field's name is limited to 256 characters and its value to 1024 characters
 * The sum of all characters from all embed structures in a message must not exceed 6000 characters
 */