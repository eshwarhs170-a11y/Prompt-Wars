// High-tech Web Audio API Synthesized Sound System
// Pure browser synthesis - 0 external asset dependencies, zero latency

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
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
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

/**
 * Play Cyber Threat / Adversarial Attack Sound
 * High-urgency futuristic defense alert (dual-tone cyber klaxon warning)
 */
export function playThreatAlertSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Pulse 1: Cyber warning pulse
    [0, 0.12].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // Pitch drop from 480Hz down to 180Hz (classic cyber security alert drop)
      osc.frequency.setValueAtTime(480, now + offset);
      osc.frequency.exponentialRampToValueAtTime(160, now + offset + 0.1);

      gain.gain.setValueAtTime(0.18, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });

    // Sub-bass heavy impact thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.28);
    subGain.gain.setValueAtTime(0.25, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.3);
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

/**
 * Play Legitimate Request Success Chime
 * Crystalline harmonic triad chime (Authorized / Funds Cleared)
 */
export function playSuccessChime() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic Major Triad: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.5)
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.35, gain: 0.12 },
      { freq: 659.25, time: 0.07, dur: 0.38, gain: 0.14 },
      { freq: 783.99, time: 0.14, dur: 0.45, gain: 0.15 },
      { freq: 1046.5, time: 0.22, dur: 0.55, gain: 0.16 },
    ];

    notes.forEach(({ freq, time, dur, gain: noteGain }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.linearRampToValueAtTime(noteGain, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}
