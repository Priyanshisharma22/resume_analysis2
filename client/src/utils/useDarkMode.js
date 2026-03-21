import { useState, useEffect, useCallback } from 'react';

// ─── Inline script — paste this in your index.html <head> BEFORE any CSS ───
// This prevents the flash of wrong theme (FOUC) on page load.
//
// <script>
//   (function() {
//     const t = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     if (t === 'dark' || (!t && prefersDark)) {
//       document.documentElement.setAttribute('data-theme', 'dark');
//     }
//   })();
// </script>
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'theme';

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved === 'dark';
  } catch (_) {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function applyTheme(isDark) {
  const root = document.documentElement;

  // Block CSS transitions for 1 frame so the swap is instant (no color flash)
  root.style.setProperty('--theme-transition', 'none');
  requestAnimationFrame(() => {
    root.style.removeProperty('--theme-transition');
  });

  if (isDark) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
  }

  try {
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  } catch (_) {}
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitialTheme);

  // Apply theme whenever isDark changes
  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  // Listen for OS-level theme changes (only if user hasn't manually set a preference)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;

    const handleSystemChange = (e) => {
      const hasManualPref = localStorage.getItem(STORAGE_KEY);
      if (!hasManualPref) {
        setIsDark(e.matches);
      }
    };

    mq.addEventListener('change', handleSystemChange);
    return () => mq.removeEventListener('change', handleSystemChange);
  }, []);

  const toggle = useCallback(() => setIsDark(prev => !prev), []);

  // Allow resetting to follow system preference
  const resetToSystem = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    setIsDark(window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
  }, []);

  return { isDark, toggle, resetToSystem };
}