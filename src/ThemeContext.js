// ============================================================
//  ThemeContext — Dark / Light theme toggle
//  Stitch Design Systems:
//    Dark:  "Aetheric Grid"   (#060a16 base, neon accents)
//    Light: "Elegant Sentinel" (#f8f9fd base, indigo accents)
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

// ── Token maps ────────────────────────────────────────────────
export const themes = {
  dark: {
    id: 'dark',
    label: 'Dark',
    // Core surfaces — Aether Glass / Digital Observatory
    bg:             '#0b1326',
    surface:        '#131b2e',
    surfaceMid:     '#171f33',
    surfaceHigh:    '#222a3d',
    surfaceFloat:   '#2d3449',
    surfaceTop:     '#31394d',
    // Text
    textPrimary:    '#dae2fd',
    textSecondary:  '#bec8d2',
    textMuted:      '#88929b',
    textFaint:      '#3e4850',
    // Accents — sky blue primary, teal secondary, indigo tertiary
    primary:        '#0ea5e9',
    primaryLight:   '#89ceff',
    secondary:      '#06b6d4',
    secondaryLight: '#4cd7f6',
    tertiary:       '#6366f1',
    tertiaryLight:  '#c0c1ff',
    success:        '#10b981',
    successLight:   '#34d399',
    warning:        '#f59e0b',
    danger:         '#f43f5e',
    // Borders — ghost borders only
    border:         'rgba(62,72,80,0.6)',
    borderHover:    'rgba(137,206,255,0.25)',
    // Sidebar
    sidebarBg:      '#0b1326',
    sidebarBorder:  'rgba(62,72,80,0.5)',
    sidebarActive:  'rgba(14,165,233,0.12)',
    sidebarHover:   'rgba(14,165,233,0.06)',
    // Topbar
    topbarBg:       'rgba(11,19,38,0.85)',
    topbarBorder:   'rgba(62,72,80,0.5)',
    // Card — glassmorphism
    cardBg:         'rgba(23,31,51,0.75)',
    cardShadow:     '0 8px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
    cardShadowHover:'0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(14,165,233,0.1)',
    // Input
    inputBg:        'rgba(34,42,61,0.8)',
    inputBorder:    'rgba(137,206,255,0.1)',
    // Fonts
    fontHeading:    "'Plus Jakarta Sans', sans-serif",
    fontBody:       "'Plus Jakarta Sans', sans-serif",
    fontMono:       "'JetBrains Mono', monospace",
  },
  light: {
    id: 'light',
    label: 'Light',
    // Core surfaces — Crisp Clean White Backgrounds & Cards
    bg:             '#f8fafc',
    surface:        '#ffffff',
    surfaceMid:     '#f1f5f9',
    surfaceHigh:    '#ffffff',
    surfaceFloat:   '#ffffff',
    surfaceTop:     '#f8fafc',
    // Text — Dark Slate & Deep Navy for high contrast & crisp readability
    textPrimary:    '#0f172a',
    textSecondary:  '#334155',
    textMuted:      '#64748b',
    textFaint:      '#94a3b8',
    // Accents — Vibrant Indigo & Royal Blue
    primary:        '#4f46e5',
    primaryLight:   '#6366f1',
    secondary:      '#0284c7',
    tertiary:       '#f59e0b',
    warning:        '#f59e0b',
    danger:         '#ef4444',
    success:        '#10b981',
    // Borders — Soft clean borders
    border:         'rgba(226, 232, 240, 0.85)',
    borderHover:    'rgba(99, 102, 241, 0.3)',
    // Sidebar
    sidebarBg:      '#ffffff',
    sidebarBorder:  'rgba(226, 232, 240, 0.85)',
    sidebarActive:  'rgba(99, 102, 241, 0.08)',
    sidebarHover:   'rgba(99, 102, 241, 0.04)',
    // Topbar
    topbarBg:       'rgba(255, 255, 255, 0.95)',
    topbarBorder:   'rgba(226, 232, 240, 0.85)',
    // Card — Crisp White Cards with soft subtle shadow
    cardBg:         '#ffffff',
    cardShadow:     '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
    cardShadowHover:'0 12px 30px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
    // Input
    inputBg:        '#ffffff',
    inputBorder:    '#cbd5e1',
    // Fonts
    fontHeading:    "'Plus Jakarta Sans', sans-serif",
    fontBody:       "'Plus Jakarta Sans', sans-serif",
    fontMono:       "'JetBrains Mono', monospace",
  },
};

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('cs-theme') || 'light';
  });

  const theme = themes[themeId];

  const toggle = () => {
    setThemeId(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cs-theme', next);
      return next;
    });
  };

  // Apply CSS vars to :root so plain CSS can use them too
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeId);
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--surface', theme.surface);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--card-bg', theme.cardBg);
    root.style.setProperty('--card-shadow', theme.cardShadow);
    root.style.setProperty('--sidebar-bg', theme.sidebarBg);
    root.style.setProperty('--topbar-bg', theme.topbarBg);
  }, [themeId, theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeId, toggle, isDark: themeId === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
