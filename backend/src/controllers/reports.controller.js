import * as assetRepository from '../repositories/asset.repository.js';
import * as hindsightService from '../services/hindsight.service.js';
import * as reportRepository from '../repositories/report.repository.js';
import { validateReport } from '../validators/report.validator.js';

export async function createReport(req, res) {
  const report = validateReport(req.body);
  const asset = await assetRepository.getAssetById(report.assetId);

  if (!asset) {
    const error = new Error('Asset not found');
    error.statusCode = 404;
    throw error;
  }

  const savedReport = await reportRepository.createReport(report);

  try {
    const memoryResult = await hindsightService.retain(savedReport);

    if (memoryResult?.success !== true) {
      throw new Error('Hindsight did not confirm memory retention');
    }
  } catch {
    return res.status(202).json({
      reportSaved: true,
      memoryStored: false,
      report: savedReport,
      error: {
        code: 'HINDSIGHT_RETAIN_FAILED',
        message: 'Report was saved, but maintenance memory could not be retained.',
      },
    });
  }

  res.status(201).json({ reportSaved: true, memoryStored: true, report: savedReport });
}