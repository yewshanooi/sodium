import { 
    GoogleGenAI, 
    HarmBlockThreshold, 
    HarmCategory, 
    FunctionCallingConfigMode, 
    FunctionDeclaration, Type
} from "@google/genai"; import fetch from "node-fetch";
import { getGeminiFunctionDeclarations, executeGeminiFunctionCall } from "./geminiFunctions";
import type { Command } from "../Utils/types/Client";

async function processAttachment(attachmentUrl: string, type: 'image' | 'audio') {
    const response = await fetch(attachmentUrl);
    const buffer = await response.buffer();
    const mimeType = response.headers.get('content-type') || 'application/octet-stream';
    const base64Data = buffer.toString('base64');
    
    if (type === 'image') {
        return {
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        };
    } else if (type === 'audio') {
        console.warn("Processing audio is not fully implemented. You need a transcription service.");
        return null;
    }
}

async function processImage(imageUrl: string) {
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.buffer();
        const mimeType = response.headers.get('content-type') || 'application/octet-stream';
        
        if (!mimeType.startsWith('image/')) {
            return null;
        }

        const base64Data = buffer.toString('base64');
        
        return {
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        };
    } catch (err) {
        console.error(`Error processing image URL: ${imageUrl}`, err);
        return null;
    }
}
const urlRegex = /(https?:\/\/[^\s]+)/g;
const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

// Main function to interact with Gemini
export async function generateGeminiContent(
    ai: GoogleGenAI, 
    history: any[], 
    message: string, 
    attachments: any[],
    client: any,
    interaction: any
) {
    const contents: any[] = [{ role: 'user', parts: [] }];
    let processedMessage = message;
    const imageUrls: string[] = [];

    // 1. Extract URLs from the message text
    const urlsInText = processedMessage.match(urlRegex) || [];
    if(urlsInText.length > 0) {
        for (const url of urlsInText) {
            const isImage = imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
            if (isImage) {
                imageUrls.push(url);
                processedMessage = processedMessage.replace(url, '').trim(); // Elimina la URL del texto
            }
        }

        // 2. Process images from attachments and found URLs
        const allImages = [...attachments, ...imageUrls.map(url => ({ url }))];
        const imageParts = [];
        for (const image of allImages) {
            const imageData = await processImage(image.url);
            if (imageData) {
                imageParts.push(imageData);
            }
        }

        // 3. Add text and image parts to the content
        if (processedMessage) {
            contents[0].parts.push({ text: processedMessage });
        }

        if (imageParts.length > 0) {
            contents[0].parts.push(...imageParts);
        }
    } else {
        contents[0].parts.push({ text: message });
    }
    for (const attachment of attachments) {
        if (attachment.contentType.startsWith('image/')) {
            const imageData = await processAttachment(attachment.url, 'image');
            if (imageData) {
                contents[0].parts.push(imageData);
            }
        }
    }

    if (contents[0].parts.length === 0) {
      throw new Error("No text or visual content to process.");
    }
    // Join the existing history
    const fullContent = [...history, ...contents];

    const controlLightDeclaration: FunctionDeclaration = {
        name: 'controlLight',
        parametersJsonSchema: {
            type: Type.OBJECT,
            properties: {
                brightness: {
                type: Type.NUMBER,
                },
                colorTemperature: {
                type: Type.STRING,
                },
            },
            required: ['brightness', 'colorTemperature'],
        },
    };
    const playMusicDeclaration: FunctionDeclaration = {
        name: "play",
        description: "Reproduce música en el canal de voz actual.",
        parametersJsonSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "El nombre de la canción, el artista o la consulta de búsqueda.",
                    example: "Bohemian Rhapsody"
                },
                source: {
                    type: "string",
                    description: "La fuente de la música (ej: 'YouTube', 'Spotify', 'archivo local').",
                    enum: ["YouTube", "Spotify", "archivo local"],
                    example: "YouTube"
                }
            },
            required: ["query", "source"]
        }
    }

    const response: any = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: fullContent,
        config: { 
            tools: [{functionDeclarations: getGeminiFunctionDeclarations(client) }],
            functionCallingConfig: {
                mode: FunctionCallingConfigMode.ANY,
                allowedFunctionNames: Array.from(client.commands
                    .filter((c: any) => c.gemini === true)
                    .map((c: any) => c.data.name)),
            }
        },
        generationConfig: { 
            temperature: 1, 
            topP: 0.95, 
            topK: 40, 
            candidateCount: 1, 
            maxOutputTokens: 1024 
        },
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_UNSPECIFIED, threshold: HarmBlockThreshold.BLOCK_NONE }
        ]
    } as any);

    if (response.functionCalls?.length > 0) {
        console.log("Function Calls detected:", response.functionCalls);
        for (const fc of response.functionCalls) {
            await executeGeminiFunctionCall(client, interaction, fc);
        }
    }
    console.log('[GEMINI]:', response.text);
    return response;
}