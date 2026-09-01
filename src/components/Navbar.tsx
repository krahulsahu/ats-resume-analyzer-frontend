import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="navbar-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
            <path d="M8 19L14 9L20 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="10" y1="16" x2="18" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          ATS Analyzer
        </div>
      </Link>

      <div className="navbar-links">
        <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
          Upload
        </Link>
        <Link to="/results" className={`navbar-link ${isActive('/results') ? 'active' : ''}`}>
          Report
        </Link>
        <Link to="/studio" className={`navbar-link ${isActive('/studio') || isActive('/optimize') ? 'active' : ''}`}>
          ⚡ Resume Studio
        </Link>
        <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
