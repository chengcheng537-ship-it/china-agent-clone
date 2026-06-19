// Wrapper for Vercel CLI to fix Chinese hostname issue
// os.hostname() returns "程成" which is not a legal HTTP header value
// This wrapper monkey-patches os.hostname() to return "vercel-cli"
const fs = require('fs');
const path = require('path');
const os = require('os');

// Monkey-patch os.hostname
const originalHostname = os.hostname;
os.hostname = () => 'vercel-cli';

// Now run the actual vercel CLI
const vercelPath = path.join(
  process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
  'npm',
  'node_modules',
  'vercel',
  'dist',
  'vc.js'
);

require(vercelPath);
