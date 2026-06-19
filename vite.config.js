import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const BUILD_ID = Date.now().toString(36);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-build-id',
      transformIndexHtml(html) {
        // 写入 version.txt 供运行时检测
        writeFileSync(resolve(__dirname, 'public/version.txt'), BUILD_ID);
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
