# itrust Pediatrics — Master Launch Checklist

_Working to-do for getting the website launch-ready. Check items off as you go. Last compiled: 2026-08-19._

**How to use:** items are grouped by priority. `[ ]` = to do, `[x]` = done. Anything marked **NEEDS DATA** is waiting on real information from you or the CEO. File names refer to the current live site (project root); the techy redesign lives in `future-version/`.

**Status legend:** 🔴 launch blocker · 🟠 important polish · 🟡 nice-to-have · 🟢 already done · ⚖️ legal review

---

## A. Launch blockers — fix before going live 🔴

- [ ] **Wire the contact form.** It currently does nothing (`onsubmit="return false;"`, no handler). Connect it to Formspree or Netlify Forms (both free, work on GitHub Pages). Affects `contact.html` + the homepage contact section in `index.html`. **NEEDS DATA:** destination email + which service.
- [ ] **Replace placeholder providers.** The 6 team members (Maya, Daniel, Priya, Marcus, Sofia, Aisha) are fake. Add real names, credentials, photos, bios, ages, and specialties. Affects `team.html` + homepage team section. **NEEDS DATA.**
- [ ] **Confirm real clinic contact details** and replace the placeholders everywhere: address (currently "123 Wellness Way, Suite 200, Greenville, SC 29601"), phone (`864-520-2020`), email (`hello@itrustpediatrics.com`). **NEEDS DATA.**
- [ ] **Resolve one location vs. three.** The contact list says "Greenville · Spartanburg · Anderson," the footer shows a single Greenville address. Pick one story and make it consistent. **NEEDS DATA.**
- [ ] **Spotlight video.** Either add the real video URL (set `data-embed` on `#spotlightVideo` in `index.html`) or hide the block. Currently shows "Video coming soon." **NEEDS DATA.**
- [ ] **Social links.** All 4 footer icons (Facebook / Instagram / TikTok / YouTube) point to `#`. Add real profile URLs or remove them. **NEEDS DATA.**
- [x] 🟢 **Remove the 5 public dev pages** (`brand-guidelines.html`, `brand-guidelines copy.html`, `brand-guidelines-mockup.html`, `logo-preview.html`, `mobile-preview.html`) — they're publicly reachable and look unfinished. _(Claude can do this anytime.)_

---

## B. Professional polish — makes it look like a real practice 🟠

- [ ] **Provider headshots + bios** with board-certification language (e.g. "Board-certified child & adolescent psychiatrist"). Biggest credibility lever. **NEEDS DATA.**
- [ ] **Publish self-pay rates** (currently "contact us for rates"). Transparency reads as professional. **NEEDS DATA.**
- [ ] **Add social proof** — a few parent testimonials or a Google-reviews badge. **NEEDS DATA.**
- [x] 🟢 **Fix the footer tagline** — done (now "Child & adolescent psychiatric care, with families at the center"). Was "Whole-child pediatrics for every season of growing up" contradicts the psychiatric positioning. Appears in every footer. _(Claude can reword.)_
- [ ] **Custom domain** (e.g. `itrustpediatrics.com` instead of `palace1997.github.io/iTrust-Pediatrics/`). The single biggest "professional" upgrade. **NEEDS DATA/decision.**
- [ ] **Crisp favicon** (currently a JPG) + a dedicated **1200×630 social share image** (currently reuses the hero photo).
- [x] 🟢 **Contrast fixes** — done (eyebrows 5.75:1, coral credential/link text 5.54:1, both pass AA). Was: the sage eyebrow labels and small coral text fall below WCAG AA. Small change, more polished + accessible. _(Claude can do this.)_
- [ ] **Real online booking** — once the form is wired, or add a scheduler (Calendly-style). **NEEDS DATA.**

---

## C. Legal & compliance ⚖️ (drafted, awaiting review)

Five draft pages are built (local only, **not published**): `privacy.html`, `hipaa.html`, `terms.html`, `good-faith-estimate.html`, `accessibility.html`. See **`ATTORNEY-REVIEW-CHECKLIST.md`** (and the PDF) for the page-by-page questions.

