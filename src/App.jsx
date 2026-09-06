import React, { useState } from 'react';
import { Layers, SlidersHorizontal, FileText, MessageSquare, Search, CheckCircle2, BarChart3, Bot } from 'lucide-react';
import { INITIAL_PROJECT, SCRIPT_PRESETS } from './mockData';
import { analyzeScriptWithGemini } from './geminiService';
import Header from './components/Header';
import WelcomeBanner from './components/WelcomeBanner';
import MasterMatrix from './components/MasterMatrix';
import DepartmentKanban from './components/DepartmentKanban';
import ScriptBeats from './components/ScriptBeats';
import DirectorHub from './components/DirectorHub';
import DirectorAnalytics from './components/DirectorAnalytics';
import EnterpriseAgentsHub from './components/EnterpriseAgentsHub';
import AiBreakdownModal from './components/AiBreakdownModal';
import ExportModal from './components/ExportModal';

export default function App() {
  const [project, setProject] = useState(INITIAL_PROJECT);
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedDept, setSelectedDept] = useState('picture');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAct, setFilterAct] = useState('ALL');
  const [selectedScene, setSelectedScene] = useState(project.scenes[0]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importScriptText, setImportScriptText] = useState(SCRIPT_PRESETS[0].text);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const handleUpdateStatus = (sceneId, deptKey, newStatus) => {
    setProject(prev => ({
      ...prev,
      scenes: prev.scenes.map(s => {
        if (s.id === sceneId) {
          return {
            ...s,
            [deptKey]: {
              ...s[deptKey],
              status: newStatus
            }
          };
        }
        return s;
      })
    }));
  };

  const handleRunGeminiBreakdown = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeScriptWithGemini(importScriptText, geminiApiKey);
      if (result && result.scenes && result.scenes.length > 0) {
        setProject({
          id: `proj_${Date.now()}`,
          title: result.title || "IMPORTED PRODUCTION SCRIPT",
          director: result.director || "Denis Villeneuve",
          leadEditor: result.leadEditor || "Joe Walker, ACE",
          frameRate: "24.00 fps",
          aspectRatio: "2.39:1 Anamorphic",
          scenes: result.scenes
        });
        setSelectedScene(result.scenes[0]);
        setShowImportModal(false);
        setSuccessBanner(`✨ Generated new breakdown for "${result.title}" with ${result.scenes.length} scenes across ${new Set(result.scenes.map(s => s.act)).size} Acts!`);
        setTimeout(() => setSuccessBanner(''), 7000);
      }
    } catch (e) {
      console.error(e);
      alert("Error parsing screenplay with Gemini: " + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddDirectorNote = (sceneId, text) => {
    setProject(prev => ({
      ...prev,
      scenes: prev.scenes.map(s => {
        if (s.id === sceneId) {
          return {
            ...s,
            picture: {
              ...s.picture,
              note: (s.picture.note ? s.picture.note + " | " : "") + text
            }
          };
        }
        return s;
      })
    }));
    setSuccessBanner("📝 Director note saved to Scene " + sceneId.replace('sc_',''));
    setTimeout(() => setSuccessBanner(''), 3000);
  };

  const filteredScenes = project.scenes.filter(s => {
    const matchesSearch = s.slugline.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.sceneNumber.includes(searchTerm) ||
                          s.characters.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAct = filterAct === 'ALL' || s.act === filterAct;
    return matchesSearch && matchesAct;
  });

  return (
    <div className="min-h-screen bg-[#0B0D13] text-gray-100 flex flex-col font-sans">
      <Header 
        project={project} 
        onOpenExport={() => setShowExportModal(true)} 
        onOpenImport={() => setShowImportModal(true)} 
      />

      {/* Cinematic Director Welcome Banner */}
      <WelcomeBanner 
        project={project}
        onOpenImport={() => setShowImportModal(true)}
        onNavigateToAnalytics={() => setActiveTab('analytics')}
        onNavigateToMatrix={() => setActiveTab('matrix')}
      />

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-indigo-600/90 border-b border-indigo-500 text-white text-xs px-6 py-2.5 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner('')} className="text-white/80 hover:text-white font-bold">&times;</button>
        </div>
      )}

      {/* Sub Navigation Bar */}
      <div className="bg-[#141721] border-b border-[#1E2333] px-6 py-2.5 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'matrix' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Master Scene Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'kanban' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Department Pipeline Board</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'script' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Script &amp; Emotional Beats</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'review' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Director Review Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'agents' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Enterprise Agents (Reminders)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'analytics' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Director Analytics (Grafana)</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search slugline, cast..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0B0D13] border border-[#1E2333] rounded-lg pl-8 pr-3 py-1 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-52"
            />
          </div>

          <select 
            value={filterAct}
            onChange={(e) => setFilterAct(e.target.value)}
            className="bg-[#0B0D13] border border-[#1E2333] rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Acts</option>
            <option value="Act I">Act I</option>
            <option value="Act IIA">Act IIA</option>
            <option value="Act IIB">Act IIB</option>
            <option value="Act III">Act III</option>
          </select>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'matrix' && (
          <MasterMatrix 
            filteredScenes={filteredScenes} 
            selectedScene={selectedScene} 
            onSelectScene={setSelectedScene} 
            onUpdateStatus={handleUpdateStatus} 
          />
        )}

        {activeTab === 'kanban' && (
          <DepartmentKanban 
            selectedDept={selectedDept} 
            onSelectDept={setSelectedDept} 
            filteredScenes={filteredScenes} 
            onSelectScene={setSelectedScene} 
          />
        )}

        {activeTab === 'script' && (
          <ScriptBeats 
            filteredScenes={filteredScenes} 
            selectedScene={selectedScene} 
            onSelectScene={setSelectedScene} 
          />
        )}

        {activeTab === 'review' && (
          <DirectorHub 
            project={project} 
            selectedScene={selectedScene} 
            onSelectScene={setSelectedScene} 
            onAddDirectorNote={handleAddDirectorNote} 
          />
        )}

        {activeTab === 'agents' && (
          <EnterpriseAgentsHub 
            project={project}
            geminiApiKey={geminiApiKey} 
          />
        )}

        {activeTab === 'analytics' && (
          <DirectorAnalytics 
            project={project} 
          />
        )}
      </main>

      {/* Modals */}
      <AiBreakdownModal 
        show={showImportModal} 
        onClose={() => setShowImportModal(false)} 
        scriptText={importScriptText} 
        setScriptText={setImportScriptText} 
        geminiApiKey={geminiApiKey} 
        setGeminiApiKey={setGeminiApiKey} 
        isAnalyzing={isAnalyzing} 
        onRunBreakdown={handleRunGeminiBreakdown} 
      />

      <ExportModal 
        show={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        onExport={() => {
          alert("Exported OpenTimelineIO (.otio) and XML package.");
          setShowExportModal(false);
        }} 
      />
    </div>
  );
}
