import express from "express";
import { CalendarEntry, GoogleOauthUser } from "../../../services/GoogleOauthUser";
import { Session } from "../../../services/Session";
import { Calendar } from "../../../services/Calendar";

export async function calendarData(req: express.Request, res: express.Response, next: Function): Promise<void> {
    const sessionToken: string = req.header("x-speck-session");

    if (!sessionToken) {
        res.status(401).json({
            error: "Session not found.",
        });
        return;
    }

    const session: Session = await Session.findSession(sessionToken);
    if (!session) {
        res.status(401).json({
            error: "Session not found.",
        });
        return;
    }

    if (!session.googleAccessToken) {
        res.status(401).json({
            error: "Session is not authenticated with google.",
        });
        return;
    }

    const oauthUser: GoogleOauthUser = new GoogleOauthUser({
        accessToken: session.googleAccessToken,
        refreshToken: session.googleRefreshToken,
        accessTokenExpiry: session.googleAccessTokenExpiry,
        refreshTokenExpiry: session.googleRefreshTokenExpiry,
    });

    const profileData = await oauthUser.getUserProfile();
    const entries: CalendarEntry[] = await Calendar.fetchEntries(profileData.id);

    res.status(200).json(entries);

    next();
}
