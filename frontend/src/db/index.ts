import Dexie, { Table } from "dexie";
import { Session, Model, MessageRow } from "../utils/types/types";

class AgentKDB extends Dexie {
    sessions!: Table<Session, string>;
    messages!: Table<MessageRow, number>;
    models!: Table<Model, string>;

    constructor() {
        super("agentk_db");

        this.version(1).stores({
            sessions: "id, startedAt",
            models: "id, provider, enabled",
            messages:
                "++id, sessionId, ts, modelId, " +
                "[sessionId+ts], " +
                "[sessionId+modelId+ts]",
        });

        this.sessions = this.table("sessions");
        this.models = this.table("models");
        this.messages = this.table("messages");
    }
}

export const database = new AgentKDB();

export async function initializeDB() {
    if (!database.isOpen()) await database.open();

    return database;
}