# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the LINE LIFF v2 Starter repository - a collection of starter templates demonstrating how to integrate LINE's Front-end Framework (LIFF) into different development environments. The repository contains multiple independent applications:

**LIFF Starter Templates:**
- **Vanilla JS** (`src/vanilla/`): Basic LIFF integration using Webpack + Babel
- **Next.js** (`src/nextjs/`): React-based LIFF app using Next.js framework
- **Nuxt.js** (`src/nuxtjs/`): Vue-based LIFF app using Nuxt 3 framework

**Full Applications:**
- **LINE Mini App** (`src/line/`): Carbon credit tracking app with LIFF integration (React + Vite + LIFF + Gemini AI)
- **CarbonPlot** (`CarbonPlot/`): Standalone carbon credit tracking app (React + Vite + Gemini AI, no LIFF)

Each sub-project is independent with its own dependencies and build configuration.

## Key Commands

### Vanilla JS (`src/vanilla/`)
```bash
cd src/vanilla
npm install          # Install dependencies
npm run dev          # Start dev server (webpack-dev-server)
npm run build        # Build for production
```

Requires `LIFF_ID` environment variable set in `.env` file or via webpack's dotenv-webpack plugin.

### Next.js (`src/nextjs/`)
```bash
cd src/nextjs
npm install          # Install dependencies
npm run dev          # Start dev server on port 9000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

LIFF initialization happens in `pages/_app.js`. The LIFF ID must be set as `process.env.LIFF_ID`.

### Nuxt.js (`src/nuxtjs/`)
```bash
cd src/nuxtjs
yarn install         # Install dependencies
yarn dev             # Start dev server on localhost:3000
yarn build           # Build for production
yarn generate        # Generate static site
node .output/server/index.mjs  # Run production build
```

**Important**: Create a `.env` file in `src/nuxtjs/` with:
```
LIFF_ID=YOUR_LIFF_ID
```

The LIFF ID is accessed via Nuxt's runtimeConfig (see `nuxt.config.ts`). LIFF initialization occurs in the `<script setup>` section of `pages/index.vue` using Vue's `onMounted` hook.

### LINE Mini App (`src/line/`)
```bash
cd src/line
npm install          # Install dependencies
npm run dev          # Start Vite dev server on port 3000
npm run build        # Build for production
npm run preview      # Preview production build
```

**Important**: Create a `.env.local` file in `src/line/` with:
```
LIFF_ID=YOUR_LIFF_ID
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

This is a full-featured carbon credit tracking app with LIFF integration. It combines the CarbonPlot functionality with LINE's LIFF SDK for authentication and LINE platform integration.

### CarbonPlot (`CarbonPlot/`)
```bash
cd CarbonPlot
npm install          # Install dependencies
npm run dev          # Start Vite dev server on port 3000
npm run build        # Build for production
npm run preview      # Preview production build
```

Requires `GEMINI_API_KEY` in `.env.local` file. The app uses Google's Gemini AI for plot analysis. This is a standalone version without LIFF integration.

### Root Level
The root `package.json` contains minimal configuration. Most development happens in the subdirectories.

For Netlify deployment (vanilla version):
```bash
cd src/vanilla
LIFF_ID="your-liff-id" npm run build
netlify deploy       # Deploy draft
netlify deploy --prod  # Deploy to production
```

## Architecture

### LIFF Integration Pattern

All LIFF apps follow the same initialization pattern but implement it differently based on the framework:

1. **Vanilla JS**: Direct initialization in `index.js` on `DOMContentLoaded`
2. **Next.js**: Initialization in `_app.js` using React's `useEffect` hook, passing `liff` object to pages via props
3. **Nuxt.js**: Initialization in the page component using Vue's `onMounted` composable

The LIFF object (`@line/liff` v2.27.2) provides access to LINE platform APIs once initialized with a valid LIFF ID.

### Project Structure

