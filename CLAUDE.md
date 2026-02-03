# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **Thailand Tree Bank** - a carbon credit tracking system built with LINE LIFF integration for government forestry departments. The repository contains two main applications:

**Applications:**
- **Frontend** (`frontend/`): LINE LIFF React application with full tree bank management features (React + Vite + LIFF + Leaflet + AI)
- **Backend** (`backend/`): Express.js REST API with PostgreSQL + Redis (Prisma ORM, JWT auth)

Each application is independent with its own dependencies and build configuration.

## Key Commands

### Root Level Commands
Convenience scripts to work with both frontend and backend:

```bash
# Development
npm run dev              # Run both frontend & backend concurrently
npm run dev:frontend     # Run frontend only (port 3000)
npm run dev:backend      # Run backend only (port 8080)

# Building
npm run build            # Build both applications
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Setup
npm run install:all      # Install dependencies for all projects
npm run clean            # Remove node_modules and dist from all projects

# Database (proxies to backend)
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database (development)
npm run db:migrate       # Run migrations (production)
npm run db:studio        # Open Prisma Studio GUI
```

### Frontend (`frontend/`)
LINE LIFF application with full tree bank features.

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start Vite dev server on port 3000
npm run build        # Build for production
npm run preview      # Preview production build
```

**Environment Setup:** Create `frontend/.env.local` with:
```env
VITE_LIFF_ID=your_liff_id_here
VITE_OPENROUTER_API_KEY=your_openrouter_key (optional, primary AI)
VITE_GEMINI_API_KEY=your_gemini_key (optional, fallback AI)
VITE_API_URL=http://localhost:8080
```

**Note:** The app uses OpenRouter AI as primary and Gemini as fallback. If neither is configured, AI analysis features will be disabled.

### Backend (`backend/`)
Express.js REST API with PostgreSQL and Redis.

```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server with auto-reload (port 8080)
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server

# Database commands
npm run db:generate  # Generate Prisma Client (run after schema changes)
npm run db:push      # Push schema to database (fast, for development)
npm run db:migrate   # Create and run migrations (for production)
npm run db:studio    # Open Prisma Studio GUI for data management
```

**Environment Setup:** Create `backend/.env` with:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/treebank?sslmode=require
REDIS_URL=redis://localhost:6379
REDIS_TLS=false
REDIS_SNI=
JWT_SECRET=your_jwt_secret_here
LINE_CHANNEL_SECRET=your_line_channel_secret
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:3000
PORT=8080
NODE_ENV=development
```

For production with Redis TLS:
```env
REDIS_URL=rediss://default:password@host:6379
REDIS_TLS=true
REDIS_SNI=your.redis.hostname
```

## Architecture

### Frontend Architecture (`frontend/`)

**Tech Stack:**
- React 19.2.4 with TypeScript 5.8.2
- Vite 6.2.0 for build tooling
- @line/liff 2.23.2 for LINE integration
- Leaflet 1.9.4 for interactive maps
- Recharts 3.7.0 for data visualization
- Tailwind CSS 4.x for styling
- Lucide React for icons

**Directory Structure:**
```
frontend/
├── components/
│   ├── PlotMap.tsx          # Leaflet map with tree markers
│   ├── TreeFormModal.tsx    # Tree CRUD form
│   └── SettingsModal.tsx    # User settings
├── hooks/
│   └── useLiff.ts           # LIFF authentication hook
├── services/
│   ├── geminiService.ts     # Google Gemini AI integration
│   └── openrouterService.ts # OpenRouter AI integration (primary)
├── utils/
│   └── landUnits.ts         # Thai land unit conversions
├── data/
│   └── mockData.ts          # Demo data generator
├── App.tsx                  # Main app with tab navigation
├── index.tsx                # Entry point with LIFF init
├── types.ts                 # TypeScript type definitions
└── vite.config.ts           # Vite config with env vars
```

**Key Components:**
- `App.tsx`: Main application container with 5 tabs (map, trees, stats, AI, settings)
- `PlotMap.tsx`: Leaflet map showing tree markers and plot boundaries
- `TreeFormModal.tsx`: Modal form for adding/editing trees with GPS integration
- `SettingsModal.tsx`: User preferences and account management
- `useLiff.ts`: Custom hook managing LIFF lifecycle (init, login, logout, profile)

