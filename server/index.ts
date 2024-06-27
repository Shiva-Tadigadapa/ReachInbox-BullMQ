import app from "./app";
import dotenv from "dotenv";
import gmailRouter from "./routes/emailRoutes";
import authRoutes from './routes/authRoutes';
import gmailRoutes from './routes/gmailRoutes';
import outlookRoutes from './routes/outLookRoutes';
import cors from "cors";
dotenv.config();

app.use(cors());
app.use('/api', gmailRouter);
app.use('/auth', authRoutes);
app.use('/gmail', gmailRoutes);
app.use('/outlook', outlookRoutes);
app.use('/send', gmailRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
