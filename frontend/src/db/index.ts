import Dexie, { Table } from "dexie";
import { Message, Model, Provider, Session } from "../utils/types/types";

class AgentKDB extends Dexie {
    sessions!: Table<Session, string>;
    messages!: Table<Message, number>;
    providers!: Table<Provider, string>;
    models!: Table<Model, string>;

    constructor() {
        super("agentk_db");

        this.version(1).stores({
            sessions: "id, startedAt",

            messages:
                "++id, sessionId, ts, modelId, " +
                "[sessionId+ts], " +
                "[sessionId+modelId+ts]",

            providers: "id, updated",
            
            models: "modelId, providerId, enabled"
        });

        this.sessions = this.table("sessions");
        this.messages = this.table("messages");
        this.providers = this.table("providers");
        this.models = this.table("models");
    }
}

export const database = new AgentKDB();

export async function initializeDB() {
    if (!database.isOpen()) await database.open();

    return database;
}