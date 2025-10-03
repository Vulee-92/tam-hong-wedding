import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTextToSpeechProps {
  text: string;
  onBoundary?: (event: SpeechSynthesisEvent) => void;
  onMarkReached?: (mark: string, position: number) => void;
}

export function useTextToSpeech({ text, onBoundary, onMarkReached }: UseTextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentPosition, setCurrentPosition] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef(text);
  // Lưu speechSynthesis vào ref để tránh re-render
  const speechSynthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // Tạo utterance mới với các cấu hình
  const createUtterance = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = speed;
    utterance.pitch = 1;
    
    // Improved word boundary detection
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Ensure position is within valid range
        const position = Math.min(event.charIndex, text.length);
        setCurrentPosition(position);
        onBoundary?.(event);
      }
    };

    // Thêm mark cho từng đoạn văn
    utterance.onmark = (event) => {
      onMarkReached?.(event.name, event.charIndex);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentPosition(0);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentPosition(0);
      utteranceRef.current = null;
    };

    return utterance;
  }, [speed, text, onBoundary, onMarkReached]);

  const stop = useCallback(() => {
    speechSynthesisRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, []);

  const play = useCallback(() => {
    try {
      if (isPaused && utteranceRef.current) {
        speechSynthesisRef.current.resume();
        setIsPlaying(true);
        setIsPaused(false);
        return;
      }

      // Dừng speech đang chạy (nếu có)
      speechSynthesisRef.current.cancel();

      // Tạo utterance mới
      const utterance = createUtterance();
      utteranceRef.current = utterance;

      // Bắt đầu đọc
      speechSynthesisRef.current.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error playing speech:', error);
      stop();
    }
  }, [isPaused, createUtterance, stop]);

  const pause = useCallback(() => {
    try {
      if (isPlaying && !isPaused && utteranceRef.current) {
        speechSynthesisRef.current.pause();
        setIsPaused(true);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing speech:', error);
      stop();
    }
  }, [isPlaying, isPaused, stop]);

  const changeSpeed = useCallback((newSpeed: number) => {
    try {
      setSpeed(newSpeed);
      
      // Nếu không đang phát, chỉ cần cập nhật speed
      if (!isPlaying && !isPaused) {
        return;
      }

      // Lưu trạng thái hiện tại
      const wasPaused = isPaused;
      
      // Dừng phát hiện tại
      speechSynthesisRef.current.cancel();
      
      // Tạo và cấu hình utterance mới
      const utterance = new SpeechSynthesisUtterance(textRef.current);
      utterance.lang = 'vi-VN';
      utterance.rate = newSpeed;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      // Cập nhật ref và bắt đầu phát
      utteranceRef.current = utterance;
      speechSynthesisRef.current.speak(utterance);

      // Nếu trước đó đang pause thì pause lại
      if (wasPaused) {
        requestAnimationFrame(() => {
          speechSynthesisRef.current.pause();
          setIsPlaying(false);
          setIsPaused(true);
        });
      } else {
        setIsPlaying(true);
        setIsPaused(false);
      }
    } catch (error) {
      console.error('Error changing speed:', error);
      stop();
    }
  }, [isPlaying, isPaused, stop]);

  // Cleanup khi unmount
  useEffect(() => () => {
    if (utteranceRef.current) {
      speechSynthesisRef.current.cancel();
    }
  }, []);

  return {
    isPlaying,
    isPaused,
    speed,
    currentPosition,
    play,
    pause,
    stop,
    changeSpeed
  };
} 