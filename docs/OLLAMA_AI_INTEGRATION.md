# Ollama AI Integration Guide

## Overview

The Thailand Tree Bank system has been enhanced with **Ollama AI integration** for intelligent forest plot analysis. This provides self-hosted, privacy-focused AI capabilities without dependency on external API services.

## Architecture

### System Flow

```
Frontend (React)
    ↓
Backend API (/api/ai/*)
    ↓
Ollama Server (Railway)
    ↓
LLaMA 3.2 Model
```

### Key Components

1. **Frontend Service** (`frontend/services/ollamaService.ts`)
   - Calls backend AI API
   - Handles errors gracefully
   - Provides connection testing utilities

2. **Backend AI Route** (`backend/src/routes/ai.ts`)
   - RESTful API for AI operations
   - Communicates with Ollama server
   - Supports multiple analysis types
   - Caching-ready (Redis integration)

3. **Ollama Server** (Railway deployment)
   - Self-hosted LLM instance
   - Running LLaMA 3.2 model
   - OpenAI-compatible API

## Configuration

### Environment Variables

#### Backend (`backend/.env`)

```env
# Ollama Configuration
OLLAMA_API_URL=https://ollama-production-c85b.up.railway.app/api/chat
OLLAMA_MODEL=llama3.2
```

#### Frontend (`frontend/.env.local`)

```env
# Backend API URL
VITE_API_URL=http://localhost:8080
```

For production, set `VITE_API_URL` to your deployed backend URL.

## API Endpoints

### 1. Analyze Plot

**POST** `/api/ai/analyze`

Analyze a forest plot and provide expert recommendations.

**Request Body:**
```json
{
  "plot": {
    "id": "p1",
    "name": "แปลง A",
    "centerLat": 18.7883,
    "centerLng": 98.9853,
    "areaRai": 5,
    "areaSqm": 8000,
    "trees": [...],
    "documents": [...]
  },
  "analysisType": "comprehensive"
}
```

**Analysis Types:**
- `comprehensive` - Full analysis with all sections (default)
- `quick` - Quick summary with top 3 recommendations
- `financial` - Focus on ROI and carbon credit valuation
- `health` - Focus on tree health and disease diagnosis

**Response:**
```json
{
  "success": true,
  "analysis": "📊 ประเมินสุขภาพป่า...",
  "metadata": {
    "model": "llama3.2",
    "analysisType": "comprehensive",
    "timestamp": "2024-02-03T10:30:00Z",
    "statistics": {
      "totalTrees": 50,
      "healthyTrees": 42,
      "damagedTrees": 5,
      "deadTrees": 3,
      "healthRate": "84.0%",
      "carbonCredits": "399.00 kg CO₂/year"
    }
  }
}
```

### 2. Health Check

**GET** `/api/ai/health`

Check Ollama service connectivity and available models.

**Response:**
```json
{
  "success": true,
  "status": "connected",
  "url": "https://ollama-production-c85b.up.railway.app/api/chat",
  "currentModel": "llama3.2",
  "availableModels": [
    {
      "name": "llama3.2:latest",
      "size": 4700000000,
      "modified": "2024-01-15T10:00:00Z"
    }
  ],
  "timestamp": "2024-02-03T10:30:00Z"
}
```

### 3. List Models

**GET** `/api/ai/models`

Get list of available Ollama models.

**Response:**
```json
{
  "success": true,
  "models": [...],
  "currentModel": "llama3.2"
}
```

## Analysis Capabilities

The AI provides comprehensive forest plot analysis in Thai language covering:

### 1. 📊 Forest Health Assessment (ประเมินสุขภาพป่า)
- Tree mortality and damage rate analysis
- Comparison with industry standards
- Disease and pest identification
- Overall health scoring

### 2. ⚠️ Risk Assessment (ประเมินความเสี่ยง)
- Carbon credit certification readiness
- Documentation completeness for government bonding
- Sustainability and climate risks
- Investment risk evaluation

### 3. 💡 Expert Recommendations (คำแนะนำเชิงลึก)
- Species-specific care instructions (Teak, Rubber, Mahogany, etc.)
- Optimal tree spacing and density
- Replanting strategies
- Disease prevention and pest management
- Fertilization and irrigation best practices
- IoT and precision agriculture integration

### 4. 🔮 Financial Projections (คาดการณ์ผลตอบแทน)
- 5-year carbon credit projections
- Current vs. improved management scenarios
- Revenue estimation (฿400-800/ton CO₂)
- ROI and break-even analysis

### 5. 🎯 Action Plan (แผนปฏิบัติการ)
- 3-month priority tasks
- Long-term sustainability strategy (5-10 years)
- Monitoring and reporting schedules

## Usage Examples

### Frontend Integration

```typescript
import { analyzePlot, testAIConnection } from './services/ollamaService';

// Test connection
const { success, message } = await testAIConnection();
console.log(message);

// Analyze plot (comprehensive)
const analysis = await analyzePlot(currentPlot);
setAiAnalysis(analysis);

// Quick analysis
const quickAnalysis = await analyzePlot(currentPlot, 'quick');

// Financial analysis
const financialAnalysis = await analyzePlot(currentPlot, 'financial');

// Health-focused analysis
const healthAnalysis = await analyzePlot(currentPlot, 'health');
```

### Direct API Call (cURL)

