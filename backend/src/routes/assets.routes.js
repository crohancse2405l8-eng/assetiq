import { Router } from 'express';
import { getAssets, getAsset, getMaintenanceBrief } from '../controllers/assets.controller.js';

const router = Router();

router.get('/', getAssets);
router.get('/:id', getAsset);
router.get('/:id/brief', getMaintenanceBrief);

export default router;