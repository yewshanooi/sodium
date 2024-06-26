const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('fortnite')
        .setDescription('Get a Fortnite player\'s stats from Fortnite-API')
        .addStringOption(option => option.setName('username').setDescription('Enter a username').setRequired(true)),
    cooldown: '5',
    category: 'Fun',
    guildOnly: false,
    async execute (interaction) {
        await interaction.deferReply();

        if (!process.env.FORTNITE_API_KEY) return interaction.editReply({ embeds: [global.errors[1]] });

        const usernameField = interaction.options.getString('username');

        const Fortnite = await fetch(`https://fortnite-api.com/v2/stats/br/v2?name=${usernameField}`, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `${process.env.FORTNITE_API_KEY}`
            }
        }).then(res => res.json());

            if (Fortnite.status === 400) return interaction.editReply('Error: Invalid or missing parameters.');
            if (Fortnite.status === 403) return interaction.editReply('Error: User\'s account stats are private.');
            if (Fortnite.status === 404) return interaction.editReply('Error: No such account found.');

            const winRate = Fortnite.data.stats.all.overall.winRate.toFixed(2);

        const embed = new EmbedBuilder()
            .setTitle(`${Fortnite.data.account.name} (LVL **${Fortnite.data.battlePass.level}**)`)
            .addFields(
                { name: 'Epic Account ID', value: `\`${Fortnite.data.account.id}\`` },
                { name: 'Matches Played', value: `\`${Fortnite.data.stats.all.overall.matches}\``, inline: true },
                { name: 'Win Rate', value: `\`${winRate}\`%`, inline: true },
                { name: 'Minutes Played', value: `\`${Fortnite.data.stats.all.overall.minutesPlayed}\`` },
                { name: 'Total Wins', value: `\`${Fortnite.data.stats.all.overall.wins}\`` },
                { name: 'Total Kills / Deaths', value: `\`${Fortnite.data.stats.all.overall.kills}\` / \`${Fortnite.data.stats.all.overall.deaths}\`` }
            )
            .setFooter({ text: 'Powered by Fortnite-API' })
            .setColor('#f4f4f4');
        return interaction.editReply({ embeds: [embed] });
    }
};