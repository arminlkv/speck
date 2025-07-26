import axios from "axios";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { OauthToken } from "./GoogleOauth";

type GoogleUserProfile = {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
};

class GoogleOauthUser
{
    private _accessToken: string;
    private _accessTokenExpiry: number;
    private _refreshToken: string;
    private _refreshTokenExpiry: number;
    private _oauthClient: OAuth2Client;

    public constructor(auth: OauthToken) {
        this._accessToken = auth.accessToken;
        this._accessTokenExpiry = auth.accessTokenExpiry;
        this._refreshToken = auth.refreshToken;
        this._refreshTokenExpiry = auth.refreshTokenExpiry;

        this._oauthClient = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI,
        );

        this._oauthClient.setCredentials({
            access_token: this._accessToken,
            refresh_token: this._refreshToken,
        });
    }

    public async getUserProfile(): Promise<GoogleUserProfile> {
        // const { data: profile } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
        //     headers: { Authorization: `Bearer ${this._accessToken}` },
        // });
        // this._oauthClient.

        // return profile as GoogleUserProfile;
        const oauth2 = google.oauth2({
            auth: this._oauthClient,
            version: 'v2'
        });

        const res = await oauth2.userinfo.get();

        return res.data as GoogleUserProfile;
    }
}

export { GoogleOauthUser };
