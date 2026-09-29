const path = require("path");
const { Groq } = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const DEFAULT_MODEL = "openai/gpt-oss-20b";

function normalizeBriefValue(value, fallback = []) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === undefined || value === null) {
    return fallback;
  }

  return [value];
}

function normalizeMaintenanceBrief(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Groq returned invalid maintenance brief data.");
  }

  return {
    previousIssues: normalizeBriefValue(raw.previousIssues),
    recurringPatterns: normalizeBriefValue(raw.recurringPatterns),
    previousRepairs: normalizeBriefValue(raw.previousRepairs),
    outcomes: normalizeBriefValue(raw.outcomes),
    technicianObservations: normalizeBriefValue(raw.technicianObservations),
    attentionPoints: normalizeBriefValue(raw.attentionPoints)
  };
}

class GroqService {
  constructor(options = {}) {
    const apiKey = options.apiKey || process.env.GROQ_API_KEY;
    this.model = options.model || DEFAULT_MODEL;

    if (!apiKey) {
      throw new Error("Missing GROQ_API_KEY configuration.");
    }

    this.client = options.client || new Groq({ apiKey });
  }

  async generateMaintenanceBrief(input) {
    if (!input || typeof input !== "object") {
      throw new Error("Maintenance brief input is required.");
    }

    const assetId = input.assetId || "unknown";
    const evidence = Array.isArray(input.evidence) ? input.evidence : [];

    if (!evidence.length) {
      throw new Error("Maintenance brief evidence is required.");
    }

    const systemPrompt = [
      "You are generating a technician-facing maintenance brief from supplied evidence only.",
      "Use only the historical evidence provided in the request.",
      "Do not invent repairs, symptoms, outcomes, parts, observations, or recurring patterns.",
      "Distinguish historical evidence from current information.",
      "If evidence is insufficient, explicitly say there is insufficient historical evidence.",
      "Return valid JSON with these fields: previousIssues, recurringPatterns, previousRepairs, outcomes, technicianObservations, attentionPoints."
    ].join(" ");

    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "maintenance_brief",
          strict: true,
          schema: {
            type: "object",
            properties: {
              previousIssues: { type: "array", items: { type: "string" } },
              recurringPatterns: { type: "array", items: { type: "string" } },
              previousRepairs: { type: "array", items: { type: "string" } },
              outcomes: { type: "array", items: { type: "string" } },
              technicianObservations: { type: "array", items: { type: "string" } },
              attentionPoints: { type: "array", items: { type: "string" } }
            },
            required: [
              "previousIssues",
              "recurringPatterns",
              "previousRepairs",
              "outcomes",
              "technicianObservations",
              "attentionPoints"
            ],
            additionalProperties: false
          }
        }
      },
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: JSON.stringify({
            assetId,
            evidence,
            requirements: {
              previousIssues: "List prior issues supported by the supplied evidence.",
              recurringPatterns: "Only include recurring patterns clearly supported by evidence.",
              previousRepairs: "List prior repairs supported by the supplied evidence.",
              outcomes: "List observed or stated outcomes from past events.",
              technicianObservations: "List any technician observations from the supplied evidence.",
              attentionPoints: "List important follow-up attention points supported by the evidence."
            }
          })
        }
      ]
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Groq returned no maintenance brief content.");
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      throw new Error("Groq returned a non-JSON maintenance brief.");
    }

    return normalizeMaintenanceBrief(parsed);
  }
}

module.exports = {
  GroqService,
  DEFAULT_MODEL,
  normalizeMaintenanceBrief
};
