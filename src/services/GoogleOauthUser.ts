import axios from "axios";

type GoogleOauthUserAuthInfo = {
    accessToken: string;
};

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

    public constructor(auth: GoogleOauthUserAuthInfo) {
        this._accessToken = auth.accessToken;
    }

    public async getUserProfile(): Promise<GoogleUserProfile> {
        const { data: profile } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: { Authorization: `Bearer ${this._accessToken}` },
        });

        return profile as GoogleUserProfile;
    }
}

export { GoogleOauthUser };
