import React, { useState } from 'react';
import { 
  Pin, MessageSquare, Plus, CheckCircle2, ShieldCheck, Clock, 
  Send, Trash2, Edit3, User, Sparkles, Filter, Search, AlertTriangle, 
  ChevronDown, ChevronUp, BellRing, Eye, Check, Tag
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';

export default function DirectorNotesBoard({ 
  boardNotes, 
  onAddBoardNote, 
  onDeleteBoardNote, 
  onTogglePinBoardNote,
  onAcknowledgeBoardNote,
  onAddReplyToBoardNote,
  currentRoleKey,
  project,
  prefillDraft,
  onClearPrefillDraft
}) {
  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;
  const isDirector = currentRoleKey === 'EXECUTIVE_DIRECTOR' || currentRole.level === 1;

  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyInputs, setReplyInputs] = useState({});

  // Form State for new note
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [newDept, setNewDept] = useState('ALL');
  const [newSceneTag, setNewSceneTag] = useState('Production-Wide');
  const [newPinned, setNewPinned] = useState(false);

  // If there's a prefilled draft from Director AI
  React.useEffect(() => {
    if (prefillDraft) {
      setNewTitle(prefillDraft.title || 'Executive Director Directive');
      setNewContent(prefillDraft.content || '');
      setNewPriority(prefillDraft.priority || 'HIGH');
      setNewDept(prefillDraft.targetDepartment || 'ALL');
      setNewSceneTag(prefillDraft.sceneTag || 'Production-Wide');
      setShowCreateModal(true);
      if (onClearPrefillDraft) onClearPrefillDraft();
    }
  }, [prefillDraft]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddBoardNote({
      id: `db_note_${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: currentRole.defaultUser.name,
      authorRole: `${currentRole.title} (Level ${currentRole.level})`,
      authorAvatar: currentRole.defaultUser.avatar,
      targetDepartment: newDept,
      priority: newPriority,
      pinned: newPinned,
      sceneTag: newSceneTag.trim() || 'Production-Wide',
      createdAt: "Just now",
      acknowledgments: [
        {
          userName: currentRole.defaultUser.name,
          roleTitle: currentRole.shortTitle,
          timestamp: "Just now"
        }
      ],
      replies: []
    });

    setNewTitle('');
    setNewContent('');
    setNewPriority('HIGH');
    setNewDept('ALL');
    setNewSceneTag('Production-Wide');
    setNewPinned(false);
    setShowCreateModal(false);
  };

  const handleReplySubmit = (noteId) => {
    const text = replyInputs[noteId];
    if (!text || !text.trim()) return;

    onAddReplyToBoardNote(noteId, {
      id: `rep_${Date.now()}`,
      author: currentRole.defaultUser.name,
      role: currentRole.shortTitle,
      text: text.trim(),
      timestamp: "Just now"
    });

    setReplyInputs(prev => ({ ...prev, [noteId]: '' }));
  };

  const toggleReplies = (noteId) => {
    setExpandedReplies(prev => ({ ...prev, [noteId]: !prev[noteId] }));
  };

  // Filter notes
  const filteredNotes = (boardNotes || []).filter(note => {
    const matchesDept = selectedDept === 'ALL' || note.targetDepartment === selectedDept || note.targetDepartment === 'ALL';
    const matchesPriority = selectedPriority === 'ALL' || note.priority === selectedPriority;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (note.sceneTag && note.sceneTag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          note.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesPriority && matchesSearch;
  });

  // Sort: pinned first, then newest
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'CREATIVE':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'MILESTONE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  const getDeptBadge = (dept) => {
    switch(dept) {
      case 'EDITORIAL':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'VFX':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'SOUND':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'COLOR':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'CLIENT':
        return 'bg-sky-500/10 text-sky-300 border-sky-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Board Header Banner */}
      <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
              <Pin className="w-3 h-3 text-amber-400" />
              <span>Studio Bulletin Board</span>
            </span>
            <span className="text-xs text-gray-400">&bull; Visible to All Departments &amp; Client Reviewers</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${currentRole.badgeColor}`}>
              Viewing as {currentRole.shortTitle}
            </span>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Board of Directors' Notes &amp; Studio Directives</span>
          </h2>

          <p className="text-xs text-gray-300 max-w-3xl leading-relaxed">
            Directives, milestone cut-offs, and creative vision from Director <strong>{project.director}</strong>. 
            All departments (Editorial, VFX, Sound, Color, and Executive Clients) consult this board to align on daily deliverables.
          </p>
        </div>

        {/* Action Button: Director can post new note */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {isDirector ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post New Directive</span>
            </button>
          ) : (
            <div className="bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3.5 py-2 text-xs text-gray-400 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Read &amp; Acknowledge Mode (L{currentRole.level})</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Department Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-mono uppercase text-gray-400 shrink-0 mr-1 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-indigo-400" />
            <span>Target:</span>
          </span>
          {['ALL', 'EDITORIAL', 'VFX', 'SOUND', 'COLOR', 'CLIENT'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border shrink-0 ${
                selectedDept === dept
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#0B0D13] text-gray-400 border-[#1E2333] hover:text-gray-200'
              }`}
            >
              {dept === 'ALL' ? 'All Depts' : dept}
            </button>
          ))}
        </div>

        {/* Priority & Search Input */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#0B0D13] border border-[#1E2333] rounded-xl px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500 shrink-0"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High Priority</option>
            <option value="CREATIVE">Creative Vision</option>
            <option value="MILESTONE">Milestone</option>
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes, scenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {sortedNotes.length === 0 ? (
          <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-gray-600 mx-auto" />
            <h4 className="text-sm font-bold text-gray-300">No Board Notes match your filters</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Clear your department or priority filters, or have the Executive Director publish a new directive.
            </p>
          </div>
        ) : (
          sortedNotes.map((note) => {
            const hasAcknowledged = (note.acknowledgments || []).some(
              a => a.userName === currentRole.defaultUser.name
            );
            const isRepliesExpanded = expandedReplies[note.id];
            const repliesCount = (note.replies || []).length;
            const acksCount = (note.acknowledgments || []).length;

            return (
              <div 
                key={note.id}
                className={`bg-[#0B0D13] rounded-2xl border transition shadow-lg overflow-hidden ${
                  note.pinned 
                    ? 'border-amber-500/50 bg-gradient-to-r from-[#121620] via-[#0E121D] to-[#0B0D13]' 
                    : 'border-[#1E2333] hover:border-[#2C344B]'
                }`}
              >
                {/* Note Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#1E2333]/60">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {note.pinned && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                          <Pin className="w-2.5 h-2.5 fill-amber-400" />
                          <span>PINNED DIRECTIVE</span>
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getPriorityBadge(note.priority)}`}>
                        {note.priority}
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getDeptBadge(note.targetDepartment)}`}>
                        {note.targetDepartment === 'ALL' ? 'All Departments' : `Dept: ${note.targetDepartment}`}
                      </span>

                      {note.sceneTag && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-gray-300 bg-[#141721] border border-[#1E2333]">
                          📍 {note.sceneTag}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white pt-0.5">
                      {note.title}
                    </h3>
                  </div>

                  {/* Actions & Pin Trigger for Director */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {isDirector && (
                      <>
                        <button
                          onClick={() => onTogglePinBoardNote(note.id)}
                          className={`p-1.5 rounded-lg border text-xs transition ${
                            note.pinned 
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                              : 'bg-[#141721] text-gray-400 border-[#1E2333] hover:text-white'
                          }`}
                          title={note.pinned ? "Unpin note" : "Pin note to top"}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteBoardNote(note.id)}
                          className="p-1.5 rounded-lg bg-[#141721] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-[#1E2333] hover:border-red-500/30 transition"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Note Content Body */}
                <div className="p-4 sm:p-5 space-y-3.5 text-xs text-gray-200 leading-relaxed font-sans">
                  <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap">
                    {note.content}
                  </div>

                  {/* Author Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-gray-400 border-t border-[#1E2333]/50">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={note.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"} 
                        alt={note.author} 
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-500/30"
                      />
                      <span className="font-semibold text-gray-200">{note.author}</span>
                      <span className="text-gray-500">&bull; {note.authorRole}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 font-mono text-[10px] text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{note.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Bar: Acknowledgments & Replies Toggle */}
                <div className="bg-[#141721]/90 px-4 sm:px-5 py-3 border-t border-[#1E2333] flex flex-wrap items-center justify-between gap-3">
                  {/* Left: Acknowledge Button & List */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onAcknowledgeBoardNote(note.id, currentRole.defaultUser.name, currentRole.shortTitle)}
                      disabled={hasAcknowledged}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm ${
                        hasAcknowledged
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                      }`}
                    >
                      {hasAcknowledged ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                          <span>Acknowledged by You</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Acknowledge Directive</span>
                        </>
                      )}
                    </button>

                    {acksCount > 0 && (
                      <div className="text-[11px] text-gray-400 flex items-center space-x-1">
                        <span>Acknowledged by</span>
                        <span className="font-bold text-gray-200">{acksCount} crew {acksCount === 1 ? 'member' : 'members'}</span>
                        <span className="text-gray-500 font-mono">
                          ({note.acknowledgments.map(a => a.userName.split(' ')[0]).join(', ')})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Expand/Collapse Discussion Thread */}
                  <button
                    onClick={() => toggleReplies(note.id)}
                    className="flex items-center space-x-1 text-xs text-gray-400 hover:text-indigo-400 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{repliesCount} {repliesCount === 1 ? 'Reply' : 'Replies'}</span>
                    {isRepliesExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Expanded Thread Section */}
                {isRepliesExpanded && (
                  <div className="bg-[#0E121D] p-4 sm:p-5 border-t border-[#1E2333] space-y-3">
                    {repliesCount > 0 && (
                      <div className="space-y-2">
                        {note.replies.map((reply) => (
                          <div key={reply.id} className="p-3 rounded-xl bg-[#141721] border border-[#1E2333] text-xs space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-white">{reply.author}</span>
                                <span className="text-[10px] text-indigo-400 font-mono">({reply.role})</span>
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono">{reply.timestamp}</span>
                            </div>
                            <p className="text-gray-300 leading-relaxed font-sans">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Reply Input */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        placeholder={`Reply as ${currentRole.defaultUser.name} (${currentRole.shortTitle})...`}
                        value={replyInputs[note.id] || ''}
                        onChange={(e) => setReplyInputs({ ...replyInputs, [note.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleReplySubmit(note.id);
                        }}
                        className="flex-1 bg-[#141721] border border-[#1E2333] rounded-xl px-3.5 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleReplySubmit(note.id)}
                        disabled={!replyInputs[note.id]?.trim()}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-xs font-semibold text-white transition flex items-center space-x-1"
                      >
                        <Send className="w-3 h-3" />
                        <span className="hidden sm:inline">Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Post New Directive Modal (Director Only) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141721] border border-[#1E2333] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="bg-[#0B0D13] px-6 py-4 border-b border-[#1E2333] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pin className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Post New Directive to Board of Directors</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Directive Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Act I Picture Lock Hand-Off & Pacing Target"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Target Department</label>
                  <select 
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="EDITORIAL">Editorial</option>
                    <option value="VFX">VFX &amp; CGI</option>
                    <option value="SOUND">Sound Post</option>
                    <option value="COLOR">Color &amp; Grading</option>
                    <option value="CLIENT">Client &amp; Executives</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Priority</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High Priority</option>
                    <option value="CREATIVE">Creative Vision</option>
                    <option value="MILESTONE">Milestone</option>
                    <option value="GENERAL">General Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Scene / Scope Tag</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Act I (Sc 1-2)"
                    value={newSceneTag}
                    onChange={(e) => setNewSceneTag(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Directive Details &amp; Technical Mandate</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Detail the creative target, delivery turnaround time, and specific instructions for the crew..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-sans"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="pinCheck"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="rounded bg-[#0B0D13] border-[#1E2333] text-amber-500 focus:ring-0"
                />
                <label htmlFor="pinCheck" className="text-xs text-gray-300 font-medium cursor-pointer flex items-center space-x-1">
                  <Pin className="w-3 h-3 text-amber-400" />
                  <span>Pin this directive to the top of the board</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E2333] hover:bg-[#2C344B] text-gray-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow-lg shadow-amber-500/20"
                >
                  Publish Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
