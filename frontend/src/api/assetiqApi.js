const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    const error = new Error('Missing VITE_API_BASE_URL. Set it to the running Express backend URL, for example http://localhost:3001.');
    error.status = 'MISSING_API_BASE_URL';
    throw error;
  }

  const method = options.method || 'GET';
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const responseText = await response.text();
      let payload = null;
      try {
        payload = JSON.parse(responseText);
      } catch {
        payload = null;
      }

      const message = payload?.message || payload?.error || responseText || `Request failed with status ${response.status}`;
      const error = new Error(
        response.status === 404
          ? `Missing backend endpoint: ${method} ${path}. The Express route is not implemented yet.`
          : response.status === 400
            ? `Bad request: ${message}`
            : response.status >= 500
              ? `Server error: ${message}`
              : message,
      );
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) return null;

    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('application/json') ? response.json() : response.text();
  } catch (error) {
    if (error instanceof TypeError) {
      const networkError = new Error(`Network error while reaching ${method} ${path}. Verify the Express backend is running and VITE_API_BASE_URL is correct.`);
      networkError.status = 'NETWORK_ERROR';
      throw networkError;
    }

    throw error;
  }
}

function normalizeAsset(asset) {
  if (!asset || typeof asset !== 'object') return asset;
  return {
    ...asset,
    id: asset.id || asset.assetId,
    assetId: asset.assetId || asset.id,
    category: asset.category || asset.type,
  };
}

function normalizeBrief(brief, assetId) {
  const fields = {
    PreviousIssues: ['PreviousIssues', 'previousIssues', 'previous_issues'],
    RecurringPatterns: ['RecurringPatterns', 'recurringPatterns', 'recurring_patterns'],
    PreviousRepairs: ['PreviousRepairs', 'previousRepairs', 'previous_repairs'],
    Outcomes: ['Outcomes', 'outcomes'],
    TechnicianObservations: ['TechnicianObservations', 'technicianObservations', 'technician_observations'],
    AttentionPoints: ['AttentionPoints', 'attentionPoints', 'attention_points'],
  };

  const normalized = { ...brief, assetId: brief.assetId || assetId };

  for (const [field, aliases] of Object.entries(fields)) {
    const value = aliases.map((key) => brief[key]).find((item) => item !== undefined && item !== null);
    normalized[field] = Array.isArray(value) ? value : value ? [value] : [];
  }

  return normalized;
}

export const assetiqApi = {
  async getAssets() {
    const data = await request('/api/assets');
    const assets = Array.isArray(data) ? data : data?.assets;

    if (!Array.isArray(assets)) {
      throw new Error('The backend response for GET /api/assets was not a valid asset list.');
    }

    return assets.map(normalizeAsset);
  },

  async getAsset(assetId) {
    const data = await request(`/api/assets/${encodeURIComponent(assetId)}`);
    return normalizeAsset(data?.asset || data);
  },

  async getAssetBrief(assetId) {
    const data = await request(`/api/assets/${encodeURIComponent(assetId)}/brief`);
    return normalizeBrief(data?.brief || data, assetId);
  },

  async createMaintenanceReport(report) {
    const payload = {
      assetId: report.assetId,
      symptom: report.symptom,
      diagnosis: report.diagnosis,
      action: report.action,
      partsUsed: report.partsUsed,
      outcome: report.outcome,
      technicianNotes: report.technicianNotes,
    };

    const data = await request('/api/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return data?.report || data || payload;
  },

  async getDashboardSummary() {
    const assets = await this.getAssets();
    const attentionAssets = assets.filter((asset) => asset.status === 'Needs Attention');
    const recurringFaults = assets.filter((asset) => asset.recurringIssue && asset.recurringIssue !== 'None');

    return {
      totalAssets: assets.length,
      needsAttention: attentionAssets.length,
      recurringFaults: recurringFaults.length,
      reportsThisWeek: null,
      attentionAssets,
      recentActivity: assets.slice(0, 5).map((asset) => ({
        id: asset.id,
        title: asset.id,
        detail: [asset.name, asset.location].filter(Boolean).join(' · '),
        status: asset.status,
        lastService: asset.lastService,
      })),
    };
  },

  getAssetById(assetId) {
    return this.getAsset(assetId);
  },

  getMaintenanceBrief(assetId) {
    return this.getAssetBrief(assetId);
  },

  submitServiceReport(report) {
    return this.createMaintenanceReport(report);
  },
};
