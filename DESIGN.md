---
name: 水印 · Arc
description: Neutral, image-first controls for a local watermark workspace.
colors:
  background: "oklch(100% 0 0)"
  surface: "oklch(100% 0 0)"
  surface-muted: "oklch(97.8% 0 0)"
  foreground: "oklch(15% 0 0)"
  text-secondary: "oklch(46% 0 0)"
  border: "oklch(93.5% 0 0)"
  border-strong: "oklch(82% 0 0)"
  accent: "oklch(33% 0 0)"
  accent-subtle: "oklch(33% 0 0 / .1)"
  control-on: "oklch(23% 0 0)"
  dark-background: "oklch(19% 0 0)"
  dark-surface: "oklch(21.5% 0 0)"
  dark-surface-muted: "oklch(26% 0 0)"
  dark-foreground: "oklch(96% 0 0)"
  dark-text-secondary: "oklch(77% 0 0)"
  dark-border: "oklch(29% 0 0)"
  dark-border-strong: "oklch(40% 0 0)"
  dark-accent: "oklch(80% 0 0)"
  dark-accent-subtle: "oklch(80% 0 0 / .13)"
  dark-control-on: "oklch(93% 0 0)"
typography:
  display:
    fontFamily: '"Geist Variable", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontWeight: 500
    letterSpacing: "-.03em"
    lineHeight: 1.3
  title:
    fontFamily: '"Inter Variable", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: "1rem"
    fontWeight: 500
  body:
    fontFamily: '"Inter Variable", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: ".875rem"
    lineHeight: 1.5
  label:
    fontFamily: '"Inter Variable", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: ".875rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontSize: ".75rem"
rounded:
  control: "1.125rem"
  panel: "1.625rem"
  pill: "9999px"
spacing:
  space-1: ".25rem"
  space-2: ".5rem"
  space-3: ".75rem"
  space-4: "1rem"
  space-5: "1.25rem"
  space-6: "1.5rem"
  space-8: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "0 .75rem"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
---

# Design System: 水印 · Arc

## Overview

**Creative North Star: "本地图片水印工作台"**

Arc's neutral workspace keeps the user's image as the visual focus. Quiet surfaces, rounded controls, and compact Chinese labels connect immediate preview feedback with precise editing.

The shared identity is restrained and tactile: soft corners, thin boundaries, and moving selection highlights. The existing logo remains the identity asset; the interface uses self-hosted type with Chinese system fallbacks.

**Key Characteristics:**

- Neutral light and dark themes.
- Rounded controls with clear selected states.
- Image-led workspace and compact supporting typography.
- Responsive controls with reduced-motion support.

Evidence: `src/components/arc/foundation.css`, Arc component modules, `src/index.css`, `src/App.tsx`, `src/main.tsx`, and `tailwind.config.js`. Recorded after the Arc refactor; the direction contract supplies the user-chosen world, while shipped source supplies the values.

## Colors

The palette is achromatic; image content and functional feedback supply color.

### Primary

- **Ink action:** primary buttons use foreground over background, reversing automatically in the dark theme.
- **Neutral selection:** accent-subtle marks active image rows; control-on fills selected switches, checkboxes, and position controls.

### Neutral

- **Canvas and panel:** background and surface separate the page from contained tools; surface-muted defines the editing well and hover states.
- **Reading hierarchy:** foreground carries labels; text-secondary carries metadata and hints. The application maps muted text to text-secondary for legibility.
- **Boundaries:** border separates structural regions; border-strong makes editable fields legible.
- Dark-prefixed frontmatter entries document the corresponding semantic overrides under `data-theme="dark"`; components keep using the unprefixed CSS variables.

**The Semantic Surface Rule.** Use the current theme's semantic variables for application chrome; watermark colors belong to user content.

## Typography

**Display Font:** Geist Variable with PingFang SC, Microsoft YaHei, and sans-serif fallbacks.
**Body Font:** Inter Variable with the same Chinese fallbacks. Both Latin families are imported locally through Fontsource.

### Hierarchy

- Display uses medium weight, tight tracking, and balanced wrapping. The landing headline steps from the source's text-4xl to text-3xl below desktop widths; these headline sizes are surface-specific rather than a general heading prescription.
- Titles use the base size; settings headings and controls use the body size at medium weight.
- Captions support filenames, dimensions, hints, and counts. Numeric metadata uses tabular figures.
- Text fields grow to the base size below 768px. Supporting copy uses more generous leading than control labels.

