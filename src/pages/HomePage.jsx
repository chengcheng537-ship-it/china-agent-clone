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
      setFeedback('请填写姓名、邮箱和咨询内容后再提交。');
      return;
    }

    const subject = encodeURIComponent(`网站咨询：${form.name}`);
    const body = encodeURIComponent(
      `姓名：${form.name}\n公司：${form.company || '无'}\n邮箱：${form.email}\n\n咨询内容：\n${form.message}`
    );
    window.location.href = `mailto:${content.contact.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (loading) {
    return <div className="loading-panel">正在加载内容...</div>;
  }

  return (
    <div className="page-home">
      <section className="hero-section" style={heroStyle}>
        <div className="hero-copy">
          <p className="eyebrow">中国供应商风险控制</p>
          <h1>{content.hero.title}</h1>
          <p className="hero-description">{content.hero.subtitle}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={content.hero.ctaLink || '#contact'}>
              {content.hero.ctaText}
            </a>
            <a className="button button-secondary" href={`mailto:${content.contact.email}`}>
              直接邮件咨询
            </a>
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="section-header">
          <h2>你当前最需要的服务</h2>
          <p>从供应商核查到合同保护，再到现场陪访与问题处理，一次覆盖采购关键环节。</p>
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
          <h2>我们工作时的三个原则</h2>
          <p>现场证据、固定价格、本地执行，不做长期绑定，只做可交付的结果。</p>
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
          <h2>真实案例 | 我们实际走进去的现场</h2>
          <p>三种典型采购风险，说明为什么你需要专业的中国供应商验证团队。</p>
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

      <section className="section hubs-section">
        <div className="section-header">
          <h2>本地执行中心</h2>
          <p>我们在中国采购核心城市长期驻场，真正能做到“拿着合同上门核查”。</p>
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

      <section className="section plans-section">
        <div className="section-header">
          <h2>四种入门方式</h2>
          <p>你可以先用低成本 $95 风险检查，再根据真实结果决定是否升级合同、陪访或问题处理。</p>
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

      <section className="section brands-section">
        <div className="section-header">
          <h2>合作方与信任来源</h2>
          <p>我们服务过多种采购角色和品牌，核心在于结果而不是长期绑定。</p>
        </div>
        <div className="brand-grid">
          {content.trustLogos.map((name, index) => (
            <div key={index} className="brand-card">{name}</div>
          ))}
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="about-content">
          <h2>{content.about.title}</h2>
          <p>{content.about.content}</p>
          <div className="contact-box">
            <h3>{content.contact.title}</h3>
            <p>{content.contact.lead}</p>
            <p>电话：{content.contact.phone}</p>
            <p>邮箱：{content.contact.email}</p>
            <p>地址：{content.contact.address}</p>
          </div>
        </div>
        <div className="about-image-wrap">
          {content.about.image ? (
            <img src={content.about.image} alt="关于我们" />
          ) : (
            <div className="image-fallback">图片占位</div>
          )}
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="contact-card">
          <h2>{content.contact.title}</h2>
          <p>{content.contact.lead}</p>
          <div className="contact-item">
            <strong>邮箱</strong>
            <span>{content.contact.email}</span>
          </div>
          <div className="contact-item">
            <strong>电话</strong>
            <span>{content.contact.phone}</span>
          </div>
          <div className="contact-item">
            <strong>地址</strong>
            <span>{content.contact.address}</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            姓名
            <input
              type="text"
              value={form.name}
              onChange={e => updateForm('name', e.target.value)}
              placeholder="请输入您的姓名"
            />
          </label>
          <label>
            邮箱
            <input
              type="email"
              value={form.email}
              onChange={e => updateForm('email', e.target.value)}
              placeholder="请输入您的邮箱"
            />
          </label>
          <label>
            公司/采购团队
            <input
              type="text"
              value={form.company}
              onChange={e => updateForm('company', e.target.value)}
              placeholder="例如：XXX 采购部"
            />
          </label>
          <label>
            咨询内容
            <textarea
              rows="5"
              value={form.message}
              onChange={e => updateForm('message', e.target.value)}
              placeholder="请描述您的采购问题或需求"
            />
          </label>
          {feedback && <p className="form-message">{feedback}</p>}
          <button className="button button-primary" type="submit">
            立即发送咨询
          </button>
          {submitted && <p className="form-success">已准备好发邮件，请在邮箱中完成发送。</p>}
        </form>
      </section>

      <section className="section cta-section">
        <div className="cta-panel">
          <h2>不要让“看起来正常”成为你的采购陷阱</h2>
          <p>先拿到现场证据，再决定下一步。联系我们，获取第一手风险判断。</p>
          <a className="button button-secondary" href={`mailto:${content.contact.email}`}>
            发送邮件咨询
          </a>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
