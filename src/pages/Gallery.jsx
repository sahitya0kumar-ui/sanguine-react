import { useState } from 'react';
import { PageHero, Reveal } from '../components/ui.jsx';

const GALLERY = [
  ['Corporate Donor Drive', 'Camp'], ['Volunteer Team, Mohali', 'Volunteers'], ['City Life Hospital', 'Hospital'],
  ['University Blood Camp', 'Camp'], ['First-time Donor Day', 'Drive'], ['Fortis Blood Bank', 'Hospital'],
  ['Community Health Drive', 'Drive'], ['Thank-You Ceremony', 'Volunteers']
];
const TAGS = ['All', ...new Set(GALLERY.map((g) => g[1]))];

export default function Gallery() {
  const [tag, setTag] = useState('All');
  return (
    <main id="main" tabIndex={-1}>
      <PageHero eyebrow="Gallery" title="Moments from the movement" lead="Camps, volunteers, hospitals, and drives from across the network." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {TAGS.map((t) => <button key={t} className={`btn btn-sm ${t === tag ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTag(t)}>{t}</button>)}
          </div>
          <div className="gallery-grid">
            {GALLERY.filter((g) => tag === 'All' || g[1] === tag).map(([label, t]) => (
              <Reveal key={label} className="gallery-item"><div className="ph">{t}</div><div className="cap">{label}</div></Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
