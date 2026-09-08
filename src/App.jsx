import React, { useState, useEffect } from 'react';
import { 
  Layers, SlidersHorizontal, FileText, MessageSquare, Search, 
  CheckCircle2, BarChart3, Bot, BellRing, Sparkles, UserCheck, Pin 
} from 'lucide-react';
import { INITIAL_PROJECT, SCRIPT_PRESETS, INITIAL_DIRECTOR_BOARD_NOTES } from './mockData';
import { USER_ROLES, INITIAL_CLIENT_REVIEWS } from './services/userRoles';
import { analyzeScriptWithGemini } from './geminiService';
import Header from './components/Header';
import WelcomeBanner from './components/WelcomeBanner';
import MasterMatrix from './components/MasterMatrix';
import DepartmentKanban from './components/DepartmentKanban';
import ScriptBeats from './components/ScriptBeats';
import DirectorHub from './components/DirectorHub';
import DirectorNotesBoard from './components/DirectorNotesBoard';
import DirectorAnalytics from './components/DirectorAnalytics';
import EnterpriseAgentsHub from './components/EnterpriseAgentsHub';
import AiBreakdownModal from './components/AiBreakdownModal';
import ExportModal from './components/ExportModal';
import UserRoleInfoModal from './components/UserRoleInfoModal';
import OnboardingGuideModal from './components/OnboardingGuideModal';
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
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem("train_platform_onboarding_completed") !== "true";
  });
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
  const [directorBoardNotes, setDirectorBoardNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("blockbuster_director_board_notes");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DIRECTOR_BOARD_NOTES;
  });

  useEffect(() => {
    try {
      localStorage.setItem("blockbuster_director_board_notes", JSON.stringify(directorBoardNotes));
    } catch (e) {}
  }, [directorBoardNotes]);

  const handleAddBoardNote = (newNote) => {
    setDirectorBoardNotes(prev => [newNote, ...prev]);
    setSuccessBanner(`📢 Directive "${newNote.title}" published to the Board of Directors Notes.`);
    setTimeout(() => setSuccessBanner(''), 4500);
  };

  const handleDeleteBoardNote = (noteId) => {
    setDirectorBoardNotes(prev => prev.filter(n => n.id !== noteId));
    setSuccessBanner("🗑️ Board directive removed.");
    setTimeout(() => setSuccessBanner(''), 3000);
  };

  const handleTogglePinBoardNote = (noteId) => {
    setDirectorBoardNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        return { ...n, pinned: !n.pinned };
      }
      return n;
    }));
  };

  const handleAcknowledgeBoardNote = (noteId, userName, roleTitle) => {
    setDirectorBoardNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        const alreadyAcked = (n.acknowledgments || []).some(a => a.userName === userName);
        if (alreadyAcked) return n;
        return {
          ...n,
          acknowledgments: [
            ...(n.acknowledgments || []),
            { userName, roleTitle, timestamp: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        };
      }
      return n;
    }));
    setSuccessBanner(`✅ Acknowledged Board Directive for ${userName}`);
    setTimeout(() => setSuccessBanner(''), 3000);
  };

  const handleAddBoardNoteReply = (noteId, reply) => {
    setDirectorBoardNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        return {
          ...n,
          replies: [...(n.replies || []), reply]
        };
      }
      return n;
    }));
    setSuccessBanner("💬 Reply added to Board Directive thread.");
    setTimeout(() => setSuccessBanner(''), 3000);
  };

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
        onOpenGuide={() => setShowOnboarding(true)}
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
        onNavigateToBoard={() => setActiveTab('board')}
        onNavigateToDirectorAi={() => setActiveTab('review')}
        currentRoleKey={currentRoleKey}
        onOpenRoleMatrix={() => setShowRoleModal(true)}
        onOpenGuide={() => setShowOnboarding(true)}
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
      <div className="bg-[#141721] border-b border-[#1E2333] px-3 sm:px-6 py-2 sm:py-2.5 flex flex-col md:flex-row gap-2.5 sm:gap-3 md:items-center justify-between">
        {/* Horizontal Touch Scrollable Tab Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none scroll-smooth -mx-1 px-1">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
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
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'kanban' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Department Board</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'script' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Script &amp; Beats</span>
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'board' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-amber-400" />
            <span>Directors' Board</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#0B0D13] text-amber-300 border border-amber-500/30">
              {directorBoardNotes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'review' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Director Hub &amp; AI</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'agents' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <BellRing className="w-3.5 h-3.5 text-indigo-400" />
            <span>Agents (Reminders)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'analytics' 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2333]/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Director Analytics</span>
          </button>
        </div>

        {/* Search & Act Filter Controls */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search slugline, cast..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0B0D13] border border-[#1E2333] rounded-lg pl-8 pr-3 py-1 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>

          <select 
            value={filterAct}
            onChange={(e) => setFilterAct(e.target.value)}
            className="bg-[#0B0D13] border border-[#1E2333] rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="ALL">All Acts</option>
            <option value="Act I">Act I</option>
            <option value="Act IIA">Act IIA</option>
            <option value="Act IIB">Act IIB</option>
            <option value="Act III">Act III</option>
          </select>
        </div>
      </div>

      {/* Pinned Director Directive Broadcast Ticker */}
      {directorBoardNotes.find(n => n.pinned) && activeTab !== 'board' && (
        <div className="bg-[#121620] border-b border-amber-500/30 px-3 sm:px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5 overflow-hidden min-w-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 flex items-center space-x-1">
              <Pin className="w-3 h-3 text-amber-400" />
              <span>DIRECTOR MANDATE</span>
            </span>
            <span className="text-gray-200 font-semibold truncate shrink-0">
              {directorBoardNotes.find(n => n.pinned)?.title}:
            </span>
            <span className="text-gray-400 truncate hidden md:inline">
              {directorBoardNotes.find(n => n.pinned)?.content}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('board')}
            className="text-amber-400 hover:text-amber-300 text-xs font-semibold underline shrink-0 ml-3"
          >
            View Board &rarr;
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
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

        {activeTab === 'board' && (
          <DirectorNotesBoard 
            boardNotes={directorBoardNotes}
            onAddBoardNote={handleAddBoardNote}
            onDeleteBoardNote={handleDeleteBoardNote}
            onTogglePinBoardNote={handleTogglePinBoardNote}
            onAcknowledgeBoardNote={handleAcknowledgeBoardNote}
            onAddReplyToBoardNote={handleAddBoardNoteReply}
            currentRoleKey={currentRoleKey}
            project={project}
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
            boardNotes={directorBoardNotes}
            onAddBoardNote={handleAddBoardNote}
            onDeleteBoardNote={handleDeleteBoardNote}
            onTogglePinBoardNote={handleTogglePinBoardNote}
            onAcknowledgeBoardNote={handleAcknowledgeBoardNote}
            onAddReplyToBoardNote={handleAddBoardNoteReply}
            geminiApiKey={geminiApiKey}
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

      {/* First-Time User Guidance & Onboarding Tour */}
      <OnboardingGuideModal 
        show={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        currentRoleKey={currentRoleKey}
        onSelectRole={handleSelectRole}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}
