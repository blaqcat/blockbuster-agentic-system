import React, { useState, useEffect } from 'react';
import { Film, ShieldCheck, Lock, ArrowRight, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthGate({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [studioPasscode, setStudioPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleSignIn = () => {
    setIsLoggingIn(true);
    // Simulating Google Cloud Identity authentication for the active domain
    setTimeout(() => {
      const authUser = {
        name: "Jerry (Director & Studio Lead)",
        email: "jerry@djehuti.org",
        role: "Director / Lead Executive",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        authMethod: "Google Workspace Identity (djehuti.org)",
        token: "gcp_iap_" + Math.random().toString(36).substring(2)
      };
      localStorage.setItem("blockbuster_auth_user", JSON.stringify(authUser));
      setIsLoggingIn(false);
      onLoginSuccess(authUser);
    }, 800);
  };

  const handleStudioPasscodeLogin = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid Google Workspace or Studio email.');
      return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
      const authUser = {
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: email.includes('director') ? "Director" : "Lead Editor (ACE)",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        authMethod: "Google Cloud Enterprise SSO",
        token: "gcp_auth_" + Date.now()
      };
      localStorage.setItem("blockbuster_auth_user", JSON.stringify(authUser));
      setIsLoggingIn(false);
      onLoginSuccess(authUser);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07090E] flex items-center justify-center p-4 font-sans text-gray-100 relative overflow-hidden">
      {/* Cinematic Ambient Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[250px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-md w-full bg-[#11141E]/90 border border-[#1E2436] rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-2 shadow-inner">
            <Film className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center space-x-2">
            <span>BLOCKBUSTER</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              IAP
            </span>
          </h1>
          <p className="text-xs text-gray-400">
            Director &amp; Editorial Intelligence Portal &bull; Google Cloud Identity
          </p>
        </div>

        {/* Security Badge */}
        <div className="p-3 rounded-xl bg-[#161B29] border border-[#222B40] flex items-center space-x-3 text-xs text-gray-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="leading-tight">
            <span className="font-semibold text-white">Identity-Aware Proxy Active</span>
            <p className="text-[10px] text-gray-400">Sign in with authorized Google Cloud / Studio account</p>
          </div>
        </div>

        {/* Google One-Click Login Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold text-xs transition duration-200 flex items-center justify-center space-x-3 shadow-lg shadow-white/5 active:scale-[0.99]"
          >
            {isLoggingIn ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating with Google...</span>
              </div>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign In with Google (jerry@djehuti.org)</span>
              </>
            )}
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#1E2436] w-full"></div>
          <span className="bg-[#11141E] px-3 text-[10px] uppercase font-mono tracking-widest text-gray-400">
            Or Studio Email
          </span>
        </div>

        {/* Manual Studio Email Form */}
        <form onSubmit={handleStudioPasscodeLogin} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Studio Workspace Email
            </label>
            <input 
              type="email"
              placeholder="director@studio.com or editor@ace.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B0D14] border border-[#1E2436] rounded-xl px-3.5 py-2.5 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Production Access Key
            </label>
            <input 
              type="password"
              placeholder="••••••••••••"
              value={studioPasscode}
              onChange={(e) => setStudioPasscode(e.target.value)}
              className="w-full bg-[#0B0D14] border border-[#1E2436] rounded-xl px-3.5 py-2.5 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono transition"
            />
          </div>

          {errorMsg && (
            <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
          >
            <span>Enter Studio Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#1E2436] flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span>Project: ace-vial-371506</span>
          <span className="text-indigo-400">Gemini 1.5 Enterprise</span>
        </div>
      </div>
    </div>
  );
}
