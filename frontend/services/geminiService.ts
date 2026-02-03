import { GoogleGenAI } from "@google/genai";
import { Plot, CARBON_CREDIT_FACTOR } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzePlot = async (plot: Plot): Promise<string> => {
  if (!apiKey) {
    return "ไม่พบ API Key กรุณาตรวจสอบการตั้งค่าระบบ";
  }

  const treeCount = plot.trees.length;
  const healthyTrees = plot.trees.filter(t => t.status === 'Healthy').length;
  const deadTrees = plot.trees.filter(t => t.status === 'Dead' || t.status === 'Missing').length;
  const currentCarbon = healthyTrees * CARBON_CREDIT_FACTOR;
  const documents = plot.documents.map(d => `${d.name} (${d.status})`).join(', ');

  const prompt = `
    You are a professional Thai Agricultural Expert and Carbon Credit Auditor specializing in Thailand's government bonding projects (Green Bond/Forest Bond).
    
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

    Tone: Professional, encouraging, and authoritative (Thai expert style). Use "ครับ" politely.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "ไม่สามารถสร้างรายงานวิเคราะห์ได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับบริการ AI";
  }
};