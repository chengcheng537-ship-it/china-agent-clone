import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDc09ZgiLyPo2fLsOVPin83e0dFbzq_VFA',
  authDomain: 'chinabridge-global.firebaseapp.com',
  projectId: 'chinabridge-global',
  storageBucket: 'chinabridge-global.firebasestorage.app',
  messagingSenderId: '39497963994',
  appId: '1:39497963994:web:7061ad80072a0317ec48e3'
};

function getDb() {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.setHeader('Access-Control-Allow-Origin', '*');

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const snapshot = await getDoc(doc(getDb(), 'site', 'content'));
    const data = snapshot.exists() ? snapshot.data() : null;
    if (request.query?.version === '1') {
      response.status(200).json({ version: data?._contentVersion || null });
      return;
    }
    response.status(200).json({ content: data });
  } catch (error) {
    response.status(500).json({ error: error.message || 'Failed to load content' });
  }
}