```bash
# Analyze plot
curl -X POST http://localhost:8080/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "plot": {
      "id": "p1",
      "name": "แปลง A",
      "centerLat": 18.7883,
      "centerLng": 98.9853,
      "areaRai": 5,
      "areaSqm": 8000,
      "trees": [...]
    },
    "analysisType": "comprehensive"
  }'

# Check health
curl http://localhost:8080/api/ai/health

# List models
curl http://localhost:8080/api/ai/models
```

## Deployment

### Railway Deployment

The Ollama server is currently deployed on Railway at:
```
https://ollama-production-c85b.up.railway.app
```

To deploy your own instance:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   railway init
   ```

3. **Deploy Ollama**
   ```bash
   railway up
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set OLLAMA_MODEL=llama3.2
   ```

### Docker Deployment

```dockerfile
FROM ollama/ollama:latest

# Copy model files
COPY models/ /root/.ollama/models/

# Expose API port
EXPOSE 11434

CMD ["serve"]
```

Build and run:
```bash
docker build -t thailand-tree-bank-ollama .
docker run -p 11434:11434 thailand-tree-bank-ollama
```

### Local Development

1. **Install Ollama**
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Pull Model**
   ```bash
   ollama pull llama3.2
   ```

3. **Start Server**
   ```bash
   ollama serve
   ```

4. **Update Backend .env**
   ```env
   OLLAMA_API_URL=http://localhost:11434/api/chat
   OLLAMA_MODEL=llama3.2
   ```

## Performance Optimization

### Response Time
- **Quick Analysis**: ~5-10 seconds
- **Comprehensive Analysis**: ~15-30 seconds
- **Financial/Health Analysis**: ~10-20 seconds

### Caching Strategy

Implement Redis caching for frequently analyzed plots:

```typescript
// Pseudo-code
const cacheKey = `ai:analysis:${plotId}:${analysisType}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const result = await analyzeWithOllama(plot, analysisType);
await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600); // 1 hour TTL

return result;
```

### Model Optimization

- Use quantized models (Q4_K_M) for faster inference
- Consider smaller models (7B vs 13B) for quicker responses
- Pre-load frequently used models

## Error Handling

The system gracefully handles various error scenarios:

### Network Errors
```
❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ AI Backend ได้

กรุณาตรวจสอบ:
1. Backend server ทำงานอยู่หรือไม่
2. URL และการตั้งค่าเครือข่าย
3. Ollama service availability
```

### Timeout Errors
```
⏳ คำขอใช้เวลานานเกินไป

AI อาจกำลังประมวลผลหรือโหลดโมเดล กรุณารอสักครู่แล้วลองใหม่
```

### Service Unavailable
```
🔧 บริการ AI ยังไม่พร้อมใช้งานในขณะนี้

กรุณาตรวจสอบว่า Ollama server ทำงานปกติและลองใหม่อีกครั้ง
```

## Troubleshooting

### Issue: "Failed to connect to Ollama"

**Solution:**
1. Verify Ollama server is running
2. Check `OLLAMA_API_URL` in backend `.env`
3. Test endpoint directly:
   ```bash
   curl https://ollama-production-c85b.up.railway.app/api/tags
   ```

### Issue: "Analysis taking too long"

**Solution:**
1. Use `quick` analysis type for faster results
2. Check Ollama server resources (CPU/RAM)
3. Consider using a smaller model

### Issue: "No response from AI"

**Solution:**
1. Check backend logs for errors
2. Verify model is loaded: `GET /api/ai/models`
3. Test with minimal plot data first

## Security Considerations

1. **API Access Control**
   - Add authentication middleware to `/api/ai/*` routes
   - Implement rate limiting to prevent abuse
   - Use JWT tokens for authorized access

2. **Input Validation**
   - Validate plot data before sending to AI
   - Sanitize user inputs
   - Limit request payload size

3. **Privacy**
   - Self-hosted AI ensures data privacy
   - No external API calls for sensitive forest data
   - Logs are stored locally

## Future Enhancements

### Planned Features

1. **Multi-Model Support**
   - Switch between different LLM models
   - Ensemble predictions for higher accuracy
   - Specialized models for different tree species

2. **Image Analysis**
   - Tree health assessment from photos
   - Disease detection using computer vision
   - Drone imagery integration

3. **Batch Analysis**
   - Analyze multiple plots simultaneously
   - Generate comparative reports
   - Portfolio-level carbon credit projections

4. **Real-time Monitoring**
   - WebSocket integration for live updates
   - Streaming AI responses
   - Progress indicators

5. **Historical Tracking**
   - Track analysis results over time
   - Trend analysis and predictions
   - Seasonal pattern recognition

## References

- [Ollama Documentation](https://ollama.ai/docs)
- [LLaMA Model Information](https://ai.meta.com/llama/)
- [Railway Deployment Guide](https://docs.railway.app/)
- [Thailand Carbon Credit Standards](https://tgo.or.th/)

## Support

For issues or questions about Ollama integration:

1. Check the [troubleshooting section](#troubleshooting)
2. Review backend logs: `npm run dev` (backend)
3. Test AI health endpoint: `GET /api/ai/health`
4. Open an issue on GitHub

---

**Last Updated:** 2024-02-03
**Version:** 1.0.0
**Ollama Model:** LLaMA 3.2
**Deployment:** Railway (https://ollama-production-c85b.up.railway.app)
