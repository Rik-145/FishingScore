import { Router }            from 'express';
import { authenticateToken } from "../middleware/authMiddleware";
import * as catchController  from '../controllers/catchController';
import { asyncHandler }      from "../utils/asyncHandler";

const router = Router();

router.get('/', authenticateToken, asyncHandler(catchController.getMyCatches));
router.get('/:id', authenticateToken, asyncHandler(catchController.getMyCatchById));
router.post('/', authenticateToken, asyncHandler(catchController.createCatch));
router.patch('/:id', authenticateToken, asyncHandler(catchController.updateMyCatch));
router.delete('/:id', authenticateToken, asyncHandler(catchController.deleteMyCatch));

export default router;