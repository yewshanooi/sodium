const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Display information(s) about the selected role')
        .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
    cooldown: '3',
    guildOnly: true,
    execute (interaction, configuration) {
        const roleField = interaction.options.getRole('role');

        const { mentionable } = roleField;
        let resultMentionable;
            if (mentionable === true) resultMentionable = 'Yes';
            else resultMentionable = 'No';

        const { hoist } = roleField;
        let resultHoist;
            if (hoist === true) resultHoist = 'Yes';
            else resultHoist = 'No';

            const everyone = interaction.guild.roles.cache.find(role => role.name === '@everyone');
                if (roleField === everyone) return interaction.reply({ content: 'Error: Unable to get information about this role.' });

        const embed = new EmbedBuilder()
            .setTitle(`@${roleField.name}`)
            .addFields(
                { name: 'Position', value: `\`${roleField.position}\``, inline: true },
                { name: 'Color (HEX)', value: `\`${roleField.hexColor}\``, inline: true },
                { name: 'ID', value: `\`${roleField.id}\``, inline: true },
                { name: 'Creation Date & Time', value: `\`${roleField.createdAt}\`` },
                { name: 'Members', value: `\`${roleField.members.size}\``, inline: true },
                { name: 'Mentionable', value: `\`${resultMentionable}\``, inline: true },
                { name: 'Display Separately', value: `\`${resultHoist}\``, inline: true }
            )
            .setColor(configuration.embedColor);
        interaction.reply({ embeds: [embed] });
	}
};