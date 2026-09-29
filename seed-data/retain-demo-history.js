const { reports } = require('./seed-demo');
const { HindsightService } = require('../backend/services/hindsight/hindsightService');

function hasExactMemory(recall, report) {
  const expectedTime = new Date(`${report.timestamp.replace(' ', 'T')}Z`).getTime();
  return recall.results.some((result) => {
    const occurredAt = result.occurred_start ? new Date(result.occurred_start).getTime() : NaN;
    const metadata = result.metadata || {};
    return occurredAt === expectedTime &&
      metadata.assetId === report.assetId &&
      metadata.source === 'maintenance-report';
  });
}

async function main() {
  const hindsight = new HindsightService();
  let retained = 0;
  let skipped = 0;

  for (const report of reports) {
    const query = `Find the maintenance event at ${report.timestamp} with symptom ${report.symptom}.`;
    const existing = await hindsight.recallAssetMemory(report.assetId, query);

    if (hasExactMemory(existing, report)) {
      skipped += 1;
      continue;
    }

    await hindsight.retainMaintenanceMemory(report);
    const verification = await hindsight.recallAssetMemory(report.assetId, query);
    if (!hasExactMemory(verification, report)) {
      throw new Error(`Hindsight did not return the retained report for ${report.assetId} at ${report.timestamp}.`);
    }
    retained += 1;
  }

  console.log(`Hindsight demo history verified: ${retained} retained, ${skipped} already present.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Hindsight history bootstrap failed:', error.message);
    process.exitCode = 1;
  });
}
