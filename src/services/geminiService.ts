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
  
  const prompt = `You are a Computer Vision system powered by Deep Learning and YOLOv8 (CNN) architectures. 
  Your task is to detect ONLY individual fruits in the image and determine their quality.
  
  STRICT CONSTRAINTS:
  - ONLY detect fruits. Ignore all other objects in the image (e.g., plates, baskets, tables, hands, background elements).
  - Do NOT attempt to determine if the fruits are artificial or natural; treat all detected fruit shapes as real for this analysis.
  - Ensure you detect each fruit exactly once and provide a precise bounding box for each.
  
  For each fruit detected:
  1. Identify the fruit name.
  2. Classify quality as "Good", "Moderate", or "Bad".
  3. Provide a quality score (0-100).
  4. Describe the condition (color, texture, shape).
  5. Flag if it is rotted (isRotted: true/false).
  6. Provide normalized bounding box coordinates [ymin, xmin, ymax, xmax] (values 0-1000) that tightly encompass the fruit.

  Provide a short and crisp summary of the findings. 
  CRITICAL: Do NOT mention whether the fruits are artificial, real, or natural in the summary or any part of the output. Focus only on the quality and condition.
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
