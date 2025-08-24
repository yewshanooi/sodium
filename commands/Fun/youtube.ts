import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, PermissionsBitField } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Start a YouTube activity in your voice channel'),
    cooldown: 10,
    category: 'Fun',
    guildOnly: true,
 	execute: async (client, interaction) => {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Create Instant Invite** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'Error: You must join a voice channel to use this command.' });

        fetch(`https://discord.com/api/v10/channels/${interaction.member.voice.channel.id}/invites`, {
            method: 'POST',
            body: JSON.stringify({
                max_age: 10800,
                max_uses: 0,
                target_application_id: '880218394199220334',
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                'Authorization': `Bot ${process.env.TOKEN}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((body : any) => {
            const embed = new EmbedBuilder()
                .setTitle('Watch Together')
                .setDescription('Link created! Click the button below to start watching')
                .setFooter({ text: 'Powered by YouTube' })
                .setColor('#ff0000');

                const button = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(new ButtonBuilder()
                        .setURL(`https://discord.gg/${body.code}`)
                        .setLabel('Join Activity')
                        .setStyle(ButtonStyle.Link));

            interaction.reply({ embeds: [embed], components: [button] });
        }).catch(() => {
                interaction.reply({ content: 'Error: There was an error generating the link.' });
            });
        }
} as Command;

// Playback of videos is limited to 180 minutes if watching with a group or 30 minutes if watching alone.