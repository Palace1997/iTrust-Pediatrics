# itrust Pediatrics — "Playful" Version (Full Blueprint & Handoff)

> **Purpose of this file.** This is a self-contained spec for the **playful** version of the
> itrust Pediatrics website (the teleo.space-inspired redesign). It exists so this version can be
> continued in a **fresh chat** without confusion. If you're an assistant reading this: **only work
> inside the `playful-version/` folder.** Do not edit the live site or the other alternate version
> (see "Boundaries" below).

---

## 0. Boundaries — READ FIRST

This repo holds **three separate versions of the same site**. They must never be cross-edited:

| Version | Location | Status | Touch it? |
|---|---|---|---|
| **Live site** | project **root** (`../index.html`, `../styles.css`, etc.) | Deployed to GitHub Pages | ❌ Not in this task |
| **Playful version** | **`playful-version/`** | Local only, in progress | ✅ **This is the one** |
| **Future/techy version** | `future-version/` | Local only | ❌ Not in this task |
| Draft legal pages | root (`privacy.html`, `hipaa.html`, …) | Local drafts | ❌ Not in this task |

**Rule:** Every path you edit for this task must start with `playful-version/`. The playful version has
its **own** `styles.css`, `script.js`, and `assets/` copy — it shares nothing with the live site.

---

## 1. What this version is

A warm, rounded, **child-appealing** redesign of the itrust Pediatrics site, inspired by the visual
language of **teleo.space** (not its content). Same information as the live site; different look and feel:
soft cream backgrounds, arch/rainbow shapes, bobbing blobs, pill buttons, big friendly headlines, and
lots of subtle CSS motion. Built as a parallel folder so it never affects the live site.

- **Practice identity:** itrust Pediatrics — a **child & adolescent PSYCHIATRIC practice**
  (medication management / psychiatric care), **NOT a therapy clinic**.
- **Ages served:** **5–17**.
- **Scope:** behavioral & mental health only — anxiety, depression, ADHD/ADD, mood disorders,
  behavioral concerns, medication management, family-centered treatment. **No** physical/well-child
  care, vaccines, or sick visits.
- **Tone:** compassionate, family-centered, reassuring to parents.

Keep all copy consistent with this positioning (psychiatric, med management, ages 5–17).

---

## 2. Tech stack

- **Static HTML/CSS/JS.** No framework, no build step, no bundler.
- **Fonts:** loaded from Google Fonts in each page `<head>`:
  `Poppins` (400–700) for headings, `Quicksand` (400–700) for body.
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet" />
  ```
- **Preview locally** (from the project root, one level above this folder):
  ```bash
  python3 -m http.server 4400
  ```
  then open `http://localhost:4400/playful-version/index.html`.
- **Not deployed.** This folder is not linked from the live navigation and is not on GitHub Pages.

---

## 3. File structure (`playful-version/`)

```
playful-version/
├── index.html      (392 lines) — homepage, all sections
├── about.html      (131 lines) — About
├── services.html   (165 lines) — Services + "How it works"
├── team.html       (182 lines) — Meet the team (filterable)
├── contact.html    (136 lines) — Contact
├── styles.css      (454 lines) — complete design system for this version
├── script.js       (99 lines)  — all interactions
└── assets/         — images, logos, fonts (own copy)
```

The 5 pages share an identical header, mobile drawer, and footer (hard-coded per page).

---

## 4. Design system (`playful-version/styles.css`)

### 4.1 Color tokens (`:root`) — the itrust palette, kept intact
```css
--cream:#fbf7ee;  --cream-2:#f6eedb;  --cream-3:#f1e6cd;   /* warm backgrounds */
--green:#1f4d2e;  --green-900:#163a22; --green-ink:#22403a; /* brand green + text */
--sage:#7a9b54;   --sage-soft:#eef3e2;
--coral:#ee6c4d;  --coral-2:#e2572f;   --coral-soft:#fdeee7;
--sky-soft:#e6eff2;
--ink:#2a3f37;    --ink-soft:#5f6d61;
--grad-word:linear-gradient(90deg,var(--coral),var(--sage),var(--green),var(--coral)); /* animated headline word */
```

