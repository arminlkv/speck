import { WebServer } from "./WebServer";
import { healthCheck } from "./controllers/infra/HealthCheck";
import { oauthRedirect } from "./controllers/google/OauthRedirect";
import { oauthCallback } from "./controllers/google/OauthCallback";
import { profileData } from "./controllers/user/ProfileData";
import { calendarData } from "./controllers/user/CalendarData";
import { syncCalendarData } from "./controllers/user/SyncCalendarData";
import { createEvent } from "./controllers/user/CreateCalendarEvent";

export function registerRoutes(): void {
    WebServer.instance.get("/api/healthcheck", healthCheck);

    WebServer.instance.get("/auth/google", oauthRedirect);
    WebServer.instance.get("/auth/google/callback", oauthCallback);

    WebServer.instance.get("/api/user/calendar", calendarData);
    WebServer.instance.post("/api/user/calendar/sync", syncCalendarData);
    WebServer.instance.post("/api/user/calendar/create", createEvent);

    WebServer.instance.get("/api/user/me", profileData);
}
