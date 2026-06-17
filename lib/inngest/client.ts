// src/inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "finance",
    name: "Finance",
    isDev: process.env.NODE_ENV === "development",
    retryFunction: async (attempt: number) => ({
        delay: Math.pow(2, attempt) * 1000,
        maxAttempts: 2,
    }),
});