import React from 'react';
import { Film, Clapperboard, Download, Upload, Zap, ShieldCheck, LogOut, User, Sparkles, Layers } from 'lucide-react';
import UserRoleSwitcher from './UserRoleSwitcher';
import { USER_ROLES } from '../services/userRoles';

export default function Header({ 
  project, 
  onOpenExport, 
  onOpenImport, 
  currentRoleKey,
  onSelectRole,
  onOpenRoleMatrix,
  onSignOut 
}) {
  const totalScenes = project.scenes.length;
  const lockedScenes = project.scenes.filter(s => s.picture.status === 'LOCKED').length;
  const pictureLockPercent = Math.round((lockedScenes / (totalScenes || 1)) * 100);

  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;
  const canImport = currentRole.permissions.canImportScript;
  const canExport = currentRole.permissions.canExportTimeline;

  return (
    <header className="bg-[#141721] border-b border-[#1E2333] px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
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

      <div className="flex flex-wrap items-center space-x-3 text-xs">
        {/* Milestone Indicator */}
        <div className="hidden lg:flex bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3.5 py-1.5 items-center space-x-3">
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-bold">Picture Lock Progress</div>
            <div className="font-mono text-xs font-bold text-emerald-400">{lockedScenes}/{totalScenes} Scenes ({pictureLockPercent}%)</div>
          </div>
          <div className="w-16 bg-[#1E2333] h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${pictureLockPercent}%` }} />
          </div>
        </div>

        {/* 4 Levels of Users Role Switcher */}
        <UserRoleSwitcher 
          currentRoleKey={currentRoleKey}
          onSelectRole={onSelectRole}
          onOpenRoleMatrix={onOpenRoleMatrix}
        />

        {/* Action Buttons based on Role Permissions */}
        {canImport ? (
          <button 
            onClick={onOpenImport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1E2333] hover:bg-[#2C344B] text-gray-200 text-xs font-medium border border-[#2C344B] transition"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Import Script</span>
          </button>
        ) : (
          <button 
            onClick={() => alert(`Importing screenplays requires Level 1 (Executive Director) authority. You are currently logged in as ${currentRole.title}.`)}
            title="Script Ingestion restricted to Level 1 Director"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141721] text-gray-500 text-xs font-medium border border-[#1E2333] cursor-not-allowed opacity-60"
          >
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>Import Script</span>
          </button>
        )}

        {canExport ? (
          <button 
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export OTIO / XML</span>
          </button>
        ) : (
          <button 
            onClick={() => alert(`Timeline export is reserved for Level 1 (Director) and Level 2 (Lead Editor).`)}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1E2333] text-gray-500 text-xs font-medium border border-[#1E2333] cursor-not-allowed opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export OTIO</span>
          </button>
        )}

        {onSignOut && (
          <button
            onClick={onSignOut}
            title="Sign Out / Switch Account"
            className="text-gray-400 hover:text-rose-400 p-1.5 rounded-lg bg-[#0B0D13] border border-[#1E2333] transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
