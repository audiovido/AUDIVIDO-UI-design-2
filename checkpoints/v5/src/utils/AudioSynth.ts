/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Aura Studio Ambient Sound & Lo-Fi Synthesizer using Web Audio API
// High-fidelity, pure harmonic music synthesis with ZERO harsh clicks or needle crackle.

class AudioSynthManager {
  private ctx: AudioContext | null = null;
  private primaryGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private timeArray: Uint8Array | null = null;
  private oscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private activeType: 'music' | 'movie' | 'fireplace' | 'aura-lofi' | null = null;
  private isInitialized = false;
  private beatTimer: any = null;

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
      this.primaryGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeArray = new Uint8Array(this.analyser.fftSize);

      this.primaryGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio initialization failed:", e);
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

  public connectMediaElement(element: HTMLAudioElement) {
    this.init();
    if (!this.ctx || !this.primaryGain) return;
    try {
      if ((element as any)._audioSynthConnected) return;
      const source = this.ctx.createMediaElementSource(element);
      source.connect(this.primaryGain);
      (element as any)._audioSynthConnected = true;
    } catch (e) {
      // Audio element might already be connected or restricted by CORS
    }
  }

  public setVolume(volumeFraction: number) {
    this.init();
    if (!this.ctx || !this.primaryGain) return;
    const vol = Math.max(0, Math.min(1, volumeFraction));
    this.primaryGain.gain.setTargetAtTime(vol * 0.45, this.ctx.currentTime, 0.08);
  }

  public playTrack(type: 'music' | 'movie' | 'fireplace' | 'aura-lofi') {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stopAll();
    this.activeType = type;

    if (type === 'music') {
      this.playMusicSpace();
    } else if (type === 'movie') {
      this.playMovieSpace();
    } else if (type === 'fireplace') {
      this.playWarmHearthPad();
    } else if (type === 'aura-lofi') {
      this.playAuraLofiBeat();
    }
  }

  public stopAll() {
    this.activeType = null;

    if (this.beatTimer) {
      clearInterval(this.beatTimer);
      this.beatTimer = null;
    }

    this.oscs.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(0);
        gain.gain.setValueAtTime(0, 0);
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.oscs = [];
  }

  public getActiveType() {
    return this.activeType;
  }

