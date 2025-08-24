import { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, MessageFlags } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import { GuildModel, LeaderboardModel, LogModel } from '../../Utils/schemes';;
import mongoose from 'mongoose';

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: 25,
    category: 'Moderation',
    guildOnly: true,
	execute: async (client, interaction) => {
        const guildDB = await GuildModel.findOne({ 'guild.id': interaction.guild.id });
            if (!guildDB) return interaction.reply({ embeds: [client.errors.noGuildDB] });

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Ban Members** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ embeds: [client.errors.noPermission] });

            const userField = interaction.options.getMember('user');
                if (!userField) return interaction.reply({ content: 'The user does not exist in the server.', flags: MessageFlags.Ephemeral });
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot ban a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot ban yourself.' });

                if (userField.user.id === interaction.guild.ownerId) return interaction.reply({ content: 'Error: You cannot ban a Guild Owner.' });
                if (userField.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: 'Error: You cannot ban a user with Administrator permission.' });

            let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

        const getId = new mongoose.Types.ObjectId();

        const embed = new EmbedBuilder()
            .setTitle('Ban')
            .setDescription(`\`${getId}\``)
            .addFields(
                { name: 'User', value: `${userField.user.username} \`${userField.user.id}\`` },
                { name: 'By', value: `${interaction.user.username} \`${interaction.user.id}\`` },
                { name: 'Reason', value: `${reasonField}` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        try {
            await GuildModel.findOneAndUpdate({
                'guild.id': interaction.guild.id
            }, {
                $push: {
                    logs: {
                        _id: getId,
                        type: 'Ban',
                        user: {
                            name: userField.user.username,
                            id: userField.user.id
                        },
                        staff: {
                            name: interaction.user.username,
                            id: interaction.user.id
                        },
                        reason: reasonField
                    }
                }
            });
            await userField.send(`Hi **${userField.user.username}!**, you have been banned from the server **${interaction.guild.name}**. ${reasonField ? "\nReason: " + reasonField : ""}`);
        } catch (err) {
            console.error(err);
        }

        return interaction.reply({ embeds: [embed] }).then(() => userField.ban({ reason: reasonField }));
	}
} as Command;