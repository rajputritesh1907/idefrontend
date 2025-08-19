import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MdClose, MdInfo, MdPalette, MdSettings, MdAutoAwesome, MdCode, MdAccessibility } from 'react-icons/md';

const ThemeDocs = ({ isOpen, onClose }) => {
  const { themes, currentThemeData } = useTheme();

  const features = [
    {
      icon: <MdPalette className="text-2xl text-primary-500" />,
      title: "5 Beautiful Themes",
      description: "Choose from Dark, Light, Cyberpunk, Sunset, and Ocean themes, each carefully designed for optimal coding experience."
    },
    {
      icon: <MdSettings className="text-2xl text-primary-500" />,
      title: "Advanced Customization",
      description: "Adjust font sizes, contrast levels, animations, and blur effects to match your preferences perfectly."
    },
    {
      icon: <MdCode className="text-2xl text-primary-500" />,
      title: "Editor Integration",
      description: "Seamless integration with Monaco Editor, automatically applying the perfect theme for your code editor."
    },
    {
      icon: <MdAccessibility className="text-2xl text-primary-500" />,
      title: "Accessibility First",
      description: "All themes are designed with accessibility in mind, ensuring comfortable reading and coding for everyone."
    }
  ];

  const themeDetails = [
    {
      name: "Dark",
      description: "Classic dark theme with blue accents. Perfect for long coding sessions and easy on the eyes.",
      bestFor: "Night coding, long sessions, focus work"
    },
    {
      name: "Light", 
      description: "Clean light theme with excellent contrast. Ideal for daytime work and well-lit environments.",
      bestFor: "Daytime work, well-lit environments, quick edits"
    },
    {
      name: "Cyberpunk",
      description: "Futuristic theme with neon green and pink accents. For those who love a sci-fi aesthetic.",
      bestFor: "Creative coding, gaming projects, retro aesthetics"
    },
    {
      name: "Sunset",
      description: "Warm orange and red tones inspired by beautiful sunsets. Reduces eye strain during evening work.",
      bestFor: "Evening work, warm environments, reduced eye strain"
    },
    {
      name: "Ocean",
      description: "Deep blue theme inspired by the ocean depths. Calming and professional for serious development.",
      bestFor: "Professional work, calm environments, deep focus"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600/50">
          <div className="flex items-center gap-3">
            <MdInfo className="text-2xl text-primary-500" />
            <div>
              <h2 className="text-xl font-bold">Theme Documentation</h2>
              <p className="text-dark-400 text-sm">Learn about our perfect theme system</p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Current Theme Info */}
          <div className="mb-8 p-4 rounded-xl border border-dark-600/50 bg-dark-700/30">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{currentThemeData.icon}</span>
              <div>
                <h3 className="font-semibold">Current Theme: {currentThemeData.name}</h3>
                <p className="text-dark-400 text-sm">Active theme with {currentThemeData.editorTheme} editor</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MdAutoAwesome className="text-xl text-primary-500" />
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="p-4 rounded-xl border border-dark-600/50 bg-dark-700/30">
                  <div className="flex items-start gap-3">
                    {feature.icon}
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-dark-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Theme Details</h3>
            <div className="space-y-4">
              {themeDetails.map((theme, index) => (
                <div key={index} className="p-4 rounded-xl border border-dark-600/50 bg-dark-700/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{theme.name}</h4>
                      <p className="text-dark-400 text-sm mb-2">{theme.description}</p>
                      <div className="text-xs text-primary-500 font-medium">
                        Best for: {theme.bestFor}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold">
                        {themes[theme.name.toLowerCase()]?.icon || '🎨'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Tips */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Usage Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <p>Use the theme selector in the navbar to quickly switch between themes</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <p>Access the theme gallery for a visual preview of all available themes</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <p>Customize font size, contrast, and animations in the theme settings</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <p>Your theme preference is automatically saved and restored on your next visit</p>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-dark-700/30 border border-dark-600/50">
                <div className="flex justify-between items-center">
                  <span>Open Theme Gallery</span>
                  <kbd className="px-2 py-1 bg-dark-600 rounded text-xs">Ctrl + T</kbd>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-dark-700/30 border border-dark-600/50">
                <div className="flex justify-between items-center">
                  <span>Open Theme Settings</span>
                  <kbd className="px-2 py-1 bg-dark-600 rounded text-xs">Ctrl + Shift + T</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDocs; 