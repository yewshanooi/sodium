import { EmbedBuilder } from "discord.js";

export const errors = {
    guildOnly: new EmbedBuilder()
        .setTitle("Error")
        .setDescription("This command cannot be executed in Direct Messages.")
        .setColor("#ff5555"),

    noAPIKey: new EmbedBuilder()
        .setTitle("Error")
        .setDescription("No API key found. Please set one in the `.env` file to use this command.")
        .setColor("#ff5555"),

    noPermission: new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You have no permission to use this command.")
        .setColor("#ff5555"),

    noPrivateDM: new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety`.")
        .setColor("#ff5555"),

    executeFail: new EmbedBuilder()
        .setTitle("Error")
        .setDescription("There was an error while executing this command.")
        .setColor("#ff5555"),

    noGuildDB: new EmbedBuilder()
        .setTitle("Error")
        .setDescription("No existing database found. Guild administrator must run `/mongodb initialize` to use this command.")
        .setColor("#ff5555"),
};

export type ErrorKeys = keyof typeof errors;
