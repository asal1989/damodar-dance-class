const { execSync } = require('child_process');
const https = require('https');

// Get Firebase access token from CLI
let token;
try {
  token = execSync('firebase --token-script 2>/dev/null || firebase login:ci --no-localhost 2>/dev/null').toString().trim();
} catch(e) {}

// Use stored token from firebase config
const os = require('os');
const path = require('path');
const fs = require('fs');

const configPaths = [
  path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json'),
  path.join(os.homedir(), 'AppData', 'Roaming', 'npm', 'node_modules', 'firebase-tools', 'lib', 'auth.js'),
];

// Try to get token from firebase-tools config
let fbConfig;
const fbConfigPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
if (fs.existsSync(fbConfigPath)) {
  fbConfig = JSON.parse(fs.readFileSync(fbConfigPath, 'utf8'));
  const tokens = fbConfig.tokens;
  if (tokens && tokens.access_token) {
    token = tokens.access_token;
  }
}

if (!token) {
  console.error('Could not find Firebase token. Please run: firebase login');
  process.exit(1);
}

const bucket = 'damodar-studi0.firebasestorage.app';
const corsConfig = JSON.stringify([{
  origin: ['https://asal1989.github.io', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
  responseHeader: ['Content-Type', 'Authorization', 'Content-Length'],
  maxAgeSeconds: 3600
}]);

const options = {
  hostname: 'storage.googleapis.com',
  path: `/storage/v1/b/${encodeURIComponent(bucket)}?fields=cors`,
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(corsConfig)
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ CORS configured successfully!');
    } else {
      console.error('❌ Failed:', res.statusCode, data);
    }
  });
});
req.on('error', err => console.error('Error:', err));
req.write(corsConfig);
req.end();
