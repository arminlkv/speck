import { v4 as uuidv4 } from "uuid";
import { dbPool } from "../database/Database";

class Session
{
    private _googleAccessToken: string | null;

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

        const results = await dbPool.query("SELECT token, expires, google_access_token FROM sessions WHERE token = $1 LIMIT 1", [
            token,
        ]);

        if (results.rowCount === 0) {
            return null;
        }

        return new Session(token, new Date(results.rows[0].expires * 1000), results.rows[0].google_access_token);
    }

    private constructor(
        public readonly token: string,
        public readonly expires: Date,
        googleAccessToken?: string,
    ) {
        this._googleAccessToken = googleAccessToken;
    }

    public get googleAccessToken(): string | null {
        return this._googleAccessToken;
    }

    public async setGoogleAccessToken(token: string): Promise<void> {
        this._googleAccessToken = token;

        await dbPool.query(`UPDATE sessions
            SET google_access_token = $1
            WHERE ctid IN (
                SELECT ctid FROM sessions WHERE token = $2 LIMIT 1
        )`, [
            this._googleAccessToken,
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
