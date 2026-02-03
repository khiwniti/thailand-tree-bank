import { Plot } from "../types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const analyzePlot = async (plot: Plot, analysisType: 'comprehensive' | 'quick' | 'financial' | 'health' = 'comprehensive'): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/api/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plot,
        analysisType
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend AI API Error:', response.status, errorData);
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.analysis) {
      throw new Error('Invalid response from AI service');
    }

    return data.analysis;
  } catch (error) {
    console.error("AI Analysis Error:", error);

    if (error instanceof Error) {
      // Network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return "❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ AI Backend ได้\n\n" +
               "กรุณาตรวจสอบ:\n" +
               "1. Backend server ทำงานอยู่หรือไม่\n" +
               "2. URL และการตั้งค่าเครือข่าย\n" +
               "3. Ollama service availability\n\n" +
               `Backend URL: ${API_URL}`;
      }

      // Timeout errors
      if (error.message.includes('timeout') || error.message.includes('AbortError')) {
        return "⏳ คำขอใช้เวลานานเกินไป\n\n" +
               "AI อาจกำลังประมวลผลหรือโหลดโมเดล กรุณารอสักครู่แล้วลองใหม่";
      }

      // Service unavailable
      if (error.message.includes('Service Unavailable') || error.message.includes('503')) {
        return "🔧 บริการ AI ยังไม่พร้อมใช้งานในขณะนี้\n\n" +
               "กรุณาตรวจสอบว่า Ollama server ทำงานปกติและลองใหม่อีกครั้ง";
      }

      // Other errors
      return `⚠️ เกิดข้อผิดพลาดในการวิเคราะห์\n\n${error.message}\n\n` +
             `กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ`;
    }

    return `⚠️ เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ\n\nกรุณาลองใหม่อีกครั้ง`;
  }
};

/**
 * Test AI service connection and availability
 */
export const testAIConnection = async (): Promise<{success: boolean, message: string, data?: any}> => {
  try {
    const response = await fetch(`${API_URL}/api/ai/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.success) {
        const modelList = data.availableModels?.map((m: any) => `- ${m.name}`).join('\n') || 'ไม่พบโมเดล';
        return {
          success: true,
          message: `✅ เชื่อมต่อ AI Service สำเร็จ!\n\nโมเดลปัจจุบัน: ${data.currentModel}\n\nโมเดลที่พร้อมใช้งาน:\n${modelList}`,
          data
        };
      }

      return {
        success: false,
        message: `❌ AI Service: ${data.message || 'ไม่สามารถเชื่อมต่อได้'}`,
        data
      };
    }

    return {
      success: false,
      message: `❌ ไม่สามารถเชื่อมต่อได้ (HTTP ${response.status})`
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ไม่สามารถเชื่อมต่อกับ AI Backend\n\n${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Get available AI models
 */
export const getAvailableModels = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/api/ai/models`);

    if (response.ok) {
      const data = await response.json();
      return data.models?.map((m: any) => m.name) || [];
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [];
  }
};
