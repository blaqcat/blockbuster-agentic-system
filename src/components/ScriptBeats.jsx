import React from 'react';

export default function ScriptBeats({ filteredScenes, selectedScene, onSelectScene }) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Scene Breakdown & Beats</h3>
        <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredScenes.map(scene => (
            <div 
              key={scene.id} 
              onClick={() => onSelectScene(scene)}
              className={`p-3 rounded-xl border transition cursor-pointer ${
                selectedScene?.id === scene.id 
                  ? 'bg-[#141721] border-indigo-500 ring-1 ring-indigo-500/40' 
                  : 'bg-[#141721]/60 border-[#1E2333] hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">SCENE {scene.sceneNumber}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
                  {scene.emotionalBeat}
                </span>
              </div>
              <div className="font-mono text-xs text-gray-200 mt-1 truncate">{scene.slugline}</div>
              <div className="flex items-center space-x-3 text-[11px] text-gray-400 mt-2">
                <span>Pages: {scene.pages}</span>
                <span>&bull;</span>
                <span>Est: {scene.runtimeEst}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-7 bg-[#141721] border border-[#1E2333] rounded-2xl p-6 flex flex-col justify-between">
        {selectedScene && (
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2333]">
              <div>
                <div className="font-mono text-sm font-bold text-amber-400">SCENE {selectedScene.sceneNumber} - {selectedScene.slugline}</div>
                <div className="text-xs text-gray-400 mt-0.5">Beat: <span className="text-indigo-300">{selectedScene.emotionalBeat}</span></div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#1E2333] text-xs font-mono text-gray-200">
                {selectedScene.pages} Pages &bull; {selectedScene.runtimeEst}
              </span>
            </div>

            <div className="my-6 p-6 bg-[#0B0D13] rounded-xl border border-[#1E2333] font-mono text-xs leading-relaxed text-gray-300 space-y-4">
              <p className="uppercase text-amber-300 font-bold">{selectedScene.slugline}</p>
              <p>{selectedScene.scriptSnippet}</p>
              <p className="text-gray-400 italic">// Director Rhythm Note: Cut on action beat, hold pause for dramatic tension.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0B0D13] p-3 rounded-lg border border-[#1E2333]">
                <div className="font-bold text-amber-400">Picture Cut Status</div>
                <div className="text-gray-300 mt-1">{selectedScene.picture.note || "No editorial notes."}</div>
              </div>
              <div className="bg-[#0B0D13] p-3 rounded-lg border border-[#1E2333]">
                <div className="font-bold text-cyan-400">Sound Post Design</div>
                <div className="text-gray-300 mt-1">{selectedScene.sound.note || "No sound notes."}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
