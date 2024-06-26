import { Request, Response } from 'express';
import { ConfidentialClientApplication } from '@azure/msal-node';
import axios from 'axios';

const msalConfig = {
    auth: {
        clientId: process.env.OUTLOOK_CLIENT_ID || '',
        authority: `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}`,
        clientSecret: process.env.OUTLOOK_CLIENT_SECRET || '',
    },
};

const REDIRECT_URI = 'http://localhost:3000/auth/outlook/callback';

const msalClient = new ConfidentialClientApplication(msalConfig);

export const getOutLookUrl = (req: Request, res: Response) => {
    const authCodeUrlParameters = {
        scopes: ["https://graph.microsoft.com/Mail.Read"],
        redirectUri: REDIRECT_URI,
    };

    msalClient.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.send({ url: response });
    }).catch((error) => {
        console.error('Error generating Outlook auth URL:', error);
        res.status(500).send('Error generating auth URL');
    });
};

export const outlook2callback = async (req: Request, res: Response) => {
    const tokenRequest = {
        code: req.query.code as string,
        scopes: ["https://graph.microsoft.com/Mail.Read"],
        redirectUri: REDIRECT_URI,
    };

    try {
        const response = await msalClient.acquireTokenByCode(tokenRequest);
        res.redirect(`http://localhost:3000/outlook/emails?access_token=${response.accessToken}`);
    } catch (error) {
        console.error('Error getting Outlook token:', error);
        res.status(500).send('Error authenticating with Outlook');
    }
};

export const fetchOutlookEmails = async (req: Request, res: Response) => {
    const accessToken = req.query.access_token as string;

    try {
        const response = await axios.get('https://graph.microsoft.com/v1.0/me/messages', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { $top: 10 },
        });

        const emails = response.data.value.map((email: any) => ({
            id: email.id,
            subject: email.subject,
            bodyPreview: email.bodyPreview,
        }));

        res.send(emails);
    } catch (error) {
        console.error('Error fetching Outlook emails:', error);
        res.status(500).send('Error fetching emails');
    }
};
