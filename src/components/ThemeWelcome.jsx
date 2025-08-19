import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MdClose, MdPalette, MdAutoAwesome, MdCheck } from 'react-icons/md';

const ThemeWelcome = () => {
  const { themes, currentTheme, changeTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('themeWelcomeSeen');
    if (!hasSeenWelcome) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const steps = [
    {
      title: "Welcome to Perfect Themes!",
      description: "Discover a world of beautiful coding environments designed for your comfort and productivity.",
      icon: <MdAutoAwesome className="text-4xl text-primary-500" />
    },
    {
      title: "Choose Your Theme",
      description: "Select from our carefully crafted themes, each optimized for different coding styles and preferences.",
      icon: <MdPalette className="text-4xl text-primary-500" />
    },
    {
      title: "Customize & Enjoy",
      description: "Fine-tune your experience with font sizes, contrast, and animations to match your workflow perfectly.",
      icon: <MdCheck className="text-4xl text-primary-500" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('themeWelcomeSeen', 'true');
      setIsVisible(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('themeWelcomeSeen', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative p-6 border-b border-dark-600/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <MdAutoAwesome className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Perfect Themes</h2>
                <p className="text-dark-400">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 rounded-lg hover:bg-dark-700/50 transition-colors duration-200"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="mb-4">
              {steps[currentStep].icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{steps[currentStep].title}</h3>
            <p className="text-dark-400">{steps[currentStep].description}</p>
          </div>

          {/* Theme Selection (Step 2) */}
          {currentStep === 1 && (
            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTheme(key);
                      changeTheme(key);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedTheme === key
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 hover:border-primary-400/50 bg-dark-700/30'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">{theme.icon}</span>
                      <div className="text-sm font-medium">{theme.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-primary-500' : 'bg-dark-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 py-3 px-4 bg-dark-600 hover:bg-dark-500 text-white rounded-lg transition-colors duration-200"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-xl" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-secondary-500/20 to-primary-500/20 rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default ThemeWelcome; 