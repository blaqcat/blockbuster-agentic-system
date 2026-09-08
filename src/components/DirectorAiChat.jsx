import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, Copy, Check, Zap, Share2, Gauge, 
  Key, ShieldCheck, AlertCircle, RefreshCw, X, ChevronDown, CheckCircle2, Sliders
} from 'lucide-react';
import { 
  chatWithDirectorAgentStream, 
  DIRECTOR_AI_MODELS,
  DIRECTOR_QUICK_PROMPTS, 
  extractGranularPipelineTelemetry 
} from '../services/directorAgentService';
import { USER_ROLES } from '../services/userRoles';

export default function DirectorAiChat({ 
  project, 
  geminiApiKey, 
  onUpdateApiKey,
  currentRoleKey, 
  onPostToBoard 
}) {
  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;
  const telemetry = extractGranularPipelineTelemetry(project);
  const { metrics } = telemetry;

  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');
  const [keySavedBanner, setKeySavedBanner] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: "msg_init",
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello ${project.director || 'Director'}. I am your **Executive Master Pipeline & Post-Production AI** for *"${project.title}"*.

Powered by **Gemini 2.0 Flash (Frontier Multimodal Intelligence)** with real-time token streaming. 

I have full, live visibility into your **5 scenes across Picture Editorial, VFX, Sound Post, Color/DI, and Mastering**. Ask me anything about what is happening where in the pipelines or click any inquiry below.`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (geminiApiKey) {
      setApiKeyInput(geminiApiKey);
    }
  }, [geminiApiKey]);

  const handleSaveKey = (e) => {
    e?.preventDefault();
    const cleanKey = apiKeyInput.trim();
    if (onUpdateApiKey) {
      onUpdateApiKey(cleanKey);
    }
    try {
      localStorage.setItem("blockbuster_gemini_api_key", cleanKey);
    } catch (e) {}
    setShowKeyModal(false);
    setKeySavedBanner(true);
    setTimeout(() => setKeySavedBanner(false), 3500);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim() || isLoading) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim()
    };

    const streamMsgId = `ai_${Date.now()}`;
    const initialAiMsg = {
      id: streamMsgId,
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: ""
    };

    setMessages(prev => [...prev, userMsg, initialAiMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      await chatWithDirectorAgentStream(
        userMsg.text, 
        messages, 
        project, 
        geminiApiKey,
        selectedModel,
        (chunk, currentFull) => {
          setMessages(prev => prev.map(m => {
            if (m.id === streamMsgId) {
              return { ...m, text: currentFull };
            }
            return m;
          }));
        }
      );
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(m => {
        if (m.id === streamMsgId) {
          return { ...m, text: `⚠️ **Advisory Notice:** ${err.message}` };
        }
        return m;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePromoteToBoard = (msgText) => {
    if (!onPostToBoard) return;
    const cleanLines = msgText.split('\n').filter(l => l.trim().length > 0);
    let title = "Executive Director Production Directive";
    if (cleanLines[0]) {
      title = cleanLines[0].replace(/^[#*\s-]+/, '').slice(0, 60);
    }
    onPostToBoard({
      title,
      content: msgText,
      targetDepartment: "ALL",
      priority: "HIGH",
      sceneTag: "Pipeline-Wide"
    });
  };

  const currentModelObj = DIRECTOR_AI_MODELS.find(m => m.id === selectedModel) || DIRECTOR_AI_MODELS[0];

  return (
    <div className="bg-[#141721] border border-[#1E2333] rounded-2xl overflow-hidden flex flex-col h-[740px] shadow-2xl relative">
      {/* Key Saved Banner */}
      {keySavedBanner && (
        <div className="bg-emerald-600/90 text-white text-xs px-4 py-2 flex items-center justify-between transition">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Gemini API Key updated. <strong>{currentModelObj.name}</strong> is now live with real-time frontier intelligence!</span>
          </div>
          <button onClick={() => setKeySavedBanner(false)} className="text-white hover:text-gray-200">&times;</button>
        </div>
      )}

      {/* Top Header with Model Selector & Live Key Status */}
      <div className="bg-[#0B0D13] border-b border-[#1E2333] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>Director AI Pipeline Copilot</span>
              </h3>
              
              {/* Frontier Model Selector */}
              <div className="flex items-center space-x-1.5 bg-[#141721] border border-indigo-500/40 rounded-lg px-2.5 py-1 shadow-sm">
                <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-[11px] font-mono font-bold text-indigo-300 focus:outline-none cursor-pointer"
                >
                  {DIRECTOR_AI_MODELS.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#141721] text-gray-200 font-sans">
                      {m.badge} - {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* API Key Status Pill / Trigger */}
              <button
                onClick={() => setShowKeyModal(true)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border transition ${
                  geminiApiKey && geminiApiKey.trim()
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 animate-pulse'
                }`}
                title={geminiApiKey ? "Gemini API Key active. Click to edit." : "Connect Gemini API Key for Live Frontier Models"}
              >
                <Key className="w-3 h-3" />
                <span>{geminiApiKey && geminiApiKey.trim() ? "🟢 Live Frontier API" : "🔑 Connect API Key"}</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-400 mt-0.5">
              Granular scene-by-scene tracking &bull; Editorial, VFX, Sound, DI Color &bull; Instant Streaming
            </p>
          </div>
        </div>

        {/* Live Granular Telemetry Badges */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-[#141721] border border-[#1E2333] rounded-lg px-2.5 py-1 flex items-center space-x-1.5">
            <span className="text-gray-400 text-[10px] uppercase">Lock:</span>
            <span className="text-amber-400 font-bold">{metrics.lockPercentage}%</span>
            <span className="text-gray-500 text-[10px]">({metrics.lockedCount}/{metrics.totalScenes})</span>
          </div>

          <div className="bg-[#141721] border border-[#1E2333] rounded-lg px-2.5 py-1 flex items-center space-x-1.5">
            <span className="text-gray-400 text-[10px] uppercase">VFX:</span>
            <span className="text-purple-400 font-bold">{metrics.vfxPercentage}%</span>
            <span className="text-gray-500 text-[10px]">({metrics.approvedVfx}/{metrics.totalVfx})</span>
          </div>

          <div className="hidden sm:flex bg-[#141721] border border-[#1E2333] rounded-lg px-2.5 py-1 items-center space-x-1.5">
            <span className="text-gray-400 text-[10px] uppercase">Sound:</span>
            <span className="text-cyan-400 font-bold">{metrics.soundFinal} Mix</span>
            <span className="text-gray-500 text-[10px]">({metrics.soundNotStarted} hold)</span>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-[#0E121D] border-b border-[#1E2333] px-4 py-2 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 shrink-0 flex items-center space-x-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Pipeline Inquiries:</span>
        </span>
        {DIRECTOR_QUICK_PROMPTS.map(p => (
          <button
            key={p.id}
            onClick={() => handleSendMessage(p.prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-[#141721] hover:bg-indigo-600/20 border border-[#1E2333] hover:border-indigo-500/40 text-gray-300 hover:text-indigo-300 text-xs font-medium whitespace-nowrap transition shrink-0 active:scale-95 disabled:opacity-40"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div 
              key={m.id} 
              className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[88%] sm:max-w-3xl rounded-2xl p-4 sm:p-5 text-xs leading-relaxed space-y-3 shadow-md ${
                isUser 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-[#0B0D13] border border-[#1E2333] text-gray-200 rounded-tl-none'
              }`}>
                {/* Message Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px]">
                  <span className="font-bold flex items-center space-x-1.5 opacity-90">
                    {isUser ? (
                      <span>Director ({project.director})</span>
                    ) : (
                      <span className="text-indigo-300 font-semibold flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Director AI Pipeline Master ({currentModelObj.name})</span>
                      </span>
                    )}
                  </span>
                  <span className="opacity-60 font-mono">{m.timestamp}</span>
                </div>

                {/* Message Content with Markdown & Table Styling */}
                <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap font-sans text-gray-200">
                  {m.text || (isLoading && m.id === messages[messages.length - 1]?.id ? "⚡ Streaming pipeline analysis..." : "")}
                </div>

                {/* Action Tools */}
                {!isUser && m.text && (
                  <div className="pt-2.5 border-t border-[#1E2333] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#141721] hover:bg-[#1E2333] text-gray-400 hover:text-gray-200 border border-[#1E2333] transition"
                        title="Copy Response"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Dossier</span>
                          </>
                        )}
                      </button>

                      {onPostToBoard && (
                        <button
                          onClick={() => handlePromoteToBoard(m.text)}
                          className="flex items-center space-x-1.5 px-3 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition font-semibold"
                          title="Post this pipeline dossier or directive to the Public Board of Directors Notes"
                        >
                          <Share2 className="w-3 h-3 text-amber-400" />
                          <span>Publish to Directors' Board</span>
                        </button>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-500 font-mono">
                      Grounded in {project.scenes?.length || 5} Scenes
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-[#0B0D13] border-t border-[#1E2333] p-3 sm:p-4">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={`Ask about what's happening where (e.g. "What is happening in Scene 3 VFX and Sound?", "Why is Scene 4 blocked?")...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#141721] border border-[#1E2333] rounded-xl px-4 py-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition font-sans pr-12"
            />
            <div className="absolute right-3 top-2.5 text-gray-500 pointer-events-none text-[10px] font-mono hidden sm:block">
              ENTER ↵
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-xs font-semibold text-white transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Agent</span>
          </button>
        </form>

        <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center space-x-1.5">
            <span>Model: <strong className="text-gray-300 font-mono">{currentModelObj.name}</strong></span>
            <span>&bull;</span>
            <span className="text-indigo-400">{currentModelObj.speed}</span>
          </div>
          <span className="font-mono text-gray-400">
            {geminiApiKey ? "🟢 Live Frontier Mode" : "🟡 Heuristic Pipeline Simulation"}
          </span>
        </div>
      </div>

      {/* API Key Connection Modal */}
      {showKeyModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2333]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Google Gemini API Key</h4>
                  <p className="text-[11px] text-gray-400">Enables live Gemini 2.0 Flash &amp; 1.5 Pro</p>
                </div>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Enter Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1.5">
                  Your key is saved locally in your browser. Get a key from the{' '}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-indigo-400 hover:underline"
                  >
                    Google AI Studio portal &rarr;
                  </a>
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1E2333]">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition shadow-sm"
                >
                  Save &amp; Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
