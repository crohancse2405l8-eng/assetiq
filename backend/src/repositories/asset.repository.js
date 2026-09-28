import { query } from '../db/mysql.js';

export async function getAssetById(assetId) {
  const rows = await query(
    `SELECT id, asset_id AS assetId, name, \`type\`, location, created_at AS createdAt
     FROM assets
     WHERE asset_id = ?
     LIMIT 1`,
    [assetId],
  );

  return rows[0] ?? null;
}