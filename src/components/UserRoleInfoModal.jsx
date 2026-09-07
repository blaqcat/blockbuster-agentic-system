import React from 'react';
import { 
  ShieldCheck, Film, Sparkles, Eye, CheckCircle2, XCircle, X, 
  ArrowRight, Users, Lock, Unlock, Sliders, AlertTriangle
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';

export default function UserRoleInfoModal({ 
  show, 
  onClose, 
  currentRoleKey, 
  onSelectRole 
}) {
  if (!show) return null;

  const roles = Object.values(USER_ROLES);

  const permissionRows = [
    { label: "Picture Lock Authority (Sign-off / Unlock)", key: "canSignPictureLock" },
    { label: "Picture Cut Progression (Assembly -> Fine Cut)", key: "canEditPictureCut" },
    { label: "VFX / Sound / Color Status Updates", key: "canEditAllDepartments" },
    { label: "Run Autonomous Gemini 1.5 Multi-Agent Fleet", key: "canRunAgentAudit" },
    { label: "Dispatch Google Chat / Slack Webhooks", key: "canDispatchWebhooks" },
    { label: "Universal Script Ingestion (.PDF / .DOCX)", key: "canImportScript" },
    { label: "Timeline Export (.OTIO / Final Cut Pro XML)", key: "canExportTimeline" },
    { label: "Director & Editorial Spotting Notes", key: "canAddDirectorNotes" },
    { label: "Client Screening Feedback & Star Ratings", key: "canAddClientReview" },
    { label: "Grafana Cloud Telemetry & Influx Endpoint", key: "canManageTelemetry" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#11141E] border border-[#222B40] rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2436]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                4-Level Role-Based Access Control (RBAC)
              </span>
              <span className="text-xs text-gray-400">&bull; Film Post-Production Enterprise Engine</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Interactive User Levels &amp; Permissions Matrix
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1A2030] hover:bg-[#252E45] text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => {
            const isCurrent = role.id === currentRoleKey;
            return (
              <div 
                key={role.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between transition ${
                  isCurrent 
                    ? 'bg-[#181E30] border-indigo-500 ring-2 ring-indigo-500/30' 
                    : 'bg-[#0E111A] border-[#1E2436] hover:border-[#2C344B]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${role.badgeColor}`}>
                      Level {role.level}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <img 
                      src={role.defaultUser.avatar} 
                      alt={role.defaultUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" 
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{role.title}</h4>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{role.defaultUser.name}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-300 leading-snug">
                    {role.tagline}
                  </p>

                  <div className="space-y-1 pt-2 border-t border-[#1E2436]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Core Duties:</span>
                    <ul className="text-[10px] text-gray-300 space-y-1">
                      {role.capabilities.slice(0, 3).map((cap, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span className="leading-tight">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      onSelectRole(role.id);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    }`}
                  >
                    <span>{isCurrent ? "Current Active Level" : `Switch to Level ${role.level}`}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Side-by-Side Permissions Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Side-by-Side Permissions Comparison</span>
          </h3>

          <div className="border border-[#1E2436] rounded-2xl overflow-hidden bg-[#0E111A]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#141824] border-b border-[#1E2436] text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                    <th className="py-3 px-4">Feature &amp; Studio Capability</th>
                    <th className="py-3 px-3 text-center text-indigo-400">L1: Director</th>
                    <th className="py-3 px-3 text-center text-amber-400">L2: Lead Editor</th>
                    <th className="py-3 px-3 text-center text-emerald-400">L3: Craft Lead</th>
                    <th className="py-3 px-3 text-center text-sky-400">L4: Client Reviewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2030] text-gray-300">
                  {permissionRows.map((row, i) => (
                    <tr key={i} className="hover:bg-[#141824]/50 transition">
                      <td className="py-2.5 px-4 font-medium text-gray-200">
                        {row.label}
                      </td>
                      {roles.map(role => {
                        const allowed = role.permissions[row.key];
                        return (
                          <td key={role.id} className="py-2.5 px-3 text-center">
                            {allowed ? (
                              <div className="inline-flex items-center justify-center text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center text-gray-600">
                                <XCircle className="w-4 h-4" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1E2436] text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Switch roles anytime to test unique workflows, permissions, and tools.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1A2030] hover:bg-[#252E45] text-white font-semibold transition"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
