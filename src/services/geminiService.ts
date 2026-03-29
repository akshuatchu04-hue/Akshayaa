import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface FruitAnalysis {
  fruitName: string;
  qualityLevel: "Good" | "Moderate" | "Bad";
  score: number;
  description: string;
  isRotted: boolean;
  boundingBox: {
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
  };
}

export interface AnalysisResult {
  fruits: FruitAnalysis[];
  summary: string;
}

export async function analyzeFruitImage(base64Image: string): Promise<AnalysisResult> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `You are a high-performance Computer Vision engine utilizing YOLOv8 object detection and Convolutional Neural Network (CNN) architectures.
  
  Your operational parameters:
  - Detect EVERY individual fruit in the image. Do not miss any.
  - Ignore all non-fruit objects (plates, hands, background).
  - Treat all detected fruit shapes as real.
  
  For each detected fruit, perform a detailed visual inspection based on these criteria:
  1. Color Changes: Look for browning, dark spots, uneven ripening, or dullness.
  2. Surface Texture: Check for shriveling, wrinkles, soft spots, or loss of firmness.
  3. Visible Damage: Identify bruises, cuts, mold, or insect damage.
  
  Classification Rules:
  - GOOD: Vibrant color, firm texture, no visible damage.
  - MODERATE: Slight color fading, minor soft spots, or small bruises. Still edible but should be consumed soon.
  - BAD: Significant browning, shriveled skin, mold, or deep cuts. Unfit for consumption.
  
  For each fruit, provide:
  1. Identify the fruit name.
  2. Classify quality as "Good", "Moderate", or "Bad".
  3. Provide a quality score (0-100).
  4. Describe the condition using SIMPLE, EVERYDAY WORDS based on the visual features above.
  5. Set binary rot flag (isRotted: true/false).
  6. Output normalized bounding box coordinates [ymin, xmin, ymax, xmax] (0-1000 scale).

  Provide a short summary of the findings using SIMPLE WORDS. 
  CRITICAL: 
  - Do NOT use technical jargon in the summary or descriptions.
  - Do NOT mention "AI", "artificial", or "natural".
  Return the result in JSON format.`;

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
                qualityLevel: { type: Type.STRING, enum: ["Good", "Moderate", "Bad"] },
                score: { type: Type.NUMBER },
                description: { type: Type.STRING },
                isRotted: { type: Type.BOOLEAN },
                boundingBox: {
                  type: Type.OBJECT,
                  properties: {
                    ymin: { type: Type.NUMBER },
                    xmin: { type: Type.NUMBER },
                    ymax: { type: Type.NUMBER },
                    xmax: { type: Type.NUMBER },
                  },
                  required: ["ymin", "xmin", "ymax", "xmax"],
                },
              },
              required: ["fruitName", "qualityLevel", "score", "description", "isRotted", "boundingBox"],
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
