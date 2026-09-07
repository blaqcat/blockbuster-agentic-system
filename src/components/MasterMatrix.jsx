import React from 'react';
import StatusBadge from './StatusBadge';
import EditorToolsWidget from './EditorToolsWidget';
import CraftSupervisorToolbar from './CraftSupervisorToolbar';
import ClientFeedbackWidget from './ClientFeedbackWidget';
import { USER_ROLES } from '../services/userRoles';
import { ShieldCheck, Film, Sparkles, Eye, Lock, MessageSquare, Star, CheckCircle2 } from 'lucide-react';

export default function MasterMatrix({ 
  filteredScenes, 
  selectedScene, 
  onSelectScene, 
  onUpdateStatus,
  onUpdateScenePicture,
  onUpdateSceneCraft,
  onAddClientReview,
  clientReviews,
  onRequestLockSignOff,
  onOpenExport,
  currentRoleKey 
}) {
  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;

  const handlePictureStatusClick = (e, scene) => {
    e.stopPropagation();
    onSelectScene(scene);

    if (currentRoleKey === 'EXECUTIVE_DIRECTOR') {
      const next = scene.picture.status === 'LOCKED' ? 'FINE_CUT' : 'LOCKED';
      onUpdateStatus(scene.id, 'picture', next);
    } else if (currentRoleKey === 'LEAD_EDITOR') {
      const progression = {
        ASSEMBLY: 'ROUGH_CUT',
        ROUGH_CUT: 'FINE_CUT',
        FINE_CUT: 'ASSEMBLY',
        LOCKED: 'FINE_CUT'
      };
      const next = progression[scene.picture.status] || 'FINE_CUT';
      onUpdateStatus(scene.id, 'picture', next);
    } else {
      // Level 3 & Level 4
      alert(`Picture cut lock status can only be modified by Level 1 (Director) and Level 2 (Lead Editor). You are currently logged in as ${currentRole.title}.`);
    }
  };

  const handleCraftStatusClick = (e, scene, deptKey) => {
    e.stopPropagation();
    onSelectScene(scene);

    if (currentRoleKey === 'CLIENT_REVIEWER') {
      return;
    }

    const nextStatuses = {
      sound: { NOT_STARTED: 'SPOTTING', SPOTTING: 'DESIGN', DESIGN: 'FINAL_MIX', FINAL_MIX: 'NOT_STARTED' },
      vfx: { PLATES_PULLED: 'IN_PROGRESS', IN_PROGRESS: 'REVIEW', REVIEW: 'APPROVED', APPROVED: 'PLATES_PULLED' },
      color: { PENDING_LOCK: 'IN_GRADE', IN_GRADE: 'REVIEW', REVIEW: 'APPROVED', APPROVED: 'PENDING_LOCK' },
      mastering: { PENDING: 'QC_CHECK', QC_CHECK: 'PASSED', PASSED: 'PACKAGED', PACKAGED: 'PENDING' }
    };

    const currentStatus = scene[deptKey]?.status || 'NOT_STARTED';
    const nextStatus = nextStatuses[deptKey]?.[currentStatus] || currentStatus;
    onUpdateStatus(scene.id, deptKey, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Table Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-[#141721] rounded-t-xl border border-[#1E2333] text-[11px] font-bold uppercase tracking-wider text-gray-400">
          <div className="col-span-1">Scene</div>
          <div className="col-span-3">Slugline &amp; Cast</div>
          <div className="col-span-1 text-center">Runtime</div>
          <div className="col-span-1 text-center">Picture</div>
          <div className="col-span-2 text-center">Sound Post</div>
          <div className="col-span-2 text-center">VFX Progress</div>
          <div className="col-span-1 text-center">Color</div>
          <div className="col-span-1 text-center">Master</div>
        </div>

        <div className="space-y-2">
          {filteredScenes.map((scene) => {
            const isSelected = selectedScene?.id === scene.id;
            const reviewCount = clientReviews?.[scene.id]?.length || 0;

            return (
              <div 
                key={scene.id} 
                onClick={() => onSelectScene(scene)}
                className={`grid grid-cols-12 gap-3 items-center px-4 py-3 bg-[#141721] rounded-xl border transition cursor-pointer hover:border-indigo-500/50 ${
                  isSelected ? 'border-indigo-500 bg-[#141721]/95 ring-1 ring-indigo-500/30' : 'border-[#1E2333]'
                }`}
              >
                <div className="col-span-1 flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2333] font-mono font-bold text-xs flex items-center justify-center text-amber-400 border border-[#2C344B]">
                    {scene.sceneNumber}
                  </span>
                  <span className="text-[10px] text-gray-400">{scene.act}</span>
                </div>

                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-semibold text-gray-200 truncate">{scene.slugline}</span>
                    {reviewCount > 0 && (
                      <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 text-[9px] font-mono">
                        <Star className="w-2.5 h-2.5 fill-sky-300" />
                        <span>{reviewCount}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate mt-0.5">
                    Cast: {scene.characters.join(', ')}
                  </div>
                </div>

                <div className="col-span-1 text-center font-mono text-xs text-gray-300">
                  {scene.runtimeEst}
                </div>

                {/* Picture Column */}
                <div className="col-span-1 flex justify-center">
                  <StatusBadge 
                    status={scene.picture.status} 
                    onClick={(e) => handlePictureStatusClick(e, scene)}
                  />
                </div>

                {/* Sound Column */}
                <div className="col-span-2 flex justify-center">
                  <StatusBadge 
                    status={scene.sound.status} 
                    onClick={(e) => handleCraftStatusClick(e, scene, 'sound')}
                  />
                </div>

                {/* VFX Column */}
                <div className="col-span-2 flex flex-col items-center justify-center">
                  <StatusBadge 
                    status={scene.vfx.status} 
                    onClick={(e) => handleCraftStatusClick(e, scene, 'vfx')}
                  />
                  <span className="text-[10px] text-purple-300 font-mono mt-1">
                    {scene.vfx.shotsApproved}/{scene.vfx.shotsCount} shots
                  </span>
                </div>

                {/* Color Column */}
                <div className="col-span-1 flex justify-center">
                  <StatusBadge 
                    status={scene.color.status} 
                    onClick={(e) => handleCraftStatusClick(e, scene, 'color')}
                  />
                </div>

                {/* Master Column */}
                <div className="col-span-1 flex justify-center">
                  <StatusBadge 
                    status={scene.mastering.status} 
                    onClick={(e) => handleCraftStatusClick(e, scene, 'mastering')}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Scene Interactive Role Workspace Console */}
      {selectedScene && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${currentRole.badgeColor}`}>
                Active Level {currentRole.level} Console
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Focused on Scene {selectedScene.sceneNumber}: {selectedScene.slugline}
              </span>
            </div>
          </div>

          {/* Render dedicated interactive console based on user level */}
          {currentRoleKey === 'LEAD_EDITOR' && (
            <EditorToolsWidget 
              selectedScene={selectedScene}
              onUpdateScenePicture={onUpdateScenePicture}
              onRequestLockSignOff={onRequestLockSignOff}
              onOpenExport={onOpenExport}
              currentRoleKey={currentRoleKey}
            />
          )}

          {currentRoleKey === 'CRAFT_SUPERVISOR' && (
            <CraftSupervisorToolbar 
              selectedScene={selectedScene}
              onUpdateSceneCraft={onUpdateSceneCraft}
              currentRoleKey={currentRoleKey}
            />
          )}

          {currentRoleKey === 'CLIENT_REVIEWER' && (
            <ClientFeedbackWidget 
              selectedScene={selectedScene}
              clientReviews={clientReviews}
              onAddReview={onAddClientReview}
              currentRoleKey={currentRoleKey}
            />
          )}

          {currentRoleKey === 'EXECUTIVE_DIRECTOR' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CraftSupervisorToolbar 
                selectedScene={selectedScene}
                onUpdateSceneCraft={onUpdateSceneCraft}
                currentRoleKey={currentRoleKey}
              />
              <ClientFeedbackWidget 
                selectedScene={selectedScene}
                clientReviews={clientReviews}
                onAddReview={onAddClientReview}
                currentRoleKey={currentRoleKey}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
