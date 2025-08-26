import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
	data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Get a Minecraft player\'s details from Mojang Studios')
        .addStringOption(option => option.setName('username').setDescription('Enter a username').setRequired(true)),
    gemini: true,
    cooldown: 5,
    category: 'Fun',
    guildOnly: false,
    execute: async (client, interaction) => {
        await interaction.deferReply();

        const usernameField = interaction.options.getString('username');

        const Mojang: any = await fetch(`https://api.mojang.com/users/profiles/minecraft/${usernameField}`)
            .then(res => res.json());

            if (!Mojang) return interaction.editReply({ content: 'Error: An error has occurred while trying to process your request.' });
            if (Mojang.errorMessage) return interaction.editReply({ content: 'Error: Invalid username or username does not exist.' });

        const embed = new EmbedBuilder()
            .setTitle(`${Mojang.name}`)
            .addFields({ name: 'UUID', value: `\`${Mojang.id}\`` })
            .setImage(`https://mc-heads.net/body/${Mojang.id}/128.png`)
            .setFooter({ text: 'Powered by Mojang Studios' })
            .setColor('#ef323d');

        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(new ButtonBuilder()
                .setURL(`https://namemc.com/profile/${usernameField}`)
                .setLabel('View on NameMC')
                .setStyle(ButtonStyle.Link));

        return interaction.editReply({ embeds: [embed], components: [button || button.toJSON()] });
    }
} as Command;