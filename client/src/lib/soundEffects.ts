// Procedural Mechanical Sound Synthesizer (Web Audio API)
// Generates realistic tactile switch clicks, mechanical keypresses, and resonant bell chimes with zero external assets.

let audioCtx: AudioContext | null = null;
let isMuted: boolean = localStorage.getItem('gravitas_muted') === 'true';

// Global unlock listener for browsers that require user gesture
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted(): boolean {
  return isMuted;
}

export function setAudioMuted(muted: boolean): void {
  isMuted = muted;
  localStorage.setItem('gravitas_muted', muted ? 'true' : 'false');
}

export function toggleAudioMuted(): boolean {
  setAudioMuted(!isMuted);
  return isMuted;
}

/** Authentic Tactile Mechanical Click (Impact snap + low keycap bottom-out thud) */
export function playClickSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Layer 1: High crisp snap (leaf spring / contact transient)
  const snapOsc = ctx.createOscillator();
  const snapGain = ctx.createGain();
  const snapFilter = ctx.createBiquadFilter();

  snapFilter.type = 'bandpass';
  snapFilter.frequency.setValueAtTime(3200, now);
  snapFilter.Q.setValueAtTime(3.0, now);

  snapOsc.type = 'triangle';
  snapOsc.frequency.setValueAtTime(2800, now);
  snapOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.008);

  snapGain.gain.setValueAtTime(0.35, now);
  snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

  snapOsc.connect(snapFilter);
  snapFilter.connect(snapGain);
  snapGain.connect(ctx.destination);

  snapOsc.start(now);
  snapOsc.stop(now + 0.015);

  // Layer 2: Low-frequency tactile body thud (housing resonance)
  const thudOsc = ctx.createOscillator();
  const thudGain = ctx.createGain();

  thudOsc.type = 'sine';
  thudOsc.frequency.setValueAtTime(240, now);
  thudOsc.frequency.exponentialRampToValueAtTime(80, now + 0.025);

  thudGain.gain.setValueAtTime(0.3, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  thudOsc.connect(thudGain);
  thudGain.connect(ctx.destination);

  thudOsc.start(now);
  thudOsc.stop(now + 0.035);
}

/** Tactile Provision Key Toggle (Positive engagement or release) */
export function playIngredientPop(isAdding = true) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Mechanical switch latch
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(isAdding ? 2200 : 1600, now);
  filter.Q.setValueAtTime(2.0, now);

  osc.type = 'square';
  const startF = isAdding ? 680 : 880;
  const endF = isAdding ? 1100 : 540;

  osc.frequency.setValueAtTime(startF, now);
  osc.frequency.exponentialRampToValueAtTime(endF, now + 0.022);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);

  // Subtle bottom out click
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = 'sine';
  clickOsc.frequency.setValueAtTime(isAdding ? 380 : 320, now);
  clickGain.gain.setValueAtTime(0.2, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickOsc.start(now);
  clickOsc.stop(now + 0.03);
}

/** Resonant culinary kitchen bell chime for timers */
export function playTimerChime() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const freqs = [659.25, 987.77, 1318.51]; // E5, B5, E6 crisp chime
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

    const startTime = ctx.currentTime + idx * 0.06;
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.85);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.9);
  });
}

/** Celebratory hardware completion chord */
export function playCelebrationSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

    const startTime = ctx.currentTime + i * 0.08;
    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.95);
  });
}
