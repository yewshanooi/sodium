const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'roleinfo',
    description: 'Display information(s) about the tagged role',
    usage: 'roleinfo {@role}',
    cooldown: '5',
    guildOnly: true,
    execute (message, args) {
        if (!args[0]) return message.channel.send('Error: Please provide a role.');
          const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(ri => ri.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
            if (!role) return message.channel.send('Error: Please provide a valid role.');

        const { mentionable } = role;
        let resultMention;
            if (mentionable === true) resultMention = 'Yes';
            else resultMention = 'No';

        const { hoist } = role;
        let resultHoist;
            if (hoist === true) resultHoist = 'Yes';
            else resultHoist = 'No';

        const embed = new MessageEmbed()
            .setTitle('Role Info')
            .addField('Name', `\`${role.name}\``, true)
            .addField('ID', `\`${role.id}\``, true)
            .addField('Creation Date & Time', `\`${role.createdAt}\``)
            .addField('Members', `\`${role.members.size}\``, true)
            .addField('Position', `\`${role.position}\``, true)
            .addField('Color (Hex)', `\`${role.hexColor}\``, true)
            .addField('Mentionable', `\`${resultMention}\``, true)
            .addField('Display Separately', `\`${resultHoist}\``, true)
            .setColor(embedColor);
        message.channel.send(embed);
    }
};