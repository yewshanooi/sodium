import { SlashCommandBuilder, ApplicationCommandOptionType } from "discord.js";
import { FunctionDeclaration, Type } from "@google/genai";
import type { Command } from "../Utils/types/Client";

export function commandToFunctionDeclaration(command: Command): FunctionDeclaration {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    (command.data.options as any[]).forEach((opt) => {
        let paramType: Type | undefined;
        switch (opt.type) {
            case ApplicationCommandOptionType.String:
                paramType = Type.STRING;
                break;
            case ApplicationCommandOptionType.Number:
            case ApplicationCommandOptionType.Integer:
                paramType = Type.NUMBER;
                break;
            case ApplicationCommandOptionType.Boolean:
                paramType = Type.BOOLEAN;
                break;
        }

        if (paramType) {
            properties[opt.name] = {
                type: paramType,
                description: opt.description ?? "No description",
                enum: opt.choices ? Array.from(opt.choices, (c:any) => c.value) : undefined
            };
            if (opt.required) {
                required.push(opt.name);
            }
        }
    });

    return {
        name: command.data.name.replace(/[^a-zA-Z0-9_.-]/g, '_'),
        description: command.data.description ?? "Discord command",
        parametersJsonSchema: {
            type: Type.OBJECT,
            properties: properties,
            required: required
        }
    };
}

// Spawn all functions for commands with gemini: true
export function getGeminiFunctionDeclarations(client: any): FunctionDeclaration[] {
    const declarations: FunctionDeclaration[] = [];
    for (const command of client.commands.values()) {
        const cmd:any = command as Command;
        if (cmd.gemini === true && cmd.data instanceof SlashCommandBuilder) {
            declarations.push(commandToFunctionDeclaration(cmd));
        }
    }
    return declarations;
}

export async function executeGeminiFunctionCall(
    client: any,
    interaction: any,
    functionCall: { name: string; args: Record<string, any> }
) {
    const { name, args } = functionCall;
    const command = client.commands.get(name);
    if (!command) {
        console.warn(`No se encontró comando para función Gemini: ${name}`);
        return;
    }

    const fakeInteraction = {
        ...interaction,
        commandName: name,
        user: interaction.user ?? interaction.member?.user,
        member: interaction.member,
        options: {
            getString: (n: string) =>
                typeof args[n] === "string" ? args[n] : null,
            getNumber: (n: string) =>
                typeof args[n] === "number" ? args[n] : null,
            getBoolean: (n: string) =>
                typeof args[n] === "boolean" ? args[n] : null,
            getSubcommand: () => args._subcommand ?? null,
            getSubcommandGroup: () => args._subcommandGroup ?? null,
            // si quieres, también getUser / getRole / getChannel...
            getUser: (n: string) => args[n] ?? null,
            getRole: (n: string) => args[n] ?? null,
            getChannel: (n: string) => args[n] ?? null,
        },
        reply: async (content: any) => interaction.followUp(content),
        followUp: async (content: any) => interaction.followUp(content),
        editReply: async (content: any) => interaction.editReply(content),
    } as any;

    try {
        if (typeof command.execute === "function") {
            await (command as any).execute(client, fakeInteraction);
        } else if (typeof (command as any).execute === "object" && typeof (command as any).execute.execute === "function") {
            await (command as any).execute.execute(client, fakeInteraction);
        }
    } catch (err) {
        console.error(`Error ejecutando comando Gemini ${name}:`, err);
    }
}
