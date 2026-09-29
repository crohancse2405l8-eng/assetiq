import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { assetiqApi } from '../api/assetiqApi';

export default function AssetDetailPage() {
  const { assetId } = useParams();
  const location = useLocation();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reportSubmitted = Boolean(location.state?.reportSubmitted);

  useEffect(() => {
    let isMounted = true;

    const loadAsset = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await assetiqApi.getAsset(assetId);
        if (isMounted) {
          setAsset(result);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load asset details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (assetId) {
      loadAsset();
    }

    return () => {
      isMounted = false;
    };
  }, [assetId]);

  if (loading) {
    return (
      <div className="state-panel">
        <div className="spinner" />
        <p>Loading equipment record...</p>
      </div>
    );
  }

  if (error) {
    return <div className="state-panel error-state">{error}</div>;
  }

  if (!asset) {
    return <div className="state-panel empty-state">Asset not found for {assetId}.</div>;
  }

  return (
    <div className="detail-page">
      {reportSubmitted && (
        <div className="report-success" role="status">
          <span className="success-mark" aria-hidden="true">✓</span>
          <div>
            <p className="section-kicker">Record saved</p>
            <h2>Service report submitted</h2>
            <p>The report for {assetId} was saved successfully. You can review the updated brief below.</p>
          </div>
        </div>
      )}

      <header className="detail-hero">
        <div className="detail-hero-copy">
          <p className="section-kicker">Equipment record / {asset.category || asset.type}</p>
          <h1>{asset.id}</h1>
          <p className="detail-asset-name">{asset.name}</p>
          <div className="detail-meta">
            <span>{asset.category || asset.type || 'Equipment'}</span>
            <span>{asset.location || 'Location not recorded'}</span>
            <span className={`status-badge ${asset.status?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}>
              {asset.status || 'Status unavailable'}
            </span>
          </div>
        </div>
        <div className="detail-hero-actions">
          <Link to={`/assets/${asset.id}/brief`} className="action-button">View Maintenance Brief</Link>
          <Link to={`/assets/${asset.id}/report`} className="action-button secondary">New Service Report</Link>
        </div>
      </header>

      <section className="overview-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">At a glance</p>
            <h2>Maintenance overview</h2>
          </div>
          <span className="section-aside">Last service · {asset.lastService || 'Not recorded'}</span>
        </div>

        <div className="overview-grid">
          <article className="overview-card issue-card">
            <span className="card-eyebrow">Previous issues</span>
            <h3>{asset.recurringIssue && asset.recurringIssue !== 'None' ? asset.recurringIssue : 'No recurring issue recorded'}</h3>
            <p>{asset.previousIssues?.length ? asset.previousIssues.join(' ') : 'Review service history for reported symptoms and prior diagnostics.'}</p>
            <Link to={`/assets/${asset.id}/brief`} className="text-link">Open equipment memory <span aria-hidden="true">↗</span></Link>
          </article>

          <article className="overview-card history-card">
            <div className="card-heading-row">
              <div>
                <span className="card-eyebrow">Service history</span>
                <h3>Recent work</h3>
              </div>
              <span className="history-count">{asset.recentMaintenance?.length || 0} entries</span>
            </div>
            {asset.recentMaintenance?.length ? (
              <ol className="service-history-list">
                {asset.recentMaintenance.map((entry, index) => (
                  <li key={`${entry}-${index}`}><span className="history-marker" />{entry}</li>
                ))}
              </ol>
            ) : (
              <p className="empty-copy">No maintenance history is available for this asset.</p>
            )}
          </article>

          <aside className="current-status-card">
            <span className="card-eyebrow">Current status</span>
            <strong>{asset.status || 'Not recorded'}</strong>
            <div className="status-divider" />
            <div className="status-detail"><span>Priority</span><span>{asset.priority || 'Not set'}</span></div>
            <div className="status-detail"><span>Category</span><span>{asset.category || asset.type || 'Not set'}</span></div>
            <div className="status-detail"><span>Location</span><span>{asset.location || 'Not recorded'}</span></div>
          </aside>
        </div>
      </section>
    </div>
  );
}
