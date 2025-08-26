import {
	AutocompleteInteraction, ChatInputCommandInteraction, Client, SlashCommandBuilder,
	SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder
} from "discord.js";
import { RedisClientType } from "redis";
import { myCustomPlayer } from "../classes/customPlayerClass";

import { errors } from "../errors";
import FakeYou from "fakeyouapi.js";

import type { LavalinkManager, MiniMap } from "lavalink-client";
import type { JSONStore } from "../classes";
import { BlobOptions } from "buffer";

export class ExtendedClient extends Client {
    public errors = errors;
    public fy?: FakeYou.Client;
}

declare type InteractionExecuteFN = (client: BotClient, interaction: ChatInputCommandInteraction<"cached">) => any;
declare type AutoCompleteExecuteFN = (client: BotClient, interaction: AutocompleteInteraction) => any;

export interface CustomRequester {
    id: string,
    username: string,
    avatar?: string,
}

export interface Command {
    apis: Array<string>,
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    gemini: boolean | false;
    cooldown: number | 0;
    category: string;
    guildOnly: boolean;
    execute: InteractionExecuteFN;
    autocomplete?: AutoCompleteExecuteFN;
}

type subCommandExecute = { [subCommandName: string]: InteractionExecuteFN };
type subCommandAutocomplete = { [subCommandName: string]: AutoCompleteExecuteFN };
export interface SubCommand {
    data: SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandsOnlyBuilder;
    execute: subCommandExecute;
    gemini?: boolean | false;
    guildOnly?: boolean;
    cooldown?: number | 0;
    autocomplete?: subCommandAutocomplete;
}

export interface Event {
    name: string,
    execute: (client: BotClient, ...params: any) => any;
}

export interface BotClient extends Client {
    lavalink: LavalinkManager<myCustomPlayer>;
    commands: MiniMap<string, Command | SubCommand>;
    redis: RedisClientType | JSONStore | MiniMap<string, string>;
    defaultVolume: number | 100;
    embedColor: string;
    errors: typeof errors;
    fy?: FakeYou.Client;
}