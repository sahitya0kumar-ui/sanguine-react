import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context.jsx';

const NAV = [
  ['/', 'Home', true], ['/about', 'About'], ['/donors', 'Find Donor'], ['/request', 'Request Blood'],
  ['/bloodbanks', 'Blood Banks'], ['/camps', 'Camps'], ['/compatibility', 'Compatibility'], ['/dashboard', 'Dashboard']
];
const MORE = [['/eligibility', 'Eligibility'], ['/faq', 'FAQ'], ['/gallery', 'Gallery'], ['/contact', 'Contact']];

export function DropMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dropGrad" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D90429" /><stop offset="1" stopColor="#8B0015" />
        </linearGradient>
      </defs>
      <path d="M12 2C12 2 5 11.5 5 15.5C5 19.64 8.13 22 12 22C15.87 22 19 19.64 19 15.5C19 11.5 12 2 12 2Z" fill="url(#dropGrad)" />
    </svg>
  );
}

export function LoadingScreen({ hide }) {
  return (
    <div id="loading-screen" className={hide ? 'hide' : ''} aria-hidden="true">
      <svg className="loader-mark" viewBox="0 0 24 24" fill="none">
        <path className="drop-fill" d="M12 2C12 2 5 11.5 5 15.5C5 19.64 8.13 22 12 22C15.87 22 19 19.64 19 15.5C19 11.5 12 2 12 2Z" fill="#D90429" />
      </svg>
    </div>
  );
}

export function Header() {
  const { user, dark, toggleDark } = useApp();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const link = ([to, label, end]) => <NavLink key={to} to={to} end={end}>{label}</NavLink>;

  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to main content
      </a>
      <header className="site-header">
        <div className="nav container">
          <Link to="/" className="brand"><DropMark /> Sanguine</Link>
          <nav className="nav-links" aria-label="Primary">{NAV.map(link)}</nav>
          <div className="nav-actions">
            <button className="btn-ghost btn btn-sm" onClick={toggleDark} aria-label="Toggle dark mode" title="Toggle dark mode">
              {dark ? '☀️' : '🌙'}
            </button>
            <span className="nav-auth-desktop">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-sm">My Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost btn btn-sm">Log in</Link>
                  <Link to="/signup" className="btn btn-primary btn-sm">Donate Now</Link>
                </>
              )}
            </span>
            <Link to={user ? '/dashboard' : '/login'} className="btn btn-primary btn-sm nav-login-mobile">
              {user ? 'Dashboard' : 'Login'}
            </Link>
            <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open} aria-controls="mobileNav">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
        <div className={`mobile-nav${open ? ' open' : ''}`} id="mobileNav">
          <div className="container">
            <nav className="mobile-nav-links" aria-label="Mobile primary navigation">{NAV.map(link)}</nav>
            <div className="mobile-nav-more">
              {MORE.map(link)}
              {!user && <NavLink to="/signup">Donate Now</NavLink>}
            </div>
            <p className="mobile-nav-copy">&copy; {new Date().getFullYear()} Sanguine</p>
          </div>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand" style={{ color: '#fff', marginBottom: '0.8rem' }}><DropMark /> Sanguine</Link>
            <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '32ch' }}>
              Connecting every drop to every life. A donor network built to make emergency blood requests find an answer in minutes, not days.
            </p>
          </div>
          <div><h4>Platform</h4>
            <Link to="/donors">Find a Donor</Link><Link to="/request">Request Blood</Link>
            <Link to="/bloodbanks">Blood Banks</Link><Link to="/camps">Donation Camps</Link></div>
          <div><h4>Learn</h4>
            <Link to="/compatibility">Compatibility</Link><Link to="/eligibility">Eligibility</Link>
            <Link to="/faq">FAQ</Link><Link to="/gallery">Gallery</Link></div>
          <div><h4>Company</h4>
            <Link to="/about">About Us</Link><Link to="/contact">Contact</Link><Link to="/dashboard">Impact Dashboard</Link></div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Sanguine. Built for Front-End Engineering-II.</span>
          <span>Made with care — every donor matters.</span>
        </div>
      </div>
    </footer>
  );
}

export function Toaster() {
  const { toasts } = useApp();
  return (
    <div id="toast-root" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}
          style={t.leaving ? { opacity: 0, transform: 'translateY(8px)' } : undefined}>
          <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '⚠️' : 'ℹ️'}</span><span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
