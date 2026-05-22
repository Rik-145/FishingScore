import { Router }            from 'express';
import { authenticateToken } from "../middleware/authMiddleware";
import * as fishController   from '../controllers/fishController';
import { asyncHandler }       from "../utils/asyncHandler";

const router = Router();

router.get('/', asyncHandler(fishController.getAllFish));
router.post('/', authenticateToken, asyncHandler(fishController.createFish));
router.patch('/:id', authenticateToken, asyncHandler(fishController.updateFish));
router.patch('/:id/deactivate', authenticateToken, asyncHandler(fishController.deactivateFish));
router.patch('/:id/activate', authenticateToken, asyncHandler(fishController.activateFish));

export default router;