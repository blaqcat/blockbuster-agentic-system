import React, { useState } from 'react';
import { 
  Film, Scissors, Clock, CheckCircle2, Lock, ArrowUpRight, 
  Send, Sparkles, AlertCircle, Download
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';

export default function EditorToolsWidget({ 
  selectedScene, 
  onUpdateScenePicture, 
  onRequestLockSignOff, 
  onOpenExport,
  currentRoleKey 
}) {
  const [editorNote, setEditorNote] = useState('');
  const [trimOffset, setTrimOffset] = useState(0);
  const [lockRequested, setLockRequested] = useState(false);

  if (!selectedScene) return null;

  const handleCutStageChange = (newStatus) => {
    onUpdateScenePicture(selectedScene.id, {
      ...selectedScene.picture,
      status: newStatus
    });
  };

  const handleApplyTrim = (frames) => {
    setTrimOffset(prev => prev + frames);
    const sign = frames > 0 ? `+${frames}` : `${frames}`;
    const updatedNote = (selectedScene.picture.note ? selectedScene.picture.note + " | " : "") + `Trim ${sign} frames (Lead Editor)`;
    
    onUpdateScenePicture(selectedScene.id, {
      ...selectedScene.picture,
      note: updatedNote
    });
  };

  const handleRequestLock = () => {
    setLockRequested(true);
    onRequestLockSignOff(selectedScene.id);
    setTimeout(() => setLockRequested(false), 5000);
  };

  const handleSaveEditorNote = (e) => {
    e.preventDefault();
    if (!editorNote.trim()) return;

    const updatedNote = (selectedScene.picture.note ? selectedScene.picture.note + " | " : "") + editorNote.trim();
    onUpdateScenePicture(selectedScene.id, {
      ...selectedScene.picture,
      note: updatedNote
    });
    setEditorNote('');
  };

  return (
    <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2333]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">
                Editorial Cut Progression Console (Level 2)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                Scene {selectedScene.sceneNumber}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono truncate max-w-md">
              {selectedScene.slugline}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1E2333] hover:bg-[#2C344B] text-amber-300 text-xs font-semibold border border-[#2C344B] transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export OTIO Turnover</span>
        </button>
      </div>

      {/* Cut Stage Buttons */}
      <div className="space-y-2 bg-[#0B0D13] p-4 rounded-xl border border-[#1E2333]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Picture Cut Stage Progression
          </span>
          <span className="text-[10px] font-mono text-gray-400">
            Current Status: <strong className="text-white">{selectedScene.picture.status}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {['ASSEMBLY', 'ROUGH_CUT', 'FINE_CUT'].map((stage) => (
            <button
              key={stage}
              onClick={() => handleCutStageChange(stage)}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                selectedScene.picture.status === stage
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-900/20'
                  : 'bg-[#141721] text-gray-400 border-[#1E2333] hover:text-gray-200'
              }`}
            >
              {stage.replace('_', ' ')}
            </button>
          ))}

          {/* Request Picture Lock Action Button */}
          <button
            onClick={handleRequestLock}
            className={`p-2.5 rounded-xl text-xs font-semibold border transition text-center flex items-center justify-center space-x-1.5 ${
              selectedScene.picture.status === 'LOCKED'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : lockRequested
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {selectedScene.picture.status === 'LOCKED' 
                ? "Locked (Sign-Off by L1)" 
                : lockRequested 
                ? "Lock Request Sent!" 
                : "Request Picture Lock"}
            </span>
          </button>
        </div>
      </div>

      {/* Frame Trim Tools */}
      <div className="space-y-2 bg-[#0B0D13] p-4 rounded-xl border border-[#1E2333]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            <span>NLE Cadence &amp; Frame Trimming</span>
          </span>
          <span className="text-[10px] font-mono text-gray-400">
            Cumulative Offset: <strong className="text-amber-400">{trimOffset >= 0 ? `+${trimOffset}` : trimOffset}f</strong>
          </span>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          {[-8, -4, -1, 1, 4, 8].map((frames) => (
            <button
              key={frames}
              onClick={() => handleApplyTrim(frames)}
              className="flex-1 py-1.5 bg-[#141721] hover:bg-[#1E2436] text-xs font-mono font-semibold text-gray-300 hover:text-amber-300 border border-[#1E2333] hover:border-amber-500/30 rounded-lg transition"
            >
              {frames > 0 ? `+${frames}f` : `${frames}f`}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Note Input */}
      <form onSubmit={handleSaveEditorNote} className="flex items-center space-x-2">
        <input
          type="text"
          value={editorNote}
          onChange={(e) => setEditorNote(e.target.value)}
          placeholder={`Add editorial cut note for Scene ${selectedScene.sceneNumber} (e.g. 'Shortened reaction beat by 6 frames on Vance')...`}
          className="flex-1 bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-amber-500 font-sans"
        />
        <button
          type="submit"
          disabled={!editorNote.trim()}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Save Note</span>
        </button>
      </form>
    </div>
  );
}