**State Management:**
- React useState hooks for local component state
- No global state management library (Redux, Context, etc.)
- Data persisted in localStorage for offline capability
- Backend API integration for cloud sync (when available)

**LIFF Integration:**
- Initialization via `useLiff.ts` hook using React's useEffect
- Authentication: `liff.init()` → `liff.isLoggedIn()` → `liff.login()` → `liff.getProfile()`
- LINE features: sendMessages, shareTargetPicker, closeWindow
- Error handling for LIFF-specific errors
- Graceful degradation when not in LINE browser

**Carbon Credit Calculation:**
- Formula: `healthy_trees × 9.5 kg CO₂/year`
- Constant defined in `types.ts`: `CARBON_CREDIT_FACTOR = 9.5`
- Only counts trees with status = "Healthy"

**Thai Land Units:**
- Conversion utilities in `utils/landUnits.ts`
- 1 ไร่ (rai) = 1,600 m²
- 1 งาน (ngan) = 400 m²
- 1 ตารางวา (wa²) = 4 m²

### Backend Architecture (`backend/`)

**Tech Stack:**
- Express.js 4.x for HTTP server
- TypeScript 5.x for type safety
- Prisma 5.x as ORM
- PostgreSQL 15.x with PostGIS extension
- Redis 4.x for caching (optional)
- JWT for authentication
- Helmet for security headers
- Morgan for logging
- Compression for response optimization

**Directory Structure:**
```
backend/
├── src/
│   ├── routes/              # API route handlers
│   │   ├── auth.ts
│   │   ├── plots.ts
│   │   ├── trees.ts
│   │   ├── documents.ts
│   │   ├── carbon.ts
│   │   └── verifications.ts
│   ├── middleware/          # Express middleware
│   └── index.ts             # Server entry point
├── prisma/
│   └── schema.prisma        # Database schema definition
├── package.json
└── tsconfig.json
```

**API Architecture:**
- RESTful design with resource-based routes
- Route/Controller pattern
- Middleware chain: helmet → compression → morgan → cors → auth → routes
- Centralized error handling middleware
- Health check endpoint at `/health`

**Database Schema (Prisma):**
Key models in `backend/prisma/schema.prisma`:
- `User`: LINE users with JWT authentication
- `Plot`: Tree plots with GPS coordinates and Thai land units
- `Tree`: Individual trees with measurements and status
- `Document`: KML/KMZ files, land deeds, photos
- `Verification`: Third-party verification records

PostGIS extension used for spatial queries and GIS operations.

**Authentication Flow:**
1. Frontend gets LINE ID Token from LIFF SDK: `liff.getIDToken()`
2. Frontend sends token to `POST /api/auth/login`
3. Backend verifies token with LINE API
4. Backend creates/updates user in database
5. Backend issues JWT token with user ID
6. Frontend stores JWT and includes in all requests: `Authorization: Bearer {jwt}`
7. Backend middleware verifies JWT on protected routes

**Caching Strategy (Redis):**
- Session data (TTL: 24 hours)
- API responses (TTL: 5 minutes)
- Rate limiting counters
- Queue management for background jobs

If Redis is unavailable, the app continues without caching (graceful degradation).

### Data Model

**TypeScript Types** (defined in `frontend/types.ts`):

```typescript
enum TreeType { TEAK, MAHOGANY, RUBBER, OTHER }
enum TreeStatus { HEALTHY, DAMAGED, DEAD, MISSING }

interface Tree {
  id: string;
  lat: number;
  lng: number;
  type: TreeType;
  status: TreeStatus;
  plantedDate: string;
  dbhCm?: number;        // Diameter at Breast Height
  heightM?: number;      // Height in meters
  photoUrl?: string;
  notes?: string;
}

interface Plot {
  id: string;
  name: string;
  location: string;
  centerLat: number;
  centerLng: number;
  areaRai: number;       // Thai land units
  areaNgan?: number;
  areaWa?: number;
  areaSqm: number;       // Auto-calculated
  trees: Tree[];
  documents: PlotDocument[];
  boundary?: { lat: number; lng: number }[];
  status?: 'active' | 'pending' | 'verified' | 'suspended';
}

interface PlotDocument {
  id: string;
  name: string;
  size: string;
  type: 'kml' | 'kmz' | 'image' | 'pdf';
  uploadDate: string;
  status: 'processing' | 'verified' | 'error';
  url?: string;
}
```

