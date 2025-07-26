import { Pool } from "pg";

const dbPool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
  max: Number(process.env.DATABASE_MAX_CONNECTIONS || "5"),
});

export { dbPool };
