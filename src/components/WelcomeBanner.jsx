import React, { useState } from 'react';
import { Clapperboard, Sparkles, BarChart3, Upload, ChevronRight, X, AlertCircle } from 'lucide-react';

export default function WelcomeBanner({ 
  project, 
  onOpenImport, 
  onNavigateToAnalytics, 
  onNavigateToMatrix 
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const totalScenes = project.scenes.length;
  const lockedCount = project.scenes.filter(s => s.picture.status === 'LOCKED').length;
  const lockPercent = totalScenes > 0 ? Math.round((lockedCount / totalScenes) * 100) : 0;
  
  const vfxTotal = project.scenes.reduce((acc, s) => acc + (s.vfx.shotsCount || 0), 0);
  const vfxDone = project.scenes.reduce((acc, s) => acc + (s.vfx.shotsApproved || 0), 0);
  const vfxPercent = vfxTotal > 0 ? Math.round((vfxDone / vfxTotal) * 100) : 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#161B2B] via-[#141824] to-[#121620] border-b border-[#242C42] px-6 py-5">
      {/* Ambient background blur glow */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-64 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-2.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
              Director Studio Operating System
            </span>
            <span className="text-xs text-gray-400">&bull; Production Project: <strong className="text-white">{project.title}</strong></span>
          </div>

          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Welcome back, {project.director} &amp; {project.leadEditor}</span>
          </h2>

          <p className="text-xs text-gray-300 max-w-3xl leading-relaxed">
            Blockbuster synchronizes your editorial cut with Sound, VFX, Color, and Mastering. Ingest your screenplay in <strong>PDF</strong> or <strong>DOCX</strong> format to automatically segment Acts &amp; Scenes, or evaluate your delivery velocity with <strong>Grafana-powered milestone analytics</strong>.
          </p>
        </div>

        {/* Milestone Quick Summary Cards */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="bg-[#0B0D13]/80 border border-[#242C42] rounded-xl px-4 py-2.5 min-w-[130px]">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Picture Lock</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">{lockPercent}% Complete</div>
            <div className="w-full bg-gray-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${lockPercent}%` }} />
            </div>
          </div>

          <div className="bg-[#0B0D13]/80 border border-[#242C42] rounded-xl px-4 py-2.5 min-w-[130px]">
            <div className="text-[10px] uppercase font-semibold text-gray-400">VFX Delivery</div>
            <div className="text-sm font-bold text-purple-400 mt-0.5">{vfxPercent}% Approved</div>
            <div className="w-full bg-gray-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${vfxPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenImport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import PDF / DOCX</span>
          </button>

          <button
            onClick={onNavigateToAnalytics}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1E2333] hover:bg-[#2C344B] text-indigo-300 hover:text-white text-xs font-semibold border border-[#2C344B] transition"
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Grafana Analytics</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="text-gray-500 hover:text-gray-300 p-1.5 rounded-lg hover:bg-white/5 transition"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
