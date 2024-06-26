import { Request, Response } from 'express';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Set tokens here or retrieve them from a database
oauth2Client.setCredentials({
    access_token: 'YOUR_ACCESS_TOKEN',
    refresh_token: 'YOUR_REFRESH_TOKEN',
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export const listMessages = async (req: Request, res: Response) => {
    try {
        const response = await gmail.users.messages.list({
            userId: 'me',
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error listing messages' });
    }
};
