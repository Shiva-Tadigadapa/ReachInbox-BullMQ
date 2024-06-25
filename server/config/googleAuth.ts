import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/google/callback'
);

export const getGoogleAuthUrl = () => {
  const scopes = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];
  return oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });
};

export const getGoogleToken = async (code: string) => {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  return tokens;
};

export const getGoogleClient = (): OAuth2Client => {
  return oAuth2Client;
};
