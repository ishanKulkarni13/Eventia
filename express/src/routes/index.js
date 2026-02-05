import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';
import authRoutes from './auth.js';

const router = Router();

router.get('/health', healthCheck);
router.use('/auth', authRoutes);

export default router;
