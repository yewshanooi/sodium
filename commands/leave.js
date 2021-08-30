const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Remove the bot from the current guild')
        .addStringOption(option => option.setName('guildname').setDescription('Enter the guild name').setRequired(true)),
    cooldown: '45',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply('Error: You have no permission to use this command.');

        const stringField = interaction.options.getString('guildname');

            const embedTrue = new MessageEmbed()
                .setTitle('Leave')
                .setDescription('Successfully left the guild.\n We hope to see you again next time!')
                .setColor(embedColor);

            const buttonTrue = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=531811937244151808&permissions=261993005047&scope=bot%20applications.commands')
                    .setLabel('Already missed us? Invite us back')
                    .setStyle('LINK'));

        if (stringField === interaction.guild.name) {
            interaction.guild.leave().then(interaction.reply({ embeds: [embedTrue], components: [buttonTrue] }));
        }
        else {
            return interaction.reply('Error: Incorrect guild name.');
        }
    }
};