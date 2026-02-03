import { Router, Request, Response } from 'express';

const router = Router();

// Ollama configuration
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'https://ollama-production-c85b.up.railway.app/api/chat';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
const CARBON_CREDIT_FACTOR = 9.5; // kg CO₂ per tree per year

interface TreeData {
  id: string;
  type: string;
  status: string;
  plantedDate?: string;
  dbhCm?: number;
  heightM?: number;
}

interface PlotData {
  id: string;
  name: string;
  location?: string;
  centerLat: number;
  centerLng: number;
  areaRai: number;
  areaSqm: number;
  trees: TreeData[];
  documents?: Array<{ name: string; status: string }>;
  status?: string;
}

interface AnalysisRequest {
  plot: PlotData;
  analysisType?: 'comprehensive' | 'quick' | 'financial' | 'health';
}

/**
 * POST /api/ai/analyze
 * Analyze a plot using Ollama AI
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { plot, analysisType = 'comprehensive' }: AnalysisRequest = req.body;

    if (!plot || !plot.trees) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Plot data with trees is required'
      });
    }

    // Calculate statistics
    const treeCount = plot.trees.length;
    const healthyTrees = plot.trees.filter(t => t.status === 'Healthy').length;
    const damagedTrees = plot.trees.filter(t => t.status === 'Damaged').length;
    const deadTrees = plot.trees.filter(t => t.status === 'Dead' || t.status === 'Missing').length;
    const currentCarbon = healthyTrees * CARBON_CREDIT_FACTOR;

    // Tree type distribution
    const treeTypes = plot.trees.reduce((acc, tree) => {
      acc[tree.type] = (acc[tree.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Average measurements
    const treesWithDBH = plot.trees.filter(t => t.dbhCm && t.dbhCm > 0);
    const avgDBH = treesWithDBH.length > 0
      ? (treesWithDBH.reduce((sum, t) => sum + (t.dbhCm || 0), 0) / treesWithDBH.length).toFixed(1)
      : 'N/A';

    const treesWithHeight = plot.trees.filter(t => t.heightM && t.heightM > 0);
    const avgHeight = treesWithHeight.length > 0
      ? (treesWithHeight.reduce((sum, t) => sum + (t.heightM || 0), 0) / treesWithHeight.length).toFixed(1)
      : 'N/A';

    const documents = plot.documents?.map(d => `${d.name} (${d.status})`).join(', ') || 'ไม่มีเอกสารแนบ';

    // Build prompt based on analysis type
    const systemPrompt = buildSystemPrompt(analysisType);
    const userPrompt = buildUserPrompt(plot, {
      treeCount,
      healthyTrees,
      damagedTrees,
      deadTrees,
      currentCarbon,
      treeTypes,
      avgDBH,
      avgHeight,
      documents
    }, analysisType);

    // Call Ollama API
    const ollamaResponse = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        stream: false,
        options: {
          temperature: analysisType === 'financial' ? 0.5 : 0.7,
          top_p: 0.9,
          top_k: 40,
          num_predict: analysisType === 'quick' ? 800 : 2500,
        }
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text().catch(() => '');
      console.error('Ollama API Error:', ollamaResponse.status, errorText);
      throw new Error(`Ollama API error: ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json() as any;
    const analysisText = data.message?.content;

    if (!analysisText) {
      throw new Error('No response from Ollama AI');
    }

    // Return successful response
    return res.json({
      success: true,
      analysis: analysisText,
      metadata: {
        model: OLLAMA_MODEL,
        analysisType,
        timestamp: new Date().toISOString(),
        statistics: {
          totalTrees: treeCount,
          healthyTrees,
          damagedTrees,
          deadTrees,
          healthRate: ((healthyTrees / treeCount) * 100).toFixed(1) + '%',
          carbonCredits: currentCarbon.toFixed(2) + ' kg CO₂/year'
        }
      }
    });

  } catch (error) {
    console.error('AI Analysis Error:', error);

    // Determine error type and return appropriate response
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return res.status(503).json({
          success: false,
          error: 'Service Unavailable',
          message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ Ollama ได้ กรุณาตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง',
          details: `Ollama URL: ${OLLAMA_API_URL}`
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Analysis Failed',
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Unknown Error',
      message: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
    });
  }
});

/**
 * GET /api/ai/health
 * Check Ollama service health and available models
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const tagsUrl = OLLAMA_API_URL.replace('/api/chat', '/api/tags');
    const response = await fetch(tagsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json() as any;
      const models = data.models || [];

      return res.json({
        success: true,
        status: 'connected',
        url: OLLAMA_API_URL,
        currentModel: OLLAMA_MODEL,
        availableModels: models.map((m: any) => ({
          name: m.name,
          size: m.size,
          modified: m.modified_at
        })),
        timestamp: new Date().toISOString()
      });
    }

    return res.status(503).json({
      success: false,
      status: 'disconnected',
      message: `HTTP ${response.status}: ${response.statusText}`
    });

  } catch (error) {
    console.error('Ollama Health Check Error:', error);
    return res.status(503).json({
      success: false,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      url: OLLAMA_API_URL
    });
  }
});

/**
 * GET /api/ai/models
 * List available Ollama models
 */
