import { useEffect, useState } from 'react';

const ADMIN_PASSWORD = 'cb2026';

function AdminPage({ content, loading, firebaseReady, onSave, onUpload, onDeleteImage, onBack }) {
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
      alert('密码错误，请输入正确管理密码。');
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

  function handleRemoveImage(field, imageUrl) {
    if (onDeleteImage) {
      onDeleteImage(field, imageUrl);
    }
  }

  if (loading) {
    return <div className="loading-panel">正在准备管理后台...</div>;
  }

  const renderImageUpload = (label, field, currentUrl) => (
    <div className="upload-card">
      <p><strong>{label}</strong></p>
      {currentUrl ? (
        <div className="upload-preview">
          <img src={currentUrl} alt={label} className="upload-thumb" />
          <button
            type="button"
            className="button button-ghost button-sm"
            onClick={() => handleRemoveImage(field, currentUrl)}
            style={{ color: '#dc2626', marginTop: '0.5rem' }}
          >
            删除图片
          </button>
        </div>
      ) : (
        <p className="upload-hint">尚未上传</p>
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
      <button className="button button-ghost" onClick={onBack}>&lt; 返回首页</button>
      <h1>ChinaBridge Global 内容管理后台</h1>

      {!authenticated ? (
        <form className="admin-login" onSubmit={handleAuthSubmit}>
          <label>
            管理密码
            <input
              type="password"
              value={authValue}
              onChange={e => setAuthValue(e.target.value)}
              placeholder="请输入管理密码"
              autoFocus
            />
          </label>
          <button className="button button-primary" type="submit">登录</button>
        </form>
      ) : (
        <div>
          {firebaseReady ? (
            <div className="admin-panel">
              <div className="admin-notice">
                Firebase 已连接，所有修改将保存到云端。修改后请点击底部「保存全部内容」。
              </div>

              {/* ========== SEO 设置 ========== */}
              <div className="form-group">
                <h2>SEO 与页面元信息</h2>
                <label>
                  页面标题 (title tag)
                  <input
                    value={draft.seo?.title || ''}
                    onChange={e => updateField('seo.title', e.target.value)}
                    placeholder="显示在浏览器标签页和搜索结果中"
                  />
                </label>
                <label>
                  Meta 描述 (description)
                  <textarea
                    rows="2"
                    value={draft.seo?.description || ''}
                    onChange={e => updateField('seo.description', e.target.value)}
                    placeholder="显示在 Google 搜索结果摘要中，建议 120-160 字符"
                  />
                </label>
              </div>

              {/* ========== 品牌素材 ========== */}
              <div className="form-group">
                <h2>品牌素材</h2>
                <div className="image-upload-grid">
                  {renderImageUpload('Favicon（浏览器图标）', 'favicon', draft.branding?.favicon)}
                  {renderImageUpload('网站 Logo', 'logo', draft.branding?.logo)}
                </div>
              </div>

              {/* ========== Banner 区 ========== */}
              <div className="form-group">
                <h2>Banner / 首屏区域</h2>
                {renderImageUpload('Banner 背景图', 'hero', draft.hero?.backgroundImage)}
                <label>
                  标题
                  <input
                    value={draft.hero?.title || ''}
                    onChange={e => updateField('hero.title', e.target.value)}
                  />
                </label>
                <label>
                  副标题
                  <input
                    value={draft.hero?.subtitle || ''}
                    onChange={e => updateField('hero.subtitle', e.target.value)}
                  />
                </label>
                <label>
                  CTA 按钮文案
                  <input
                    value={draft.hero?.ctaText || ''}
                    onChange={e => updateField('hero.ctaText', e.target.value)}
                  />
                </label>
                <label>
                  CTA 按钮链接
                  <input
                    value={draft.hero?.ctaLink || ''}
                    onChange={e => updateField('hero.ctaLink', e.target.value)}
                  />
                </label>
              </div>

              {/* ========== 服务内容 ========== */}
              <div className="form-group">
                <h2>服务内容</h2>
                {draft.services?.map((item, index) => (
                  <div key={index} className="array-group">
                    <h3>服务 {index + 1}</h3>
                    <div className="form-grid">
                      <label>
                        标题
                        <input
                          value={item.title}
                          onChange={e => updateField(`services.${index}.title`, e.target.value)}
                        />
                      </label>
                      <label>
                        链接文本
                        <input
                          value={item.actionText}
                          onChange={e => updateField(`services.${index}.actionText`, e.target.value)}
                        />
                      </label>
                    </div>
                    <label>
                      描述
                      <textarea
                        rows="2"
                        value={item.description}
                        onChange={e => updateField(`services.${index}.description`, e.target.value)}
                      />
                    </label>
                    <label>
                      链接地址
                      <input
                        value={item.actionLink}
                        onChange={e => updateField(`services.${index}.actionLink`, e.target.value)}
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* ========== 亮点 ========== */}
              <div className="form-group">
                <h2>亮点 / 原则</h2>
                {draft.highlights?.map((item, index) => (
                  <div key={index} className="array-group">
                    <h3>亮点 {index + 1}</h3>
                    <label>
                      标题
                      <input
                        value={item.title}
                        onChange={e => updateField(`highlights.${index}.title`, e.target.value)}
                      />
                    </label>
                    <label>
                      描述
                      <textarea
                        rows="2"
                        value={item.description}
                        onChange={e => updateField(`highlights.${index}.description`, e.target.value)}
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* ========== 案例 ========== */}
              <div className="form-group">
                <h2>真实案例</h2>
                {draft.cases?.map((item, index) => (
                  <div key={index} className="array-group">
                    <h3>案例 {index + 1}</h3>
                    <div className="form-grid">
                      <label>
                        标题
                        <input
                          value={item.title}
                          onChange={e => updateField(`cases.${index}.title`, e.target.value)}
                        />
                      </label>
                      <label>
                        地点/年份
                        <input
                          value={item.location}
                          onChange={e => updateField(`cases.${index}.location`, e.target.value)}
                        />
                      </label>
                    </div>
                    <label>
                      描述
                      <textarea
                        rows="2"
                        value={item.description}
                        onChange={e => updateField(`cases.${index}.description`, e.target.value)}
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* ========== 执行中心 ========== */}
              <div className="form-group">
                <h2>本地执行中心</h2>
                {draft.hubs?.map((item, index) => (
                  <div key={index} className="array-group">
                    <h3>站点 {index + 1}</h3>
                    <div className="form-grid">
                      <label>
                        城市
                        <input
                          value={item.city}
                          onChange={e => updateField(`hubs.${index}.city`, e.target.value)}
                        />
                      </label>
                      <label>
                        描述
                        <input
                          value={item.description}
                          onChange={e => updateField(`hubs.${index}.description`, e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* ========== 入门方案 ========== */}
              <div className="form-group">
                <h2>入门方案 / 定价</h2>
                {draft.startOptions?.map((item, index) => (
                  <div key={index} className="array-group">
                    <h3>方案 {index + 1}</h3>
                    <div className="form-grid">
                      <label>
                        标题
                        <input
                          value={item.title}
                          onChange={e => updateField(`startOptions.${index}.title`, e.target.value)}
                        />
                      </label>
                      <label>
                        价格
                        <input
                          value={item.price}
                          onChange={e => updateField(`startOptions.${index}.price`, e.target.value)}
                        />
                      </label>
                    </div>
                    <label>
                      描述
                      <textarea
                        rows="2"
                        value={item.description}
                        onChange={e => updateField(`startOptions.${index}.description`, e.target.value)}
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* ========== 信任来源 ========== */}
              <div className="form-group">
                <h2>信任来源 / 合作品牌</h2>
                {draft.trustLogos?.map((item, index) => (
                  <label key={index}>
                    项目 {index + 1}
                    <input
                      value={item}
                      onChange={e => updateField(`trustLogos.${index}`, e.target.value)}
                    />
                  </label>
                ))}
              </div>

              {/* ========== 关于我们 ========== */}
              <div className="form-group">
                <h2>关于我们</h2>
                {renderImageUpload('关于我们配图', 'about', draft.about?.image)}
                <label>
                  标题
                  <input
                    value={draft.about?.title || ''}
                    onChange={e => updateField('about.title', e.target.value)}
                  />
                </label>
                <label>
                  内容
                  <textarea
                    rows="4"
                    value={draft.about?.content || ''}
                    onChange={e => updateField('about.content', e.target.value)}
                  />
                </label>
              </div>

              {/* ========== 联系信息 ========== */}
              <div className="form-group">
                <h2>联系信息</h2>
                <div className="form-grid">
                  <label>
                    联系电话
                    <input
                      value={draft.contact?.phone || ''}
                      onChange={e => updateField('contact.phone', e.target.value)}
                    />
                  </label>
                  <label>
                    邮箱地址
                    <input
                      value={draft.contact?.email || ''}
                      onChange={e => updateField('contact.email', e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  联系地址
                  <input
                    value={draft.contact?.address || ''}
                    onChange={e => updateField('contact.address', e.target.value)}
                  />
                </label>
              </div>

              {/* ========== 保存按钮 ========== */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button className="button button-primary" onClick={handleSaveClick}>
                  {saveStatus === 'saving' ? '保存中...' : '保存全部内容'}
                </button>
                {saveStatus === 'done' && (
                  <span style={{ color: '#15803d', fontWeight: 600 }}>已保存到 Firebase</span>
                )}
                {saveStatus === 'error' && (
                  <span style={{ color: '#dc2626', fontWeight: 600 }}>保存失败</span>
                )}
              </div>
            </div>
          ) : (
            <div className="admin-panel">
              <div className="admin-warning">
                <p><strong>Firebase 尚未配置</strong></p>
                <p>请在 <code>src/firebase.js</code> 中填入你的 Firebase 项目配置。</p>
                <hr />
                <p><strong>配置步骤：</strong></p>
                <ol style={{ paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                  <li>前往 <a href="https://console.firebase.google.com/" target="_blank" rel="noopener">Firebase 控制台</a> 创建项目</li>
                  <li>项目设置 → 添加 Web 应用 → 复制配置</li>
                  <li>启用 <strong>Firestore Database</strong>（测试模式）</li>
                  <li>启用 <strong>Storage</strong>（测试模式）</li>
                  <li>将配置粘贴到 <code>src/firebase.js</code> 中</li>
                  <li>刷新本页面即可开始管理内容</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPage;
