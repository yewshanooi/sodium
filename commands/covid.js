const fetch = require('node-fetch');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { prefix } = require('../config.json');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'covid',
    description: 'Show latest cases worldwide or in a particular country',
    usage: 'covid all / {country}',
    cooldown: '0',
    execute (message, args) {
        const countries = args.join(' ');
            if (!args[0]) return message.channel.send(`Error: You are missing some args.\n*(e.g: \`${prefix}covid all\` or \`${prefix}covid US\`)*`);

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL('https://github.com/mathdroid/covid-19-api')
                    .setLabel('API Repository')
                    .setStyle('LINK'));

        if (args[0] === 'all') {
            fetch('https://covid19.mathdro.id/api')
            .then(response => response.json())
            .then(data => {
                const confirmed = data.confirmed.value.toLocaleString();
                // const recovered = data.recovered.value.toLocaleString();
                const deaths = data.deaths.value.toLocaleString();

                const embed = new MessageEmbed()
                    .setTitle('Covid-19')
                    .setDescription('Worldwide Statistics')
                    .addField('Confirmed', `\`${confirmed}\``)
                    // .addField('Recovered', `\`${recovered}\``)
                    .addField('Deaths', `\`${deaths}\``)
                    .setTimestamp()
                    .setColor(embedColor);

                message.channel.send({ embeds: [embed], components: [button] });
            });
        }
        else {
            fetch(`https://covid19.mathdro.id/api/countries/${countries}`)
            .then(response => response.json())
            .then(data => {
                const confirmed = data.confirmed.value.toLocaleString();
                // const recovered = data.recovered.value.toLocaleString();
                const deaths = data.deaths.value.toLocaleString();

                const embed = new MessageEmbed()
                    .setTitle('Covid-19')
                    .setDescription(`Statistics for **${countries}**`)
                    .addField('Confirmed', `\`${confirmed}\``)
                    // .addField('Recovered', `\`${recovered}\``)
                    .addField('Deaths', `\`${deaths}\``)
                    .setTimestamp()
                    .setColor(embedColor);

                message.channel.send({ embeds: [embed], components: [button] });
            }).catch(() => message.channel.send('Error: Please provide a valid country.'));
        }
    }
};

/*
 * 'recovered' data always return 0 from API's side (known issue)
 * https://github.com/mathdroid/covid-19-api/issues
 */