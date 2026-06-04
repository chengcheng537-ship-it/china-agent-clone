import { useEffect, useState } from 'react';

const ADMIN_PASSWORD = 'cb2026';

function AdminPage({ content, loading, firebaseReady, onSave, onUpload, onBack }) {
  const [authValue, setAuthValue] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [draft, setDraft] = useState(content);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    setDraft(content);
  }, [content]);

  function handleAuthSubmit(event) {
    event.preventDefault();
    if (authValue === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  }

  function updateField(path, value) {
    setDraft(prev => {
      const keys = path.split('.');
      const next = Array.isArray(prev) ? [...prev] : { ...prev };
      let pointer = next;

      keys.forEach((rawKey, index) => {
        const key = Number.isNaN(Number(rawKey)) ? rawKey : Number(rawKey);
        if (index === keys.length - 1) {
          pointer[key] = value;
        } else {
          const nextValue = pointer[key];
          const cloned = Array.isArray(nextValue) ? [...nextValue] : { ...nextValue };
          pointer[key] = cloned;
          pointer = cloned;
        }
      });

      return next;
    });
  }

  function handleSaveClick() {
    setSaveStatus('saving');
    try {
      onSave(draft);
      setTimeout(() => setSaveStatus('done'), 800);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('error');
    }
  }

  function handleImageChange(field, event) {
    const file = event.target.files[0];
    if (file) {
      onUpload(field, file);
    }
  }

  if (loading) {
    return <div className="loading-panel">Loading CMS panel...</div>;
  }

  const renderImageUpload = (label, field, currentUrl) => (
    <div className="upload-card">
      <p><strong>{label}</strong></p>
      {currentUrl ? (
        <div className="upload-preview">
          <img src={currentUrl} alt={label} className="upload-thumb" />
          <p className="upload-hint" style={{ marginTop: '0.25rem' }}>Re-upload to replace</p>
        </div>
      ) : (
        <p className="upload-hint">No image uploaded</p>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={e => handleImageChange(field, e)}
        style={{ marginTop: '0.5rem' }}
      />
    </div>
  );

  return (
    <div className="admin-page">
      {!authenticated ? (
        <>
          <div className="admin-logo-area">
            <img src="/logo.png" alt="ChinaBridge Global" className="admin-logo" />
          </div>
          <form className="admin-login" onSubmit={handleAuthSubmit}>
            <label>
              Admin Password
              <input
                type="password"
                value={authValue}
                onChange={e => setAuthValue(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
            </label>
            <button className="button button-primary" type="submit">Sign In</button>
          </form>
        </>
      ) : (
        <>
          {firebaseReady ? (
            <div className="admin-panel">
              <div className="admin-notice">
                Firebase connected. All changes save to the cloud. Click &quot;Save All Content&quot; at the bottom to persist.
              </div>

              {/* ========== SEO Settings ========== */}
              <div className="form-group">
                <h2>SEO &amp; Page Meta</h2>
                <label>
                  Page Title (title tag)
                  <input
                    value={draft.seo?.title || ''}
                    onChange={e => updateField('seo.title', e.target.value)}
                    placeholder="Displayed in browser tabs and search results"
                  />
                </label>
                <label>
                  Meta Description
                  <textarea
                    rows="2"
                    value={draft.seo?.description || ''}
                    onChange={e => updateField('seo.description', e.target.value)}
                    placeholder="Shown in Google search snippets. Keep 120-160 characters."
                  />
                </label>
              </div>

              {/* ========== Brand Assets ========== */}
              <div className="form-group">
                <h2>Brand Assets</h2>
                <div className="image-upload-grid">
                  {renderImageUpload('Favicon (browser icon)', 'favicon', draft.branding?.favicon)}
                  {renderImageUpload('Site Logo', 'logo', draft.branding?.logo)}
                </div>
              </div>

              {/* ========== Hero / Banner ========== */}
              <div className="form-group">
                <h2>Hero / Banner</h2>
                {renderImageUpload('Banner Background', 'hero', draft.hero?.backgroundImage)}
                <label>
                  Title
                  <input value={draft.hero?.title || ''} onChange={e => updateField('hero.title', e.target.value)} />
                </label>
                <label>
                  Subtitle
                  <input value={draft.hero?.subtitle || ''} onChange={e => updateField('hero.subtitle', e.target.value)} />
                </label>
                <label>
                  CTA Button Text
                  <input value={draft.hero?.ctaText || ''} onChange={e => updateField('hero.ctaText', e.target.value)} />
                </label>
                <label>
                  CTA Button Link
                  <input value={draft.hero?.ctaLink || ''} onChange={e => updateField('hero.ctaLink', e.target.value)} />
                </label>
              </div>

              {/* ========== Services ========== */}
              <div className="form-group">
                <h2>Services</h2>
                {draft.services?.map((item, i) => (
                  <div key={i} className="array-group">
                    <h3>Service {i + 1}</h3>
                    <div className="form-grid">
                      <label>Title<input value={item.title} onChange={e => updateField(`services.${i}.title`, e.target.value)} /></label>
                      <label>Link Text<input value={item.actionText} onChange={e => updateField(`services.${i}.actionText`, e.target.value)} /></label>
                    </div>
                    <label>Description<textarea rows="2" value={item.description} onChange={e => updateField(`services.${i}.description`, e.target.value)} /></label>
                    <label>Link URL<input value={item.actionLink} onChange={e => updateField(`services.${i}.actionLink`, e.target.value)} /></label>
                  </div>
                ))}
              </div>

              {/* ========== Highlights ========== */}
              <div className="form-group">
                <h2>Highlights / Principles</h2>
                {draft.highlights?.map((item, i) => (
                  <div key={i} className="array-group">
                    <h3>Highlight {i + 1}</h3>
                    <label>Title<input value={item.title} onChange={e => updateField(`highlights.${i}.title`, e.target.value)} /></label>
                    <label>Description<textarea rows="2" value={item.description} onChange={e => updateField(`highlights.${i}.description`, e.target.value)} /></label>
                  </div>
                ))}
              </div>

              {/* ========== Case Studies ========== */}
              <div className="form-group">
                <h2>Case Studies</h2>
                {draft.cases?.map((item, i) => (
                  <div key={i} className="array-group">
                    <h3>Case {i + 1}</h3>
                    <div className="form-grid">
                      <label>Title<input value={item.title} onChange={e => updateField(`cases.${i}.title`, e.target.value)} /></label>
                      <label>Location / Year<input value={item.location} onChange={e => updateField(`cases.${i}.location`, e.target.value)} /></label>
                    </div>
                    <label>Description<textarea rows="2" value={item.description} onChange={e => updateField(`cases.${i}.description`, e.target.value)} /></label>
                  </div>
                ))}
              </div>

              {/* ========== Hubs ========== */}
              <div className="form-group">
                <h2>Execution Centers</h2>
                {draft.hubs?.map((item, i) => (
                  <div key={i} className="array-group">
                    <h3>Hub {i + 1}</h3>
                    <div className="form-grid">
                      <label>City<input value={item.city} onChange={e => updateField(`hubs.${i}.city`, e.target.value)} /></label>
                      <label>Description<input value={item.description} onChange={e => updateField(`hubs.${i}.description`, e.target.value)} /></label>
                    </div>
                  </div>
                ))}
              </div>

              {/* ========== Plans / Pricing ========== */}
              <div className="form-group">
                <h2>Plans &amp; Pricing</h2>
                {draft.startOptions?.map((item, i) => (
                  <div key={i} className="array-group">
                    <h3>Plan {i + 1}</h3>
                    <div className="form-grid">
                      <label>Title<input value={item.title} onChange={e => updateField(`startOptions.${i}.title`, e.target.value)} /></label>
                      <label>Price<input value={item.price} onChange={e => updateField(`startOptions.${i}.price`, e.target.value)} /></label>
                    </div>
                    <label>Description<textarea rows="2" value={item.description} onChange={e => updateField(`startOptions.${i}.description`, e.target.value)} /></label>
                  </div>
                ))}
              </div>

              {/* ========== Trust Logos ========== */}
              <div className="form-group">
                <h2>Trust &amp; Partner Brands</h2>
                {draft.trustLogos?.map((item, i) => (
                  <label key={i}>
                    Item {i + 1}
                    <input value={item} onChange={e => updateField(`trustLogos.${i}`, e.target.value)} />
                  </label>
                ))}
              </div>

              {/* ========== About ========== */}
              <div className="form-group">
                <h2>About Us</h2>
                {renderImageUpload('About Image', 'about', draft.about?.image)}
                <label>Title<input value={draft.about?.title || ''} onChange={e => updateField('about.title', e.target.value)} /></label>
                <label>Content<textarea rows="4" value={draft.about?.content || ''} onChange={e => updateField('about.content', e.target.value)} /></label>
              </div>

              {/* ========== Contact ========== */}
              <div className="form-group">
                <h2>Contact Info</h2>
                <div className="form-grid">
                  <label>Phone<input value={draft.contact?.phone || ''} onChange={e => updateField('contact.phone', e.target.value)} /></label>
                  <label>Email<input value={draft.contact?.email || ''} onChange={e => updateField('contact.email', e.target.value)} /></label>
                </div>
                <label>Address<input value={draft.contact?.address || ''} onChange={e => updateField('contact.address', e.target.value)} /></label>
              </div>

              {/* ========== Save ========== */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button className="button button-primary" onClick={handleSaveClick}>
                  {saveStatus === 'saving' ? 'Saving...' : 'Save All Content'}
                </button>
                {saveStatus === 'done' && <span style={{ color: '#15803d', fontWeight: 600 }}>Saved to Firebase</span>}
                {saveStatus === 'error' && <span style={{ color: '#dc2626', fontWeight: 600 }}>Save Failed</span>}
              </div>
            </div>
          ) : (
            <div className="admin-panel">
              <div className="admin-warning">
                <p><strong>Firebase Not Configured</strong></p>
                <p>Fill in your Firebase project config in <code>src/firebase.js</code>.</p>
                <hr />
                <p><strong>Setup Steps:</strong></p>
                <ol style={{ paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                  <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener">Firebase Console</a> and create a project</li>
                  <li>Project Settings → Add Web App → Copy config</li>
                  <li>Enable <strong>Firestore Database</strong> (test mode, no credit card needed)</li>
                  <li>Paste config into <code>src/firebase.js</code> (remove angle brackets)</li>
                  <li>Refresh this page to start managing content</li>
                </ol>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPage;
