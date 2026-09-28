import * as assetRepository from '../repositories/asset.repository.js';
import * as hindsightService from '../services/hindsight.service.js';
import * as groqService from '../services/groq.service.js';

export async function getAsset(req, res) {
  const asset = await assetRepository.getAssetById(req.params.id);

  if (!asset) {
    const error = new Error('Asset not found');
    error.statusCode = 404;
    throw error;
  }

  res.json(asset);
}

export async function getMaintenanceBrief(req, res) {
  const context = await hindsightService.recall(req.params.id);
  const brief = await groqService.generateMaintenanceBrief(context);

  res.json({ assetId: req.params.id, brief });
}