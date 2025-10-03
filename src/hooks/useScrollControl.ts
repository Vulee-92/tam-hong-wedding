/* eslint-disable */
import { useEffect, useRef } from 'react';

interface Section {
  id: string;
  ref: React.RefObject<HTMLElement>;
}

export function useScrollControl(sections: Section[]) {
  const isScrolling = useRef(false);
  const currentSectionIndex = useRef(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scrollToSection = (index: number) => {
      if (index >= 0 && index < sections.length) {
        const section = sections[index].ref.current;
        if (section) {
          isScrolling.current = true;
          section.scrollIntoView({ behavior: 'smooth' });
          timeoutId = setTimeout(() => {
            isScrolling.current = false;
          }, 1000); // Đợi animation scroll hoàn thành
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrolling.current) return;

      if (e.deltaY > 0) {
        // Scroll xuống
        if (currentSectionIndex.current < sections.length - 1) {
          currentSectionIndex.current += 1;
          scrollToSection(currentSectionIndex.current);
        }
      } else {
        // Scroll lên
        if (currentSectionIndex.current > 0) {
          currentSectionIndex.current -= 1;
          scrollToSection(currentSectionIndex.current);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSectionIndex.current < sections.length - 1) {
          currentSectionIndex.current += 1;
          scrollToSection(currentSectionIndex.current);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSectionIndex.current > 0) {
          currentSectionIndex.current -= 1;
          scrollToSection(currentSectionIndex.current);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [sections]);
} 