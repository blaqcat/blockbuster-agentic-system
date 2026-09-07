import React, { useState } from 'react';
import { 
  Film, ShieldCheck, Lock, ArrowRight, UserCheck, Sparkles, 
  CheckCircle2, Users, Star, Eye, Zap, Bot, Clapperboard, 
  SlidersHorizontal, Radio, Shield, Server, FileText, ChevronRight
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';

export default function IAPLandingPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [studioPasscode, setStudioPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activePersonaHover, setActivePersonaHover] = useState(null);

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
    handleSelectRoleLogin('EXECUTIVE_DIRECTOR');
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

  return (
    <div className="min-h-screen bg-[#07090E] text-gray-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Cinematic Ambient Glow Lights */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-indigo-600/15 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[400px] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-[600px] h-[350px] bg-cyan-600/10 blur-[170px] rounded-full pointer-events-none" />

      {/* Top Zero-Trust Status Bar */}
      <div className="bg-[#0B0D13]/80 border-b border-[#1E2436] px-6 py-2.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs relative z-20">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-emerald-400 font-semibold tracking-wide">
            GOOGLE CLOUD IAP ACTIVE
          </span>
          <span className="text-gray-500 hidden sm:inline">&bull;</span>
          <span className="text-gray-400 hidden sm:inline font-mono">
            Project: <strong className="text-gray-200">ace-vial-371506</strong>
          </span>
        </div>

        <div className="flex items-center space-x-4 text-[11px] font-mono text-gray-400">
          <span className="flex items-center space-x-1 text-indigo-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>BeyondCorp Zero-Trust Enabled</span>
          </span>
          <span className="hidden md:inline text-gray-400">TLS 1.3 OIDC</span>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Studio Brand & Enterprise Intelligence Pitch */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Agentic Film Post-Production OS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              BLOCK<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300">BUSTER</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl font-normal leading-relaxed">
              Synchronize your Editorial Cut with Sound, VFX, Color, and Mastering. Grounded by <strong>Gemini 1.5 Enterprise Multi-Agents</strong>, real-time OpenTimelineIO turnovers, and 4-tier Role-Based Access.
            </p>
          </div>

          {/* 3 Core Platform Pillar Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-[#11141E]/80 border border-[#1E2436] backdrop-blur space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Clapperboard className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Picture Lock Sync</h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Sovereign sign-offs and editorial cadence offset controls.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#11141E]/80 border border-[#1E2436] backdrop-blur space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">6 Autonomous Agents</h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Live department audits and SLA run-down dispatchers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#11141E]/80 border border-[#1E2436] backdrop-blur space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">4-Level RBAC</h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Granular permissions from Executive Director to Client Reviewer.
              </p>
            </div>
          </div>

          {/* Real-time Project Milestone Telemetry Preview */}
          <div className="p-4 rounded-2xl bg-[#0C0F17]/90 border border-[#1E2436] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Production Asset</span>
                <span className="font-semibold text-white">Dune: Part Two (Full Editorial Reel)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 font-mono text-[11px]">
              <div>
                <span className="text-gray-400">Lock Rate:</span> <span className="text-emerald-400 font-bold">75%</span>
              </div>
              <div>
                <span className="text-gray-400">VFX:</span> <span className="text-purple-400 font-bold">148/210 Approved</span>
              </div>
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
              Sign in via Google Workspace or fast-track as an authorized user level.
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
              {Object.values(USER_ROLES).map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRoleLogin(role.id)}
                  disabled={isLoggingIn}
                  className="text-left p-2.5 rounded-xl bg-[#0B0D13] border border-[#1E2436] hover:border-indigo-500/60 hover:bg-[#141824] transition duration-150 flex items-center space-x-2.5 group active:scale-[0.98]"
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
              ))}
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
            <span className="text-indigo-400">Gemini 1.5 Grounded</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B0D13]/90 border-t border-[#1E2436] px-6 py-4 text-xs text-gray-500 text-center relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 BLOCKBUSTER Film Intelligence OS. All Rights Reserved.</span>
          <span className="font-mono text-[11px] text-gray-400">Secured with Google Cloud Identity-Aware Proxy &bull; Project ace-vial-371506</span>
        </div>
      </footer>
    </div>
  );
}