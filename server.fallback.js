const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

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
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Antigravity - Maintenance Mode</title>
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
          max-width: 600px;
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 60px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .icon { font-size: 64px; margin-bottom: 24px; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        h1 { font-size: 32px; margin-bottom: 16px; }
        .status { color: #fbbf24; font-size: 18px; font-weight: 600; margin-bottom: 24px; }
        p { opacity: 0.9; line-height: 1.6; margin-bottom: 16px; }
        .badge {
          display: inline-block;
          background: rgba(251, 191, 36, 0.2);
          border: 1px solid rgba(251, 191, 36, 0.3);
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 14px;
          margin-top: 24px;
        }
        .timestamp { margin-top: 40px; font-size: 12px; opacity: 0.7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🔧</div>
        <h1>Antigravity</h1>
        <p class="status">System Maintenance</p>
        <p>Our primary system is temporarily unavailable.</p>
        <p>We're working on restoring full access.</p>
        <p>Please try again in a few minutes.</p>
        <div class="badge">Fallback Mode Active</div>
        <p class="timestamp">Status: ${new Date().toLocaleString()}</p>
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
