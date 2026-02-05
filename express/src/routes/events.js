import { Router } from 'express';
import {
	createEvent,
	deleteEvent,
	listEvents,
	updateEvent,
} from '../controllers/eventController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Admin-only: create/list events
router.post('/', requireAuth, requireRole(['admin']), createEvent);
router.get('/', requireAuth, requireRole(['admin']), listEvents);
router.patch('/:eventId', requireAuth, requireRole(['admin']), updateEvent);
router.delete('/:eventId', requireAuth, requireRole(['admin']), deleteEvent);

export default router;
