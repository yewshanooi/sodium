/* eslint-disable no-ternary */
/* eslint-disable multiline-ternary */

const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('npm')
        .setDescription('Search the NPM Registry for a package information')
        .addStringOption(option => option.setName('package').setDescription('Enter a package').setRequired(true)),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        const stringField = interaction.options.getString('package');

        const body = await fetch(`https://registry.npmjs.com/${stringField}`)
            .then(res => res.ok && res.json())
            .catch(() => null);

        if (!body) return interaction.reply({ content: 'Error: No package found with that name.' });

        const version = body.versions[body['dist-tags'].latest];

        let deps = version.dependencies ? Object.keys(version.dependencies) : null;
        let maintainers = body.maintainers.map(user => user.name);

            if (maintainers.length > 10) {
                const len = maintainers.length - 10;
                maintainers = maintainers.slice(0, 10);
                maintainers.push(`...${len} more.`);
            }

            if (deps && deps.length > 10) {
                const len = deps.length - 10;
                deps = deps.slice(0, 10);
                deps.push(`...${len} more.`);
            }

        const embed = new MessageEmbed()
            .setTitle(`${stringField}`)
            .setDescription(`${body.description || 'No Description.'}\n\n**Version:** ${body['dist-tags'].latest}\n**License:** ${body.license}\n**Author:** ${body.author ? body.author.name : 'Unknown'}\n**Dependencies:** ${deps && deps.length ? deps.join(', ') : 'None'}`)
            .setColor(embedColor);

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL(`https://npmjs.com/package/${stringField}`)
                    .setLabel('View Package')
                    .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};