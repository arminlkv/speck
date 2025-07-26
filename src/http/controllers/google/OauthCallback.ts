import express from "express";
import { GoogleOauth, OauthToken } from "../../../services/GoogleOauth";
import { GoogleOauthUser } from "../../../services/GoogleOauthUser";
import { Session } from "../../../services/Session";

export async function oauthCallback(req: express.Request, res: express.Response, next: Function): Promise<void> {
    const { code, state } = req.query;
      
    try {
        // Exchange authorization code for access token
        const tokens = await GoogleOauth.instance.obtainToken(code as string);
        
        const session: Session = await Session.findSession(state as string);
        if (!session) {
            throw new Error("User session not found.");
        }

        await session.updateGoogleTokens({
            accessToken: tokens.accessToken,
            accessTokenExpiry: Math.floor(tokens.accessTokenExpiry / 1000),
            refreshToken: tokens.refreshToken,
            refreshTokenExpiry: tokens.refreshTokenExpiry,
        });
    
        res.redirect(process.env.FRONTEND_URL);
        next();
    } catch (error) {
        console.error('Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
}
