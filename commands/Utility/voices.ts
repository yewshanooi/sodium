import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
  apis: ["ENABLE_LAVALINK", "FAKEYOU_USERNAME", "FAKEYOU_PASSWORD"],
  data: new SlashCommandBuilder()
    .setName('voices')
    .setDescription('Lists or searches for available voices from FakeYou.')
    .addStringOption(option =>
      option.setName('search')
        .setDescription('The name of the voice to search for.')
        .setRequired(false)),
  cooldown: 10,
  category: 'Utility',
  guildOnly: false,
  execute: async (client, interaction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const searchQuery = interaction.options.getString('search');
    let models;

    try {
      if (searchQuery) {
        models = await client.fy.searchModel(searchQuery);
        if (models.size === 0) {
          return interaction.editReply({ content: "Don't found voices with that name." });
        }
      } else {
        models = await client.fy.searchModel("popular"); 
      }

      const voicesToShow = models.first(10); // Get only the first 10

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(searchQuery ? `Results for "${searchQuery}"` : 'Popular Voices from FakeYou');

      const voicesText = voicesToShow.map(model => `**${model.title}** \`ID: ${model.user.username}\``).join('\n');
      embed.setDescription(voicesText).setFooter({ text: `You can find the complete list of voices on the FakeYou website: https://www.fakeyou.com/search` });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'Hubo un error al buscar las voces.' });
    }
  },
} as Command;