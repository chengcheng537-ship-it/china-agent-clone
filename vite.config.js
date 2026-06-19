import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BUILD_ID = Date.now().toString(36);

export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://eastlink-solutions.com'
    }
  },
  plugins: [
    react(),
    {
      name: 'inject-build-id',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.txt', source: BUILD_ID });
      },
      transformIndexHtml(html) {
        // 注入自刷新脚本（通过 fetch version.txt 绕过 HTML 缓存）
        return html.replace(
          '</head>',
          `<script>!function(){var x=new XMLHttpRequest();x.open('GET','/version.txt?v='+Date.now(),!1);x.onload=function(){var r=x.responseText.trim();var s=sessionStorage.getItem('_bid');if(s&&s!==r){sessionStorage.setItem('_bid',r);location.reload(!0)}else{sessionStorage.setItem('_bid',r)}};x.send()}();</script>
  </head>`
        );
      },
    },
  ],
});
