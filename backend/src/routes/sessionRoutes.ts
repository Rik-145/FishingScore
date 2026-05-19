import { Router }           from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import * as sessionController from '../controllers/sessionController';

const router = Router();

router.get('/', authenticateToken, sessionController.getMySessions);
router.get('/:id', authenticateToken, sessionController.getMySessionById);
router.post('/', authenticateToken, sessionController.createSession);
router.patch('/:id', authenticateToken, sessionController.updateMySession);
router.delete('/:id', authenticateToken, sessionController.deleteMySession);

export default router;