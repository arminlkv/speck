import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

type OauthToken = {
    accessToken: string;
    accessTokenExpiry: number;
    refreshToken: string;
    refreshTokenExpiry: number;
};

class GoogleOauth
{
    private static _instance: GoogleOauth;

    private _clientId: string;

    private _clientSecret: string;

    private _redirectUri: string;

    private _scopes: string;

    private _client: OAuth2Client;


    public static get instance(): GoogleOauth {
        if (this._instance === undefined) {
            this._instance = new GoogleOauth();
        }

        return this._instance;
    }

    public constructor() {
        this._clientId = process.env.GOOGLE_CLIENT_ID;
        this._clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        this._redirectUri = process.env.GOOGLE_REDIRECT_URI;
        this._scopes = process.env.GOOGLE_SCOPES;

        this._client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI,
        );
    }

    /**
     * @description Returns a google auth redirect uri
     * @returns {string}
     */
    public getRedirectUri(sessionToken: string): string {
        return this._client.generateAuthUrl({
            access_type: 'offline',
            scope: this._scopes,
            state: sessionToken,
            prompt: 'consent',
        });
    }

    /**
     * @description Obtains the accessToken and idToken from google auth based on the code provided.
     * @param {string} code
     * @returns {Promise<OauthToken>}
     */
    public async obtainToken(code: string): Promise<OauthToken> {
        const { tokens } = await this._client.getToken(code) as any;

        return {
            accessToken: tokens.access_token,
            accessTokenExpiry: tokens.expiry_date,
            refreshToken: tokens.refresh_token,
            refreshTokenExpiry: Math.floor(Date.now() / 1000) + tokens.refresh_token_expires_in,
        };
    }
}

export { GoogleOauth, OauthToken };
