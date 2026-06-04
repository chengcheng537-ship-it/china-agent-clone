import { useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { fetchSiteContent, saveSiteContent, uploadImage, deleteImage, initFirebase } from './firebase';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

const defaultContent = {
  hero: {
    title: 'ChinaBridge Global：中国供应商验证与工厂审核',
    subtitle: '在中国买货，最危险的不是产品，而是你看不见的供应商。我们用现场证据替你揭开真相。',
    ctaText: '运行 $95 供应商现实检查',
    ctaLink: '#contact',
    backgroundImage: ''
  },
  services: [
    {
      title: '尽职调查',
      description: '纸面核实 + 现场验证，确认供应商真实身份、资质与生产能力。',
      actionText: '查看尽职调查',
      actionLink: '#services'
    },
    {
      title: '合同保护',
      description: '中英合同与 NNN 协议，确保你在中国的采购权益可执行。',
      actionText: '查看合同服务',
      actionLink: '#services'
    },
    {
      title: '现场陪访',
      description: '你来中国，我们负责行程、翻译、QC，提前把风险现场确认。',
      actionText: '安排陪访',
      actionLink: '#services'
    },
    {
      title: '问题处理',
      description: '供应商争议、质量偏差、发货纠纷，我们直接介入谈判并给你行动方案。',
      actionText: '获取问题处理',
      actionLink: '#services'
    }
  ],
  highlights: [
    {
      title: '现场证据',
      description: '每份服务都输出中英文现场报告、图片与核查结论。'
    },
    {
      title: '固定价格',
      description: '产品化服务模式，明确费用，不做隐藏收费。'
    },
    {
      title: '本地团队',
      description: '广州 / 佛山 / 深圳 / 义乌多个执行中心，真正做到“现场取证”。'
    }
  ],
  cases: [
    {
      title: '“他们以为供应商稳定，结果是轮盘赌。”',
      description: '我们发现工厂地址是挂靠公司，实际生产外包给三家不同工厂。',
      location: '广州 · 2023'
    },
    {
      title: '“文件看起来正常，现场却是一片混乱。”',
      description: '生产线无QC、物料变更，样品与出货根本不一致。',
      location: '深圳 · 2024'
    },
    {
      title: '“小问题不爆发，慢慢变成大损失。”',
      description: '月度跟进抓住涨价和质量漂移，避免了长期供应链损失。',
      location: '义乌 · 2025'
    }
  ],
  hubs: [
    { city: '广州', description: '广东 · 2009 年执行中心' },
    { city: '佛山', description: '广东 · 2011 年执行中心' },
    { city: '义乌', description: '浙江 · 2012 年执行中心' },
    { city: '深圳', description: '广东 · 2012 年执行中心' }
  ],
  startOptions: [
    {
      title: '工厂现场核查',
      price: '$795 起',
      description: '现场检查、照片、报告、风险结论。'
    },
    {
      title: '中文合同服务',
      price: '$1,295 起',
      description: '可执行的中国法律合同，保护你的采购订单与秘密。'
    },
    {
      title: '陪同工厂访问',
      price: '$2,950 起',
      description: '安排行程、翻译、QC，一次到位的工厂访问。'
    },
    {
      title: '问题处理团队',
      price: '定制报价',
      description: '工厂纠纷、质量争议、发货问题，直接谈判解决。'
    }
  ],
  trustLogos: [
    '国际品牌',
    '供应链平台',
    '跨境贸易',
    '采购团队'
  ],
  about: {
    title: '我们只做可落地的验证与纠偏',
    content: '我们专注于中国供应商风险控制：产品化服务、现场报告、固定价格，帮助你在中国采购中看清真实情况。',
    image: ''
  },
  contact: {
    title: '联系我们',
    lead: '填写下面表单，或直接通过邮箱和电话联系我们。',
    phone: '+86 135 2208 6875',
    email: 'hello@chinabridge-global.com',
    address: '中国 · 广州 / 香港'
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

  // 动态更新 SEO 标题和描述
  useEffect(() => {
    if (content.seo?.title) {
      document.title = content.seo.title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && content.seo?.description) {
      metaDesc.setAttribute('content', content.seo.description);
    }
    // 动态更新 favicon
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
      alert('内容已保存到 Firebase。');
    } catch (error) {
      console.error(error);
      alert('保存失败：请检查 Firebase 配置。');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(field, file) {
    setLoading(true);
    try {
      // 如果是 branding 字段（favicon / logo），直接存 URL 字符串
      if (field === 'favicon' || field === 'logo') {
        const url = await uploadImage(file, 'branding');
        const updated = { ...content, branding: { ...content.branding, [field]: url } };
        await saveSiteContent(updated);
        setContent(updated);
        setLoading(false);
        return url;
      }
      const url = await uploadImage(file);
      const updated = { ...content, [field]: { ...content[field], image: url } };
      await saveSiteContent(updated);
      setContent(updated);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('图片上传失败，检查 Firebase 存储权限。');
      setLoading(false);
    }
  }

  async function handleDeleteImage(field, imageUrl) {
    if (!imageUrl || !confirm('确定要删除这张图片吗？')) return;
    setLoading(true);
    try {
      await deleteImage(imageUrl);
      let updated;
      if (field === 'favicon' || field === 'logo') {
        updated = { ...content, branding: { ...content.branding, [field]: '' } };
      } else {
        updated = { ...content, [field]: { ...content[field], image: '' } };
      }
      await saveSiteContent(updated);
      setContent(updated);
    } catch (error) {
      console.error(error);
      alert('图片删除失败。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand"><Link to="/">ChinaBridge Global</Link></div>
        <nav className="site-nav">
          <a href="#services">服务</a>
          <a href="#about">关于</a>
          <a href="#contact">联系</a>
          <NavLink to="/admin">管理后台</NavLink>
        </nav>
      </header>

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
                onDeleteImage={handleDeleteImage}
                onBack={() => navigate('/')}
              />
            }
          />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>© 2026 ChinaBridge Global. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
