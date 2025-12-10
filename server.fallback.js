const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// CORS for all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'fallback',
    service: 'Antigravity Fallback',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'maintenance',
    mode: 'fallback',
    message: 'Primary system offline, fallback active',
    timestamp: new Date().toISOString()
  });
});

// Basic info
app.get('/basic', (req, res) => {
  res.json({
    name: 'Antigravity Fallback',
    version: '1.0.0',
    mode: 'fallback',
    features: ['health-check', 'status', 'basic-info']
  });
});

// Main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Antigravity - Wartungsmodus</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
          --onyx: #020617;
          --liquid-gold: #F59E0B;
          --platinum: #94A3B8;
          --glass-ultra-bg: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.08);
          --glass-highlight: rgba(255, 255, 255, 0.05);
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
          background: var(--onyx);
          color: #F8FAFC;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          -webkit-font-smoothing: antialiased;
        }
        
        .container {
          max-width: 600px;
          width: 100%;
          text-align: center;
          background: var(--glass-ultra-bg);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 60px 40px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 1px 0 var(--glass-highlight);
        }
        
        .icon {
          font-size: 64px;
          margin-bottom: 24px;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #F8FAFC 0%, var(--platinum) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .status {
          color: var(--liquid-gold);
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        p {
          color: var(--platinum);
          line-height: 1.6;
          margin-bottom: 16px;
        }
        
        .badge {
          display: inline-block;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          margin-top: 24px;
          color: var(--liquid-gold);
          font-weight: 600;
        }
        
        .timestamp {
          margin-top: 40px;
          font-size: 12px;
          color: var(--platinum);
          padding-top: 24px;
          border-top: 1px solid var(--glass-border);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🔧</div>
        <h1>Antigravity</h1>
        <p class="status">System Wartung</p>
        <p>Unser primäres System ist vorübergehend nicht verfügbar.</p>
        <p>Wir arbeiten an der Wiederherstellung des vollständigen Zugriffs.</p>
        <p>Bitte versuchen Sie es in wenigen Minuten erneut.</p>
        <div class="badge">Fallback-Modus Aktiv</div>
        <p class="timestamp">Status: ${new Date().toLocaleString('de-DE')}</p>
      </div>
    </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'This endpoint is not available in fallback mode',
    mode: 'fallback'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Antigravity Fallback server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
