import { useState, useEffect } from "react";
import { ScanHistoryItem } from "../types";
import { Trash2, Calendar, ChevronRight, Search } from "lucide-react";
import { motion } from "motion/react";

export function History() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteItem = async (id: number) => {
    try {
      await fetch(`/api/history/${id}`, { method: "DELETE" });
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHistory = history.filter(item => 
    item.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fruits_json?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col px-4 pt-6">
      <h2 className="text-2xl font-bold mb-6">Scan History</h2>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search fruits or quality..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25f447]/50"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25f447] mb-4"></div>
          <p>Loading your history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-slate-100 p-6 rounded-full mb-4 text-slate-300">
            <Calendar size={48} />
          </div>
          <p className="text-slate-500 font-medium">No scans found</p>
          <p className="text-sm text-slate-400 mt-1">Your analyzed fruits will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4 pb-6">
          {filteredHistory.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center"
            >
              <div className="size-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img src={item.image_data} alt="Scan result" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 truncate">
                    {JSON.parse(item.fruits_json).length} Fruit{JSON.parse(item.fruits_json).length > 1 ? 's' : ''} Detected
                  </h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1 line-clamp-1">{item.summary}</p>
                <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
                  {JSON.parse(item.fruits_json).map((f: any, i: number) => (
                    <span key={i} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap ${
                      f.isRotted ? "bg-red-500 text-white" : "bg-slate-50 text-slate-400"
                    }`}>
                      {f.fruitName}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => deleteItem(item.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
