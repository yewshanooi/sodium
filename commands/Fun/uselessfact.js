const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uselessfact')
        .setDescription('Get a random useless fact'),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction, configuration) {
        const Fact = await fetch('https://uselessfacts.jsph.pl/random.json?language=en')
            .then(res => res.json());

            const embed = new EmbedBuilder()
                .setTitle('Useless Fact')
                .setDescription(`${Fact.text}`)
                .setColor(configuration.embedColor);

                const button = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setURL(`${Fact.source_url}`)
                        .setLabel('View source')
                        .setStyle('Link'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};