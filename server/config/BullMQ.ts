// bullmqConfig.ts
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendGmail } from '../controllers/emailController';
import { getGoogleClient } from './googleAuth'; // Your existing function to get OAuth2Client

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

const emailQueue = new Queue('emailQueue', { connection });

const sendEmailWorker = new Worker('emailQueue', async job => {
  const { email, subject, body, accessToken } = job.data;
  const oAuth2Client = getGoogleClient();
  oAuth2Client.setCredentials({ access_token: accessToken });
  await sendGmail(oAuth2Client, email, subject, body);
}, { connection });

export { emailQueue, sendEmailWorker };
