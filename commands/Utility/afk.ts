import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("afk")
        .setDescription("Set another user's status as AFK")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select a user")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("option")
                .setDescription("Set whether the user is AFK")
                .addChoices(
                    { name: "Yes", value: "true" },
                    { name: "No", value: "false" }
                )
                .setRequired(true)
        ),
    cooldown: 10,
    category: "Utility",
    guildOnly: true,
    execute: async (client, interaction) => {
        if (!interaction.guild) return;

        // Permisos del bot
        if (!interaction.guild.members.me?.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                content: "❌ Bot permission denied. Enable **Manage Nicknames** in `Server Settings > Roles` to use this command."
            });
        }

        // Permisos del usuario
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageNicknames)) {
            return interaction.reply({
                embeds: [client.errors?.[2] ?? new EmbedBuilder().setDescription("❌ You don't have permission.")]
            });
        }

        const userField = interaction.options.getUser("user", true);
        const memberUserField = interaction.options.getMember("user");

        if (!memberUserField) {
            return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "❌ User not found in this guild." });
        }

        // No bots
        if (memberUserField.user.bot) {
            return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "❌ You cannot set a bot's status as AFK." });
        }

        // No a ti mismo
        if (memberUserField.id === interaction.user.id) {
            return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "❌ You cannot set your own status as AFK." });
        }

        const optionField = interaction.options.getString("option", true);

        if (optionField === "true") {
            const successEmbed = new EmbedBuilder()
                .setDescription(`**${userField.username}** is now AFK`)
                .setColor(client.embedColor as any);

            await interaction.reply({ embeds: [successEmbed] });
            await memberUserField.setNickname(`[AFK] ${memberUserField.displayName}`).catch(() => null);
        }

        if (optionField === "false") {
            const successEmbed = new EmbedBuilder()
                .setDescription(`**${userField.username}** is no longer AFK`)
                .setColor(client.embedColor as any);

            await interaction.reply({ embeds: [successEmbed] });
            await memberUserField.setNickname(userField.username).catch(() => null);
        }
    }
} as Command;
