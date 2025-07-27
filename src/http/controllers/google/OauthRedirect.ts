import express from "express";
import { GoogleOauth } from "../../../services/GoogleOauth";
import { Session } from "../../../services/Session";

export async function oauthRedirect(req: express.Request, res: express.Response, next: Function): Promise<void> {
    const session: Session = await Session.create();
    const redirectUri: string = GoogleOauth.instance.getRedirectUri(session.token);

    res.status(200).json({
        redirect_uri: redirectUri,
        session: session.token,
    });

    next();
}
