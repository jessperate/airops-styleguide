# AirOps Brand System — Claude Code Reference

The full interactive style guide lives at `docs/style-guide/airops-style-guide.html`.
Open it in a browser for live rendered examples of every token, component, and pattern below.

---

## Fonts

| Role | Family | Weight |
|------|--------|--------|
| Headlines (editorial) | Serrif VF-TRIAL | 400 |
| UI / body | Saans | 400–500 |
| Labels, tags, eyebrows, code | Saans Mono / DM Mono | 500 |

```css
--font-serif: 'Serrif VF-TRIAL', Georgia, serif;
--font-sans:  'Saans', 'Helvetica Neue', sans-serif;
--font-mono:  'Saans Mono', 'DM Mono', monospace;
```

---

## Type Stack

| Role | Font | Size | Tracking | Line-height |
|------|------|------|----------|-------------|
| Large Headline | Serrif VF | 96px | −0.02em | 1.0 |
| Headline 5 (serif) | Serrif VF | 40px | −0.02em | 1.04 |
| Large Body | Saans | 24px | +0.02em | 1.3 |
| Body | Saans | 16px | −0.02em | 1.4 |
| Eyebrow / Small Text | Saans Mono Medium | 14px | 0.06em | 1.3 |

H2 pattern: **Line 1 = Serrif VF serif · Line 2 = Saans sans** — both at 72px, tracking −0.03em, line-height 1.

Eyebrows are always ALL CAPS, color `#057a28`.

---

## Color — Core Palette

```css
:root {
  /* Brand Greens */
  --ao-near-black:    #000d05;   /* deep bg, rich text */
  --ao-forest:        #002910;   /* hero, sidebar, dark sections */
  --ao-mid-green:     #008c44;   /* links, labels on light */
  --ao-interaction:   #00ff64;   /* CTAs — use sparingly, one per section */
  --ao-super-light:   #CCFFE0;   /* hover states, section fills */
  --ao-green-100:     #dfeae3;   /* muted backgrounds */
  --ao-off-white:     #F8FFFA;   /* page bg, card fills */
  --ao-white:         #ffffff;

  /* Special */
  --ao-label-yellow:  #EEFF8C;   /* pill labels only */
  --ao-stroke:        #d4e8da;   /* brand borders */

  /* UI Text */
  --ao-text-primary:   #09090b;
  --ao-text-secondary: #676c79;
  --ao-text-tertiary:  #a5aab6;
}
```

---

## Color — Web Palette (expressive, lower frequency)

Monochromatic modes only — **never mix columns**. Each column is a self-contained scale.

| Column | Light | Mid | Dark |
|--------|-------|-----|------|
| Pink | #fff7ff · #fee7fd | #c54b9b | #3a092c · #0d020a |
| Indigo | #f5f6ff · #e5e5ff | #1b1b8f | #0f0f57 |
| Red | #fff0f0 · #ffe2e2 | #802828 | #331010 |
| Yellow | #fdfff3 · #eeff8c | #586605 | #242603 |
| Purple | #f8f7ff · #ddd3f2 | #5a3480 | #2a084d |
| Teal | #f2fcff · #c9ebf2 | #196c80 | #0a3945 |

---

## Buttons

All buttons use Saans Medium, no letter-spacing.

```css
/* Primary — pill shape */
.btn-primary {
  background: #00ff64;
  color: #002910;
  border-radius: 58px;
  padding: 16px;
  font-size: 20px;
}
.btn-primary:hover { background: #00cc50; }

/* Secondary — sharp corners, light bg */
.btn-secondary {
  background: #eef9f3;
  color: #002910;
  border-radius: 0;
  padding: 16px;
  font-size: 20px;
}
.btn-secondary:hover { background: #ccffe0; }

/* Secondary on dark bg */
.btn-secondary-dark {
  background: rgba(0,0,0,0.3);
  color: #f8fffa;
}
.btn-secondary-dark:hover { background: rgba(0,0,0,0.2); }

/* Back button */
.btn-back { background: #fee7fd; color: #3a092c; }

/* Text button */
.btn-text { background: transparent; color: #01200d; font-size: 18px; padding: 0; }

/* Small button — mono */
.btn-small {
  background: #fee7fd;
  color: #3a092c;
  font-family: 'Saans Mono', monospace;
  font-size: 13px;
  text-transform: uppercase;
  border-radius: 8px;
  padding: 8px;
}
```

---

## Pills / Tags

Saans Mono Medium, ALL CAPS, always. Never rounded more than 5px.

