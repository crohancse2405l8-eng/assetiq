import { createRequire } from 'node:module';
import * as hindsightService from './hindsight.service.js';
import * as groqService from './groq.service.js';

const require = createRequire(import.meta.url);
const { MaintenanceBriefService } = require('../../services/ai/maintenanceBriefService.js');

export async function generateAssetBrief(assetId) {
  try {
    const service = new MaintenanceBriefService({
      hindsightService: {
        recallAssetMemory: (id, query) => hindsightService.recall(id, query),
      },
      groqService: {
        generateMaintenanceBrief: (context) => groqService.generateMaintenanceBrief(context),
      },
    });

    return await service.generateAssetBrief(assetId);
  } catch (cause) {
    const error = new Error(cause.message || 'Maintenance brief generation failed', { cause });
    error.statusCode = cause.statusCode || 502;
    error.code = cause.code || 'MAINTENANCE_BRIEF_FAILED';
    throw error;
  }
}