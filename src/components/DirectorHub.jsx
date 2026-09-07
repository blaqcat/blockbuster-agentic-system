import React, { useState } from 'react';
import { 
  MessageSquare, Film, Sparkles, Star, CheckCircle2, Send, 
  User, Clock, ShieldCheck, Eye 
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';

export default function DirectorHub({ 
  project, 
  selectedScene, 
  onSelectScene, 
  onAddDirectorNote,
  clientReviews,
  onAddClientReview,
  currentRoleKey 
}) {
  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;
  const [noteInputs, setNoteInputs] = useState({});
  const [activeFilter, setActiveFilter] = useState('ALL');

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
      <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-6 space-y-6">
        
        {/* Hub Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1E2333]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${currentRole.badgeColor}`}>
                Level {currentRole.level}: {currentRole.shortTitle}
              </span>
              <span className="text-xs text-gray-400">&bull; Cross-Department Spotting &amp; Stakeholder Notes</span>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span>Director &amp; Editorial Spotting Log</span>
            </h3>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap sm:flex-wrap -mx-1 px-1">
            <span className="text-xs text-gray-400 font-mono shrink-0">Filter by Act:</span>
            {['ALL', 'Act I', 'Act IIA', 'Act IIB', 'Act III'].map((act) => (
              <button
                key={act}
                onClick={() => setActiveFilter(act)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border shrink-0 ${
                  activeFilter === act
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                    : 'bg-[#0B0D13] text-gray-400 border-[#1E2333] hover:text-gray-200'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>
        
        {/* Scene Cards List */}
        <div className="space-y-4">
          {project.scenes
            .filter(s => activeFilter === 'ALL' || s.act === activeFilter)
            .map(s => {
              const reviews = clientReviews?.[s.id] || [];
              const isSelected = selectedScene?.id === s.id;

              return (
                <div 
                  key={s.id} 
                  onClick={() => onSelectScene(s)}
                  className={`p-4 sm:p-5 bg-[#0B0D13] rounded-2xl border transition cursor-pointer ${
                    isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/30 bg-[#0E121C]' : 'border-[#1E2333] hover:border-[#2C344B]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Scene Header */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-[#141721] border border-[#1E2333]">
                          Scene {s.sceneNumber} ({s.act})
                        </span>
                        <span className="text-sm font-semibold text-gray-200">{s.slugline}</span>
                        <span className="text-xs text-gray-400 font-mono">Runtime: {s.runtimeEst}</span>
                      </div>

                      {/* Department Notes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs pt-1">
                        {s.picture.note && (
                          <div className="p-2.5 rounded-xl bg-[#141721] border border-[#1E2333]">
                            <strong className="text-amber-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Picture Cut / Pacing:</strong> 
                            <span className="text-gray-300 leading-relaxed">{s.picture.note}</span>
                          </div>
                        )}
                        {s.vfx.note && (
                          <div className="p-2.5 rounded-xl bg-[#141721] border border-[#1E2333]">
                            <strong className="text-purple-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">VFX Notes:</strong> 
                            <span className="text-gray-300 leading-relaxed">{s.vfx.note}</span>
                          </div>
                        )}
                        {s.color.note && (
                          <div className="p-2.5 rounded-xl bg-[#141721] border border-[#1E2333]">
                            <strong className="text-emerald-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Color &amp; LUT:</strong> 
                            <span className="text-gray-300 leading-relaxed">{s.color.note}</span>
                          </div>
                        )}
                      </div>

                      {/* Client Reviews Section */}
                      {reviews.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1 mb-1.5">
                            <Star className="w-3 h-3 fill-sky-400" />
                            <span>Client Screening Feedback ({reviews.length})</span>
                          </span>
                          <div className="space-y-1.5">
                            {reviews.map(r => (
                              <div key={r.id} className="p-2.5 rounded-xl bg-sky-950/20 border border-sky-500/20 text-xs flex items-start justify-between">
                                <div>
                                  <span className="font-semibold text-white mr-2">{r.author}:</span>
                                  <span className="text-sky-200">"{r.comment}"</span>
                                </div>
                                <span className="text-[10px] text-sky-400 font-mono shrink-0 ml-2">{r.timestamp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Add Director / Editorial Note */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 shrink-0">
                      <input 
                        type="text" 
                        placeholder="Add director / spotting note..."
                        value={noteInputs[s.id] || ''}
                        onChange={(e) => handleNoteChange(s.id, e.target.value)}
                        className="bg-[#141721] border border-[#1E2333] rounded-xl px-3.5 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-full sm:w-64 font-sans"
                      />
                      <button 
                        onClick={() => handleSaveNote(s.id)}
                        disabled={!noteInputs[s.id]?.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-xs font-semibold text-white transition shadow-sm"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