**Database Models** (Prisma schema in `backend/prisma/schema.prisma`):
Similar structure but with database-specific features:
- Foreign keys and relationships
- Indexes for performance
- Spatial data types (PostGIS)
- Timestamps (createdAt, updatedAt)
- Soft deletes (deletedAt)

### LIFF Integration Pattern

All LIFF functionality is centralized in `frontend/hooks/useLiff.ts`.

**Initialization Flow:**
```typescript
// 1. Initialize LIFF
await liff.init({ liffId: import.meta.env.VITE_LIFF_ID })

// 2. Check login status
if (!liff.isLoggedIn()) {
  liff.login() // Redirects to LINE login
}

// 3. Get user profile
const profile = await liff.getProfile()

// 4. Get ID token for backend auth
const idToken = liff.getIDToken()
```

**LIFF API Usage:**
- `liff.init()`: Initialize LIFF SDK
- `liff.isLoggedIn()`: Check authentication status
- `liff.login()`: Trigger LINE login flow
- `liff.logout()`: Logout user
- `liff.getProfile()`: Get LINE user profile (userId, displayName, pictureUrl)
- `liff.getIDToken()`: Get JWT token for backend authentication
- `liff.closeWindow()`: Close LIFF browser
- `liff.sendMessages()`: Send messages to LINE chat
- `liff.shareTargetPicker()`: Share content to LINE friends/groups

**Testing LIFF Locally:**
LIFF apps must be accessed through LINE's in-app browser. For local development:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000

# Update LIFF Endpoint URL in LINE Developers Console with ngrok HTTPS URL
# Access app: https://liff.line.me/{YOUR_LIFF_ID}
```

**Browser Testing (Non-LIFF):**
The app can open in a regular browser but with limitations:
- No auto-login (shows login prompt)
- Some LIFF APIs unavailable
- Good for UI development and testing

## Development Workflow

### Starting Development

```bash
# From root directory
npm run install:all   # First time setup
npm run db:generate   # Setup Prisma Client
npm run db:push       # Initialize database
npm run dev           # Start both servers
```

### Making Database Changes

```bash
# 1. Edit backend/prisma/schema.prisma
# 2. Generate client
npm run db:generate

# 3. Push to database (dev)
npm run db:push

# OR create migration (prod)
cd backend
npm run db:migrate
```

### Working with Frontend

```bash
cd frontend
npm run dev           # Hot reload enabled

# The app will reload automatically when you edit:
# - Components (*.tsx)
# - Styles (*.css)
# - Types (types.ts)
```

### Working with Backend

```bash
cd backend
npm run dev           # Auto-reload with tsx watch

# Server restarts automatically when you edit:
# - Routes (src/routes/*.ts)
# - Middleware (src/middleware/*.ts)
# - Main server (src/index.ts)
```

### Testing API Endpoints

```bash
# Health check
curl http://localhost:8080/health

# Login (requires LINE ID token)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"lineIdToken": "..."}'

# Get plots (requires JWT)
curl http://localhost:8080/api/plots \
  -H "Authorization: Bearer {jwt_token}"
```

### Database Inspection

```bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# Access at http://localhost:5555
```

## Environment Variables

Never commit `.env` or `.env.local` files to the repository.

**Frontend** (`frontend/.env.local`):
- `VITE_LIFF_ID`: LINE LIFF ID from Developers Console (required)
- `VITE_OPENROUTER_API_KEY`: OpenRouter API key (optional, primary AI provider)
- `VITE_GEMINI_API_KEY`: Google Gemini API key (optional, fallback AI provider)
- `VITE_API_URL`: Backend API URL (optional, defaults to `http://localhost:8080`)

