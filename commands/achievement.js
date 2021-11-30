const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

const achievements = [
    'Taking Inventory',
    'Getting Wood',
    'Benchmaking',
    'Time to Mine!',
    'Hot Topic',
    'Acquire Hardware',
    'Time to Farm!',
    'Bake Bread',
    'The Lie',
    'Getting an Upgrade',
    'Delicious Fish',
    'On A Rail',
    'Time to Strike!',
    'Monster Hunter',
    'Cow Tipper',
    'When Pigs Fly',
    'Sniper Duel',
    'DIAMONDS!',
    'Into the Nether',
    'Return to Sender',
    'Into Fire',
    'Local Brewery',
    'The End?',
    'The End.',
    'Enchanter',
    'Overkill',
    'Librarian',
    'Adventuring Time',
    'The Beginning?',
    'The Beginning.',
    'The Beaconator',
    'Repopulation',
    'Diamonds to you!',
    'Overpowered',
    'MOAR Tools',
    'Dispense With This',
    'Leader Of The Pack',
    'Pork Chop',
    'Passing the Time',
    'The Haggler',
    'Pot Planter',
    'It\'s a Sign!',
    'Iron Belly',
    'Have a Shearful Day',
    'Rainbow Collection',
    'Stayin\' Frosty',
    'Chestful of Cobblestone',
    'Renewable Energy',
    'Body Guard',
    'Iron Man',
    'Zombie Doctor',
    'Lion Hunter',
    'Archer',
    'Tie Dye Outfit',
    'Trampoline',
    'Camouflage',
    'Map Room',
    'Freight Station',
    'Smelt Everything!',
    'Taste of Your Own Medicine',
    'Inception',
    'Saddle Up',
    'Artificial Selection',
    'Free Diver',
    'Rabbit Season',
    'The Deep End',
    'Dry Spell',
    'Super Fuel',
    'You Need a Mint',
    'Beam Me Up',
    'The End... Again...',
    'Great View From Up Here',
    'Super Sonic',
    'Treasure Hunter',
    'Organizational Wizard',
    'Cheating Death',
    'Feeling Ill',
    'Let it Go!',
    'So I Got That Going for Me',
    'Atlantis?',
    'Sail the 7 Seas',
    'Castaway',
    'Ahoy!',
    'I am a Marine Biologist',
    'Me Gold!',
    'Sleep with the Fishes',
    'Alternative Fuel',
    'Do a Barrel Roll!',
    'One Pickle, Two Pickle, Sea Pickle, Four',
    'Echolocation',
    'Moskstraumen',
    'Top of the World',
    'Where Have You Been?',
    'Zoologist',
    'Fruit on the Loom',
    'Plethora of Cats',
    'Kill the Beast!',
    'Buy Low, Sell High',
    'Disenchanted',
    'We\'re being attacked!',
    'Sound the Alarm!',
    'I\'ve got a bad feeling about this',
    'Master Trader',
    'Time for Stew',
    'Bee our guest',
    'Total Beelocation',
    'Sticky Situation',
    'Bullseye',
    'Oooh, shiny!',
    'Cover me in debris',
    'Hot tourist destination',
    'Wax on, Wax off',
    'Whatever Floats Your Goat',
    'The Healing Power of Friendship!'
  ];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('achievement')
        .setDescription('Rewards the selected user with a random achievement')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
    cooldown: '8',
    guildOnly: true,
    execute (interaction) {
        const userField = interaction.options.getUser('user');
            if (userField === interaction.client.user) return interaction.reply({ content: 'Error: You cannot send an achievement to the bot.' });
            if (userField.bot === true) return interaction.reply({ content: 'Error: You cannot send an achievement to a bot.' });

            if (userField === interaction.user) return interaction.reply({ content: 'Error: You cannot send an achievement to yourself.' });

        const embed = new MessageEmbed()
            .setTitle('Achievement')
            .setDescription(`You have received the achievement **${achievements[Math.floor(Math.random() * achievements.length)]}**`)
            .setColor(embedColor);

        const successEmbed = new MessageEmbed()
            .setDescription(`*Successfully send achievement to ${userField}*`)
            .setColor(embedColor);

        userField.send({ embeds: [embed] })
            .then(() => {
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
            })
            .catch(() => {
                interaction.reply({ content: 'Error: Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety` to receive Direct Messages.' });
            });
        }
};