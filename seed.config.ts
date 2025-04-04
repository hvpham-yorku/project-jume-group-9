import { SeedPg } from "@snaplet/seed/adapter-pg";
import { defineConfig } from "@snaplet/seed/config";
import { Client } from "pg";

export default defineConfig({
  adapter: async () => {
    const client = new Client({
      connectionString: process.env.SUPABASE_DB_URL,
    });
    await client.connect();
    return new SeedPg(client);
  },
  // We only want to generate data for the public schema
  select: ["!*", "public.*", "auth.*", "storage.*"],
});
