import { useState, useEffect } from 'react';
import { submitInquiry } from '../firebase';

function InquiryModal({ open, onClose, serviceName, pageUrl }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  useEffect(() => {
    if (open) {
      setForm({ name: '', email: '', company: '', message: '' });
      setStatus('idle');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    try {
      await submitInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        message: form.message.trim(),
        serviceName: serviceName || '',
        pageUrl: pageUrl || window.location.href,
      });
      setStatus('done');
    } catch (err) {
      console.error('Inquiry submit failed', err);
      setStatus('error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {status === 'done' ? (
          <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <h3>Inquiry Sent</h3>
            <p>We'll get back to you within 1 business day.</p>
            <button className="button button-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="inquiry-form" onSubmit={handleSubmit}>
            <h2 className="inquiry-title">Send an Inquiry</h2>
            {serviceName && <p className="inquiry-context">Re: {serviceName}</p>}

            <label>
              Name
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
              />
            </label>

            <label>
              Company / Procurement Team
              <input
                type="text"
                placeholder="e.g. XYZ Procurement Dept"
                value={form.company}
                onChange={e => set('company', e.target.value)}
              />
            </label>

            <label>
              Your Message
              <textarea
                rows="4"
                placeholder="Describe your sourcing needs or concerns"
                value={form.message}
                onChange={e => set('message', e.target.value)}
                required
              />
            </label>

            <button
              className="button button-primary inquiry-submit"
              type="submit"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending...' : 'Send Inquiry'}
            </button>

            {status === 'error' && (
              <p className="inquiry-error">Submission failed. Please try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default InquiryModal;
