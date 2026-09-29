import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', short: '01' },
  { to: '/assets', label: 'Assets', short: '02' },
  { to: '/assets/HVAC-204/report', label: 'Reports', short: '03' },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    navigate(`/assets${params.size ? `?${params}` : ''}`);
    setMobileNavOpen(false);
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className={`sidebar ${mobileNavOpen ? 'is-open' : ''}`}>
        <div className="sidebar-label">Workspace</div>
        <nav id="main-navigation" className="nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileNavOpen(false)}
            >
              <span className="nav-index">{item.short}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="connection-indicator" />
          <span>Field operations</span>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-leading">
            <button
              className="menu-toggle"
              type="button"
              aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileNavOpen}
              aria-controls="main-navigation"
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
            <Link className="topbar-brand" to="/">
              <span className="brand-mark" aria-hidden="true">IQ</span>
              <span>Asset<span className="brand-light">IQ</span></span>
            </Link>
          </div>

          <form className="global-search" role="search" onSubmit={handleSearch}>
            <label className="visually-hidden" htmlFor="global-asset-search">Search assets</label>
            <span className="search-mark" aria-hidden="true" />
            <input
              id="global-asset-search"
              type="search"
              placeholder="Search assets, locations..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="profile-summary" aria-label="Signed in as Technician">
            <span className="profile-avatar" aria-hidden="true">T</span>
            <span className="profile-copy"><strong>Technician</strong><small>Field team</small></span>
          </div>
        </header>

        <main id="main-content" className="content-area" tabIndex="-1">{children}</main>
      </div>
    </div>
  );
}
