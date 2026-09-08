import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, RefreshCw, Copy, Check, MessageSquare, 
  AlertTriangle, ShieldCheck, Zap, ArrowRight, CornerDownLeft, Flame, Share2
} from 'lucide-react';
import { 
  chatWithDirectorAgent, 
  DIRECTOR_QUICK_PROMPTS, 
  extractProjectOverview 
} from '../services/directorAgentService';
import { USER_ROLES } from '../services/userRoles';

export default function DirectorAiChat({ 
  project, 
  geminiApiKey, 
  currentRoleKey, 
  onPostToBoard 
}) {
  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;
  const overview = extractProjectOverview(project);

  const [messages, setMessages] = useState([
    {
      id: "msg_init",
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello ${project.director || 'Director'}. I am your **Executive AI Strategic Post-Production Advisor** for *"${project.title}"*. 

I am tracking all **${overview.totalScenes} scenes** in real time across Picture, Sound, VFX, Color, and Mastering. 

Currently, your cut is **${overview.lockPercentage}% Picture Locked** and VFX is **${overview.vfxPercentage}% Approved** (${overview.pendingVfx} shots in turnaround).

Select a quick briefing below or ask me any question about your post-production pipeline.`
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

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim() || isLoading) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const responseText = await chatWithDirectorAgent(
        userMsg.text, 
        messages, 
        project, 
        geminiApiKey
      );

      const aiMsg = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev, 
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `⚠️ **Advisory Agent Notice:** Encountered an issue connecting to Gemini: ${err.message}. Retrying with local telemetry engine.`
        }
      ]);
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
    // Extract a meaningful title from the first line or default
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
      sceneTag: "Production-Wide"
    });
  };

  return (
    <div className="bg-[#141721] border border-[#1E2333] rounded-2xl overflow-hidden flex flex-col h-[700px] shadow-2xl">
      {/* Top Telemetry Ticker */}
      <div className="bg-[#0B0D13] border-b border-[#1E2333] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>Director AI Executive Copilot</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {geminiApiKey ? "Gemini 1.5 Pro Active" : "Gemini Engine (Telemetry Sim)"}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Autonomous oversight &bull; Real-time scene health &bull; Executive briefings
            </p>
          </div>
        </div>

        {/* Real-time mini meters */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="text-gray-400">Lock:</span>
            <span className="text-amber-400 font-bold">{overview.lockPercentage}%</span>
            <span className="text-gray-600">({overview.lockedCount}/{overview.totalScenes})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-gray-400">VFX:</span>
            <span className="text-purple-400 font-bold">{overview.vfxPercentage}%</span>
            <span className="text-gray-600">({overview.approvedVfx}/{overview.totalVfx})</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5">
            <span className="text-gray-400">Sound Final:</span>
            <span className="text-cyan-400 font-bold">{overview.soundFinal}/{overview.totalScenes}</span>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-[#0E121D] border-b border-[#1E2333] px-4 py-2.5 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 shrink-0 flex items-center space-x-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Quick Overviews:</span>
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
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 shadow-sm ${
                isUser 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-[#0B0D13] border border-[#1E2333] text-gray-200 rounded-tl-none'
              }`}>
                {/* Message Header */}
                <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[10px]">
                  <span className="font-bold flex items-center space-x-1.5 opacity-90">
                    {isUser ? (
                      <span>Director ({project.director})</span>
                    ) : (
                      <span className="text-indigo-300 font-semibold flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Director AI Executive Advisor</span>
                      </span>
                    )}
                  </span>
                  <span className="opacity-60 font-mono">{m.timestamp}</span>
                </div>

                {/* Message Body (Markdown formatted) */}
                <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap font-sans text-gray-200">
                  {m.text}
                </div>

                {/* AI Action Tools */}
                {!isUser && (
                  <div className="pt-2 border-t border-[#1E2333] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="flex items-center space-x-1 px-2 py-1 rounded bg-[#141721] hover:bg-[#1E2333] text-gray-400 hover:text-gray-200 border border-[#1E2333] transition"
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
                            <span>Copy Brief</span>
                          </>
                        )}
                      </button>

                      {onPostToBoard && (
                        <button
                          onClick={() => handlePromoteToBoard(m.text)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition font-semibold"
                          title="Post this AI overview or directive to the Public Board of Directors Notes"
                        >
                          <Share2 className="w-3 h-3 text-amber-400" />
                          <span>Post to Directors' Board</span>
                        </button>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-500 font-mono">
                      Target: L1 Executive Strategy
                    </span>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                  <img 
                    src={currentRole.defaultUser.avatar} 
                    alt="Director" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-[#0B0D13] border border-[#1E2333] rounded-2xl rounded-tl-none p-4 text-xs text-indigo-300 flex items-center space-x-2 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Synthesizing cross-department telemetry &amp; generating executive overview...</span>
            </div>
          </div>
        )}
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
              placeholder={`Ask the Director AI Copilot (e.g., "Give me an overview of Act II", "Which VFX shots are stalled?")...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#141721] border border-[#1E2333] rounded-xl px-4 py-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition font-sans pr-10"
            />
            <div className="absolute right-3 top-2.5 text-gray-500 pointer-events-none text-[10px] font-mono hidden sm:block">
              ENTER ↵
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 rounded-xl text-xs font-semibold text-white transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Agent</span>
          </button>
        </form>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-500">
          <span>AI grounded in live scene telemetry, cut progression, and department turnaround logs.</span>
          <span className="font-mono">Ready for Director Jerry Vance</span>
        </div>
      </div>
    </div>
  );
}
