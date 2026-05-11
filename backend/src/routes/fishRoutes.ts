import { Router } from 'express';
import * as fishController from '../controllers/fishController';

const router = Router();

router.get('/', fishController.getAllFish);
router.post('/', fishController.createFish);

export default router;