  // Pure Celestial Ambient Chord Pad (silky, warm, peaceful)
  private playMusicSpace() {
    if (!this.ctx || !this.primaryGain) return;

    const chords = [
      [155.56, 196.00, 233.08, 293.66, 349.23], // Eb Maj9
      [130.81, 155.56, 196.00, 233.08, 311.13], // C Min9
      [174.61, 207.65, 261.63, 311.13, 392.00], // F Min9
      [116.54, 146.83, 174.61, 220.00, 261.63]  // Bb 13
    ];

    const selectedChord = chords[Math.floor(Math.random() * chords.length)];
    const time = this.ctx.currentTime;

    selectedChord.forEach((freq, idx) => {
      if (!this.ctx || !this.primaryGain) return;

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      // Subtle slow chorus
      if (idx > 0) {
        osc.frequency.setValueAtTime(freq + (Math.sin(idx) * 0.8), time);
      }

      const peakVolume = 0.05 / selectedChord.length;
      oscGain.gain.setValueAtTime(0, time);
      oscGain.gain.linearRampToValueAtTime(peakVolume, time + 2.5 + idx * 0.3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, time);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.primaryGain);

      osc.start(time);
      this.oscs.push({ osc, gain: oscGain });
    });
  }

  // Deep Cinematic Cosmic Drone
  private playMovieSpace() {
    if (!this.ctx || !this.primaryGain) return;

    const droneFrequencies = [55.0, 110.0, 164.81, 220.0];
    const time = this.ctx.currentTime;

    droneFrequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.primaryGain) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320 + idx * 40, time);

      const maxGain = 0.035 / droneFrequencies.length;
      oscGain.gain.setValueAtTime(0, time);
      oscGain.gain.linearRampToValueAtTime(maxGain, time + 3.0);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.primaryGain);

      osc.start(time);
      this.oscs.push({ osc, gain: oscGain });
    });
  }

  // Serene Warm Hearth Drone (NO harsh needle crackle or static clicks!)
  private playWarmHearthPad() {
    if (!this.ctx || !this.primaryGain) return;

    const time = this.ctx.currentTime;
    const hearthFrequencies = [82.41, 123.47, 164.81]; // E2 chord warm glow

    hearthFrequencies.forEach((freq) => {
      if (!this.ctx || !this.primaryGain) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, time);

      oscGain.gain.setValueAtTime(0, time);
      oscGain.gain.linearRampToValueAtTime(0.04, time + 2.0);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.primaryGain);

      osc.start(time);
      this.oscs.push({ osc, gain: oscGain });
    });
  }

  // Masterpiece Studio-Quality Lo-Fi Beat Synthesizer
  // Recreates smooth, relaxing lo-fi music with Rhodes keys, warm bass, mellow beat & chimes
  private playAuraLofiBeat() {
    if (!this.ctx || !this.primaryGain) return;

    let step = 0;
    const tempoBpm = 76;
    const stepDurationSec = 60 / tempoBpm / 2; // Eighth note interval (~0.395s)

    // Progression: Eb Maj9 -> C Min9 -> F Min9 -> Bb 13
    const progression = [
      {
        chord: [155.56, 196.00, 233.08, 293.66, 349.23], // Eb, G, Bb, D, F
        bass: 77.78 // Eb2
      },
      {
        chord: [130.81, 155.56, 196.00, 233.08, 293.66], // C, Eb, G, Bb, D
        bass: 65.41 // C2
      },
      {
        chord: [174.61, 207.65, 261.63, 311.13, 349.23], // F, Ab, C, Eb, F
        bass: 87.31 // F2
      },
      {
        chord: [116.54, 146.83, 174.61, 207.65, 261.63], // Bb, D, F, Ab, C
        bass: 58.27 // Bb1
      }
    ];

    const playStep = () => {
      if (!this.ctx || !this.primaryGain || this.activeType !== 'aura-lofi') {
        if (this.beatTimer) clearInterval(this.beatTimer);
        return;
      }

      const time = this.ctx.currentTime;
      const currentBarStep = step % 32; // 4 bars * 8 steps = 32
      const barIdx = Math.floor(currentBarStep / 8);
      const stepInBar = currentBarStep % 8;
      const currentBarData = progression[barIdx];

      // 1. Velvet Rhodes Electric Piano on beat 1 (step 0) and syncopated beat 3.5 (step 5)
      if (stepInBar === 0) {
        this.triggerRhodesChord(currentBarData.chord, time, 2.8);
        this.triggerWarmSubBass(currentBarData.bass, time, 1.8);
      } else if (stepInBar === 4) {
        this.triggerRhodesChord(currentBarData.chord, time, 1.4, 0.7);
        this.triggerWarmSubBass(currentBarData.bass, time, 1.2);
      }

      // 2. Chillhop Mellow Beats (Acoustic low-pass filtered kick & soft brushed snare)
      if (stepInBar === 0 || stepInBar === 4 || stepInBar === 6) {
        this.triggerMellowKick(time);
      }
      if (stepInBar === 2 || stepInBar === 6) {
        this.triggerSoftSnare(time);
      }
      // Gentle closed hi-hat pulse on every 8th note
      this.triggerVelvetHiHat(time);

      // 3. Twinkling Dream Chime Bell melody
      if ((stepInBar === 3 || stepInBar === 7) && Math.random() < 0.6) {
        const celestialNotes = [587.33, 659.25, 783.99, 880.00, 1046.50]; // D5, E5, G5, A5, C6
        const bellFreq = celestialNotes[Math.floor(Math.random() * celestialNotes.length)];
        this.triggerCelestialChime(bellFreq, time);
      }

      step++;
    };

    playStep();
    this.beatTimer = setInterval(playStep, stepDurationSec * 1000);
  }

  // --- HARMONIC LO-FI INSTRUMENTS (Zero Harsh Clicks) ---

  private triggerRhodesChord(freqs: number[], time: number, duration: number, volFactor: number = 1.0) {
    if (!this.ctx || !this.primaryGain) return;

    freqs.forEach((freq) => {
      if (!this.ctx || !this.primaryGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Triangle for warm vintage electric piano tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      // Warm low-pass filter to give that velvety lofi character
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(620, time);

      const maxGain = (0.045 / freqs.length) * volFactor;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(maxGain, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(maxGain * 0.4, time + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.primaryGain);

      osc.start(time);
      osc.stop(time + duration + 0.1);
      this.oscs.push({ osc, gain });
    });
  }

  private triggerWarmSubBass(freq: number, time: number, duration: number) {
    if (!this.ctx || !this.primaryGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.primaryGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
    this.oscs.push({ osc, gain });
  }

  private triggerMellowKick(time: number) {
    if (!this.ctx || !this.primaryGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Smooth 120Hz -> 42Hz frequency glide for punchy yet warm kick
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.14);

    gain.gain.setValueAtTime(0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.primaryGain);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  private triggerSoftSnare(time: number) {
    if (!this.ctx || !this.primaryGain) return;

    // Soft low-passed acoustic snap (NO harsh white noise or static)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(175, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.1);

    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gain);
    gain.connect(this.primaryGain);

    osc.start(time);
    osc.stop(time + 0.13);
  }

  private triggerVelvetHiHat(time: number) {
    if (!this.ctx || !this.primaryGain) return;

    // Extremely soft filtered tick
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(4200, time);

    gain.gain.setValueAtTime(0.012, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    osc.connect(gain);
    gain.connect(this.primaryGain);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  private triggerCelestialChime(freq: number, time: number) {
    if (!this.ctx || !this.primaryGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.035, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

    // Warm stereo delay
    const delay = this.ctx.createDelay();
    delay.delayTime.setValueAtTime(0.3, time);

    const feedback = this.ctx.createGain();
    feedback.gain.setValueAtTime(0.35, time);

    osc.connect(gain);
    gain.connect(this.primaryGain);

    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.primaryGain);

    osc.start(time);
    osc.stop(time + 1.3);
    this.oscs.push({ osc, gain });
  }
}

export const AudioSynth = new AudioSynthManager();
