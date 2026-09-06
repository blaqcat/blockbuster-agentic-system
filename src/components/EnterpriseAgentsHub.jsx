import React, { useState } from 'react';
import { 
  Bot, ShieldAlert, Zap, Send, Clock, CheckCircle2, AlertTriangle, 
  RefreshCw, MessageSquare, Radio, Settings, Server, Layers, BellRing, Sparkles
} from 'lucide-react';
import { ENTERPRISE_AGENTS_CONFIG, runEnterpriseAgentAudit } from '../services/enterpriseAgentsService';

export default function EnterpriseAgentsHub({ project, geminiApiKey }) {
  const [reminders, setReminders] = useState([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [webhookUrl, setWebhookUrl] = useState('https://chat.googleapis.com/v1/spaces/FILM_POST_WAR_ROOM/messages?key=AIzaSy...&token=...');
  const [cronInterval, setCronInterval] = useState('2h');
  const [dispatchedCount, setDispatchedCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const handleRunAudit = async () => {
    setIsRunningAudit(true);
    setStatusMessage('');
    try {
      const generated = await runEnterpriseAgentAudit(project, geminiApiKey);
      setReminders(generated);
      setStatusMessage(`✨ Gemini Enterprise Agent fleet audited ${project.scenes.length} scenes and generated ${generated.length} actionable department reminders.`);
    } catch (e) {
      console.error(e);
      setStatusMessage("Error running enterprise agent audit: " + e.message);
    } finally {
      setIsRunningAudit(false);
    }
  };

  const handleDispatchReminder = (remId) => {
    setReminders(prev => prev.map(r => {
      if (r.id === remId) {
        return { ...r, status: "DISPATCHED", dispatchedAt: new Date().toLocaleTimeString() };
      }
      return r;
    }));
    setDispatchedCount(c => c + 1);
  };

  const handleDispatchAll = () => {
    setReminders(prev => prev.map(r => ({
      ...r,
      status: "DISPATCHED",
      dispatchedAt: new Date().toLocaleTimeString()
    })));
    setDispatchedCount(reminders.length);
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Fleet Banner */}
      <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
              <Bot className="w-3 h-3 text-indigo-400" />
              <span>Google Cloud Agent Platform &bull; Gemini 1.5</span>
            </span>
            <span className="text-xs text-emerald-400 font-mono font-medium flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
              <span>6 Enterprise Agents Live</span>
            </span>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Autonomous Department Run-Down &amp; SLA Reminders</span>
          </h2>

          <p className="text-xs text-gray-400 max-w-3xl leading-relaxed">
            Gemini Enterprise Agents continuously inspect your scenes, detect stalled cut approvals, track vendor turnaround windows, and automatically dispatch context-aware reminders directly to <strong>Google Chat</strong>, <strong>Slack</strong>, and <strong>Department Leads</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRunAudit}
            disabled={isRunningAudit}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            {isRunningAudit ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Departments...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Run Autonomous Department Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-indigo-600/10 border border-indigo-500/30 text-indigo-200 text-xs px-4 py-3 rounded-xl flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage('')} className="text-gray-400 hover:text-white">&times;</button>
        </div>
      )}

      {/* Agent Fleet Roster */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-2">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active Enterprise Agent Fleet</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ENTERPRISE_AGENTS_CONFIG.map(agent => (
            <div 
              key={agent.id}
              className={`p-4 rounded-xl border bg-[#141721] ${agent.border} hover:border-indigo-500/40 transition flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${agent.bg} ${agent.color}`}>
                    {agent.department}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Monitoring</span>
                  </span>
                </div>

                <div className="mt-2.5 font-bold text-sm text-gray-200">{agent.name}</div>
                <div className="text-[11px] font-mono text-gray-400">{agent.role}</div>

                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E2333] flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span>Autonomous SLA: &lt; 4h</span>
                <span className="text-indigo-400">Gemini 1.5</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Reminders & Dispatch Queue */}
      <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E2333] gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Department Reminder Dispatch Queue</span>
            </h3>
            <p className="text-[11px] text-gray-400">Contextual alerts generated for Picture, Sound, VFX, Color, and Mastering</p>
          </div>

          <div className="flex items-center space-x-2">
            {reminders.length > 0 && (
              <button 
                onClick={handleDispatchAll}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Send className="w-3 h-3" />
                <span>Dispatch All Reminders ({reminders.length})</span>
              </button>
            )}
          </div>
        </div>

        {reminders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 space-y-3">
            <Bot className="w-10 h-10 mx-auto text-gray-600" />
            <div className="text-xs font-medium">No active reminder queue.</div>
            <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
              Click <strong>"Run Autonomous Department Audit"</strong> above to let Gemini Enterprise Agents evaluate your scenes and generate targeted reminders.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map(rem => (
              <div 
                key={rem.id}
                className="p-4 bg-[#0B0D13] rounded-xl border border-[#1E2333] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/40 transition"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">Scene {rem.sceneNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {rem.targetDepartment}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      To: <strong className="text-gray-200">{rem.recipient}</strong> ({rem.channel})
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      rem.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {rem.priority} PRIORITY
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {rem.message}
                  </p>
                </div>

                <div className="flex items-center space-x-2.5">
                  {rem.status === 'DISPATCHED' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sent {rem.dispatchedAt}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDispatchReminder(rem.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Dispatch Now</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Webhook & Scheduled Run-Down Configuration */}
      <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#1E2333] pb-3">
          <Settings className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
            Google Cloud Agent Engine &amp; Webhook Triggers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">
              Google Chat / Slack Notification Webhook
            </label>
            <input 
              type="text" 
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">
              Automated Run-Down Frequency (Cron Schedule)
            </label>
            <select
              value={cronInterval}
              onChange={(e) => setCronInterval(e.target.value)}
              className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="1h">Every 1 Hour (High-Intensity Picture Lock Sprint)</option>
              <option value="2h">Every 2 Hours (Standard Production Day)</option>
              <option value="callsheet">Daily at 08:00 AM Call-Sheet Dispatch</option>
              <option value="event">Event-Driven (Trigger on Picture Lock / VFX Plate Pull)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
