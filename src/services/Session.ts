import { v4 as uuidv4 } from "uuid";
import { dbPool } from "../database/Database";

type GoogleTokenInfo = {
    accessToken: string;
    accessTokenExpiry: number;
    refreshToken: string;
    refreshTokenExpiry: number;
};

class Session
{
    private _googleAccessToken: string | null;
    private _googleAccessTokenExpiry: number | null;
    private _googleRefreshToken: string | null;
    private _googleRefreshTokenExpiry: number | null;

    /**
     * @description Creates a new `Session`
     * @returns {Promise<Session>}
     */
    public static async create(): Promise<Session> {
        
        const uuid: string = uuidv4();
        const today: Date = new Date();
        const expiryDate: Date = new Date();
        expiryDate.setDate(today.getDate() + 7);

        await dbPool.query("INSERT INTO sessions (token, expires) VALUES ($1, $2)", [
            uuid,
            Math.floor(expiryDate.getTime() / 1000),
        ]);

        return new Session(uuid, expiryDate);
    }

    /**
     * @description Returns a new `Session` if found, otherwise null
     * @param {string} token
     * @returns {Promise<Session | null>}
     */
    public static async findSession(token: string): Promise<Session | null> {

        const results = await dbPool.query("SELECT token, expires, google_access_token, google_access_token_expiry, google_refresh_token, google_refresh_token_expiry FROM sessions WHERE token = $1 LIMIT 1", [
            token,
        ]);

        if (results.rowCount === 0) {
            return null;
        }

        return new Session(
            token,
            new Date(results.rows[0].expires * 1000),
            {
                accessToken: results.rows[0].google_access_token,
                accessTokenExpiry: results.rows[0].google_access_token_expiry,
                refreshToken: results.rows[0].google_refresh_token,
                refreshTokenExpiry: results.rows[0].google_refresh_token_expiry,
            },
        );
    }

    private constructor(
        public readonly token: string,
        public readonly expires: Date,
        googleTokenInfo?: GoogleTokenInfo,
    ) {
        if (googleTokenInfo) {
            this._googleAccessToken = googleTokenInfo.accessToken;
            this._googleAccessTokenExpiry = googleTokenInfo.accessTokenExpiry;
            this._googleRefreshToken = googleTokenInfo.refreshToken;
            this._googleRefreshTokenExpiry = googleTokenInfo.refreshTokenExpiry;
        }
    }

    public get googleAccessToken(): string | null {
        return this._googleAccessToken;
    }

    public get googleAccessTokenExpiry(): number | null {
        return this._googleRefreshTokenExpiry;
    }

    public get googleRefreshToken(): string | null {
        return this._googleRefreshToken;
    }

    public get googleRefreshTokenExpiry(): number | null {
        return this._googleRefreshTokenExpiry;
    }

    public async updateGoogleTokens(tokens: GoogleTokenInfo): Promise<void> {
        this._googleAccessToken = tokens.accessToken;
        this._googleAccessTokenExpiry = tokens.accessTokenExpiry;
        this._googleRefreshToken = tokens.refreshToken;
        this._googleRefreshTokenExpiry = tokens.refreshTokenExpiry;

        await dbPool.query(`UPDATE sessions
            SET google_access_token = $1, google_access_token_expiry = $2, google_refresh_token = $3, google_refresh_token_expiry = $4
            WHERE ctid IN (
                SELECT ctid FROM sessions WHERE token = $5 LIMIT 1
        )`, [
            this._googleAccessToken,
            this._googleAccessTokenExpiry,
            this._googleRefreshToken,
            this._googleRefreshTokenExpiry,
            this.token,
        ]);
    }

    /**
     * @description Checks if the current session is valid
     * @returns {boolean}
     */
    public isValid(): boolean {
        const currentTimestamp: number = Math.floor(Date.now() / 1000);

        return Math.floor(this.expires.getTime() / 1000) > currentTimestamp;
    }
}

export { Session };
