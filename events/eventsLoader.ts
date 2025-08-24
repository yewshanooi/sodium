import { readdirSync } from "node:fs";
import { join } from "node:path";
import { NodesEvents } from "./lavalink/Nodes";
import { PlayerEvents } from "./lavalink/Player";
import { MongoDBEvents } from "./MongoDB/listeners";
import type { BotClient, Event } from "../Utils/types/Client";

export async function loadEvents(client: BotClient, mongoose) {
    const path = join(process.cwd(), "events/client");
    const files = readdirSync(path).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    for (const file of files) {
        const filePath = join(path, file)
        const cmd = await import(filePath).then(v => v.default) as Event;

        if ("name" in cmd && "execute" in cmd) {
            client.on(cmd.name, cmd.execute.bind(null, client))
            continue;
        }

        console.warn(`[WARNING] The Event at ${filePath} is missing a required "name" or "execute" property.`)
    }
    // Lavalink Events
    NodesEvents(client);
    PlayerEvents(client);
    // MongoDB Events
    MongoDBEvents(mongoose);
}
