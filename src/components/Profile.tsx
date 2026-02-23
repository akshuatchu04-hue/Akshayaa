import React from "react";
import { User, Settings, Bell, Shield, LogOut, ChevronRight, Award } from "lucide-react";

export function Profile() {
  return (
    <div className="flex flex-col px-4 pt-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="size-20 rounded-full bg-gradient-to-br from-[#25f447] to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-[#25f447]/20">
          <User size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Fruit Enthusiast</h2>
          <p className="text-slate-500 text-sm">Member since Feb 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-2xl font-bold text-[#25f447]">12</p>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Scans Done</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-2xl font-bold text-emerald-600">92%</p>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Avg Quality</p>
        </div>
      </div>

      <div className="space-y-3 pb-6">
        <ProfileItem icon={<Settings size={20} />} label="Settings" />
        <ProfileItem icon={<Bell size={20} />} label="Notifications" />
        <ProfileItem icon={<Shield size={20} />} label="Privacy & Security" />
        <ProfileItem icon={<Award size={20} />} label="Achievements" />
        <div className="pt-4">
          <ProfileItem icon={<LogOut size={20} />} label="Logout" color="text-red-500" />
        </div>
      </div>

      <div className="mt-auto py-6 text-center">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">Fruit Vitality v1.0.0</p>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, color = "text-slate-600" }: { icon: React.ReactNode, label: string, color?: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-[0.98] transition-all">
      <div className="flex items-center gap-4">
        <div className={`${color}`}>
          {icon}
        </div>
        <span className="font-bold text-slate-700">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-300" />
    </button>
  );
}
