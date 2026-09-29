import { Router } from 'express';
import { getAsset, getMaintenanceBrief } from '../controllers/assets.controller.js';

const router = Router();

router.get('/:id', getAsset);
router.get('/:id/brief', getMaintenanceBrief);

export default router;