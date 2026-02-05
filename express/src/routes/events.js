import { Router } from 'express';
import { createEvent, listEvents } from '../controllers/eventController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Admin-only: create/list events
router.post('/', requireAuth, requireRole(['admin']), createEvent);
router.get('/', requireAuth, requireRole(['admin']), listEvents);

export default router;
