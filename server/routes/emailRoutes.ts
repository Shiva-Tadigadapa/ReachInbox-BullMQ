import { Router } from 'express';
import {  googleCallback,fetchEmails,fetchEmail ,sendGmailData } from '../controllers/emailController';

const gmailRouter = Router();

// gmailRouter.get('/google/auth', googleAuth);

gmailRouter.get('/auth/google/callback', googleCallback);

gmailRouter.get('/emails', fetchEmails);
gmailRouter.get('/emails/:id', fetchEmail);

gmailRouter.post('/gmail',sendGmailData)

export default gmailRouter;
