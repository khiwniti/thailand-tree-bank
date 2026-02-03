# Northflank Deployment Guide

This guide consolidates all Northflank deployment documentation.

## Quick Reference

- **Frontend URL**: https://frontend--thailand-tree-bank.code.run
- **Backend URL**: https://backend--thailand-tree-bank.code.run
- **Database**: PostgreSQL with PostGIS
- **Cache**: Redis with TLS

## Deployment Steps

1. **Build Docker Images**
   ```bash
   # Build frontend
   cd frontend
   docker build -t tree-bank-frontend .
   
   # Build backend
   cd backend
   docker build -t tree-bank-backend .
   ```

2. **Configure Environment Variables**
   
   Frontend:
   - `VITE_LIFF_ID`
   - `VITE_OPENROUTER_API_KEY`
   - `VITE_GEMINI_API_KEY`
   - `VITE_API_URL`
   
   Backend:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `REDIS_TLS`
   - `REDIS_SNI`
   - `JWT_SECRET`
   - `LINE_CHANNEL_SECRET`
   - `GEMINI_API_KEY`
   - `FRONTEND_URL`

3. **Deploy with Script**
   ```bash
   ./scripts/deploy-northflank.sh
   ```

## Configuration Files

- `northflank.yaml` - Northflank configuration
- `northflank.json` - Northflank project settings

## Notes

- Frontend runs on port 80 (nginx)
- Backend runs on port 8080 (Express)
- Database uses PostGIS extension for spatial data
- Redis uses TLS with SNI for secure connection

For detailed historical notes, see migration-notes.md in development/.
