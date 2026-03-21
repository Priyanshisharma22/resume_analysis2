import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../utils/useDarkMode';

export default function DarkModeToggle({ showLabel = false }) {
  const { isDark, toggle } = useDarkMode();
  const [animating, setAnimating] = useState(false);

  const handleToggle = () => {
    setAnimating(true);
    toggle();
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <>
      <style>{`
        .dmt-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: ${showLabel ? '8px 14px 8px 10px' : '0'};
          width: ${showLabel ? 'auto' : '40px'};
          height: 40px;
          justify-content: center;
          border-radius: 100px;
          border: 1px solid var(--border-strong, rgba(255,255,255,0.12));
          background: var(--paper-warm, rgba(255,255,255,0.05));
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .dmt-btn:hover {
          background: var(--paper-card, rgba(255,255,255,0.08));
          border-color: var(--border, rgba(255,255,255,0.18));
          transform: scale(1.05);
        }

        .dmt-btn:active { transform: scale(0.95); }

        /* Ripple on click */
        .dmt-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: var(--ripple-color, rgba(255,200,50,0.15));
          opacity: 0;
          transform: scale(0.5);
          transition: opacity 0.3s, transform 0.3s;
          pointer-events: none;
        }
        .dmt-btn.animating::after {
          opacity: 1;
          transform: scale(1);
        }

        /* Icon wrapper — spins on toggle */
        .dmt-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
        }
        .dmt-btn.animating .dmt-icon {
          transform: rotate(30deg) scale(0.8);
          opacity: 0.7;
        }

        .dmt-label {
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: var(--ink-muted, #94a3b8);
          white-space: nowrap;
          transition: color 0.2s;
        }
        .dmt-btn:hover .dmt-label { color: var(--ink, #e2e8f0); }
      `}</style>

      <button
        className={`dmt-btn${animating ? ' animating' : ''}`}
        onClick={handleToggle}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{ '--ripple-color': isDark ? 'rgba(255,200,50,0.15)' : 'rgba(99,102,241,0.15)' }}
      >
        <span className="dmt-icon">
          {isDark
            ? <Sun size={18} color="var(--gold, #fbbf24)" strokeWidth={1.8} />
            : <Moon size={18} color="var(--ink-muted, #94a3b8)" strokeWidth={1.8} />
          }
        </span>

        {showLabel && (
          <span className="dmt-label">
            {isDark ? 'Light mode' : 'Dark mode'}
          </span>
        )}
      </button>
    </>
  );
}