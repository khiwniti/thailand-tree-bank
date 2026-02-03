import { Plot, CARBON_CREDIT_FACTOR } from "../types";

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free models available on OpenRouter
const FREE_MODEL = 'meta-llama/llama-3.2-3b-instruct:free';

export const analyzePlot = async (plot: Plot): Promise<string> => {
  if (!apiKey) {
    return "⚠️ ไม่พบ API Key กรุณาตรวจสอบการตั้งค่าระบบ\n\nPlease add VITE_OPENROUTER_API_KEY to your .env.local file";
  }

  const treeCount = plot.trees.length;
  const healthyTrees = plot.trees.filter(t => t.status === 'Healthy').length;
  const deadTrees = plot.trees.filter(t => t.status === 'Dead' || t.status === 'Missing').length;
  const currentCarbon = healthyTrees * CARBON_CREDIT_FACTOR;
  const documents = plot.documents.map(d => `${d.name} (${d.status})`).join(', ');

  const prompt = `You are a professional Thai Agricultural Expert and Carbon Credit Auditor specializing in Thailand's government bonding projects (Green Bond/Forest Bond).

Please analyze the following land plot data in THAI Language only.

Data:
Plot Name: ${plot.name}
Location: ${plot.centerLat}, ${plot.centerLng}
Total Trees: ${treeCount}
Healthy Trees: ${healthyTrees}
Dead/Missing Trees: ${deadTrees}
Current Carbon Credit: ${currentCarbon} kg/year (Standard 9.5kg/tree).
Documents: ${documents || 'None'}

Tree Sample: ${JSON.stringify(plot.trees.slice(0, 5).map(t => ({ type: t.type, status: t.status })))}

Provide a professional assessment in Thai:
1. **ประเมินความเสี่ยง (Risk Assessment)**: Analyze tree mortality rates and documentation readiness for bonding.
2. **คำแนะนำเชิงลึก (Expert Advice)**: Give specific advice on tree care (Teak/Rubber/etc) suitable for Thailand's climate to increase carbon capture. Suggest spacing or replanting if needed.
3. **คาดการณ์อนาคต (Future Projection)**: Estimate carbon credits in 5 years if the farmer improves care.

Tone: Professional, encouraging, and authoritative (Thai expert style). Use "ครับ" politely.`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Thailand Tree Bank',
      },
      body: JSON.stringify({
        model: FREE_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional Thai Agricultural Expert and Carbon Credit Auditor. Always respond in Thai language using "ครับ" politely.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;

    if (!analysisText) {
      throw new Error('No response from AI');
    }

    return analysisText;
  } catch (error) {
    console.error("OpenRouter Analysis Error:", error);

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        return "❌ API Key ไม่ถูกต้อง กรุณาตรวจสอบ VITE_OPENROUTER_API_KEY";
      }
      if (error.message.includes('429')) {
        return "⏳ ใช้งาน API เกินขอบเขต กรุณาลองใหม่อีกครั้งในภายหลัง";
      }
    }

    return `⚠️ เกิดข้อผิดพลาดในการเชื่อมต่อกับบริการ AI\n\n${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};
