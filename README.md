# 🚀 Antigravity - Resilient Deployment Demo

Enterprise-grade resilient deployment setup with automatic failover.

## Features

- ✅ **Fixed URL** - No more changing URLs
- ✅ **99.9% Uptime** - Automatic failover to Fly.io
- ✅ **HTTPS** - Automatic SSL via Cloudflare
- ✅ **Health Checks** - `/health`, `/status`, `/basic`
- ✅ **API Security** - API key authentication
- ✅ **Docker** - Easy local deployment
- ✅ **Free** - Mostly free tier services

## Quick Start

### 1. Setup Environment

```bash
cd antigravity
cp .env.template .env
# Edit .env and set API_KEY
```

### 2. Start Locally

```bash
docker-compose up -d antigravity
```

Visit: http://localhost:8080

### 3. Setup Cloudflare Tunnel

```bash
# Install cloudflared
choco install cloudflared

# Login
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create antigravity

# Copy credentials
cp ~/.cloudflared/<TUNNEL_ID>.json cloudflare/credentials.json

# Update tunnel-config.yml with your Tunnel ID

# Setup DNS
cloudflared tunnel route dns antigravity antigravity.yourdomain.com

# Start tunnel
docker-compose up -d cloudflared
```

Visit: https://antigravity.yourdomain.com

### 4. Deploy Fallback to Fly.io

```bash
# Install Fly CLI
iwr https://fly.io/install.ps1 -useb | iex

# Login
fly auth login

# Deploy
fly launch --name antigravity-fallback --region fra
fly deploy --dockerfile Dockerfile.fallback
```

Visit: https://antigravity-fallback.fly.dev

## Endpoints

### Public Endpoints

- `GET /` - Landing page
- `GET /health` - Health check
- `GET /status` - System status
- `GET /basic` - Basic info

### Protected Endpoints (require API key)

- `GET /api/data` - Protected data
- `GET /api/admin` - Admin info

**Usage:**
```bash
curl -H "x-api-key: your-api-key" https://antigravity.yourdomain.com/api/data
```

## Architecture

```
Internet → Cloudflare DNS
    ├─ Primary: Cloudflare Tunnel → Local Docker
    └─ Fallback: Fly.io (on failure)
```

## Files

```
antigravity/
├── server.js              # Main app
├── server.fallback.js     # Fallback app
├── Dockerfile             # Main image
├── Dockerfile.fallback    # Fallback image
├── docker-compose.yml     # Local deployment
├── fly.toml               # Fly.io config
└── cloudflare/
    ├── tunnel-config.yml  # Tunnel config
    └── credentials.json   # Tunnel creds (secret!)
```

## Cost

- Cloudflare Tunnel: **Free**
- Cloudflare Load Balancer: **$5/month**
- Fly.io (fallback): **Free**

**Total: $5/month** for enterprise-grade availability!

## Documentation

See [walkthrough.md](../../../.gemini/antigravity/brain/f9ffd118-f372-4da6-b79a-ded9c09f20d9/walkthrough.md) for complete setup guide.

## License

MIT