**Backend** (`backend/.env`):
- `DATABASE_URL`: PostgreSQL connection string with PostGIS (required)
- `REDIS_URL`: Redis connection string (optional)
- `REDIS_TLS`: Enable TLS for Redis (`true`/`false`)
- `REDIS_SNI`: Server Name Indication for Redis TLS
- `JWT_SECRET`: Secret for JWT token signing (required)
- `LINE_CHANNEL_SECRET`: LINE channel secret for token verification (required)
- `GEMINI_API_KEY`: Google Gemini API key (optional)
- `FRONTEND_URL`: Frontend URL for CORS (defaults to `http://localhost:3000`)
- `PORT`: Server port (defaults to 8080)
- `NODE_ENV`: Environment (`development`/`production`)

## Port Configuration

- Frontend: **3000** (Vite dev server)
- Backend: **8080** (Express server)
- Prisma Studio: **5555** (when running `npm run db:studio`)

## LIFF Setup Guide

### 1. Create LIFF App

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Create or select a Provider
3. Create a LIFF app:
   - **LIFF app name**: Thailand Tree Bank
   - **Size**: Full (full-screen mode)
   - **Endpoint URL**: `https://your-domain.com` (production) or ngrok URL (development)
   - **Scopes**: Select `profile` and `openid`
   - **Bot link feature**: Optional
4. Copy the LIFF ID (format: `xxxx-xxxxxxxx`)
5. Add to `frontend/.env.local` as `VITE_LIFF_ID`

### 2. Local Development with ngrok

```bash
# Start frontend
cd frontend && npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update LIFF Endpoint URL in LINE Developers Console
# Access app: https://liff.line.me/{YOUR_LIFF_ID}
```

### 3. Testing in LINE

Send this URL to yourself in LINE chat:
```
https://liff.line.me/{YOUR_LIFF_ID}
```

Or create a QR code and scan with LINE app.

## Important Files

**Frontend:**
- `frontend/App.tsx`: Main application component with tab navigation
- `frontend/index.tsx`: Entry point with LIFF initialization
- `frontend/types.ts`: TypeScript type definitions for entire app
- `frontend/hooks/useLiff.ts`: LIFF authentication lifecycle management
- `frontend/components/PlotMap.tsx`: Leaflet map component
- `frontend/components/TreeFormModal.tsx`: Tree creation/editing form
- `frontend/services/openrouterService.ts`: OpenRouter AI integration
- `frontend/services/geminiService.ts`: Gemini AI integration
- `frontend/utils/landUnits.ts`: Thai land unit conversion functions
- `frontend/vite.config.ts`: Vite configuration with env var handling
- `frontend/tailwind.config.js`: Tailwind CSS configuration

**Backend:**
- `backend/src/index.ts`: Express server entry point with middleware setup
- `backend/src/routes/`: API route definitions (auth, plots, trees, etc.)
- `backend/src/middleware/`: Authentication and error handling middleware
- `backend/prisma/schema.prisma`: Complete database schema

**Documentation:**
- `docs/development/setup.md`: Detailed development setup guide
- `docs/api/endpoints.md`: Complete API documentation
- `docs/deployment/northflank.md`: Deployment instructions
- `docs/development/migration-notes.md`: Historical project evolution

**Root Configuration:**
- `package.json`: Convenience scripts for monorepo-style development
- `.gitignore`: Git ignore patterns for all subdirectories
- `CLAUDE.md`: This file
- `README.md`: Main project documentation

## Deployment

### Frontend Deployment

**Netlify:**
```bash
cd frontend
npm run build
netlify deploy --dir=dist --prod
```

Set environment variables in Netlify Dashboard:
- `VITE_LIFF_ID`
- `VITE_OPENROUTER_API_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_API_URL` (your backend URL)

**Vercel:**
```bash
cd frontend
vercel --prod
```

Set the same environment variables in Vercel Dashboard.

**Docker:**
```bash
cd frontend
docker build -t tree-bank-frontend .
docker run -p 3000:80 tree-bank-frontend
```

The Dockerfile uses nginx to serve the static build.

### Backend Deployment

**Prerequisites:**
- PostgreSQL database with PostGIS extension
- Redis instance (optional but recommended)

**Deployment:**
```bash
cd backend
npm run build
npm start
```

