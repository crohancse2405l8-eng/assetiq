const path = require("path");
const { HindsightClient } = require("@vectorize-io/hindsight-client");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function normalizeBankId(assetId) {
  if (!assetId || typeof assetId !== "string") {
    throw new Error("assetId is required to resolve a Hindsight bank.");
  }

  const trimmed = assetId.trim();
  const normalized = trimmed
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!normalized) {
    throw new Error("assetId cannot resolve to an empty Hindsight bank identifier.");
  }

  return normalized;
}

function createHindsightClient(overrides = {}) {
  const baseUrl = overrides.baseUrl || process.env.HINDSIGHT_BASE_URL;
  const apiKey = overrides.apiKey || process.env.HINDSIGHT_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing Hindsight configuration. Set HINDSIGHT_BASE_URL and HINDSIGHT_API_KEY in your local environment or .env file."
    );
  }

  return new HindsightClient({ baseUrl, apiKey });
}

class HindsightService {
  constructor(options = {}) {
    this.client = options.client || createHindsightClient(options);
  }

  resolveBankId(assetId) {
    return normalizeBankId(assetId);
  }

  async ensureBank(bankId) {
    try {
      await this.client.createBank(bankId, {
        name: `Asset ${bankId}`,
        background: `Persistent maintenance memory for asset ${bankId}.`
      });
    } catch (error) {
      const message = error && error.message ? error.message.toLowerCase() : "";
      if (!/already exist|duplicate|exists/i.test(message)) {
        throw error;
      }
    }

    return bankId;
  }

  buildMaintenanceMemory(report) {
    if (!report || typeof report !== "object") {
      throw new Error("A maintenance report object is required.");
    }

    if (!report.assetId) {
      throw new Error("assetId is required in the maintenance report.");
    }

    const timestamp = report.timestamp || new Date().toISOString();

    return [
      `Asset: ${report.assetId}`,
      `Timestamp: ${timestamp}`,
      `Symptom: ${report.symptom || "Not provided"}`,
      `Diagnosis: ${report.diagnosis || "Not provided"}`,
      `Action: ${report.action || "Not provided"}`,
      `Parts used: ${report.partsUsed || "Not provided"}`,
      `Outcome: ${report.outcome || "Not provided"}`,
      `Technician notes: ${report.technicianNotes || "Not provided"}`,
      "Type: maintenance-event",
      "Source: service-report"
    ].join("\n");
  }

  async retainMaintenanceMemory(report) {
    const bankId = this.resolveBankId(report.assetId);
    const memoryText = this.buildMaintenanceMemory(report);

    await this.ensureBank(bankId);

    const result = await this.client.retain(bankId, memoryText, {
      timestamp: new Date(report.timestamp || Date.now()),
      context: "maintenance-event",
      metadata: {
        assetId: report.assetId,
        source: "maintenance-report"
      }
    });

    return {
      success: true,
      assetId: report.assetId,
      bankId,
      result
    };
  }

  async recallAssetMemory(assetId, query) {
    const bankId = this.resolveBankId(assetId);
    let response;

    try {
      response = await this.client.recall(bankId, query || `What previous problems and repairs are associated with ${assetId}?`, {
        budget: "mid"
      });
    } catch (error) {
      const message = error && error.message ? error.message.toLowerCase() : "";
      if (message.includes("not found") || message.includes("no memory") || message.includes("404")) {
        return {
          assetId,
          bankId,
          query: query || `What previous problems and repairs are associated with ${assetId}?`,
          results: [],
          hasMemory: false
        };
      }
      throw error;
    }

    const results = Array.isArray(response)
      ? response
      : Array.isArray(response?.results)
        ? response.results
        : Array.isArray(response?.memories)
          ? response.memories
          : [];

    return {
      assetId,
      bankId,
      query: query || `What previous problems and repairs are associated with ${assetId}?`,
      results,
      hasMemory: results.length > 0
    };
  }
}

module.exports = {
  HindsightService,
  createHindsightClient,
  normalizeBankId
};
