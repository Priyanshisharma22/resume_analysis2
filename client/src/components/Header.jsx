import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import DarkModeToggle from '../utils/DarkModeToggle';

export default function Header({ showCTA = true }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Add scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home',    path: '/' },
    { label: 'Analyze', path: '/analyze' },
    { label: 'Tools',   path: '/ai-tools' },
  ];

  return (
    <>
      <style>{`
        .hdr-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 200;
          background: rgba(7, 7, 9, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .hdr-root.scrolled {
          box-shadow: 0 4px 32px rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.1);
        }

        .hdr-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          gap: 32px;
        }

        /* ── Logo ── */
        .hdr-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .hdr-logo:hover { opacity: 0.85; }
        .hdr-logo-box {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg,#7c3aed,#a78bfa);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(124,58,237,0.35);
        }
        .hdr-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800;
          color: #fafafa; letter-spacing: -0.03em;
        }

        /* ── Desktop nav links ── */
        .hdr-links {
          display: flex; align-items: center; gap: 4px;
          flex: 1; justify-content: center;
        }
        .hdr-link {
          font-size: 14px; font-weight: 500;
          color: #71717a; text-decoration: none;
          padding: 7px 14px; border-radius: 9px;
          transition: all 0.18s; position: relative;
          letter-spacing: 0.01em;
        }
        .hdr-link:hover { color: #e4e4e7; background: rgba(255,255,255,0.06); }
        .hdr-link.active {
          color: #fafafa; background: rgba(255,255,255,0.07);
        }
        .hdr-link.active::after {
          content: '';
          position: absolute; bottom: -1px; left: 25%; right: 25%;
          height: 2px; border-radius: 2px;
          background: linear-gradient(90deg,#7c3aed,#a78bfa);
        }

        /* ── Right section ── */
        .hdr-right {
          display: flex; align-items: center; gap: 12px; flex-shrink: 0;
        }

        /* ── CTA button ── */
        .hdr-cta {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 18px;
          background: linear-gradient(135deg,#7c3aed,#a78bfa);
          color: white; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          border-radius: 10px; text-decoration: none;
          transition: all 0.2s; white-space: nowrap;
          box-shadow: 0 4px 14px rgba(124,58,237,0.35);
          position: relative; overflow: hidden;
        }
        .hdr-cta::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 50%);
        }
        .hdr-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.45); }

        /* ── Mobile toggle ── */
        .hdr-mobile-btn {
          display: none;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #a1a1aa; cursor: pointer;
          padding: 8px; border-radius: 9px;
          align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .hdr-mobile-btn:hover { background: rgba(255,255,255,0.09); color: #fafafa; }

        /* ── Mobile nav drawer ── */
        .hdr-mobile-nav {
          display: none;
          flex-direction: column; gap: 4px;
          padding: 12px 20px 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(7,7,9,0.95);
          animation: hdr-slide 0.2s ease;
        }
        @keyframes hdr-slide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

        .hdr-mobile-link {
          font-size: 15px; font-weight: 500;
          color: #71717a; text-decoration: none;
          padding: 12px 14px; border-radius: 10px;
          transition: all 0.15s;
        }
        .hdr-mobile-link:hover { color: #fafafa; background: rgba(255,255,255,0.06); }
        .hdr-mobile-link.active { color: #a78bfa; background: rgba(124,58,237,0.1); }

        .hdr-mobile-cta {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 12px; margin-top: 8px;
          background: linear-gradient(135deg,#7c3aed,#a78bfa);
          color: white; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          border-radius: 11px; text-decoration: none;
          box-shadow: 0 4px 14px rgba(124,58,237,0.3);
        }

        /* ── Spacer so content isn't hidden behind fixed header ── */
        .hdr-spacer { height: 69px; }

        @media (max-width: 768px) {
          .hdr-links { display: none; }
          .hdr-cta   { display: none; }
          .hdr-mobile-btn { display: flex; }
          .hdr-mobile-nav.open { display: flex; }
          .hdr-spacer { height: 65px; }
        }
      `}</style>

      <header className={`hdr-root${scrolled ? ' scrolled' : ''}`}>
        <nav className="hdr-nav">

          {/* Logo */}
          <Link to="/" className="hdr-logo">
            <div className="hdr-logo-box">📊</div>
            <span className="hdr-logo-text">ResumeIQ</span>
          </Link>

          {/* Desktop links */}
          <div className="hdr-links">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`hdr-link${isActive(link.path) ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: dark mode + CTA */}
          <div className="hdr-right">
            <DarkModeToggle />
            {showCTA && (
              <Link to="/analyze" className="hdr-cta">
                Analyze Resume <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            )}
            <button
              className="hdr-mobile-btn"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        <div className={`hdr-mobile-nav${mobileOpen ? ' open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`hdr-mobile-link${isActive(link.path) ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {showCTA && (
            <Link to="/analyze" className="hdr-mobile-cta" onClick={() => setMobileOpen(false)}>
              Analyze Resume <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </header>

      {/* Push page content below fixed header */}
      <div className="hdr-spacer" />
    </>
  );
}