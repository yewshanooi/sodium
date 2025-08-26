import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Get random anime images from Nekos APIs')
        .addSubcommandGroup(group => group
                .setName('nekosbest')
                .setDescription('Images from nekos.best API')
                .addSubcommand(sub =>
                    sub.setName('neko').setDescription('Random neko image')
                )
                .addSubcommand(sub =>
                    sub.setName('waifu').setDescription('Random waifu image')
                )
                .addSubcommand(sub =>
                    sub.setName('husbando').setDescription('Random husbando image')
                )
                .addSubcommand(sub =>
                    sub.setName('kitsune').setDescription('Random kitsune image')
                )
        )
        .addSubcommandGroup(group => group
                .setName('nekoslife')
                .setDescription('Images from nekos.life API')
                .addSubcommand(sub =>
                    sub.setName('neko').setDescription('Random neko image')
                )
                .addSubcommand(sub =>
                    sub.setName('waifu').setDescription('Random waifu image')
                )
                .addSubcommand(sub =>
                    sub.setName('lizard').setDescription('Random lizard image')
                )
                .addSubcommand(sub =>
                    sub.setName('foxgirl').setDescription('Random fox girl image')
                )
                .addSubcommand(sub =>
                    sub.setName('kemonomimi').setDescription('Random kemonomimi image')
                )
                .addSubcommand(sub =>
                    sub.setName('holo').setDescription('Random Holo image')
                )
                .addSubcommand(sub =>
                    sub.setName('woof').setDescription('Random dog image')
                )
                .addSubcommand(sub =>
                    sub.setName('wallpaper').setDescription('Random anime wallpaper')
                )
                .addSubcommand(sub =>
                    sub.setName('goose').setDescription('Random goose image')
                )
                .addSubcommand(sub =>
                    sub.setName('gecg').setDescription('Random genetically engineered catgirl')
                )
                .addSubcommand(sub =>
                    sub.setName('avatar').setDescription('Random anime avatar')
                )
        ),
    gemini: true,
    cooldown: 5,
    category: 'Fun',
    guildOnly: false,
    execute: async (client, interaction) => {
        const group = interaction.options.getSubcommandGroup();
        const sub = interaction.options.getSubcommand();
        let url, title, img, buttons;
        let embed = new EmbedBuilder().setColor(client.embedColor as any);
        if (group === 'nekosbest') {
            url = `https://nekos.best/api/v2/${sub}`;
            const data: any = await fetch(url).then(res => res.json());
            embed.setImage(data.results[0].url as any);
            embed.setFooter({
                text: `Artist: ${data.results[0].artist_name}\nPowered by Pixiv`
            });
            embed.setTitle(`Nekos.best - ${sub}`);
            if(data.results[0]?.artist_href) {
                buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setURL(data.results[0].artist_href)
                            .setLabel('View artist')
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setURL(data.results[0].source_url)
                        .setLabel('View source')
                        .setStyle(ButtonStyle.Link)
                );
                return interaction.reply({ embeds: [embed], components: [buttons] });
            }
        } else if (group === 'nekoslife') {
            const map = {
                neko: 'neko',
                waifu: 'waifu',
                lizard: 'lizard',
                foxgirl: 'foxGirl',
                kemonomimi: 'kemonomimi',
                holo: 'holo',
                woof: 'woof',
                wallpaper: 'wallpaper',
                goose: 'goose',
                gecg: 'gecg',
                avatar: 'avatar'
            };

            url = `https://nekos.life/api/v2/img/${map[sub]}`;
            const data: any = await fetch(url).then(res => res.json());
            embed.setImage(data.url);
            embed.setTitle(`Nekos.life - ${sub}`);
            return interaction.reply({ embeds: [embed] });
        }
        return interaction.reply({ embeds: [embed] });
    }
} as Command;