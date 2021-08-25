const url = 'https://www.reddit.com/r/memes/hot/.json?limit=100';
const https = require('https');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'meme',
    description: 'Get fresh new memes from the r/memes subreddit',
    usage: 'meme',
    cooldown: '5',
    execute (message) {

        https.get(url, result => {
            let body = '';
            result.on('data', chunk => {
                body += chunk;
            });

        result.on('end', () => {
            const response = JSON.parse(body);
            const index = response.data.children[Math.floor(Math.random() * 99) + 1].data;
            const image = index.preview.images[0].source.url.replace('&amp;', '&');
            const { title } = index;
            const link = `https://reddit.com${index.permalink}`;

            const imageMeme = new MessageEmbed()
                .setTitle('Meme')
                .setDescription(`${title}`)
                .setImage(image)
                .setColor(embedColor);

                const imageButton = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setURL(`${link}`)
                        .setLabel('Reddit Post')
                        .setStyle('LINK'));

            message.channel.send({ embeds: [imageMeme], components: [imageButton] });

            if (index.post_hint !== 'image') {
                const text = index.selftext;
                const textMeme = new MessageEmbed()
                    .setTitle('Meme')
                    .setDescription(`${title}\n\n ${text}`)
                    .setColor(embedColor);

                    const textButton = new MessageActionRow()
                        .addComponents(new MessageButton()
                            .setURL(`${link}`)
                            .setLabel('Reddit Post')
                            .setStyle('LINK'));

                message.channel.send({ embeds: [textMeme], components: [textButton] });
                }
            });
        });
    }
};