**Docker:**
```bash
cd backend
docker build -t tree-bank-backend .
docker run -p 8080:8080 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  tree-bank-backend
```

**Northflank:**
Use the deployment script:
```bash
./scripts/deploy-northflank.sh
```

Or see `docs/deployment/northflank.md` for manual deployment steps.

## Testing

### Backend API Testing

```bash
# Health check
curl http://localhost:8080/health

# API info
curl http://localhost:8080/api

# Login test (requires valid LINE ID token)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"lineIdToken": "eyJhbGc..."}'

# Get plots (requires JWT from login response)
curl http://localhost:8080/api/plots \
  -H "Authorization: Bearer {jwt_token}"
```

### Frontend Testing

**LIFF Testing:**
1. Access via LINE: `https://liff.line.me/{YOUR_LIFF_ID}`
2. Verify LIFF initialization in console
3. Check login flow works
4. Test LINE profile display
5. Test GPS location access
6. Test tree creation/editing
7. Test carbon credit calculation
8. Test AI analysis (if API keys configured)

**Browser Testing (Non-LIFF):**
1. Open `http://localhost:3000` in browser
2. App works with limited features
3. Good for UI/UX development
4. Some LIFF APIs will not be available

### Database Testing

```bash
# Open Prisma Studio
npm run db:studio

# Access at http://localhost:5555
# Visual interface to view/edit database records
```

## Common Development Tasks

### Adding a New API Endpoint

1. Define route in `backend/src/routes/{resource}.ts`
2. Add authentication middleware if needed
3. Implement business logic
4. Update `docs/api/endpoints.md`
5. Test with curl or Postman

### Adding a New Frontend Component

1. Create component in `frontend/components/{ComponentName}.tsx`
2. Import and use in `App.tsx` or other components
3. Add TypeScript types if needed in `types.ts`
4. Style with Tailwind CSS utility classes

### Modifying Database Schema

1. Edit `backend/prisma/schema.prisma`
2. Run `npm run db:generate` to update Prisma Client
3. Run `npm run db:push` (dev) or `npm run db:migrate` (prod)
4. Update TypeScript types in `frontend/types.ts` if needed
5. Update API routes to handle new fields

### Adding AI Features

Both OpenRouter and Gemini are supported:

**OpenRouter** (Primary):
- Configure in `frontend/services/openrouterService.ts`
- Set `VITE_OPENROUTER_API_KEY` environment variable
- Supports multiple models (GPT-4, Claude, etc.)

**Gemini** (Fallback):
- Configure in `frontend/services/geminiService.ts`
- Set `VITE_GEMINI_API_KEY` environment variable
- Uses Gemini Pro model

The app automatically falls back to Gemini if OpenRouter is unavailable.

## Troubleshooting

### "LIFF ID not found" Error
- Check `frontend/.env.local` exists and contains `VITE_LIFF_ID`
- Restart Vite dev server after adding environment variables
- Verify LIFF ID format (should be like `2008934197-jM9Zoogn`)

### Database Connection Error
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `backend/.env`
- Ensure PostGIS extension is enabled: `CREATE EXTENSION postgis;`
- Run `npm run db:push` to sync schema

### Redis Connection Error
- Redis is optional, app works without it
- Check `REDIS_URL` in `backend/.env`
- For TLS, ensure `REDIS_TLS=true` and `REDIS_SNI` is set
- Check Redis is running: `redis-cli ping`

### GPS Not Working
- Must use HTTPS (LIFF provides this automatically)
- Grant location permissions in browser/app
- Test on real device, not emulator
- Check browser console for permission errors

### AI Analysis Not Working
- Verify API key is set in `frontend/.env.local`
- Check API quota (Gemini free tier: 15 requests/min)
- Check browser console for API errors
- Try fallback provider if primary fails

## Documentation

- **Development Guide**: `docs/development/setup.md`
- **API Reference**: `docs/api/endpoints.md`
- **Deployment Guide**: `docs/deployment/northflank.md`
- **Migration History**: `docs/development/migration-notes.md`
- **LIFF Documentation**: https://developers.line.biz/en/docs/liff/
- **Prisma Documentation**: https://www.prisma.io/docs/
