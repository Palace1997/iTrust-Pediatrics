# itrust Pediatrics — Project Handoff & Brand Voice

A single source of truth for this project. Open this first on any new machine or account so a fresh session has full context. Everything here reflects decisions made with the client (Edd, iTrust marketing).

---

## 1. What this project is

The **itrust Pediatrics** website plus its **brand guidelines** document. itrust Pediatrics is a **children's psychiatric practice** — psychiatric evaluation, diagnosis, and **medication management** for children and teens **ages 5 to 19**, and the families who love them.

**Hard scope rule — psychiatric, NOT a therapy clinic.** Per CEO (Edd) direction on the 2026 relaunch, the practice provides **psychiatric care and medication management, not talk therapy, counseling, or play therapy** (we refer families out for those). Say "psychiatric care," "providers," "visits/appointments," "medication management"; strip any "therapy / therapist / counselor / holistic" language. Still no physical medicine, illnesses, vaccines, or well-child / sick-visit content.

**Core services (7, lean launch):** ADHD/ADD · Anxiety · Depression · Behavioral Concerns · Mood Disorders · Medication Management · Family-Centered Treatment (psychoeducation, care planning, practitioner guidance).
**Nav (all pages):** Home · About Us · Services · Our Team · **Request Appointment** (coral CTA → `contact.html`). The "More" menu is hidden on desktop, kept on mobile (it's the only nav there). **No patient portal** (not built, omitted by design).
**Areas served:** Greenville · Spartanburg · Anderson, SC. Accepts most major insurance; families contact to verify benefits.
**Connection to iTrust Wellness:** itrust Pediatrics extends the care iTrust Wellness provides, for children.

---

## 2. Brand voice & tone (the "voice")

Write like **a trusted friend who happens to be an expert** — talking to a worried parent.

- **Warm** — asking for help with your child is hard; make families feel safe and at ease.
- **Reassuring** — meet worry with calm and hope; readers should leave steadier than they arrived.
- **Trustworthy** — licensed, honest, clear; set realistic expectations.
- **Down-to-earth** — plain-spoken, no jargon, no pretense, no judgment.
- Archetype blend: **Caregiver + Mentor**.

**Writing rules learned on this project:**
- **Sound like an actual human speaking**, not marketing copy.
- **No em dashes / hyphens as dramatic pauses.** The client repeatedly asked to remove dashes. Rewrite into natural sentences instead.
- Keep it concrete and kind. Avoid clinical or scary terms.
- Brand name is lowercase **"itrust"** (the wordmark), practice is **"itrust Pediatrics."**
- When referring to kids, aim for warm, inclusive language; show diverse families.

---

## 3. Design system

### Colors
| Name | HEX | Use |
|---|---|---|
| Forest Green | `#1f4d2e` | Primary / foundation |
| Pine Green | `#3f7d52` | Secondary green |
| Sage | `#7a9b54` | Accent green |
| Cool Sage | `#b8cd96` | Light green tint |
| Cream Canvas | `#fbf7ee` | Soft background |
| Coral | `#ee6c4d` | Calls to action |
| Teal | `#2a9d8f` | Accent "heart" |
| Golden Yellow | `#f4c430` | Accent "heart" (fills only — poor text contrast) |
| Ink | `#28322a` | Body text |

Greens are the foundation; coral/teal/gold are "hearts" used sparingly. Coral = the go-to CTA color.

### Fonts
- **Headings:** GT Super Display (licensed, **self-hosted** in `assets/fonts/`, loaded via `@font-face`; weights Medium 500 + Bold 700).
- **Body/UI:** Plus Jakarta Sans (Google Fonts).
- CSS vars: `--serif` (GT Super) and `--sans` (Plus Jakarta).
- ⚠️ Confirm the GT Super web license covers self-hosting before public launch.

### Logos — official kit in `assets/logo/`
| File | Layout | For |
|---|---|---|
| `HorizontalLIGHTBGPeds.png` | Horizontal, full color | Light backgrounds |
| `HorizontalDARKBGPeds.png` | Horizontal, reversed (white) | Dark backgrounds |
| `HorizontalLightGreenDARKBGPeds.png` | Horizontal, muted | Subtle on dark |
| `VerticalLIGHTBGPeds.png` | Vertical/stacked, full color | Social, square |
| `VerticalDARKBGpeds.png` | Vertical/stacked, reversed | Dark backgrounds |
| `VerticalLightGreenDARKBGPeds.png` | Vertical, muted | Subtle |

- **Website footer** (all pages) uses `HorizontalDARKBGPeds.png`.
- **Homepage / nav header** deliberately stays as `assets/itrust-pediatrics-logo.jpg` — client says it's the best fit there; do not swap it.
- Brand guidelines use the `assets/logo/` official files throughout.
- Prefer `assets/logo/` over the older `assets/itrust-logo-*.png` files.

### Imagery
- **Always source a fresh web image** — never reuse existing site images.
- When a child appears, aim for **ages 10–12 (tweens)**, real & diverse families, warm light, genuine emotion. No clinical / physical-medicine cues.

---

## 4. File map

**Live site pages (lean launch — 5):** `index.html` (homepage — keep its header logo), `about.html`, `services.html`, `team.html`, `contact.html`.
**Archived (moved to `_archive/`, unlinked but recoverable):** `blog.html`, `resources.html`, `approach.html`, and the whole condition-guide library (`adhd.html`, `anxiety.html`, `depression.html`, `behavioral-concerns.html`, `parent-resources.html`, `school-challenges.html`, `bullying-support.html`, `family-support.html`, `medication-management.html`, `care-coordination.html`). The CEO wanted no "library of conditions / educational articles." The "Our Approach" steps now live inline under Services on `index.html` and `services.html`.
**Brand guidelines:** `brand-guidelines.html` (landscape doc → exports to `itrust-Pediatrics-Brand-Guidelines.pdf`).
**Shared:** `styles.css`, `script.js`, `assets/` (images, `fonts/`, `logo/`, `insurers/`), `.claude/server.py` (local server).

**Safe to delete (scratch/backups):** `brand-guidelines copy.html`, `brand-guidelines-mockup.html`, `logo-preview.html`, `mobile-preview.html`.

### Brand guidelines structure (brand-guidelines.html)
Landscape 1100×712 pages: Cover → TOC → 1 Brand Essence, 2 Voice & Tone, 3 Positioning & Personality, 4 Brand Values, 5 What We Do (Scope), 6 Visual Identity (divider), 7 Logo, 8 Logo Usage, 9 Incorrect Logo Usage, 10 Brand Colors (click-to-copy hex), 11 Typography, 12 Accessibility & Contrast, 13 Visual Expression (divider), 14 Photography, 15 Iconography & UI, 16 Brand in Action, 17 Contact.
- Locked type sizes: cover title `--coverh:60px`, page titles `--tsize:40px` (both in `:root`). Titles have **no** text-shadow.
- Interactive-only bits (color copy, toast) are hidden in print via `@media print`.

---

## 5. How to run & build

**Local preview server** (serves the whole folder at http://localhost:4321):
```bash
python3 .claude/server.py    # port 4321, DIRECTORY = this folder
```

**Export the brand guidelines to PDF** (headless Chrome, keeps fonts + full-bleed backgrounds):
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-sandbox --hide-scrollbars --no-pdf-header-footer \
  --print-to-pdf="itrust-Pediatrics-Brand-Guidelines.pdf" \
  "http://localhost:4321/brand-guidelines.html"
```
(Or manually: open the page in Chrome → Print → Save as PDF → Landscape + Background graphics on.)

**Deploy:** Netlify. Note the free plan now uses **credits (~300/mo, ~15 per production deploy)** — batch edits before deploying rather than deploying every small change.

---

## 6. Working preferences (how the client likes to work)

- Prefers to **see choices/previews rendered in the actual layout** before applying.
- Likes **temporary sliders** to fine-tune a value (size, spacing, brightness), then says **"lock it"** to bake the value in and remove the slider.
- Dislikes **blank/empty space** at the top/bottom of pages — keep content balanced/centered.
- Iteratively trims elements; remove dashes; make copy sound human.
- **Never put customer PHI/PII in outputs beyond a first name** (org rule).

---

## 7. Pending before public launch

- Replace placeholder **providers** — `team.html` uses 6 placeholder MD/PMHNP cards in a Psychology-Today style (photo, credentials, ages accepted, specialties, "Accepting new patients"). Homepage keeps compact sliding tiles as a teaser.
- Replace the placeholder **video** (Video Spotlight, `Dr. [Full Name]`) and any illustrative quotes.
- Wire up the contact form (e.g. Netlify Forms).
- Confirm GT Super Display web license covers self-hosting.
- Fill real address, phone, hours, and the confirmed **accepted-insurance list** (insurer logos in `assets/insurers/` are placeholders); add real **self-pay** wording to the "How Payment Works" section.
- Build a **patient portal** only if/when ready — currently omitted by design (no PHI-collecting form).

**Done in the 2026-08-01 relaunch:** psychiatric repositioning + full therapy→psychiatric copy sweep; lean 5-page nav (More hidden on desktop); About restructured (who we are · mission · ages 5–19 · team approach · Wellness connection); services trimmed to 7 with the accordion order matching the CEO's list; insurance "in-network" auto-scroll ribbon + "How Payment Works" split section; FAQ reoriented to process / first-visit; Team = Psych-Today provider cards with a working focus filter; contact section titled "Contact Us"; brand-guidelines HTML + exported PDF updated to match.

---

*Last updated: 2026-08-01.*
