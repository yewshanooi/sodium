const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const achievements = [
    // Minecraft: The heart and story of the game
    'Minecraft',
    'Stone Age',
    'Getting an Upgrade',
    'Acquire Hardware',
    'Suit Up',
    'Hot Stuff',
    'Isn\'t It Iron Pick',
    'Not Today, Thank You',
    'Ice Bucket Challenge',
    'Diamonds!',
    'We Need to Go Deeper',
    'Cover Me with Diamonds',
    'Enchanter',
    'Zombie Doctor',
    'Eye Spy',
    'The End?',

    // Nether: Bring summer clothes
    'Nether',
    'Return to Sender',
    'Those Were the Days',
    'Hidden in the Depths',
    'Subspace Bubble',
    'A Terrible Fortress',
    'Who is Cutting Onions?',
    'Oh Shiny',
    'This Boat Has Legs',
    'Uneasy Alliance',
    'War Pigs',
    'Country Lode, Take Me Home',
    'Cover Me in Debris',
    'Spooky Scary Skeleton',
    'Into Fire',
    'Not Quite "Nine" Lives',
    'Feels Like Home',
    'Hot Tourist Destinations',
    'Withering Heights',
    'Local Brewery',
    'Bring Home the Beacon',
    'A Furious Cocktail',
    'Beaconator',
    'How Did We Get Here?',

    // The End: Or the beginning?
    'The End',
    'Free the End',
    'The Next Generation',
    'Remote Getaway',
    'The End... Again...',
    'You Need a Mint',
    'The City at the End of the Game',
    'Sky\'s the Limit',
    'Great View From Up Here',

    // Adventure: Adventure, exploration, and combat
    'Adventure',
    'Voluntary Exile',
    'Is It a Bird?',
    'Monster Hunter',
    'The Power of Books',
    'What a Deal!',
    'Crafting a New Look',
    'Sticky Situation',
    'Ol\' Betsy',
    'Surge Protector',
    'Caves & Cliffs',
    'Respecting the Remnants',
    'Sneak 100',
    'Sweet Dreams',
    'Hero of the Village',
    'Is It a Balloon?',
    'A Throwaway Joke',
    'It Spreads',
    'Take Aim',
    'Monsters Hunted',
    'Postmortal',
    'Hired Help',
    'Star Trader',
    'Smithing with Style',
    'Two Birds, One Arrow',
    'Who\'s the Pillager Now?',
    'Arbalistic',
    'Careful Restoration',
    'Adventuring Time',
    'Sound of Music',
    'Light as a Rabbit',
    'Is It a Plane?',
    'Very Very Frightening',
    'Sniper Duel',
    'Bullseye',
    'Minecraft: Trial(s) Edition',
    'Crafters Crafting Crafters',
    'Lighten Up',
    'Who Needs Rockets?',
    'Under Lock and Key',
    'Revaulting',
    'Blowback',
    'Over-Overkill',
    'Isn\'t it Scute?',

    // Husbandry: The world is full of friends and food
    'Husbandry',
    'Bee Our Guest',
    'The Parrots and the Bats',
    'You\'ve Got a Friend in Me',
    'Whatever Floats Your Goat!',
    'Best Friends Forever',
    'Glow and Behold!',
    'Fishy Business',
    'Total Beelocation',
    'Bukkit Bukkit',
    'Smells Interesting',
    'A Seedy Place',
    'Wax On',
    'Two by Two',
    'Birthday Song',
    'A Complete Catalogue',
    'Tactical Fishing',
    'When the Squad Hops into Town',
    'Little Sniffs',
    'A Balanced Diet',
    'Serious Dedication',
    'Wax Off',
    'The Cutest Predator',
    'With Our Powers Combined!',
    'Planting the Past',
    'The Healing Power of Friendship!',
    'Good as New',
    'The Whole Pack',
    'Shear Brilliance',

    // April Fools' Jokes
    'Almost there',
    'Ride The End',
    'I Voted!',
    'Pro Voter',
    'Poisonous Potato Saga',
    'Non Plus Ultra'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('achievement')
        .setDescription('Rewards the selected user with a random achievement')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
    cooldown: '8',
    category: 'Fun',
    guildOnly: true,
    execute (interaction, configuration) {
        const userField = interaction.options.getUser('user');
            if (userField === interaction.client.user) return interaction.reply({ content: 'Error: You cannot send an achievement to the bot.' });
            if (userField.bot === true) return interaction.reply({ content: 'Error: You cannot send an achievement to a bot.' });

            if (userField === interaction.user) return interaction.reply({ content: 'Error: You cannot send an achievement to yourself.' });

        const embed = new EmbedBuilder()
            .setTitle('Achievement')
            .setDescription(`You have received **${achievements[Math.floor(Math.random() * achievements.length)]}**`)
            .setColor(configuration.embedColor);

        const successEmbed = new EmbedBuilder()
            .setDescription(`Successfully send achievement to ${userField}`)
            .setColor(configuration.embedColor);

        userField.send({ embeds: [embed] })
            .then(() => {
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
            })
            .catch(() => {
                interaction.reply({ embeds: [global.errors[3]] });
            });
        }
};

// Achievements are obtained from https://minecraft.wiki/w/Advancement.