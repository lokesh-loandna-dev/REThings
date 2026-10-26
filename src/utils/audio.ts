/**
 * Web Audio API synthesizer for realistic phone ringtone and alarm sounds.
 * 100% offline, requires no external audio assets.
 */

class RingtoneManager {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;

  public startRingtone() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    } catch {
      return;
    }

    // Standard phone ring pattern: 2 pulses (440Hz + 480Hz US dual-tone) followed by silence
    const playRingCycle = () => {
      if (!this.isPlaying || !this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // First beep (0.4s)
      this.createDualTone(440, 480, now, 0.4);
      // Short pause (0.2s), second beep (0.4s)
      this.createDualTone(440, 480, now + 0.6, 0.4);

      // Trigger device vibration if available
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([400, 200, 400, 2000]);
      }
    };

    playRingCycle();
    this.intervalId = window.setInterval(playRingCycle, 3000);
  }

  private createDualTone(freq1: number, freq2: number, startTime: number, duration: number) {
    if (!this.audioCtx) return;

    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc1.frequency.setValueAtTime(freq1, startTime);
    osc2.frequency.setValueAtTime(freq2, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
    gainNode.gain.setValueAtTime(0.2, startTime + duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  public stopRingtone() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(0);
    }
  }
}

export const ringtone = new RingtoneManager();
