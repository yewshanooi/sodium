const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokemon')
        .setDescription('Search for a Pokémon using PokéAPI')
        .addStringOption(option => option.setName('name').setDescription('Enter a pokemon name').setRequired(true)),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        await interaction.deferReply();

        try {
            const lowercaseNameField = interaction.options.getString('name').toLowerCase();

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${lowercaseNameField}/`);

        if (response.ok) {
            const Pokemon = await response.json();

                const capitalizedName = Pokemon.name.charAt(0).toUpperCase() + Pokemon.name.slice(1);
                const heightInCM = Pokemon.height * 10;
                const weightInKG = Pokemon.weight / 10;

            const embed = new EmbedBuilder()
                .setTitle(`#${Pokemon.id} ${capitalizedName}`)
                .addFields(
                    { name: 'Height', value: `${heightInCM} cm` },
                    { name: 'Weight', value: `${weightInKG} kg` }
                )
                .setThumbnail(`${Pokemon.sprites.other['official-artwork'].front_default}`)
                .setFooter({ text: 'Powered by PokéAPI' })
                .setColor('#ef5350');

            // Check if the Pokémon has more than one Type
            if (Pokemon.types.length > 1) {
                const firstType = Pokemon.types[0].type.name.charAt(0).toUpperCase() + Pokemon.types[0].type.name.slice(1);
                const secondType = Pokemon.types[1].type.name.charAt(0).toUpperCase() + Pokemon.types[1].type.name.slice(1);
                embed.addFields({ name: 'Type', value: `${firstType}, ${secondType}` });
            } else if (Pokemon.types.length === 1) {
                const firstType = Pokemon.types[0].type.name.charAt(0).toUpperCase() + Pokemon.types[0].type.name.slice(1);
                embed.addFields({ name: 'Type', value: `${firstType}` });
            }

            // Check if the Pokémon has more than one Ability
            if (Pokemon.abilities.length > 1) {
                const firstAbility = Pokemon.abilities[0].ability.name.charAt(0).toUpperCase() + Pokemon.abilities[0].ability.name.slice(1);
                const secondAbility = Pokemon.abilities[1].ability.name.charAt(0).toUpperCase() + Pokemon.abilities[1].ability.name.slice(1);
                embed.addFields({ name: 'Ability', value: `${firstAbility}, ${secondAbility}` });
            } else if (Pokemon.abilities.length === 1) {
                const firstAbility = Pokemon.abilities[0].ability.name.charAt(0).toUpperCase() + Pokemon.abilities[0].ability.name.slice(1);
                embed.addFields({ name: 'Ability', value: `${firstAbility}` });
            }

                embed.addFields({ name: 'Stats', value: `**HP** ${Pokemon.stats[0].base_stat}\n**Attack** ${Pokemon.stats[1].base_stat}\n**Defense** ${Pokemon.stats[2].base_stat}\n**Special Attack** ${Pokemon.stats[3].base_stat}\n**Special Defense** ${Pokemon.stats[4].base_stat}\n**Speed** ${Pokemon.stats[5].base_stat}` });

            return interaction.editReply({ embeds: [embed] });
        }

        return interaction.editReply('Error: No such Pokémon found.');
    } catch (err) {
            console.error(err);
            return interaction.editReply('Error: An error has occurred while processing your request.');
        }
    }
};