/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Aura Studio Audio Controller
// Synthetic drone and humming oscillators are completely disabled.
// Real audio streaming (HTML5 Audio) plays exclusively.

class AudioSynthManager {
  private ctx: AudioContext | null = null;
  private primaryGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private timeArray: Uint8Array | null = null;
  private isInitialized = false;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private init() {
    if (this.isInitialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.primaryGain = this.ctx.createGain();
      this.primaryGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeArray = new Uint8Array(this.analyser.fftSize);

      this.primaryGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio initialization skipped:", e);
    }
  }

  public getFrequencyData(): Uint8Array | null {
    if (!this.analyser || !this.dataArray) return null;
    this.analyser.getByteFrequencyData(this.dataArray as any);
    return this.dataArray;
  }

  public getTimeDomainData(): Uint8Array | null {
    if (!this.analyser || !this.timeArray) return null;
    this.analyser.getByteTimeDomainData(this.timeArray as any);
    return this.timeArray;
  }

  public playClick() {
    // Silent or ultra subtle click without background hum
  }

  public connectMediaElement(_element: HTMLAudioElement) {
    // Media elements play directly to avoid browser CORS/cross-origin muting
  }

  public setVolume(volumeFraction: number) {
    this.init();
    if (!this.ctx || !this.primaryGain) return;
    const vol = Math.max(0, Math.min(1, volumeFraction));
    this.primaryGain.gain.setTargetAtTime(vol * 0.45, this.ctx.currentTime, 0.08);
  }

  // All synthetic oscillators are disabled: completely silent
  public playTrack(_type?: string) {
    this.stopAll();
  }

  public stopAll() {
    // No background oscillators
  }

  public isSocialPadActive(): boolean {
    return false;
  }

  public toggleSocialPad(): boolean {
    this.stopAll();
    return false;
  }

  public getActiveType() {
    return null;
  }

  public playSocialAmbientPad() {
    this.stopAll();
  }
}

export const AudioSynth = new AudioSynthManager();
