import { useEffect } from 'react';

const useThemeShortcuts = ({ onOpenGallery, onOpenSettings }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+T: Open Theme Gallery
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        if (onOpenGallery) onOpenGallery();
      }
      // Ctrl+Shift+T: Open Theme Settings
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        if (onOpenSettings) onOpenSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenGallery, onOpenSettings]);
};

export default useThemeShortcuts; 