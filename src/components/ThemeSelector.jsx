import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MdKeyboardArrowDown, MdCheck } from 'react-icons/md';

const ThemeSelector = () => {
  const { currentTheme, themes, changeTheme, currentThemeData } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ThemePreview = ({ theme, isSelected }) => (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-700/50 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <span className="text-lg">{theme.icon}</span>
        <span className="font-medium text-sm">{theme.name}</span>
      </div>
      {isSelected && (
        <MdCheck className="ml-auto text-primary-500 text-lg" />
      )}
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-dark-700/50 hover:bg-dark-600/50 rounded-lg transition-colors duration-200 text-dark-200 hover:text-white border border-dark-600/50"
      >
        <span className="text-lg">{currentThemeData.icon}</span>
        <span className="text-sm font-medium hidden sm:block">{currentThemeData.name}</span>
        <MdKeyboardArrowDown className={`text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => {
                  changeTheme(key);
                  setIsOpen(false);
                }}
                className="w-full text-left"
              >
                <ThemePreview 
                  theme={theme} 
                  isSelected={currentTheme === key} 
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector; 