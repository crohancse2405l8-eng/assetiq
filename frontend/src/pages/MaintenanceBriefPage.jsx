import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { assetiqApi } from '../api/assetiqApi';

const sectionLabels = [
  'Previous Issues',
  'Recurring Patterns',
  'Previous Repairs',
  'Outcomes',
  'Technician Observations',
  'Attention Points',
];

export default function MaintenanceBriefPage() {
  const { assetId } = useParams();
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadBrief = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await assetiqApi.getAssetBrief(assetId);
        if (isMounted) {
          setBrief(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load maintenance brief.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (assetId) {
      loadBrief();
    }

    return () => {
      isMounted = false;
    };
  }, [assetId, refreshKey]);

  if (loading) {
    return (
      <div className="state-panel">
        <div className="spinner" />
        <p>Building equipment brief...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-panel error-state brief-error">
        <p>{error}</p>
        <button className="action-button secondary brief-refresh" type="button" onClick={() => setRefreshKey((key) => key + 1)}>
          Retry
        </button>
      </div>
    );
  }

  if (!brief) {
    return <div className="state-panel empty-state">No maintenance history available for {assetId}.</div>;
  }

  const sections = sectionLabels.map((label) => ({
    label,
    key: label.replace(/\s+/g, ''),
    items: brief[label] || brief[label.replace(/\s+/g, '')] || brief[label.toLowerCase().replace(/\s+/g, '')] || [],
  }));

  return (
    <div className="brief-page">
      <header className="brief-hero">
        <div className="brief-hero-top">
          <p className="section-kicker">Equipment intelligence / {brief.assetId || assetId}</p>
          <div className="brief-header-actions">
            <button className="text-button" type="button" onClick={() => setRefreshKey((key) => key + 1)}>
              <span aria-hidden="true">↻</span> Refresh brief
            </button>
            <Link to={`/assets/${assetId}`} className="text-link">Asset detail <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div className="brief-title-row">
          <div>
            <span className="brief-title-mark">AI</span>
            <h1>AI Maintenance Brief</h1>
          </div>
          <p className="brief-asset-id">{brief.assetId || assetId}</p>
        </div>
      </header>

      {brief.summary && <p className="brief-summary">{brief.summary}</p>}

      <article className="brief-content">
        {sections.some((section) => section.items.length > 0) ? (
          <div className="brief-section-grid">
            {sections.map((section) => (
              <section className={`brief-section ${section.key === 'RecurringPatterns' ? 'brief-section-featured' : ''}`} key={section.label}>
                <span className="brief-section-index">{String(sectionLabels.indexOf(section.label) + 1).padStart(2, '0')}</span>
                <h3>{section.label}</h3>
                {section.items.length ? (
                  <ul>
                    {section.items.map((item, index) => (
                      <li key={`${String(item)}-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-copy">No data available.</p>
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="empty-panel">No maintenance brief details are available for this asset yet.</div>
        )}
      </article>
    </div>
  );
}
