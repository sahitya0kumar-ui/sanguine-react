import { useState } from 'react';
import { Empty } from '../components/ui.jsx';

const FAQS = [
  { q: 'Does donating blood hurt?', a: 'Most donors feel only a brief pinch when the needle is inserted. The donation itself typically takes 8–10 minutes and is not painful.' },
  { q: 'How often can I donate?', a: 'Whole-blood donors can generally donate again after about 56 days (8 weeks), giving your body time to replenish red blood cells.' },
  { q: 'Is my data safe on Sanguine?', a: "This demo stores your details only in your browser's local storage — nothing is sent to a server." },
  { q: 'What should I do before donating?', a: 'Sleep well, eat a balanced meal, and drink plenty of water in the hours before your appointment.' },
  { q: 'Can I request blood for someone else?', a: 'Yes — use the Request Blood page to post an emergency request on behalf of a patient.' },
  { q: 'What if I miss my donation interval?', a: "No problem — simply update your availability and donate whenever you're next eligible." }
];

export default function Faq() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const s = q.toLowerCase();
  const list = FAQS.filter((f) => f.q.toLowerCase().includes(s) || f.a.toLowerCase().includes(s));
  return (
    <main id="main" tabIndex={-1}>
      <section className="page-hero">
        <div className="container text-center">
          <span className="eyebrow">FAQ</span><h1>Frequently asked questions</h1>
          <div className="field" style={{ maxWidth: 420, margin: '1rem auto 0' }}>
            <input type="search" aria-label="Search questions" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…" />
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {list.map((f) => {
            const isOpen = open === f.q;
            return (
              <div key={f.q} className={`accordion-item${isOpen ? ' open' : ''}`}>
                <button className="acc-trigger" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : f.q)}>
                  {f.q}<span className="plus">+</span>
                </button>
                <div className="acc-panel"><p>{f.a}</p></div>
              </div>
            );
          })}
          {!list.length && <Empty title="No matching questions">Try different keywords.</Empty>}
        </div>
      </section>
    </main>
  );
}
