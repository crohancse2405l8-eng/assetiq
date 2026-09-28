import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assetiqApi } from '../api/assetiqApi';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const assets = await assetiqApi.getAssets();
        const attentionAssets = assets.filter((asset) => asset.status === 'Needs Attention');
        const recurringFaults = assets.filter((asset) => asset.recurringIssue && asset.recurringIssue !== 'None');
        const summary = {
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

        if (isMounted) setDashboard(summary);
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Unable to load the dashboard.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="state-panel">
        <div className="spinner" />
        <p>Gathering equipment status...</p>
      </div>
    );
  }

  if (error) return <div className="state-panel error-state">{error}</div>;
  if (!dashboard) return <div className="empty-panel">No dashboard data available.</div>;

  const stats = [
    { label: 'Assets monitored', value: dashboard.totalAssets, note: 'Across your facilities', tone: 'neutral' },
    { label: 'Needs attention', value: dashboard.needsAttention, note: 'Priority follow-up', tone: 'warning' },
    { label: 'Recurring faults', value: dashboard.recurringFaults, note: 'Patterns identified', tone: 'accent' },
    {
      label: 'Reports this week',
      value: dashboard.reportsThisWeek ?? '—',
      note: dashboard.reportsThisWeek == null ? 'Not available from current API' : 'Filed by your team',
      tone: 'neutral',
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="welcome-header">
        <div>
          <p className="section-kicker">AssetIQ / Operations overview</p>
          <h1>Good morning, <span>Technician</span></h1>
          <p className="welcome-copy">Your equipment memory, current priorities, and recent field work in one place.</p>
        </div>
        <Link to="/assets" className="text-link welcome-link">Browse all assets <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="stats-grid" aria-label="Operational summary">
        {stats.map((stat, index) => (
          <article className={`stat-card stat-${stat.tone}`} key={stat.label}>
            <div className="stat-topline"><span>{stat.label}</span><span className="stat-index">0{index + 1}</span></div>
            <strong>{stat.value}</strong>
            <small>{stat.note}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Priority queue</p>
            <h2>Assets requiring attention</h2>
          </div>
          <Link to="/assets" className="text-link">View inventory <span aria-hidden="true">↗</span></Link>
        </div>

        {dashboard.attentionAssets.length ? (
          <div className="attention-grid">
            {dashboard.attentionAssets.map((asset) => (
              <button className="attention-card" type="button" key={asset.id} onClick={() => navigate(`/assets/${asset.id}`)}>
                <div className="attention-card-top">
                  <span className="asset-id">{asset.id}</span>
                  <span className="status-badge needs-attention">Needs attention</span>
                </div>
                <h3>{asset.name}</h3>
                <p>{[asset.type || asset.category, asset.location].filter(Boolean).join(' · ')}</p>
                <div className="attention-card-foot">
                  <span>{asset.recurringIssue || 'Review required'}</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-panel">No assets currently require attention.</div>
        )}
      </section>

      <section className="dashboard-section recent-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Field log</p>
            <h2>Recent maintenance</h2>
          </div>
          <span className="section-aside">Latest asset activity</span>
        </div>

        <div className="maintenance-timeline">
          {dashboard.recentActivity.length ? dashboard.recentActivity.map((item, index) => (
            <button className="timeline-row" type="button" key={item.id} onClick={() => navigate(`/assets/${item.id}`)}>
              <span className="timeline-marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="timeline-main">
                <strong>{item.title}</strong>
                <small>{item.detail || 'Equipment record'}</small>
              </span>
              <span className="timeline-date">{item.lastService || 'View record'}</span>
              <span className={`status-text ${item.status === 'Needs Attention' ? 'status-text-warning' : ''}`}>{item.status}</span>
              <span className="timeline-arrow" aria-hidden="true">↗</span>
            </button>
          )) : (
            <div className="empty-panel">No recent maintenance activity is available.</div>
          )}
        </div>
      </section>
    </div>
  );
}
