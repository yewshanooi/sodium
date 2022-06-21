const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Get a Minecraft player\'s UUID and details from Mojang & NameMC')
        .addStringOption(option => option.setName('username').setDescription('Enter a username').setRequired(true)),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const usernameField = interaction.options.getString('username');

        const Mojang = await fetch(`https://api.mojang.com/users/profiles/minecraft/${usernameField}`)
            .then(res => res.json());

            if (!Mojang) return interaction.reply({ content: 'Error: An error has occurred while trying to process your request.' });

        if (Mojang.id) {
            const embed = new MessageEmbed()
                .setTitle(`${Mojang.name}`)
                .addField('UUID', `\`${Mojang.id}\``)
                .setImage(`https://crafatar.com/renders/body/${Mojang.id}?overlay`)
                .setFooter({ text: 'Powered by Mojang Studios' })
                .setColor('#ef323d');

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL(`https://namemc.com/profile/${usernameField}`)
                    .setLabel('View on NameMC')
                    .setStyle('LINK'));

            interaction.reply({ embeds: [embed], components: [button] });
        }

        if (Mojang.error) {
                interaction.reply({ content: 'Error: Invalid username or username does not exist.' });
            }
        }
};