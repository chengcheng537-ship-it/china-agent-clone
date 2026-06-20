import { useEffect, useRef, useState } from 'react';
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
    companyName: '',
    phones: ['+86 135 2208 6875'],
    emails: ['hello@eastlink-solutions.com'],
    address: 'Guangzhou / Hong Kong'
  },
  seo: {
    title: 'EastLink Solutions - Supplier Verification & Factory Audits',
    description: 'EastLink Solutions provides professional supplier verification, factory audits, sourcing support & risk control services across China. Guangzhou, Shenzhen, Yiwu teams on the ground.'
  },
  branding: {
    favicon: '',
    logo: ''
  },
  visibility: {
    hubs: false,
    startOptions: false,
    trustLogos: false
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
// Sections use title-first + positional-fallback matching:
//   1. Try to find an unmatched remote section with the SAME normalised title.
//   2. If not found, try the remote section at the SAME array index (with a
//      safety check to avoid stealing a section that belongs elsewhere).
//   3. Otherwise keep the code default.
// Unmatched remote sections are appended at the end.
// This lets admin rename, retype, or rewrite any field without duplicates,
// and safely handles the transitional state when code has more sections
// than Firebase (e.g. after adding new sections to code defaults).
function deepMergeServicePages(defaultPages, remotePages) {
  const result = {};
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const hasText = (v) => typeof v === 'string' && v.trim().length > 0;
  // Merge items/tiers arrays: for object entries with a `name` field (tiers),
  // match by normalised name so code-default reordering takes effect.  For
  // plain strings or nameless objects, use positional merge with extra code
  // defaults appended.
  const mergeArrayField = (defaultArr, remoteArr) => {
    if (!remoteArr || remoteArr.length === 0) return defaultArr;
    if (!defaultArr) return remoteArr;

    // Name-based matching for tier-like objects (have a `name` string field)
    const hasNamedItems = defaultArr.some(
      item => item && typeof item === 'object' && hasText(item.name)
    );
    if (hasNamedItems) {
      const usedRemote = new Set();
      const result = defaultArr.map((dItem, dIdx) => {
        if (!dItem || typeof dItem !== 'object' || !hasText(dItem.name)) {
          // Nameless entry (blank template): positional fallback
          const rItem = remoteArr[dIdx];
          if (rItem && !usedRemote.has(dIdx)) {
            usedRemote.add(dIdx);
            return { ...dItem, ...rItem };
          }
          return dItem;
        }
        const dName = norm(dItem.name);
        const rIdx = remoteArr.findIndex((rItem, i) =>
          !usedRemote.has(i) && rItem && typeof rItem === 'object' &&
          norm(rItem.name || '') === dName
        );
        if (rIdx !== -1) {
          usedRemote.add(rIdx);
          return { ...dItem, ...remoteArr[rIdx] };
        }
        return dItem;
      });
      // Append unmatched remote entries
      remoteArr.forEach((rItem, i) => {
        if (!usedRemote.has(i)) result.push(rItem);
      });
      return result;
    }

    // Fallback: positional merge for plain arrays (features, list items, etc.)
    const merged = [...remoteArr];
    for (let i = remoteArr.length; i < defaultArr.length; i++) {
      merged.push(defaultArr[i]);
    }
    return merged;
  };
  for (const slug of Object.keys(defaultPages)) {
    const dp = defaultPages[slug];
    const rp = remotePages[slug] || {};
    // Remote wins for top-level → admin edits survive across reloads
    const merged = { ...dp, ...rp };
    if (dp.sections) {
      const remoteSections = rp.sections || [];
      const usedRemote = new Set();

      const ordered = dp.sections.map((ds, dsIdx) => {
        // Step 1 — title match (named sections only; blank sections skip)
        if (hasText(ds.title)) {
          const dsNorm = norm(ds.title);
          const titleMatchIdx = remoteSections.findIndex((rs, rsIdx) =>
            !usedRemote.has(rsIdx) && norm(rs.title) === dsNorm
          );
          if (titleMatchIdx !== -1) {
            usedRemote.add(titleMatchIdx);
            const rs = remoteSections[titleMatchIdx];
            return { ...ds, ...rs, items: mergeArrayField(ds.items, rs.items), tiers: mergeArrayField(ds.tiers, rs.tiers) };
          }
        }

        // Step 2 — positional fallback (with safety check)
        const rs = remoteSections[dsIdx];
        if (rs && !usedRemote.has(dsIdx)) {
          // Safety: if the remote section at this slot has a title matching
          // a DIFFERENT code-default section, it was shifted by array length
          // mismatch — skip so the real title-match can claim it later.
          if (hasText(rs.title)) {
            const rsNorm = norm(rs.title);
            const belongsToOther = dp.sections.some(
              (otherDs, otherIdx) => otherIdx !== dsIdx &&
                hasText(otherDs.title) && norm(otherDs.title) === rsNorm
            );
            if (belongsToOther) return ds;
          }
          usedRemote.add(dsIdx);
          return { ...ds, ...rs, items: mergeArrayField(ds.items, rs.items), tiers: mergeArrayField(ds.tiers, rs.tiers) };
        }

        // Step 3 — keep code default
        return ds;
      });

      // Append any unmatched remote sections (new sections added by admin)
      remoteSections.forEach((rs, rsIdx) => {
        if (!usedRemote.has(rsIdx)) ordered.push(rs);
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

function normalizeContactLegacy(contact) {
  if (!contact) return contact;
  const c = { ...contact };
  // Convert old single-string phone to phones array
  if (typeof c.phone === 'string') {
    if (!c.phones || c.phones.length === 0) c.phones = [c.phone];
    delete c.phone;
  }
  // Convert old single-string email to emails array
  if (typeof c.email === 'string') {
    if (!c.emails || c.emails.length === 0) c.emails = [c.email];
    delete c.email;
  }
  return c;
}

function App() {
  const cached = loadCache();
  const [content, setContent] = useState(cached || defaultContent);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const dropdownRef = useRef(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname, location.hash]);

  // Scroll to hash anchor (React Router v6 doesn't auto-scroll for same-path hash changes)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Small delay ensures the DOM is fully rendered
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dropdownRef.current.classList.remove('open');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          merged.contact = normalizeContactLegacy(merged.contact);
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
      throw error;
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
          <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setMobileNavOpen(prev => !prev)}>
            <span></span><span></span><span></span>
          </button>
          <nav className={`site-nav${mobileNavOpen ? ' nav-open' : ''}`}>
            <Link to="/">Home</Link>
            <Link to="/#inquiry">About Us</Link>
            <div className="nav-dropdown" ref={dropdownRef}>
              <button className="nav-dropdown-toggle" onClick={(e) => {
                e.stopPropagation();
                e.currentTarget.parentElement.classList.toggle('open');
              }}>Services <span className="arrow">▾</span></button>
              <div className="nav-dropdown-menu">
                <Link to="/services/reality-check">{content.servicePages?.['reality-check']?.navLabel || 'Supplier Reality Check™'}</Link>
                <Link to="/services/due-diligence">{content.servicePages?.['due-diligence']?.navLabel || 'Due Diligence'}</Link>
                <Link to="/services/contracts">{content.servicePages?.contracts?.navLabel || 'Contracts'}</Link>
                <Link to="/services/guided-visits">{content.servicePages?.['guided-visits']?.navLabel || 'Guided Visits'}</Link>
                <Link to="/services/fixer">{content.servicePages?.fixer?.navLabel || 'Fixer'}</Link>
              </div>
            </div>
            <Link to="/#inquiry">Contact Us</Link>
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
