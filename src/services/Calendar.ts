import _ from "lodash";

import { CalendarEntry } from "./GoogleOauthUser";
import { dbPool } from "../database/Database";

class Calendar
{
    public static async sync(userId: string, items: CalendarEntry[]): Promise<void> {

        await Promise.all(_.map(items, async (entry: CalendarEntry) => {
            try {
                await dbPool.query(
                    `INSERT INTO events (id, summary, start_date, end_date, user_id)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (id) DO NOTHING;`,
                    [ entry.id, entry.summary, entry.start, entry.end, userId ],
                );
            } catch (error) {
                console.error(`Sync error: failed syncing event id=${entry.id}. Reason: ${error.message} `);
            }
        }));
    }

    public static async fetchEntries(userId: string): Promise<CalendarEntry[]> {

        try {
            const results = await dbPool.query("SELECT summary, start_date, end_date, id FROM events WHERE user_id = $1", [
                userId,
            ]);

            return _.map(results.rows, (row: any) => {
                return {
                    id: row.id,
                    summary: row.summary,
                    start: row.start_date,
                    end: row.end_date,
                };
            });
        } catch (error) {
            console.error(`Failed fetching calendar for user ${userId}`);
            console.error(error);

            return [];
        }
    }
}

export { Calendar };
