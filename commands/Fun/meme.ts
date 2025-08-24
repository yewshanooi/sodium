import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import fetch from 'node-fetch';

const subreddits = ['meme', 'memes', 'dankmemes', 'wholesomememes'];
const animeSubs = ['animemes', 'goodanimemes', 'AnimeFunny'];

export default {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get memes from different sources')
        .addSubcommand(sub =>
            sub.setName('reddit')
                .setDescription('Get a meme from Reddit'))
        .addSubcommand(sub =>
            sub.setName('random')
                .setDescription('Get a random meme from meme-api'))
        .addSubcommand(sub =>
            sub.setName('anime')
                .setDescription('Get an anime meme')),
    cooldown: 5,
    category: 'Fun',
    guildOnly: false,
    execute: async (client, interaction) => {
        await interaction.deferReply();

        let embed;
        let memeData;

        if (interaction.options.getSubcommand() === 'reddit') {
            const randomSub = subreddits[Math.floor(Math.random() * subreddits.length)];
            const data: any = await fetch(`https://www.reddit.com/r/${randomSub}.json`).then(res => res.json());
            const posts = data.data.children.filter(m => m.data.post_hint === 'image');
            const randomPost = posts[Math.floor(Math.random() * posts.length)];

            if (!randomPost) return interaction.editReply(`❌ Could not fetch meme from r/${randomSub}`);

            embed = new EmbedBuilder()
                .setTitle(randomPost.data.title)
                .setURL(`https://reddit.com${randomPost.data.permalink}`)
                .setImage(randomPost.data.url)
                .setColor('#ff4500')
                .setFooter({ text: `👍 ${randomPost.data.ups} | r/${randomSub}` });
        }

        if (interaction.options.getSubcommand() === 'random') {
            memeData = await fetch('https://meme-api.com/gimme').then(res => res.json());

            embed = new EmbedBuilder()
                .setTitle(memeData.title)
                .setURL(memeData.postLink)
                .setImage(memeData.url)
                .setColor('#00bfff')
                .setFooter({ text: `From r/${memeData.subreddit}` });
        }

        if (interaction.options.getSubcommand() === 'anime') {
            const randomSub = animeSubs[Math.floor(Math.random() * animeSubs.length)];
            const data: any = await fetch(`https://www.reddit.com/r/${randomSub}.json`).then(res => res.json());
            const posts = data.data.children.filter(m => m.data.post_hint === 'image');
            const randomPost = posts[Math.floor(Math.random() * posts.length)];

            if (!randomPost) return interaction.editReply(`❌ Could not fetch meme from r/${randomSub}`);

            embed = new EmbedBuilder()
                .setTitle(randomPost.data.title)
                .setURL(`https://reddit.com${randomPost.data.permalink}`)
                .setImage(randomPost.data.url)
                .setColor('#ff69b4')
                .setFooter({ text: `Anime memes from r/${randomSub}` });
        }

        await interaction.editReply({ embeds: [embed] });
        const msg = await interaction.fetchReply() as any;
        const reactions = ['👍', '👎', '😂', '😮', '😡', '❌'];

        for (const r of reactions) {
            try {
                await msg.react(r);
            } catch (e) {
                console.error(`❌ Failed to react with ${r}`, e);
            }
        }
    }
} as Command;
