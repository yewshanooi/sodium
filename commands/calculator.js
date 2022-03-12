const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { evaluate } = require('mathjs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculator')
        .setDescription('Bring up a simple calculator'),
    cooldown: '5',
    guildOnly: false,
    async execute (interaction) {
        let content = '';
		let data = '';

        const generateComponents = () => {
            const row1 = new MessageActionRow().addComponents(
                new MessageButton().setCustomId('clear').setLabel('C').setStyle('DANGER'),
                new MessageButton().setCustomId('(').setLabel('(').setStyle('PRIMARY'),
                new MessageButton().setCustomId(')').setLabel(')').setStyle('PRIMARY'),
                new MessageButton().setCustomId('^').setLabel('^').setStyle('PRIMARY')
            );
            const row2 = new MessageActionRow().addComponents(
                new MessageButton().setCustomId('7').setLabel('７').setStyle('SECONDARY'),
                new MessageButton().setCustomId('8').setLabel('８').setStyle('SECONDARY'),
                new MessageButton().setCustomId('9').setLabel('９').setStyle('SECONDARY'),
                new MessageButton().setCustomId('/').setLabel('÷').setStyle('PRIMARY')
            );
            const row3 = new MessageActionRow().addComponents(
                new MessageButton().setCustomId('4').setLabel('４').setStyle('SECONDARY'),
                new MessageButton().setCustomId('5').setLabel('５').setStyle('SECONDARY'),
                new MessageButton().setCustomId('6').setLabel('６').setStyle('SECONDARY'),
                new MessageButton().setCustomId('*').setLabel('×').setStyle('PRIMARY')
            );
            const row4 = new MessageActionRow().addComponents(
                new MessageButton().setCustomId('1').setLabel('１').setStyle('SECONDARY'),
                new MessageButton().setCustomId('2').setLabel('２').setStyle('SECONDARY'),
                new MessageButton().setCustomId('3').setLabel('３').setStyle('SECONDARY'),
                new MessageButton().setCustomId('-').setLabel('−').setStyle('PRIMARY')
            );
            const row5 = new MessageActionRow().addComponents(
                new MessageButton().setCustomId('0').setLabel('０').setStyle('SECONDARY'),
                new MessageButton().setCustomId('.').setLabel('.').setStyle('SECONDARY'),
                new MessageButton().setCustomId('=').setLabel('=').setStyle('SUCCESS'),
                new MessageButton().setCustomId('+').setLabel('+').setStyle('PRIMARY')
            );
            return [row1, row2, row3, row4, row5];
        };

		const components = generateComponents();

		interaction.reply({ content: '```\n \n ```', components });
		const message = await interaction.fetchReply();

		const filter = compInt => compInt.user.id === interaction.user.id;
		const collector = message.createMessageComponentCollector(filter, { time: 10e3 });

		collector.on('collect', compInt => {
		const value = compInt.customId;

		switch (value) {
			case 'clear':
				data = '';
				content = '```\n \n ```';
				break;
			case '=':
				try {
					const res = evaluate(data);
					content = `\`\`\`\n${data}\n= ${res}\`\`\``;
					data = `${res}`;
				}
            catch (err) {
					content = '```Error: Something went wrong while trying to evaluate this expression.```';
					data = '';
				}
					break;
			default:
				data += value;
				content = `\`\`\`\n${data} \n \`\`\``;
				break;
			}

			collector.resetTimer();
			compInt.update({ content, components });
		});

        /*
         * collector.on('end', () => {
         *     message.edit({
         *         content: `${content}*This session has timed out. You can start a new one with \`/calculator\`.*`
         *     });
         * });
         */

	}
};