import React from 'react';
import StatusBadge from './StatusBadge';

export default function MasterMatrix({ filteredScenes, selectedScene, onSelectScene, onUpdateStatus }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-[#141721] rounded-t-xl border border-[#1E2333] text-[11px] font-bold uppercase tracking-wider text-gray-400">
        <div className="col-span-1">Scene</div>
        <div className="col-span-3">Slugline & Cast</div>
        <div className="col-span-1 text-center">Runtime</div>
        <div className="col-span-1 text-center">Picture</div>
        <div className="col-span-2 text-center">Sound Post</div>
        <div className="col-span-2 text-center">VFX Progress</div>
        <div className="col-span-1 text-center">Color</div>
        <div className="col-span-1 text-center">Master</div>
      </div>

      <div className="space-y-2">
        {filteredScenes.map((scene) => (
          <div 
            key={scene.id} 
            onClick={() => onSelectScene(scene)}
            className={`grid grid-cols-12 gap-3 items-center px-4 py-3 bg-[#141721] rounded-xl border transition cursor-pointer hover:border-indigo-500/50 ${
              selectedScene?.id === scene.id ? 'border-indigo-500 bg-[#141721]/90 ring-1 ring-indigo-500/30' : 'border-[#1E2333]'
            }`}
          >
            <div className="col-span-1 flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-[#1E2333] font-mono font-bold text-xs flex items-center justify-center text-amber-400 border border-[#2C344B]">
                {scene.sceneNumber}
              </span>
              <span className="text-[10px] text-gray-400">{scene.act}</span>
            </div>

            <div className="col-span-3">
              <div className="font-mono text-xs font-semibold text-gray-200 truncate">{scene.slugline}</div>
              <div className="text-[11px] text-gray-400 truncate mt-0.5">
                Cast: {scene.characters.join(', ')}
              </div>
            </div>

            <div className="col-span-1 text-center font-mono text-xs text-gray-300">
              {scene.runtimeEst}
            </div>

            <div className="col-span-1 flex justify-center">
              <StatusBadge 
                status={scene.picture.status} 
                onClick={(e) => {
                  e.stopPropagation();
                  const next = scene.picture.status === 'LOCKED' ? 'FINE_CUT' : 'LOCKED';
                  onUpdateStatus(scene.id, 'picture', next);
                }}
              />
            </div>

            <div className="col-span-2 flex justify-center">
              <StatusBadge status={scene.sound.status} />
            </div>

            <div className="col-span-2 flex flex-col items-center justify-center">
              <StatusBadge status={scene.vfx.status} />
              <span className="text-[10px] text-purple-300 font-mono mt-1">
                {scene.vfx.shotsApproved}/{scene.vfx.shotsCount} shots
              </span>
            </div>

            <div className="col-span-1 flex justify-center">
              <StatusBadge status={scene.color.status} />
            </div>

            <div className="col-span-1 flex justify-center">
              <StatusBadge status={scene.mastering.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