router.get('/models', async (req: Request, res: Response) => {
  try {
    const tagsUrl = OLLAMA_API_URL.replace('/api/chat', '/api/tags');
    const response = await fetch(tagsUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json() as any;
    return res.json({
      success: true,
      models: data.models || [],
      currentModel: OLLAMA_MODEL
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper function to build system prompt based on analysis type
function buildSystemPrompt(analysisType: string): string {
  const basePrompt = `You are a professional Thai Agricultural Expert and Carbon Credit Auditor specializing in Thailand's government forestry and carbon credit programs.

Your expertise includes:
- Thai forestry management and sustainable practices
- Carbon credit calculation and verification standards (VCS, Gold Standard)
- Tree species suitable for Thailand's tropical climate (Teak, Mahogany, Rubber, etc.)
- Government bonding programs (Green Bond/Forest Bond)
- Risk assessment for forestry investments
- Precision agriculture and IoT monitoring
- Thai agricultural regulations and best practices

Always respond in professional Thai language using "ครับ/ค่ะ" politely. Be encouraging but honest in your assessment.`;

  switch (analysisType) {
    case 'financial':
      return basePrompt + '\n\nFocus on financial projections, carbon credit valuation, ROI analysis, and investment potential.';
    case 'health':
      return basePrompt + '\n\nFocus on tree health assessment, disease diagnosis, mortality analysis, and care recommendations.';
    case 'quick':
      return basePrompt + '\n\nProvide a concise summary highlighting key issues and top 3 recommendations.';
    default:
      return basePrompt;
  }
}

// Helper function to build user prompt
function buildUserPrompt(
  plot: PlotData,
  stats: {
    treeCount: number;
    healthyTrees: number;
    damagedTrees: number;
    deadTrees: number;
    currentCarbon: number;
    treeTypes: Record<string, number>;
    avgDBH: string;
    avgHeight: string;
    documents: string;
  },
  analysisType: string
): string {
  const baseData = `Please analyze this forest plot for carbon credit potential and provide expert recommendations:

📍 **Plot Information:**
- Name: ${plot.name}
- Location: ${plot.location || `${plot.centerLat}, ${plot.centerLng}`}
- Area: ${plot.areaRai} ไร่ (${plot.areaSqm} ตารางเมตร)
- Status: ${plot.status || 'active'}

🌳 **Tree Inventory:**
- Total Trees: ${stats.treeCount} ต้น
- Healthy: ${stats.healthyTrees} ต้น (${((stats.healthyTrees/stats.treeCount)*100).toFixed(1)}%)
- Damaged: ${stats.damagedTrees} ต้น (${((stats.damagedTrees/stats.treeCount)*100).toFixed(1)}%)
- Dead/Missing: ${stats.deadTrees} ต้น (${((stats.deadTrees/stats.treeCount)*100).toFixed(1)}%)

**Tree Type Distribution:**
${Object.entries(stats.treeTypes).map(([type, count]) => `- ${type}: ${count} ต้น`).join('\n')}

**Average Measurements:**
- DBH (Diameter at Breast Height): ${stats.avgDBH} cm
- Height: ${stats.avgHeight} meters

💰 **Current Carbon Credits:**
- Annual Sequestration: ${stats.currentCarbon.toFixed(2)} kg CO₂/year
- Based on: ${CARBON_CREDIT_FACTOR} kg CO₂/tree/year for healthy trees

📄 **Documentation:**
${stats.documents}`;

  switch (analysisType) {
    case 'quick':
      return baseData + '\n\nProvide a quick summary (5-7 sentences) covering: overall health assessment, top 3 urgent recommendations, and estimated carbon credit potential in 1 year.';

    case 'financial':
      return baseData + `\n\nProvide detailed financial analysis covering:
1. **Current Valuation** - Carbon credit value at current market rates (฿400-800/ton CO₂)
2. **5-Year Projection** - Expected carbon credits with current vs. improved management
3. **ROI Analysis** - Investment needed vs. expected returns
4. **Risk Assessment** - Financial risks and mitigation strategies
5. **Market Opportunities** - Government programs, private buyers, international markets`;

    case 'health':
      return baseData + `\n\nProvide comprehensive health assessment covering:
1. **Disease Diagnosis** - Identify potential diseases based on damage/death rates
2. **Pest Analysis** - Common pests for these tree species in Thailand
3. **Treatment Plan** - Specific treatments and preventive measures
4. **Monitoring Schedule** - Regular inspection and care calendar
5. **Recovery Timeline** - Expected recovery for damaged trees`;

    default: // comprehensive
      return baseData + `\n\nProvide a comprehensive analysis in Thai covering:

1. **📊 ประเมินสุขภาพป่า (Forest Health Assessment)**
   - Analyze the mortality and damage rates
   - Compare with industry standards for Thailand
   - Identify potential problems or diseases

2. **⚠️ ประเมินความเสี่ยง (Risk Assessment)**
   - Evaluate readiness for carbon credit certification
   - Document completeness for government bonding
   - Sustainability risks

3. **💡 คำแนะนำเชิงลึก (Expert Recommendations)**
   - Specific care instructions for the tree species present
   - Optimal spacing and density recommendations
   - Replanting strategies to replace dead trees
   - Disease prevention and pest management
   - Fertilization and irrigation best practices
   - Technology integration (IoT sensors, drones)

4. **🔮 คาดการณ์ผลตอบแทน (Financial Projection)**
   - Estimated carbon credits in 5 years with current care
   - Estimated credits with improved management
   - Potential revenue from carbon credit sales (฿400-800/ton CO₂)
   - Break-even analysis and ROI timeline

5. **🎯 แผนปฏิบัติการ (Action Plan)**
   - Priority tasks for the next 3 months
   - Long-term sustainability strategy (5-10 years)
   - Monitoring and reporting schedule

Format your response with emojis, clear sections, and actionable insights. Be professional but encouraging!`;
  }
}

export default router;
