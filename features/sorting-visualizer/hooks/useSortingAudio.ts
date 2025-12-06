import { useRef, useCallback, useEffect } from 'react';
import { useSound } from '../../../shared/context/SoundContext';

export const useSortingAudio = () => {
  const { isMuted } = useSound();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Master gain
      const masterGain = audioCtxRef.current.createGain();
      masterGain.gain.value = 0.1;
      masterGain.connect(audioCtxRef.current.destination);
      gainRef.current = masterGain;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTone = useCallback((value: number, max: number) => {
    if (isMuted) return;
    initAudio();
    if (!audioCtxRef.current || !gainRef.current) return;

    // Map 0-max to 200-800Hz
    const frequency = 200 + (value / max) * 600;

    const osc = audioCtxRef.current.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    
    const gain = audioCtxRef.current.createGain();
    gain.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination); // Connect individual gain to destination

    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.1);
  }, [isMuted]);

  const playCompletion = useCallback(async (count: number) => {
    if (isMuted) return;
    initAudio();
    if (!audioCtxRef.current) return;

    const now = audioCtxRef.current.currentTime;
    for (let i = 0; i < count; i++) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        const freq = 200 + (i / count) * 600;
        
        osc.frequency.value = freq;
        gain.gain.value = 0.05;
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.05) + 0.05);
        
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        
        osc.start(now + (i * 0.03)); // Fast arpeggio
        osc.stop(now + (i * 0.03) + 0.1);
    }
  }, [isMuted]);

  return { playTone, playCompletion };
};