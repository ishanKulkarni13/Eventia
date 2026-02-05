import { Router } from 'express';
import { listAssignedEvents } from '../controllers/eventController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Volunteer-only: view assigned events
router.get('/events', requireAuth, requireRole(['volunteer']), listAssignedEvents);

export default router;
