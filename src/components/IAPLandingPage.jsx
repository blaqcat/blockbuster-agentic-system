import React, { useState } from 'react';
import { 
  Film, ShieldCheck, Lock, ArrowRight, UserCheck, Sparkles, 
  CheckCircle2, Users, Star, Eye, Zap, Bot, Clapperboard, 
  SlidersHorizontal, Radio, Shield, Server, FileText, ChevronRight,
  Network, Cpu, Globe, KeyRound, ExternalLink, X, HelpCircle
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';
import OnboardingGuideModal from './OnboardingGuideModal';

export default function IAPLandingPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState('EXECUTIVE_DIRECTOR');
  const [showArchModal, setShowArchModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handleSelectRoleLogin = (roleId) => {
    setIsLoggingIn(true);
    const roleDef = USER_ROLES[roleId] || USER_ROLES.EXECUTIVE_DIRECTOR;
    setTimeout(() => {
      const authUser = {
        name: roleDef.defaultUser.name,
        email: roleDef.defaultUser.email,
        roleId: roleDef.id,
        role: roleDef.title,
        avatar: roleDef.defaultUser.avatar,
        authMethod: `Google Cloud Identity (${roleDef.shortTitle})`,
        token: "gcp_iap_" + Math.random().toString(36).substring(2)
      };
      localStorage.setItem("blockbuster_auth_user", JSON.stringify(authUser));
      setIsLoggingIn(false);
      onLoginSuccess(authUser);
    }, 600);
  };

  const handleGoogleSignIn = () => {
    handleSelectRoleLogin(selectedPersonaId || 'EXECUTIVE_DIRECTOR');
  };

  const handleStudioPasscodeLogin = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid Google Workspace or Studio domain email.');
      return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
      let matchedRole = 'LEAD_EDITOR';
      if (email.includes('director') || email.includes('exec') || email.includes('jerry')) matchedRole = 'EXECUTIVE_DIRECTOR';
      else if (email.includes('craft') || email.includes('vfx') || email.includes('sound') || email.includes('color')) matchedRole = 'CRAFT_SUPERVISOR';
      else if (email.includes('review') || email.includes('client')) matchedRole = 'CLIENT_REVIEWER';

      const roleDef = USER_ROLES[matchedRole];

      const authUser = {
        name: email.split('@')[0].toUpperCase(),
        email: email,
        roleId: roleDef.id,
        role: roleDef.title,
        avatar: roleDef.defaultUser.avatar,
        authMethod: "Google Cloud Enterprise SSO",
        token: "gcp_auth_" + Date.now()
      };
      localStorage.setItem("blockbuster_auth_user", JSON.stringify(authUser));
      setIsLoggingIn(false);
      onLoginSuccess(authUser);
    }, 700);
  };

  const activePersona = USER_ROLES[selectedPersonaId] || USER_ROLES.EXECUTIVE_DIRECTOR;

  return (
    <div className="min-h-screen bg-[#07090E] text-gray-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Cinematic Ambient Glow Lights */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-indigo-600/15 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[400px] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-[600px] h-[350px] bg-cyan-600/10 blur-[170px] rounded-full pointer-events-none" />

      {/* Top Zero-Trust Status Bar */}
      <div className="bg-[#0B0D13]/80 border-b border-[#1E2436] px-3 sm:px-6 py-2 sm:py-2.5 backdrop-blur-md flex items-center justify-between gap-2 text-xs relative z-20">
        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-mono text-emerald-400 font-semibold tracking-wide text-[11px] sm:text-xs truncate">
            GCP IAP ACTIVE
          </span>
          <span className="text-gray-500 hidden sm:inline">&bull;</span>
          <span className="text-gray-400 hidden sm:inline font-mono">
            Project: <strong className="text-gray-200">ace-vial-371506</strong>
          </span>
          <span className="text-gray-500 hidden md:inline">&bull;</span>
          <span className="text-gray-400 hidden md:inline font-mono">
            Region: <strong className="text-gray-200">europe-west1</strong>
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] font-mono shrink-0">
          <button 
            onClick={() => setShowGuideModal(true)}
            className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">First-Time Guide</span>
            <span className="xs:hidden">Guide</span>
          </button>

          <button 
            onClick={() => setShowArchModal(true)}
            className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded bg-[#1A2030] hover:bg-indigo-950/80 border border-[#2C344B] text-indigo-300 hover:text-indigo-200 transition"
          >
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xs:inline">View Architecture</span>
            <span className="xs:hidden">Arch</span>
          </button>
          <span className="items-center space-x-1 text-emerald-400 hidden sm:flex">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust</span>
          </span>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Studio Brand & Enterprise Intelligence Pitch */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Agentic Cinema OS &bull; 🇿🇦 Inspired by Train Surfers of South Africa</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              TRAIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400">PLATFORM</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl font-normal leading-relaxed">
              Ride the high-velocity rails of film post-production. Synchronize Editorial Cuts across Sound, VFX, Color, and Mastering with split-second precision, grounded by <strong>Gemini 1.5 Enterprise Multi-Agents</strong>, real-time OpenTimelineIO turnovers, and 4-tier Role-Based Access secured behind Google Cloud Identity-Aware Proxy.
            </p>
          </div>

          {/* 3 Core Platform Pillar Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-[#11141E]/80 border border-[#1E2436] backdrop-blur space-y-1.5 hover:border-amber-500/40 transition">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Clapperboard className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Picture Lock Sync</h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Sovereign sign-offs and editorial cadence offset controls.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#11141E]/80 border border-[#1E2436] backdrop-blur space-y-1.5 hover:border-purple-500/40 transition">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">6 Autonomous Agents</h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Department audits, VFX breakdown, and SLA run-down dispatchers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#11141E]/80 border border-[#1E2436] backdrop-blur space-y-1.5 hover:border-emerald-500/40 transition">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">4-Tier IAP Security</h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Zero-Trust IAM policies from Executive Director to Client Reviewer.
              </p>
            </div>
          </div>

          {/* Interactive Persona Deep-Dive Card */}
          <div className="p-4 rounded-2xl bg-[#0C0F17]/90 border border-[#1E2436] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] uppercase font-bold text-gray-400 flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Selected Persona Clearance</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${activePersona.badgeColor}`}>
                Level {activePersona.level}: {activePersona.title}
              </span>
            </div>

            <div className="flex items-start space-x-3 text-xs">
              <img 
                src={activePersona.defaultUser.avatar} 
                alt={activePersona.defaultUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40 shrink-0" 
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white">{activePersona.defaultUser.name}</div>
                  <div className="text-[11px] font-mono text-gray-400">{activePersona.defaultUser.email}</div>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {activePersona.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activePersona.permissions.canLockPicture && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      Picture Lock Authority
                    </span>
                  )}
                  {activePersona.permissions.canImportScript && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                      Gemini Script Breakdown
                    </span>
                  )}
                  {activePersona.permissions.canExportTimeline && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                      OpenTimelineIO Turnover
                    </span>
                  )}
                  {activePersona.permissions.canApproveCraft && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Craft Sign-off
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Project Milestone Telemetry Preview */}
          <div className="p-3.5 rounded-2xl bg-[#0C0F17]/60 border border-[#1E2436] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center space-x-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-gray-400">Current Reel:</span>
              <span className="font-bold text-white">Dune: Part Two (Full Editorial Turnover)</span>
            </div>
            <div className="flex items-center space-x-4 text-[11px]">
              <span className="text-gray-400">Lock Rate: <strong className="text-emerald-400">75%</strong></span>
              <span className="text-gray-400">Cloud Run: <strong className="text-indigo-400">europe-west1</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Secure IAP Login Gateway Card */}
        <div className="lg:col-span-5 bg-[#11141E]/95 border border-[#1E2436] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 relative">
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Identity-Aware Portal</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                SSO READY
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Select your persona below to authenticate with Google Cloud IAP credentials.
            </p>
          </div>

          {/* 1-Click Interactive User Level Personas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Select User Level (1-Click IAP Fast Track)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(USER_ROLES).map((role) => {
                const isSelected = selectedPersonaId === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedPersonaId(role.id);
                      handleSelectRoleLogin(role.id);
                    }}
                    disabled={isLoggingIn}
                    className={`text-left p-2.5 rounded-xl border transition duration-150 flex items-center space-x-2.5 group active:scale-[0.98] ${
                      isSelected 
                        ? 'bg-[#181D2E] border-indigo-500 ring-1 ring-indigo-500/50' 
                        : 'bg-[#0B0D13] border-[#1E2436] hover:border-indigo-500/60 hover:bg-[#141824]'
                    }`}
                  >
                    <img 
                      src={role.defaultUser.avatar} 
                      alt={role.defaultUser.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/10 group-hover:ring-indigo-400/50 transition" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <span className={`text-[8px] font-bold px-1 py-0.2 rounded border uppercase ${role.badgeColor}`}>
                          L{role.level}
                        </span>
                        <span className="text-[11px] font-bold text-white group-hover:text-indigo-300 transition truncate">
                          {role.shortTitle}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono truncate">
                        {role.defaultUser.name}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-indigo-400 transition shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#1E2436] w-full"></div>
            <span className="bg-[#11141E] px-3 text-[10px] uppercase font-mono tracking-widest text-gray-400">
              Or Sign In with Google
            </span>
          </div>

          {/* Google Workspace SSO Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs transition duration-200 flex items-center justify-center space-x-3 shadow-md active:scale-[0.99]"
          >
            {isLoggingIn ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying Identity with Google Cloud IAP...</span>
              </div>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign In with Google Cloud Workspace</span>
              </>
            )}
          </button>

          {/* Studio Workspace Email Form */}
          <form onSubmit={handleStudioPasscodeLogin} className="space-y-3 pt-1">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Studio Workspace Email
              </label>
              <input 
                type="email"
                placeholder="director@studio.com or editor@ace.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0D14] border border-[#1E2436] rounded-xl px-3.5 py-2 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono transition"
              />
            </div>

            {errorMsg && (
              <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Card Footer Security Specs */}
          <div className="pt-2 border-t border-[#1E2436] flex items-center justify-between text-[10px] text-gray-500 font-mono">
            <span>Auth: vertex-express</span>
            <span className="text-indigo-400">Gemini 1.5 Multi-Agents</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B0D13]/90 border-t border-[#1E2436] px-6 py-4 text-xs text-gray-500 text-center relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 Train Platform. Inspired by the Train Surfers of South Africa.</span>
          <span className="font-mono text-[11px] text-gray-400">
            Secured with Google Cloud Identity-Aware Proxy &bull; Project ace-vial-371506
          </span>
        </div>
      </footer>

      {/* Architecture Topology Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#10131E] border border-[#23293D] rounded-3xl max-w-2xl w-full p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Google Cloud IAP Architecture</h3>
                  <p className="text-xs text-gray-400 font-mono">Production Zero-Trust Ingress Blueprint</p>
                </div>
              </div>
              <button 
                onClick={() => setShowArchModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Architecture Steps Flow */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#0B0D14] border border-[#1E2436] flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold">1. Edge Client</div>
                  <div className="text-white font-semibold">Director / Editor Browser (HTTPS : 443)</div>
                </div>
                <Globe className="w-5 h-5 text-indigo-400" />
              </div>

              <div className="text-center text-gray-600">&darr;</div>

              <div className="p-3.5 rounded-xl bg-[#0B0D14] border border-[#1E2436] flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold">2. Global Load Balancer</div>
                  <div className="text-white font-semibold">IP: 34.95.121.204 &bull; blockbuster-forwarding-rule</div>
                </div>
                <Server className="w-5 h-5 text-purple-400" />
              </div>

              <div className="text-center text-gray-600">&darr;</div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-emerald-400 text-[10px] uppercase font-bold">3. Identity-Aware Proxy (IAP)</div>
                  <div className="text-emerald-300 font-semibold">BeyondCorp Zero-Trust &bull; roles/iap.httpsResourceAccessor</div>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="text-center text-gray-600">&darr;</div>

              <div className="p-3.5 rounded-xl bg-[#0B0D14] border border-[#1E2436] flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold">4. Cloud Run Ingress Target</div>
                  <div className="text-white font-semibold">blockbuster-app (europe-west1) &bull; Ingress: internal-and-cloud-load-balancing</div>
                </div>
                <Cpu className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
              💡 Zero direct internet ingress is permitted to Cloud Run. All requests must validate through Google Cloud Identity-Aware Proxy OIDC tokens.
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowArchModal(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
              >
                Close Architecture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* First-Time User Navigation Guide Modal */}
      <OnboardingGuideModal 
        show={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        currentRoleKey={selectedPersonaId}
        onSelectRole={setSelectedPersonaId}
      />
    </div>
  );
}