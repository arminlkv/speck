import express from "express";
import { GoogleOauthUser } from "../../../services/GoogleOauthUser";
import { Session } from "../../../services/Session";

export async function profileData(req: express.Request, res: express.Response, next: Function): Promise<void> {
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

    // Use access_token or id_token to fetch user profile
    const oauthUser: GoogleOauthUser = new GoogleOauthUser({
        accessToken: session.googleAccessToken,
        refreshToken: session.googleRefreshToken,
        accessTokenExpiry: session.googleAccessTokenExpiry,
        refreshTokenExpiry: session.googleRefreshTokenExpiry,
    });
    const userProfile = await oauthUser.getUserProfile();

    res.status(200).json(userProfile);
}
