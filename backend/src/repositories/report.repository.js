import { query } from '../db/mysql.js';

const reportColumns = `id, asset_id AS assetId, \`timestamp\`, symptom, diagnosis,
  action, parts_used AS partsUsed, outcome,
  technician_notes AS technicianNotes, created_at AS createdAt`;

export async function createReport(report) {
  const result = await query(
    `INSERT INTO maintenance_reports
      (asset_id, symptom, diagnosis, action, parts_used, outcome, technician_notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
    `SELECT ${reportColumns} FROM maintenance_reports WHERE id = ? LIMIT 1`,
    [result.insertId],
  );

  return rows[0];
}

export async function findReportsByAssetId(assetId) {
  return query(
    `SELECT ${reportColumns}
     FROM maintenance_reports
     WHERE asset_id = ?
     ORDER BY \`timestamp\` DESC, id DESC`,
    [assetId],
  );
}