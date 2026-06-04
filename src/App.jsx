import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchSiteContent, saveSiteContent, fileToBase64, initFirebase } from './firebase';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

const defaultContent = {
  hero: {
    title: 'ChinaBridge Global: China Supplier Verification & Factory Audits',
    subtitle: 'The biggest risk when buying from China isn\'t the product — it\'s the supplier you can\'t see. We use on-the-ground evidence to reveal the truth.',
    ctaText: 'Run a $95 Supplier Reality Check',
    ctaLink: '#contact',
    backgroundImage: ''
  },
  services: [
    {
      title: 'Supplier Due Diligence',
      description: 'Paper verification + on-site inspection to confirm supplier identity, qualifications, and production capability.',
      actionText: 'View Due Diligence',
      actionLink: '#services'
    },
    {
      title: 'Contract Protection',
      description: 'Chinese-English bilingual contracts and NNN agreements to ensure your purchasing rights are enforceable in China.',
      actionText: 'View Contract Services',
      actionLink: '#services'
    },
    {
      title: 'Factory Visits',
      description: 'We arrange your itinerary, provide translation, and handle QC — verifying risks on-site before they become problems.',
      actionText: 'Arrange a Visit',
      actionLink: '#services'
    },
    {
      title: 'Problem Resolution',
      description: 'Supplier disputes, quality deviations, shipping issues — we step in directly to negotiate and deliver an actionable plan.',
      actionText: 'Get Problem Resolution',
      actionLink: '#services'
    }
  ],
  highlights: [
    {
      title: 'On-Site Evidence',
      description: 'Every service delivers bilingual Chinese-English reports, photos, and verification conclusions.'
    },
    {
      title: 'Fixed Pricing',
      description: 'Productized service model with transparent fees — no hidden charges, no surprises.'
    },
    {
      title: 'Local Teams',
      description: 'Execution centers in Guangzhou, Foshan, Shenzhen & Yiwu — truly boots on the ground.'
    }
  ],
  cases: [
    {
      title: '"They thought their supplier was stable. It was a roulette wheel."',
      description: 'We discovered the factory address was a shell company — actual production was outsourced to three different factories.',
      location: 'Guangzhou · 2023'
    },
    {
      title: '"The paperwork looked fine, but the factory floor was chaos."',
      description: 'No QC on the production line, material substitutions, and sample-to-shipment mismatches everywhere.',
      location: 'Shenzhen · 2024'
    },
    {
      title: '"Small problems that don\'t explode — they slowly drain you."',
      description: 'Monthly follow-ups caught price creep and quality drift, preventing long-term supply chain losses.',
      location: 'Yiwu · 2025'
    }
  ],
  hubs: [
    { city: 'Guangzhou', description: 'Guangdong — Operating since 2009' },
    { city: 'Foshan', description: 'Guangdong — Operating since 2011' },
    { city: 'Yiwu', description: 'Zhejiang — Operating since 2012' },
    { city: 'Shenzhen', description: 'Guangdong — Operating since 2012' }
  ],
  startOptions: [
    {
      title: 'Factory Inspection',
      price: 'From $795',
      description: 'On-site checks, photos, report, and risk assessment.'
    },
    {
      title: 'Contract Service',
      price: 'From $1,295',
      description: 'Enforceable Chinese-law contracts to protect your purchase orders and trade secrets.'
    },
    {
      title: 'Factory Visit Companion',
      price: 'From $2,950',
      description: 'Itinerary planning, translator, QC — one complete factory visit.'
    },
    {
      title: 'Problem Resolution Team',
      price: 'Custom Quote',
      description: 'Factory disputes, quality issues, shipping problems — direct negotiation and resolution.'
    }
  ],
  trustLogos: [
    'Global Brands',
    'Supply Chain Platforms',
    'Cross-Border Trade',
    'Procurement Teams'
  ],
  about: {
    title: 'We Deliver Verifiable Results, Not Promises',
    content: 'We focus on China supplier risk control: productized services, on-site reports, fixed pricing — helping you see the real picture before you commit.',
    image: ''
  },
  contact: {
    title: 'Contact Us',
    lead: 'Fill out the form below, or reach us directly by email or phone.',
    phone: '+86 135 2208 6875',
    email: 'hello@chinabridge-global.com',
    address: 'Guangzhou / Hong Kong'
  },
  seo: {
    title: 'ChinaBridge Global - Supplier Verification & Factory Audits',
    description: 'ChinaBridge Global provides professional supplier verification, factory audits, sourcing support & risk control services across China. Guangzhou, Shenzhen, Yiwu teams on the ground.'
  },
  branding: {
    favicon: '',
    logo: ''
  }
};

function App() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        initFirebase();
        setFirebaseReady(true);
        const remote = await fetchSiteContent();
        if (remote && active) {
          setContent({ ...defaultContent, ...remote });
        }
      } catch (error) {
        console.warn('Firebase not configured or failed to load, using local defaults.', error.message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadContent();
    return () => { active = false; };
  }, []);

  // Dynamically update SEO title and description
  useEffect(() => {
    if (content.seo?.title) {
      document.title = content.seo.title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && content.seo?.description) {
      metaDesc.setAttribute('content', content.seo.description);
    }
    // Dynamically update favicon
    if (content.branding?.favicon) {
      let favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = content.branding.favicon;
    }
  }, [content.seo, content.branding]);

  async function handleSave(updated) {
    setLoading(true);
    try {
      await saveSiteContent(updated);
      setContent(updated);
      alert('Content saved to Firebase.');
    } catch (error) {
      console.error(error);
      alert('Save failed. Please check Firebase configuration.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(field, file) {
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      let updated;
      if (field === 'favicon' || field === 'logo') {
        updated = { ...content, branding: { ...content.branding, [field]: base64 } };
      } else {
        updated = { ...content, [field]: { ...content[field], image: base64 } };
      }
      await saveSiteContent(updated);
      setContent(updated);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('Image processing failed. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      {!isAdmin && (
        <header className="site-header">
          <div className="brand"><Link to="/"><img src="/logo.png" alt="ChinaBridge Global" className="brand-logo" /></Link></div>
          <nav className="site-nav">
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={<HomePage content={content} loading={loading} />} />
          <Route
            path="/admin"
            element={
              <AdminPage
                content={content}
                loading={loading}
                firebaseReady={firebaseReady}
                onSave={handleSave}
                onUpload={handleUpload}
                onBack={() => navigate('/')}
              />
            }
          />
        </Routes>
      </main>

      {!isAdmin && (
        <footer className="site-footer">
          <p>© 2026 ChinaBridge Global. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
