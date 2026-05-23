import { useState } from "react";
import { Folder, FolderPlus, Grid, List as ListIcon, HardDrive, Files, Database, ArrowLeft } from "lucide-react";
import { Session } from "../types";
import { AudioAssistant } from "../utils/audioAssistant";

interface LibraryProps {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onBack: () => void;
}

export default function Library({ sessions, onSelectSession, onBack }: LibraryProps) {
  const [activeFolder, setActiveFolder] = useState<string>("All");
  const folders = ["All", "Work Meetings", "Daily Notes", "Idea Brainstorm", "Interviews"];

  const handleCreateFolder = () => {
    AudioAssistant.playBeep("click");
    AudioAssistant.speak("Folder creation mock alert.");
    alert("This represents a directory creation mockup.");
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-xs font-semibold mb-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Files className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Workspace Library
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
            Organize dictations into virtual folder segments for structured workflows.
          </p>
        </div>

        <button
          onClick={handleCreateFolder}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-indigo-600/10 cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          Create Directory
        </button>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar folders list */}
        <aside className="md:col-span-3 flex flex-col gap-2">
          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Directories
          </h4>
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => {
                AudioAssistant.playBeep("click");
                setActiveFolder(folder);
                AudioAssistant.speak(`Viewing directory : ${folder}`);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeFolder === folder
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              }`}
            >
              <Folder className={`w-4.5 h-4.5 ${activeFolder === folder ? "text-white fill-white" : "text-indigo-500"}`} />
              {folder}
            </button>
          ))}
          <div className="mt-4 p-4 bg-indigo-50/25 dark:bg-indigo-950/10 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/10 text-[11px] text-slate-500">
            <span className="font-bold flex items-center gap-1 mb-1 text-slate-700 dark:text-indigo-300">
              <HardDrive className="w-3.5 h-3.5" /> Space Reserved
            </span>
            <span>Usage: 2.1 GB of 15 GB total (14% utilized). Upgrade to Enterprise for unlimited quota.</span>
          </div>
        </aside>

        {/* Folder items list */}
        <main className="md:col-span-9 flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs text-slate-400 px-1">
            <span>
              Showing {sessions.length} files inside <b className="text-slate-600 dark:text-slate-300 font-bold">{activeFolder}</b>
            </span>

            <div className="flex items-center gap-2">
              <button className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-all cursor-pointer">
                <Grid className="w-4.5 h-4.5" />
              </button>
              <button className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-all cursor-pointer">
                <Grid className="w-4.5 h-4.5 rotate-90" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {sessions.length === 0 ? (
              <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950/20">
                <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-sm font-semibold">Folder holds no transcription files</p>
                <p className="text-xs text-slate-400 mt-1">Record a session to view organized files here.</p>
              </div>
            ) : (
              sessions.map(file => (
                <div
                  key={file.id}
                  onClick={() => {
                    AudioAssistant.playBeep("success");
                    onSelectSession(file);
                  }}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl p-4 shadow-sm cursor-pointer hover:bg-slate-50/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl">
                      <Folder className="w-5 h-5 text-cyan-600 dark:text-cyan-400 fill-cyan-500/10" />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{file.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        {file.date} • {file.wordCount} words • {file.duration}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Access File
                  </span>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
