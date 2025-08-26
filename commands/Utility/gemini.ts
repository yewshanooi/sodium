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
import { generateGeminiContent } from "../../Utils/geminiHelper";

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
        const MAX_HISTORY_MESSAGES = 8;
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
        sessions.set(channelId, { 
            history: [{
                role: "user",
                parts: [{ 
                    text: "Eres un bot de Discord llamado Grasabot. Responde a mis preguntas de forma natural y conversacional. Si el contexto lo amerita, añade un emoji o varios emojis de reacción usando el formato especial <emojis:😞:🌧️> para usarlos en Discord como Unicode. Por ejemplo, si una respuesta es graciosa, añade <emojis:🤣>. Si gustas pueden añadir emojis durante el texto/mensaje final"
                }]
            }], 
            messages: [] 
        });

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
            idle: 900000
        });

        msgCollector.on("collect", async msg => {
            const session = sessions.get(channelId);
            if (!session) return msgCollector.stop();
            if (typeof msg.content === 'string' && msg.content.startsWith('/')) return;
            
            (msg.channel as TextChannel).sendTyping();

            // Añadir mensaje del usuario al historial
            session.history.push({ role: "user", parts: [{ text: msg.content }] });

            let response: any;
            let text: string;
            let allEmojis: string[] = [];
            const emojiRegex = /<emojis:([^>]+)>/g;
            try {
                let message = msg.content.replace(/<@!?(\d+)>/g, (match, userId) => {
                    const member = msg.guild?.members.cache.get(userId);
                    if (member) { return `${member.nickname ?? member.user.username}`; } return match;
                })
                response = await generateGeminiContent(ai, session.history, message, msg.attachments.toJSON(), client, interaction as any);

                if (response.candidates[0].finishReason === 'SAFETY' || response.candidates[0].finishReason === 'RECITATION') {
                    text = `Error: This response is blocked due to **${response.candidates[0].finishReason}** violation.`;
                } else {
                    text = response.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response received.";
                    
                    let matches = [...text.matchAll(emojiRegex)];
                    for (const match of matches) {
                        const raw = match[1];
                        const emojis = raw.split(":").filter(e => e.trim() !== "");
                        allEmojis.push(...emojis);
                        text = text.replace(match[0], "").trim();
                    }
                }
            } catch (err) {
                console.error("Gemini error:", err);
                text = "❌ Error obtaining response from model.";
            }

            // Guardar respuesta en historial
            session.history.push({ role: "model", parts: [{ text }] });

            if (session.history.length > MAX_HISTORY_MESSAGES + 1) {
                const initialInstruction = session.history[0];
                const recentHistory = session.history.slice(session.history.length - MAX_HISTORY_MESSAGES);
                session.history = [initialInstruction, ...recentHistory];
            }

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
            
            if (allEmojis.length > 0) {
                for (const emoji of allEmojis) {
                    try {
                        await msg.react(emoji);
                    } catch (reactError) {
                        console.log(`Failed to react with emoji '${emoji}':`, reactError);
                    }
                }
            }
            const embed = new EmbedBuilder()
                .setDescription(trim(text, 4096)) // Usa la variable 'text' ya limpia
                .setColor(client.embedColor as any);

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
                embeds: [new EmbedBuilder().setDescription("✅ Conversation closed").setColor("Red").setFooter({ text: 'Powered by Google' })],
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
