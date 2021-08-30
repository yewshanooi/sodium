const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roleinfo')
		.setDescription('Display information(s) about the selected role')
        .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
	cooldown: '5',
    guildOnly: true,
    execute (interaction) {
        const roleField = interaction.options.getRole('role');

        const { mentionable } = roleField;
            let resultMention;
                if (mentionable === true) resultMention = 'Yes';
            else resultMention = 'No';

        const { hoist } = roleField;
            let resultHoist;
                if (hoist === true) resultHoist = 'Yes';
            else resultHoist = 'No';

        const embed = new MessageEmbed()
            .setTitle('Role Info')
            .addField('Name', `\`${roleField.name}\``, true)
            .addField('ID', `\`${roleField.id}\``, true)
            .addField('Creation Date & Time', `\`${roleField.createdAt}\``)
            .addField('Members', `\`${roleField.members.size}\``, true)
            .addField('Position', `\`${roleField.position}\``, true)
            .addField('Color (Hex)', `\`${roleField.hexColor}\``, true)
            .addField('Mentionable', `\`${resultMention}\``, true)
            .addField('Display Separately', `\`${resultHoist}\``, true)
            .setColor(embedColor);
        interaction.reply({ embeds: [embed] });
	}
};