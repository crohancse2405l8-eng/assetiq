import { query } from '../db/mysql.js';

export async function getAssets() {
  return query(
    `SELECT
       assetId,
       name,
       equipmentType,
       equipmentType AS type,
       manufacturer,
       model,
       location,
       status,
       installDate,
       createdAt
     FROM assets
     ORDER BY assetId ASC`,
  );
}

export async function getAssetById(assetId) {
  const rows = await query(
    `SELECT
       assetId,
       name,
       equipmentType,
       equipmentType AS type,
       manufacturer,
       model,
       location,
       status,
       installDate,
       createdAt
     FROM assets
     WHERE assetId = ?
     LIMIT 1`,
    [assetId],
  );

  return rows[0] ?? null;
}