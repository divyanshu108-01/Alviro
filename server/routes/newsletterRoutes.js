import express from 'express';
import { subscribeToNewsletter, getSubscribers } from '../controllers/newsletterController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/subscribe', subscribeToNewsletter);
router.get('/', auth, getSubscribers);

export default router;
