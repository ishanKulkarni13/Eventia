import { Router } from 'express';
import {
	getAttendanceCode,
	listAttendanceRecords,
	startAttendance,
	stopAttendance,
} from '../controllers/attendanceController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Admin/Volunteer: start attendance window
router.post('/:eventId/start', requireAuth, requireRole(['admin', 'volunteer']), startAttendance);
// Admin/Volunteer: stop attendance window
router.post('/:eventId/stop', requireAuth, requireRole(['admin', 'volunteer']), stopAttendance);
// Admin/Volunteer: get current code
router.get('/:eventId/code', requireAuth, requireRole(['admin', 'volunteer']), getAttendanceCode);
// Admin-only: list attendance records
router.get('/:eventId/records', requireAuth, requireRole(['admin']), listAttendanceRecords);

export default router;
