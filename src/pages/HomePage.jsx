import { useMemo, useState } from 'react';

function HomePage({ content, loading }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const heroStyle = useMemo(
    () => ({
      backgroundImage: content.hero.backgroundImage
        ? `url(${content.hero.backgroundImage})`
        : 'linear-gradient(135deg, #071420 0%, #0f172a 65%)'
    }),
    [content.hero.backgroundImage]
  );

  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setFeedback('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setFeedback('Please fill in your name, email and message before submitting.');
      return;
    }

    const subject = encodeURIComponent(`Website Inquiry: ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nCompany: ${form.company || 'N/A'}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${(content.contact.emails || [])[0] || ''}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (loading) {
    return <div className="loading-panel">Loading content...</div>;
  }

  return (
    <div className="page-home">
      <section className="hero-section" style={heroStyle}>
        <div className="hero-copy">
          <p className="eyebrow">CHINA SUPPLIER RISK CONTROL</p>
          <h1>{content.hero.title}</h1>
          <p className="hero-description">{content.hero.subtitle}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={content.hero.ctaLink || '#contact'}>
              {content.hero.ctaText}
            </a>
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="section-header">
          <h2>The Services You Need Right Now</h2>
          <p>From supplier verification to contract protection, factory visits, and problem resolution — covering every critical step of procurement.</p>
        </div>
        <div className="service-grid">
          {content.services.map((item, index) => (
            <article key={index} className="service-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a className="service-link" href={item.actionLink}>{item.actionText}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section highlights-section">
        <div className="section-header">
          <h2>Three Principles We Work By</h2>
          <p>On-site evidence, fixed pricing, local execution — no long-term lock-in, just deliverable results.</p>
        </div>
        <div className="highlight-grid">
          {content.highlights.map((item, index) => (
            <article key={index} className="highlight-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cases-section">
        <div className="section-header">
          <h2>Real Cases | The Factory Floors We've Actually Walked</h2>
          <p>Three typical procurement risks that show why you need a professional China supplier verification team.</p>
        </div>
        <div className="case-grid">
          {content.cases.map((item, index) => (
            <article key={index} className="case-card">
              <p className="case-tag">{item.location}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {content.visibility?.hubs !== false && (
      <section className="section hubs-section">
        <div className="section-header">
          <h2>Local Execution Centers</h2>
          <p>We maintain a permanent presence in China's key sourcing hubs — truly capable of "on-site contract verification."</p>
        </div>
        <div className="hub-grid">
          {content.hubs.map((hub, index) => (
            <article key={index} className="hub-card">
              <h3>{hub.city}</h3>
              <p>{hub.description}</p>
            </article>
          ))}
        </div>
      </section>
      )}

      {content.visibility?.startOptions !== false && (
      <section className="section plans-section">
        <div className="section-header">
          <h2>Four Ways to Get Started</h2>
          <p>Start with a low-cost $95 risk check, then decide based on real findings whether to upgrade to contract, visit, or resolution services.</p>
        </div>
        <div className="plan-grid">
          {content.startOptions.map((item, index) => (
            <article key={index} className="plan-card">
              <h3>{item.title}</h3>
              <p className="plan-price">{item.price}</p>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      )}

      {content.visibility?.trustLogos !== false && (
      <section className="section brands-section">
        <div className="section-header">
          <h2>Partners &amp; Trust Sources</h2>
          <p>We've served diverse procurement roles and brands. Our focus is on results, not long-term contracts.</p>
        </div>
        <div className="brand-grid">
          {content.trustLogos.map((name, index) => (
            <div key={index} className="brand-card">{name}</div>
          ))}
        </div>
      </section>
      )}

      <section className="section about-section" id="about">
        <div className="about-content" id="contact">
          <h2>{content.about.title}</h2>
          <p>{content.about.content}</p>
          <div className="about-contact">
            {content.contact.companyName && (
              <div className="contact-item">
                <strong>Company</strong>
                <span>{content.contact.companyName}</span>
              </div>
            )}
            {(content.contact.phones || []).map((phone, i) => (
              <div className="contact-item" key={`p${i}`}>
                <strong>Phone</strong>
                <span>{phone}</span>
              </div>
            ))}
            {(content.contact.emails || []).map((email, i) => (
              <div className="contact-item" key={`e${i}`}>
                <strong>Email</strong>
                <span>{email}</span>
              </div>
            ))}
            <div className="contact-item">
              <strong>Address</strong>
              <span>{content.contact.address}</span>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={e => updateForm('name', e.target.value)}
              placeholder="Your full name"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={e => updateForm('email', e.target.value)}
              placeholder="your@email.com"
            />
          </label>
          <label>
            Company / Procurement Team
            <input
              type="text"
              value={form.company}
              onChange={e => updateForm('company', e.target.value)}
              placeholder="e.g. XYZ Procurement Dept"
            />
          </label>
          <label>
            Your Message
            <textarea
              rows="5"
              value={form.message}
              onChange={e => updateForm('message', e.target.value)}
              placeholder="Describe your sourcing needs or concerns"
            />
          </label>
          {feedback && <p className="form-message">{feedback}</p>}
          <button className="button button-primary" type="submit">
            Send Inquiry
          </button>
          {submitted && <p className="form-success">Email draft ready — please complete sending in your mail client.</p>}
        </form>
      </section>
    </div>
  );
}

export default HomePage;
