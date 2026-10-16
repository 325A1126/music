/**
 * Web Audio API Engine for High-Voltage Rock Stage
 * Features:
 * - Real-time AudioContext with Distortion / WaveShaper overdrive
 * - 3-Band Equalizer (Bass, Mid, Treble) & Presence filter
 * - Fast Punk Rock / Melodic Hardcore Riff & Drum Sequencer
 * - Interactive Soundboard (Punchy Kick, Snare, Crash, Power Chords, Pick Slide, Crowd Chant)
 * - AnalyserNode for Real-Time Canvas Visualizer & VU Meter
 * - Audio File Upload & Playback support
 */

class RockAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private distortionNode: WaveShaperNode | null = null;
  private bassFilter: BiquadFilterNode | null = null;
  private midFilter: BiquadFilterNode | null = null;
  private trebleFilter: BiquadFilterNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  // External audio playback
  private audioElement: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;

  // Synthesizer sequencer state
  private isSequencerRunning: boolean = false;
  private sequencerTimer: number | null = null;
  private currentStep: number = 0;
  private bpm: number = 185;
  private currentTrackId: string = 'reclaim-the-day';

  // Listener callbacks
  private onStepCallback: ((step: number, beatTime: number) => void) | null = null;
  private onTrackEndCallback: (() => void) | null = null;

  constructor() {
    // Lazy initialize on first user gesture
  }

  public init() {
    if (this.ctx) return;
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();

      // Analyser Node for visualizer
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.75;

      // Distortion / Overdrive
      this.distortionNode = this.ctx.createWaveShaper();
      try {
        this.distortionNode.curve = this.makeDistortionCurve(50);
        this.distortionNode.oversample = '4x';
      } catch (curveErr) {
        console.warn('WaveShaper curve setup fallback:', curveErr);
      }

      // 3-Band EQ
      this.bassFilter = this.ctx.createBiquadFilter();
      this.bassFilter.type = 'lowshelf';
      this.bassFilter.frequency.value = 250;
      this.bassFilter.gain.value = 4.0;

      this.midFilter = this.ctx.createBiquadFilter();
      this.midFilter.type = 'peaking';
      this.midFilter.frequency.value = 1500;
      this.midFilter.gain.value = 2.0;

      this.trebleFilter = this.ctx.createBiquadFilter();
      this.trebleFilter.type = 'highshelf';
      this.trebleFilter.frequency.value = 4000;
      this.trebleFilter.gain.value = 3.0;

      // Routing: Source -> Distortion -> Bass -> Mid -> Treble -> Master -> Analyser -> Destination
      this.distortionNode.connect(this.bassFilter);
      this.bassFilter.connect(this.midFilter);
      this.midFilter.connect(this.trebleFilter);
      this.trebleFilter.connect(this.masterGain);
      this.masterGain.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);
    } catch (err) {
      console.warn('AudioContext creation will occur on next user interaction:', err);
    }
  }

  private makeDistortionCurve(amount: number = 50): Float32Array<ArrayBuffer> {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const buffer = new ArrayBuffer(n_samples * 4);
    const curve = new Float32Array(buffer);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch((e) => console.warn('Audio resume error:', e));
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public setMasterVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1.5, val)), this.ctx.currentTime);
    }
  }

  public setDrive(amount: number) {
    if (this.distortionNode) {
      this.distortionNode.curve = this.makeDistortionCurve(amount);
    }
  }

  public setEq(bass: number, mid: number, treble: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.bassFilter) this.bassFilter.gain.setValueAtTime(bass, now);
    if (this.midFilter) this.midFilter.gain.setValueAtTime(mid, now);
    if (this.trebleFilter) this.trebleFilter.gain.setValueAtTime(treble, now);
  }

  // --- Soundboard Triggers ---

  public triggerKick(time?: number) {
    this.resume();
    if (!this.ctx || !this.distortionNode) return;
    const t = time ?? this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Deep rock kick pitch drop: 150Hz down to 35Hz
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.12);

    gain.gain.setValueAtTime(1.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.distortionNode);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  public triggerSnare(time?: number) {
    this.resume();
    if (!this.ctx || !this.distortionNode) return;
    const t = time ?? this.ctx.currentTime;

    // Body tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.1);
    oscGain.gain.setValueAtTime(0.8, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc.connect(oscGain);
    oscGain.connect(this.distortionNode);
    osc.start(t);
    osc.stop(t + 0.18);

    // Crack noise
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.9, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.distortionNode);

    noise.start(t);
    noise.stop(t + 0.22);
  }

  public triggerHihat(time?: number, open: boolean = false) {
    this.resume();
    if (!this.ctx || !this.distortionNode) return;
    const t = time ?? this.ctx.currentTime;
    const duration = open ? 0.35 : 0.06;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(open ? 0.6 : 0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.distortionNode);

    noise.start(t);
    noise.stop(t + duration);
  }

  public triggerCrash(time?: number) {
    this.resume();
    if (!this.ctx || !this.distortionNode) return;
    const t = time ?? this.ctx.currentTime;
    const duration = 1.6;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.85;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4500;
    filter.Q.value = 1.2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.distortionNode);

    noise.start(t);
    noise.stop(t + duration);
  }

  /**
   * Heavy Rock Power Chord (Root + 5th + Octave)
   * With detuned sawtooth oscillators and guitar cabinet filter
   */
  public triggerPowerChord(rootFreq: number, duration: number = 0.45, time?: number) {
    this.resume();
    if (!this.ctx || !this.distortionNode) return;
    const t = time ?? this.ctx.currentTime;

    const chordFrequencies = [
      rootFreq, // Root
      rootFreq * 1.4983, // Perfect Fifth
      rootFreq * 2.0, // Octave
    ];

    chordFrequencies.forEach((freq) => {
      // 2 detuned oscillators per note for thick grunge chorus
      [-4, 4].forEach((detune) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        osc.detune.setValueAtTime(detune, t);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + duration);

        osc.connect(gain);
        gain.connect(this.distortionNode!);

        osc.start(t);
        osc.stop(t + duration + 0.05);
      });
    });
  }

  // Guitar pick slide effect
  public triggerPickSlide() {
    this.resume();
    if (!this.ctx || !this.distortionNode) return;
    const t = this.ctx.currentTime;
    const dur = 0.6;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + dur);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

    osc.connect(gain);
    gain.connect(this.distortionNode);

    osc.start(t);
    osc.stop(t + dur);
  }

  // Audience "OI! OI! OI!" rock shout effect
  public triggerCrowdChant() {
    this.resume();
    if (!this.ctx || !this.distortionNode) return;
    const t = this.ctx.currentTime;

    for (let c = 0; c < 3; c++) {
      const chantTime = t + c * 0.32;
      // Formant-like noise burst
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.7;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 700 + Math.random() * 150;
      bp.Q.value = 3.5;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.55, chantTime);
      gain.gain.exponentialRampToValueAtTime(0.01, chantTime + 0.18);

      noise.connect(bp);
      bp.connect(gain);
      gain.connect(this.distortionNode);

      noise.start(chantTime);
      noise.stop(chantTime + 0.2);
    }
  }

  // --- Sequencer for Full Rock Songs ---

  public startSongSequencer(
    trackId: string,
    onStep?: (step: number, beatTime: number) => void,
    onTrackEnd?: () => void
  ) {
    this.resume();
    this.stopSequencer();

    this.currentTrackId = trackId;
    this.onStepCallback = onStep ?? null;
    this.onTrackEndCallback = onTrackEnd ?? null;
    this.isSequencerRunning = true;
    this.currentStep = 0;

    // Track 1 BPM = 185 (fast driving rock), Track 2 = 195, Track 3 = 175
    this.bpm = trackId === 'shibuya-riot' ? 195 : trackId === 'over-the-wall' ? 175 : 185;

    const stepInterval = (60 / this.bpm / 4) * 1000; // 16th note in ms

    // Chord map: E2=82.41, G2=98.0, A2=110.0, C3=130.81, D3=146.83
    const chordFrequencies: Record<string, number> = {
      E: 82.41,
      G: 98.0,
      A: 110.0,
      C: 130.81,
      D: 146.83,
    };

    let stepCounter = 0;

    this.sequencerTimer = window.setInterval(() => {
      if (!this.isSequencerRunning) return;

      const beat = stepCounter % 16;
      const measure = Math.floor(stepCounter / 16);
      const currentTime = this.ctx ? this.ctx.currentTime : 0;

      // Punk Rock Driving Drum Pattern
      if (beat === 0 || beat === 6 || beat === 8 || beat === 14) {
        this.triggerKick(currentTime);
      }
      if (beat === 4 || beat === 12) {
        this.triggerSnare(currentTime);
      }
      if (beat % 2 === 0) {
        this.triggerHihat(currentTime, beat === 14);
      }
      if (beat === 0 && measure % 4 === 0) {
        this.triggerCrash(currentTime);
      }

      // Driving Rock Guitar Riff progression
      // Standard verse-chorus progression in E Minor: E -> G -> A -> C -> D
      let currentChord = 'E';
      const mMod = measure % 8;
      if (mMod < 2) currentChord = 'E';
      else if (mMod < 4) currentChord = 'G';
      else if (mMod < 6) currentChord = 'A';
      else if (mMod === 6) currentChord = 'C';
      else currentChord = 'D';

      // 8th note chugging guitar rhythm
      if (beat % 2 === 0) {
        const rootFreq = chordFrequencies[currentChord] || 82.41;
        // Accent on the beat
        const dur = beat === 0 || beat === 8 ? 0.35 : 0.18;
        this.triggerPowerChord(rootFreq, dur, currentTime);
      }

      if (this.onStepCallback) {
        this.onStepCallback(stepCounter, (stepCounter * (60 / this.bpm / 4)));
      }

      stepCounter++;
      this.currentStep = stepCounter;

      // Total song loop length ~106 seconds (approx 1300 steps at 185 bpm)
      if (stepCounter > 1320) {
        if (this.onTrackEndCallback) {
          this.onTrackEndCallback();
        }
        stepCounter = 0;
      }
    }, stepInterval);
  }

  public stopSequencer() {
    this.isSequencerRunning = false;
    if (this.sequencerTimer !== null) {
      clearInterval(this.sequencerTimer);
      this.sequencerTimer = null;
    }
  }

  public isPlaying(): boolean {
    return this.isSequencerRunning || (this.audioElement ? !this.audioElement.paused : false);
  }

  // --- External Audio File Loader & Player ---

  public loadAudioFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.resume();
      this.stopSequencer();

      const objectUrl = URL.createObjectURL(file);

      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.crossOrigin = 'anonymous';

        if (this.ctx && this.distortionNode) {
          this.mediaSourceNode = this.ctx.createMediaElementSource(this.audioElement);
          this.mediaSourceNode.connect(this.distortionNode);
        }
      }

      this.audioElement.src = objectUrl;
      this.audioElement.oncanplay = () => {
        resolve(objectUrl);
      };
      this.audioElement.onerror = (e) => {
        reject(e);
      };
    });
  }

  public playExternalAudio() {
    if (this.audioElement) {
      this.resume();
      this.audioElement.play();
    }
  }

  public pauseExternalAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audioElement;
  }
}

export const rockEngine = new RockAudioEngine();
