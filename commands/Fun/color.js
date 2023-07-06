const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Get a random color in HEX format'),
    cooldown: '3',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        const Color = await fetch('https://www.colr.org/json/colors/random/1')
            .then(res => res.json());

        if (Color.colors[0].hex === '') {
            return interaction.reply({ content: 'Error: There was an error getting a random color.' });
        }

        const capitalizedName = Color.colors[0].tags[0].name.charAt(0).toUpperCase() + Color.colors[0].tags[0].name.slice(1);

        const embed = new EmbedBuilder()
            .setTitle(`${capitalizedName}`)
            .addFields({ name: 'HEX', value: `\`#${Color.colors[0].hex}\`` })
            .setColor(`${Color.colors[0].hex}`);

        return interaction.reply({ embeds: [embed] });
    }
};