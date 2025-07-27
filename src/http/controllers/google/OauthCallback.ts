import express from "express";
import { GoogleOauth, OauthToken } from "../../../services/GoogleOauth";
import { GoogleOauthUser } from "../../../services/GoogleOauthUser";
import { Session } from "../../../services/Session";
import { Calendar } from "../../../services/Calendar";

export async function oauthCallback(req: express.Request, res: express.Response, next: Function): Promise<void> {
    const { code, state } = req.query;
      
    try {
        // Exchange authorization code for access token
        const tokens = await GoogleOauth.instance.obtainToken(code as string);
        
        const session: Session = await Session.findSession(state as string);
        if (!session) {
            res.status(401).json({
                error: "Session not found.",
            });
            return;
        }

        const oauthToken: OauthToken = {
            accessToken: tokens.accessToken,
            accessTokenExpiry: Math.floor(tokens.accessTokenExpiry / 1000),
            refreshToken: tokens.refreshToken,
            refreshTokenExpiry: tokens.refreshTokenExpiry,
        };

        await session.updateGoogleTokens(oauthToken);

        const oauthUser: GoogleOauthUser = new GoogleOauthUser(oauthToken);

        const profileData = await oauthUser.getUserProfile();
        const calendarData = await oauthUser.fetchCalendarData();

        await Calendar.sync(profileData.id, calendarData);
    
        res.redirect(process.env.FRONTEND_URL);

        next();
    } catch (error) {
        console.error('Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login`);

        next();
    }
}
