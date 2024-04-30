const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Get a Minecraft player\'s details from Mojang Studios')
        .addStringOption(option => option.setName('username').setDescription('Enter a username').setRequired(true)),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        const usernameField = interaction.options.getString('username');

        const Mojang = await fetch(`https://api.mojang.com/users/profiles/minecraft/${usernameField}`)
            .then(res => res.json());

            if (!Mojang) return interaction.reply({ content: 'Error: An error has occurred while trying to process your request.' });
            if (Mojang.errorMessage) return interaction.reply({ content: 'Error: Invalid username or username does not exist.' });

        const embed = new EmbedBuilder()
            .setTitle(`${Mojang.name}`)
            .addFields({ name: 'UUID', value: `\`${Mojang.id}\`` })
            .setImage(`https://mc-heads.net/body/${Mojang.id}/128.png`)
            .setFooter({ text: 'Powered by Mojang Studios' })
            .setColor('#ef323d');

        const button = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setURL(`https://namemc.com/profile/${usernameField}`)
                .setLabel('View on NameMC')
                .setStyle('Link'));

        return interaction.reply({ embeds: [embed], components: [button] });
    }
};