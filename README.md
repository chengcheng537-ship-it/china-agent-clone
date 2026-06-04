# ChinaBridge Global

基于 React + Vite 的品牌网站，含 Firebase CMS 内容管理后台。面向海外用户的供应商验证与工厂审核服务展示站。

## 特性

- React + Vite 前端项目
- Firebase 内容管理（Firestore），图片以 base64 存入 Firestore 文档
- 管理后台页面：修改文案、上传图片
- 移动端响应式布局
- 可直接部署到 Vercel / Netlify 等静态托管平台

## 目录结构

- `src/`：应用源码
- `src/firebase.js`：Firebase 配置与数据操作
- `src/pages/HomePage.jsx`：首页展示
- `src/pages/AdminPage.jsx`：内容管理后台

## 快速启动

1. 安装 Node.js（推荐 18.x 或更高）
2. 进入项目目录：

```bash
cd d:\papers\china-agent-clone
```

3. 安装依赖：

```bash
npm install
```

4. 运行开发服务器：

```bash
npm run dev
```

5. 在浏览器访问 `http://localhost:5173`

6. 管理后台访问 `http://localhost:5173/admin`，默认管理密码是 `cb2026`。

## 配置 Firebase

1. 登录 Firebase 控制台：https://console.firebase.google.com
2. 创建一个项目。
3. 在项目设置中获取 Web 应用配置（API key、projectId 等）。
4. 打开 `src/firebase.js`，替换占位符配置（**注意去掉键值两端的尖括号 `<>`**）。
5. 在 Firestore 中创建数据库（测试模式），集合 `site`。
   - 无需启用 Storage —— 图片以 base64 格式直接存入 Firestore 文档。
   - 无需升级 Blaze 计划或绑定信用卡。

如果你不设置 Firebase，网站仍然会使用默认本地演示内容，但管理后台保存功能将不可用。

> 图片处理说明：图片通过浏览器 FileReader 转为 base64 字符串，随其他内容一起保存到 Firestore 文档中。无需 Firebase Storage，免信用卡。单张图片建议控制在 500KB 以内。

## 一键托管推荐

如果你暂时没有域名，建议使用这些免费/低成本静态站点托管平台：

- Vercel：自动部署 GitHub 仓库，支持免费子域名 `*.vercel.app`。
- Netlify：自动构建，支持免费子域名 `*.netlify.app`。
- Cloudflare Pages：免费托管，速度快且支持 HTTPS。

这三个平台都支持直接将 Vite 项目部署为静态前端，无需自己管理服务器。

> 本项目已优化移动端布局，适合手机浏览和触控操作。

## 部署到 Vercel

1. 注册或登录 Vercel：https://vercel.com
2. 创建一个新项目，选择“Import Git Repository”。
3. 连接你的 GitHub/GitLab/Bitbucket 账号，并选择你的项目仓库。
4. 选择项目根目录（通常就是这个仓库根目录）。
5. 在部署设置中填写：
   - 框架预设：`Vite`
   - 构建命令：`npm run build`
   - 输出目录：`dist`
6. 点击“Deploy”开始部署。
7. 部署成功后，你会得到一个免费子域名，形如 `your-project.vercel.app`。

> 如果你的项目还没有上传到 GitHub，先在本地执行 `git init`、`git add .`、`git commit -m "init"`，再将代码推送到 GitHub。

## 部署到 Netlify

1. 注册或登录 Netlify：https://www.netlify.com
2. 点击“Add new site”，选择“Import from Git”。
3. 连接你的 GitHub/GitLab/Bitbucket 账号，并选择你的项目仓库。
4. 设置构建命令和发布目录：
   - 构建命令：`npm run build`
   - 发布目录：`dist`
5. 点击“Deploy site”。
6. 部署完成后，你会获得一个 `*.netlify.app` 免费子域名。

## 详细部署注意事项

- 你不需要购买域名，Vercel 和 Netlify 会给你免费子域名。
- 这类平台托管在中国境外，不需要国内备案。
- 如果你后续想修改内容，只需：
  1. 更新项目代码
  2. 提交到 GitHub
  3. Vercel/Netlify 会自动重新构建并发布最新版本。

## 推荐顺序

- 优先推荐 Vercel：和 Vite 集成最顺畅，部署体验最好。
- 其次是 Netlify：界面简单，国内访问速度也不错。
- Cloudflare Pages：如果你喜欢 Cloudflare 的 CDN 和免费 HTTPS，也可以选择。

## GitHub + Vercel 一键部署（含把代码推到 GitHub）

下面是从本地项目推送到 GitHub，再在 Vercel 上一键部署的完整步骤（适合编程小白）。

1. 在 GitHub 上创建仓库：
  - 登录 GitHub，点击右上角 `+` → `New repository`。
  - 填写仓库名（例如 `china-agent-clone`），选择 `Public` 或 `Private`，点击 `Create repository`。

2. 在本地初始化仓库并提交代码：

```bash
cd D:\papers\china-agent-clone
git init
git add .
git commit -m "init: initial project"
# 如果你想把默认分支命名为 main：
git branch -M main

# 把远程仓库地址替换为你 GitHub 上新建仓库的 URL：
git remote add origin https://github.com/your-username/china-agent-clone.git
git push -u origin main
```

提示：如果 push 时需要身份验证，可以使用 GitHub Desktop、Git Credential Manager 或创建一个个人访问令牌（PAT）并在提示密码时粘贴该令牌。

3. 在 Vercel 上一键部署：

  - 访问 https://vercel.com 并登录（可以使用 GitHub 授权登录）。
  - 点击 `New Project` → `Import Git Repository`，选择你刚刚推送的仓库。
  - 在项目设置中：
    - 框架预设：选择 `Vite`。
    - 构建命令：`npm run build`。
    - 输出目录：`dist`。
  - 点击 `Deploy`，部署完成后会得到 `your-project.vercel.app` 这样的子域名。

4. 后续更新流程：

```bash
# 修改代码后
git add .
git commit -m "chore: update site content"
git push
```

Vercel 会自动触发构建并发布最新版本。

5. 可选：在 Vercel 设置自定义域并绑定（非必需）。

常见问题：
- 如果你使用的是 Windows 并且第一次推送受阻，请安装 Git for Windows（含 Git Credential Manager）或使用 GitHub Desktop。
- 若你更愿意图形化操作，GitHub Desktop 可以完成所有本地提交与推送步骤。

## 部署到 Firebase Hosting

1. 安装 Firebase CLI：

```bash
npm install -g firebase-tools
```

2. 登录：

```bash
firebase login
```

3. 初始化 Hosting：

```bash
firebase init hosting
```

4. 构建项目：

```bash
npm run build
```

5. 发布：

```bash
firebase deploy
```

## 后续替换建议

- 在管理后台 `/admin` 直接修改所有文案、SEO 信息和图片。
- 在 `src/styles.css` 调整颜色、字体、间距以匹配目标站点风格。
- 上传自有图片后，页面会自动使用新图片替换默认渐变背景。
- 当你准备好域名时，可在 Vercel/Netlify 中绑定自定义域名。
