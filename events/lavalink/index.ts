import { NodesEvents } from "./Nodes";
import { PlayerEvents } from "./Player";

import type { BotClient } from "../../Utils/types/Client";

export function loadLavalinkEvents(client: BotClient) {
    NodesEvents(client);
    PlayerEvents(client);
}
