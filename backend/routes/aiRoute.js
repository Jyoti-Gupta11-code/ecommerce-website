import express from 'express';
import { handleIntent } from '../controllers/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/intent', handleIntent);

export default aiRouter;
