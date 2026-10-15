import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHero, Reveal } from '../components/ui.jsx';

const CARDS = [
  ['Age', 'Donors should typically be between 18 and 65 years old. First-time donors over 60 may need medical clearance.'],
  ['Weight', 'A minimum body weight of around 45–50 kg is generally required to safely donate a standard unit.'],
  ['Health', 'You should be free of fever, infection, or flu-like symptoms, and generally feeling well on donation day.'],
  ['Medical conditions', 'Certain conditions (e.g. uncontrolled hypertension, recent major surgery, certain medications) may mean a temporary or permanent deferral — the screening nurse will confirm.'],
  ['Donation interval', 'Whole-blood donors usually wait about 56 days (8 weeks) between donations; platelet donors may donate more frequently.'],
  ['Lifestyle', 'Get a good night\'s sleep, eat a meal beforehand, and stay well hydrated before donating.']
];

export default function Eligibility() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [days, setDays] = useState('');
  const [well, setWell] = useState(true);
  const filled = age !== '' && weight !== '';
  const issues = [];
  if (filled) {
    if (age < 18 || age > 65) issues.push('Age should be between 18 and 65.');
    if (weight < 45) issues.push('Weight should be at least 45 kg.');
    if (days !== '' && days < 56) issues.push(`Wait ${56 - days} more day(s) — the usual interval is 56 days.`);
    if (!well) issues.push('You should be feeling well, with no fever or infection.');
  }

  return (
    <main id="main" tabIndex={-1}>
      <PageHero eyebrow="Eligibility" title="Can you donate blood?" lead="General guidelines below — always follow your local blood bank's medical screening on the day." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="form-card" style={{ marginBottom: '2rem' }}>
            <h3>Quick eligibility check</h3>
            <div className="form-row">
              <div className="field"><label htmlFor="ea">Age</label><input id="ea" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 28" /></div>
              <div className="field"><label htmlFor="ew">Weight (kg)</label><input id="ew" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 60" /></div>
            </div>
            <div className="form-row">
              <div className="field"><label htmlFor="ed">Days since last donation <span className="hint">(optional)</span></label>
                <input id="ed" type="number" value={days} onChange={(e) => setDays(e.target.value)} placeholder="e.g. 90" /></div>
              <div className="field field-checkbox"><div className="checkbox-row">
                <input type="checkbox" id="ewell" checked={well} onChange={(e) => setWell(e.target.checked)} />
                <label htmlFor="ewell" style={{ margin: 0 }}>I feel well today</label></div></div>
            </div>
            {filled && (issues.length ? (
              <div role="status"><span className="badge badge-urgent">Not yet</span>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', marginTop: '0.6rem' }}>{issues.map((i) => <li key={i} className="muted">{i}</li>)}</ul></div>
            ) : (
              <div role="status"><span className="badge badge-success">Looks good</span>
                <p className="muted" style={{ marginTop: '0.6rem' }}>You appear to meet the general guidelines. <Link to="/donor" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Register as a donor →</Link></p></div>
            ))}
          </div>

          <div className="grid grid-3">
            {CARDS.map(([t, d]) => <Reveal key={t} className="card"><h3>{t}</h3><p className="muted mb-0">{d}</p></Reveal>)}
          </div>
          <div className="cta-band mt-lg" style={{ maxWidth: 900 }}>
            <h2>Ready when you are</h2><p>If the above sounds like you, register in under two minutes.</p>
            <Link to="/donor" className="btn btn-primary">Register as a Donor</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
