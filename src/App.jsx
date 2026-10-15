import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer, Header, LoadingScreen, Toaster } from './components/Shell.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Donor from './pages/Donor.jsx';
import Donors from './pages/Donors.jsx';
import Request from './pages/Request.jsx';
import BloodBanks from './pages/BloodBanks.jsx';
import Camps from './pages/Camps.jsx';
import Compatibility from './pages/Compatibility.jsx';
import Eligibility from './pages/Eligibility.jsx';
import Faq from './pages/Faq.jsx';
import Gallery from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';
import { Login, Signup } from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';

function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="auth-shell">
      <div className="container text-center">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <a href="#/" className="btn btn-primary mt-lg">Back home</a>
      </div>
    </main>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <LoadingScreen hide={!loading} />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/donor" element={<Donor />} />
        <Route path="/donors" element={<Donors />} />
        <Route path="/request" element={<Request />} />
        <Route path="/bloodbanks" element={<BloodBanks />} />
        <Route path="/camps" element={<Camps />} />
        <Route path="/compatibility" element={<Compatibility />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster />
    </>
  );
}
