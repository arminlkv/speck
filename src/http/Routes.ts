import { WebServer } from "./WebServer";
import { healthCheck } from "./controllers/infra/HealthCheck";
import { oauthRedirect } from "./controllers/google/OauthRedirect";
import { oauthCallback } from "./controllers/google/OauthCallback";
import { profileData } from "./controllers/user/ProfileData";

export function registerRoutes(): void {
    WebServer.instance.get("/api/healthcheck", healthCheck);

    WebServer.instance.get("/auth/google", oauthRedirect);
    WebServer.instance.get("/auth/google/callback", oauthCallback);

    WebServer.instance.get("/api/user/me", profileData);

    WebServer.instance.get("/logout", (req, res) => {
        res.redirect("/login");
    });

    WebServer.instance.get("/login", (req, res) => {
        console.log("Login page accessed");
        console.log(req);
    });
}
