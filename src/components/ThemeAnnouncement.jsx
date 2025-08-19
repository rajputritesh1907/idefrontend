import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MdClose, MdAutoAwesome, MdPalette, MdRocket } from 'react-icons/md';

const ThemeAnnouncement = () => {
  const { themes, changeTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const hasSeenAnnouncement = localStorage.getItem('themeAnnouncementSeen');
    if (!hasSeenAnnouncement) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentThemeIndex((prev) => (prev + 1) % Object.keys(themes).length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible, themes]);

  const handleClose = () => {
    localStorage.setItem('themeAnnouncementSeen', 'true');
    setIsVisible(false);
  };

  const handleTryTheme = (themeKey) => {
    changeTheme(themeKey);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  if (!isVisible) return null;

  const themeKeys = Object.keys(themes);
  const currentThemeKey = themeKeys[currentThemeIndex];
  const currentTheme = themes[currentThemeKey];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative p-4 border-b border-dark-600/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <MdRocket className="text-xl text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Perfect Themes Launched! 🎉</h3>
              <p className="text-dark-400 text-sm">Experience the future of coding</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-dark-700/50 transition-colors duration-200"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Theme Showcase */}
          <div className="mb-4 p-4 rounded-xl border border-dark-600/50 bg-dark-700/30">
            <div className="text-center mb-3">
              <span className="text-3xl mb-2 block">{currentTheme.icon}</span>
              <h4 className="font-semibold">{currentTheme.name}</h4>
              <p className="text-dark-400 text-sm">Try this beautiful theme</p>
            </div>
            
            {/* Color Palette */}
            <div className="flex justify-center gap-2 mb-3">
              <div 
                className="w-4 h-4 rounded-full border border-dark-600"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
              <div 
                className="w-4 h-4 rounded-full border border-dark-600"
                style={{ backgroundColor: currentTheme.colors.secondary }}
              />
              <div 
                className="w-4 h-4 rounded-full border border-dark-600"
                style={{ backgroundColor: currentTheme.colors.accent }}
              />
            </div>

            <button
              onClick={() => handleTryTheme(currentThemeKey)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                isAnimating 
                  ? 'scale-105 bg-primary-600' 
                  : 'bg-primary-500 hover:bg-primary-600'
              }`}
            >
              {isAnimating ? 'Applied!' : 'Try This Theme'}
            </button>
          </div>

          {/* Features List */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MdAutoAwesome className="text-primary-500" />
              <span>5 beautifully crafted themes</span>
            </div>
            <div className="flex items-center gap-2">
              <MdPalette className="text-primary-500" />
              <span>Advanced customization options</span>
            </div>
            <div className="flex items-center gap-2">
              <MdRocket className="text-primary-500" />
              <span>Seamless editor integration</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                handleClose();
                // Open theme gallery
                const event = new CustomEvent('openThemeGallery');
                window.dispatchEvent(event);
              }}
              className="flex-1 py-2 px-4 bg-dark-600 hover:bg-dark-500 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Explore All Themes
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Got It!
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-br from-secondary-500/20 to-primary-500/20 rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default ThemeAnnouncement; 