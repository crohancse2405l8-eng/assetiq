import * as assetRepository from '../repositories/asset.repository.js';
import { generateAssetBrief } from '../services/maintenanceBrief.service.js';
import { validateAssetId } from '../validators/asset.validator.js';

export async function getAsset(req, res) {
  const assetId = validateAssetId(req.params.id);
  const asset = await assetRepository.getAssetById(assetId);

  if (!asset) {
    const error = new Error('Asset not found');
    error.statusCode = 404;
    throw error;
  }

  res.json(asset);
}

export async function getMaintenanceBrief(req, res) {
  const assetId = validateAssetId(req.params.id);
  const asset = await assetRepository.getAssetById(assetId);

  if (!asset) {
    const error = new Error('Asset not found');
    error.statusCode = 404;
    throw error;
  }

  const result = await generateAssetBrief(assetId);
  res.json({ assetId, brief: result.brief });
}