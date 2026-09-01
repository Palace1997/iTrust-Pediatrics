/* itrust Pediatrics, interactions
   1. Sticky header shadow on scroll
   2. Reveal-on-scroll animations (zoom / fade-in)
   3. Mobile nav toggle + smooth close on link click
*/

(function () {
  "use strict";

  /* ---- 1. Header shadow ---- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- 2. Reveal on scroll ---- */
  const reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reveals.length && !reduceMotion && "IntersectionObserver" in window) {
    const reveal = (el) => {
      if (el.classList.contains("in")) return;
      const delay = parseInt(el.dataset.delay, 10) || 0;
      if (delay) setTimeout(() => el.classList.add("in"), delay);
      else el.classList.add("in");
    };
    // threshold:0 = fire the moment any sliver enters; reliable on fast scroll
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    reveals.forEach((el) => io.observe(el));

    /* Backstop: a fast scroll (wheel fling, scrollbar drag, Page Down) can make
       IntersectionObserver skip an element's "entered" sample. On each scroll,
       reveal anything already in view that the observer hasn't caught yet. */
    let ticking = false;
    const sweep = () => {
      ticking = false;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      let remaining = 0;
      reveals.forEach((el) => {
        if (el.classList.contains("in")) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          reveal(el);
          io.unobserve(el);
        } else {
          remaining++;
        }
      });
      if (!remaining) {
        window.removeEventListener("scroll", onScrollSweep);
        window.removeEventListener("resize", onScrollSweep);
      }
    };
    const onScrollSweep = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(sweep);
      }
    };
    window.addEventListener("scroll", onScrollSweep, { passive: true });
    window.addEventListener("resize", onScrollSweep, { passive: true });
    sweep(); // reveal anything already on screen at load
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---- 2b. Rotating About photo (new random image each time it scrolls into view) ---- */
  const rotator = document.getElementById("about-rotator");
  if (rotator && "IntersectionObserver" in window) {
    const pool = [
      "assets/about-1.jpg",
      "assets/about-2.jpg",
      "assets/about-3.jpg",
      "assets/about-4.jpg",
      "assets/about-5.jpg",
      "assets/about-6.jpg",
    ];
    // preload so swaps are instant
    pool.forEach((src) => { const im = new Image(); im.src = src; });

    let last = -1;
    const pickDifferent = () => {
      let n;
      do { n = Math.floor(Math.random() * pool.length); }
      while (n === last && pool.length > 1);
      last = n;
      return pool[n];
    };

    const swap = () => {
      const src = pickDifferent();
      const tmp = new Image();
      rotator.style.opacity = "0";
      tmp.onload = () => { rotator.src = src; rotator.style.opacity = "1"; };
      tmp.src = src;
    };

    // random first impression, then a fresh photo on every re-entry
    swap();
    const rotObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) swap(); }),
      { threshold: 0.45 }
    );
    rotObs.observe(rotator.closest("figure") || rotator);
  }

  /* ---- 2c. Value-pill explainers (right-click to expound) ---- */
  const pills = document.querySelectorAll(".value-pill[data-explain]");
  if (pills.length) {
    const CONTENT = {
      empower: {
        title: "Empower children",
        intro: "We treat kids as active partners in their own care, building confidence, coping skills, and self-understanding.",
        points: [
          "Explain psychiatric care in kid-friendly language, so it feels safe, never scary.",
          "Teach coping, calming, and emotional-awareness skills they keep for life.",
          "Help children name big feelings and build healthy habits of mind.",
          "Give tweens and teens private, judgment-free space to open up.",
        ],
      },
      support: {
        title: "Support families",
        intro: "Care wraps around the whole family, because supported parents raise thriving kids.",
        points: [
          "We never rush a session; every worry gets heard and answered.",
          "Parent coaching, so you know how to support, not pressure.",
          "Clear, practical plans and tools you can use at home.",
          "Culturally aware, respectful support.",
        ],
      },
      change: {
        title: "Change futures",
        intro: "Early emotional support today shapes a healthier, steadier life for years to come.",
        points: [
          "Catching worries and low mood early, while they're easier to work through.",
          "Coping and resilience skills that last a lifetime.",
          "Steady support through big transitions, school, family, and growing up.",
          "A care partnership that grows with your child through the teen years.",
        ],
      },
      protect: {
        title: "Protect well-being",
        intro: "We help families protect what matters most, a child's emotional well-being.",
        points: [
          "Spotting worries, low mood, or behavior changes early.",
          "A safe, steady place to process stress and hard times.",
          "Practical coping tools for everyday ups and downs.",
          "Guidance for families on supporting mental health at home.",
        ],
      },
      welcome: {
        title: "Welcome everyone",
        intro: "Every child and every family belongs here, exactly as they are.",
        points: [
          "Affirming, judgment-free care for all families.",
          "Culturally aware providers who respect your family's values and choices.",
          "Care that meets each child where they are, at their own pace.",
          "A warm, welcoming space where sessions feel safe, not scary.",
        ],
      },
    };

    // single reusable popover
    const pop = document.createElement("div");
    pop.className = "pill-popover";
    pop.setAttribute("role", "dialog");
    pop.hidden = true;
    document.body.appendChild(pop);

    let openFor = null;

    const closePop = () => {
      pop.classList.remove("show");
      openFor = null;
      // allow fade-out before hiding
      setTimeout(() => { if (!pop.classList.contains("show")) pop.hidden = true; }, 200);
    };

    const openPop = (pill) => {
      const key = pill.getAttribute("data-explain");
      const data = CONTENT[key];
      if (!data) return;

      pop.innerHTML =
        '<button class="pop-close" aria-label="Close">×</button>' +
        '<h4>' + data.title + '</h4>' +
        '<p class="pop-intro">' + data.intro + '</p>' +
        '<p class="pop-label">What we actually do</p>' +
        '<ul>' + data.points.map((p) => "<li>" + p + "</li>").join("") + '</ul>';

      pop.hidden = false;
      // measure, then center the box under the middle of the bar (clamped to viewport)
      const r = pill.getBoundingClientRect();
      const margin = 12;
      const pw = Math.min(360, window.innerWidth - margin * 2);
      pop.style.width = pw + "px";
      const centerX = r.left + r.width / 2 + window.scrollX;
      let left = centerX - pw / 2;
      left = Math.min(left, window.scrollX + window.innerWidth - pw - margin);
      left = Math.max(left, window.scrollX + margin);
      pop.style.left = left + "px";
      pop.style.top = r.bottom + window.scrollY + 14 + "px";
      // point the caret at the bar's center even when the box is clamped near an edge
      pop.style.setProperty("--caret", (centerX - left) + "px");

      // animate in
      requestAnimationFrame(() => pop.classList.add("show"));
      openFor = pill;
      pop.querySelector(".pop-close").addEventListener("click", closePop);
    };

    const toggle = (pill) => { (openFor === pill) ? closePop() : openPop(pill); };

    let hideTimer = null;
    const cancelHide = () => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } };
    const scheduleHide = () => { cancelHide(); hideTimer = setTimeout(closePop, 180); };

    pills.forEach((pill) => {
      // primary: appears on hover, no clicking needed
      pill.addEventListener("mouseenter", () => { cancelHide(); if (openFor !== pill) openPop(pill); });
      pill.addEventListener("mouseleave", scheduleHide);
      // keyboard focus also opens it (accessibility)
      pill.addEventListener("focus", () => { cancelHide(); openPop(pill); });
      pill.addEventListener("blur", scheduleHide);
      // still supports right-click and tap/click for touch devices
      pill.addEventListener("contextmenu", (e) => { e.preventDefault(); toggle(pill); });
      pill.addEventListener("click", () => toggle(pill));
      pill.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(pill); }
      });
    });

    // keep the popover open while the cursor is over it; close when it leaves
    pop.addEventListener("mouseenter", cancelHide);
    pop.addEventListener("mouseleave", scheduleHide);

    // dismiss on outside click, Escape, or scroll/resize
    document.addEventListener("click", (e) => {
      if (openFor && !pop.contains(e.target) && !e.target.closest(".value-pill")) closePop();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePop(); });
    window.addEventListener("scroll", () => { if (openFor) closePop(); }, { passive: true });
    window.addEventListener("resize", () => { if (openFor) closePop(); });
  }

  /* ---- 2e. Count-up stats (animate numbers when the bar scrolls into view) ---- */
  const counters = document.querySelectorAll(".trust-bar strong[data-count]");
  if (counters.length) {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fmt = (val, dec) => (dec ? val.toFixed(dec) : Math.round(val).toLocaleString());

    if (reduce || !("IntersectionObserver" in window)) {
      // honor reduced-motion / no-IO: just show the final values (already in the HTML)
    } else {
      counters.forEach((el) => {
        const dec = +(el.dataset.decimals || 0);
        el.textContent = fmt(0, dec) + (el.dataset.suffix || "");
      });
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const run = (el) => {
        const target = parseFloat(el.dataset.count);
        const dec = +(el.dataset.decimals || 0);
        const suffix = el.dataset.suffix || "";
        const dur = 1500;
        let start = null;
        const step = (ts) => {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = fmt(target * ease(p), dec) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = fmt(target, dec) + suffix;
        };
        requestAnimationFrame(step);
      };
      const cObs = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { run(e.target); cObs.unobserve(e.target); }
        }),
        { threshold: 0.5 }
      );
      counters.forEach((el) => cObs.observe(el));
    }
  }

  /* ---- 2f. Hero walkthrough, pages flip like a turning book, looping ---- */
  const book = document.getElementById("hero-book");
  if (book) {
    const reduceWk = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let order = Array.prototype.slice.call(book.querySelectorAll(".page"));
    const setZ = () => order.forEach((p, i) => { p.style.zIndex = String(order.length - i); });
    setZ();

    const cursor = book.querySelector(".wt-cursor");
    if (!reduceWk && order.length > 1 && cursor) {
      const REST = [330, 26], TARGET = [66, 196];
      const setCur = (x, y, s) => {
        cursor.style.setProperty("--cx", x + "px");
        cursor.style.setProperty("--cy", y + "px");
        cursor.style.setProperty("--cs", s);
      };
      let timer = null, pending = [];
      const clearAll = () => { pending.forEach(clearTimeout); pending = []; };

      const cycle = () => {
        const top = order[0];
        const btn = top.querySelector(".pg-btn");
        setCur(TARGET[0], TARGET[1], 1);                                   // glide to the button
        pending.push(setTimeout(() => { setCur(TARGET[0], TARGET[1], 0.82); if (btn) btn.classList.add("tapped"); }, 760));  // press
        pending.push(setTimeout(() => { setCur(TARGET[0], TARGET[1], 1); if (btn) btn.classList.remove("tapped"); }, 980));  // release
        pending.push(setTimeout(() => { top.classList.add("flipping"); top.style.transform = "rotateY(-178deg)"; }, 1120));  // turn the page
        pending.push(setTimeout(() => {
          top.style.transition = "none";
          top.style.transform = "rotateY(0deg)";
          top.classList.remove("flipping");
          order.push(order.shift());
          setZ();
          void top.offsetWidth;          // force reflow so the reset isn't animated
          top.style.transition = "";
          setCur(REST[0], REST[1], 1);   // cursor returns to rest
        }, 2090));
      };

      const start = () => { if (!timer) { cycle(); timer = setInterval(cycle, 3500); } };
      const stop = () => { clearInterval(timer); timer = null; clearAll(); };
      setCur(REST[0], REST[1], 1);
      start();
      // pause while hovered so visitors can read a page
      book.addEventListener("mouseenter", stop);
      book.addEventListener("mouseleave", start);
    }
  }

  /* ---- 2g. FAQ, click a question bar to reveal its answer (each independent), auto-close on scroll-away ---- */
  const faqSectionEl = document.getElementById("faq");
  if (faqSectionEl) {
    const faqBars = Array.prototype.slice.call(faqSectionEl.querySelectorAll(".faq-bar"));
    const closeAllFaq = () => {
      faqBars.forEach((bar) => {
        if (bar.classList.contains("open")) {
          bar.classList.remove("open");
          const b = bar.querySelector(".faq-q");
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    };
    faqBars.forEach((bar) => {
      const q = bar.querySelector(".faq-q");
      if (!q) return;
      q.addEventListener("click", () => {
        const open = bar.classList.toggle("open");
        q.setAttribute("aria-expanded", String(open));
      });
    });
    /* Auto-close any open question once the section scrolls out of view */
    const maybeCloseFaq = () => {
      const r = faqSectionEl.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.bottom <= 0 || r.top >= vh) closeAllFaq();
    };
    if ("IntersectionObserver" in window) {
      const faqIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (!e.isIntersecting) closeAllFaq(); });
      }, { threshold: 0 });
      faqIO.observe(faqSectionEl);
    }
    let faqTick = false;
    const onFaqScroll = () => {
      if (faqTick) return;
      faqTick = true;
      requestAnimationFrame(() => { faqTick = false; maybeCloseFaq(); });
    };
    window.addEventListener("scroll", onFaqScroll, { passive: true });
    window.addEventListener("resize", onFaqScroll, { passive: true });
  }

  /* ---- 2g2. Common Concerns / Clinical Services: click to expand, auto-close on scroll-away ---- */
  const concernsSection = document.getElementById("concerns");
  if (concernsSection) {
    const concernItems = Array.prototype.slice.call(concernsSection.querySelectorAll(".concern"));
    const closeAllConcerns = () => {
      concernItems.forEach((item) => {
        if (item.classList.contains("open")) {
          item.classList.remove("open");
          const b = item.querySelector(".concern-q");
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    };
    concernItems.forEach((item) => {
      const q = item.querySelector(".concern-q");
      if (!q) return;
      q.addEventListener("click", () => {
        const open = item.classList.toggle("open");
        q.setAttribute("aria-expanded", String(open));
      });
    });
    /* Auto-close any open panel once the section scrolls out of view */
    const maybeCloseConcerns = () => {
      const r = concernsSection.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.bottom <= 0 || r.top >= vh) closeAllConcerns();
    };
    if ("IntersectionObserver" in window) {
      const concernsIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (!e.isIntersecting) closeAllConcerns(); });
      }, { threshold: 0 });
      concernsIO.observe(concernsSection);
    }
    let concernsTick = false;
    const onConcernsScroll = () => {
      if (concernsTick) return;
      concernsTick = true;
      requestAnimationFrame(() => { concernsTick = false; maybeCloseConcerns(); });
    };
    window.addEventListener("scroll", onConcernsScroll, { passive: true });
    window.addEventListener("resize", onConcernsScroll, { passive: true });
  }

  /* ---- 2g3. "Signs it may be time to reach out" accordion ---- */
  const signsSection = document.getElementById("signs");
  if (signsSection) {
    const signsItems = Array.prototype.slice.call(signsSection.querySelectorAll(".signs-item"));
    const closeAllSigns = () => {
      signsItems.forEach((item) => {
        if (item.classList.contains("open")) {
          item.classList.remove("open");
          const b = item.querySelector(".signs-q");
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    };
    signsItems.forEach((item) => {
      const q = item.querySelector(".signs-q");
      if (!q) return;
      q.addEventListener("click", () => {
        const open = item.classList.toggle("open");
        q.setAttribute("aria-expanded", String(open));
      });
    });
    /* Auto-close any open panel once the section scrolls out of view.
       IntersectionObserver is the primary path; a rAF-throttled scroll/resize
       backstop covers fast scrolls and environments where IO lags. */
    const maybeCloseSigns = () => {
      const r = signsSection.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.bottom <= 0 || r.top >= vh) closeAllSigns();
    };
    if ("IntersectionObserver" in window) {
      const signsIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (!e.isIntersecting) closeAllSigns(); });
      }, { threshold: 0 });
      signsIO.observe(signsSection);
    }
    let signsTick = false;
    const onSignsScroll = () => {
      if (signsTick) return;
      signsTick = true;
      requestAnimationFrame(() => { signsTick = false; maybeCloseSigns(); });
    };
    window.addEventListener("scroll", onSignsScroll, { passive: true });
    window.addEventListener("resize", onSignsScroll, { passive: true });
  }

  /* ---- 2h. FAQ background, fixed photo + gentle cursor parallax ---- */
  const faqSection = document.getElementById("faq");
  const faqPhoto = document.getElementById("faq-rotator");
  const noMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (faqPhoto && faqSection) {
    const base = noMotion ? "" : "scale(1.06)";
    if (base) faqPhoto.style.transform = base;
    if (!noMotion) {
      faqSection.addEventListener("mousemove", (e) => {
        const r = faqSection.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 18;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * 18;
        faqPhoto.style.transform = "scale(1.06) translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
      });
      faqSection.addEventListener("mouseleave", () => { faqPhoto.style.transform = base; });
    }
  }

  /* ---- 2i. Care team: filter chips + horizontal slider ---- */
  const teamSection = document.getElementById("team");
  if (teamSection) {
    const track = teamSection.querySelector(".team-track");
    const tiles = Array.prototype.slice.call(teamSection.querySelectorAll(".team-tile, .provider-card"));
    const chips = Array.prototype.slice.call(teamSection.querySelectorAll(".team-chip"));
    const empty = teamSection.querySelector(".team-empty");
    const prev = teamSection.querySelector(".team-arrow.prev");
    const next = teamSection.querySelector(".team-arrow.next");

    const updateArrows = () => {
      if (!track || !prev || !next) return;
      const max = track.scrollWidth - track.clientWidth - 2;
      const scrollable = max > 2;
      prev.disabled = !scrollable || track.scrollLeft <= 2;
      next.disabled = !scrollable || track.scrollLeft >= max;
    };

    const stepBy = () => {
      const visible = tiles.filter((t) => !t.classList.contains("hide"));
      const w = visible.length ? visible[0].offsetWidth : 320;
      return w + 24; /* tile width + 1.5rem gap */
    };

    if (prev) prev.addEventListener("click", () => track.scrollBy({ left: -stepBy(), behavior: "smooth" }));
    if (next) next.addEventListener("click", () => track.scrollBy({ left: stepBy(), behavior: "smooth" }));
    if (track) track.addEventListener("scroll", updateArrows, { passive: true });

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const filter = chip.getAttribute("data-filter");
        chips.forEach((c) => { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");
        let shown = 0;
        tiles.forEach((tile) => {
          const specs = (tile.getAttribute("data-spec") || "").split(/\s+/);
          const match = filter === "all" || specs.indexOf(filter) !== -1;
          tile.classList.toggle("hide", !match);
          if (match) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
        if (track) track.scrollTo({ left: 0, behavior: "smooth" });
        updateArrows();
      });
    });

    updateArrows();
    window.addEventListener("resize", updateArrows, { passive: true });
  }

  /* ---- 3. Mobile "More" slide-out drawer ---- */
  const toggle = document.querySelector(".more-trigger");
  const drawer = document.getElementById("moreDrawer");
  if (toggle && drawer) {
    const openDrawer = () => {
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("more-open");
    };
    const closeDrawer = () => {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("more-open");
    };

    toggle.addEventListener("click", () =>
      drawer.classList.contains("open") ? closeDrawer() : openDrawer()
    );

    // close button, overlay, and any control flagged data-close
    drawer.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", closeDrawer)
    );

    // expandable groups (Services / Approach / Resources)
    drawer.querySelectorAll(".more-expand").forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = btn.closest(".more-group");
        const open = group.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });

    // tapping any in-page link closes the drawer after it jumps
    drawer.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", closeDrawer)
    );

    // Esc closes the drawer
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
    });
  }

  /* ---- 4. Accessibility toolbar (preferences saved per visitor) ---- */
  const a11yOpen = document.getElementById("a11yOpen");
  const a11yPanel = document.getElementById("a11yPanel");
  if (a11yOpen && a11yPanel) {
    const root = document.documentElement;
    const KEY = "itrust-a11y";
    const opts = Array.prototype.slice.call(a11yPanel.querySelectorAll(".a11y-opt"));

    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
    const save = (arr) => { try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {} };

    const apply = (name, on) => {
      root.classList.toggle("a11y-" + name, on);
      const btn = a11yPanel.querySelector('.a11y-opt[data-a11y="' + name + '"]');
      if (btn) btn.setAttribute("aria-pressed", String(on));
    };

    load().forEach((name) => apply(name, true));

    opts.forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-a11y");
        const on = btn.getAttribute("aria-pressed") !== "true";
        apply(name, on);
        const set = new Set(load());
        on ? set.add(name) : set.delete(name);
        save(Array.from(set));
      });
    });

    const resetBtn = document.getElementById("a11yReset");
    if (resetBtn) resetBtn.addEventListener("click", () => {
      opts.forEach((btn) => apply(btn.getAttribute("data-a11y"), false));
      save([]);
    });

    const setOpen = (open) => {
      a11yPanel.hidden = !open;
      a11yOpen.setAttribute("aria-expanded", String(open));
      if (open) { const f = a11yPanel.querySelector(".a11y-opt"); if (f) f.focus(); }
    };
    a11yOpen.addEventListener("click", () => setOpen(a11yPanel.hidden));
    const closeBtn = document.getElementById("a11yClose");
    if (closeBtn) closeBtn.addEventListener("click", () => { setOpen(false); a11yOpen.focus(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !a11yPanel.hidden) { setOpen(false); a11yOpen.focus(); } });
    document.addEventListener("click", (e) => {
      if (!a11yPanel.hidden && !a11yPanel.contains(e.target) && !a11yOpen.contains(e.target)) setOpen(false);
    });
  }

  /* ---- 5. Resource blog modal (opens articles per audience) ---- */
  const blogModal = document.getElementById("blogModal");
  if (blogModal) {
    const BLOGS = {
      parents: {
        title: "For Parents",
        posts: [
          {
            t: "When worry is more than a phase",
            d: "How to tell everyday nerves from anxiety that's getting in your child's way, and what helps.",
            read: 4,
            body: [
              "Every kid worries sometimes, about a test, the dark, a new school. It usually passes. Anxiety is different: it sticks around, grows louder, and starts shrinking your child's world.",
              { h: "Signs worth a closer look" },
              { ul: ["Stomachaches or headaches with no clear cause", "Avoiding school, friends, or things they used to love", "Big reactions to small changes, or lots of reassurance-seeking", "Trouble sleeping, or worries that won't switch off"] },
              { h: "What actually helps" },
              "Reassurance feels kind, but constant reassurance can quietly feed worry. What helps more is gently coaching kids to face fears in small steps, and giving them calming tools they can use on their own. That's the heart of what we do in therapy.",
              { note: "If worry is getting in the way of school, sleep, friendships, or family life, it's worth reaching out. Earlier support is gentler and usually shorter." },
            ],
          },
          {
            t: "Tantrums, meltdowns, and what's underneath",
            d: "Why big behaviors happen, and calm, consistent ways to respond that actually help.",
            read: 4,
            body: [
              "Big behavior, meltdowns, defiance, sudden anger, is usually a child telling you something they can't yet put into words. It's communication, not just misbehavior.",
              { h: "Look for the why" },
              "Underneath an outburst there's often a feeling (overwhelm, fear, frustration) or an unmet need (hunger, tiredness, too much going on). Naming the feeling out loud, calmly, helps more than reasoning in the heat of the moment.",
              { ul: ["Stay calm yourself first, your steadiness is contagious", "Name what you see: \"You're really frustrated right now\"", "Wait for calm before problem-solving or talking it through", "Keep limits kind but consistent, predictability feels safe"] },
              { h: "When to reach out" },
              "If outbursts are frequent, intense for your child's age, or straining the whole household, therapy and parent coaching can help you find what's underneath and respond in a way that calms things down.",
            ],
          },
          {
            t: "Helping your child through big changes",
            d: "Divorce, a move, a loss, supporting kids through the hard things life brings.",
            read: 4,
            body: [
              "Kids feel big changes deeply, even when they can't say so. A move, a divorce, a death, or a scary event can show up as new fears, clinginess, anger, or just seeming \"not themselves.\"",
              { h: "What helps most" },
              { ul: ["Honest, simple, age-appropriate explanations", "Keeping routines steady where you can", "Letting all feelings be okay, even the messy ones", "Extra patience, behavior often dips before it settles"] },
              "You don't have to have perfect words. Being present, predictable, and willing to listen does more than any script.",
              { note: "If your child seems stuck, withdrawn, or overwhelmed weeks after a hard event, a few sessions can give them a safe place to process it at their own pace." },
            ],
          },
          {
            t: "Screens, sleep, and mood",
            d: "How everyday habits quietly shape your child's mood, and small changes that help.",
            read: 3,
            body: [
              "When a child's mood, focus, or patience takes a dip, the cause is often hiding in plain sight: not enough sleep, and a lot of screen time.",
              { h: "Small, doable shifts" },
              { ul: ["A steady bedtime and wind-down routine, even on weekends", "Screens off 30 to 60 minutes before bed", "Phones charging outside the bedroom overnight", "Some daily movement and a little time outside"] },
              "You don't need a perfect overhaul, just a couple of consistent changes. Better rest tends to lift mood and behavior more than families expect.",
              { note: "If mood or behavior stays low even with steady routines, that's worth a conversation, sometimes there's more going on, and it's very workable." },
            ],
          },
        ],
      },
      kids: {
        title: "For Kids",
        posts: [
          {
            t: "What happens when you talk to a counselor?",
            d: "A friendly peek at what therapy is really like, so it feels a lot less scary.",
            read: 2,
            body: [
              "A counselor is a grown-up whose whole job is to help kids with big feelings, like worries, sadness, or anger that feels too big.",
              "Talking to one isn't like being in trouble. A lot of the time you'll play games, draw, or just chat. There are no wrong answers and nothing you have to share until you're ready.",
              "It's a safe, calm place that's all about you, and it can make the heavy stuff feel a little lighter.",
            ],
          },
          {
            t: "Naming your big feelings",
            d: "Why putting words to feelings makes them easier to handle.",
            read: 2,
            body: [
              "Feelings can feel huge, like a wave that knocks you over. Here's a secret: giving a feeling a name makes it smaller and easier to handle.",
              "Try it, \"I feel nervous,\" \"I feel left out,\" \"I feel really mad.\" Just saying it (out loud or in your head) helps your brain calm down.",
              "All feelings are okay to have. What we get to choose is what we do next, and that's a skill you can practice.",
            ],
          },
          {
            t: "Calm-down tricks that really work",
            d: "Quick, easy tricks for when your feelings get too big.",
            read: 2,
            body: [
              "When a feeling gets really big, your body needs help slowing down first. These tricks work for lots of kids:",
              { ul: ["Balloon breaths, breathe in for 4, out for 4, like blowing up a balloon", "Find 5 things you can see and 2 you can hear", "Squeeze your fists tight, then let them go floppy", "Get a drink of water or a quick hug"] },
              "Pick a favorite and practice it when you're already calm, that way it's ready when you really need it.",
            ],
          },
        ],
      },
      teens: {
        title: "For Teens",
        posts: [
          {
            t: "Stress, sleep, and your brain",
            d: "Why rest matters more than you'd think, and small changes that can help you feel more like yourself.",
            read: 4,
            body: [
              "When life gets busy, sleep is usually the first thing to go, and it's also one of the things that helps the most.",
              { h: "Why it matters" },
              "Sleep is when your brain sorts through the day and resets your mood. Running low makes almost everything, focus, stress, motivation, harder than it needs to be.",
              { ul: ["Aim for a steady sleep and wake time, even on weekends", "Try to put screens away 30 to 60 minutes before bed", "Caffeine has a long tail, ease off in the afternoon", "Morning light helps set your body clock"] },
              { h: "When stress is more than stress" },
              "If worry or a low mood is sticking around and getting in the way of school, friends, or things you used to enjoy, that's not weakness and it's not permanent. Talk to us, we'll figure out the next step together, and we'll keep it private.",
            ],
          },
          {
            t: "When it's more than a bad week",
            d: "How to tell a rough patch from something worth getting support for.",
            read: 4,
            body: [
              "Everyone has bad days and rough weeks, that's just being human. But sometimes a low mood digs in and doesn't lift, and that's worth paying attention to.",
              { h: "Signs it might be more" },
              { ul: ["Feeling down, empty, or irritable most days for a couple of weeks", "Losing interest in things you used to enjoy", "Big changes in sleep, appetite, or energy", "Pulling away from people, or feeling like a burden"] },
              "None of this means something's wrong with you. Depression and anxiety are common, real, and very treatable, and reaching out is a strong move, not a weak one.",
              { note: "If you ever think about hurting yourself, please tell someone now, a trusted adult, or call or text 988 (the Suicide & Crisis Lifeline). You deserve support." },
            ],
          },
          {
            t: "Talking to us, privately",
            d: "What part of your sessions can be just you and us, and where the limits are.",
            read: 3,
            body: [
              "Part of working with us can be just you and your therapist, without a parent in the room.",
              { h: "What that means" },
              "We can talk about stress, mood, relationships, identity, or anything else on your mind. In most cases, what you share stays between us.",
              "There's one honest limit: if you're in danger, or someone else is, we'll help you get support, you won't have to handle it alone. We'll always be upfront with you about that.",
            ],
          },
          {
            t: "Coping skills that actually help",
            d: "Real tools for stress and overwhelm, beyond \"just relax.\"",
            read: 3,
            body: [
              "\"Just relax\" is useless advice. Coping skills are actual tools you practice, and they work better the more you use them.",
              { ul: ["Slow breathing to dial down the panic response", "Naming the feeling, it shrinks it a little", "Moving your body to burn off stress energy", "Texting one person instead of bottling it up"] },
              "Different things work for different people. Therapy is partly about building your own kit, the handful of tools that actually work for you.",
            ],
          },
        ],
      },
    };

    const list = document.getElementById("blogList");
    const titleEl = document.getElementById("blogTitle");
    const eyebrowEl = document.getElementById("blogEyebrow");
    const blogCard = blogModal.querySelector(".blog-card");
    let currentKey = null;

    const blockHTML = (b) => {
      if (typeof b === "string") return "<p>" + b + "</p>";
      if (b.h) return "<h4>" + b.h + "</h4>";
      if (b.ul) return "<ul>" + b.ul.map((li) => "<li>" + li + "</li>").join("") + "</ul>";
      if (b.note) return '<div class="blog-note">' + b.note + "</div>";
      return "";
    };

    const renderList = (key) => {
      const data = BLOGS[key];
      if (!data) return;
      currentKey = key;
      eyebrowEl.textContent = "Blog · " + data.title;
      titleEl.textContent = data.title + ": guides & articles";
      list.innerHTML = data.posts.map((p, i) =>
        '<article class="blog-item"><h4>' + p.t + '</h4><p>' + p.d +
        '</p><a class="blog-read" href="#" data-key="' + key + '" data-idx="' + i + '">Read article →</a></article>'
      ).join("");
      if (blogCard) blogCard.scrollTop = 0;
    };

    const openArticle = (key, idx) => {
      const data = BLOGS[key];
      if (!data || !data.posts[idx]) return;
      const p = data.posts[idx];
      eyebrowEl.textContent = "Blog · " + data.title;
      titleEl.textContent = p.t;
      list.innerHTML =
        '<button class="blog-back" type="button">← All ' + data.title + " articles</button>" +
        '<p class="blog-meta">' + p.read + " min read</p>" +
        '<div class="blog-article">' + p.body.map(blockHTML).join("") + "</div>" +
        '<div class="blog-foot"><p>General information for itrust families, not a substitute for medical advice. ' +
        'For anything urgent, call us, or 911 in an emergency.</p>' +
        '<a class="btn btn-primary" href="#contact" data-bookclose>Book a visit</a></div>';
      if (blogCard) blogCard.scrollTop = 0;
    };

    const openBlog = (key) => {
      if (!BLOGS[key]) return;
      renderList(key);
      blogModal.hidden = false;
      document.body.style.overflow = "hidden";
      const c = document.getElementById("blogClose");
      if (c) c.focus();
    };
    const closeBlog = () => { blogModal.hidden = true; document.body.style.overflow = ""; };

    list.addEventListener("click", (e) => {
      const read = e.target.closest(".blog-read");
      if (read) { e.preventDefault(); openArticle(read.dataset.key, +read.dataset.idx); return; }
      const back = e.target.closest(".blog-back");
      if (back) { renderList(currentKey); return; }
      if (e.target.closest("[data-bookclose]")) { closeBlog(); }
    });

    document.querySelectorAll(".link-arrow[data-blog]").forEach((a) => {
      a.addEventListener("click", (e) => { e.preventDefault(); openBlog(a.getAttribute("data-blog")); });
    });
    const blogCloseBtn = document.getElementById("blogClose");
    if (blogCloseBtn) blogCloseBtn.addEventListener("click", closeBlog);
    blogModal.addEventListener("click", (e) => { if (e.target === blogModal) closeBlog(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !blogModal.hidden) closeBlog(); });
  }

  /* ---- 6. Footer clinic hours: live open/closed badge + today's row ---- */
  const clinicStatus = document.getElementById("clinicStatus");
  const clinicHours = document.getElementById("clinicHours");
  if (clinicStatus && clinicHours) {
    const now = new Date();
    const day = now.getDay();               // 0 = Sun … 6 = Sat
    const hour = now.getHours() + now.getMinutes() / 60;
    let open = false;

    Array.prototype.forEach.call(clinicHours.querySelectorAll("tr"), (row) => {
      const days = (row.getAttribute("data-days") || "").split(",").map(Number);
      if (days.indexOf(day) === -1) return;
      row.classList.add("is-today");
      const o = parseFloat(row.getAttribute("data-open"));
      const c = parseFloat(row.getAttribute("data-close"));
      if (!isNaN(o) && !isNaN(c) && hour >= o && hour < c) open = true;
    });

    clinicStatus.textContent = open ? "Open now" : "Closed";
    clinicStatus.classList.add(open ? "is-open" : "is-closed");
  }

  /* ---- 7. Video spotlight: click-to-play facade (loads embed only on demand) ---- */
  const videoPlayer = document.getElementById("spotlightVideo");
  if (videoPlayer) {
    const playBtn = videoPlayer.querySelector(".video-play");
    const play = () => {
      const embed = (videoPlayer.getAttribute("data-embed") || "").trim();
      if (!embed) {
        const note = videoPlayer.querySelector(".video-note");
        if (note) note.hidden = false;
        if (playBtn) playBtn.style.display = "none";
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.src = embed + (embed.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
      iframe.title = "Video message";
      iframe.className = "video-embed";
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      iframe.setAttribute("allowfullscreen", "");
      videoPlayer.innerHTML = "";
      videoPlayer.appendChild(iframe);
    };
    if (playBtn) playBtn.addEventListener("click", play);
    document.querySelectorAll(".spotlight-watch").forEach((b) => b.addEventListener("click", play));
  }

  /* ---- 4. Contact form → Formspree (AJAX submit, graceful fallback) ---- */
  const showFormError = (form, msg, btn, original) => {
    let el = form.querySelector(".form-error");
    if (!el) {
      el = document.createElement("p");
      el.className = "form-error";
      el.setAttribute("role", "alert");
      if (btn) form.insertBefore(el, btn);
      else form.appendChild(el);
    }
    el.textContent = msg;
    if (btn) { btn.disabled = false; btn.textContent = original; }
  };

  document.querySelectorAll(".contact-form").forEach((form) => {
    if (!form.getAttribute("action")) return; /* not wired - leave alone */
    const btn = form.querySelector('button[type="submit"]');
    let sending = false;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (sending) return; /* guard against double submit (rapid click / Enter) */
      if (!form.reportValidity()) return;
      const original = btn ? btn.textContent : "";
      sending = true;
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      const fail = (msg) => { sending = false; showFormError(form, msg, btn, original); };
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (res.ok) {
            form.classList.add("is-sent");
            form.innerHTML =
              '<div class="form-success" role="status" tabindex="-1"><strong>Thank you. Your request is in.</strong>' +
              '<span>A real person from our team will get back to you, usually the same day.</span></div>';
            const ok = form.querySelector(".form-success");
            if (ok) ok.focus();
            return;
          }
          return res.json().then(
            (data) =>
              fail(
                data && data.errors && data.errors.length
                  ? data.errors.map((x) => x.message).join(" ")
                  : "Something went wrong. Please try again, or call us at 864-520-2020."
              ),
            () => fail("Something went wrong. Please try again, or call us at 864-520-2020.")
          );
        })
        .catch(() =>
          fail("We couldn't send that just now. Please check your connection, or call us at 864-520-2020.")
        );
    });
  });

})();


/* ---- Clinical Services: split explorer (Design 5) tab switching ---- */
(function(){
  function wire(root){
    var items = Array.prototype.slice.call(root.querySelectorAll('.svc-item'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('.svc-panel'));
    if (!items.length) return;
    function activate(i){
      items.forEach(function(b,j){ b.classList.toggle('is-active', j===i); b.setAttribute('aria-selected', j===i ? 'true':'false'); });
      panels.forEach(function(p,j){ var on = (j===i); p.classList.toggle('is-active', on); p.hidden = !on; });
    }
    items.forEach(function(b,i){
      b.addEventListener('click', function(){ activate(i); });
      b.addEventListener('keydown', function(e){
        if (e.key==='ArrowDown' || e.key==='ArrowRight'){ e.preventDefault(); var n=items[(i+1)%items.length]; n.focus(); activate((i+1)%items.length); }
        else if (e.key==='ArrowUp' || e.key==='ArrowLeft'){ e.preventDefault(); var p=(i-1+items.length)%items.length; items[p].focus(); activate(p); }
      });
    });
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ wire(document); });
  else wire(document);
})();
