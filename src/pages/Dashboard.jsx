import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KEYS, remove, resetDemoData, update } from '../lib/storage';
import { useCollection } from '../lib/hooks';
import { useApp } from '../context.jsx';
import { Counter, Empty, GROUPS, PageHero, fmtDate } from '../components/ui.jsx';

export default function Dashboard() {
  const { user, logout, toast } = useApp();
  const nav = useNavigate();
  const donors = useCollection(KEYS.DONORS);
  const requests = useCollection(KEYS.REQUESTS);
  const banks = useCollection(KEYS.BANKS);
  const camps = useCollection(KEYS.CAMPS);
  const me = user?.donorId ? donors.find((d) => d.id === user.donorId) : null;

  const [grown, setGrown] = useState(false);
  useEffect(() => { const r = requestAnimationFrame(() => setGrown(true)); return () => cancelAnimationFrame(r); }, []);

  const counts = GROUPS.map((g) => donors.filter((d) => d.bloodGroup === g).length);
  const max = Math.max(...counts, 1);
  const units = donors.filter((d) => d.available).length + 120;
  const first = (user?.name || '').split(' ')[0];

  const doLogout = () => { logout(); toast('Logged out.'); nav('/'); };
  const reset = () => {
    if (window.confirm('Reset all demo data (donors, requests, camps, accounts) to defaults?')) {
      resetDemoData(); toast('Demo data reset.', 'info');
    }
  };

  return (
    <main id="main" tabIndex={-1}>
      <PageHero eyebrow="Impact Dashboard" title="Network overview">
        <div className="dash-toolbar" style={{ marginTop: '0.5rem' }}>
          <span />
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={reset}>Reset demo data</button>
            {user && <button className="btn btn-ghost btn-sm" onClick={doLogout}>Log out</button>}
          </div>
        </div>
      </PageHero>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card mb-lg">
            <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              {!user ? (
                <>
                  <div><h3 className="mb-0">Welcome to Sanguine</h3><p className="muted mb-0">Log in or create an account to see your personal donor snapshot here.</p></div>
                  <Link to="/login" className="btn btn-primary btn-sm">Log In</Link>
                </>
              ) : !me ? (
                <>
                  <div><h3 className="mb-0">Hi, {first} 👋</h3><p className="muted mb-0">You don't have a donor profile yet — complete it to appear in donor search results.</p></div>
                  <Link to="/donor" className="btn btn-primary btn-sm">Complete Donor Profile</Link>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="mb-0">Welcome back, {me.name.split(' ')[0]} 👋</h3>
                    <div className="status-row" style={{ marginTop: '0.5rem' }}>
                      <span className="badge">{me.bloodGroup}</span><span className="muted">📍 {me.city}</span>
                      <span className={`badge ${me.available ? 'badge-success' : ''}`}>{me.available ? 'Available to donate' : 'Currently unavailable'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm" style={{ flexWrap: 'wrap' }}>
                    <span className="muted">{me.donationsCount || 0} donation(s)</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      update(KEYS.DONORS, me.id, { available: !me.available });
                      toast(me.available ? "You're now marked unavailable." : "You're now visible as available.", 'info');
                    }}>{me.available ? 'Mark unavailable' : 'Mark available'}</button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card mb-lg">
            <h3>Quick actions</h3>
            <div className="quick-actions">
              <Link to="/donors" className="btn btn-ghost btn-sm">🔍 Find a Donor</Link>
              <Link to="/request" className="btn btn-ghost btn-sm">🚨 Post a Request</Link>
              <Link to="/camps" className="btn btn-ghost btn-sm">📅 Register for a Camp</Link>
              <Link to="/donor" className="btn btn-primary btn-sm">🩸 Update My Profile</Link>
            </div>
          </div>

          <div className="dash-grid">
            {[[donors.length, 'Total donors'], [requests.length, 'Blood requests'], [banks.length, 'Blood banks'], [camps.length, 'Upcoming camps']].map(([n, l]) => (
              <div key={l} className="card stat-card"><div className="num"><span><Counter value={n} /></span></div><p className="mb-0">{l}</p></div>
            ))}
          </div>

          <div className="grid grid-2 mt-lg">
            <div className="card chart-card">
              <h3>Donors by blood group</h3>
              <div className="bar-chart">
                {counts.map((c, i) => <div key={GROUPS[i]} className="bar" style={{ height: grown ? `${(c / max) * 100}%` : 0 }}><span>{c}</span></div>)}
              </div>
              <div className="bar-labels">{GROUPS.map((g) => <span key={g}>{g}</span>)}</div>
            </div>
            <div className="card chart-card">
              <h3>Blood units available</h3>
              <div className="donut-wrap" style={{ width: 180, height: 180, marginInline: 'auto' }}>
                <svg width="180" height="180" viewBox="0 0 36 36">
                  <defs><linearGradient id="dashGrad"><stop offset="0%" stopColor="#D90429" /><stop offset="100%" stopColor="#8B0015" /></linearGradient></defs>
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-line)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="url(#dashGrad)" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${Math.min(97, (units / 200) * 97)},100`} transform="rotate(-90 18 18)" style={{ transition: 'stroke-dasharray 900ms ease' }} />
                </svg>
                <div className="center-label"><b><Counter value={units} /></b><span className="muted">units</span></div>
              </div>
              <p className="muted text-center" style={{ marginTop: '0.6rem' }}>Target: 200 units</p>
            </div>
          </div>

          <div className="grid grid-2 mt-lg">
            <div className="card">
              <h3>Recent requests</h3>
              {!requests.length ? <Empty title="No requests yet">Emergency blood requests will show up here as they're posted.</Empty> : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="dash-table">
                    <thead><tr><th>Patient</th><th>Group</th><th>Hospital</th><th>Urgency</th><th></th></tr></thead>
                    <tbody>
                      {requests.slice(0, 6).map((r) => (
                        <tr key={r.id}><td>{r.patient}</td><td>{r.bloodGroup}</td><td>{r.hospital}</td>
                          <td><span className={`badge ${r.urgency === 'Critical' ? 'badge-urgent' : ''}`}>{r.urgency}</span></td>
                          <td><button className="btn btn-ghost btn-sm" aria-label={`Remove request for ${r.patient}`}
                            onClick={() => { remove(KEYS.REQUESTS, r.id); toast('Request removed.', 'info'); }}>✕</button></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="card">
              <h3>Upcoming camps</h3>
              {!camps.length ? <Empty title="No camps scheduled">Check back soon for upcoming donation drives.</Empty> : (
                <div className="grid" style={{ gap: '0.8rem' }}>
                  {camps.map((c) => (
                    <div key={c.id} className="card">
                      <span className="badge">{fmtDate(c.date, { day: 'numeric', month: 'short' })}</span>
                      <h3 style={{ marginTop: '0.6rem' }}>{c.title}</h3>
                      <p className="muted mb-0">{c.venue}</p>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.round((c.registered / c.seats) * 100)}%` }} /></div>
                      <p className="muted" style={{ marginTop: '0.4rem' }}>{c.registered}/{c.seats} seats filled</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
