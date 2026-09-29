import { query } from '../db/mysql.js';

const reportColumns = `id, assetId, \`timestamp\`, symptom, diagnosis,
  action, partsUsed, outcome,
  technicianNotes, createdAt`;

export async function createReport(report) {
  const result = await query(
    `INSERT INTO maintenance_reports
      (assetId, symptom, diagnosis, action, partsUsed, outcome, technicianNotes, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      report.assetId,
      report.symptom,
      report.diagnosis,
      report.action,
      report.partsUsed,
      report.outcome,
      report.technicianNotes,
    ],
  );

  const rows = await query(
    `SELECT ${reportColumns}
     FROM maintenance_reports
     WHERE id = ?
     LIMIT 1`,
    [result.insertId],
  );

  return rows[0];
}

export async function findReportsByAssetId(assetId) {
  return query(
    `SELECT ${reportColumns}
     FROM maintenance_reports
     WHERE assetId = ?
     ORDER BY \`timestamp\` DESC, id DESC`,
    [assetId],
  );
}