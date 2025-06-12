import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  const handleSmoothScroll = useCallback((
    e: React.MouseEvent<HTMLAnchorElement>, 
    sectionId: string
  ) => {
    e.preventDefault();
    scrollToSection(sectionId);
  }, [scrollToSection]);

  return { scrollToSection, handleSmoothScroll };
}; 