# ResumeIQ UI/UX Design Implementation Guide

## Quick Start for Developers

### 1. **Using the New Design System**

#### Import Component Styles
```javascript
import { buttonStyles, cardStyles, badgeStyles } from '../styles/componentStyles';

// Use in your components
<button style={buttonStyles.primary}>Click Me</button>
<div style={cardStyles.base}>Content</div>
```

#### CSS Variables
```css
/* All colors, spacing, typography available as variables */
background: var(--paper);
color: var(--ink);
padding: var(--space-lg);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-md);
font-size: var(--text-base);
```

### 2. **Layout Patterns**

#### Container with Max Width
```javascript
style={{
  maxWidth: '1400px',
  margin: '0 auto',
  padding: 'var(--space-xl)',
}}
```

#### Responsive Grid
```javascript
style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 'var(--space-xl)',
}}
```

#### Flexbox Row
```javascript
style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--space-lg)',
}}
```

### 3. **Animation Usage**

#### Staggered Entrance
```javascript
{items.map((item, idx) => (
  <div
    key={idx}
    style={{
      animation: `fadeUp 0.5s ${idx * 0.1}s ease both`,
    }}
  >
    {item}
  </div>
))}
```

### 4. **Dark Mode Support**

Automatic with CSS variables - just use:
```javascript
style={{
  background: 'var(--paper)', // Changes based on theme
  color: 'var(--ink)',
}}
```

### 5. **Responsive Design**

Use these breakpoints:
```css
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px)  { /* Mobile landscape */ }
@media (max-width: 640px)  { /* Mobile */ }
```

---

## Component Examples

### Primary Button
```javascript
<button style={{
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-sm)',
  padding: 'var(--space-md) var(--space-xl)',
  borderRadius: 'var(--radius-lg)',
  border: 'none',
  background: 'linear-gradient(135deg, #d946ef 0%, #a3185f 100%)',
  color: 'white',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 8px 32px rgba(217, 70, 239, 0.4)',
  transition: 'all var(--transition-base) ease',
}}>
  <Icon size={18} />
  Action
  <ArrowRight size={16} />
</button>
```

### Input Field
```javascript
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
    Label
  </label>
  <input
    style={{
      width: '100%',
      padding: 'var(--space-md) var(--space-lg)',
      fontSize: 'var(--text-base)',
      borderRadius: 'var(--radius-lg)',
      border: '1.5px solid var(--border-strong)',
      background: 'var(--paper-card)',
      color: 'var(--ink)',
      fontFamily: 'inherit',
      transition: 'all var(--transition-base) ease',
    }}
  />
</div>
```

### Card Component
```javascript
<div style={{
  background: 'var(--paper-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-xl)',
  boxShadow: 'var(--shadow-sm)',
  transition: 'all var(--transition-base) ease',
}}>
  {content}
</div>
```

### Alert/Toast
```javascript
<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-md)',
  background: 'var(--success-light)',
  border: '1px solid var(--success)',
  color: 'var(--success)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-lg)',
  animation: 'slideInLeft 0.3s ease',
}}>
  <CheckCircle size={20} strokeWidth={2} />
  Success message
</div>
```

---

## Color Reference

### Status Colors
- **Success**: `var(--success)` #10b981
- **Warning**: `var(--warning)` #f59e0b
- **Error**: `var(--error)` #ef4444
- **Info**: `var(--info)` #3b82f6

### Text Colors
- **Primary Text**: `var(--ink)`
- **Muted Text**: `var(--ink-muted)`
- **Faint Text**: `var(--ink-faint)`

### Background Colors
- **Page Bg**: `var(--paper)`
- **Card Bg**: `var(--paper-card)`
- **Warm Bg**: `var(--paper-warm)`

---

## Spacing Scale

```
var(--space-xs):   4px
var(--space-sm):   8px
var(--space-md):   12px
var(--space-lg):   16px
var(--space-xl):   24px (responsive: 16px on mobile)
var(--space-2xl):  32px
var(--space-3xl):  48px
```

---

## Typography Scale

```
var(--text-xs):   12px (smallest)
var(--text-sm):   14px
var(--text-base): 16px (default)
var(--text-lg):   18px
var(--text-xl):   20px
var(--text-2xl):  24px
var(--text-3xl):  32px
var(--text-4xl):  40px (largest)
```

---

## Border Radius Scale

```
var(--radius-xs):  4px   (tiny)
var(--radius-sm):  6px   (small)
var(--radius):     12px  (medium/default)
var(--radius-lg):  16px  (large)
var(--radius-xl):  20px  (extra large)
```

---

## Shadow Depth

```
var(--shadow-xs):  0 1px 2px
var(--shadow-sm):  0 1px 3px (buttons, cards)
var(--shadow-md):  0 4px 16px (elevated cards)
var(--shadow-lg):  0 12px 40px (modals, dropdowns)
var(--shadow-xl):  0 20px 50px (maximum depth)
```

---

## Transition Speeds

```
var(--transition-fast):  150ms  (hover, quick feedback)
var(--transition-base):  250ms  (form interactions)
var(--transition-slow):  350ms  (page transitions)

Example: transition: all var(--transition-base) ease;
```

---

## Animation Keyframes

### Entrance
- `fadeUp`: Fade in while moving up 20px
- `fadeIn`: Fade in without movement
- `slideInLeft`: Slide in from left
- `slideInRight`: Slide in from right
- `scaleIn`: Scale from 95% to 100%

### Continuous
- `spin`: 360° rotation (loading)
- `pulse`: Opacity pulse (attention)
- `bounce`: Vertical bounce

### Usage
```javascript
animation: 'fadeUp 0.5s ease forwards'
animation: 'spin 1s linear infinite'
animation: 'fadeUp 0.5s 0.3s ease both' // with delay
```

---

## Best Practices

### Do's ✅
- Use CSS variables for all styling
- Maintain consistent spacing (multiples of 8px)
- Use semantic color names
- Apply transitions and animations sparingly
- Test responsive behavior on mobile
- Maintain 4.5:1 color contrast
- Use proper heading hierarchy

### Don'ts ❌
- Don't hardcode colors
- Don't use arbitrary pixel values
- Don't skip focus/hover states
- Don't animate rapidly (>400ms)
- Don't use transition on transforms alone
- Don't forget dark mode compatibility
- Don't make small buttons (< 44px)

---

## Mobile-First Approach

1. **Start with mobile layout** (single column)
2. **Add features at breakpoints**:
   - 640px: Landscape mobile
   - 768px: Tablet
   - 1024px+: Desktop full features

```javascript
// Media query pattern
@media (min-width: 768px) {
  // Tablet styles
}
```

---

## Accessibility Checklist

- [ ] Color not sole indicator (use icons + labels)
- [ ] Min 4.5:1 contrast for text
- [ ] Touch targets ≥ 44x44px
- [ ] Keyboard navigable
- [ ] ARIA labels for icons
- [ ] Focus rings visible
- [ ] Semantic HTML elements
- [ ] Animations respectable on prefers-reduced-motion

---

## Performance Tips

1. **Animations**: Use `transform` and `opacity` only
2. **Shadows**: Use single `box-shadow`, not multiple
3. **GPU Acceleration**: Add `will-change: transform` sparingly
4. **Rendering**: Avoid layout shifts during loading
5. **Colors**: Use CSS variables instead of calculating

---

## Resources

- **Design System**: See `DESIGN_SYSTEM.md`
- **Component Styles**: `styles/componentStyles.js`
- **Global CSS**: `index.css`
- **Header Component**: `components/Header.jsx`

---

**Last Updated**: March 2026
