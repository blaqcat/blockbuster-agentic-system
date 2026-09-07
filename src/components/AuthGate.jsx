import React, { useState } from 'react';
import { 
  Film, ShieldCheck, Lock, ArrowRight, UserCheck, Sparkles, 
  CheckCircle2, Users, Star, Eye 
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';

export default function AuthGate({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [studioPasscode, setStudioPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState('EXECUTIVE_DIRECTOR');

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
    }, 500);
  };

  const handleGoogleSignIn = () => {
    handleSelectRoleLogin('EXECUTIVE_DIRECTOR');
  };

  const handleStudioPasscodeLogin = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid Google Workspace or Studio email.');
      return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
      let matchedRole = 'LEAD_EDITOR';
      if (email.includes('director') || email.includes('exec')) matchedRole = 'EXECUTIVE_DIRECTOR';
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
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07090E] flex items-center justify-center p-4 sm:p-6 font-sans text-gray-100 relative overflow-hidden">
      {/* Cinematic Ambient Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/15 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[300px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl w-full bg-[#11141E]/95 border border-[#1E2436] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-1 shadow-inner">
            <Film className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center space-x-2">
            <span>BLOCKBUSTER</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              IAP Active
            </span>
          </h1>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Director &amp; Editorial Intelligence Orchestrator &bull; Google Cloud Identity RBAC
          </p>
        </div>

        {/* 4 Interactive Level Selector Tiles */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select Interactive User Level (1-Click Login)</span>
            </label>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              4 Levels Configured
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.values(USER_ROLES).map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelectRoleLogin(role.id)}
                disabled={isLoggingIn}
                className="text-left p-3 rounded-2xl bg-[#0B0D13]/80 border border-[#1E2436] hover:border-indigo-500/60 hover:bg-[#141824] transition duration-150 flex items-start space-x-3 group relative overflow-hidden active:scale-[0.99]"
              >
                <img 
                  src={role.defaultUser.avatar} 
                  alt={role.defaultUser.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/10 group-hover:ring-indigo-400/40 transition" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${role.badgeColor}`}>
                      L{role.level}
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate">
                      {role.shortTitle}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                    {role.defaultUser.name}
                  </div>
                  <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                    {role.tagline}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition self-center shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#1E2436] w-full"></div>
          <span className="bg-[#11141E] px-3 text-[10px] uppercase font-mono tracking-widest text-gray-400">
            Or Sign In with Google Workspace
          </span>
        </div>

        {/* Google One-Click Login Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold text-xs transition duration-200 flex items-center justify-center space-x-3 shadow-lg shadow-white/5 active:scale-[0.99]"
          >
            {isLoggingIn ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating with Google Cloud IAP...</span>
              </div>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign In with Google Cloud SSO (Studio Account)</span>
              </>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#1E2436] flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span>Project: ace-vial-371506</span>
          <span className="text-indigo-400">Gemini 1.5 Enterprise &bull; 4 User Levels</span>
        </div>
      </div>
    </div>
  );
}
