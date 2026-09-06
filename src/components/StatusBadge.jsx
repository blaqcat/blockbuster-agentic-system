import React from 'react';

export default function StatusBadge({ status, onClick }) {
  const configs = {
    LOCKED: { label: "Locked", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    FINE_CUT: { label: "Fine Cut", bg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
    ROUGH_CUT: { label: "Rough Cut", bg: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    ASSEMBLY: { label: "Assembly", bg: "bg-gray-700/60 text-gray-300 border-gray-600" },
    FINAL_MIX: { label: "Final Mix", bg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
    DESIGN: { label: "Sound Design", bg: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    SPOTTING: { label: "Spotting", bg: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    NOT_STARTED: { label: "Not Started", bg: "bg-gray-800 text-gray-500 border-gray-700" },
    APPROVED: { label: "Approved", bg: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    IN_PROGRESS: { label: "In Progress", bg: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
    PLATES_PULLED: { label: "Plates Pulled", bg: "bg-gray-700 text-gray-300 border-gray-600" },
    IN_GRADE: { label: "In Grade", bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    PENDING_LOCK: { label: "Wait Lock", bg: "bg-gray-800 text-gray-500 border-gray-700" },
    PASSED: { label: "QC Passed", bg: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
    PENDING: { label: "Pending", bg: "bg-gray-800 text-gray-500 border-gray-700" },
  };

  const conf = configs[status] || { label: status, bg: "bg-gray-800 text-gray-400 border-gray-700" };

  return (
    <button 
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase border transition ${conf.bg} hover:opacity-85`}
    >
      {conf.label}
    </button>
  );
}
