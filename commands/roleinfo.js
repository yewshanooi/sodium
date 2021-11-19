const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Display information(s) about the selected role')
        .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
    cooldown: '3',
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

            const everyoneRole = interaction.guild.roles.cache.find(role => role.name === '@everyone');
                if (roleField === everyoneRole) return interaction.reply({ content: 'Error: Unable to get information about this role.' });

        const embed = new MessageEmbed()
            .setTitle('Role Info')
            .addFields(
                { name: 'Name', value: `\`${roleField.name}\``, inline: true },
                { name: 'ID', value: `\`${roleField.id}\``, inline: true },
                { name: 'Creation Date & Time', value: `\`${roleField.createdAt}\`` },
                { name: 'Members', value: `\`${roleField.members.size}\``, inline: true },
                { name: 'Position', value: `\`${roleField.position}\``, inline: true },
                { name: 'Color (Hex)', value: `\`${roleField.hexColor}\``, inline: true },
                { name: 'Mentionable', value: `\`${resultMention}\``, inline: true },
                { name: 'Display Separately', value: `\`${resultHoist}\``, inline: true }
            )
            .setColor(embedColor);
        interaction.reply({ embeds: [embed] });
	}
};