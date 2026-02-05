import { Router } from 'express';
import { listAvailableEvents, registerForEvent } from '../controllers/eventController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Student-only: view available events
router.get('/events', requireAuth, requireRole(['student']), listAvailableEvents);
// Student-only: register for an event by slug
router.post('/events/:eventId/register', requireAuth, requireRole(['student']), registerForEvent);

export default router;
