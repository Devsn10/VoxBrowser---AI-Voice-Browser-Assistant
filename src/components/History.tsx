import { useState } from "react";
import { Search, Calendar, FileText, Trash2, Copy, Sparkles, FolderOpen, ArrowLeft } from "lucide-react";
import { Session } from "../types";
import { AudioAssistant } from "../utils/audioAssistant";

interface HistoryViewProps {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onDeleteSession: (id: string) => void;
  onBack: () => void;
}

export default function HistoryView({ sessions, onSelectSession, onDeleteSession, onBack }: HistoryViewProps) {
  const [search, setSearch] = useState("");

  const filtered = sessions.filter(
    s =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.segments.some(seg => seg.text.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCopyText = (session: Session) => {
    const fullText = session.segments.map(s => s.text).join(" ");
    navigator.clipboard.writeText(fullText);
    AudioAssistant.playBeep("success");
    AudioAssistant.speak("Session transcription copied to clipboard.");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-4">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-xs font-semibold mb-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Transcription History
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
            Locate, search, and replay previous voice dictation transcripts.
          </p>
        </div>

        {/* Search input field */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search transcript text..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-600 text-xs text-slate-800 dark:text-slate-200 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* History Checklist List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950/20">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-sm font-semibold">No recorded dictations found</p>
            <p className="text-xs text-slate-400 mt-1">
              {search ? "Try searching another keyword" : "Start dictating in the Dashboard tab."}
            </p>
          </div>
        ) : (
          filtered.map(session => (
            <div
              key={session.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-900 rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between hover:-translate-y-[1px]"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer" onClick={() => onSelectSession(session)}>
                    {session.title}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {session.date}
                  </span>
                </div>

                {/* Subtitle properties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold">
                    {session.wordCount} words
                  </span>
                  <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold">
                    {session.duration} minutes
                  </span>
                  <span className="bg-indigo-50 dark:bg-indigo-950/35 px-2 py-0.5 rounded text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                    {session.language}
                  </span>
                </div>

                {/* Snippet preview */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {session.segments.map(s => s.text).join(" ") || "No audio content recorded for this session."}
                </p>

                {/* summary output if present */}
                {session.summary && (
                  <div className="mb-4 p-2.5 bg-indigo-50/50 dark:bg-indigo-950/15 rounded-lg border border-indigo-100/40 dark:border-indigo-800/10 text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 py-0.5">
                      <Sparkles className="w-3.5 h-3.5" /> AI Summary Preview
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed italic">
                      {session.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions segment wrapper */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectSession(session)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  View Details
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopyText(session)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-all cursor-pointer"
                    title="Copy full text"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      AudioAssistant.playBeep("stop");
                      AudioAssistant.speak(`Deleting session ${session.title}`);
                      onDeleteSession(session.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-all cursor-pointer"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