### 4.2 Shape & depth tokens
```css
--r-card:28px;  --r-lg:40px;  --r-pill:999px;
--shadow-soft:0 24px 60px -30px rgba(31,77,46,.45);
--shadow-card:0 18px 44px -26px rgba(31,77,46,.4);
--shadow-pop:0 14px 30px -10px rgba(238,108,77,.55);  /* coral glow under primary buttons */
```

### 4.3 Type
```css
--sans:"Quicksand",system-ui,…;      /* body, weight 500 base */
--head:"Poppins","Quicksand",…;       /* h1–h4, weight 600, tight line-height 1.08, -.01em */
```
Body: `16.5px / line-height 1.65`. Base color `--ink`. Headings color `--green-ink`.

### 4.4 Signature motifs
- **Arch / rainbow shapes** (`.arch`): `border-radius:50% 50% 0 0 / 100% 100% 0 0`, layered `.a1/.a2/.a3`
  in coral-soft / sage-soft / cream, `opacity:.5`, parallax on scroll.
- **Blobs** (`.blob`, `.bob`, `.bob2`): circular soft shapes that bob up/down infinitely.
- **Eyebrow pills** (`.eyebrow`): uppercase label in a rounded coral-soft pill (`.sage` variant = sage-soft).
- **Buttons** (`.btn`): pill-shaped (`--r-pill`), weight 700.
  - `.btn-primary` — coral fill, white text, coral glow, lifts `-3px` on hover.
  - `.btn-dark` — green fill.
  - `.btn-ghost` — white fill, cream border, lifts on hover.
- **Cards:** rounded `--r-card` (28px) with soft green-tinted shadows.

### 4.5 Animations (all CSS; respect `prefers-reduced-motion`)
| Name | What |
|---|---|
| `wordcycle` (8s) | gradient sweeps through one highlighted headline word |
| `bob` / `bob2` (7s/9s) | blobs drift up and down |
| `marq` (32s) | insurer logo **marquee** scrolls horizontally |
| `pulse` (2.4s) | ring pulses around the video play button |
| scroll reveal | `.reveal` → `.in` via IntersectionObserver (fade/slide up on enter) |
| arch parallax | arches translate on scroll (JS, in `script.js`) |

`@media (prefers-reduced-motion:reduce)` disables blobs, marquee, headline cycle, and the play pulse.

### 4.6 Responsive breakpoints
`1000px` (layout reflow), `820px` (**desktop nav + header CTA hide; mobile "more" trigger appears**),
`680px` (small-phone tuning).

---

## 5. Header, nav & mobile drawer

- **Desktop nav** (`.main-nav`): pill links, icon + label, `gap:8px`.
  Icons inherit text color (`--green-ink`), full opacity. Hover = white pill + card shadow.
  **Active page** is marked with `a[aria-current="page"]` → **green pill, white text** (set per page
  and via `script.js`).
- **Header CTA** (`.header-cta`): coral "Request Appointment" pill → `contact.html`.
- **Mobile** (≤820px): nav + CTA hide; a **"more" trigger** opens a slide-in **drawer** (`.more-drawer`)
  with primary links + quick tools (Insurance & Billing, Request Appointment). Closes on
  `[data-close]`, overlay click, or `Escape`.

> Nav order in this version: Home · About Us · Services · Our Team (+ mobile: What to Expect, Contact).
> (Note: the **live** site's nav was separately given a "Contact Us" item — that change belongs to the
> live site, not here. Only add it here if explicitly requested for the playful version.)

---

## 6. Page-by-page

### `index.html` — Homepage (all sections, in order)
1. **Hero** (`.hero`) — H1: *"Compassionate Behavioral & Mental Health Care for Children and Teens"*
   with an animated gradient word; reassurance row; two CTAs (Book an Appointment / Explore Our Care);
   hero photo; floating badges + arches/blobs.
2. **Trust band** (`.sec-sage`) — quick trust signals.
3. **About intro** — H2: *"Child & Adolescent Psychiatric Care, With Families At The Center."*
4. **Services** (`.sec-tint`) — H2: *"Our Clinical Services"* — service cards.
5. **How it works** — H2: *"How It Works, From Hello To Ongoing Support"* — numbered path steps.
6. **Team preview** (`.sec-tint`) — H2: *"Meet The People Behind The Care."*
7. **Message / spotlight** — H2: *"A message on children's mental health"* — quote + video facade
   (click-to-load poster with pulsing play button).
