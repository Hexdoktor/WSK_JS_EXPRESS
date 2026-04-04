import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import catRoutes from './api/routes/catRoutes.js';
import userRoutes from './api/routes/userRoutes.js';
import authRoutes from './api/routes/authRoutes.js';

const app = express();
app.use((req, res, next) => {
  console.log('---- RAW REQUEST ----');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api/v1/cats', catRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

export default app;
