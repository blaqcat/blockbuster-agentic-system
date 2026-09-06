import React from 'react';
import { Download } from 'lucide-react';

export default function ExportModal({ show, onClose, onExport }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#141721] border border-[#1E2333] rounded-2xl max-w-lg w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2333]">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <span>Export Post-Production Manifest</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        <div className="space-y-3 text-xs text-gray-300">
          <p>Export all scene markers, beat notes, and department statuses into your editing suite:</p>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 bg-[#0B0D13] rounded-xl border border-[#1E2333] cursor-pointer hover:border-indigo-500">
              <input type="radio" name="format" defaultChecked className="text-indigo-600" />
              <div>
                <div className="font-semibold text-white">OpenTimelineIO (.otio)</div>
                <div className="text-[11px] text-gray-400">Universal NLE interchange for DaVinci Resolve, Premiere Pro & Avid.</div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-[#0B0D13] rounded-xl border border-[#1E2333] cursor-pointer hover:border-indigo-500">
              <input type="radio" name="format" className="text-indigo-600" />
              <div>
                <div className="font-semibold text-white">Final Cut Pro XML (.fcpxml)</div>
                <div className="text-[11px] text-gray-400">Color & Sound cue sheet interchange.</div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1E2333]">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1E2333] hover:bg-[#2C344B] text-xs font-medium text-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={onExport}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30"
          >
            Export Package
          </button>
        </div>
      </div>
    </div>
  );
}
