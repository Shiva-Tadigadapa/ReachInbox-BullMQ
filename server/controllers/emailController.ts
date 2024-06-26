import { Request, Response } from 'express';
import { google } from 'googleapis';
import { getGoogleToken, getGoogleClient as getLocalGoogleClient } from '../config/googleAuth';

export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  console.log('code:', code)
  try {
    const tokens = await getGoogleToken(code);
    res.json({ accessToken: tokens.access_token });
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.status(500).json({ error: 'Failed to obtain access token' });
  }
};





const getGoogleClient = () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  return oAuth2Client;
};

export const fetchEmails = async (req: Request, res: Response) => {
  const accessToken = req.query.access_token as string;
  const oAuth2Client = getGoogleClient();
  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 50, // Adjust maxResults as per your requirement
      q: 'in:inbox', // Optional: additional query parameters
    });

    const emails = response.data.messages || [];

    // Fetch details of each email
    const emailDetails = await Promise.all(
      emails.map(async (email) => {
        const message = await gmail.users.messages.get({
          userId: 'me',
          id: email.id!,
          format: 'full', // Request full message payload
        });

        return {
          id: email.id,
          payload: message.data.payload!,
        };
      })
    );

    res.json(emailDetails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};


export const fetchEmail = async (req: Request, res: Response) => {
  const accessToken = req.query.access_token as string;
  const emailId = req.params.id;
  const oAuth2Client = getGoogleClient();
  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'full', // Request full message payload
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
};