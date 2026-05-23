import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, History, Moon, Keyboard, Volume2, ShieldCheck, RefreshCw } from "lucide-react";
import { AppSettings } from "../types";
import { AudioAssistant } from "../utils/audioAssistant";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onViewHistory: () => void;
}

export default function SettingsDrawer({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onViewHistory,
}: SettingsDrawerProps) {
  const toggleDark = () => {
    const updated = { ...settings, darkMode: !settings.darkMode };
    onSettingsChange(updated);
    AudioAssistant.playBeep("click");
    if (updated.darkMode) {
      document.documentElement.classList.add("dark");
      AudioAssistant.speak("Dark interface enabled");
    } else {
      document.documentElement.classList.remove("dark");
      AudioAssistant.speak("Light interface enabled");
    }
  };

  const setVoiceFeedback = (val: boolean) => {
    const updated = { ...settings, voiceFeedback: val };
    onSettingsChange(updated);
    AudioAssistant.setEnabled(val);
    AudioAssistant.playBeep("click");
    if (val) {
      AudioAssistant.speak("Voice guidance enabled");
    }
  };

  const setLanguage = (val: string) => {
    const updated = { ...settings, preferredLanguage: val };
    onSettingsChange(updated);
    AudioAssistant.playBeep("click");
    AudioAssistant.speak(`Language changed to ${val === "en-US" ? "American English" : val === "es-ES" ? "Spanish" : "British English"}`);
  };

  const handleShortcutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, shortcut: e.target.value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            id="settings-overlay"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-96 bg-slate-50 dark:bg-slate-900 shadow-2xl p-8 flex flex-col gap-8 z-[70] border-l border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold tracking-tight">Application Settings</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                id="close-settings-btn"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Scrolling Controls */}
            <div className="flex flex-col gap-6 overflow-y-auto flex-1 pr-1">
              {/* Session History Shortcut */}
              <button
                onClick={() => {
                  onClose();
                  onViewHistory();
                }}
                className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:border-indigo-500 border border-slate-200 dark:border-slate-700 transition-all group"
                id="view-history-shortcut-btn"
              >
                <div className="flex items-center gap-4">
                  <span className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                    <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Session History</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">View past transcriptions</p>
                  </div>
                </div>
                <X className="-rotate-90 w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Theme Settings Toggle */}
              <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <span className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                    <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  <span className="font-semibold text-sm">Dark Interface</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={toggleDark}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Voice Feedback Configuration */}
              <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <span className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                    <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  <span className="font-semibold text-sm">Voice Acknowledgments</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.voiceFeedback}
                    onChange={(e) => setVoiceFeedback(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Hotkey Input */}
              <div className="flex flex-col gap-3 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-1">
                  <span className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl animate-pulse">
                    <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  <span className="font-semibold text-sm">Dictation Shortcut</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.shortcut}
                    onChange={handleShortcutChange}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Language Preferences */}
              <div className="flex flex-col gap-3 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Preferred Language</label>
                <select
                  value={settings.preferredLanguage}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="en-GB">English (United Kingdom)</option>
                  <option value="es-ES">Español (España)</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 font-bold" />
                v2.4.0 • Enterprise
              </span>
              <button
                onClick={() => {
                  AudioAssistant.playBeep("click");
                  AudioAssistant.speak("System updated and active");
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Check Updates
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
