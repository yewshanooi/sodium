import { Events } from "discord.js";

import type { Event } from "../../Utils/types/Client";

export default {
    name: Events.Raw,
    execute: async (client, d) => {
        client.lavalink.sendRawData(d);
    }
} as Event;
