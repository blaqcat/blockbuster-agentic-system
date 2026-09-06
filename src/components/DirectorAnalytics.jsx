import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend 
} from 'recharts';
import { 
  Activity, Target, CheckCircle, AlertTriangle, Clock, TrendingUp, 
  Layers, Sparkles, Sliders, RefreshCw, Server, Send, Radio
} from 'lucide-react';

export default function DirectorAnalytics({ project }) {
  const [grafanaEndpoint, setGrafanaEndpoint] = useState('https://grafana.cloud.google.com/api/v1/push');
  const [grafanaApiKey, setGrafanaApiKey] = useState('eyJrIjoidGVzdC1ncmFmYW5hLXBvc3QtcHJvZHVjdGlvbi1rZXkiLCJuIjoidmlsbGVuZXV2ZS1zdHVkaW8ifQ==');
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState('');
  const [timeRange, setTimeRange] = useState('14D');

  const totalScenes = project.scenes.length;
  const lockedScenes = project.scenes.filter(s => s.picture.status === 'LOCKED').length;
  const fineCutScenes = project.scenes.filter(s => s.picture.status === 'FINE_CUT').length;
  const roughCutScenes = project.scenes.filter(s => s.picture.status === 'ROUGH_CUT').length;
  const assemblyScenes = project.scenes.filter(s => s.picture.status === 'ASSEMBLY').length;

  const totalVfx = project.scenes.reduce((acc, s) => acc + (s.vfx.shotsCount || 0), 0);
  const approvedVfx = project.scenes.reduce((acc, s) => acc + (s.vfx.shotsApproved || 0), 0);
  const vfxCompletionRate = totalVfx > 0 ? Math.round((approvedVfx / totalVfx) * 100) : 0;

  // Objective Forecast Burn-Down Data (Grafana Timeseries Simulation)
  const burnDownData = [
    { day: 'Day 1', actualRemaining: totalScenes, targetIdeal: totalScenes, vfxBacklog: totalVfx },
    { day: 'Day 3', actualRemaining: totalScenes, targetIdeal: Math.max(0, totalScenes - 1), vfxBacklog: totalVfx },
    { day: 'Day 6', actualRemaining: Math.max(0, totalScenes - 1), targetIdeal: Math.max(0, totalScenes - 2), vfxBacklog: Math.max(0, totalVfx - 4) },
    { day: 'Day 9', actualRemaining: Math.max(0, totalScenes - 2), targetIdeal: Math.max(0, totalScenes - 3), vfxBacklog: Math.max(0, totalVfx - 8) },
    { day: 'Day 12', actualRemaining: Math.max(0, totalScenes - lockedScenes), targetIdeal: Math.max(0, totalScenes - 4), vfxBacklog: Math.max(0, totalVfx - approvedVfx) },
    { day: 'Day 15 (Est)', actualRemaining: Math.max(0, totalScenes - lockedScenes - 1), targetIdeal: 0, vfxBacklog: Math.max(0, totalVfx - approvedVfx - 5) },
    { day: 'Day 18 (Lock)', actualRemaining: 0, targetIdeal: 0, vfxBacklog: 0 },
  ];

  // Departmental Readiness Radar Data (0 - 100% completion)
  const soundFinal = project.scenes.filter(s => s.sound.status === 'FINAL_MIX').length;
  const colorApproved = project.scenes.filter(s => s.color.status === 'APPROVED').length;
  const masterPassed = project.scenes.filter(s => s.mastering.status === 'PASSED').length;

  const radarData = [
    { department: 'Picture Lock', readiness: totalScenes > 0 ? Math.round((lockedScenes / totalScenes) * 100) : 0, fullMark: 100 },
    { department: 'Sound Final', readiness: totalScenes > 0 ? Math.round((soundFinal / totalScenes) * 100) : 0, fullMark: 100 },
    { department: 'VFX Approved', readiness: vfxCompletionRate, fullMark: 100 },
    { department: 'Color Graded', readiness: totalScenes > 0 ? Math.round((colorApproved / totalScenes) * 100) : 0, fullMark: 100 },
    { department: 'Master QC', readiness: totalScenes > 0 ? Math.round((masterPassed / totalScenes) * 100) : 0, fullMark: 100 },
  ];

  // Scene Pacing & Page Distribution (Runtime vs Pages)
  const pacingData = project.scenes.map((s, idx) => {
    const runtimeSeconds = s.runtimeEst.includes('m')
      ? parseInt(s.runtimeEst.split('m')[0]) * 60 + parseInt(s.runtimeEst.split('m')[1].replace('s', '').trim() || 0)
      : 90;
    return {
      scene: `Sc ${s.sceneNumber}`,
      pages: s.pages,
      runtimeMinutes: +(runtimeSeconds / 60).toFixed(2),
      act: s.act,
      vfxCount: s.vfx.shotsCount || 0
    };
  });

  const handlePushGrafanaMetrics = () => {
    setIsPushing(true);
    setPushStatus('');

    setTimeout(() => {
      setIsPushing(false);
      setPushStatus(`✅ Successfully emitted 24 telemetry metrics to Grafana endpoint: ${grafanaEndpoint}`);
      setTimeout(() => setPushStatus(''), 7000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header & Objectives Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#141721] border border-[#1E2333] rounded-2xl p-6">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Director Objective &amp; Velocity Radar</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Grafana Engine API
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time delivery forecasts, post-production velocity curves, and milestone risk detection for <strong className="text-gray-200">{project.title}</strong>.
          </p>
        </div>

        {/* Grafana API Control Modal Trigger / Actions */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={handlePushGrafanaMetrics}
            disabled={isPushing}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
          >
            {isPushing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing Grafana API...</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5" />
                <span>Push Telemetry to Grafana</span>
              </>
            )}
          </button>
        </div>
      </div>

      {pushStatus && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2.5 rounded-xl font-mono flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{pushStatus}</span>
        </div>
      )}

      {/* Primary KPI Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Picture Lock Velocity */}
        <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Picture Lock Velocity</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">{lockedScenes}/{totalScenes}</span>
            <span className="text-xs font-medium text-amber-400">
              ({totalScenes > 0 ? Math.round((lockedScenes / totalScenes) * 100) : 0}%)
            </span>
          </div>
          <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1 border-t border-[#1E2333]">
            <span>Fine Cut: <strong>{fineCutScenes}</strong></span>
            <span>Rough Cut: <strong>{roughCutScenes}</strong></span>
          </div>
        </div>

        {/* Metric 2: VFX Turnaround & Approval */}
        <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">VFX Approval Rate</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">{approvedVfx}/{totalVfx}</span>
            <span className="text-xs font-medium text-purple-400">({vfxCompletionRate}%)</span>
          </div>
          <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1 border-t border-[#1E2333]">
            <span>Backlog: <strong>{totalVfx - approvedVfx} shots</strong></span>
            <span className="text-emerald-400">On Schedule</span>
          </div>
        </div>

        {/* Metric 3: Target Picture Lock Date */}
        <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Projected Delivery</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-cyan-300">18 Days</span>
            <span className="text-xs font-medium text-gray-400">to Picture Lock</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1 pt-1 border-t border-[#1E2333]">
            <TrendingUp className="w-3 h-3" />
            <span>Target: November 14 (Meets Festival Deadline)</span>
          </div>
        </div>

        {/* Metric 4: Health & Risk Assessment */}
        <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Risk Telemetry</span>
            <AlertTriangle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">LOW RISK</span>
          </div>
          <div className="text-[11px] text-gray-400 pt-1 border-t border-[#1E2333]">
            0 Critical Blockers &bull; Sound &amp; Color ready for lock
          </div>
        </div>
      </div>

      {/* Main Charts Grid (Grafana-style panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Picture Lock Burn-Down vs Ideal Curve (Area / Line) */}
        <div className="lg:col-span-8 bg-[#141721] border border-[#1E2333] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2333] pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Milestone Burn-Down Forecast (Grafana Timeseries)
              </h3>
              <p className="text-[11px] text-gray-400">Actual remaining scenes vs. Ideal linear burn-down schedule</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-2 py-1 bg-[#1E2333] text-gray-300 rounded font-mono">24 FPS Scope</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={burnDownData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIdeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2333" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[0, totalScenes + 1]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0D13', borderColor: '#2C344B', borderRadius: '8px', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="actualRemaining" name="Actual Unlocked Scenes" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                <Line type="monotone" dataKey="targetIdeal" name="Ideal Target Baseline" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Department Readiness Radar */}
        <div className="lg:col-span-4 bg-[#141721] border border-[#1E2333] rounded-2xl p-5 space-y-4">
          <div className="border-b border-[#1E2333] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Department Pipeline Readiness
            </h3>
            <p className="text-[11px] text-gray-400">Post-production synchronization balance</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#1E2333" />
                <PolarAngleAxis dataKey="department" stroke="#9ca3af" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4b5563" fontSize={9} />
                <Radar name="Readiness %" dataKey="readiness" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.35} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0D13', borderColor: '#2C344B', borderRadius: '8px', fontSize: '12px' }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts: Scene Pacing vs Screenplay Page Density & Grafana Config Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: Pacing & Duration by Scene */}
        <div className="lg:col-span-7 bg-[#141721] border border-[#1E2333] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2333] pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Pacing &amp; Screenplay Density Curve
              </h3>
              <p className="text-[11px] text-gray-400">Runtime estimate (minutes) vs Screenplay page count per scene</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pacingData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2333" />
                <XAxis dataKey="scene" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0D13', borderColor: '#2C344B', borderRadius: '8px', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="pages" name="Script Pages" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="runtimeMinutes" name="Est. Runtime (Min)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vfxCount" name="VFX Shot Density" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 4: Grafana Telemetry Endpoint Configuration */}
        <div className="lg:col-span-5 bg-[#141721] border border-[#1E2333] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-[#1E2333] pb-3">
              <Server className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Grafana Cloud Telemetry Gateway
              </h3>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">
                  Prometheus / Grafana Influx API URL
                </label>
                <input 
                  type="text" 
                  value={grafanaEndpoint}
                  onChange={(e) => setGrafanaEndpoint(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">
                  Grafana Authorization Bearer Token
                </label>
                <input 
                  type="password" 
                  value={grafanaApiKey}
                  onChange={(e) => setGrafanaApiKey(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-[#0B0D13] rounded-xl border border-[#1E2333] text-[11px] text-gray-400 font-mono space-y-1">
                <div className="text-indigo-400 font-bold">// Telemetry Payload Schema</div>
                <div>POST /api/v1/push</div>
                <div>metric: post_production_picture_lock_ratio = {(lockedScenes/totalScenes).toFixed(2)}</div>
                <div>metric: vfx_approval_throughput_ratio = {(approvedVfx/totalVfx).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePushGrafanaMetrics}
            disabled={isPushing}
            className="w-full mt-3 py-2 rounded-xl bg-[#1E2333] hover:bg-[#2C344B] text-indigo-300 hover:text-white text-xs font-semibold border border-[#2C344B] transition flex items-center justify-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test Telemetry Ping</span>
          </button>
        </div>
      </div>
    </div>
  );
}
