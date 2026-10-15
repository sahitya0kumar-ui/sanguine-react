import { useForm } from '../lib/hooks';
import { V } from '../lib/validation';
import { useApp } from '../context.jsx';
import { Field, PageHero, Reveal } from '../components/ui.jsx';
import { insert } from '../lib/storage';

const RULES = { name: [V.required], email: [V.required, V.email], message: [V.required, V.minLen(10)] };

export default function Contact() {
  const { toast } = useApp();
  const f = useForm({ name: '', email: '', message: '' }, RULES, (v, reset) => {
    insert('bc_messages', v);
    toast(`Thanks ${v.name.split(' ')[0]}, we'll reply to ${v.email} soon.`);
    reset();
  });
  return (
    <main id="main" tabIndex={-1}>
      <PageHero eyebrow="Contact" title="We're here to help" lead="Reach out with questions, partnership ideas, or feedback on the platform." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid grid-2">
          <form className="form-card" noValidate onSubmit={f.handleSubmit(() => toast('Please fix the highlighted fields.', 'error'))}>
            <Field f={f} name="name" label="Name" placeholder="Your name" />
            <Field f={f} name="email" label="Email" type="email" placeholder="you@example.com" />
            <Field f={f} name="message" label="Message" as="textarea" rows={5} placeholder="How can we help?" />
            <button type="submit" className="btn btn-primary btn-block">Send Message</button>
          </form>
          <div>
            <Reveal className="card" style={{ marginBottom: '1.2rem' }}><h3>Emergency numbers</h3>
              <p className="mb-0">National Blood Helpline: <strong><a href="tel:104">104</a></strong></p>
              <p className="mb-0">Ambulance: <strong><a href="tel:102">102</a> / <a href="tel:108">108</a></strong></p></Reveal>
            <Reveal className="card" style={{ marginBottom: '1.2rem' }}><h3>Head office</h3>
              <p className="mb-0">Sector 34, Chandigarh, India</p><p className="mb-0">Mon–Sat, 9:00 AM – 6:00 PM</p></Reveal>
            <Reveal className="card"><h3>Follow us</h3>
              <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                {['Instagram', 'X / Twitter', 'LinkedIn'].map((s) => <a key={s} href="#/contact" className="btn btn-ghost btn-sm">{s}</a>)}
              </div></Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
