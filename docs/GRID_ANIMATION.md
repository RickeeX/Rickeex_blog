# Grid Background Animation Documentation

## Overview

This document explains the GridBackground component and how to switch between different versions.

## Components

### 1. GridBackground (Animated)

- **Location**: `components/GridBackground.tsx`
- **Features**:
  - Animated grid lines that grow on page load
  - "Rain drops" effect - vertical beams that scan down the screen
  - Ambient radial gradient lighting
  - Responsive probability-based rain distribution (more rain at screen edges)

### 2. GridBackgroundMinimal (Static)

- **Location**: `components/GridBackgroundMinimal.tsx`
- **Features**:
  - Static grid structure only
  - No CSS animations
  - No JavaScript animation logic
  - Ambient radial gradient lighting
  - Lower performance overhead

## Configuration

Edit `data/siteMetadata.js` to switch between versions:

```js
gridBackground: 'animated' // 'animated' | 'minimal' | 'none'
```

- `'animated'` - Full animated version with rain drops
- `'minimal'` - Static grid without animations
- `'none'` - No grid background

## CSS Animations

The animated version uses the following keyframes defined in `css/tailwind.css`:

### line-grow

Vertical lines grow from top to bottom on page load.

```css
@keyframes line-grow {
  0% {
    height: 0%;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    height: 100%;
    opacity: 1;
  }
}
```

### beam-scan

Rain drops scan from top to bottom of screen.

```css
@keyframes beam-scan {
  0% {
    top: -20%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 120%;
    opacity: 0;
  }
}
```

### grid-line-horizontal

Horizontal lines expand from left to right on page load.

```css
@keyframes grid-line-horizontal {
  0% { width: 0%; opacity: 0; }
  60% { opacity: 0. 100% {8; }
  width: 100%; opacity: 1; }
}
```

## Animation Logic (JavaScript)

The animated version (`GridBackground.tsx`) includes:

1. **Grid Generation**: Creates vertical and horizontal lines based on viewport size
2. **Rain Drop Probability**: Decides which lines get rain drops based on position:
   - `PROB_MOBILE`: 0% (no rain on mobile)
   - `PROB_CENTER`: 2% (very few in center text area)
   - `PROB_MEDIUM`: 8% (moderate in middle zone)
   - `PROB_OUTER`: 18% (most at screen edges)

3. **Animation Timing**:
   - Random delay: 0-5 seconds
   - Random duration: 3-7 seconds
   - Infinite loop for rain drops

## Switching Versions

1. Edit `data/siteMetadata.js`
2. Change `gridBackground` value
3. Restart dev server if needed

```js
// For performance-conscious users
gridBackground: 'minimal'

// For full visual effect
gridBackground: 'animated'

// To disable grid entirely
gridBackground: 'none'
```
