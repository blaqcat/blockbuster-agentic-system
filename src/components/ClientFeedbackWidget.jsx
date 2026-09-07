import React, { useState } from 'react';
import { 
  Star, MessageSquare, CheckCircle2, AlertCircle, Send, User, 
  ThumbsUp, Clock, ShieldAlert, Sparkles, Filter
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';

export default function ClientFeedbackWidget({ 
  selectedScene, 
  clientReviews, 
  onAddReview, 
  currentRoleKey 
}) {
  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;
  const isReviewer = currentRoleKey === 'CLIENT_REVIEWER';
  const canAddReview = currentRole.permissions.canAddClientReview;

  const [rating, setRating] = useState(5);
  const [reviewStatus, setReviewStatus] = useState('APPROVED');
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState(currentRole.defaultUser.name);

  const sceneReviews = (clientReviews && selectedScene) ? (clientReviews[selectedScene.id] || []) : [];

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedScene) return;

    const newReview = {
      id: "rev_" + Date.now(),
      author: authorName || currentRole.defaultUser.name,
      role: currentRole.title,
      rating: Number(rating),
      status: reviewStatus,
      comment: commentText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " (Just now)"
    };

    onAddReview(selectedScene.id, newReview);
    setCommentText('');
  };

  if (!selectedScene) {
    return (
      <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-6 text-center text-gray-400 text-xs">
        Select a scene to view or submit screening feedback.
      </div>
    );
  }

  return (
    <div className="bg-[#141721] border border-[#1E2333] rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1E2333]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">
                Screening Room &amp; Client Feedback
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold">
                Scene {selectedScene.sceneNumber}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono truncate max-w-md">
              {selectedScene.slugline}
            </p>
          </div>
        </div>

        {isReviewer && (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Active Level 4: Client Reviewer Portal</span>
          </div>
        )}
      </div>

      {/* Existing Reviews List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-gray-300">
          <span>Screening Feedback &amp; Stakeholder Notes ({sceneReviews.length})</span>
          {sceneReviews.length > 0 && (
            <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Audited</span>
            </span>
          )}
        </div>

        {sceneReviews.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#0B0D13] border border-[#1E2333] text-center text-xs text-gray-400">
            No client feedback recorded for Scene {selectedScene.sceneNumber} yet.
            {isReviewer ? " Submit your screening notes below!" : ""}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {sceneReviews.map((rev) => (
              <div 
                key={rev.id}
                className="p-3.5 bg-[#0B0D13] border border-[#1E2333] rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-white">{rev.author}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#161B29] text-gray-400 border border-[#222B40]">
                      {rev.role}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Star Rating Display */}
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-700'}`} 
                        />
                      ))}
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                      rev.status === 'APPROVED' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : rev.status === 'REVISION_REQUESTED'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {rev.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed font-sans">
                  "{rev.comment}"
                </p>

                <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between pt-1 border-t border-[#161B29]">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{rev.timestamp}</span>
                  </span>
                  <span className="text-indigo-400 font-medium">Logged to Post-Production Audit Log</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Review Form */}
      {canAddReview ? (
        <form onSubmit={handleSubmitReview} className="space-y-3 pt-3 border-t border-[#1E2333]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Submit Screening Room Feedback</span>
            </label>

            {/* Interactive Star Rating Selector */}
            <div className="flex items-center space-x-1 bg-[#0B0D13] px-2.5 py-1 rounded-lg border border-[#1E2333]">
              <span className="text-[10px] text-gray-400 mr-1.5 font-medium">Score:</span>
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  type="button"
                  key={starVal}
                  onClick={() => setRating(starVal)}
                  className="p-0.5 hover:scale-110 transition"
                >
                  <Star 
                    className={`w-4 h-4 ${starVal <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Executive Review Status
              </label>
              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 font-sans"
              >
                <option value="APPROVED">Approved for Screening</option>
                <option value="REVISION_REQUESTED">Revision Requested</option>
                <option value="SOUND_REVIEW">Audio &amp; Mix Check Required</option>
                <option value="PACING_POLISH">Pacing &amp; Editorial Trim Pass</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Reviewer Persona
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Reviewer Name..."
                className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
          </div>

          <div>
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Enter executive notes for Scene ${selectedScene.sceneNumber} (e.g. 'Strong tension, make sure Foley sound effects are punchier in the second half')...`}
              className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-sans resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-mono">
              Feedback is instantly visible to Director, Editors &amp; Craft Leads.
            </span>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-lg shadow-sky-600/25"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Client Review</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-3 bg-[#0B0D13] rounded-xl border border-[#1E2333] text-xs text-gray-400 flex items-center justify-between">
          <span>Switch to <strong>Level 4 (Client Reviewer)</strong> or <strong>Level 1 (Director)</strong> to submit screening feedback.</span>
        </div>
      )}
    </div>
  );
}