```
.
├── src/
│   ├── vanilla/      # Standalone Webpack + Babel setup
│   ├── nextjs/       # Next.js 15 + React 18 app
│   ├── nuxtjs/       # Nuxt 3 + TypeScript app
│   └── line/         # LIFF-enabled carbon tracking app (React + Vite)
├── CarbonPlot/       # Standalone carbon tracking app (React + Vite)
├── netlify.toml      # Netlify deployment config (builds vanilla version)
└── README.md         # Main repository documentation
```

### CarbonPlot Architecture

Both CarbonPlot (standalone) and LINE Mini App (`src/line/`) share the same architecture for carbon credit tracking:

- **State Management**: React useState hooks for local state management
- **Mapping**: Uses Leaflet for interactive maps showing tree locations and plot boundaries
- **AI Integration**: Uses Google Gemini API via `services/geminiService.ts` for plot analysis
- **Components**:
  - `App.tsx`: Main application with tab navigation (map, list, stats, AI)
  - `PlotMap.tsx`: Leaflet map component with tree markers and boundary polygons
  - `TreeFormModal.tsx`: Form for adding/editing tree records
- **Data Model**: Defined in `types.ts` - includes Plot, Tree, TreeType, TreeStatus, PlotDocument types
- **Styling**: Uses Tailwind CSS utility classes (configured in Vite build)

The app calculates carbon credits using the formula: `healthy_trees × 9.5 kg/year` (see `CARBON_CREDIT_FACTOR` in `types.ts`).

The LINE Mini App (`src/line/`) additionally integrates LIFF SDK for LINE authentication and platform features.

## Environment Variables

Each project requires different environment variables:

**LIFF Starter Templates:**
- **Vanilla/Next.js/Nuxt.js**: `LIFF_ID` - Obtained from LINE Developers Console

**Full Applications:**
- **LINE Mini App** (`src/line/`):
  - `LIFF_ID` - Obtained from LINE Developers Console
  - `GEMINI_API_KEY` - Google Gemini API key
- **CarbonPlot**:
  - `GEMINI_API_KEY` - Google Gemini API key

Never commit `.env` or `.env.local` files to the repository.

## Development Notes

- The Next.js dev server runs on **port 9000** (not the default 3000) to avoid conflicts
- Vanilla JS dev server runs on **port 3000** (webpack-dev-server)
- CarbonPlot and LINE Mini App dev servers run on **port 3000** (Vite)
- Nuxt.js dev server runs on **port 3000** by default
- When working on LIFF apps, you need a valid LIFF ID from the LINE Developers Console
- LIFF apps must be accessed through LINE's in-app browser or LIFF browser for full functionality
- The vanilla version is configured for Netlify deployment via `netlify.toml`
- CarbonPlot and LINE Mini App share the same codebase architecture; LINE Mini App adds LIFF integration

## Testing LIFF Integration

To verify LIFF is working correctly:

1. Check browser console for "Success! you can do something with LIFF API here." (vanilla) or "LIFF init success" (Nuxt)
2. In Next.js, LIFF object is passed to page components via props: `const { liff, liffError } = props;`
3. In Nuxt.js, access LIFF directly after initialization: `liff.getVersion()`
4. LIFF API documentation: https://developers.line.biz/en/reference/liff

## Important Files

**LIFF Starter Templates:**
- `src/vanilla/index.js` - Vanilla LIFF initialization entry point
- `src/vanilla/webpack.config.js` - Webpack configuration with dotenv-webpack for env vars
- `src/nextjs/pages/_app.js` - Next.js LIFF initialization wrapper
- `src/nextjs/next.config.js` - Next.js configuration
- `src/nuxtjs/pages/index.vue` - Nuxt.js main page with LIFF initialization
- `src/nuxtjs/nuxt.config.ts` - Nuxt configuration with runtimeConfig for env vars

**Full Applications:**
- `src/line/App.tsx` - LINE Mini App main application with LIFF + carbon tracking
- `src/line/vite.config.ts` - Vite configuration with env var handling
- `CarbonPlot/App.tsx` - Standalone carbon tracking app (no LIFF)
- `CarbonPlot/services/geminiService.ts` - AI integration for plot analysis
- `src/line/services/geminiService.ts` - AI integration for LINE Mini App