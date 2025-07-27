import express from "express";
import { Session } from "../../../services/Session";
import { GoogleOauthUser } from "../../../services/GoogleOauthUser";
import { google } from "googleapis";
import { Calendar } from "../../../services/Calendar";

export async function createEvent(
  req: express.Request,
  res: express.Response,
  next: Function
): Promise<void> {
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

  const oauthUser: GoogleOauthUser = new GoogleOauthUser({
    accessToken: session.googleAccessToken,
    refreshToken: session.googleRefreshToken,
    accessTokenExpiry: session.googleAccessTokenExpiry,
    refreshTokenExpiry: session.googleRefreshTokenExpiry,
  });

  console.log("Creating calendar event with data:", req.body);

  const calendar = google.calendar({
    auth: oauthUser.getOauthClient(),
    version: "v3",
  });

  const { summary, start, end } = req.body;

  const event = {
    summary,
    start: {
      dateTime: new Date(start).toISOString(), // parse and convert to ISO string
      timeZone: "UTC",
    },
    end: {
      dateTime: new Date(end).toISOString(),
      timeZone: "UTC",
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    const profileData = await oauthUser.getUserProfile();

    await Calendar.addEntry(profileData.id, {
      id: response.data.id,
      summary: response.data.summary,
      start: response.data.start.dateTime || response.data.start.date,
      end: response.data.end.dateTime || response.data.end.date,
    });

    res
      .status(201)
      .json({
        id: response.data.id,
        summary: response.data.summary,
        start: response.data.start.dateTime || response.data.start.date,
        end: response.data.end.dateTime || response.data.end.date,
      });
      
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
