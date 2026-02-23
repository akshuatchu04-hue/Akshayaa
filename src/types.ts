export interface FruitAnalysis {
  fruitName: string;
  qualityLevel: "High" | "Moderate" | "Bad";
  score: number;
  description: string;
  isRotted: boolean;
}

export interface ScanHistoryItem {
  id: number;
  summary: string;
  fruits_json: string; // Store as JSON string in SQLite
  image_data: string;
  timestamp: string;
}
