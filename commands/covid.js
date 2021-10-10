const fetch = require('node-fetch');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('covid')
		.setDescription('Show latest cases worldwide or in a particular country')
        .addStringOption(option => option.setName('country').setDescription('Enter a country')),
	cooldown: '0',
    guildOnly: false,
    execute (interaction) {
        const stringField = interaction.options.getString('country');

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL('https://github.com/mathdroid/covid-19-api')
                    .setLabel('API Repository')
                    .setStyle('LINK'));

        if (!stringField) {
            fetch('https://covid19.mathdro.id/api')
            .then(response => response.json())
            .then(data => {
                const confirmed = data.confirmed.value.toLocaleString();
                // const recovered = data.recovered.value.toLocaleString();
                const deaths = data.deaths.value.toLocaleString();

                const embed = new MessageEmbed()
                    .setTitle('Covid-19')
                    .setDescription('Worldwide Statistics')
                    .addFields(
                        { name: 'Confirmed', value: `\`${confirmed}\`` },
                        // { name: 'Recovered', value: `\`${recovered}\`` },
                        { name: 'Deaths', value: `\`${deaths}\`` }
                    )
                    .setTimestamp()
                    .setColor(embedColor);

                interaction.reply({ embeds: [embed], components: [button] });
            });
        }
        if (stringField) {
            fetch(`https://covid19.mathdro.id/api/countries/${stringField}`)
            .then(response => response.json())
            .then(data => {
                const confirmed = data.confirmed.value.toLocaleString();
                // const recovered = data.recovered.value.toLocaleString();
                const deaths = data.deaths.value.toLocaleString();

                const embed = new MessageEmbed()
                    .setTitle('Covid-19')
                    .setDescription(`Statistics for **${stringField}**`)
                    .addFields(
                        { name: 'Confirmed', value: `\`${confirmed}\`` },
                        // { name: 'Recovered', value: `\`${recovered}\`` },
                        { name: 'Deaths', value: `\`${deaths}\`` }
                    )
                    .setTimestamp()
                    .setColor(embedColor);

                interaction.reply({ embeds: [embed], components: [button] });
            }).catch(() => interaction.reply('Error: Please provide a valid country.'));
        }
	}
};