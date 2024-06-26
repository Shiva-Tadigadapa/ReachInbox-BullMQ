import { Request, Response } from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
);

export const getAuthUrl = (req: Request, res: Response) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    });
    res.send({ url: authUrl });
};

export const oauth2callback = (req: Request, res: Response) => {
    const { code } = req.query;
    oauth2Client.getToken(code as string, (err, tokens) => {
        if (err) {
            return res.status(400).json({ error: 'Error retrieving access token' });
        }
        oauth2Client.setCredentials(tokens!);
        res.send(tokens);
    });
};

