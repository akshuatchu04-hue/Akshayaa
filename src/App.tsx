import React, { useState, useEffect } from "react";
import { Scanner } from "./components/Scanner";
import { History } from "./components/History";
import { Tips } from "./components/Tips";
import { Profile } from "./components/Profile";
import { Scan, History as HistoryIcon, Lightbulb, User, Info, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Tab = "scanner" | "history" | "tips" | "profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("scanner");
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f8f6] text-slate-900 font-sans">
      {/* Header */}
      <header className="flex items-center bg-[#f5f8f6] p-4 sticky top-0 z-30 border-b border-[#25f447]/10">
        <button 
          onClick={() => setActiveTab("scanner")}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25f447]/10 text-slate-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center">Fruit Vitality</h2>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="flex size-10 items-center justify-end text-slate-600"
        >
          <Info size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-24 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {activeTab === "scanner" && <Scanner />}
            {activeTab === "history" && <History />}
            {activeTab === "tips" && <Tips />}
            {activeTab === "profile" && <Profile />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <NavButton 
          active={activeTab === "scanner"} 
          onClick={() => setActiveTab("scanner")}
          icon={<Scan size={24} />}
          label="Scanner"
        />
        <NavButton 
          active={activeTab === "history"} 
          onClick={() => setActiveTab("history")}
          icon={<HistoryIcon size={24} />}
          label="History"
        />
        <NavButton 
          active={activeTab === "tips"} 
          onClick={() => setActiveTab("tips")}
          icon={<Lightbulb size={24} />}
          label="Tips"
        />
        <NavButton 
          active={activeTab === "profile"} 
          onClick={() => setActiveTab("profile")}
          icon={<User size={24} />}
          label="Profile"
        />
      </nav>

      {/* Info Modal Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setShowInfo(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">About Fruit Vitality</h3>
              <p className="text-slate-600 mb-4">
                This system uses Computer Vision and Deep Learning models (CNN, YOLOv8) to identify fruits and determine their quality.
              </p>
              <p className="text-slate-600 mb-6">
                It can automatically detect multiple fruits in a single image, marking each with an indicator and classifying them as Good, Moderate, or Bad.
              </p>
              <button 
                onClick={() => setShowInfo(false)}
                className="w-full py-3 bg-[#25f447] text-slate-900 font-bold rounded-xl shadow-lg shadow-[#25f447]/20"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? "text-[#25f447]" : "text-slate-400"}`}
    >
      <div className={`${active ? "scale-110" : "scale-100"} transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
