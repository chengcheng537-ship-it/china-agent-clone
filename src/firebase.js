import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/*
 * ============================================================================
 * Firebase 配置指引
 * ============================================================================
 * 1. 前往 https://console.firebase.google.com/ 创建项目
 * 2. 在项目设置 → 常规 → 您的应用 → 添加 Web 应用
 * 3. 复制 Firebase SDK 配置片段
 * 4. 替换下方 firebaseConfig 中的占位符
 * 5. 在 Firebase 控制台启用 Firestore Database（测试模式）
 * 6. 在 Firebase 控制台启用 Storage（测试模式）
 * ============================================================================
 */
const firebaseConfig = {
  apiKey: '<YOUR_API_KEY>',
  authDomain: '<YOUR_AUTH_DOMAIN>',
  projectId: '<YOUR_PROJECT_ID>',
  storageBucket: '<YOUR_STORAGE_BUCKET>',
  messagingSenderId: '<YOUR_MESSAGING_SENDER_ID>',
  appId: '<YOUR_APP_ID>'
};

let db;
let storage;

export function initFirebase() {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('<')) {
    throw new Error('请在 src/firebase.js 中填写 Firebase 配置。\n详见文件顶部注释中的配置步骤。');
  }

  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
  }

  return { db, storage };
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

export async function uploadImage(file, folder = 'site-images') {
  const { storage } = initFirebase();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const imageRef = ref(storage, `${folder}/${Date.now()}-${safeName}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

export async function deleteImage(imageUrl) {
  if (!imageUrl) return;
  const { storage } = initFirebase();
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.warn('删除图片失败（可能已被删除）:', error.message);
  }
}
