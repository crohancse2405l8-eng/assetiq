const { HindsightService } = require("../services/hindsight/hindsightService");

async function main() {
  const service = new HindsightService();

  const report = {
    assetId: "HVAC-204",
    symptom: "AC not cooling",
    diagnosis: "Refrigerant leak near coil joint",
    action: "Recharged refrigerant",
    partsUsed: "None",
    outcome: "Temporary fix",
    technicianNotes: "Customer said this happened before.",
    timestamp: new Date().toISOString()
  };

  const bankId = service.resolveBankId(report.assetId);
  console.log("Resolved bank:", bankId);

  const retained = await service.retainMaintenanceMemory(report);
  console.log("Retain result:", JSON.stringify(retained, null, 2));

  const recalled = await service.recallAssetMemory(
    report.assetId,
    "What previous problems and repairs are associated with HVAC-204?"
  );

  console.log("Recall result:", JSON.stringify(recalled, null, 2));

  const text = JSON.stringify(recalled.results ?? []).toLowerCase();
  const hasStoredEvent =
    text.includes("ac not cooling") ||
    text.includes("refrigerant leak near coil joint") ||
    text.includes("recharged refrigerant") ||
    text.includes("temporary fix") ||
    text.includes("customer said this happened before");

  if (!hasStoredEvent) {
    throw new Error("Hindsight recall did not contain the retained HVAC-204 maintenance event.");
  }

  console.log("Hindsight verification passed.");
}

main().catch((error) => {
  console.error("Hindsight verification failed:", error && error.message ? error.message : error);
  process.exit(1);
});
