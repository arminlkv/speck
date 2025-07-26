require("dotenv").config();

import { dbPool } from "../src/database/Database";

(async () => {

    console.log("Migrating...");

    await dbPool.query(`
        DROP TABLE IF EXISTS "events";
        DROP SEQUENCE IF EXISTS events_id_seq;
        CREATE SEQUENCE events_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

        CREATE TABLE "public"."events" (
            "id" integer DEFAULT nextval('events_id_seq') NOT NULL,
            "name" text NOT NULL,
            "start_date" timestamp NOT NULL,
            "end_date" timestamp NOT NULL,
            CONSTRAINT "events_pkey" PRIMARY KEY ("id")
        )
        WITH (oids = false);

        DROP TABLE IF EXISTS "sessions";
        CREATE TABLE "public"."sessions" (
            "expires" bigint NOT NULL,
            "google_access_token" text,
            "token" uuid NOT NULL,
            CONSTRAINT "sessions_expires" PRIMARY KEY ("expires")
        )
        WITH (oids = false);`);

    console.log("Migrations done.");
    process.exit();
})();
