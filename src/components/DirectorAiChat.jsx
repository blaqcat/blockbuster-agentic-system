import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, Copy, Check, Zap, Share2, Gauge
} from 'lucide-react';
import { 
  chatWithDirectorAgentStream, 
  DIRECTOR_AI_MODELS,
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

  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash-8b");
  const [messages, setMessages] = useState([
    {
      id: "msg_init",
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello ${project.director || 'Director'}. I am your **Executive AI Strategic Post-Production Advisor** for *"${project.title}"*. 

Streaming enabled via **Gemini 1.5 Flash-8B (Ultra-Low Latency)**. Select a quick prompt below or ask any question for immediate real-time feedback.`
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
      sceneTag: "Production-Wide"
    });
  };

  return (
    <div className="bg-[#141721] border border-[#1E2333] rounded-2xl overflow-hidden flex flex-col h-[700px] shadow-2xl">
      {/* Top Header & Model Speed Selector */}
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
              
              <div className="flex items-center space-x-1 bg-[#141721] border border-emerald-500/30 rounded-lg px-2 py-0.5">
                <Gauge className="w-3 h-3 text-emerald-400" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-[10px] font-mono font-bold text-emerald-300 focus:outline-none cursor-pointer"
                >
                  {DIRECTOR_AI_MODELS.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#141721] text-gray-200">
                      {m.badge} - {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-gray-400">
              Low-latency token streaming &bull; Grounded telemetry &bull; Executive briefings
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

                <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap font-sans text-gray-200">
                  {m.text || (isLoading && m.id === messages[messages.length - 1]?.id ? "⚡ Streaming response..." : "")}
                </div>

                {!isUser && m.text && (
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
                        >
                          <Share2 className="w-3 h-3 text-amber-400" />
                          <span>Post to Directors' Board</span>
                        </button>
                      )}
                    </div>
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
              placeholder={`Ask the Director AI Copilot...`}
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
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-xs font-semibold text-white transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Agent</span>
          </button>
        </form>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-500">
          <span>⚡ Using Gemini 1.5 Flash-8B for lowest latency token streaming.</span>
          <span className="font-mono">Streaming Active</span>
        </div>
      </div>
    </div>
  );
}
