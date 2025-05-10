
import { COLOR_THEMES, ColorTheme } from "@/components/settings/ColorPalette";

// Apply theme to CSS variables
export const applyTheme = (themeId: string): void => {
  const theme = COLOR_THEMES.find((t) => t.id === themeId);
  if (!theme) return;

  const root = document.documentElement;
  
  // Apply primary color
  root.style.setProperty('--primary', theme.colors.primary);
  
  // Apply secondary color
  root.style.setProperty('--secondary', theme.colors.secondary);
  
  // Apply accent color
  root.style.setProperty('--accent', theme.colors.accent);
  
  // Apply background color (only for dark theme)
  if (theme.id === 'dark') {
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--card', '240 10% 8%');
    root.style.setProperty('--popover', '240 10% 8%');
    root.style.setProperty('--muted', '240 5% 20%');
    root.style.setProperty('--foreground', '0 0% 95%');
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
    root.style.setProperty('--background', '0 0% 100%');
    root.style.setProperty('--card', '0 0% 100%');
    root.style.setProperty('--popover', '0 0% 100%');
    root.style.setProperty('--muted', '210 40% 96.1%');
    root.style.setProperty('--foreground', '222.2 84% 4.9%');
  }
  
  // Save selected theme to localStorage for persistence
  localStorage.setItem('selected-theme', themeId);
};

// Initialize theme from localStorage or default
export const initializeTheme = (): string => {
  const savedTheme = localStorage.getItem('selected-theme') || 'purple';
  applyTheme(savedTheme);
  return savedTheme;
};

// Get theme by ID
export const getThemeById = (themeId: string): ColorTheme | undefined => {
  return COLOR_THEMES.find((t) => t.id === themeId);
};
