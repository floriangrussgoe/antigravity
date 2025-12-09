# Antigravity - Staged Failover Deployment

## 🎯 Current Stage: Stage 1 (Client-Side Failover)

**Cost:** $0/month  
**Capacity:** Unlimited requests  
**Status:** ✅ Active

## 📊 Upgrade Path

### Stage 1: Client-Side Failover (ACTIVE)
- **Cost:** $0/month
- **Capacity:** Unlimited
- **Latency:** ~50-100ms (client-side logic)
- **Best for:** 1-100 users, < 50k requests/day

### Stage 2: Cloudflare Workers (READY)
- **Cost:** $0/month (up to 100k requests/day)
- **Capacity:** 100,000 requests/day
- **Latency:** ~10-20ms (edge-based)
- **Best for:** 100-500 users, 50k-100k requests/day
- **Status:** 🟡 Ready to deploy (currently deactivated)

### Stage 3: Workers Paid (AVAILABLE)
- **Cost:** $5/month
- **Capacity:** 10,000,000 requests/day
- **Latency:** ~10-20ms (edge-based)
- **Best for:** 500+ users, > 100k requests/day
- **Status:** ⚪ Available on demand

## 🚀 Quick Start

### Deploy Stage 1 (Current)

```bash
cd antigravity

# 1. Create GitHub repository
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/antigravity.git
git push -u origin main

# 2. Enable GitHub Pages
# Go to Settings → Pages → Source: GitHub Actions

# 3. Start local backend
docker-compose up -d antigravity

# 4. Setup Cloudflare Tunnel
cloudflared tunnel create antigravity-api
cp ~/.cloudflared/<TUNNEL_ID>.json cloudflare/credentials.json
# Update cloudflare/tunnel-config.yml with your tunnel ID
cloudflared tunnel route dns antigravity-api api.antigravity.yourdomain.com
docker-compose up -d cloudflared

# 5. Deploy Fly.io fallback
cd antigravity
fly launch --name antigravity-fallback --region fra
fly deploy --dockerfile Dockerfile.fallback

# Done! Visit: https://yourusername.github.io/antigravity
```

## 📈 When to Upgrade

### Upgrade to Stage 2 (Cloudflare Workers) when:
- ✅ Traffic consistently > 50k requests/day
- ✅ You see the traffic warning in the dashboard
- ✅ You want faster failover (< 20ms vs ~100ms)
- ✅ You want centralized health checking

### Upgrade to Stage 3 (Workers Paid) when:
- ✅ Traffic consistently > 100k requests/day
- ✅ You have 200+ Betreuungen
- ✅ You need guaranteed capacity

## 🔄 How to Upgrade to Stage 2

```bash
cd antigravity/cloudflare-worker

# 1. Install Wrangler
npm install -g wrangler

# 2. Login
wrangler login

# 3. Update api-router.js
# Replace: YOUR_TUNNEL_ID with your actual tunnel ID

# 4. Deploy
wrangler deploy api-router.js --name antigravity-api

# 5. Update DNS
# Change: api.antigravity.yourdomain.com
# From: tunnel-id.cfargotunnel.com
# To: antigravity-api.your-subdomain.workers.dev

# 6. Update frontend
# Change API_BASE_URL to worker URL
# Or keep same domain (DNS handles routing)

# Done! You're now on Stage 2
```

## 📊 Traffic Monitoring

The frontend automatically tracks:
- **Total Requests:** All API calls
- **Success Rate:** % of successful requests
- **Active Endpoint:** Primary or Fallback
- **Estimated Daily Traffic:** Projected requests/day

**Warning Threshold:** 80,000 requests/day (80% of free tier)

## 💰 Cost Comparison

| Stage | Monthly Cost | Requests/Day | Best For |
|-------|-------------|--------------|----------|
| **Stage 1** | $0 | Unlimited | 1-100 users |
| **Stage 2** | $0 | 100,000 | 100-500 users |
| **Stage 3** | $5 | 10,000,000 | 500+ users |

## 🎯 Current Setup

```
Frontend: GitHub Pages (Free)
    ↓
Stage 1: Client-Side Failover (Active)
    ↓
Primary: Cloudflare Tunnel → Local Docker
    ↓
Fallback: Fly.io (Free)

Total Cost: $0/month ✅
```

## 📝 Files Structure

```
antigravity/
├── frontend/
│   └── index.html              # Stage 1 (Active)
├── cloudflare-worker/
│   └── api-router.js           # Stage 2 (Ready, deactivated)
├── server.js                   # Primary API
├── server.fallback.js          # Fallback API
├── docker-compose.yml          # Local deployment
└── fly.toml                    # Fallback deployment
```

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] GitHub Pages enabled
- [ ] Local backend running
- [ ] Cloudflare Tunnel configured
- [ ] Fly.io fallback deployed
- [ ] DNS records configured
- [ ] Frontend accessible
- [ ] API health checks passing
- [ ] Failover tested

## 🔍 Testing

### Test Failover
```bash
# 1. Visit frontend
https://yourusername.github.io/antigravity

# 2. Click "Test /health" - should work (Primary)

# 3. Stop local Docker
docker-compose down

# 4. Click "Test /health" again - should work (Fallback)

# 5. Restart Docker
docker-compose up -d

# 6. Click "Test /health" - should work (Primary again)
```

### Monitor Traffic
1. Visit frontend
2. Use API for normal operations
3. Check "Total Requests" counter
4. Watch for traffic warning banner

## 🎉 You're All Set!

Your Antigravity deployment is now:
- ✅ **100% Free** (Stage 1)
- ✅ **Resilient** (automatic failover)
- ✅ **Scalable** (ready to upgrade)
- ✅ **Monitored** (traffic warnings)

**Next Steps:**
1. Deploy to production
2. Monitor traffic
3. Upgrade when needed

---

**Questions?** Check the implementation plan or walkthrough docs.
