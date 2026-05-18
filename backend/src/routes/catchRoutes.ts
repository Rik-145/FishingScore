import { Router }            from 'express';
import { authenticateToken } from "../middleware/authMiddleware";
import * as catchController  from '../controllers/catchController';

const router = Router();

router.get('/', authenticateToken, catchController.getMyCatches);
router.get('/:id', authenticateToken, catchController.getMyCatchById);
router.post('/', authenticateToken, catchController.createCatch);

export default router;