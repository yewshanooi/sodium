import { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName('guildrename')
        .setDescription('Rename the current guild')
        .addStringOption(option => option.setName('name').setDescription('Enter a name (max 100 characters)').setMaxLength(100).setRequired(true)),
    cooldown: 20,
    category: 'Utility',
    guildOnly: true,
    execute: (client, interaction) => {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Guild** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [client.errors.noPermission] });

        const nameField = interaction.options.getString('name');

        const embed = new EmbedBuilder()
            .setDescription(`Successfully renamed guild to **${nameField}**`)
            .setColor(client.embedColor as any);
        interaction.reply({ embeds: [embed] }).then(() => interaction.guild.setName(nameField));
    }
} as Command;