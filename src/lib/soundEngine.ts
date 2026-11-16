/**
 * Cozy Home Procedural Soundscape Engine
 *
 * Uses the Web Audio API to generate soft, organic ambient soundscapes:
 * - Daytime: gentle warm breeze + distant cheerful garden birdsong + subtle wind chimes
 * - Nighttime: quiet starry night breeze + rhythmic summer crickets + soft warm room hum
 *
 * Benefits:
 * - 0 KB audio assets to download (100% offline & instantaneous)
 * - Infinitely non-repetitive
 * - Smooth seamless crossfades when toggling day/night
 * - Clean fade-in / fade-out respecting browser autoplay rules
 */

type ThemeMode = 'day' | 'night' | 'dawn' | 'dusk';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private dayGain: GainNode | null = null;
  private nightGain: GainNode | null = null;
  private isRunning: boolean = false;
  private birdTimer: NodeJS.Timeout | null = null;
  private cricketTimer: NodeJS.Timeout | null = null;
  private chimeTimer: NodeJS.Timeout | null = null;
  private currentTheme: ThemeMode = 'day';

  /**
   * Initializes the AudioContext upon user interaction
   */
  public async init(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (!this.masterGain && this.ctx) {
      this.setupAudioGraph();
    }

    return true;
  }

  /**
   * Builds the audio processing graph
   */
  private setupAudioGraph(): void {
    if (!this.ctx) return;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Day Bus
    this.dayGain = this.ctx.createGain();
    this.dayGain.gain.setValueAtTime(this.isDayTime(this.currentTheme) ? 1 : 0, this.ctx.currentTime);
    this.dayGain.connect(this.masterGain);

    // Night Bus
    this.nightGain = this.ctx.createGain();
    this.nightGain.gain.setValueAtTime(this.isDayTime(this.currentTheme) ? 0 : 1, this.ctx.currentTime);
    this.nightGain.connect(this.masterGain);

    // Setup ambient breeze generators
    this.setupDayBreeze();
    this.setupNightBreeze();
  }

  private isDayTime(theme: ThemeMode): boolean {
    return theme === 'day' || theme === 'dawn';
  }

  /**
   * Day Breeze: Warm, airy pink noise with subtle oscillating wind swell
   */
  private setupDayBreeze(): void {
    if (!this.ctx || !this.dayGain) return;

    const noiseBuffer = this.createPinkNoiseBuffer(3);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Bandpass filter for soft airy wind rustling curtains
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(550, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // Low-frequency oscillator to create natural wind swell (0.12 Hz)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const breezeGain = this.ctx.createGain();
    breezeGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(breezeGain);
    breezeGain.connect(this.dayGain);

    noiseSource.start();
    lfo.start();
  }

  /**
   * Night Breeze: Darker, deeper whisper of cool evening air
   */
  private setupNightBreeze(): void {
    if (!this.ctx || !this.nightGain) return;

    const noiseBuffer = this.createPinkNoiseBuffer(4);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Lowpass filter for deep night air
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.0, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const breezeGain = this.ctx.createGain();
    breezeGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(breezeGain);
    breezeGain.connect(this.nightGain);

    noiseSource.start();
    lfo.start();
  }

  /**
   * Creates pink noise for organic breeze sounds
   */
  private createPinkNoiseBuffer(durationSeconds: number): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not ready');
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  /**
   * Daytime Birdsong Generator:
   * Plays soft, cheerful chirps and warbles with randomized timing
   */
  private triggerBirdChirp(): void {
    if (!this.ctx || !this.dayGain || !this.isRunning) return;
    if (!this.isDayTime(this.currentTheme)) return;

    const now = this.ctx.currentTime;
    const count = 1 + Math.floor(Math.random() * 3); // 1 to 3 chirps per phrase
    const baseFreq = 2400 + Math.random() * 800; // 2400Hz - 3200Hz

    for (let i = 0; i < count; i++) {
      const startTime = now + i * (0.12 + Math.random() * 0.08);
      const duration = 0.08 + Math.random() * 0.05;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Bird chirp frequency curve: rapid sweep upward then gentle downward flick
      osc.frequency.setValueAtTime(baseFreq * (0.8 + Math.random() * 0.2), startTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, startTime + duration * 0.5);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, startTime + duration);

      // Soft envelope
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.035, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.dayGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    }
  }

  /**
   * Nighttime Cricket Generator:
   * Plays soft rhythmic summer evening cricket chirps
   */
  private triggerCricketChirp(): void {
    if (!this.ctx || !this.nightGain || !this.isRunning) return;
    if (this.isDayTime(this.currentTheme)) return;

    const now = this.ctx.currentTime;
    const pulses = 3 + Math.floor(Math.random() * 3); // 3-5 rapid pulse bursts
    const baseFreq = 4600 + Math.random() * 400; // ~4800Hz cricket frequency

    for (let i = 0; i < pulses; i++) {
      const startTime = now + i * 0.055;
      const duration = 0.035;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, startTime);

      // Cricket pulse envelope
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.022, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.nightGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.01);
    }
  }

  /**
   * Soft Wind Chime / Porch Music Box:
   * Gentle, sporadic harmonic notes (warm pentatonic)
   */
  private triggerSoftChime(): void {
    if (!this.ctx || !this.masterGain || !this.isRunning) return;

    // Pentatonic scale notes (G4, A4, C5, D5, E5, G5)
    const notes = [392.0, 440.0, 523.25, 587.33, 659.25, 783.99];
    const freq = notes[Math.floor(Math.random() * notes.length)];

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm bell/chime decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.018, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.6);
  }

  /**
   * Schedules recurring procedural creature & ambient events
   */
  private scheduleLoops(): void {
    // Schedule Birds
    const birdLoop = () => {
      if (!this.isRunning) return;
      this.triggerBirdChirp();
      const nextDelay = 3500 + Math.random() * 4500; // chirp every 3.5 - 8s
      this.birdTimer = setTimeout(birdLoop, nextDelay);
    };
    this.birdTimer = setTimeout(birdLoop, 1500);

    // Schedule Crickets
    const cricketLoop = () => {
      if (!this.isRunning) return;
      this.triggerCricketChirp();
      const nextDelay = 1800 + Math.random() * 2500; // chirp every 1.8 - 4.3s
      this.cricketTimer = setTimeout(cricketLoop, nextDelay);
    };
    this.cricketTimer = setTimeout(cricketLoop, 1000);

    // Schedule Chimes
    const chimeLoop = () => {
      if (!this.isRunning) return;
      this.triggerSoftChime();
      const nextDelay = 8000 + Math.random() * 9000; // chime every 8 - 17s
      this.chimeTimer = setTimeout(chimeLoop, nextDelay);
    };
    this.chimeTimer = setTimeout(chimeLoop, 5000);
  }

  private clearLoops(): void {
    if (this.birdTimer) clearTimeout(this.birdTimer);
    if (this.cricketTimer) clearTimeout(this.cricketTimer);
    if (this.chimeTimer) clearTimeout(this.chimeTimer);
    this.birdTimer = null;
    this.cricketTimer = null;
    this.chimeTimer = null;
  }

  /**
   * Play a cute tactile click sound on user interaction
   */
  public playClickSound(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.05);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // AudioContext might be paused or restricted
    }
  }

  /**
   * Play a magical, delicate sparkle chime when opening the diary
   */
  public playSparkleSound(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.035, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.36);
      });
    } catch {
      // AudioContext might be paused or restricted
    }
  }

  /**
   * Starts or resumes the soundscape
   */
  public async start(): Promise<void> {
    await this.init();
    if (!this.ctx || !this.masterGain) return;

    this.isRunning = true;
    this.scheduleLoops();

    // Smooth fade in over 1.2 seconds
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.85, now + 1.2);
  }

  /**
   * Stops or mutes the soundscape with smooth fade out
   */
  public stop(): void {
    if (!this.ctx || !this.masterGain) {
      this.isRunning = false;
      this.clearLoops();
      return;
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);

    setTimeout(() => {
      this.isRunning = false;
      this.clearLoops();
    }, 650);
  }

  /**
   * Crossfade smoothly when user or clock shifts day/night
   */
  public updateTheme(newTheme: ThemeMode): void {
    this.currentTheme = newTheme;
    if (!this.ctx || !this.dayGain || !this.nightGain) return;

    const isDay = this.isDayTime(newTheme);
    const now = this.ctx.currentTime;

    // Crossfade day and night buses over 1.8 seconds
    this.dayGain.gain.cancelScheduledValues(now);
    this.dayGain.gain.setValueAtTime(this.dayGain.gain.value, now);
    this.dayGain.gain.linearRampToValueAtTime(isDay ? 1 : 0, now + 1.8);

    this.nightGain.gain.cancelScheduledValues(now);
    this.nightGain.gain.setValueAtTime(this.nightGain.gain.value, now);
    this.nightGain.gain.linearRampToValueAtTime(isDay ? 0 : 1, now + 1.8);
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

// Global singleton instance for the app
export const soundscape = new SoundscapeEngine();
