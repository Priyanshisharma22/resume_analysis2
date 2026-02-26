import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../utils/useDarkMode';

export default function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '1px solid var(--border-strong)',
        background: 'var(--paper-warm)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
    >
      {isDark
        ? <Sun size={18} color="var(--gold)" />
        : <Moon size={18} color="var(--ink-muted)" />
      }
    </button>
  );
}