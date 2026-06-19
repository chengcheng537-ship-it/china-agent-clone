// Preload patch: fix Chinese hostname in os.hostname()
const os = require('os');
os.hostname = () => 'vercel-cli';
