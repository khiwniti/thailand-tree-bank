# 🚨 Backend Deployment Error - Module Not Found

## Error Description

The backend is failing to start on Northflank with the following error:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/app/dist/routes/auth'
imported from /app/dist/index.js
```

## Root Cause

The backend uses **ES Modules** (`"module": "ESNext"` in tsconfig.json), but the import statements don't include `.js` extensions. When TypeScript compiles to JavaScript with ESM, Node.js requires explicit file extensions in import paths.

**Current code (src/index.ts):**
```typescript
import authRoutes from './routes/auth';  // ❌ Missing .js extension
```

**What Node.js needs:**
```typescript
import authRoutes from './routes/auth.js';  // ✅ Requires .js extension
```

## Quick Fix Options

### Option 1: Add .js Extensions (Recommended)

Update all imports in `backend/src/index.ts` to include `.js` extensions:

```typescript
// Auth routes
import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);

// Plot routes
import plotRoutes from './routes/plots.js';
app.use('/api/plots', plotRoutes);

// Tree routes
import treeRoutes from './routes/trees.js';
app.use('/api/trees', treeRoutes);

// Document routes
import documentRoutes from './routes/documents.js';
app.use('/api/documents', documentRoutes);

// Carbon routes
import carbonRoutes from './routes/carbon.js';
app.use('/api/carbon.js');

// Verification routes
import verificationRoutes from './routes/verifications.js';
app.use('/api/verifications', verificationRoutes);
```

### Option 2: Switch to CommonJS

Change `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",  // Changed from "ESNext"
    "lib": ["ES2020"],
    // ... rest of config
  }
}
```

Then imports can stay without extensions:
```typescript
import authRoutes from './routes/auth';  // Works with CommonJS
```

### Option 3: Use a Build Tool

Install `tsx` or `ts-node` with proper ESM support, but this adds complexity.

## Recommended Solution

**Use Option 1** - it's the cleanest and most compatible with modern Node.js:

1. Update all imports in `backend/src/index.ts` to add `.js` extensions
2. Commit and push
3. Northflank will auto-rebuild
4. Backend will start successfully

## Files to Update

Only **1 file** needs changes: `backend/src/index.ts`

Update lines:
- Line 89: `import authRoutes from './routes/auth.js';`
- Line 93: `import plotRoutes from './routes/plots.js';`
- Line 97: `import treeRoutes from './routes/trees.js';`
- Line 101: `import documentRoutes from './routes/documents.js';`
- Line 105: `import carbonRoutes from './routes/carbon.js';`
- Line 109: `import verificationRoutes from './routes/verifications.js';`

## Verification

After fixing, the backend should start with these logs:

```
[INFO] Starting container entrypoint...
[INFO] Successfully fetched environment variables.
✅ Connected to Redis
Server running on port 8080
```

Health check should return:
```bash
curl https://tree-bank-backend-xxx.northflank.app/health
# {"status":"OK","database":"connected","redis":"connected"}
```

## Why This Happened

TypeScript allows omitting `.js` extensions in imports because it resolves them during type-checking. However, when compiled to JavaScript and run with Node.js ESM, the runtime requires explicit extensions.

This is a known TypeScript/Node.js ESM quirk. See:
- https://www.typescriptlang.org/docs/handbook/esm-node.html
- https://github.com/microsoft/TypeScript/issues/16577

## Status

- ❌ Backend currently failing on Northflank
- ✅ Frontend works perfectly
- ✅ Dockerfiles are correct
- ✅ Environment variables configured
- ⚠️ Just need to update import paths

**Estimated fix time:** 5 minutes

---

*Last updated: 2026-02-02*
