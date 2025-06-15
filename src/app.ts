import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './database/connection';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { ensureDbConnected } from './middlewares/ensureDbConnected';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes';


const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://books-repo.vercel.app'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// app.get('/health', (_req, res) => {
//   res.status(200).json({ status: 'ok' });
// });

app.use('/auth', authRoutes);




app.use(ensureDbConnected);


app.use(errorHandler);

connectToDatabase()
  .then(() => console.log('🟢 Initial DB connection attempt complete.'))
  .catch((err) => console.warn('⚠️ Initial DB connection failed:', err));

export default app;
