import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { HindsightService } = require('../../services/hindsight/hindsightService.js');
let hindsightService;

function getHindsightService() {
  hindsightService ??= new HindsightService();
  return hindsightService;
}

function serviceError(cause) {
  const error = new Error('Hindsight service unavailable', { cause });
  error.statusCode = 502;
  error.code = 'HINDSIGHT_UNAVAILABLE';
  return error;
}

export async function retain(report) {
  try {
    return await getHindsightService().retainMaintenanceMemory(report);
  } catch (cause) {
    throw serviceError(cause);
  }
}

export async function recall(assetId) {
  try {
    return await getHindsightService().recallAssetMemory(assetId);
  } catch (cause) {
    throw serviceError(cause);
  }
}