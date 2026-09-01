/* itrust Pediatrics — Playful edition · shared behaviors */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* 1. Scroll reveal */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add("in"); }); }

  /* 2. Active nav */
  var here = (location.pathname.split("/").pop() || "index.html");
  $$(".main-nav a").forEach(function (a) {
    var h = a.getAttribute("href");
    if (h === here || (here === "" && h === "index.html")) a.setAttribute("aria-current", "page");
  });

  /* 3. Mobile drawer */
  var drawer = $("#moreDrawer"), trigger = $(".more-trigger");
  function openD() { if (drawer) { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); if (trigger) trigger.setAttribute("aria-expanded", "true"); } }
  function closeD() { if (drawer) { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); if (trigger) trigger.setAttribute("aria-expanded", "false"); } }
  if (trigger) trigger.addEventListener("click", openD);
  if (drawer) $$("[data-close]", drawer).forEach(function (el) { el.addEventListener("click", closeD); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeD(); });

  /* 4. Accordions */
  function wire(barSel, qSel, cls) {
    $$(barSel).forEach(function (bar) {
      var q = $(qSel, bar); if (!q) return;
      q.addEventListener("click", function () {
        var open = bar.classList.toggle(cls);
        q.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }
  wire(".concern", ".concern-q", "open");
  wire(".faq-bar", ".faq-q", "open");

  /* 5. Team filter */
  var chips = $$(".team-chip");
  if (chips.length) {
    var tiles = $$(".team-tile, .provider-card"), empty = $(".team-empty");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
        chip.classList.add("active"); chip.setAttribute("aria-pressed", "true");
        var f = chip.getAttribute("data-filter"), shown = 0;
        tiles.forEach(function (t) {
          var m = f === "all" || (t.getAttribute("data-spec") || "").indexOf(f) > -1;
          t.classList.toggle("hide", !m); if (m) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
      });
    });
  }

  /* 6. Video facade */
  var vp = $("#spotlightVideo");
  if (vp) {
    var playBtn = $(".video-play", vp);
    function play() {
      var embed = (vp.getAttribute("data-embed") || "").trim();
      if (!embed) { var n = $(".video-note", vp); if (n) n.hidden = false; if (playBtn) playBtn.style.display = "none"; return; }
      var f = document.createElement("iframe");
      f.src = embed + (embed.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
      f.title = "Video message"; f.className = "video-embed";
      f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen"); f.setAttribute("allowfullscreen", "");
      vp.innerHTML = ""; vp.appendChild(f);
    }
    if (playBtn) playBtn.addEventListener("click", play);
    $$(".spotlight-watch").forEach(function (b) { b.addEventListener("click", play); });
  }

  /* 7. Clinic status */
  var statusEl = $("#clinicStatus"), hoursTable = $("#clinicHours");
  if (statusEl && hoursTable) {
    var now = new Date(), day = now.getDay(), hour = now.getHours() + now.getMinutes() / 60, open = false;
    $$("tr", hoursTable).forEach(function (tr) {
      var days = (tr.getAttribute("data-days") || "").split(","), o = parseFloat(tr.getAttribute("data-open")), c = parseFloat(tr.getAttribute("data-close"));
      if (days.indexOf(String(day)) > -1 && !isNaN(o) && !isNaN(c) && hour >= o && hour < c) open = true;
    });
    statusEl.textContent = open ? "Open now" : "Closed";
    statusEl.classList.add(open ? "open" : "closed");
  }

  /* 8. Gentle parallax on decorative arches */
  var arches = $$(".arch");
  if (arches.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      arches.forEach(function (a, i) { a.style.transform = "translateY(" + (y * (0.04 + i * 0.02)) + "px)"; });
    }, { passive: true });
  }
})();
