import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { assetiqApi } from '../api/assetiqApi';

export default function AssetsPage() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    let isMounted = true;

    const loadAssets = async () => {
      setLoading(true);
      setError('');

      try {
        const assetList = await assetiqApi.getAssets();
        if (isMounted) {
          setAssets(assetList);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load assets.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAssets = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return assets;
    }

    return assets.filter((asset) => {
      const searchable = [
        asset.id,
        asset.name,
        asset.type,
        asset.location,
        asset.status,
        asset.category,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(search);
    });
  }, [assets, query]);

  if (loading) {
    return (
      <div className="state-panel">
        <div className="spinner" />
        <p>Loading assets...</p>
      </div>
    );
  }

  if (error) {
    return <div className="state-panel error-state">{error}</div>;
  }

  return (
    <>
      <header className="page-header">
        <div>
          <p className="section-kicker">Equipment directory</p>
          <h1>Assets</h1>
          <p className="page-intro">A clear view of the equipment your team keeps running.</p>
        </div>
        <label className="asset-filter">
          <span className="visually-hidden">Filter asset list</span>
          <span className="search-mark" aria-hidden="true" />
          <input
            type="search"
            placeholder="Filter this list"
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setSearchParams(value ? { q: value } : {}, { replace: true });
            }}
          />
          <span className="asset-count">{filteredAssets.length} shown</span>
        </label>
      </header>

      {filteredAssets.length === 0 ? (
        <div className="empty-panel">No assets match your search.</div>
      ) : (
        <section className="asset-grid">
          {filteredAssets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              className="asset-card asset-card-interactive"
              onClick={() => navigate(`/assets/${asset.id}`)}
            >
              <div className="asset-card-top">
                <span className="asset-id">{asset.id}</span>
                <span className={`status-badge ${asset.status?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}>
                  {asset.status}
                </span>
              </div>
              <div className="asset-card-title">
                <h2>{asset.name}</h2>
                <p>{asset.type || asset.category}</p>
              </div>
              <div className="asset-card-details">
                <div><span>Location</span><strong>{asset.location || 'Not recorded'}</strong></div>
                <div><span>Last service</span><strong>{asset.lastService || 'Not recorded'}</strong></div>
              </div>
              <div className="asset-card-footer">
                <span className={`issue-indicator ${asset.recurringIssue && asset.recurringIssue !== 'None' ? 'has-issue' : ''}`}>
                  <span aria-hidden="true" />
                  {asset.recurringIssue && asset.recurringIssue !== 'None' ? asset.recurringIssue : 'No recurring issue'}
                </span>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </div>
            </button>
          ))}
        </section>
      )}
    </>
  );
}
