import React, { useState, useRef } from 'react';
import { Bot, Zap, BookOpen, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { SCRIPT_PRESETS } from '../mockData';
import { parseDocumentFile } from '../services/documentParser';

export default function AiBreakdownModal({ 
  show, 
  onClose, 
  scriptText, 
  setScriptText, 
  geminiApiKey, 
  setGeminiApiKey, 
  isAnalyzing, 
  onRunBreakdown 
}) {
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  if (!show) return null;

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsParsingDoc(true);
    setUploadedFileName(file.name);
    try {
      const extractedText = await parseDocumentFile(file);
      if (extractedText && extractedText.trim().length > 0) {
        setScriptText(extractedText);
      } else {
        alert("Could not extract readable text from this file. Please ensure it is not password-protected.");
      }
    } catch (err) {
      console.error("File parse error:", err);
      alert("Error parsing document: " + err.message);
    } finally {
      setIsParsingDoc(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#141721] border border-[#1E2333] rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2333]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Screenplay Breakdown &amp; Ingestion</h3>
              <p className="text-[11px] text-gray-400">Upload PDF, DOCX or paste Fountain / Screenplay format</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        <div className="space-y-4 text-xs text-gray-300">
          {/* Drag and Drop Document Zone */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Import Script Document (PDF, Word DOCX, Fountain)
            </label>
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
                dragOver 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : uploadedFileName 
                    ? 'border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500' 
                    : 'border-[#2C344B] bg-[#0B0D13]/60 hover:border-indigo-500/50 hover:bg-[#0B0D13]'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf,.docx,.doc,.txt,.fountain" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              {isParsingDoc ? (
                <div className="flex items-center space-x-2 text-indigo-400 font-medium">
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Extracting text from {uploadedFileName}...</span>
                </div>
              ) : uploadedFileName ? (
                <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Document Loaded: {uploadedFileName} (Ready for breakdown)</span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-indigo-400" />
                  <div>
                    <span className="font-semibold text-white">Click to upload</span> or drag and drop your script file
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Supported formats: .PDF, .DOCX, .DOC, .FOUNTAIN, .TXT
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Or Load Sample Screenplay:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {SCRIPT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setScriptText(preset.text);
                    setUploadedFileName(`Preset: ${preset.name}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#1E2333] hover:bg-[#2C344B] text-indigo-300 hover:text-white text-xs font-medium border border-[#2C344B] transition"
                >
                  ⚡ {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-1">Google Gemini API Key (Optional)</label>
            <input 
              type="password"
              placeholder="Paste GEMINI_API_KEY (leave blank to run local smart simulation)"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-1">Screenplay Script Content Preview</label>
            <textarea 
              rows={7}
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              className="w-full bg-[#0B0D13] border border-[#1E2333] rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />
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
            disabled={isAnalyzing || isParsingDoc}
            onClick={onRunBreakdown}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Zap className="w-3.5 h-3.5 animate-spin" />
                <span>Segmenting &amp; Synthesizing...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Run Gemini Breakdown</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
