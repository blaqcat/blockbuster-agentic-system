import React from 'react';
import { DEPARTMENTS } from '../mockData';
import { USER_ROLES } from '../services/userRoles';
import { ArrowRight, ArrowLeft, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DepartmentKanban({ 
  selectedDept, 
  onSelectDept, 
  filteredScenes, 
  onSelectScene,
  onUpdateStatus,
  currentRoleKey 
}) {
  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;

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

  const columns = getColumns(selectedDept);

  const canMoveScene = (deptKey, targetColKey) => {
    if (currentRoleKey === 'EXECUTIVE_DIRECTOR') return true;
    if (currentRoleKey === 'LEAD_EDITOR') {
      return deptKey === 'picture' && targetColKey !== 'LOCKED';
    }
    if (currentRoleKey === 'CRAFT_SUPERVISOR') {
      return deptKey !== 'picture';
    }
    return false; // Level 4 is read-only
  };

  const handleMoveColumn = (e, scene, currentKey, direction) => {
    e.stopPropagation();
    const colKeys = columns.map(c => c.key);
    const currentIndex = colKeys.indexOf(currentKey);
    const nextIndex = currentIndex + direction;

    if (nextIndex >= 0 && nextIndex < colKeys.length) {
      const nextKey = colKeys[nextIndex];
      if (!canMoveScene(selectedDept, nextKey)) {
        if (nextKey === 'LOCKED') {
          alert("Picture Lock requires Level 1 (Executive Director) authorization.");
        } else {
          alert(`Status updates restricted for ${currentRole.title}.`);
        }
        return;
      }
      onUpdateStatus(scene.id, selectedDept, nextKey);
    }
  };

  return (
    <div className="space-y-4">
      {/* Department Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
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

        <div className="flex items-center space-x-2 text-[11px] text-gray-400 font-mono">
          <span className={`px-2 py-0.5 rounded border uppercase text-[10px] font-bold ${currentRole.badgeColor}`}>
            L{currentRole.level} Access
          </span>
          {currentRoleKey === 'CLIENT_REVIEWER' ? (
            <span className="text-sky-300">Screening Mode (Read-Only Swimlanes)</span>
          ) : (
            <span>Use arrows on cards to advance stages</span>
          )}
        </div>
      </div>

      {/* Kanban Swimlanes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {columns.map((col, colIdx) => (
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
                    className="p-3.5 bg-[#0B0D13] rounded-xl border border-[#1E2333] hover:border-indigo-500/50 transition cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">Scene {scene.sceneNumber}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{scene.runtimeEst}</span>
                    </div>

                    <div className="text-xs font-semibold text-gray-200 truncate">{scene.slugline}</div>
                    
                    {scene[selectedDept]?.note && (
                      <p className="text-[11px] text-gray-400 bg-[#141721] p-2 rounded-lg border border-[#1E2333] leading-relaxed">
                        {scene[selectedDept].note}
                      </p>
                    )}

                    {/* Interactive Stage Move Controls */}
                    {currentRoleKey !== 'CLIENT_REVIEWER' && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#1E2333]/60">
                        <button
                          disabled={colIdx === 0}
                          onClick={(e) => handleMoveColumn(e, scene, col.key, -1)}
                          className="p-1 rounded bg-[#141721] hover:bg-[#1E2436] disabled:opacity-20 text-gray-300 text-[10px] flex items-center space-x-1 transition border border-[#1E2333]"
                          title="Move to previous stage"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>Back</span>
                        </button>

                        <button
                          disabled={colIdx === columns.length - 1}
                          onClick={(e) => handleMoveColumn(e, scene, col.key, 1)}
                          className="p-1 px-2 rounded bg-indigo-600/30 hover:bg-indigo-600/50 disabled:opacity-20 text-indigo-300 text-[10px] font-semibold flex items-center space-x-1 transition border border-indigo-500/30"
                          title="Advance to next stage"
                        >
                          <span>Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
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
