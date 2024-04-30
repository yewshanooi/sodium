const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('hypixel')
        .setDescription('Get a Minecraft player\'s stats from Hypixel Network')
        .addStringOption(option => option.setName('username').setDescription('Enter a username').setRequired(true)),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        if (!process.env.HYPIXEL_API_KEY) return interaction.reply({ embeds: [global.errors[1]] });

        const usernameField = interaction.options.getString('username');

        const Mojang = await fetch(`https://api.mojang.com/users/profiles/minecraft/${usernameField}`)
            .then(res => res.json());

            if (!Mojang) return interaction.reply({ content: 'Error: An error has occurred while trying to process your request.' });
            if (Mojang.errorMessage) return interaction.reply({ content: 'Error: Invalid username or username does not exist.' });

        const Hypixel = await fetch(`https://api.hypixel.net/v2/player?key=${process.env.HYPIXEL_API_KEY}&uuid=${Mojang.id}`)
            .then(res => res.json());

            if (Hypixel.success === false) return interaction.reply({ content: 'Error: There was a problem fetching the player.' });
            
                const firstJoined = new Date(Hypixel.player.firstLogin).toLocaleString('en-US', { timeZone: 'UTC' });

            const embed = new EmbedBuilder()
                .setTitle(`${Hypixel.player.displayname}`)
                .addFields({ name: 'Network EXP', value: `\`${Hypixel.player.networkExp}\`` })
                .addFields({ name: 'Karma', value: `\`${Hypixel.player.karma}\`` })
                .addFields({ name: 'Achievement Points', value: `\`${Hypixel.player.achievementPoints}\`` })
                .addFields({ name: 'First Joined', value: `\`${firstJoined}\`` })
                .setFooter({ text: 'Powered by Hypixel' })
                .setColor('#ffb405');

            const button = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setURL(`https://plancke.io/hypixel/player/stats/${usernameField}`)
                    .setLabel('View on Plancke')
                    .setStyle('Link'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};

// The API key will become inactive if command isn't executed for a span of 28 days: https://developer.hypixel.net/policies/.