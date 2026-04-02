import express from 'express';
import catRoutes from './api/routes/catRoutes.js';
import userRoutes from './api/routes/userRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/v1/cats', catRoutes);
app.use('/api/v1/users', userRoutes);

export default app;
