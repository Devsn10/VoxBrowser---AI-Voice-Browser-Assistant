/**
 * Low-latency HTML5 web speech voice assistant for immediate user feedback and cues
 */
export class AudioAssistant {
  private static enabled = true;
  private static voice: SpeechSynthesisVoice | null = null;

  public static setEnabled(state: boolean) {
    this.enabled = state;
  }

  public static isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Intelligently select a high-fidelity english voice if possible
   */
  private static getSelectedVoice(): SpeechSynthesisVoice | null {
    if (this.voice) return this.voice;
    if (typeof window === "undefined" || !window.speechSynthesis) return null;

    const voices = window.speechSynthesis.getVoices();
    // Prefer Google US English, Apple Samantha, or any natural English voice
    const preferred = voices.find(
      v =>
        v.name.includes("Google US English") ||
        v.name.includes("Natural") ||
        (v.lang.startsWith("en") && v.name.includes("Apple"))
    ) || voices.find(v => v.lang.startsWith("en"));

    if (preferred) {
      this.voice = preferred;
    }
    return this.voice;
  }

  /**
   * Speaks a small phrase with absolute low-latency
   */
  public static speak(phrase: string, force = false) {
    if (!this.enabled && !force) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Immediately cancel any current speaking to maintain snappy feedback
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 1.15; // Slightly faster for quick responsive UI
    utterance.pitch = 1.0;
    utterance.volume = 0.85;

    const selectedVoice = this.getSelectedVoice();
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Synthesize a sound sequence using Web Audio API for secondary feedback (e.g., start/stop chirps)
   */
  public static playBeep(type: "start" | "stop" | "success" | "click") {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "start") {
        // Double pitch slide up
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "stop") {
        // Pitch slide down
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "success") {
        // High-pitched double chime
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1100, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.setValueAtTime(0.08, now + 0.08);
        gain.gain.linearRampToValueAtTime(0, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        // Subtle click
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (e) {
      // Audio context block by user gesture is ignored safely
    }
  }
}
