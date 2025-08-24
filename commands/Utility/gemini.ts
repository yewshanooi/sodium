import { 
    EmbedBuilder, 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonStyle, 
    ButtonBuilder,
    TextBasedChannel, TextChannel
} from "discord.js";
import type { Command } from "../../Utils/types/Client";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

const sessions = new Map<string, { history: any[], messages: string[] }>();

export default {
    apis: ['GOOGLE_API_KEY'],
    data: new SlashCommandBuilder()
        .setName('gemini')
        .setDescription('Chat with Gemini, an AI-powered chatbot by Google'),
    cooldown: 5,
    category: 'Utility',
    guildOnly: false,
    execute: async (client, interaction) => {
        if (!process.env.GOOGLE_API_KEY) {
            return interaction.reply("API key missing");
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
        const channelId = interaction.channelId;
        const userId = interaction.user.id;

        if (sessions.has(channelId)) {
            return interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setDescription("⚠️ There's already an active conversation in this channel. Please close it before starting another one.")
                    .setColor("Red")], 
                ephemeral: true 
            });
        }

        // Crear sesión
        sessions.set(channelId, { history: [], messages: [] });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`end-${channelId}`)
                .setLabel("❌ Close conversation")
                .setStyle(ButtonStyle.Danger)
        );

        const startMsg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("💬 Conversation started with Gemini.\nType in this channel to continue.")
                    .setColor("#669df6")
            ],
            components: [row]
        });

        sessions.get(channelId)!.messages.push(startMsg.id);

        const channel = interaction.channel;

        const msgCollector = channel.createMessageCollector({
            filter: m => !m.author.bot,
            idle: 300000
        });

        msgCollector.on("collect", async msg => {
            const session = sessions.get(channelId);
            if (!session) return msgCollector.stop();

            (msg.channel as TextChannel).sendTyping();

            // Añadir mensaje del usuario al historial
            session.history.push({ role: "user", parts: [{ text: msg.content }] });

            let response: any;
            let text: string;

            try {
                response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: session.history,
                    config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: -1 } },
                    generationConfig: { temperature: 1, topP: 0.95, topK: 40, candidateCount: 1, maxOutputTokens: 1024 },
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_UNSPECIFIED, threshold: HarmBlockThreshold.BLOCK_NONE }
                    ]
                } as any);

                if (response.candidates[0].finishReason === 'SAFETY' || response.candidates[0].finishReason === 'RECITATION') {
                    text = `Error: This response is blocked due to **${response.candidates[0].finishReason}** violation.`;
                } else {
                    text = response.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response received.";
                }
            } catch (err) {
                console.error("Gemini error:", err);
                text = "❌ Error obtaining response from model.";
            }

            // Guardar respuesta en historial
            session.history.push({ role: "model", parts: [{ text }] });

            // 🔹 Quitar botones de todos los mensajes anteriores
            for (const id of session.messages) {
                try {
                    const oldMsg = await channel.messages.fetch(id);
                    if (oldMsg.editable) {
                        await oldMsg.edit({ components: [] });
                    }
                } catch {}
            }

            const trim = (str: string, max: number) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

            // Función para añadir referencias
            function addCitations(res: any) {
                let modelText = res.candidates?.[0]?.content?.parts?.[0]?.text || "";
                const supports = res.candidates[0]?.groundingMetadata?.groundingSupports || [];
                const chunks = res.candidates[0]?.groundingMetadata?.groundingChunks || [];

                const references = new Map();

                const sortedSupports = supports.filter(support => support.segment?.endIndex !== undefined && support.groundingChunkIndices?.length)
                                            .sort((a, b) => (b.segment.endIndex ?? 0) - (a.segment.endIndex ?? 0));

                for (const support of sortedSupports) {
                    for (const i of support.groundingChunkIndices) {
                        const uri = chunks[i]?.web?.uri;
                        if (uri && !references.has(uri)) {
                            references.set(uri, references.size + 1);
                            if (references.size >= 5) break;
                        }
                    }
                    if (references.size >= 5) break;
                }

                if (references.size > 0) {
                    modelText += `\n\n**References:**\n`;
                    modelText += [...references].map(([uri, index]) => `[${index}](${uri})`).join(', ');
                }

                return modelText;
            }

            const embed = new EmbedBuilder()
                .setTitle(trim(msg.content, 256))
                .setDescription(trim(addCitations(response), 4096))
                .setFooter({ text: 'Powered by Google' })
                .setColor('#669df6');

            const replyMsg = await msg.reply({
                embeds: [embed],
                components: [row]
            });

            session.messages.push(replyMsg.id);
        });

        const buttonCollector = channel.createMessageComponentCollector({
            filter: i => i.customId === `end-${channelId}` && i.user.id === userId,
            time: 3600000 // 1h
        });

        buttonCollector.on("collect", async btn => {
            sessions.delete(channelId);
            msgCollector.stop();
            await btn.update({
                embeds: [new EmbedBuilder().setDescription("✅ Conversation closed").setColor("Red")],
                components: []
            });
        });

        msgCollector.on("end", async () => {
            const session = sessions.get(channelId);
            if (session) {
                for (const id of session.messages) {
                    try {
                        const oldMsg = await channel.messages.fetch(id);
                        if (oldMsg.editable) {
                            await oldMsg.edit({ components: [] });
                        }
                    } catch {}
                }
            }
            sessions.delete(channelId);
        });
    }
} as Command;