**The Stable Label Rule.** Selection changes color and highlight position without changing segmented-control label weight or scale.

## Layout

The recurring rhythm is a quarter-rem grid, most often 8–24px. Tool sections use consistent padding and thin dividers, while previews retain flexible space.

The current landing page has a centered maximum width of 1328px and two columns, stacking below 768px. The editor changes structure at 1024px: desktop places the image list, flexible preview, and inspector side by side; smaller screens use a sticky preview, flowing settings, image drawer, and bottom export bar with safe-area padding. At 1024–1279px the sidebar and inspector narrow to preserve preview room. These are observed surface compositions, not mandatory grids for future pages.

Buttons and text inputs ordinarily have a 44px minimum height; icon actions and overlay close controls have 44px targets. Arc segmented options retain the library's 36px internal minimum within a padded group. Keep content labels and counts separate inside their action, with room for truncation in adjacent filenames.

## Elevation & Depth

Tonal surfaces and borders establish most depth. Resting shadows support selected segments and hovered buttons; the floating shadow lifts preview tools and overlays. Ordinary editor panels remain flat (the Tailwind card shadow maps to none). Mobile fixed bars add translucent surfaces and blur to distinguish them from scrolling content.

**The Functional Depth Rule.** Use depth to distinguish floating controls and overlays from the editing surface; preserve the flat treatment of ordinary tool panels.

Exact theme-aware shadow and motion values live in the sidecar and source. Arc uses short color transitions and spring-based selection movement; the application honors reduced-motion preferences through CSS and MotionConfig.

## Shapes

Controls use generous rounded corners; preview and inspector panels use the larger panel radius. Pills belong to circular marks and compact continuous tracks. The import target uses Arc's surface radius and a dashed perimeter, while selection controls have their own component geometry. Do not flatten these native distinctions into one universal radius.

## Components

### Buttons

Primary, outlined secondary, and ghost actions share the same control shape and medium labels. Primary hover lowers opacity and adds the resting shadow; secondary hover fills the muted surface; ghost hover strengthens text and adds a muted fill. Press feedback remains visible on touch. Disabled styles preserve outlined button boundaries. Theme toggling uses the official Arc Button adapter, matching other icon actions.

### Inputs / Fields

Strong borders define editable fields, with foreground borders on focus and danger borders for invalid input. Text-field focus changes the border without resizing the control. Other keyboard-focusable controls receive the foundation's visible outline (2px with 2px offset by default).

### Cards / Containers

Preview and inspector containers use panel corners, a surface fill, and a thin border. Settings sections divide their contents with consistent spacing and separators rather than nested cards.

### Navigation and Selection

Image rows distinguish the active preview with an accent-subtle fill; independent checkboxes govern export selection. Filenames truncate and metadata stays secondary. The mobile drawer preserves these roles. Segmented controls use a muted group track and a surface-colored sliding highlight; sliders provide numeric feedback. Template actions are buttons, not decorative tags, and their disclosure includes a rotating chevron.

### Import and Overlays

The Arc file target's dashed edge closes on drag, with a subtle breathing response and paper illustration. These are native Arc interaction materials, not a reason to ban all decorative motion. Dialogs and drawers use shared surface and depth tokens. Their close-target adjustment is scoped to the overlay through `--space-8: var(--control-height-md)`; it does not redefine global spacing.

## Do's and Don'ts

### Do:

- **Do** reuse Arc primitives through the application adapters and semantic CSS variables.
- **Do** preserve keyboard focus, reduced-motion behavior, and readable Chinese fallbacks.
- **Do** keep primary actions, selected image state, and export selection visually distinct.

### Don't:

- **Don't** treat unused vendor accents, gradients, charts, or the installed ThemeSwitch as established application patterns.
- **Don't** turn preview transparency checks or user-selected watermark colors into interface decoration.
- **Don't** apply the overlay touch-target spacing override globally.

Not canonized: the functional preview checker and user watermark colors are content-specific; unused vendor variants and isolated layout values are not recurring rules. No identified craft-floor defect is promoted into this system. Browser-client hooks describe the SPA implementation, not a visual or SSR policy.
