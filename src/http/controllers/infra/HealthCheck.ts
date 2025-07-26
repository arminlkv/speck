import express from "express";
import { dbPool } from "../../../database/Database";

export async function healthCheck(req: express.Request, res: express.Response, next: Function): Promise<void> {

    await dbPool.query("SELECT NOW()");

    res.status(200).json({
        database: "ok",
        http: "ok",
    });
}
