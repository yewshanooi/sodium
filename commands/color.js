const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Get a random color')
        .addStringOption(option => option.setName('shades').setDescription('Select any color shades').addChoices({ name: 'Red', value: 'red' }, { name: 'Pink', value: 'pink' }, { name: 'Purple', value: 'purple' }, { name: 'Navy', value: 'navy' }, { name: 'Blue', value: 'blue' }, { name: 'Aqua', value: 'aqua' }, { name: 'Green', value: 'green' }, { name: 'Lime', value: 'lime' }, { name: 'Yellow', value: 'yellow' }, { name: 'Orange', value: 'orange' })),
    cooldown: '3',
    guildOnly: false,
    async execute (interaction) {
        const shadesField = interaction.options.getString('shades');

        if (!shadesField) {
            const Color = await fetch('https://x-colors.herokuapp.com/api/random')
                .then(res => res.json());

            const embed = new MessageEmbed()
                .addFields(
                        { name: 'HEX', value: `\`${Color.hex}\`` },
                        { name: 'RGB', value: `\`${Color.rgb}\`` },
                        { name: 'HSL', value: `\`${Color.hsl}\`` }
                    )
                .setColor(`${Color.hex}`);

            return interaction.reply({ embeds: [embed] });
        }

        if (shadesField) {
            const Color = await fetch(`https://x-colors.herokuapp.com/api/random/${shadesField}`)
                .then(res => res.json());

            const embed = new MessageEmbed()
                .addFields(
                    { name: 'HEX', value: `\`${Color.hex}\`` },
                    { name: 'RGB', value: `\`${Color.rgb}\`` },
                    { name: 'HSL', value: `\`${Color.hsl}\`` }
                )
                .setColor(`${Color.hex}`);

            return interaction.reply({ embeds: [embed] });
            }

        }
};