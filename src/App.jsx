import React, { useState, useEffect } from 'react';
import { 
  Layers, SlidersHorizontal, FileText, MessageSquare, Search, 
  CheckCircle2, BarChart3, Bot, BellRing, Sparkles, UserCheck 
} from 'lucide-react';
import { INITIAL_PROJECT, SCRIPT_PRESETS } from './mockData';
import { USER_ROLES, INITIAL_CLIENT_REVIEWS } from './services/userRoles';
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
import UserRoleInfoModal from './components/UserRoleInfoModal';
import IAPLandingPage from './components/IAPLandingPage';

export default function App() {
  const [project, setProject] = useState(INITIAL_PROJECT);
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedDept, setSelectedDept] = useState('picture');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAct, setFilterAct] = useState('ALL');
  const [selectedScene, setSelectedScene] = useState(project.scenes[0]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(() => {
    return !localStorage.getItem("blockbuster_auth_user");
  });
  
  // 4 Levels of Users State
  const [currentRoleKey, setCurrentRoleKey] = useState(() => {
    try {
      const saved = localStorage.getItem("blockbuster_auth_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.roleId && USER_ROLES[parsed.roleId]) {
          return parsed.roleId;
        }
      }
    } catch (e) {}
    return 'EXECUTIVE_DIRECTOR';
  });
  const [clientReviews, setClientReviews] = useState(INITIAL_CLIENT_REVIEWS);

  const [importScriptText, setImportScriptText] = useState(SCRIPT_PRESETS[0].text);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;

  const handleSelectRole = (roleId) => {
    if (!USER_ROLES[roleId]) return;
    setCurrentRoleKey(roleId);
    const newRole = USER_ROLES[roleId];
    setSuccessBanner(`⚡ Switched session to Level ${newRole.level}: ${newRole.title} (${newRole.defaultUser.name})`);
    setTimeout(() => setSuccessBanner(''), 4500);
  };

  const handleUpdateStatus = (sceneId, deptKey, newStatus) => {
    setProject(prev => {
      const nextScenes = prev.scenes.map(s => {
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
      });

      // Also keep selectedScene in sync
      const updatedScene = nextScenes.find(s => s.id === sceneId);
      if (selectedScene?.id === sceneId && updatedScene) {
        setSelectedScene(updatedScene);
      }

      return {
        ...prev,
        scenes: nextScenes
      };
    });
  };

  const handleUpdateScenePicture = (sceneId, pictureData) => {
    setProject(prev => {
      const nextScenes = prev.scenes.map(s => {
        if (s.id === sceneId) {
          return {
            ...s,
            picture: pictureData
          };
        }
        return s;
      });

      const updatedScene = nextScenes.find(s => s.id === sceneId);
      if (selectedScene?.id === sceneId && updatedScene) {
        setSelectedScene(updatedScene);
      }

      return {
        ...prev,
        scenes: nextScenes
      };
    });
  };

  const handleUpdateSceneCraft = (sceneId, deptKey, deptData) => {
    setProject(prev => {
      const nextScenes = prev.scenes.map(s => {
        if (s.id === sceneId) {
          return {
            ...s,
            [deptKey]: deptData
          };
        }
        return s;
      });

      const updatedScene = nextScenes.find(s => s.id === sceneId);
      if (selectedScene?.id === sceneId && updatedScene) {
        setSelectedScene(updatedScene);
      }

      return {
        ...prev,
        scenes: nextScenes
      };
    });
  };

  const handleAddClientReview = (sceneId, newReview) => {
    setClientReviews(prev => ({
      ...prev,
      [sceneId]: [newReview, ...(prev[sceneId] || [])]
    }));
    setSuccessBanner(`🌟 Client screening review logged for Scene ${sceneId.replace('sc_','')}`);
    setTimeout(() => setSuccessBanner(''), 3500);
  };

  const handleRequestLockSignOff = (sceneId) => {
    setSuccessBanner(`🔔 Lock request sent to Executive Director (Jerry Vance) for Scene ${sceneId.replace('sc_','')}`);
    setTimeout(() => setSuccessBanner(''), 5000);
  };

  const handleRunGeminiBreakdown = async () => {
    if (!currentRole.permissions.canImportScript) {
      alert(`Importing and parsing scripts requires Level 1 (Executive Director) authority.`);
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeScriptWithGemini(importScriptText, geminiApiKey);
      if (result && result.scenes && result.scenes.length > 0) {
        const newProj = {
          id: `proj_${Date.now()}`,
          title: result.title || "IMPORTED PRODUCTION SCRIPT",
          director: result.director || "Denis Villeneuve",
          leadEditor: result.leadEditor || "Joe Walker, ACE",
          frameRate: "24.00 fps",
          aspectRatio: "2.39:1 Anamorphic",
          scenes: result.scenes
        };
        setProject(newProj);
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
    setProject(prev => {
      const nextScenes = prev.scenes.map(s => {
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
      });

      const updatedScene = nextScenes.find(s => s.id === sceneId);
      if (selectedScene?.id === sceneId && updatedScene) {
        setSelectedScene(updatedScene);
      }

      return {
        ...prev,
        scenes: nextScenes
      };
    });
    setSuccessBanner("📝 Spotting note saved to Scene " + sceneId.replace('sc_',''));
    setTimeout(() => setSuccessBanner(''), 3000);
  };

  const filteredScenes = project.scenes.filter(s => {
    const matchesSearch = s.slugline.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.sceneNumber.includes(searchTerm) ||
                          s.characters.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAct = filterAct === 'ALL' || s.act === filterAct;
    return matchesSearch && matchesAct;
  });

  if (showAuthGate) {
    return (
      <IAPLandingPage 
        onLoginSuccess={(user) => {
          if (user.roleId && USER_ROLES[user.roleId]) {
            setCurrentRoleKey(user.roleId);
          }
          setShowAuthGate(false);
          setSuccessBanner(`✨ Authenticated via Google Cloud IAP as ${user.name} (${user.role})`);
          setTimeout(() => setSuccessBanner(''), 4000);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D13] text-gray-100 flex flex-col font-sans">
      {/* App Header with Interactive Role Switcher */}
      <Header 
        project={project} 
        onOpenExport={() => setShowExportModal(true)} 
        onOpenImport={() => setShowImportModal(true)} 
        currentRoleKey={currentRoleKey}
        onSelectRole={handleSelectRole}
        onOpenRoleMatrix={() => setShowRoleModal(true)}
        onSignOut={() => {
          localStorage.removeItem("blockbuster_auth_user");
          setShowAuthGate(true);
        }}
      />

      {/* Cinematic Level-Aware Welcome Banner */}
      <WelcomeBanner 
        project={project}
        onOpenImport={() => setShowImportModal(true)}
        onNavigateToAnalytics={() => setActiveTab('analytics')}
        onNavigateToMatrix={() => setActiveTab('matrix')}
        currentRoleKey={currentRoleKey}
        onOpenRoleMatrix={() => setShowRoleModal(true)}
      />

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-indigo-600/95 border-b border-indigo-500 text-white text-xs px-6 py-2.5 flex items-center justify-between transition-all duration-300 shadow-md">
          <div className="flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner('')} className="text-white/80 hover:text-white font-bold text-sm ml-4">&times;</button>
        </div>
      )}

      {/* Sub Navigation Bar */}
      <div className="bg-[#141721] border-b border-[#1E2333] px-6 py-2.5 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
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
              className="bg-[#0B0D13] border border-[#1E2333] rounded-lg pl-8 pr-3 py-1 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-48"
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
            onUpdateScenePicture={handleUpdateScenePicture}
            onUpdateSceneCraft={handleUpdateSceneCraft}
            onAddClientReview={handleAddClientReview}
            clientReviews={clientReviews}
            onRequestLockSignOff={handleRequestLockSignOff}
            onOpenExport={() => setShowExportModal(true)}
            currentRoleKey={currentRoleKey}
          />
        )}

        {activeTab === 'kanban' && (
          <DepartmentKanban 
            selectedDept={selectedDept} 
            onSelectDept={setSelectedDept} 
            filteredScenes={filteredScenes} 
            onSelectScene={setSelectedScene} 
            onUpdateStatus={handleUpdateStatus}
            currentRoleKey={currentRoleKey}
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
            clientReviews={clientReviews}
            onAddClientReview={handleAddClientReview}
            currentRoleKey={currentRoleKey}
          />
        )}

        {activeTab === 'agents' && (
          <EnterpriseAgentsHub 
            project={project}
            geminiApiKey={geminiApiKey} 
            currentRoleKey={currentRoleKey}
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

      {/* 4 Levels of Users Information & Permissions Matrix Modal */}
      <UserRoleInfoModal 
        show={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentRoleKey={currentRoleKey}
        onSelectRole={handleSelectRole}
      />
    </div>
  );
}
