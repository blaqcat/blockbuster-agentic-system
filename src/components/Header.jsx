import React from 'react';
import { Film, Clapperboard, Download, Upload, Zap, ShieldCheck, LogOut, User, Sparkles, Layers, HelpCircle } from 'lucide-react';
import UserRoleSwitcher from './UserRoleSwitcher';
import { USER_ROLES } from '../services/userRoles';

export default function Header({ 
  project, 
  onOpenExport, 
  onOpenImport, 
  currentRoleKey,
  onSelectRole,
  onOpenRoleMatrix,
  onOpenGuide,
  onSignOut 
}) {
  const totalScenes = project.scenes.length;
  const lockedScenes = project.scenes.filter(s => s.picture.status === 'LOCKED').length;
  const pictureLockPercent = Math.round((lockedScenes / (totalScenes || 1)) * 100);

  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;
  const canImport = currentRole.permissions.canImportScript;
  const canExport = currentRole.permissions.canExportTimeline;

  return (
    <header className="bg-[#141721] border-b border-[#1E2333] px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Film className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="text-[9px] sm:text-[10px] font-black tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded shrink-0">
              TRAIN PLATFORM
            </span>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">{project.title}</h1>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 truncate hidden xs:block sm:block">
            Dir: <span className="text-gray-200">{project.director}</span> &bull; Ed: <span className="text-gray-200">{project.leadEditor}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 sm:space-x-3 text-xs shrink-0">
        {/* Milestone Indicator - Desktop Only */}
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

        {/* First-Time & Ongoing Platform Guide Tour */}
        {onOpenGuide && (
          <button 
            onClick={onOpenGuide}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition active:scale-95"
            title="Train Platform Navigation Guide & Tour"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>
        )}

        {/* Action Buttons based on Role Permissions */}
        {canImport && (
          <button 
            onClick={onOpenImport}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1E2333] hover:bg-[#2C344B] text-gray-200 text-xs font-medium border border-[#2C344B] transition active:scale-95"
            title="Import Screenplay (PDF / DOCX)"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Import Script</span>
          </button>
        )}

        {canExport && (
          <button 
            onClick={onOpenExport}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition active:scale-95"
            title="Export OTIO / XML Timeline"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export OTIO</span>
          </button>
        )}

        {onSignOut && (
          <button
            onClick={onSignOut}
            title="Sign Out / Switch Account"
            className="text-gray-400 hover:text-rose-400 p-2 sm:p-1.5 rounded-lg bg-[#0B0D13] border border-[#1E2333] transition active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
