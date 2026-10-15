import { Link } from 'react-router-dom';
import { KEYS } from '../lib/storage';
import { useCollection } from '../lib/hooks';
import { Counter, Reveal } from '../components/ui.jsx';

const STEPS = [
  ['01', 'Register', 'Create a donor profile with your blood group and city.'],
  ['02', 'Get matched', 'Recipients and hospitals find you by group, city and availability.'],
  ['03', 'Confirm eligibility', 'Check age, weight and health guidelines before you donate.'],
  ['04', 'Donate', 'Visit a camp or blood bank and complete your donation.'],
  ['05', 'Track impact', "See your donation history and the lives you've touched."]
];
const STORIES = [
  ['RK', 'Ramesh Kumar', "Recipient's family", '"I got three donor calls within twenty minutes of posting a request for my father. That speed made all the difference."'],
  ['AS', 'Aarav Sharma', 'Regular donor', '"Sanguine reminds me exactly when I\'m eligible to donate again. I\'ve never missed a cycle since joining."'],
  ['NR', 'Neha Reddy', 'Camp organizer', '"Coordinating camps used to mean spreadsheets and phone trees. Now our sign-ups happen right on the platform."']
];

export default function Home() {
  const donors = useCollection(KEYS.DONORS);
  const requests = useCollection(KEYS.REQUESTS);
  const banks = useCollection(KEYS.BANKS);
  const camps = useCollection(KEYS.CAMPS);

  const critical = requests.filter((r) => r.urgency === 'Critical');
  const criticalGroups = [...new Set(critical.map((r) => r.bloodGroup))];

  return (
    <>
      <div className="emergency-bar">
        <div className="container">
          <span>🚨 {critical.length
            ? <><strong>{critical.length} critical request{critical.length > 1 ? 's' : ''}</strong> need {criticalGroups.join(' and ')} donors right now.</>
            : <>No critical requests right now — thank you for being ready.</>}</span>
          <Link to="/request" className="btn btn-primary btn-sm">View requests</Link>
        </div>
      </div>

      <main id="main" tabIndex={-1}>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Smart Blood Donation Network</span>
              <h1>Connecting every drop<br />to every life.</h1>
              <p className="lead">Sanguine links donors, recipients, hospitals and blood banks on a single, fast platform — so the next emergency request finds an answer in minutes.</p>
              <div className="hero-cta">
                <Link to="/signup" className="btn btn-primary">Become a Donor</Link>
                <Link to="/request" className="btn btn-ghost">Request Blood</Link>
              </div>
              <div className="hero-stats">
                <div className="stat"><b><Counter value={donors.length} /></b><span>Registered donors</span></div>
                <div className="stat"><b><Counter value={donors.reduce((s, d) => s + (d.donationsCount || 0), 0)} /></b><span>Donations logged</span></div>
                <div className="stat"><b><Counter value={banks.length} /></b><span>Partner blood banks</span></div>
              </div>
            </div>
            <div className="drop-scene">
              <svg viewBox="0 0 320 360" aria-hidden="true">
                <defs>
                  <linearGradient id="heroDrop" x1="60" y1="20" x2="260" y2="340" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D90429" /><stop offset="1" stopColor="#8B0015" />
                  </linearGradient>
                </defs>
                <circle cx="160" cy="190" r="140" fill="#F8F9FA" />
                <path className="floaty" d="M160 40C160 40 90 165 90 220C90 267 120 300 160 300C200 300 230 267 230 220C230 165 160 40 160 40Z" fill="url(#heroDrop)" />
                <path d="M132 220C132 238 145 252 160 252" stroke="rgba(255,255,255,0.55)" strokeWidth="8" strokeLinecap="round" fill="none" />
              </svg>
              <svg className="pulse-rule" viewBox="0 0 300 40" aria-hidden="true">
                <path className="line" d="M0 20H90L105 6L120 34L135 20H300" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header"><span className="eyebrow">Right now</span><h2>The network at a glance</h2></div>
            <div className="grid grid-4">
              {[[donors.length, 'Total donors on the platform'], [requests.length, 'Open emergency requests'],
                [banks.length, 'Partner blood banks'], [camps.length, 'Camps scheduled']].map(([n, label]) => (
                <Reveal key={label} className="card stat-card"><div className="num"><span><Counter value={n} /></span></div><p>{label}</p></Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container">
            <div className="flex justify-between items-center section-header" style={{ width: '100%', maxWidth: 'none' }}>
              <div><span className="eyebrow">Nearby</span><h2 className="mb-0">Featured blood banks</h2></div>
              <Link to="/bloodbanks" className="btn btn-ghost btn-sm">View all →</Link>
            </div>
            <div className="grid grid-3">
              {banks.slice(0, 3).map((b) => (
                <Reveal key={b.id} className="card">
                  <h3>{b.name}</h3><p className="muted">{b.address}</p>
                  <span className={`badge ${b.hours.includes('24/7') ? 'badge-success' : ''}`}>{b.hours}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header"><span className="eyebrow">How it works</span><h2>From sign-up to saving a life</h2></div>
            <div className="timeline">
              {STEPS.map(([i, t, d]) => (
                <Reveal key={i} className="timeline-step"><div className="idx">{i}</div><h3>{t}</h3><p className="muted mb-0">{d}</p></Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container">
            <div className="section-header text-center" style={{ marginInline: 'auto' }}><span className="eyebrow">Voices</span><h2>Stories from the network</h2></div>
            <div className="grid grid-3">
              {STORIES.map(([ini, name, role, quote]) => (
                <Reveal key={name} className="testimonial"><p>{quote}</p>
                  <div className="who"><div className="avatar">{ini}</div><div><strong>{name}</strong><div className="muted">{role}</div></div></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cta-band" style={{ maxWidth: 900 }}>
              <h2>Your one donation can support up to three lives.</h2>
              <p style={{ maxWidth: '50ch', marginInline: 'auto' }}>It takes ten minutes to register. It takes even less to check if someone nearby needs your blood group today.</p>
              <div className="hero-cta" style={{ justifyContent: 'center' }}><Link to="/signup" className="btn btn-primary">Join as a Donor</Link></div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
