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

type CalendarEntry = {
    id: string;
    summary: string;
    start: string;
    end: string;
};

class GoogleOauthUser
{
    private _accessToken: string;
    private _refreshToken: string;
    private _oauthClient: OAuth2Client;

    public constructor(auth: OauthToken) {
        this._accessToken = auth.accessToken;
        this._refreshToken = auth.refreshToken;

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
        const oauth2 = google.oauth2({
            auth: this._oauthClient,
            version: 'v2'
        });

        const res = await oauth2.userinfo.get();

        return res.data as GoogleUserProfile;
    }

    public async fetchCalendarData(): Promise<CalendarEntry[]> {
        const calendar = google.calendar({
            version: 'v3',
            auth: this._oauthClient,
        });

       const now = new Date();

        // 3 months ago
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);

        // 3 months from now
        const threeMonthsLater = new Date(now);
        threeMonthsLater.setMonth(now.getMonth() + 3);

        const res = await calendar.events.list({
            calendarId: 'primary',
            timeMin: threeMonthsAgo.toISOString(),
            timeMax: threeMonthsLater.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        return (res.data.items || []).map((event: any) => ({
            id: event.id,
            summary: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime   || event.end.date,
        }));
    }
}

export { GoogleOauthUser, CalendarEntry };
