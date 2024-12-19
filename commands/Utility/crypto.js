const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto')
        .setDescription('Get the current market price of a cryptocurrency')
        .addStringOption(option => option.setName('currency').setDescription('Enter a cryptocurrency').setRequired(true)),
    cooldown: '5',
    category: 'Utility',
    guildOnly: false,
    async execute (interaction) {
        const currencyField = interaction.options.getString('currency');

        const Crypto = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${currencyField}&order=market_cap_desc`)
            .then(res => res.json());

            if (!Crypto[0]) return interaction.reply('Error: No such cryptocurrency found.');

            const uppercaseSymbol = Crypto[0].symbol.toUpperCase();

                const price = Crypto[0].current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                    const priceChange = Crypto[0].price_change_percentage_24h.toFixed(2);

                const low = Crypto[0].low_24h.toLocaleString('en-US', { style: 'decimal' });
                const high = Crypto[0].high_24h.toLocaleString('en-US', { style: 'decimal' });
                const supply = Crypto[0].circulating_supply.toLocaleString('en-US', { style: 'decimal' });

                const volume = Crypto[0].total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                const marketCap = Crypto[0].market_cap.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                    const marketCapChange = Crypto[0].market_cap_change_percentage_24h.toFixed(2);

        const embed = new EmbedBuilder()
            .setTitle(`${Crypto[0].name} (${uppercaseSymbol})`)
            .setDescription(`\`${price}\` **(${priceChange}%)**`)
            .addFields(
                { name: 'Low (24h)', value: `\`${low}\``, inline: true },
                { name: 'High (24h)', value: `\`${high}\``, inline: true },
                { name: 'Circulating Supply', value: `\`${supply} ${uppercaseSymbol}\`` },
                { name: 'Volume', value: `\`${volume}\`` },
                { name: 'Market Cap', value: `\`${marketCap}\` **(${marketCapChange}%)**` }
            )
            .setThumbnail(`${Crypto[0].image}`)
            .setFooter({ text: 'Powered by CoinGecko' })
            .setColor('#8cc540');

        return interaction.reply({ embeds: [embed] });

      }
};