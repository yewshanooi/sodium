const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Get a random color in HEX, RGB, and HSL format'),
    cooldown: '3',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        const Color = await fetch('https://x-colors.yurace.pro/api/random')
            .then(res => res.json());

        if (Color.hex === '') return interaction.reply({ content: 'Error: There was an error getting a random color.' });
        if (Color.hex.length === 0) return interaction.reply({ content: 'Error: There was an error getting a random color.' });

        const embed = new EmbedBuilder()
            .setTitle('Color')
            .addFields(
                { name: 'HEX', value: `${Color.hex}` },
                { name: 'RGB', value: `${Color.rgb}` },
                { name: 'HSL', value: `${Color.hsl}` }
            )
            .setColor(`${Color.hex}`);

        return interaction.reply({ embeds: [embed] });
    }
};