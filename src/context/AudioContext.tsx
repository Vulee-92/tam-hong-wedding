/* eslint-disable */
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

type AudioContextType = {
  isPlaying: boolean;
  play: () => Promise<void>;
  pause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
};

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio('/assets/audio/song2.mp3');
    audio.loop = true;
    audio.volume = 1;
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Không thể phát nhạc:', err);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, play, pause, audioRef }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
