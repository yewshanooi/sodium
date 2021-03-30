const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'covid',
    description: 'Track a country or worldwide COVID-19 cases',
    usage: 'covid {all || country}',
    cooldown: '0',
    execute (message, args) {
        const countries = args.join(' ');
        if (!args[0]) return message.channel.send(`Error: You are missing some args (Example: \`${prefix}covid all\` or \`${prefix}covid US\`)`);

        if (args[0] === 'all') {
            fetch('https://covid19.mathdro.id/api')
            .then(response => response.json())
            .then(data => {
                const confirmed = data.confirmed.value.toLocaleString();
                const recovered = data.recovered.value.toLocaleString();
                const deaths = data.deaths.value.toLocaleString();

                const embed = new MessageEmbed()
                    .setTitle('Worldwide COVID-19 Statistics')
                    .addField('Confirmed Cases', `\`${confirmed}\``)
                    .addField('Recovered', `\`${recovered}\``)
                    .addField('Deaths', `\`${deaths}\``)
                    .setTimestamp()
                    .setColor(embedColor);
                message.channel.send(embed);
            });
        }
        else {
            fetch(`https://covid19.mathdro.id/api/countries/${countries}`)
            .then(response => response.json())
            .then(data => {
                const confirmed = data.confirmed.value.toLocaleString();
                const recovered = data.recovered.value.toLocaleString();
                const deaths = data.deaths.value.toLocaleString();

                const embed = new MessageEmbed()
                    .setTitle(`COVID-19 Statistics for **${countries}**`)
                    .addField('Confirmed Cases', `\`${confirmed}\``)
                    .addField('Recovered', `\`${recovered}\``)
                    .addField('Deaths', `\`${deaths}\``)
                    .setTimestamp()
                    .setColor(embedColor);
                message.channel.send(embed);
            }).catch(() => message.channel.send('Error: Invalid country provided'));
        }
    }
};