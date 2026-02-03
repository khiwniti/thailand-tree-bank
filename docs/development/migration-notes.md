# Migration Notes

This document contains historical notes from the project's evolution from a LIFF starter template to the Thailand Tree Bank application.

## Project Evolution

### Original Structure (LIFF Starter)
The project started as a LINE LIFF v2 starter template with multiple framework examples:
- Vanilla JS
- Next.js
- Nuxt.js

### Migration to Tree Bank (2024-2026)
Evolved into a specific Thailand government application for carbon credit tracking with tree management.

### Key Migrations

**Backend Migration**
- Migrated from mock data to PostgreSQL with PostGIS
- Added Redis caching layer
- Implemented JWT authentication
- Integrated LINE ID Token verification

**AI Service Migration**
- Initial: Google Gemini only
- Added: OpenRouter as primary AI provider
- Gemini kept as fallback

**Deployment Migration**
- Initial: Netlify (static hosting)
- Migrated to: Northflank (containerized deployment)
- Supports: Docker-based deployment

**CDN Migration**
- Moved from self-hosted to CDN for static assets
- See CDN_MIGRATION_COMPLETE.md (archived)

## Archived Documentation

The following temporary documentation files have been archived into this consolidated guide:

- BACKEND_ERROR_FIX.md - Backend setup issues (resolved)
- CDN_MIGRATION_COMPLETE.md - CDN migration details
- DEPLOYMENT_CHECKLIST.md - Pre-deployment checklist
- DEPLOYMENT_GUIDE.md - General deployment guide
- EXECUTIVE_SUMMARY_TH.md - Thai language summary
- FINAL_STATUS.md - Project status snapshot
- IMPLEMENTATION_CHECKLIST.md - Feature implementation tracking
- MIGRATION_PLAN.md - Database migration planning
- OPENROUTER_MIGRATION.md - OpenRouter integration
- PROJECT_STATUS.md - Development progress
- READY_TO_DEPLOY.md - Deployment readiness check

## References

For current deployment procedures, see `docs/deployment/`
