import { Router } from 'express';
import { fetchOutlookEmails ,fetchOutlookEmail} from '../controllers/outlookAuthController';

const OutlookRouter = Router();

OutlookRouter.get('/emails',fetchOutlookEmails)
OutlookRouter.get('/emails/:emailId',fetchOutlookEmail)

export default OutlookRouter;