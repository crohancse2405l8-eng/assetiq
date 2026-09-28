import * as hindsightService from '../services/hindsight.service.js';
import * as reportRepository from '../repositories/report.repository.js';
import { validateReport } from '../validators/report.validator.js';

export async function createReport(req, res) {
  const report = validateReport(req.body);
  const savedReport = await reportRepository.createReport(report);

  await hindsightService.retain(savedReport);

  res.status(201).json(savedReport);
}