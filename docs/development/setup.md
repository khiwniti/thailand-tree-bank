# Development Setup Guide

## Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- PostgreSQL with PostGIS (for backend)
- Redis (optional, for backend caching)
- LINE Developers Account
- Google Gemini API Key (optional for AI features)

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/line/line-liff-v2-starter.git
cd line-liff-v2-starter
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm run install:all

# Or install individually
cd frontend && npm install
cd ../backend && npm install
```

### 3. Configure Environment Variables

**Frontend** (`frontend/.env.local`):
```env
VITE_LIFF_ID=your_liff_id_here
VITE_OPENROUTER_API_KEY=your_openrouter_key (optional)
VITE_GEMINI_API_KEY=your_gemini_key (optional)
VITE_API_URL=http://localhost:8080
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/treebank
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
LINE_CHANNEL_SECRET=your_line_channel_secret
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:3000
PORT=8080
NODE_ENV=development
```

### 4. Setup Database

```bash
cd backend
npm run db:generate
npm run db:push
```

### 5. Run Development Servers

```bash
# Run both (from root)
npm run dev

# Or run individually
npm run dev:frontend   # Runs on port 3000
npm run dev:backend    # Runs on port 8080
```

## LIFF Setup

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Create or select a Provider
3. Create a LIFF app:
   - **Name**: Thailand Tree Bank
   - **Size**: Full
   - **Endpoint URL**: `https://your-ngrok-url.ngrok.io` (for local dev)
   - **Scopes**: profile, openid
4. Copy LIFF ID and add to `frontend/.env.local`

### Local LIFF Testing with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Run ngrok
ngrok http 3000

# Copy the HTTPS URL and update LIFF Endpoint URL in LINE Console
```

## Project Structure

```
thailand-tree-bank/
├── frontend/          # LINE LIFF React app
├── backend/           # Express.js REST API
├── docs/              # Documentation
├── scripts/           # Utility scripts
└── .github/           # GitHub templates
```

## Troubleshooting

See `docs/development/troubleshooting.md`
