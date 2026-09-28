const path = require("path");
const dotenv = require("dotenv");
const { MaintenanceBriefService } = require("../services/ai/maintenanceBriefService");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  const hasHindsightKey = Boolean(process.env.HINDSIGHT_API_KEY && process.env.HINDSIGHT_API_KEY.trim());
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim());

  if (!hasHindsightKey || !hasGroqKey) {
    console.log(hasHindsightKey ? "HINDSIGHT API KEY FOUND" : "HINDSIGHT API KEY MISSING");
    console.log(hasGroqKey ? "GROQ API KEY FOUND" : "GROQ API KEY MISSING");
    process.exit(0);
  }

  const service = new MaintenanceBriefService();
  const result = await service.generateAssetBrief("HVAC-204");

  const brief = result?.brief || {};
  const requiredKeys = [
    "previousIssues",
    "recurringPatterns",
    "previousRepairs",
    "outcomes",
    "technicianObservations",
    "attentionPoints"
  ];

  const missing = requiredKeys.filter((key) => !(key in brief));
  if (missing.length) {
    throw new Error(`Missing required brief fields: ${missing.join(", ")}`);
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("Maintenance brief verification failed:", error && error.message ? error.message : error);
  process.exit(1);
});
