import React, { useState } from 'react';
import { 
  Clapperboard, Sparkles, BarChart3, Upload, ChevronRight, X, 
  AlertCircle, ShieldCheck, Film, Eye, Users, ArrowRight, HelpCircle, Pin, Bot
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';

export default function WelcomeBanner({ 
  project, 
  onOpenImport, 
  onNavigateToAnalytics, 
  onNavigateToMatrix,
  onNavigateToBoard,
  onNavigateToDirectorAi,
  currentRoleKey,
  onOpenRoleMatrix,
  onOpenGuide
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;
  const totalScenes = project.scenes.length;
  const lockedCount = project.scenes.filter(s => s.picture.status === 'LOCKED').length;
  const lockPercent = totalScenes > 0 ? Math.round((lockedCount / totalScenes) * 100) : 0;
  
  const vfxTotal = project.scenes.reduce((acc, s) => acc + (s.vfx.shotsCount || 0), 0);
  const vfxDone = project.scenes.reduce((acc, s) => acc + (s.vfx.shotsApproved || 0), 0);
  const vfxPercent = vfxTotal > 0 ? Math.round((vfxDone / vfxTotal) * 100) : 0;

  const getRoleSpecificContent = () => {
    switch (currentRoleKey) {
      case 'LEAD_EDITOR':
        return {
          badge: "Editorial Suite Active",
          title: `Welcome, ${currentRole.defaultUser.name}`,
          description: "Assemble scenes, adjust frame pacing offsets, request Picture Lock sign-offs from Director, and generate OpenTimelineIO (.otio) timeline bundles.",
          primaryBtn: "Master Matrix",
          onPrimary: onNavigateToMatrix
        };
      case 'CRAFT_SUPERVISOR':
        return {
          badge: "VFX / Sound / Color Post Lab",
          title: `Welcome, ${currentRole.defaultUser.name}`,
          description: `Supervise ${vfxTotal} VFX shots (${vfxPercent}% approved), assign 3D look-dev LUTs, and monitor Dolby Atmos -24 LKFS mix turnarounds.`,
          primaryBtn: "Department Board",
          onPrimary: onNavigateToMatrix
        };
      case 'CLIENT_REVIEWER':
        return {
          badge: "Executive Screening Room",
          title: `Welcome, ${currentRole.defaultUser.name}`,
          description: "Screen cuts in real time, submit timestamped feedback ratings, flag review approvals, and monitor delivery velocity on Grafana analytics.",
          primaryBtn: "Screening Analytics",
          onPrimary: onNavigateToAnalytics
        };
      case 'EXECUTIVE_DIRECTOR':
      default:
        return {
          badge: "Director Studio Operating System",
          title: `Welcome, ${project.director} & ${project.leadEditor}`,
          description: "Train Platform synchronizes your editorial cut with Sound, VFX, Color, and Mastering. Ingest screenplays in PDF/DOCX format or audit schedule with Gemini Enterprise Multi-Agents.",
          primaryBtn: "Import PDF / DOCX",
          onPrimary: onOpenImport
        };
    }
  };

  const roleContent = getRoleSpecificContent();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#161B2B] via-[#141824] to-[#121620] border-b border-[#242C42] px-6 py-4">
      {/* Ambient background blur glow */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-64 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentRole.badgeColor}`}>
              <Sparkles className="w-3 h-3 mr-1" />
              Level {currentRole.level}: {roleContent.badge}
            </span>
            <span className="text-xs text-gray-400">&bull; Production Project: <strong className="text-white">{project.title}</strong></span>
          </div>

          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>{roleContent.title}</span>
          </h2>

          <p className="text-xs text-gray-300 max-w-3xl leading-relaxed">
            {roleContent.description}
          </p>
        </div>

        {/* Milestone Quick Summary Cards */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="bg-[#0B0D13]/80 border border-[#242C42] rounded-xl px-4 py-2 min-w-[130px]">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Picture Lock</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">{lockPercent}% Complete</div>
            <div className="w-full bg-gray-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${lockPercent}%` }} />
            </div>
          </div>

          <div className="bg-[#0B0D13]/80 border border-[#242C42] rounded-xl px-4 py-2 min-w-[130px]">
            <div className="text-[10px] uppercase font-semibold text-gray-400">VFX Delivery</div>
            <div className="text-sm font-bold text-purple-400 mt-0.5">{vfxPercent}% Approved</div>
            <div className="w-full bg-gray-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${vfxPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateToBoard && (
            <button
              onClick={onNavigateToBoard}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-white text-xs font-semibold border border-amber-500/30 transition shadow-sm"
              title="View Public Board of Directors Notes"
            >
              <Pin className="w-3.5 h-3.5 text-amber-400" />
              <span>Directors' Board</span>
            </button>
          )}

          {onNavigateToDirectorAi && (
            <button
              onClick={onNavigateToDirectorAi}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition shadow-sm"
              title="Open Director AI Overview Copilot"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>Director AI</span>
            </button>
          )}

          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1E2333] hover:bg-[#2C344B] text-gray-300 hover:text-white text-xs font-semibold border border-[#2C344B] transition shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Platform Guide</span>
            </button>
          )}

          <button
            onClick={onOpenRoleMatrix}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1E2333] hover:bg-[#2C344B] text-indigo-300 hover:text-white text-xs font-semibold border border-[#2C344B] transition"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Switch User Level</span>
          </button>

          <button
            onClick={onNavigateToAnalytics}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1E2333] hover:bg-[#2C344B] text-gray-300 hover:text-white text-xs font-semibold border border-[#2C344B] transition"
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
