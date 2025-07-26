import axios from "axios";

type OauthToken = {
    accessToken: string;
    idToken: string;
};

class GoogleOauth
{
    private static _instance: GoogleOauth;

    private _clientId: string;

    private _clientSecret: string;

    private _redirectUri: string;

    private _scopes: string;


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
    }

    /**
     * @description Returns a google auth redirect uri
     * @returns {string}
     */
    public getRedirectUri(sessionToken: string): string {
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this._clientId}&redirect_uri=${this._redirectUri}&response_type=code&state=${sessionToken}&scope=${this._scopes}`;
    }

    /**
     * @description Obtains the accessToken and idToken from google auth based on the code provided.
     * @param {string} code
     * @returns {Promise<OauthToken>}
     */
    public async obtainToken(code: string): Promise<OauthToken> {
        const { data }: { data: { access_token: string, id_token: string } } = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: this._clientId,
            client_secret: this._clientSecret,
            code,
            redirect_uri: this._redirectUri,
            grant_type: 'authorization_code',
        });

        const { access_token, id_token } = data;

        return {
            accessToken: access_token,
            idToken: id_token,
        };
    }
}

export { GoogleOauth, OauthToken };
