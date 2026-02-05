import { Router } from 'express';
import { listAvailableEvents, registerForEvent } from '../controllers/eventController.js';
import { markAttendance } from '../controllers/attendanceController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Student-only: view available events
router.get('/events', requireAuth, requireRole(['student']), listAvailableEvents);
// Student-only: register for an event by slug
router.post('/events/:eventId/register', requireAuth, requireRole(['student']), registerForEvent);
// Student-only: mark attendance by slug + code
router.post('/events/:eventId/attendance', requireAuth, requireRole(['student']), markAttendance);

export default router;
