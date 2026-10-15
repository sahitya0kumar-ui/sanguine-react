import { Link } from 'react-router-dom';
import { PageHero, Reveal } from '../components/ui.jsx';

export default function About() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero eyebrow="About Sanguine" title="Built so no request for blood goes unanswered."
        lead="Sanguine began as a front-end engineering project with one goal: shorten the distance between someone who can give blood and someone who urgently needs it." />
      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: 'center' }}>
          <Reveal>
            <h2>Our mission</h2>
            <p>Blood cannot be manufactured — it can only come from another person, at the right time, in the right place. We built Sanguine to make that match happen faster: a single portal where donors, recipients, hospitals, and blood banks share real-time information.</p>
            <p>Every feature, from availability toggles to emergency request feeds, exists to remove friction between "someone needs blood" and "someone gives it."</p>
          </Reveal>
          <Reveal className="card">
            <h3>What we stand for</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem' }}>
              {['Speed — every second matters in an emergency request.', 'Transparency — clear eligibility and compatibility information.', 'Accessibility — a portal that works on any device, for anyone.']
                .map((t) => <li key={t} style={{ marginBottom: '0.6rem', color: 'var(--color-ink-soft)' }}>{t}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>
      <section className="section section-alt">
        <div className="container">
          <div className="section-header"><span className="eyebrow">By the numbers</span><h2>Why this matters</h2></div>
          <div className="grid grid-3">
            <Reveal className="card"><h3>1 donation</h3><p className="muted mb-0">Can help save up to three patients through component separation.</p></Reveal>
            <Reveal className="card"><h3>Every 2 seconds</h3><p className="muted mb-0">Someone, somewhere, needs blood.</p></Reveal>
            <Reveal className="card"><h3>56 days</h3><p className="muted mb-0">The typical interval before a whole-blood donor is eligible again.</p></Reveal>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container text-center">
          <h2>This is a Front-End Engineering-II project</h2>
          <p style={{ maxWidth: '60ch', marginInline: 'auto' }}>Built with React + Vite, modern CSS (Grid, Flexbox, glassmorphism, custom properties) and localStorage persistence — fully client-side, no backend.</p>
          <Link to="/contact" className="btn btn-primary mt-lg">Get in touch</Link>
        </div>
      </section>
    </main>
  );
}
