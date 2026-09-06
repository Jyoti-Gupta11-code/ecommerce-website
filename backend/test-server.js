// Minimal test server that only loads the AI route
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import aiRouter from './routes/aiRoute.js';

const app = express();
const port = 4001;

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => res.send('AI Test Server Running'));

// Confirm GEMINI_API_KEY loaded (without exposing it)
console.log('GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);

app.listen(port, () => {
  console.log(`AI Test Server running on http://localhost:${port}`);
});
