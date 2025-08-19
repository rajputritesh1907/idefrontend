import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MdClose, MdSettings, MdPalette, MdTextFields, MdAnimation } from 'react-icons/md';

const ThemeSettings = ({ isOpen, onClose }) => {
  const { currentThemeData } = useTheme();
  const [fontSize, setFontSize] = useState(14);
  const [contrast, setContrast] = useState(1);
  const [animations, setAnimations] = useState(true);
  const [blur, setBlur] = useState(true);

  const applySettings = () => {
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    // Apply contrast
    document.documentElement.style.filter = `contrast(${contrast})`;
    
    // Apply animations
    if (animations) {
      document.body.classList.add('theme-transition');
    } else {
      document.body.classList.remove('theme-transition');
    }
    
    // Apply blur effects
    const glassElements = document.querySelectorAll('.glass, .modern-card');
    glassElements.forEach(el => {
      if (blur) {
        el.style.backdropFilter = 'blur(20px)';
      } else {
        el.style.backdropFilter = 'none';
      }
    });
  };

  const resetSettings = () => {
    setFontSize(14);
    setContrast(1);
    setAnimations(true);
    setBlur(true);
    document.documentElement.style.fontSize = '14px';
    document.documentElement.style.filter = 'contrast(1)';
    document.body.classList.add('theme-transition');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600/50">
          <div className="flex items-center gap-3">
            <MdSettings className="text-2xl text-primary-500" />
            <div>
              <h2 className="text-xl font-bold">Theme Settings</h2>
              <p className="text-dark-400 text-sm">Customize your experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-700/50 transition-colors duration-200"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Theme */}
          <div className="p-4 rounded-xl border border-dark-600/50 bg-dark-700/30">
            <div className="flex items-center gap-3 mb-2">
              <MdPalette className="text-lg text-primary-500" />
              <h3 className="font-semibold">Current Theme</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentThemeData.icon}</span>
              <span className="font-medium">{currentThemeData.name}</span>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <MdTextFields className="text-lg text-primary-500" />
              <h3 className="font-semibold">Font Size</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Small</span>
                <span>Large</span>
              </div>
              <input
                type="range"
                min="12"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-center text-sm text-dark-400">{fontSize}px</div>
            </div>
          </div>

          {/* Contrast */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <MdPalette className="text-lg text-primary-500" />
              <h3 className="font-semibold">Contrast</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Low</span>
                <span>High</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.1"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-center text-sm text-dark-400">{contrast}x</div>
            </div>
          </div>

          {/* Animations */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <MdAnimation className="text-lg text-primary-500" />
              <h3 className="font-semibold">Animations</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={animations}
                  onChange={(e) => setAnimations(e.target.checked)}
                  className="w-4 h-4 text-primary-500 bg-dark-600 border-dark-500 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span>Enable smooth transitions</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={blur}
                  onChange={(e) => setBlur(e.target.checked)}
                  className="w-4 h-4 text-primary-500 bg-dark-600 border-dark-500 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span>Enable blur effects</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-dark-600/50">
            <button
              onClick={resetSettings}
              className="flex-1 py-2 px-4 bg-dark-600 hover:bg-dark-500 text-white rounded-lg transition-colors duration-200"
            >
              Reset
            </button>
            <button
              onClick={() => {
                applySettings();
                onClose();
              }}
              className="flex-1 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings; 