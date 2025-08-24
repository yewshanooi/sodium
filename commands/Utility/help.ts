import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View a specific command or all available commands')
        .addStringOption(option => option.setName('command').setDescription('Enter a command')),
    cooldown: 0,
    category: 'Utility',
    guildOnly: false,
    execute: async (client, interaction) => {
        const { commands } = client;
        const commandField = interaction.options.getString('command');

        if (commandField) {
            const command: any = commands.get(commandField.toLowerCase());
            if (!command) return interaction.reply({ content: 'Error: No such command found.' });

            const { guildOnly } = command;
            let resultGuildOnly;
                if (guildOnly === true) resultGuildOnly = 'True';
                else resultGuildOnly = 'False';

            const commandEmbed = new EmbedBuilder()
                .setTitle(`/${command.data.name}`) 
                .setDescription(`${command.data.description}`)
                .addFields(
                    { name: 'Category', value: `\`${command.category}\``, inline: true },
                    { name: 'Guild Only', value: `\`${resultGuildOnly}\``, inline: true },
                    { name: 'Cooldown', value: `\`${command.cooldown}\` second(s)` }
                )
                .setColor(client.embedColor as any);
            interaction.reply({ embeds: [commandEmbed] });
        } else {
            const buttons = [
                new ButtonBuilder()
                    .setCustomId('ctgFun')
                    .setLabel('Fun')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('ctgModeration')
                    .setLabel('Moderation')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('ctgUtility')
                    .setLabel('Utility')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder() 
                    .setCustomId('ctgMusic')
                    .setLabel('Music')
                    .setStyle(ButtonStyle.Secondary),
            ];

            const box = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

            const categories = {
                Fun: commands.filter((cmd : any) => cmd.category === 'Fun'),
                Moderation: commands.filter((cmd : any) => cmd.category === 'Moderation'),
                Utility: commands.filter((cmd : any) => cmd.category === 'Utility'),
                Music: commands.filter((cmd : any) => cmd.category === 'Music'),
            };

            const mainEmbed = new EmbedBuilder()
                .setTitle('Help')
                .setDescription('💡 *To get more info on a specific command use `/help {command}`*')
                .addFields({ name: `There are ${commands.size} commands available`, value: 'Click on any of the buttons to see the commands' })
                .setColor(client.embedColor as any);

            await interaction.reply({ embeds: [mainEmbed], components: [box] });
            
            const collector = interaction.channel.createMessageComponentCollector({ time: 180000 });

            collector.on('collect', async collected => {
                const customId = collected.customId;

                let categoryName, categoryCommands, buttonIndex;

                switch (customId) {
                    case 'ctgFun':
                        categoryName = 'Fun';
                        categoryCommands = categories.Fun;
                        buttonIndex = 0;
                        break;
                    case 'ctgModeration':
                        categoryName = 'Moderation';
                        categoryCommands = categories.Moderation;
                        buttonIndex = 1;
                        break;
                    case 'ctgUtility':
                        categoryName = 'Utility';
                        categoryCommands = categories.Utility;
                        buttonIndex = 2;
                        break;
                    case 'ctgMusic':
                        categoryName = 'Music';
                        categoryCommands = categories.Music;
                        buttonIndex = 3;
                        break;
                    default:
                        return;
                }
                
                const commandsWithDescriptions = categoryCommands.map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`).join('\n');

                if (commandsWithDescriptions.length > 1024) {
                    const commandNamesOnly = categoryCommands.map(cmd => `\`/${cmd.data.name}\``).join('\n');
                    mainEmbed.data.fields[0] = { 
                        name: `${categoryName} commands [${categoryCommands.size}]`, 
                        value: commandNamesOnly || 'No commands in this category.' 
                    };
                } else {
                    mainEmbed.data.fields[0] = { 
                        name: `${categoryName} commands [${categoryCommands.size}]`, 
                        value: commandsWithDescriptions || 'No commands in this category.' 
                    };
                }
                
                box.components.forEach((component, index) => {
                    component.setDisabled(index === buttonIndex);
                });
                
                await collected.deferUpdate();
                await interaction.editReply({ embeds: [mainEmbed], components: [box] });
            });

            collector.on('end', async (__, reason) => {
                if (reason === 'time') {
                    const embedTimeout = new EmbedBuilder()
                        .setTitle('Help')
                        .setDescription('Command has ended due to inactivity. Retype `/help` to use it again.')
                        .setColor(client.embedColor as any);
                    await interaction.editReply({ embeds: [embedTimeout], components: [] });
                } else {
                    await interaction.editReply({ components: [] });
                }
            });
        }
    }
} as Command;