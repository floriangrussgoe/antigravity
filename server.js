const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY || 'your-secret-api-key-here';

// Middleware
app.use(express.json());

// CORS Configuration for GitHub Pages
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:8081',
    'http://localhost:3000',
    'https://floriangrussgoe.github.io',
    '*' // Allow all for now (can restrict later)
  ];

  // Allow all origins (simplest for now)
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// API Key Authentication Middleware
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid API key' });
  }
};

// Public Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'primary',
    service: 'Antigravity',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Public Status Endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    mode: 'primary',
    services: {
      api: 'running',
      database: 'connected',
      cache: 'active'
    },
    timestamp: new Date().toISOString()
  });
});

// Basic Info Endpoint (Public)
app.get('/basic', (req, res) => {
  res.json({
    name: 'Antigravity',
    version: '1.0.0',
    description: 'Resilient deployment demo with Cloudflare Tunnel and Fly.io fallback',
    endpoints: {
      public: ['/health', '/status', '/basic'],
      protected: ['/api/*']
    }
  });
});

// Main Landing Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Antigravity API - Enterprise Backend</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
          --onyx: #020617;
          --liquid-gold: #F59E0B;
          --platinum: #94A3B8;
          --success: #10B981;
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
          max-width: 800px;
          width: 100%;
          background: var(--glass-ultra-bg);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 60px 40px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 1px 0 var(--glass-highlight);
          text-align: center;
        }
        
        h1 {
          font-size: 48px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #F8FAFC 0%, var(--platinum) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--platinum);
          margin-bottom: 40px;
        }
        
        .status {
          display: inline-block;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          color: var(--success);
          margin-bottom: 40px;
        }
        
        .endpoints {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 40px;
        }
        
        .endpoint {
          background: var(--glass-ultra-bg);
          border: 1px solid var(--glass-border);
          padding: 20px;
          border-radius: 12px;
          transition: all 0.2s;
        }
        
        .endpoint:hover {
          border-color: rgba(245, 158, 11, 0.3);
          transform: translateY(-2px);
        }
        
        .endpoint-name {
          font-weight: 600;
          margin-bottom: 8px;
          color: #F8FAFC;
        }
        
        .endpoint-path {
          font-family: 'SF Mono', 'Courier New', monospace;
          font-size: 14px;
          color: var(--platinum);
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid var(--glass-border);
          font-size: 13px;
          color: var(--platinum);
        }
        
        .footer strong {
          color: var(--liquid-gold);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Antigravity</h1>
        <p class="subtitle">Enterprise Backend API</p>
        <div class="status">✅ System Operational (Primary)</div>
        
        <div class="endpoints">
          <div class="endpoint">
            <div class="endpoint-name">Health Check</div>
            <div class="endpoint-path">/health</div>
          </div>
          <div class="endpoint">
            <div class="endpoint-name">Status</div>
            <div class="endpoint-path">/status</div>
          </div>
          <div class="endpoint">
            <div class="endpoint-name">Basic Info</div>
            <div class="endpoint-path">/basic</div>
          </div>
          <div class="endpoint">
            <div class="endpoint-name">Protected API</div>
            <div class="endpoint-path">/api/*</div>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Powered by Fly.io</strong></p>
          <p>Uptime: ${Math.floor(process.uptime())}s</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Protected API Endpoint (requires API key)
app.get('/api/data', apiKeyAuth, (req, res) => {
  res.json({
    message: 'This is protected data',
    data: {
      users: 42,
      requests: 1337,
      uptime: process.uptime()
    },
    timestamp: new Date().toISOString()
  });
});

// Protected Admin Endpoint
app.get('/api/admin', apiKeyAuth, (req, res) => {
  res.json({
    message: 'Admin access granted',
    system: {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    message: 'The requested endpoint does not exist'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Antigravity server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 API Key: ${API_KEY === 'your-secret-api-key-here' ? '⚠️  Using default key!' : '✅ Custom key set'}`);
});