8. **FAQ** (`.sec-sage`) — H2: *"Have Questions? We Have Answers."* — accordion.
9. **Insurance** — H2: *"We're In-Network With The Plans You Already Have"* — scrolling insurer marquee.
10. **Contact** (`.sec-tint`) — H2: *"Contact Us"* / *"Say hello"* — contact card + form.
11. **Footer** — brand, Care links, Practice links, socials.

### `about.html`
Hero + H1 *"Child & Adolescent Psychiatric Care, With Families At The Center"*; about grid/photos,
approach, message. (About-specific art assets: `about-1…6.jpg`, `approach-dad.jpg`.)

### `services.html`
H1 *"Our Clinical Services"*; service detail; **"How It Works"** section (`.path`, `.path-step`).

### `team.html`
H1 *"Meet The People Behind The Care"*; **filterable team grid** — `.team-chip` filter chips toggle
`.team-tile` cards by specialty (e.g., Trauma → shows matching provider). Empty-state `.team-empty`.

### `contact.html`
H1 *"Contact Us"* / *"Say hello"*; contact card, **clinic status** (open/closed computed from an hours
table in `script.js`), contact form.

---

## 7. Interactions (`playful-version/script.js`, 99 lines, vanilla, IIFE)

1. **Scroll reveals** — IntersectionObserver adds `.in` to `.reveal` elements (fallback: show all).
2. **Active nav** — marks the current page's `.main-nav a` with `aria-current="page"`.
3. **Mobile drawer** — open/close, `[data-close]`, `Escape` to close.
4. **Accordions** — generic `wire()` toggles FAQ and "concern" accordions (chevron rotate).
5. **Team filter** — specialty chips filter team tiles; toggles `.active` / `aria-pressed`.
6. **Video facade** — click play → swaps poster for the real embed (`.video-embed`); `.spotlight-watch`
   buttons also trigger it. (Perf: video isn't loaded until clicked.)
7. **Clinic status** — reads the hours table rows, computes open/closed, updates the status pill.
8. **Arch parallax** — on scroll, translates `.arch` layers by a small factor for depth.

---

## 8. Content that still uses PLACEHOLDERS (do not invent real data)

These mirror the live site's pre-launch gaps. Same "wait for soft launch" rule applies — see
`../LAUNCH-CHECKLIST.md`:
- **Providers** — team/homepage names are placeholders (Maya / Daniel / Priya / Marcus / Sofia / Aisha).
- **Contact details** — placeholder address, phone, email, hours.
- **Self-pay rates**, **spotlight video** (facade with no real embed), **social URLs** (all `#`).
- **Contact form** — not wired to a backend.

If the user asks to finalize any of these, get the real values from them; don't fabricate.

---

## 9. Enhancements in this version (beyond a straight port)

The playful version enhances some patterns over the live content — flag these when relevant so the user
can approve/keep them:
- **Filterable team grid** (specialty chips) instead of a static list.
- **Insurer marquee** (auto-scrolling) for the in-network plans.
- **Video facade** (click-to-load) on the message/spotlight section.
- **"Concern" accordions** and richer **provider cards** (`.provider-card`) / **guide CTA** cards.
- **Animated gradient headline word**, arch parallax, bobbing blobs.

---

## 10. Current status & next steps

- **Status:** complete draft of all 5 pages; **local only**, not committed to git, not pushed, not linked
  from the live site.
- **Verified earlier:** one H1 per page, all assets resolve, no console errors, team filter works,
  active-nav marking works, responsive holds.
- **Likely next steps** (whatever the user chooses): copy/positioning polish, wire real data when
  available, decide whether/how to publish (e.g., a subfolder on GitHub Pages), or keep iterating on the
  visual design.

---

## 11. Working constraints (from project memory)

- **Palette must stay** cream / green / coral / sage (already the case here).
- **Positioning:** psychiatric / medication management, **not therapy**; **ages 5–17**; behavioral &
  mental health only (no vaccines/well-child).
- **Images:** when sourcing new photos, fetch a fresh web image each time; prefer kids ~10–12 (tweens).
- **Org rule:** never include patient PHI/PII in any output beyond a first name.
- **Don't push to GitHub** unless the user explicitly says to.
