import { Router } from 'express';
import {  googleCallback,fetchEmails } from '../controllers/emailController';

const gmailRouter = Router();

// gmailRouter.get('/google/auth', googleAuth);

gmailRouter.get('/auth/google/callback', googleCallback);

gmailRouter.get('/emails', fetchEmails);
export default gmailRouter;
