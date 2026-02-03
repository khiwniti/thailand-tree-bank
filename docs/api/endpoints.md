# API Endpoints Documentation

Base URL: `http://localhost:8080` (development) or `https://backend--thailand-tree-bank.code.run` (production)

## Health Check

### GET /health
Check API and database health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-02-03T04:00:00.000Z",
  "database": "connected",
  "redis": "connected",
  "version": "1.0.0"
}
```

## Authentication

### POST /api/auth/login
Login with LINE ID Token.

**Request:**
```json
{
  "lineIdToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "lineId": "U1234567890",
    "displayName": "John Doe",
    "pictureUrl": "https://..."
  }
}
```

### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "id": "user_id",
  "lineId": "U1234567890",
  "displayName": "John Doe",
  "pictureUrl": "https://..."
}
```

### POST /api/auth/logout
Logout current user.

## Plots

### GET /api/plots
Get all plots for authenticated user.

**Response:**
```json
[
  {
    "id": "plot_id",
    "name": "Plot 1",
    "location": "Bangkok",
    "centerLat": 13.7563,
    "centerLng": 100.5018,
    "areaRai": 5,
    "trees": [],
    "status": "active"
  }
]
```

### GET /api/plots/:id
Get plot by ID.

### POST /api/plots
Create new plot.

**Request:**
```json
{
  "name": "New Plot",
  "location": "Bangkok",
  "centerLat": 13.7563,
  "centerLng": 100.5018,
  "areaRai": 5,
  "areaNgan": 0,
  "areaWa": 0
}
```

### PUT /api/plots/:id
Update plot.

### DELETE /api/plots/:id
Delete plot.

## Trees

### POST /api/trees
Add tree to plot.

**Request:**
```json
{
  "plotId": "plot_id",
  "lat": 13.7563,
  "lng": 100.5018,
  "type": "Teak",
  "status": "Healthy",
  "plantedDate": "2024-01-01",
  "dbhCm": 15.5,
  "heightM": 8.2
}
```

### POST /api/trees/batch
Batch add trees (for offline sync).

### PUT /api/trees/:id
Update tree.

### DELETE /api/trees/:id
Delete tree.

### GET /api/trees/:id/history
Get tree growth history.

## Carbon Credits

### GET /api/carbon/plots/:plotId
Calculate carbon credits for plot.

**Response:**
```json
{
  "plotId": "plot_id",
  "healthyTrees": 150,
  "carbonKgPerYear": 1425.0,
  "estimatedValue": 142500
}
```

## Documents

### POST /api/documents/upload
Upload document (KML, KMZ, image, PDF).

**Request:** multipart/form-data

### POST /api/documents/:id/ocr
Process document with OCR (Thai land deeds).

## Verifications

### POST /api/verifications
Create verification request.

### GET /api/verifications/:id
Get verification status.

## Error Responses

All endpoints may return these error responses:

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```
