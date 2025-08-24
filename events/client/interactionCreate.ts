import { Events, EmbedBuilder, Collection, InteractionType, MessageFlags, ChannelType } from "discord.js";
const cooldowns = new Collection<string, Collection<string, number>>();

import type { ChatInputCommandInteraction, CommandInteractionOptionResolver, Interaction } from "discord.js";
import type { Command, Event, SubCommand } from "../../Utils/types/Client";

export default {
    name: Events.InteractionCreate,
    execute: async (client, interaction: Interaction) => {
        if (!interaction.isCommand() && !interaction.isAutocomplete()) return;
        let subCommand: string | null = null;
        if (interaction.isChatInputCommand() || interaction.isAutocomplete()) {
            subCommand = interaction.options.getSubcommand(false);
        }
        const command = client.commands.get(interaction.commandName);
        if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);
        
        // Outputs an error message if user tries to run a guild-only command in a Direct Message
        if (command.guildOnly && !interaction.inGuild()) {
            return await (interaction as ChatInputCommandInteraction<"cached">).reply({ embeds: [client.errors.noPrivateDM] });
        }
        try {
            if (interaction.isCommand()) {
                // Outputs an error message if user tries to run a command that is still on a cooldown
                if (!cooldowns.has(command.data.name)) {
                    cooldowns.set(command.data.name, new Collection());
                }

                const now = Date.now();
                const timestamps = cooldowns.get(command.data.name)!;
                const cooldownAmount = (command.cooldown || 3) * 1000;

                if (timestamps.has(interaction.user.id)) {
                    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                            // Orange color embed
                            const inCooldown = new EmbedBuilder()
                                .setTitle('Cooldown')
                                .setDescription(`Please wait \`${timeLeft.toFixed(1)}\` more second(s) before reusing the **${command.data.name}** command.`)
                                .setColor('#ffaa00');
                            return await (interaction as ChatInputCommandInteraction<"cached">).reply({ embeds: [inCooldown], flags: [MessageFlags.Ephemeral] });
                        }
                }
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

                if (subCommand) {
                    if ("execute" in command && typeof (command as SubCommand).execute === "object") {
                        const subExec = (command as SubCommand).execute[subCommand];
                        if (typeof subExec !== "function") {
                            return console.error(`[Command-Error] Sub-Command is missing property "execute#${subCommand}".`);
                        }
                        return await subExec(client, interaction as ChatInputCommandInteraction<"cached">);
                    }
                    if ("execute" in command && typeof (command as Command).execute === "function") {
                        return await (command as Command).execute(client, interaction as ChatInputCommandInteraction<"cached">);
                    }
                }
                // execute command
                return await (command as Command).execute(client, interaction as ChatInputCommandInteraction<"cached">);
            }
            if (interaction.isAutocomplete()) {
                if (subCommand) {
                    if (typeof (command as SubCommand).autocomplete?.[subCommand] !== "function") return console.error(`[Command-Error] Sub-Command is missing property "autocomplete#${subCommand}".`);
                    // execute subcommand-autocomplete
                    return await (command as SubCommand).autocomplete?.[subCommand](client, interaction);
                }
                if (!(command as Command).autocomplete) return console.error(`[Command-Error] Command is missing property "autocomplete".`);
                // execute command-autocomplete
                return await (command as Command).autocomplete?.(client, interaction);
            }
        } catch (error) {
            console.error(error);
            if (interaction.isAutocomplete()) return;
            if ((interaction as ChatInputCommandInteraction<"cached">).replied || (interaction as ChatInputCommandInteraction<"cached">).deferred) {
                await (interaction as ChatInputCommandInteraction<"cached">).followUp({ flags: [MessageFlags.Ephemeral], embeds: [client.errors.executeFail] });
            } else {
                await (interaction as ChatInputCommandInteraction<"cached">).reply({ flags: [MessageFlags.Ephemeral], embeds: [client.errors.executeFail] });
            }
        }
    }
} as Event;
