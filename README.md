# 🌳 Thailand Tree Bank

> **Carbon Credit Tracking System** for Thailand's Forest Conservation Program

A comprehensive tree bank management system built with LINE LIFF integration for government forestry departments to track, manage, and calculate carbon credits from tree plantations.

[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![LINE LIFF](https://img.shields.io/badge/LINE_LIFF-2.23.2-00B900?logo=line)](https://developers.line.biz/en/docs/liff/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791?logo=postgresql)](https://www.postgresql.org/)

---

## ✨ Features

- 🔐 **LINE Authentication** - Seamless login via LINE account
- 📍 **GPS Tree Mapping** - High-precision GPS tagging (±2m accuracy)
- 💚 **Carbon Credit Calculation** - Automatic calculation (9.5 kg CO₂/tree/year)
- 🤖 **AI Analysis** - Plot analysis with OpenRouter/Gemini AI
- 📁 **Document Management** - Land deeds, aerial photos, KML/KMZ files
- 🇹🇭 **Thai Language & Units** - Full Thai language support (ไร่-งาน-วา)
- 📱 **Mobile-First Design** - Optimized for mobile devices
- 🗺️ **Interactive Maps** - Leaflet-based mapping with boundaries

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- PostgreSQL with PostGIS extension
- LINE Developers Account
- (Optional) Redis for caching
- (Optional) Google Gemini API Key for AI features

### Installation

```bash
# Clone the repository
git clone https://github.com/khiwniti/thailand-tree-bank.git
cd thailand-tree-bank

# Install all dependencies
npm run install:all

# Configure environment variables (see below)

# Setup database
npm run db:generate
npm run db:push

# Run development servers (frontend + backend)
npm run dev
```

The frontend will run on `http://localhost:3000` and backend on `http://localhost:8080`.

---

## ⚙️ Configuration

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
VITE_LIFF_ID=your_liff_id_here
VITE_OPENROUTER_API_KEY=your_openrouter_key (optional)
VITE_GEMINI_API_KEY=your_gemini_key (optional)
VITE_API_URL=http://localhost:8080
```

### Backend Environment Variables

Create `backend/.env`:

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

### LIFF Setup

1. Visit [LINE Developers Console](https://developers.line.biz/console/)
2. Create a LIFF app:
   - **Name**: Thailand Tree Bank
   - **Size**: Full
   - **Endpoint URL**: Your deployment URL (or ngrok for local dev)
   - **Scopes**: `profile`, `openid`
3. Copy the LIFF ID to `frontend/.env.local`

For local testing with LINE, use [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
# Update LIFF Endpoint URL with the ngrok HTTPS URL
```

---

## 📁 Project Structure

```
thailand-tree-bank/
├── frontend/              # LINE LIFF React Application
│   ├── src/
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and AI services
│   ├── utils/             # Utility functions
│   └── ...
├── backend/               # Express.js REST API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Auth & error handling
│   ├── prisma/            # Database schema
│   └── ...
├── docs/                  # Documentation
│   ├── deployment/        # Deployment guides
│   ├── development/       # Development setup
│   └── api/               # API documentation
├── scripts/               # Utility scripts
└── .github/               # GitHub templates
```

---

## 🛠️ Available Scripts

### Root Level

```bash
npm run dev              # Run both frontend & backend
npm run dev:frontend     # Run frontend only (port 3000)
npm run dev:backend      # Run backend only (port 8080)
npm run build            # Build both applications
npm run install:all      # Install all dependencies
npm run clean            # Clean node_modules and build artifacts

# Database scripts
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database (dev)
npm run db:migrate       # Run migrations (production)
npm run db:studio        # Open Prisma Studio GUI
```

### Frontend (in `frontend/` directory)

```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Backend (in `backend/` directory)

```bash
npm run dev              # Start with auto-reload
npm run build            # Compile TypeScript
npm start                # Run production server
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to DB
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
```

---

## 🎯 Key Features Explained

### Carbon Credit Calculation

The system automatically calculates carbon credits based on the formula:

```
Carbon Credits (kg CO₂/year) = Healthy Trees × 9.5 kg
```

This follows international forestry carbon sequestration standards.

### Thai Land Units

The system supports Thailand's traditional land measurement units:
- **1 ไร่ (rai)** = 1,600 m²
- **1 งาน (ngan)** = 400 m² (1 ไร่ = 4 งาน)
- **1 ตารางวา (wa²)** = 4 m² (1 งาน = 100 วา)

All conversions are handled automatically.

### GPS Tree Mapping

- Uses browser geolocation API
- ±2 meter accuracy with modern devices
- Works with LIFF's location API on mobile
- Interactive Leaflet maps with markers and boundaries

### AI Analysis

- **Primary**: OpenRouter (configurable models)
- **Fallback**: Google Gemini AI
- Provides plot health analysis and recommendations
- Analyzes tree distribution and growth patterns

---

## 📚 Documentation

- **[Development Setup](docs/development/setup.md)** - Detailed setup instructions
- **[API Documentation](docs/api/endpoints.md)** - Complete API reference
- **[Deployment Guide](docs/deployment/northflank.md)** - Deployment instructions
- **[Migration Notes](docs/development/migration-notes.md)** - Historical context

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build images
docker build -t tree-bank-frontend ./frontend
docker build -t tree-bank-backend ./backend

# Run containers
docker run -p 3000:80 tree-bank-frontend
docker run -p 8080:8080 tree-bank-backend
```

### Platform Deployment

The application is configured for deployment on:
- **Northflank** (recommended) - See `docs/deployment/northflank.md`
- **Vercel/Netlify** (frontend only)
- **Railway/Render** (backend)

See `docs/deployment/` for detailed deployment guides.

---

## 🧪 Testing

### Backend API Testing

```bash
# Health check
curl http://localhost:8080/health

# Test authentication
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"lineIdToken": "your_line_id_token"}'
```

### LIFF Testing

1. Access via LINE: `https://liff.line.me/{YOUR_LIFF_ID}`
2. Send the URL to yourself in LINE chat
3. Tap to open in LINE's browser
4. Grant permissions when prompted

---

## 🤝 Contributing

This is a government project for Thailand's Forest Conservation Program.

For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

Copyright © 2026 Thailand Tree Bank Project

Licensed under the Apache License, Version 2.0. See [LICENSE.txt](LICENSE.txt) for details.

---

## 🙏 Acknowledgments

- **LINE Corporation** - LIFF Platform
- **Google** - Gemini AI
- **OpenStreetMap** - Mapping data
- **Thailand Forestry Department** - Domain expertise and requirements

---

## 📞 Support

- **Documentation**: See `docs/` directory
- **Technical Issues**: Create an issue on GitHub
- **LIFF Support**: [LINE Developers Forum](https://www.line-community.me/)

---

**Built with ❤️ for Thailand's Forest Conservation**

🌳 **ปลูกต้นไม้วันนี้ เพื่ออากาศที่ดีในวันพรุ่งนี้**
