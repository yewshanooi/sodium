const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uselessfact')
        .setDescription('Get a random useless fact'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const Fact = await fetch('https://uselessfacts.jsph.pl/random.json?language=en')
            .then(res => res.json());

            const embed = new MessageEmbed()
                .setTitle('Useless Fact')
                .setDescription(`${Fact.text}`)
                .setColor(embedColor);

                const button = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setURL(`${Fact.source_url}`)
                        .setLabel('View source')
                        .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};