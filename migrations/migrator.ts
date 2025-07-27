require("dotenv").config();

import { dbPool } from "../src/database/Database";

(async () => {

    console.log("Migrating...");

    await dbPool.query(`
        DROP TABLE IF EXISTS "events";
        CREATE TABLE "public"."events" (
            "summary" text NOT NULL,
            "start_date" timestamptz NOT NULL,
            "end_date" timestamptz NOT NULL,
            "id" text NOT NULL,
            "user_id" text NOT NULL,
            CONSTRAINT "events_id" PRIMARY KEY ("id")
        )
        WITH (oids = false);

        DROP TABLE IF EXISTS "sessions";
        CREATE TABLE "public"."sessions" (
            "expires" bigint NOT NULL,
            "google_access_token" text,
            "token" uuid NOT NULL,
            "google_refresh_token" text,
            "google_access_token_expiry" bigint,
            "google_refresh_token_expiry" bigint,
            CONSTRAINT "sessions_expires" PRIMARY KEY ("expires")
        )
        WITH (oids = false);`);

    console.log("Migrations done.");
    process.exit();
})();
