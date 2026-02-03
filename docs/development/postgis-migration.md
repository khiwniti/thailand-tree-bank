# PostGIS Migration Guide

## Current Situation

✅ **Good News**: Railway has already provisioned **PostGIS** for your project!

```
Services Status:
├── PostGIS              ✅ SUCCESS (Running)
├── Postgres             ✅ SUCCESS (Running - possibly duplicate?)
├── Backend              ⏳ Building (needs env vars)
└── Frontend             ⏳ Building (needs env vars)
```

## What is PostGIS?

**PostGIS** = **PostgreSQL** + **Geographic Information System (GIS) Extensions**

PostGIS is a **superset** of PostgreSQL, meaning:
- ✅ All PostgreSQL features work exactly the same
- ✅ Plus additional spatial/geographic capabilities
- ✅ No migration needed from regular Prisma schema
- ✅ Your existing code works without changes

## Do You Need to Migrate?

**Short Answer: NO!**

PostGIS already includes all standard PostgreSQL functionality. Your Prisma schema works as-is.

### What PostGIS Adds:

```sql
-- Standard PostgreSQL (works in PostGIS)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT
);

-- PostGIS-specific (spatial features)
CREATE TABLE trees (
  id SERIAL PRIMARY KEY,
  location GEOGRAPHY(POINT, 4326),  -- GPS coordinates
  boundary GEOGRAPHY(POLYGON, 4326)  -- Plot boundaries
);

-- PostGIS functions
SELECT ST_Distance(tree1.location, tree2.location)
FROM trees tree1, trees tree2;
```

## Your Current Setup

### Backend Prisma Schema
Your schema likely uses standard types:
```prisma
model Tree {
  id          String   @id @default(uuid())
  lat         Float    // Standard PostgreSQL DOUBLE PRECISION
  lng         Float    // Works perfectly in PostGIS
  type        String
  status      String
  plantedDate DateTime
}
```

This works **perfectly** in PostGIS! No changes needed.

### Future: Using PostGIS Features (Optional)

If you want to use spatial features later, you can:

```prisma
model Tree {
  id       String @id @default(uuid())
  // Option 1: Keep as separate lat/lng (current - works fine)
  lat      Float
  lng      Float

  // Option 2: Use PostGIS POINT type (advanced)
  // location Unsupported("GEOGRAPHY(POINT, 4326)")
}
```

## Railway Setup

### Check Your Databases

```bash
railway service status --all
```

You have:
1. **PostGIS** - ✅ Use this one (includes everything)
2. **Postgres** - ❓ Might be extra

### Using PostGIS Database

Railway automatically sets `DATABASE_URL` when you add PostGIS. Check with:

```bash
railway variables | grep DATABASE_URL
```

The URL will look like:
```
postgresql://user:pass@host:port/railway?sslmode=require
```

This connection includes PostGIS extensions automatically!

## Verify PostGIS is Working

### Option 1: Via Railway CLI

```bash
railway run --service thailand-tree-bank-backend psql $DATABASE_URL -c "SELECT PostGIS_Version();"
```

Expected output:
```
     postgis_version
─────────────────────────
 3.4 USE_GEOS=1 USE_PROJ=1 ...
```

### Option 2: Via Your Backend Code

Add this test endpoint to `backend/src/index.ts`:

```typescript
app.get('/api/test/postgis', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT PostGIS_Version()`;
    res.json({
      postgis: result,
      message: 'PostGIS is working!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Test: `curl https://your-backend.railway.app/api/test/postgis`

## Enable PostGIS Extension (If Needed)

PostGIS extension should be auto-enabled, but if not:

```bash
railway run --service thailand-tree-bank-backend psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

## Database Migration Steps

### 1. Generate Prisma Client

```bash
cd backend
npx prisma generate
```

### 2. Push Schema to PostGIS Database

```bash
# For development (quick)
railway run --service thailand-tree-bank-backend npx prisma db push

# For production (with migrations)
railway run --service thailand-tree-bank-backend npx prisma migrate deploy
```

### 3. Verify Tables Created

```bash
railway run --service thailand-tree-bank-backend psql $DATABASE_URL -c "\dt"
```

Should show your tables: User, Plot, Tree, Document, etc.

## Troubleshooting

### Error: "PostGIS extension not found"

```bash
railway run --service thailand-tree-bank-backend psql $DATABASE_URL << 'EOF'
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
EOF
```

### Error: "relation does not exist"

Run migrations:
```bash
railway run --service thailand-tree-bank-backend npx prisma db push
```

### Multiple Postgres Instances

If you have both "PostGIS" and "Postgres":
1. Use **PostGIS** (it's better)
2. Delete the regular Postgres from Railway dashboard
3. DATABASE_URL will automatically update

## Summary

### ✅ What You Have:
- PostGIS database running on Railway
- DATABASE_URL automatically configured
- Ready for your Prisma schema

### ✅ What You Need to Do:
1. Set environment variables (JWT_SECRET, etc.)
2. Run `prisma db push` or `prisma migrate deploy`
3. Your app will work!

### ✅ What You DON'T Need:
- ❌ No migration from PostgreSQL to PostGIS
- ❌ No schema changes required
- ❌ No data migration needed (PostGIS is PostgreSQL++)

## Quick Commands

```bash
# Check PostGIS version
railway run --service thailand-tree-bank-backend psql $DATABASE_URL -c "SELECT PostGIS_Version();"

# Enable PostGIS (if needed)
railway run --service thailand-tree-bank-backend psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# Run migrations
railway run --service thailand-tree-bank-backend npx prisma migrate deploy

# View database in Prisma Studio (local)
cd backend
DATABASE_URL=$(railway variables get DATABASE_URL --service thailand-tree-bank-backend) npx prisma studio
```

---

**TL;DR**: PostGIS = PostgreSQL + Spatial Features. Your code works as-is. No migration needed! 🎉
