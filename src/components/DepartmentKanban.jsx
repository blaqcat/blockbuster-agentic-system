import React from 'react';
import { DEPARTMENTS } from '../mockData';

export default function DepartmentKanban({ 
  selectedDept, 
  onSelectDept, 
  filteredScenes, 
  onSelectScene 
}) {
  const getColumns = (dept) => {
    switch (dept) {
      case 'picture':
        return [
          { key: 'ASSEMBLY', title: 'Assembly' },
          { key: 'ROUGH_CUT', title: 'Rough Cut' },
          { key: 'FINE_CUT', title: 'Fine Cut' },
          { key: 'LOCKED', title: 'Picture Lock 🔒' },
        ];
      case 'sound':
        return [
          { key: 'NOT_STARTED', title: 'Not Started' },
          { key: 'SPOTTING', title: 'Spotting / ADR' },
          { key: 'DESIGN', title: 'Sound Design & Foley' },
          { key: 'FINAL_MIX', title: 'Final Mix' },
        ];
      case 'vfx':
        return [
          { key: 'PLATES_PULLED', title: 'Plates Pulled' },
          { key: 'IN_PROGRESS', title: 'Comp & 3D' },
          { key: 'REVIEW', title: 'Director Review' },
          { key: 'APPROVED', title: 'Final Approved ✨' },
        ];
      case 'color':
        return [
          { key: 'PENDING_LOCK', title: 'Awaiting Picture Lock' },
          { key: 'IN_GRADE', title: 'Look Dev & Primary' },
          { key: 'REVIEW', title: 'Review Pass' },
          { key: 'APPROVED', title: 'Graded & Signed Off 🎨' },
        ];
      case 'mastering':
        return [
          { key: 'PENDING', title: 'Pending Cuts' },
          { key: 'QC_CHECK', title: 'QC Verification' },
          { key: 'PASSED', title: 'QC Passed' },
          { key: 'PACKAGED', title: 'DCP / Master Ready 📦' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        {DEPARTMENTS.map(dept => (
          <button
            key={dept.id}
            onClick={() => onSelectDept(dept.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
              selectedDept === dept.id
                ? `${dept.bg} ${dept.color} ${dept.border} ring-1 ring-indigo-500/30`
                : 'bg-[#141721] text-gray-400 border-[#1E2333] hover:text-gray-200'
            }`}
          >
            <span>{dept.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {getColumns(selectedDept).map(col => (
          <div key={col.key} className="bg-[#141721]/80 border border-[#1E2333] rounded-2xl p-3.5 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2333] mb-3">
              <span className="font-semibold text-xs tracking-wider uppercase text-gray-300">{col.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#1E2333] text-[10px] font-mono text-gray-400">
                {filteredScenes.filter(s => s[selectedDept]?.status === col.key).length}
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {filteredScenes
                .filter(s => s[selectedDept]?.status === col.key)
                .map(scene => (
                  <div 
                    key={scene.id} 
                    onClick={() => onSelectScene(scene)}
                    className="p-3 bg-[#0B0D13] rounded-xl border border-[#1E2333] hover:border-indigo-500/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-amber-400">Scene {scene.sceneNumber}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{scene.runtimeEst}</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-200 truncate">{scene.slugline}</div>
                    {scene[selectedDept]?.note && (
                      <p className="text-[11px] text-gray-400 mt-2 bg-[#141721] p-2 rounded border border-[#1E2333]">
                        {scene[selectedDept].note}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
