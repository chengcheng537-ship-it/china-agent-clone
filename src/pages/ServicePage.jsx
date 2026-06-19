import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import InquiryModal from '../components/InquiryModal';

function ServicePage({ content, loading }) {
  const { slug } = useParams();
  const page = content.servicePages?.[slug];
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (e) => { e.preventDefault(); setModalOpen(true); };

  if (loading) {
    return <div className="loading-panel">Loading...</div>;
  }

  if (!page) {
    return (
      <div className="page-service">
        <section className="section">
          <h1>Service not found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <Link to="/" className="button button-primary">Back to Home</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page-service">
      {/* Hero */}
      <section className="service-hero">
        <div className="service-hero-content">
          {page.badge && <p className="service-badge">{page.badge}</p>}
          <h1>{page.heroTitle}</h1>
          <p className="service-hero-desc">{page.heroDescription}</p>
          {page.ctaText && (
            <button className="button button-primary" onClick={openModal}>
              {page.ctaText}
            </button>
          )}
        </div>
        {/* Image placeholder */}
        <div className="service-hero-image">
          {page.image?.src ? (
            <img src={page.image.src} alt={page.title} />
          ) : (
            <div className="image-placeholder" style={{ aspectRatio: `${page.image?.width || 800}/${page.image?.height || 400}` }}>
              <span>🖼 {page.image?.label || `Image (${page.image?.width || 800}×${page.image?.height || 400})`}</span>
            </div>
          )}
        </div>
      </section>

      {/* Sections */}
      {page.sections?.map((section, idx) => (
        <section className="section service-section" key={idx}>
          <div className="section-header">
            <h2>{section.title}</h2>
          </div>

          {section.type === 'features' && (
            <div className="service-features-grid">
              {section.items?.map((item, i) => (
                <div className="service-feature-card" key={i}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {section.type === 'steps' && (
            <div className="service-steps">
              {section.items?.map((item, i) => (
                <div className="service-step" key={i}>
                  <div className="step-number">{i + 1}</div>
                  <div className="step-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.type === 'list' && (
            <ul className="service-list">
              {section.items?.map((item, i) => (
                <li key={i}>{typeof item === 'string' ? item : item.desc || item.title}</li>
              ))}
            </ul>
          )}

          {section.type === 'pricing' && (
            <div className="service-pricing-grid">
              {section.tiers?.map((tier, i) => (
                <div className="service-pricing-card" key={i}>
                  <h3>{tier.name}</h3>
                  <p className="pricing-desc">{tier.desc}</p>
                  {tier.features && (
                    <ul className="pricing-features">
                      {tier.features.map((f, j) => (
                        <li key={j}>✓ {f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {section.type === 'faq' && (
            <div className="service-faq">
              {section.items?.map((item, i) => (
                <details className="faq-item" key={i}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          )}

          {section.type === 'banner' && (
            <div className="service-banner">
              <h3 className="banner-title">{section.title}</h3>
              {section.items?.map((line, i) => (
                <p key={i} className={line.hi ? 'banner-hi' : ''}>{line.desc}</p>
              ))}
            </div>
          )}
        </section>
      ))}

      {/* Bottom CTA */}
      {page.ctaText && (
        <section className="section service-cta">
          <h2>Ready to get started?</h2>
          <button className="button button-primary" onClick={openModal}>
            {page.ctaText}
          </button>
        </section>
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName={page?.title || ''}
        pageUrl={window.location.href}
      />
    </div>
  );
}

export default ServicePage;
