import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'root');
  const [mapStyle, setMapStyle] = useState(
    theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'
    // theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'

  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setMapStyle(theme === 'dark' ? 'mapbox://styles/mapbox/navigation-night-v1' : 'mapbox://styles/mapbox/navigation-day-v1');

    if (theme === 'dark') {
      document.documentElement.style.setProperty('--friend-toggle-bg', '#1F2835');
      document.documentElement.style.setProperty('--friend-button-bg', '#263447');
      document.documentElement.style.setProperty('--friend-card-bg', '#1F2835');
      document.documentElement.style.setProperty('--heatmap-toggle-bg', '#1F2835');
    } else {
      document.documentElement.style.setProperty('--friend-toggle-bg', '');
      document.documentElement.style.setProperty('--friend-button-bg', '');
      document.documentElement.style.setProperty('--friend-card-bg', '');
      document.documentElement.style.setProperty('--heatmap-toggle-bg', '');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'root' ? 'dark' : 'root'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mapStyle }}>
      {children}
    </ThemeContext.Provider>
  );
};