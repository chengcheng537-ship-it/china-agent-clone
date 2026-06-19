import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

/*
 * ============================================================================
 * Firebase 配置指引
 * ============================================================================
 * 1. 前往 https://console.firebase.google.com/ 创建项目
 * 2. 在项目设置 → 常规 → 您的应用 → 添加 Web 应用
 * 3. 复制 Firebase SDK 配置片段，去掉键值两端的尖括号 <>
 * 4. 替换下方 firebaseConfig 中的占位符
 * 5. 在 Firebase 控制台启用 Firestore Database（测试模式）
 *    👉 图片直接以 base64 存入 Firestore，无需开通 Storage（免信用卡）
 * ============================================================================
 */
const firebaseConfig = {
  apiKey: 'AIzaSyDc09ZgiLyPo2fLsOVPin83e0dFbzq_VFA',
  authDomain: 'chinabridge-global.firebaseapp.com',
  projectId: 'chinabridge-global',
  storageBucket: 'chinabridge-global.firebasestorage.app',
  messagingSenderId: '39497963994',
  appId: '1:39497963994:web:7061ad80072a0317ec48e3'
};

let db;

export function initFirebase() {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('<')) {
    throw new Error('请在 src/firebase.js 中填写 Firebase 配置（注意去掉尖括号）。\n详见文件顶部注释中的配置步骤。');
  }

  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }

  return { db };
}

export async function fetchSiteContent() {
  const { db } = initFirebase();
  const docRef = doc(db, 'site', 'content');
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data();
}

export async function saveSiteContent(data) {
  const { db } = initFirebase();
  const docRef = doc(db, 'site', 'content');
  await setDoc(docRef, data, { merge: true });
}

export async function fileToBase64(file, maxWidth = 1200, quality = 0.75) {
  // 非图片文件直接读
  if (!file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('读取失败'));
      reader.readAsDataURL(file);
    });
  }

  // 图片用 canvas 压缩后再转 base64（避免 Firestore 1MB 上限）
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxWidth) {
        h = Math.round(h * (maxWidth / w));
        w = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片加载失败'));
    };
    img.src = url;
  });
}
