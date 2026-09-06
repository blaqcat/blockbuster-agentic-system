import React from 'react';
import { Film, Clapperboard, Download, Upload, Zap, ShieldCheck, LogOut, User } from 'lucide-react';

export default function Header({ project, onOpenExport, onOpenImport, authUser, onSignOut }) {
  const totalScenes = project.scenes.length;
  const lockedScenes = project.scenes.filter(s => s.picture.status === 'LOCKED').length;
  const pictureLockPercent = Math.round((lockedScenes / (totalScenes || 1)) * 100);

  return (
    <header className="bg-[#141721] border-b border-[#1E2333] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
          <Film className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-white tracking-tight">{project.title}</h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Agentic Cinema
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Director: <span className="text-gray-200">{project.director}</span> &bull; Lead Editor: <span className="text-gray-200">{project.leadEditor}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-xs">
        {/* Milestone Indicator */}
        <div className="bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3.5 py-1.5 flex items-center space-x-3">
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-bold">Picture Lock Progress</div>
            <div className="font-mono text-xs font-bold text-emerald-400">{lockedScenes}/{totalScenes} Scenes ({pictureLockPercent}%)</div>
          </div>
          <div className="w-16 bg-[#1E2333] h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${pictureLockPercent}%` }}></div>
          </div>
        </div>

        {/* User Identity Badge */}
        {authUser && (
          <div className="bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
              {authUser.name ? authUser.name[0] : 'U'}
            </div>
            <div className="text-left hidden sm:block leading-tight">
              <div className="text-[11px] font-bold text-gray-200">{authUser.name || authUser.email}</div>
              <div className="text-[9px] text-gray-400 font-mono">{authUser.role || 'Authorized'}</div>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="text-gray-400 hover:text-rose-400 p-1 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <button 
          onClick={onOpenImport}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1E2333] hover:bg-[#2C344B] text-gray-200 text-xs font-medium border border-[#2C344B] transition"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          <span>Import Script</span>
        </button>

        <button 
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export OTIO / XML</span>
        </button>
      </div>
    </header>
  );
}
