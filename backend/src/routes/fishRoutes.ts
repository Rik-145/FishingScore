import { Router }           from 'express';
import { authenticateToken } from "../middleware/authMiddleware";
import * as fishController  from '../controllers/fishController';

const router = Router();

router.get('/', fishController.getAllFish);
router.post('/', authenticateToken, fishController.createFish);
router.patch('/:id', authenticateToken, fishController.updateFish);
router.patch('/:id/deactivate', authenticateToken, fishController.deactivateFish);
router.patch('/:id/activate', authenticateToken, fishController.activateFish);

export default router;