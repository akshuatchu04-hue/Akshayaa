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

export interface ScanHistoryItem {
  id: number;
  summary: string;
  fruits_json: string; // Store as JSON string in SQLite
  image_data: string;
  timestamp: string;
}
