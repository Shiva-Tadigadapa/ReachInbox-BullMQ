import { Router } from 'express';
import { getAuthUrl, oauth2callback } from '../controllers/authController';
import { getOutLookUrl, outlook2callback } from '../controllers/outlookAuthController';

const router = Router();

router.get('/google/url', getAuthUrl);
router.get('/callback', oauth2callback);

router.get('/outlook/url', getOutLookUrl);
router.get('/outlook/callback', outlook2callback);



export default router;
