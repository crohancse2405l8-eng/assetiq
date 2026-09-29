const { HindsightService } = require("../hindsight/hindsightService");
const { GroqService } = require("../groq/groqService");

class MaintenanceBriefService {
  constructor(options = {}) {
    this.hindsightService = options.hindsightService || new HindsightService();
    this.groqService = options.groqService || new GroqService();
  }

  buildEvidenceFromRecall(assetId, recallResult) {
    if (!assetId || typeof assetId !== "string") {
      throw new Error("assetId is required to generate a maintenance brief.");
    }

    const results = Array.isArray(recallResult?.results)
      ? recallResult.results
      : Array.isArray(recallResult)
        ? recallResult
        : [];

    if (!results.length) {
      return [
        `No relevant historical memory found for asset ${assetId}. Historical evidence is insufficient.`
      ];
    }

    return results
      .map((item) => {
        const text = typeof item?.text === "string" ? item.text.trim() : "";
        if (!text) {
          return null;
        }

        return {
          memory: text,
          type: item?.type || "historical-memory",
          metadata: item?.metadata || {},
          context: item?.context || null,
          occurredAt: item?.occurred_start || item?.mentioned_at || null
        };
      })
      .filter(Boolean);
  }

  async generateAssetBrief(assetId, query) {
    if (!assetId || typeof assetId !== "string") {
      throw new Error("assetId is required.");
    }

    const recallQuery = query || `What previous problems and repairs are associated with ${assetId}?`;
    const recallResult = await this.hindsightService.recallAssetMemory(assetId, recallQuery);
    const evidence = this.buildEvidenceFromRecall(assetId, recallResult);

    const groqInput = {
      assetId,
      evidence: evidence.map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return `${item.type || "historical-memory"}: ${item.memory}`;
      })
    };

    const brief = await this.groqService.generateMaintenanceBrief(groqInput);

    return {
      assetId,
      query: recallQuery,
      evidence,
      brief
    };
  }
}

module.exports = {
  MaintenanceBriefService
};
