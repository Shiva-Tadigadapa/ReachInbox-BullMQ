import { Request, Response } from 'express';
import { google } from 'googleapis';
import { getGoogleClient } from '../config/googleAuth';

// Function to fetch emails from Gmail
export const fetchEmails = async (req: Request, res: Response) => {
  const accessToken = req.query.access_token as string;
  const oAuth2Client = getGoogleClient();
  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 10,
    });

    const emails = response.data.messages || [];

    const emailDetails = await Promise.all(
      emails.map(async (email) => {
        const message = await gmail.users.messages.get({
          userId: 'me',
          id: email.id!,
        });

        return {
          id: email.id,
          snippet: message.data.snippet,
        };
      })
    );

    res.json(emailDetails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};
