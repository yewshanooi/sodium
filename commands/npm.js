const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('npm')
        .setDescription('Search the npm registry for a package information')
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
            .setDescription(`${body.description || 'No Description'}`)
            .addFields(
                { name: 'Version', value: `\`${body['dist-tags'].latest}\``, inline: true },
                { name: 'License', value: `\`${body.license || 'None'}\``, inline: true },
                { name: 'Author', value: `\`${body.author ? body.author.name : 'Unknown'}\``, inline: true },
                { name: 'Dependencies', value: `\`${deps && deps.length ? deps.join(', ') : 'None'}\`` }
            )
            .setFooter({ text: 'Powered by npm' })
            .setColor('#cc3534');

            const button = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL(`https://npmjs.com/package/${stringField}`)
                    .setLabel('View Package')
                    .setStyle('LINK'));

            return interaction.reply({ embeds: [embed], components: [button] });
        }
};