```css
.pill {
  font-family: 'Saans Mono', 'DM Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;   /* 0.84px */
  line-height: 1.3;
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 5px;
}

/* Color variants */
.pill-green-light { background: #eef9f3;  border-color: #057a28; color: #002910; }
.pill-green       { background: #dfeae3;  border-color: #008c44; color: #002910; }
.pill-indigo      { background: #e5e5ff;  border-color: #1b1b8f; color: #0f0f57; }
.pill-pink        { background: #fee7fd;  border-color: #c54b9b; color: #3a092c; }
.pill-dark        { background: #000d05;  border-color: transparent; color: #00ff64; }
.pill-yellow      { background: #EEFF8C;  border-color: #d4e87a; color: #000d05; }
```

---

## Container Styles

Four surface types. All share the same content structure:
**mono pill eyebrow → H2 (serif line 1 + sans line 2) → body copy → buttons**

| Style | Background | Text | Pill |
|-------|-----------|------|------|
| Light | #ffffff | #002910 | bg #eef9f3 / border+text #057a28 |
| Canvas | #ffffff + dot grid `radial-gradient(#d4e8da 1px, transparent 1px) 24px` | #002910 | same as Light |
| Dark | #00250e + double inset border `1px solid #057a28` | #f8fffa | bg #001d0b / border+text #c0ffd2 |
| Special (Indigo) | #1b1b8f | #f8fffa | bg #0f0f57 / border+text #d0d0ff |

Dark and Special secondary buttons: `rgba(0,0,0,0.3)` bg, `#f8fffa` text.

---

## Data Visualization Rules

**Always:**
- Sharp corners — no border-radius on bars, containers, or chart frames
- Outer border: `1px solid #009b32`
- Axes and grid lines: DM Mono Regular, `#a9a9a9`
- Value callouts above bars: Saans / DM Mono Medium, `#002910`
- AirOps Research logo: `position:absolute; bottom:-1px; right:-1px` on a `position:relative` parent
- Logo box: `border:1px solid #009b32; background:#fff; padding:6px 12px`

**Never:**
- Rounded bars
- Drop shadows on chart elements
- Gradients on fills
- Mixing chart palette with web palette

### Chart palette

| Token | Hex | Use |
|-------|-----|-----|
| Primary bar fill | `#ccffe0` | Standard bars |
| Highlight bar | `#eeff8c` | Single accent bar per chart |
| Primary line | `#009b32` | Main data line |
| Projection line | `#009b32` + `stroke-dasharray:4,3` | Forecast / extrapolation |
| Dark bg | `#00250e` | Dark panel charts |
| Axis / grid | `#a9a9a9` | All axes, grid lines |

### Chart types

1. **Table infographic** — two columns (label col 160–210px), alternating #fff/#f8fffb rows, #009b32 column header
2. **Numbered list** — serif large number in #009b32, rows alternate white/#f8fffb
3. **Equation / stacked blocks** — white bordered boxes, circle connectors (+ / =), result row #009b32 fill white text
4. **Line chart** — 2px solid `#009b32`, dashed projection, dot `#001408`, callout box white with `1px #009b32`
5. **Bar chart (vertical)** — `#ccffe0` fill, `0.8px #002910` border, accent bar `#eeff8c`
6. **Stacked bar** — fills: `#ccffe0` / `#009b32` / `#001408`, callout lines `0.8px #009b32`
7. **Pie chart** — segments `#ccffe0` / `#009b32`, dashed callout lines `stroke-dasharray:3,2`
8. **Split layout** — light stat panel (#f8fffb) + dark chart panel (#00250e), bars in `#ccffe0`

---

## Logo Usage

**AirOps logo** — use on light backgrounds. On dark, invert paths to `#f8fffa`.

**AirOps Research logo** — always bordered, flush bottom-right corner on data viz. SVG has no built-in stroke — border comes from parent CSS only.

Logo box pattern:
```css
position: absolute;
bottom: -1px;
right: -1px;
border: 1px solid #009b32;
background: #fff;
padding: 6px 12px;
display: flex;
align-items: center;
```

---

## Key Don'ts

- No em dashes (`—`) in copy — use spaced hyphens or restructure the sentence
- No rounded corners on buttons except primary (58px) and small (8px)
- No purple/blue gradient AI aesthetics
- No drop shadows
- No mixing web palette columns (e.g. pink + indigo)
- Eyebrow tags never lowercase
- Bar charts never have rounded tops
