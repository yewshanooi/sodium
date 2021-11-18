const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor, token } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Watch some YouTube videos with friends'),
    cooldown: '10',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('CREATE_INSTANT_INVITE')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **CREATE_INSTANT_INVITE** permission in `Server settings > Roles > Skye > Permissions` to use this command.' });
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'Error: You must join a voice channel to use this command.' });

        fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
            method: 'POST',
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: '755600276941176913',
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                'Authorization': `Bot ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(body => {
            const embed = new MessageEmbed()
                .setTitle('Watch Together')
                .setDescription(`Party created! Use this link to join the party and invite others\nhttps://discord.gg/${body.code}`)
                .setColor(embedColor);

                const button = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setURL(`https://discord.gg/${body.code}`)
                        .setLabel('Join Party')
                        .setStyle('LINK'));

            interaction.reply({ embeds: [embed], components: [button] });
        }).catch(() => {
                interaction.reply({ content: 'Error: There was an error generating the link.' });
            });
        }
};