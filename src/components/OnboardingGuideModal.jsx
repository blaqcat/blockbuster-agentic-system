import React, { useState } from 'react';
import { 
  Compass, X, ChevronRight, ChevronLeft, Check, Sparkles, 
  Film, Users, Bot, Layers, Upload, Download, BarChart3, 
  ShieldCheck, Zap, ArrowRight, Play, CheckCircle2 
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';

export default function OnboardingGuideModal({ 
  show, 
  onClose, 
  currentRoleKey, 
  onSelectRole,
  onNavigateTab 
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(true);

  if (!show) return null;

  const handleFinish = () => {
    if (dontShowAgain) {
      localStorage.setItem("train_platform_onboarding_completed", "true");
    }
    onClose();
  };

  const steps = [
    {
      id: "ethos",
      badge: "Welcome to Train Platform",
      title: "Riding the High-Speed Rails of Cinema Post-Production",
      subtitle: "Inspired by the Train Surfers of South Africa",
      icon: Compass,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
      content: (
        <div className="space-y-4 text-xs text-gray-300">
          <p className="text-sm text-gray-200 leading-relaxed">
            In film post-production, a movie is a high-speed locomotive racing toward locked festival and theatrical release dates. A bump in Picture Editing sends immediate shockwaves into Sound, VFX, Color, and Mastering.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0B0D14] border border-[#1E2436] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-xs">Real-Time Sync</h4>
              <p className="text-[11px] text-gray-400 leading-normal">
                All 5 post pillars (Picture, Sound, VFX, Color, QC) stay coupled in real-time.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B0D14] border border-[#1E2436] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-xs">Gemini Multi-Agents</h4>
              <p className="text-[11px] text-gray-400 leading-normal">
                Autonomous sentry agents continuously inspect scenes and enforce turnaround SLAs.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B0D14] border border-[#1E2436] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-xs">4-Tier Zero-Trust</h4>
              <p className="text-[11px] text-gray-400 leading-normal">
                Google Cloud Identity-Aware Proxy (IAP) with role-based sign-off governance.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200/90 text-[11px]">
            💡 <strong>Pro-Tip:</strong> Take this quick 60-second tour to discover key navigation features, or jump right into your scenes anytime.
          </div>
        </div>
      )
    },
    {
      id: "rbac",
      badge: "User Roles & Personas",
      title: "4-Level Role-Based Access Control (RBAC)",
      subtitle: "Switch personas anytime via the top right role switcher",
      icon: Users,
      color: "from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30",
      content: (
        <div className="space-y-3.5 text-xs text-gray-300">
          <p>
            Train Platform features 4 discrete user access tiers. You can switch personas at any point using the <strong>role badge in the top navigation bar</strong>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.values(USER_ROLES).map((role) => {
              const isSelected = currentRoleKey === role.id;
              return (
                <div 
                  key={role.id}
                  onClick={() => onSelectRole && onSelectRole(role.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                    isSelected 
                      ? 'bg-[#181E30] border-indigo-500 ring-1 ring-indigo-500/40' 
                      : 'bg-[#0B0D13] border-[#1E2436] hover:border-gray-600'
                  }`}
                >
                  <img 
                    src={role.defaultUser.avatar} 
                    alt={role.defaultUser.name} 
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${role.badgeColor}`}>
                        L{role.level}
                      </span>
                      <span className="font-bold text-white text-xs truncate">
                        {role.shortTitle}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                      {role.defaultUser.name}
                    </div>
                    <div className="text-[10px] text-gray-400 leading-tight mt-1">
                      {role.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center justify-between">
            <span>Active Persona: <strong className="text-white">{USER_ROLES[currentRoleKey]?.title}</strong></span>
            <span className="text-[10px] text-gray-400 font-mono">(Tap any tile above to switch)</span>
          </div>
        </div>
      )
    },
    {
      id: "matrix_kanban",
      badge: "Core Workspace Navigation",
      title: "Master Scene Matrix & Department Kanban",
      subtitle: "Synchronize scene beats, cut versions, and multi-craft statuses",
      icon: Layers,
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
      content: (
        <div className="space-y-3.5 text-xs text-gray-300">
          <p>
            Explore your scenes through multiple synchronized perspectives using the primary sub-navigation bar:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#0B0D13] border border-[#1E2436] flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-xs">1. Master Scene Matrix</div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  High-density 12-column editorial grid for desktop, and touch-optimized <strong>Mobile Scene Cards</strong> on phones. Click any scene to inspect sluglines, cast, emotional beats, and department notes.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0D13] border border-[#1E2436] flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                <Film className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-xs">2. Department Pipeline (Kanban)</div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  Interactive swimlanes tailored for <em>Picture Cut</em>, <em>Sound Post</em>, <em>VFX Comp</em>, <em>Color Grade</em>, and <em>Mastering QC</em>. Advance stages using arrow buttons on each card.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0D13] border border-[#1E2436] flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-xs">3. Director Hub &amp; Milestone Analytics</div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  Log timestamped director feedback, review client screening ratings, and track burn-down velocity curves on Grafana-style radar charts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "agents",
      badge: "Autonomous Fleet",
      title: "Gemini Enterprise Multi-Agents Hub",
      subtitle: "Autonomous sentries dispatching real-time reminders to Chat & Slack",
      icon: Bot,
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
      content: (
        <div className="space-y-3.5 text-xs text-gray-300">
          <p>
            You don't have to chase down department leads manually. <strong>Gemini 1.5 Enterprise Multi-Agents</strong> continuously audit turnover statuses in the background:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-[#1E2436]">
              <span className="font-bold text-amber-400 text-[11px] block">1. Picture Cut Sentry</span>
              <p className="text-[10px] text-gray-400 mt-0.5">Detects cuts stalled in Assembly &gt; 3 days and dispatches alerts to Google Chat #editorial-war-room.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-[#1E2436]">
              <span className="font-bold text-sky-400 text-[11px] block">2. Sound &amp; Mix Dispatcher</span>
              <p className="text-[10px] text-gray-400 mt-0.5">Audits ADR cues, Foley spotting, and ensures 5.1 / Atmos stem turnover readiness.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-[#1E2436]">
              <span className="font-bold text-purple-400 text-[11px] block">3. VFX Pipeline Warden</span>
              <p className="text-[10px] text-gray-400 mt-0.5">Tracks plate pulls, vendor turnaround SLAs, and alerts ILM / Framestore facilities.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-[#1E2436]">
              <span className="font-bold text-emerald-400 text-[11px] block">4. Color &amp; QC Inspectors</span>
              <p className="text-[10px] text-gray-400 mt-0.5">Verifies Picture Lock sign-offs before DI conform, and audits -24 LKFS audio loudness.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-200 text-[11px]">
            ⚡ <strong>Run Live Audit:</strong> In the <em>Enterprise Agents</em> tab, click <strong>"Run Autonomous Department Audit"</strong> to inspect all scenes and generate fresh reminder dispatches.
          </div>
        </div>
      )
    },
    {
      id: "ingestion_export",
      badge: "Ingestion & Interchange",
      title: "Universal Screenplay Ingestion & NLE Turnover",
      subtitle: "Turn written scripts into structured cuts, and export OpenTimelineIO packages",
      icon: Upload,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
      content: (
        <div className="space-y-3.5 text-xs text-gray-300">
          <p>
            Seamlessly connect your screenplay development directly to the editing suite:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#0B0D13] border border-[#1E2436] flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Import Script (.PDF, .DOCX, .FOUNTAIN)</h4>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  Click <strong>Import Script</strong> in the header bar. Drop your script file or select presets (<em>The Vault Protocol</em>, <em>Neon Horizon</em>). Gemini automatically parses sluglines, page counts, and estimated runtimes.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0D13] border border-[#1E2436] flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Export OpenTimelineIO (.otio) &amp; FCP XML</h4>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  Click <strong>Export OTIO</strong> in the header bar to export standard timeline turnover packages ready for <strong>DaVinci Resolve</strong>, <strong>Adobe Premiere Pro</strong>, or <strong>Avid Media Composer</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/30 text-white flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-amber-300">You're All Set to Ride the Rails!</div>
              <div className="text-[11px] text-gray-300">You can reopen this guide anytime using the <strong>Guide</strong> button in the header.</div>
            </div>
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 ml-2" />
          </div>
        </div>
      )
    }
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#11141E] border border-[#222B40] rounded-3xl shadow-2xl p-4 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1E2436]">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br ${step.color} border flex items-center justify-center shrink-0`}>
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                  {step.badge}
                </span>
                <span className="text-gray-500 text-xs">&bull;</span>
                <span className="text-[10px] font-mono text-gray-400">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {step.title}
              </h2>
            </div>
          </div>

          <button 
            onClick={handleFinish}
            className="p-1.5 rounded-lg bg-[#1A2030] hover:bg-[#252E45] text-gray-400 hover:text-white transition"
            title="Close guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition shrink-0 border ${
                currentStep === idx
                  ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50'
                  : idx < currentStep
                    ? 'bg-[#181D2E] text-gray-300 border-[#222B40]'
                    : 'bg-[#0B0D13] text-gray-500 border-[#1A2030]'
              }`}
            >
              {idx < currentStep ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <span className="w-3 text-center">{idx + 1}</span>
              )}
              <span className="hidden xs:inline">{s.badge}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Step Content */}
        <div className="min-h-[260px] py-1">
          {step.content}
        </div>

        {/* Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-[#1E2436]">
          <label className="flex items-center space-x-2 text-[11px] text-gray-400 cursor-pointer self-start sm:self-center">
            <input 
              type="checkbox" 
              checked={dontShowAgain} 
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded bg-[#0B0D13] border-[#2C344B] text-indigo-600 focus:ring-0" 
            />
            <span>Don't show this guide on startup</span>
          </label>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-[#1A2030] hover:bg-[#252E45] text-gray-300 text-xs font-semibold border border-[#2C344B] transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition active:scale-95"
              >
                <span>Got It, Let's Ride!</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
