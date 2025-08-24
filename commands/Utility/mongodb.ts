import { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, CommandInteraction } from 'discord.js';
import { GuildModel, LeaderboardModel, LogModel } from '../../Utils/schemes';
import mongoose from 'mongoose';
import chalk from 'chalk';
import type { Command } from "../../Utils/types/Client";

export default {
	data: new SlashCommandBuilder()
		.setName('mongodb')
		.setDescription('Initialize or delete MongoDB database')
		.addSubcommand(subcommand => subcommand.setName('initialize').setDescription('Initialize a new database for the current guild'))
		.addSubcommand(subcommand => subcommand.setName('delete').setDescription('Delete an existing database for the current guild')),
	cooldown: 15,
	category: 'Utility',
	guildOnly: true,
	execute: async (client, interaction) => {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [client.errors.noPermission] });
		const sub = interaction.options.getSubcommand();
		if (sub === 'initialize') {
			await interaction.deferReply();

			let guildDB = await GuildModel.findOne({ 'guild.id': interaction.guild.id });
			if (guildDB) return interaction.editReply({ content: 'Error: This guild already has an existing database.' });

			if (!guildDB) {
				guildDB = await new GuildModel({
					_id: new mongoose.Types.ObjectId(),
					guild: {
						name: interaction.guild.name,
						id: interaction.guild.id
					},
					leaderboards: [],
					logs: []
				});

				await guildDB.save().then(() => {
					console.log(`${chalk.white.bold(`[MongoDB] Initialized database for ${interaction.guild.name} (${interaction.guild.id})`)}`);

					const createDatabase = new EmbedBuilder()
						.setTitle('MongoDB')
						.setDescription(`Successfully initialized database for **${interaction.guild.name}**`)
						.setColor(client.embedColor as any)
						.setTimestamp();

					interaction.editReply({ embeds: [createDatabase] });
				})
				.catch(console.error);
			}
		}

        if (sub === 'delete') {
            await interaction.deferReply();

            const guildDB = await GuildModel.findOne({ 'guild.id': interaction.guild.id });
            if (!guildDB) return interaction.editReply({ embeds: [client.errors.noGuildDB] });

            const deleteDatabase = new EmbedBuilder()
                .setTitle('MongoDB')
                .setDescription('Are you sure you want to delete the database for this guild?')
                .setColor(client.embedColor as any);

            const buttons = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('deleteYes')
                        .setLabel('Yes')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('deleteNo')
                        .setLabel('No')
                        .setStyle(ButtonStyle.Danger));

            await interaction.editReply({ embeds: [deleteDatabase], components: [buttons] });

            const filter = (ft): boolean => ft.isButton() && ft.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 30000 // 30 seconds timeout
            });

            collector.on('collect', async (co) => {
                if (co.customId === 'deleteYes') {
                    try {
                        await GuildModel.deleteOne({ 'guild.id': interaction.guild.id });

                        console.log(`${chalk.white.bold(`[MongoDB] Deleted database for ${interaction.guild.name} (${interaction.guild.id})`)}`);

                        const yesEmbed = new EmbedBuilder()
                            .setTitle('MongoDB')
                            .setDescription('Successfully deleted the database for this guild.')
                            .setColor(client.embedColor as any)
                            .setTimestamp();

                        await co.update({ embeds: [yesEmbed], components: [] });
                    } catch (err) {
                        console.error(err);
                        await co.update({ content: 'Error: Unable to delete the database. Please try again.', components: [] });
                    }
                }
                if (co.customId === 'deleteNo') {
                    const noEmbed = new EmbedBuilder()
                        .setDescription('You have cancelled the delete request.')
                        .setColor('#ff5555');

                    await co.update({ embeds: [noEmbed], components: [] });
                }
            });

            collector.on('end', (_, reason) => {
                if (reason === 'time') {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                . setTitle ('MongoDB')
                                . setDescription ('Command has ended. Retype `/mongodb delete` to request again.')
                                . setColor(client.embedColor as any)
                        ],
                         components : []
                     });
                 }
             });
         }

     }
} as Command;