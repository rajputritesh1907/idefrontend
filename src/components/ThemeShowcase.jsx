import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MdClose, MdCheck } from 'react-icons/md';

const ThemeShowcase = ({ isOpen, onClose }) => {
  const { themes, currentTheme, changeTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState(currentTheme);

  const ThemePreview = ({ themeKey, theme }) => {
    const isActive = currentTheme === themeKey;
    const isPreviewing = previewTheme === themeKey;

    return (
      <div 
        className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
          isActive 
            ? 'border-primary-500 bg-primary-500/10' 
            : 'border-dark-600 hover:border-primary-400/50 bg-dark-700/30'
        } ${isPreviewing ? 'ring-2 ring-primary-400/50' : ''}`}
        onClick={() => setPreviewTheme(themeKey)}
      >
        {/* Theme Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{theme.icon}</span>
            <div>
              <h3 className="font-semibold text-sm">{theme.name}</h3>
              <p className="text-xs text-dark-400">Theme</p>
            </div>
          </div>
          {isActive && (
            <div className="flex items-center gap-1 text-primary-500 text-sm">
              <MdCheck className="text-lg" />
              <span className="font-medium">Active</span>
            </div>
          )}
        </div>

        {/* Color Palette Preview */}
        <div className="space-y-2">
          <div className="flex gap-1">
            <div 
              className="w-4 h-4 rounded-full border border-dark-600"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div 
              className="w-4 h-4 rounded-full border border-dark-600"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div 
              className="w-4 h-4 rounded-full border border-dark-600"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>
          
          {/* Sample UI Elements */}
          <div className="space-y-1">
            <div 
              className="h-2 rounded-full"
              style={{ backgroundColor: theme.colors.surface }}
            />
            <div 
              className="h-1 rounded-full"
              style={{ backgroundColor: theme.colors.border }}
            />
          </div>
        </div>

        {/* Apply Button */}
        {!isActive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              changeTheme(themeKey);
            }}
            className="mt-3 w-full py-1 px-2 text-xs font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
          >
            Apply Theme
          </button>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600/50">
          <div>
            <h2 className="text-xl font-bold">Theme Gallery</h2>
            <p className="text-dark-400 text-sm">Choose your perfect coding environment</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-700/50 transition-colors duration-200"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(themes).map(([key, theme]) => (
              <ThemePreview key={key} themeKey={key} theme={theme} />
            ))}
          </div>

          {/* Live Preview */}
          <div className="mt-8 p-4 rounded-xl border border-dark-600/50 bg-dark-700/30">
            <h3 className="font-semibold mb-3">Live Preview</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <div className="flex-1">
                  <div className="h-3 rounded bg-dark-600 mb-1" />
                  <div className="h-2 rounded bg-dark-600/50 w-2/3" />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded text-sm transition-colors duration-200">
                  Button
                </button>
                <button className="px-3 py-1 bg-dark-600 hover:bg-dark-500 text-white rounded text-sm transition-colors duration-200">
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeShowcase; 