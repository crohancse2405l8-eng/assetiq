const path = require("path");
const dotenv = require("dotenv");
const { GroqService } = require("../services/groq/groqService");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  const hasKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim());

  if (!hasKey) {
    console.log("API KEY MISSING");
    process.exit(0);
  }

  console.log("API KEY FOUND");

  const service = new GroqService();

  const brief = await service.generateMaintenanceBrief({
    assetId: "HVAC-TEST-001",
    evidence: [
      "Previous issue: low refrigerant.",
      "Previous repair: refrigerant recharge.",
      "Outcome: cooling restored temporarily.",
      "Previous issue: refrigerant leak near coil joint.",
      "Previous repair: seal applied.",
      "Outcome: unit operating normally after repair."
    ]
  });

  console.log(JSON.stringify(brief, null, 2));
}

main().catch((error) => {
  console.error("Groq verification failed:", error && error.message ? error.message : error);
  process.exit(1);
});
