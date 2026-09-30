import express from 'express';
import { apiRouter } from '../server/routes/api.js';

const app = express();

app.use(express.json());

// Mount the API router on /api
app.use('/api', apiRouter);

// Export Express app as a Vercel Serverless Function handler
export default app;
