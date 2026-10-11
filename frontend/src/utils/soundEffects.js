// High-tech Web Audio API Synthesized Sound System
// Pure browser synthesis - 0 external asset dependencies

let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

// ALWAYS call this before playing any sound after user interaction
async function unlockAndGetCtx() {
  const ctx = getAudioContext();
  if (!ctx) return null;
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch (e) {
      console.warn('Audio resume failed:', e);
    }
  }
  return ctx;
}

export const getSoundMuted = () => isMuted;

export const setSoundMuted = (muted) => {
  isMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('bankism_sound_muted', muted ? 'true' : 'false');
  }
};

// Initialize mute state from localStorage
if (typeof window !== 'undefined') {
  isMuted = localStorage.getItem('bankism_sound_muted') === 'true';
}

// Pre-warm the AudioContext on first user interaction
if (typeof window !== 'undefined') {
  const warmUp = () => {
    unlockAndGetCtx().then((ctx) => {
      if (!ctx) return;
      // Play a completely silent buffer to unlock the context
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    });
    ['click', 'keydown', 'touchstart'].forEach((ev) =>
      document.removeEventListener(ev, warmUp)
    );
  };
  ['click', 'keydown', 'touchstart'].forEach((ev) =>
    document.addEventListener(ev, warmUp, { once: true })
  );
}

/**
 * Play Cyber Threat / Adversarial Attack Sound
 * Urgent multi-pulse klaxon — LOUD and unmissable
 */
export async function playThreatAlertSound() {
  if (isMuted) return;
  try {
    const ctx = await unlockAndGetCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Master gain node for overall volume (high volume)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.5, now);
    masterGain.connect(ctx.destination);

    // 3 rapid klaxon pulses
    [0, 0.18, 0.36].forEach((offset) => {
      // Main oscillator — sawtooth pitch-drop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(580, now + offset);
      osc.frequency.exponentialRampToValueAtTime(180, now + offset + 0.15);
      gain.gain.setValueAtTime(0.7, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.17);

      // Square wave layer for punch
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(290, now + offset);
      osc2.frequency.exponentialRampToValueAtTime(90, now + offset + 0.15);
      gain2.gain.setValueAtTime(0.4, now + offset);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now + offset);
      osc2.stop(now + offset + 0.17);
    });

    // Deep sub-bass impact
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    subOsc.connect(subGain);
    subGain.connect(masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.5);

  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

/**
 * Play Legitimate Request Success Chime
 * Crisp harmonic approval chime — clear and pleasant
 */
export async function playSuccessChime() {
  if (isMuted) return;
  try {
    const ctx = await unlockAndGetCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.5, now);
    masterGain.connect(ctx.destination);

    // Harmonic Major Triad: C5, E5, G5, C6 — ascending arpeggio
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.5,  gain: 0.55 },
      { freq: 659.25, time: 0.09, dur: 0.55, gain: 0.60 },
      { freq: 783.99, time: 0.18, dur: 0.6,  gain: 0.65 },
      { freq: 1046.5, time: 0.28, dur: 0.75, gain: 0.70 },
    ];

    notes.forEach(({ freq, time, dur, gain: noteGain }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      // Add slight vibrato
      const vibratoOsc = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibratoOsc.frequency.setValueAtTime(5, now + time);
      vibratoGain.gain.setValueAtTime(3, now + time);
      vibratoOsc.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibratoOsc.start(now + time);
      vibratoOsc.stop(now + time + dur);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.linearRampToValueAtTime(noteGain, now + time + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });

    // Harmonic overtone shimmer
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.setValueAtTime(2093, now + 0.28); // C7
    shimmerGain.gain.setValueAtTime(0.001, now + 0.28);
    shimmerGain.gain.linearRampToValueAtTime(0.25, now + 0.32);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    shimmerOsc.start(now + 0.28);
    shimmerOsc.stop(now + 0.9);

  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}
