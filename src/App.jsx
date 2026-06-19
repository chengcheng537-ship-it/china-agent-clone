import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { saveSiteContent, fileToBase64, initFirebase } from './firebase';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import AdminPage from './pages/AdminPage';
import serviceContent from './data/serviceContent';

const defaultContent = {
  servicePages: serviceContent,
  hero: {
    title: 'EastLink Solutions: China Supplier Verification & Factory Audits',
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
    email: 'hello@eastlink-solutions.com',
    address: 'Guangzhou / Hong Kong'
  },
  seo: {
    title: 'EastLink Solutions - Supplier Verification & Factory Audits',
    description: 'EastLink Solutions provides professional supplier verification, factory audits, sourcing support & risk control services across China. Guangzhou, Shenzhen, Yiwu teams on the ground.'
  },
  branding: {
    favicon: '',
    logo: ''
  }
};

const CACHE_KEY = 'eastlink_site_content_v3';

async function fetchPublicContent() {
  const response = await fetch(`/api/content?ts=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Content API failed: ${response.status}`);
  }
  const data = await response.json();
  return data.content;
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Deep-merge servicePages: remote wins for top-level fields (admin edits persist).
// Sections maintain code-default order; code-new sections are injected at the
// correct position.  Stale "$95" values are automatically upgraded to "$99".
function deepMergeServicePages(defaultPages, remotePages) {
  const result = {};
  for (const slug of Object.keys(defaultPages)) {
    const dp = defaultPages[slug];
    const rp = remotePages[slug] || {};
    // Remote wins for top-level → admin edits survive across reloads
    const merged = { ...dp, ...rp };
    if (dp.sections) {
      // Normalise whitespace so "\n" vs " " doesn't create duplicate match failures
      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
      const remoteByNorm = {};
      (rp.sections || []).forEach(s => { remoteByNorm[norm(s.title)] = s; });
      const defNormTitles = new Set(dp.sections.map(s => norm(s.title)));
      // Follow code-default order; keep code type/title, pick up remote items
      const ordered = dp.sections.map(ds => {
        const rs = remoteByNorm[norm(ds.title)];
        if (!rs) return ds;
        const contentKey = ds.type === 'pricing' ? 'tiers' : 'items';
        return { ...ds, [contentKey]: rs[contentKey] || ds[contentKey] };
      });
      // Append any remote sections that are NOT in code defaults
      (rp.sections || []).forEach(rs => {
        if (!defNormTitles.has(norm(rs.title))) ordered.push(rs);
      });
      merged.sections = ordered;
    }
    // Fixup: stale $95 → $99 in all text fields
    sanitizeDollarValues(merged);
    // Strip " — $xx" price from reality-check navLabel
    if (slug === 'reality-check' && merged.navLabel) {
      merged.navLabel = merged.navLabel.replace(/ — \$\d+/, '');
    }
    result[slug] = merged;
  }
  // Also preserve any pages only in remote
  for (const slug of Object.keys(remotePages)) {
    if (!result[slug]) result[slug] = remotePages[slug];
  }
  return result;
}

// Recursively replace "$95" with "$99" so nav dropdown and hero badge stay current.
function sanitizeDollarValues(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string' && val.includes('$95')) {
      obj[key] = val.replace(/\$95/g, '$99');
    } else if (Array.isArray(val)) {
      val.forEach(item => sanitizeDollarValues(item));
    } else if (val && typeof val === 'object') {
      sanitizeDollarValues(val);
    }
  }
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch { /* quota exceeded, ignore */ }
}

function App() {
  const cached = loadCache();
  const [content, setContent] = useState(cached || defaultContent);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  useEffect(() => {
    let active = true;

    // 有缓存就直接展示，无需 loading
    if (cached) {
      setLoading(false);
    }

    async function loadContent() {
      try {
        initFirebase();
        setFirebaseReady(true);
        const remote = await fetchPublicContent();
        if (remote && active) {
          // Deep-merge servicePages so code-updated sections (banner, FAQ) appear alongside admin edits
          const merged = {
            ...defaultContent,
            ...remote,
            servicePages: remote.servicePages
              ? deepMergeServicePages(defaultContent.servicePages, remote.servicePages)
              : defaultContent.servicePages,
          };
          setContent(merged);
          saveCache(merged);
          if (!cached) setLoading(false);
        } else if (!cached) {
          setLoading(false);
        }
      } catch (error) {
        console.warn('Remote content failed to load, using local defaults.', error.message);
        if (!cached) setLoading(false);
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
      saveCache(updated);
      alert('Content saved to Firebase.');
    } catch (error) {
      console.error(error);
      alert('Save failed. Please check Firebase configuration.');
    } finally {
      setLoading(false);
    }
  }

  function setNested(obj, path, value) {
    const keys = path.split('.');
    const result = Array.isArray(obj) ? [...obj] : { ...obj };
    let pointer = result;
    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        pointer[k] = value;
      } else {
        const next = pointer[k];
        pointer[k] = Array.isArray(next) ? [...next] : { ...next };
        pointer = pointer[k];
      }
    });
    return result;
  }

  async function handleUpload(field, file) {
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      let updated;
      if (field.includes('.')) {
        // Nested path like servicePages.reality-check.image.src
        updated = setNested(content, field, base64);
      } else if (field === 'favicon' || field === 'logo') {
        updated = { ...content, branding: { ...content.branding, [field]: base64 } };
      } else {
        updated = { ...content, [field]: { ...content[field], image: base64 } };
      }
      await saveSiteContent(updated);
      setContent(updated);
      saveCache(updated);
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
          <div className="brand"><Link to="/"><img src="/logo.png" alt="EastLink Solutions" className="brand-logo" /></Link></div>
          <button className="nav-toggle" aria-label="Toggle menu" onClick={() => document.querySelector('.site-nav').classList.toggle('nav-open')}>
            <span></span><span></span><span></span>
          </button>
          <nav className="site-nav">
            <Link to="/">Home</Link>
            <Link to="/#about">About Us</Link>
            <div className="nav-dropdown">
              <button className="nav-dropdown-toggle" onClick={(e) => {
                e.currentTarget.parentElement.classList.toggle('open');
              }}>Services <span className="arrow">▾</span></button>
              <div className="nav-dropdown-menu">
                <Link to="/services/reality-check">Supplier Reality Check™ — $95</Link>
                <Link to="/services/due-diligence">Due Diligence</Link>
                <Link to="/services/contracts">Contracts</Link>
                <Link to="/services/guided-visits">Guided Visits</Link>
                <Link to="/services/fixer">Fixer</Link>
              </div>
            </div>
            <Link to="/#contact">Contact Us</Link>
          </nav>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={<HomePage content={content} loading={loading} />} />
          <Route path="/services/:slug" element={<ServicePage content={content} loading={loading} />} />
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
          <p>© 2026 EastLink Solutions. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
