// Button Styles
export const buttonStyles = {
  primary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-md) var(--space-xl)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    borderRadius: 'var(--radius-lg)',
    border: 'none',
    background: 'linear-gradient(135deg, #d946ef 0%, #a3185f 100%)',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(217, 70, 239, 0.3)',
    transition: 'all var(--transition-base) ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(217, 70, 239, 0.4)',
    },
  },

  secondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-md) var(--space-xl)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    borderRadius: 'var(--radius-lg)',
    border: '1.5px solid var(--border-strong)',
    background: 'var(--paper-card)',
    color: 'var(--ink)',
    cursor: 'pointer',
    transition: 'all var(--transition-base) ease',
    '&:hover': {
      borderColor: 'var(--ink-muted)',
      background: 'var(--paper-warm)',
      transform: 'translateY(-2px)',
    },
  },

  tertiary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm) var(--space-md)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    borderRadius: 'var(--radius)',
    border: 'none',
    background: 'transparent',
    color: 'var(--accent)',
    cursor: 'pointer',
    transition: 'all var(--transition-base) ease',
    '&:hover': {
      background: 'var(--paper-warm)',
    },
  },

  outline: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-md) var(--space-xl)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    borderRadius: 'var(--radius-lg)',
    border: '2px solid var(--accent)',
    background: 'transparent',
    color: 'var(--accent)',
    cursor: 'pointer',
    transition: 'all var(--transition-base) ease',
    '&:hover': {
      background: 'var(--accent)',
      color: 'white',
    },
  },

  small: {
    padding: 'var(--space-sm) var(--space-md)',
    fontSize: 'var(--text-xs)',
  },

  large: {
    padding: 'var(--space-lg) var(--space-2xl)',
    fontSize: 'var(--text-base)',
  },
};

// Card Styles
export const cardStyles = {
  base: {
    background: 'var(--paper-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-xl)',
    transition: 'all var(--transition-base) ease',
  },

  hover: {
    boxShadow: 'var(--shadow-md)',
    borderColor: 'var(--border-strong)',
  },

  interactive: {
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 'var(--shadow-lg)',
    },
  },

  flat: {
    background: 'var(--paper-warm)',
    border: 'none',
  },
};

// Input Styles
export const inputStyles = {
  base: {
    width: '100%',
    padding: 'var(--space-md) var(--space-lg)',
    fontSize: 'var(--text-sm)',
    borderRadius: 'var(--radius-lg)',
    border: '1.5px solid var(--border-strong)',
    background: 'var(--paper-card)',
    color: 'var(--ink)',
    fontFamily: 'inherit',
    transition: 'all var(--transition-base) ease',
  },

  focus: {
    borderColor: 'var(--accent)',
    boxShadow: '0 0 0 3px rgba(217, 70, 239, 0.1)',
    outline: 'none',
  },

  error: {
    borderColor: 'var(--error)',
    '&:focus': {
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    },
  },

  success: {
    borderColor: 'var(--success)',
    '&:focus': {
      boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
    },
  },
};

// Badge Styles
export const badgeStyles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    padding: '4px 12px',
    borderRadius: 100,
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },

  primary: {
    background: 'rgba(217, 70, 239, 0.1)',
    color: 'var(--accent)',
  },

  success: {
    background: 'var(--success-light)',
    color: 'var(--success)',
  },

  warning: {
    background: 'var(--warning-light)',
    color: 'var(--warning)',
  },

  error: {
    background: 'var(--error-light)',
    color: 'var(--error)',
  },

  info: {
    background: 'var(--info-light)',
    color: 'var(--info)',
  },
};

// Alert/Banner Styles
export const alertStyles = {
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-lg)',
    padding: 'var(--space-lg) var(--space-xl)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid',
    transition: 'all var(--transition-base) ease',
  },

  success: {
    background: 'var(--success-light)',
    borderColor: 'var(--success)',
    color: 'var(--success)',
  },

  warning: {
    background: 'var(--warning-light)',
    borderColor: 'var(--warning)',
    color: 'var(--warning)',
  },

  error: {
    background: 'var(--error-light)',
    borderColor: 'var(--error)',
    color: 'var(--error)',
  },

  info: {
    background: 'var(--info-light)',
    borderColor: 'var(--info)',
    color: 'var(--info)',
  },
};

// Progress Bar Styles
export const progressStyles = {
  container: {
    width: '100%',
    height: 8,
    borderRadius: 100,
    background: 'var(--paper-warm)',
    overflow: 'hidden',
  },

  bar: (value, color = 'var(--accent)') => ({
    height: '100%',
    width: `${value}%`,
    background: color,
    borderRadius: 100,
    transition: 'width var(--transition-slow) ease',
  }),
};

// Loading Spinner
export const spinnerStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-md)',
  },

  spinner: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '2px solid var(--border-strong)',
    borderTopColor: 'var(--accent)',
    animation: 'spin 1s linear infinite',
  },
};

// Layout Utilities
export const layout = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: 'var(--space-xl)',
  },

  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'var(--space-xl)',
  },

  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--space-xl)',
  },

  flex: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-lg)',
  },

  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Color utilities
export const colors = {
  accent: 'var(--accent)',
  accentDark: 'var(--accent-dark)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  info: 'var(--info)',
  ink: 'var(--ink)',
  inkMuted: 'var(--ink-muted)',
  inkFaint: 'var(--ink-faint)',
};
