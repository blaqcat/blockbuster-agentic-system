import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export default function DirectorHub({ 
  project, 
  selectedScene, 
  onSelectScene, 
  onAddDirectorNote 
}) {
  const [noteInputs, setNoteInputs] = useState({});

  const handleNoteChange = (sceneId, value) => {
    setNoteInputs(prev => ({ ...prev, [sceneId]: value }));
  };

  const handleSaveNote = (sceneId) => {
    const text = noteInputs[sceneId];
    if (text && text.trim()) {
      onAddDirectorNote(sceneId, text.trim());
      setNoteInputs(prev => ({ ...prev, [sceneId]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Director & Lead Editor Spotting Log</span>
        </h3>
        
        <div className="space-y-3">
          {project.scenes.map(s => (
            <div key={s.id} className="p-4 bg-[#0B0D13] rounded-xl border border-[#1E2333] flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-amber-400">Scene {s.sceneNumber}</span>
                  <span className="text-xs font-semibold text-gray-300">{s.slugline}</span>
                </div>
                <div className="mt-2 space-y-1 text-xs">
                  {s.picture.note && (
                    <div className="text-gray-300"><strong className="text-amber-400">Picture:</strong> {s.picture.note}</div>
                  )}
                  {s.vfx.note && (
                    <div className="text-gray-300"><strong className="text-purple-400">VFX:</strong> {s.vfx.note}</div>
                  )}
                  {s.color.note && (
                    <div className="text-gray-300"><strong className="text-emerald-400">Color:</strong> {s.color.note}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="Add director note..."
                  value={noteInputs[s.id] || ''}
                  onChange={(e) => handleNoteChange(s.id, e.target.value)}
                  className="bg-[#141721] border border-[#1E2333] rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 w-56"
                />
                <button 
                  onClick={() => handleSaveNote(s.id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white transition shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
