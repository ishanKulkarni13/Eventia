import { Router } from 'express';
import { listAvailableEvents } from '../controllers/eventController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Student-only: view available events
router.get('/events', requireAuth, requireRole(['student']), listAvailableEvents);

export default router;
