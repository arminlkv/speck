import { WebServer } from "./WebServer";

export function registerRoutes(): void {
    WebServer.instance.get("/api/healthcheck", (req, res) => {
        res.status(200).json({ status: "ok" });
    });
}
