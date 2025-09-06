const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mtg')
		.setDescription('Search for a Magic: The Gathering card from Scryfall')
        .addStringOption(option => option.setName('name').setDescription('Enter a card name').setRequired(true)),
	cooldown: '5',
	category: 'Fun',
	guildOnly: false,
	async execute (interaction) {
		await interaction.deferReply();

        const nameField = interaction.options.getString('name');

        const Scryfall = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(nameField)}+%28game%3Apaper%29`)
            .then(res => res.json());

            if (Scryfall.status === 404) return interaction.editReply('Error: No card found. Please try again.');

        const prices = [];
            if (Scryfall.data[0].prices.usd) prices.push(`**USD** \`${Scryfall.data[0].prices.usd}\``);
            if (Scryfall.data[0].prices.usd_foil) prices.push(`**USD (Foil)** \`${Scryfall.data[0].prices.usd_foil}\``);
            if (Scryfall.data[0].prices.usd_etched) prices.push(`**USD (Etched)** \`${Scryfall.data[0].prices.usd_etched}\``);
            if (Scryfall.data[0].prices.eur) prices.push(`**EUR** \`${Scryfall.data[0].prices.eur}\``);
            if (Scryfall.data[0].prices.eur_foil) prices.push(`**EUR (Foil)** \`${Scryfall.data[0].prices.eur_foil}\``);
            if (Scryfall.data[0].prices.tix) prices.push(`**TIX** \`${Scryfall.data[0].prices.tix}\``);

        const embed = new EmbedBuilder()
            .setTitle(`${Scryfall.data[0].name}`)
            .setImage(`${Scryfall.data[0].image_uris.png}`)
            .setFooter({ text: 'Powered by Scryfall' })
            .setColor('#634496');

        if (prices.length > 0) {
            embed.addFields({ name: 'Prices', value: prices.join('\n') });
        }

        const button = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setURL(`${Scryfall.data[0].scryfall_uri}`)
                .setLabel('View on Scryfall')
                .setStyle('Link'));

        await interaction.editReply({ embeds: [embed], components: [button] });
	}
};