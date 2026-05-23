export interface TranscriptSegment {
  id: string;
  text: string;
  startTime: string;
  confidence: number;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  duration: string; // in mm:ss
  wordCount: number;
  language: string;
  segments: TranscriptSegment[];
  summary?: string;
  notes?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface AppSettings {
  darkMode: boolean;
  shortcut: string;
  voiceFeedback: boolean;
  preferredLanguage: string;
  autoSave: boolean;
}
