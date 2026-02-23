import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface FruitAnalysis {
  fruitName: string;
  qualityLevel: "High" | "Moderate" | "Bad";
  score: number;
  description: string;
  isRotted: boolean;
}

export interface AnalysisResult {
  fruits: FruitAnalysis[];
  summary: string;
}

export async function analyzeFruitImage(base64Image: string): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze the fruits in this image for quality grading. 
  Detect every individual fruit visible. For each fruit, determine:
  1. Fruit name
  2. Quality level (High, Moderate, or Bad)
  3. Quality score (0-100)
  4. A brief description of its condition
  5. Whether it is rotted (isRotted: true/false)
  
  Provide a summary of the overall findings. Return the result in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fruits: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                fruitName: { type: Type.STRING },
                qualityLevel: { type: Type.STRING, enum: ["High", "Moderate", "Bad"] },
                score: { type: Type.NUMBER },
                description: { type: Type.STRING },
                isRotted: { type: Type.BOOLEAN },
              },
              required: ["fruitName", "qualityLevel", "score", "description", "isRotted"],
            },
          },
          summary: { type: Type.STRING },
        },
        required: ["fruits", "summary"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as AnalysisResult;
}
