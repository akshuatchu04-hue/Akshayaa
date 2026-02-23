import React, { useState, useRef, useCallback } from "react";
import { Upload, Camera, BarChart2, Smile, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { analyzeFruitImage, AnalysisResult } from "../services/geminiService";
import { motion } from "motion/react";

export function Scanner() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setImage(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const speakResult = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const analysisResult = await analyzeFruitImage(image);
      setResult(analysisResult);
      
      // Save to history
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: analysisResult.summary,
          fruits_json: JSON.stringify(analysisResult.fruits),
          image_data: image
        })
      });

      // Audio feedback
      const rottedCount = analysisResult.fruits.filter(f => f.isRotted).length;
      let speechText = `Analysis complete. Detected ${analysisResult.fruits.length} fruits. ${analysisResult.summary}`;
      if (rottedCount > 0) {
        speechText += ` Warning: ${rottedCount} rotted fruit${rottedCount > 1 ? 's' : ''} detected.`;
      }
      speakResult(speechText);
      
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col px-4 pt-4">
      {/* Header Section */}
      <section className="py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Check Your Fruit's Vitality!</h1>
        <p className="text-slate-600 text-sm">Instant freshness analysis using AI</p>
      </section>

      {/* Image Display / Camera Area */}
      <section className="flex flex-col gap-6">
        <div className="relative group">
          <div className="aspect-square w-full rounded-2xl border-2 border-dashed border-[#25f447]/30 bg-[#25f447]/5 flex flex-col items-center justify-center gap-4 overflow-hidden relative">
            {showCamera ? (
              <div className="absolute inset-0 bg-black">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6">
                  <button 
                    onClick={stopCamera}
                    className="flex-1 h-12 rounded-xl bg-white/20 backdrop-blur-md text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={capturePhoto}
                    className="flex-1 h-12 rounded-xl bg-[#25f447] text-slate-900 font-bold"
                  >
                    Capture
                  </button>
                </div>
              </div>
            ) : image ? (
              <img src={image} alt="Selected fruit" className="w-full h-full object-cover" />
            ) : (
              <div className="relative z-10 flex flex-col items-center text-center p-6">
                <div className="bg-white p-4 rounded-full mb-4 shadow-sm text-[#25f447]">
                  <Camera size={40} />
                </div>
                <p className="font-bold text-lg">No Fruit Selected</p>
                <p className="text-sm text-slate-600 mt-1">Place your fruit in the center of the frame or upload a photo to start.</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={handleUploadClick}
            className="flex items-center justify-center gap-2 h-14 rounded-xl bg-white border border-slate-200 font-bold shadow-sm active:scale-95 transition-transform"
          >
            <Upload size={20} />
            Upload
          </button>
          <button 
            onClick={startCamera}
            className="flex items-center justify-center gap-2 h-14 rounded-xl bg-white border border-slate-200 font-bold shadow-sm active:scale-95 transition-transform"
          >
            <Camera size={20} />
            Camera
          </button>
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={!image || analyzing}
          className={`w-full h-16 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
            !image || analyzing 
              ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
              : "bg-[#25f447] text-slate-900 shadow-[#25f447]/20"
          }`}
        >
          {analyzing ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart2 size={24} />
              Analyze Now
            </>
          )}
        </button>
      </section>

      {/* Result Section */}
      {result && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 mb-6 space-y-6"
        >
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#25f447]/20">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Overall Summary</h3>
            <p className="text-slate-700 leading-relaxed">{result.summary}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2">Individual Fruit Analysis</h3>
            {result.fruits.map((fruit, idx) => (
              <div key={idx} className={`p-4 rounded-2xl bg-white shadow-sm border ${
                fruit.isRotted ? "border-red-500 bg-red-50" : "border-slate-100"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      {fruit.fruitName}
                      {fruit.isRotted && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Rotted</span>
                      )}
                    </h4>
                    <p className={`text-sm font-bold ${
                      fruit.qualityLevel === "High" ? "text-[#25f447]" : 
                      fruit.qualityLevel === "Moderate" ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {fruit.qualityLevel} Quality
                    </p>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <svg className="size-12 transform -rotate-90">
                      <circle className="text-slate-100" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
                      <circle 
                        className={fruit.qualityLevel === "High" ? "text-[#25f447]" : fruit.qualityLevel === "Moderate" ? "text-yellow-500" : "text-red-500"} 
                        cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"
                        strokeDasharray="125.6" 
                        strokeDashoffset={125.6 - (125.6 * fruit.score) / 100}
                      ></circle>
                    </svg>
                    <span className="absolute text-[10px] font-bold">{fruit.score}%</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{fruit.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Quality Indicators (Static reference) */}
      {!result && (
        <div className="mt-8 space-y-3 opacity-60 mb-6">
          <div className="p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 flex items-center gap-3">
            <AlertTriangle size={18} className="text-yellow-500" />
            <p className="text-sm font-medium">Moderate Quality: <span className="font-bold text-yellow-600 italic">Consume quickly</span></p>
          </div>
          <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/5 flex items-center gap-3">
            <Trash2 size={18} className="text-red-500" />
            <p className="text-sm font-medium">Bad Quality: <span className="font-bold text-red-600 italic">Throw it away</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
