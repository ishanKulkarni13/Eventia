import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';
import authRoutes from './auth.js';
import eventRoutes from './events.js';
import studentRoutes from './student.js';
import volunteerRoutes from './volunteer.js';
import volunteersRoutes from './volunteers.js';

const router = Router();

router.get('/health', healthCheck);
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/student', studentRoutes);
router.use('/volunteer', volunteerRoutes);
router.use('/volunteers', volunteersRoutes);

export default router;
