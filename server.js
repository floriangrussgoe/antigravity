const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY || 'your-secret-api-key-here';

// Middleware
app.use(express.json());

// CORS Configuration for GitHub Pages
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'https://yourusername.github.io', // Replace with your GitHub Pages URL
    'https://antigravity.yourdomain.com' // Replace with your custom domain
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

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
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Antigravity - Resilient Deployment</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 60px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        h1 {
          font-size: 48px;
          margin-bottom: 16px;
          font-weight: 700;
        }
        .subtitle {
          font-size: 20px;
          opacity: 0.9;
          margin-bottom: 40px;
        }
        .status {
          display: inline-block;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          margin-bottom: 40px;
        }
        .endpoints {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 40px;
        }
        .endpoint {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 20px;
          border-radius: 12px;
          transition: all 0.3s;
        }
        .endpoint:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        .endpoint-name {
          font-weight: 600;
          margin-bottom: 8px;
        }
        .endpoint-path {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          opacity: 0.8;
        }
        .footer {
          margin-top: 40px;
          font-size: 14px;
          opacity: 0.7;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Antigravity</h1>
        <p class="subtitle">Resilient Deployment Demo</p>
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
          <p>Powered by Cloudflare Tunnel + Fly.io Fallback</p>
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
