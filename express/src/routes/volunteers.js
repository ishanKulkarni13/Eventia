import { Router } from 'express';
import { listVolunteers } from '../controllers/eventController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Admin-only: list volunteers for assignment
router.get('/', requireAuth, requireRole(['admin']), listVolunteers);

export default router;
