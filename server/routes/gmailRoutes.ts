import { Router } from 'express';
import { listMessages } from '../controllers/gmailController';

const router = Router();

router.get('/messages', listMessages);


export default router;
