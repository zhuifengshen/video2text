const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const ext = path.extname(filePath);
    const typeMap = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg'
    };
    res.writeHead(200, { 'Content-Type': typeMap[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function parseJson(req, cb) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');
      cb(null, data);
    } catch (e) {
      cb(e);
    }
  });
}

async function transcribe(filePath) {
  // Placeholder transcription logic. Replace with real STT engine.
  return `Transcribed text for file ${path.basename(filePath)}`;
}

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET') {
    const file = parsed.pathname === '/' ? '/index.html' : parsed.pathname;
    const filePath = path.join(__dirname, '..', 'client', file);
    return sendFile(res, filePath);
  }

  if (req.method === 'POST' && parsed.pathname === '/api/upload') {
    return parseJson(req, async (err, body) => {
      if (err || !body.filename || !body.data) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
      const buffer = Buffer.from(body.data, 'base64');
      const saved = path.join(uploadsDir, `${Date.now()}_${body.filename}`);
      fs.writeFileSync(saved, buffer);
      const text = await transcribe(saved);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ text }));
    });
  }

  if (req.method === 'POST' && parsed.pathname === '/api/transcribe') {
    return parseJson(req, (err, body) => {
      if (err || !body.url) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No URL provided' }));
      }
      const text = `Transcribed text for media at ${body.url}`; // placeholder
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ text }));
    });
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
