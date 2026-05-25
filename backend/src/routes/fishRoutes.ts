import { Router }            from 'express';
import { authenticateToken } from "../middleware/authMiddleware";
import * as fishController   from '../controllers/fishController';
import { asyncHandler }      from "../utils/asyncHandler";
import { requireRole }       from "../middleware/roleMiddleware";

const router = Router();

router.get('/', asyncHandler(fishController.getAllFish));
router.post('/', authenticateToken, requireRole('admin', 'moderator'), asyncHandler(fishController.createFish));
router.patch('/:id', authenticateToken, requireRole('admin', 'moderator'), asyncHandler(fishController.updateFish));
router.patch('/:id/deactivate', authenticateToken, requireRole('admin', 'moderator'), asyncHandler(fishController.deactivateFish));
router.patch('/:id/activate', authenticateToken, requireRole('admin', 'moderator'), asyncHandler(fishController.activateFish));

export default router;