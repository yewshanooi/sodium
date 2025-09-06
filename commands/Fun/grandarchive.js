const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('grandarchive')
		.setDescription('Search for a Grand Archive TCG card')
        .addStringOption(option => option.setName('name').setDescription('Enter a card name').setRequired(true)),
	cooldown: '5',
	category: 'Fun',
	guildOnly: false,
	async execute (interaction, configuration) {
		await interaction.deferReply();

        const nameField = interaction.options.getString('name');
            function slugify(item) {
                return item
                    .normalize('NFKD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }

            const formatted = slugify(nameField);

        const GrandArchive = await fetch(`https://api.gatcg.com/cards/${formatted}`)
            .then(res => res.json());

            if (GrandArchive.error) return interaction.editReply('Error: No card found. Please try again.');

        const cardImage = `https://api.gatcg.com${GrandArchive.editions[0].image}`;

        const embed = new EmbedBuilder()
            .setTitle(`${GrandArchive.name}`)
            .setImage(`${cardImage}`)
            .setColor(configuration.embedColor);

        const button = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setURL(`https://index.gatcg.com/card/${GrandArchive.slug}`)
                .setLabel('View on Grand Archive Index')
                .setStyle('Link'));

        await interaction.editReply({ embeds: [embed], components: [button] });
    }
};