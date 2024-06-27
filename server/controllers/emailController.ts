  import { Request, Response } from 'express';
  import { google } from 'googleapis';
  import { getGoogleToken, getGoogleClient as getLocalGoogleClient } from '../config/googleAuth';
  import analyzeEmailUsingGenerativeAI from '../config/Gemini';
  import { Base64 } from 'js-base64';
  import { GenerateContentResult } from '@google/generative-ai';
  import { OAuth2Client } from 'google-auth-library';
  import { gmail_v1 } from 'googleapis';
  import { emailQueue } from '../config/BullMQ';

  export const googleCallback = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    console.log('code:', code);
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
      
      // Extract and analyze the HTML content
      const analyzedEmails = await Promise.all(
        emailDetails.map(async (email) => {
          const parts = email.payload.parts || [];
          let htmlContent = '';
          let from = email.payload.headers?.find((header) => header.name === 'From')?.value || 'No Sender';
          parts.forEach((part) => {
            if (part.mimeType === 'text/plain' && part.body && part.body.data) {
              htmlContent = Base64.decode(part.body.data);
            }
          });
  
          let analyzedEmail:any = '';
  
          if (htmlContent) {
             analyzedEmail = await analyzeEmailUsingGenerativeAI(htmlContent,from);
            // console.log(analyzedEmail);
          }
  
          if (analyzedEmail.label === 'interested' || analyzedEmail.label === 'more information') {
            await emailQueue.add('sendEmail', {
              email: from,
              subject: 'Response from ReachInbox',
              body: analyzedEmail.response,
              accessToken: accessToken,
            });
          }
  
          return {
            id: email.id,
            htmlContent: htmlContent,
            subject: email.payload.headers?.find((header) => header.name === 'Subject')?.value || 'No Subject',
            from: email.payload.headers?.find((header) => header.name === 'From')?.value || 'No Sender',
             analyzedEmail: analyzedEmail,
          };
        })
      );
  
      res.json(analyzedEmails,);
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

  export const sendGmail = async (oAuth2Client: OAuth2Client, to: string, subject: string, body: string) => {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  
    const email = [
      `To: ${to}`,
      'Content-Type: text/plain; charset=utf-8',
      `Subject: ${subject}`,
      '',
      body,
    ].join('\n');
  
    const encodedMessage = Base64.encodeURI(email);
  
    try {
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  };

  export const sendGmailData = async (req: Request, res: Response) => {
    const { accessToken, to, subject, body } = req.body;
  
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
  
    oAuth2Client.setCredentials({ access_token: accessToken });
  
    try {
      await sendGmail(oAuth2Client, to, subject, body);
      res.json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  }