import { Router } from 'express';
import { getAuthUrl, oauth2callback } from '../controllers/authController';

const router = Router();

router.get('/url', getAuthUrl);
router.get('/callback', oauth2callback);

export default router;
