import { useState, useEffect } from "react";
import { Mic, FolderOpen, History as HistoryIcon, LayoutDashboard, Settings, User, LogOut, CheckCircle } from "lucide-react";
import { Session, AppSettings, UserProfile } from "./types";
import { AudioAssistant } from "./utils/audioAssistant";
import Dashboard from "./components/Dashboard";
import HistoryView from "./components/History";
import Library from "./components/Library";
import SettingsDrawer from "./components/SettingsDrawer";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

const SAMPLE_SESSIONS: Session[] = [
  {
    id: "1",
    title: "Project Alpha Brainstorming",
    date: "May 22, 2026",
    duration: "04:32",
    wordCount: 142,
    language: "English (US)",
    segments: [
      { id: "101", text: "Welcome to Project Alpha initiation logs.", startTime: "00:01", confidence: 98 },
      { id: "102", text: "We need to optimize our backend servers for very low latency delivery of WebSocket data packets.", startTime: "00:25", confidence: 95 },
      { id: "103", text: "By using Node.js or lightweight microservices, we ensure milliseconds response rates during simultaneous client requests.", startTime: "01:10", confidence: 97 },
      { id: "104", text: "Let's plan a testing phase by early June using virtual loading scripts.", startTime: "03:45", confidence: 94 }
    ],
    summary: "The logs outline low-latency backend optimisations for Project Alpha using secure WebSocket connections and plan June workloads."
  },
  {
    id: "2",
    title: "Client Interview - UX Feedback",
    date: "May 20, 2026",
    duration: "06:15",
    wordCount: 220,
    language: "English (US)",
    segments: [
      { id: "201", text: "The client noted that they love the clean slate design of VoxBrowser.", startTime: "00:10", confidence: 99 },
      { id: "202", text: "However, they need some optional local auditive trigger beeps to confirm their recordings are working without staring at screen indicators.", startTime: "01:25", confidence: 96 }
    ],
    summary: "UX client review indicates high praise for the Sonic Slate theme, suggesting quick audio feed confirmations when microphones click active."
  }
];

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<"signin" | "signup">("signin");
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "Demo",
    lastName: "User",
    username: "demouser",
    email: "user@voxbrowser.ai"
  });

  // App settings state
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: true,
    shortcut: "Ctrl + Alt + V",
    voiceFeedback: true,
    preferredLanguage: "en-US",
    autoSave: true
  });

  // Transcription lists
  const [sessions, setSessions] = useState<Session[]>(SAMPLE_SESSIONS);
  const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "library">("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync settings with body dark class
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const handleSignInSuccess = (email: string) => {
    setProfile({
      firstName: email.split("@")[0] || "User",
      lastName: "Account",
      username: email.split("@")[0] || "user",
      email: email
    });
    setIsAuthenticated(true);
  };

  const handleSignUpSuccess = (regProfile: { firstName: string; lastName: string; username: string }) => {
    setProfile({
      firstName: regProfile.firstName,
      lastName: regProfile.lastName,
      username: regProfile.username,
      email: `${regProfile.username}@voxbrowser.ai`
    });
    setIsAuthenticated(true);
  };

  const handleLogOut = () => {
    AudioAssistant.playBeep("stop");
    AudioAssistant.speak("Logging out. Session closed.");
    setIsAuthenticated(false);
    setCurrentPage("signin");
  };

  const handleAddSession = (newSession: Session) => {
    setSessions(prev => [newSession, ...prev]);

    // Save to server-side backend if possible
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSession)
    }).catch(err => console.log("Local backup state maintained."));
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));

    // Delete from backend API
    fetch(`/api/history?id=${id}`, {
      method: "DELETE"
    }).catch(err => console.log("Local backup update updated."));
  };

  // Handle active file detail click overlays
  const handleSelectSession = (session: Session) => {
    AudioAssistant.playBeep("success");
    AudioAssistant.speak(`Displaying transcription review for ${session.title}.`);
    alert(`Review File detail:\n\nTitle: ${session.title}\nWord count: ${session.wordCount}\nContent:\n${session.segments.map(s => s.text).join(" ")}`);
  };

  // Fetch initial backend logs on login
  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/history")
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("HTTP error backend");
        })
        .then(data => {
          if (data && data.length > 0) {
            setSessions(data);
          }
        })
        .catch(err => {
          console.log("Offline backup loading active.");
        });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return currentPage === "signin" ? (
      <SignIn
        onSuccess={handleSignInSuccess}
        onNavigateToSignUp={() => setCurrentPage("signup")}
      />
    ) : (
      <SignUp
        onSuccess={handleSignUpSuccess}
        onNavigateToSignIn={() => setCurrentPage("signin")}
      />
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen flex flex-col antialiased font-sans">
      {/* Dynamic Top Navigation Bar matching mockup Image 1 */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 sticky top-0 w-full z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 md:px-12 h-16 max-w-7xl mx-auto w-full">
          {/* Brand header */}
          <div className="flex items-center gap-2">
            <Mic className="w-7 h-7 text-indigo-600 fill-indigo-600 animate-pulse" />
            <h1 className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              VoxBrowser
            </h1>

            {/* TAB Navigation switches */}
            <nav className="hidden md:flex ml-8 items-center gap-6">
              <button
                onClick={() => {
                  AudioAssistant.playBeep("click");
                  setActiveTab("dashboard");
                }}
                className={`flex items-center gap-1 text-xs font-bold transition-all relative py-1 cursor-pointer ${
                  activeTab === "dashboard"
                    ? "text-indigo-600 dark:text-indigo-400 font-extrabold border-b-2 border-indigo-600"
                    : "text-slate-400 hover:text-indigo-600"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  AudioAssistant.playBeep("click");
                  setActiveTab("history");
                }}
                className={`flex items-center gap-1 text-xs font-bold transition-all relative py-1 cursor-pointer ${
                  activeTab === "history"
                    ? "text-indigo-600 dark:text-indigo-400 font-extrabold border-b-2 border-indigo-600"
                    : "text-slate-400 hover:text-indigo-600"
                }`}
              >
                <HistoryIcon className="w-3.5 h-3.5" />
                History
              </button>
              <button
                onClick={() => {
                  AudioAssistant.playBeep("click");
                  setActiveTab("library");
                }}
                className={`flex items-center gap-1 text-xs font-bold transition-all relative py-1 cursor-pointer ${
                  activeTab === "library"
                    ? "text-indigo-600 dark:text-indigo-400 font-extrabold border-b-2 border-indigo-600"
                    : "text-slate-400 hover:text-indigo-600"
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Library
              </button>
            </nav>
          </div>

          {/* Settings / Pro Plan badge / Logout trigger */}
          <div className="flex items-center gap-3 select-none">
            {/* Pro Plan badge */}
            <div className="hidden sm:flex items-center bg-indigo-50 dark:bg-indigo-950/40 rounded-full px-3.5 py-1 border border-indigo-200/40 dark:border-indigo-900/10">
              <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-extrabold uppercase">
                Pro Plan
              </span>
            </div>

            {/* Settings button wheel */}
            <button
              onClick={() => {
                AudioAssistant.playBeep("click");
                setIsSettingsOpen(true);
              }}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 transition p-2 rounded-full active:scale-95 duration-100 cursor-pointer"
              title="Application configuration"
            >
              <Settings className="w-4.5 h-4.5 text-slate-500" />
            </button>

            {/* Profile Avatar overlay drop panel */}
            <div className="flex items-center gap-1 group relative">
              <button className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-full duration-100 cursor-pointer">
                <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-600" />
                </span>
                <span className="hidden lg:inline text-xs font-bold text-slate-500 dark:text-slate-400">
                  {profile.firstName}
                </span>
              </button>

              {/* hover popup actions bar */}
              <div className="absolute right-0 top-11 bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition duration-150 flex flex-col gap-1 w-36">
                <p className="text-[10px] text-slate-400 font-bold px-2 py-1 select-none border-b border-slate-100 dark:border-slate-800">
                  {profile.username}@vox
                </p>
                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 py-2 px-2.5 rounded text-xs font-bold text-left w-full cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container screen rendering tab switches */}
      <main className="pt-20 pb-12 px-6 md:px-12 flex-1 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {activeTab === "dashboard" && (
          <Dashboard
            settings={settings}
            profile={profile}
            sessions={sessions}
            onAddSession={handleAddSession}
          />
        )}

        {activeTab === "history" && (
          <HistoryView
            sessions={sessions}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onBack={() => setActiveTab("dashboard")}
          />
        )}

        {activeTab === "library" && (
          <Library
            sessions={sessions}
            onSelectSession={handleSelectSession}
            onBack={() => setActiveTab("dashboard")}
          />
        )}
      </main>

      {/* Settings Overlay Drawer Panel */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        onViewHistory={() => setActiveTab("history")}
      />
    </div>
  );
}