- [ ] **Attorney + Privacy Officer review** of all 5 pages — especially the HIPAA Notice (South Carolina minor-consent & mental-health rules).
- [ ] **Decide whether the contact form collects PHI** and whether the form processor needs a Business Associate Agreement.
- [ ] **Fill in every highlighted placeholder** (dates, legal entity name, Privacy Officer, confirmed address/phone/email, self-pay process).
- [ ] **HIPAA operational duties** — post the Notice in-office, give it to patients, get written acknowledgment of receipt.
- [x] 🟢 Five legal pages drafted in the site design, cross-linked, with a "Legal" footer column added site-wide (local).
- [ ] **When finalized:** publish the pages + push the "Legal" footer links live. _(Claude wires + pushes in one commit.)_

---

## D. SEO — launch-day swaps 🟠

The heavy lifting is done; a few things flip at launch.

- [x] 🟢 Unique `<h1>` on every page; keyword-optimized titles & meta descriptions; Open Graph / Twitter cards; `sitemap.xml`; `robots.txt`; `MedicalClinic` + breadcrumb JSON-LD.
- [ ] **Add real address, phone, hours, and social URLs to the homepage JSON-LD** (left out on purpose to avoid publishing placeholder NAP data). **NEEDS DATA.**
- [ ] **Swap `github.io` for the real domain** across canonicals, OG tags, and `sitemap.xml` (one find-and-replace at launch).
- [ ] Submit the sitemap in **Google Search Console** once the domain is live.

---

## E. Content consistency 🟡

- [ ] **"young adults" in the mission** (index + about) vs. the stated ages 5–17 — confirm the intended wording (CEO previously OK'd "children and young adults," but it reads inconsistently with 5–17).
- [ ] **Consistent imagery** — use real clinic/team photography rather than stock where possible.

---

## F. Code hygiene / cleanup 🟡

- [ ] **Remove the dead blog modal** (`#blogModal` + ~200 lines of unused article data in `index.html`/`script.js`) — no trigger anywhere.
- [ ] **Prune dead JS** for removed features (count-up stats, hero page-flip, drawer accordions).
- [ ] Add the accessibility toolbar to the inner pages (currently homepage only) **or** decide it's homepage-only intentionally. _(The future-version already has it site-wide.)_

---

## G. Optional / future 🟡

- [ ] **"Future" techy redesign** — a full dark+light hybrid version is built locally in `future-version/` (same content, new design). Decide whether to pursue it, replace the current site, or shelve it.
- [ ] **Interactive "Meet Our Care Team" directory** — planned enhancement for when real providers are in.

---

## ✅ Already done this session (for reference) 🟢

- Payment/billing section redesigned (open 3-column layout, removed the boxed card, heading, eyebrow, and duplicate insurance row).
- Video spotlight redesigned (split video + message); removed the "Dr. [Full Name]" placeholder.
- Full SEO pass (see Section D).
- Contact-heading and homepage "Contact Us" spacing tuned and locked.
- Five legal pages drafted + "Legal" footer column added site-wide (local).
- A separate techy `future-version/` of the whole site (local).

---

## Reference — where things live & how to view

- **Live site:** https://palace1997.github.io/iTrust-Pediatrics/ (last push: the contact-gap revert; none of the above local work is live yet).
- **Main pages:** `index.html`, `about.html`, `services.html`, `team.html`, `contact.html` (+ `styles.css`, `script.js`).
- **Legal drafts:** `privacy.html`, `hipaa.html`, `terms.html`, `good-faith-estimate.html`, `accessibility.html` (+ `legal.css`).
- **Techy version:** `future-version/` (open `future-version/index.html`).
- **Companion docs:** `ATTORNEY-REVIEW-CHECKLIST.md`.
- **View any page locally:** `open "/Users/eddmaar/Documents/Pediatrics web/index.html"`

_When you're ready to act on any item, hand it to Claude — the ones marked "Claude can do this" need no new data; the **NEEDS DATA** items just need the real info first._
