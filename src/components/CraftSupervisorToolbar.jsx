import React, { useState } from 'react';
import { 
  Sparkles, Volume2, Palette, CheckCircle2, Plus, Minus, 
  Layers, Sliders, Check, RefreshCw, AlertCircle, Film
} from 'lucide-react';
import { USER_ROLES, LUT_PRESETS } from '../services/userRoles';

export default function CraftSupervisorToolbar({ 
  selectedScene, 
  onUpdateSceneCraft, 
  currentRoleKey 
}) {
  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;
  const isCraftSupervisor = currentRoleKey === 'CRAFT_SUPERVISOR';
  const [activeSubCraft, setActiveSubCraft] = useState('vfx'); // 'vfx' | 'sound' | 'color' | 'mastering'

  if (!selectedScene) return null;

  const handleVfxShotChange = (delta) => {
    const currentApproved = selectedScene.vfx?.shotsApproved || 0;
    const currentTotal = selectedScene.vfx?.shotsCount || 1;
    const nextApproved = Math.max(0, Math.min(currentTotal, currentApproved + delta));

    onUpdateSceneCraft(selectedScene.id, 'vfx', {
      ...selectedScene.vfx,
      shotsApproved: nextApproved,
      status: nextApproved === currentTotal ? 'APPROVED' : 'IN_PROGRESS'
    });
  };

  const handleTotalShotsChange = (delta) => {
    const currentTotal = selectedScene.vfx?.shotsCount || 1;
    const nextTotal = Math.max(1, currentTotal + delta);
    const currentApproved = Math.min(selectedScene.vfx?.shotsApproved || 0, nextTotal);

    onUpdateSceneCraft(selectedScene.id, 'vfx', {
      ...selectedScene.vfx,
      shotsCount: nextTotal,
      shotsApproved: currentApproved,
      status: currentApproved === nextTotal ? 'APPROVED' : 'IN_PROGRESS'
    });
  };

  const handleLutChange = (lutId) => {
    onUpdateSceneCraft(selectedScene.id, 'color', {
      ...selectedScene.color,
      lut: lutId,
      status: selectedScene.color.status === 'PENDING_LOCK' ? 'IN_GRADE' : selectedScene.color.status
    });
  };

  const handleSoundStatusChange = (status) => {
    onUpdateSceneCraft(selectedScene.id, 'sound', {
      ...selectedScene.sound,
      status: status
    });
  };

  const handleColorStatusChange = (status) => {
    onUpdateSceneCraft(selectedScene.id, 'color', {
      ...selectedScene.color,
      status: status
    });
  };

  const handleMasteringStatusChange = (status) => {
    onUpdateSceneCraft(selectedScene.id, 'mastering', {
      ...selectedScene.mastering,
      status: status
    });
  };

  return (
    <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2333]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">
                Department Craft Console (Level 3)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                Scene {selectedScene.sceneNumber}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono truncate max-w-md">
              {selectedScene.slugline}
            </p>
          </div>
        </div>

        {/* Sub-Craft Switcher */}
        <div className="flex items-center space-x-1.5 bg-[#0B0D13] p-1 rounded-xl border border-[#1E2333]">
          <button
            onClick={() => setActiveSubCraft('vfx')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeSubCraft === 'vfx'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>VFX Turnovers</span>
          </button>

          <button
            onClick={() => setActiveSubCraft('sound')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeSubCraft === 'sound'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <span>Sound &amp; Mix</span>
          </button>

          <button
            onClick={() => setActiveSubCraft('color')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeSubCraft === 'color'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Palette className="w-3 h-3 text-emerald-400" />
            <span>Color / 3D LUTs</span>
          </button>

          <button
            onClick={() => setActiveSubCraft('mastering')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeSubCraft === 'mastering'
                ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-rose-400" />
            <span>QC &amp; DCI</span>
          </button>
        </div>
      </div>

      {/* VFX Controls */}
      {activeSubCraft === 'vfx' && (
        <div className="space-y-3 bg-[#0B0D13] p-4 rounded-xl border border-[#1E2333]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                Visual Effects Shot Counter &amp; Comp Approvals
              </span>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Manage plate turnover counters and composite sign-offs for CGI shots.
              </p>
            </div>

            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
              selectedScene.vfx.status === 'APPROVED' 
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
            }`}>
              {selectedScene.vfx.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Approved Shots Counter */}
            <div className="p-3 bg-[#141721] rounded-xl border border-[#1E2333] space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Approved Shots</span>
                <span className="font-mono text-white font-bold">
                  {selectedScene.vfx.shotsApproved || 0} / {selectedScene.vfx.shotsCount || 1}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVfxShotChange(-1)}
                  disabled={!selectedScene.vfx.shotsApproved || selectedScene.vfx.shotsApproved <= 0}
                  className="p-1.5 rounded-lg bg-[#0B0D13] hover:bg-[#1A2030] disabled:opacity-40 text-gray-300 transition border border-[#1E2333]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 bg-[#0B0D13] h-2 rounded-full overflow-hidden border border-[#1E2333]">
                  <div 
                    className="bg-purple-400 h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.round(((selectedScene.vfx.shotsApproved || 0) / (selectedScene.vfx.shotsCount || 1)) * 100)}%` 
                    }}
                  />
                </div>
                <button
                  onClick={() => handleVfxShotChange(1)}
                  disabled={(selectedScene.vfx.shotsApproved || 0) >= (selectedScene.vfx.shotsCount || 1)}
                  className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Total Shots in Scene */}
            <div className="p-3 bg-[#141721] rounded-xl border border-[#1E2333] space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Total VFX Shots in Scene</span>
                <span className="font-mono text-purple-300 font-bold">
                  {selectedScene.vfx.shotsCount || 1} Shots
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleTotalShotsChange(-1)}
                  className="px-2.5 py-1 rounded-lg bg-[#0B0D13] hover:bg-[#1A2030] text-xs font-semibold text-gray-300 border border-[#1E2333] transition"
                >
                  -1 Shot
                </button>
                <button
                  onClick={() => handleTotalShotsChange(1)}
                  className="px-2.5 py-1 rounded-lg bg-[#161B29] hover:bg-[#222B40] text-xs font-semibold text-purple-300 border border-[#222B40] transition"
                >
                  +1 Shot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sound Controls */}
      {activeSubCraft === 'sound' && (
        <div className="space-y-3 bg-[#0B0D13] p-4 rounded-xl border border-[#1E2333]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Audio Post &amp; Sound Mix Status
            </span>
            <span className="text-xs font-mono text-gray-400">Target: -24 LKFS (Dolby Atmos)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {['NOT_STARTED', 'SPOTTING', 'DESIGN', 'FINAL_MIX'].map((st) => (
              <button
                key={st}
                onClick={() => handleSoundStatusChange(st)}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                  selectedScene.sound.status === st
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-900/20'
                    : 'bg-[#141721] text-gray-400 border-[#1E2333] hover:text-gray-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Controls */}
      {activeSubCraft === 'color' && (
        <div className="space-y-3 bg-[#0B0D13] p-4 rounded-xl border border-[#1E2333]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Look-Dev 3D LUT &amp; Color Grade Assignment
            </span>
            <div className="flex items-center space-x-1.5">
              {['PENDING_LOCK', 'IN_GRADE', 'REVIEW', 'APPROVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleColorStatusChange(st)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    selectedScene.color.status === st
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-[#141721] text-gray-400 border-[#1E2333]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Active Show LUT / Color Space Emulation:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LUT_PRESETS.map((lut) => (
                <button
                  key={lut.id}
                  onClick={() => handleLutChange(lut.id)}
                  className={`p-2 rounded-xl text-left text-xs border transition flex items-center justify-between ${
                    selectedScene.color?.lut === lut.id
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#141721] border-[#1E2333] text-gray-300 hover:border-[#2C344B]'
                  }`}
                >
                  <span className="truncate">{lut.name}</span>
                  {selectedScene.color?.lut === lut.id && <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400 ml-2" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mastering & QC Controls */}
      {activeSubCraft === 'mastering' && (
        <div className="space-y-3 bg-[#0B0D13] p-4 rounded-xl border border-[#1E2333]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              DCI / IMF QC Verification Status
            </span>
            <span className="text-xs font-mono text-gray-400">DCI-P3 / SMPTE 2067-2</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {['PENDING', 'QC_CHECK', 'PASSED', 'PACKAGED'].map((st) => (
              <button
                key={st}
                onClick={() => handleMasteringStatusChange(st)}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                  selectedScene.mastering.status === st
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-900/20'
                    : 'bg-[#141721] text-gray-400 border-[#1E2333] hover:text-gray-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
