import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  const themes = {
    dark: {
      name: 'Dark',
      icon: '🌙',
      className: '',
      editorTheme: 'vs-dark',
      colors: {
        primary: '#0ea5e9',
        secondary: '#d946ef',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        surface: 'rgba(30, 41, 59, 0.8)',
        text: '#f8fafc',
        textSecondary: '#94a3b8',
        border: 'rgba(148, 163, 184, 0.2)',
        accent: '#38bdf8'
      }
    },
    light: {
      name: 'Light',
      icon: '☀️',
      className: 'lightMode',
      editorTheme: 'vs-light',
      colors: {
        primary: '#0284c7',
        secondary: '#c026d3',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
        surface: 'rgba(255, 255, 255, 0.9)',
        text: '#0f172a',
        textSecondary: '#475569',
        border: 'rgba(148, 163, 184, 0.2)',
        accent: '#0ea5e9'
      }
    },
    cyberpunk: {
      name: 'Cyberpunk',
      icon: '🤖',
      className: 'cyberpunk',
      editorTheme: 'vs-dark',
      colors: {
        primary: '#00ff88',
        secondary: '#ff0080',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        surface: 'rgba(26, 26, 46, 0.8)',
        text: '#ffffff',
        textSecondary: '#00ff88',
        border: 'rgba(0, 255, 136, 0.3)',
        accent: '#ff0080'
      }
    },
    sunset: {
      name: 'Sunset',
      icon: '🌅',
      className: 'sunset',
      editorTheme: 'vs-dark',
      colors: {
        primary: '#ff6b35',
        secondary: '#f7931e',
        background: 'linear-gradient(135deg, #2c1810 0%, #4a1c10 50%, #6b2c1c 100%)',
        surface: 'rgba(44, 24, 16, 0.8)',
        text: '#fff5f0',
        textSecondary: '#ffb366',
        border: 'rgba(255, 107, 53, 0.3)',
        accent: '#f7931e'
      }
    },
    ocean: {
      name: 'Ocean',
      icon: '🌊',
      className: 'ocean',
      editorTheme: 'vs-dark',
      colors: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        background: 'linear-gradient(135deg, #0c4a6e 0%, #155e75 50%, #164e63 100%)',
        surface: 'rgba(12, 74, 110, 0.8)',
        text: '#f0fdfa',
        textSecondary: '#67e8f9',
        border: 'rgba(8, 145, 178, 0.3)',
        accent: '#06b6d4'
      }
    }
  };

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('theme', themeName);
    
    // Remove all theme classes
    document.body.classList.remove('lightMode', 'cyberpunk', 'sunset', 'ocean');
    
    // Add new theme class
    if (themes[themeName].className) {
      document.body.classList.add(themes[themeName].className);
    }
  };

  useEffect(() => {
    changeTheme(currentTheme);
  }, []);

  const value = {
    currentTheme,
    themes,
    changeTheme,
    currentThemeData: themes[currentTheme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 