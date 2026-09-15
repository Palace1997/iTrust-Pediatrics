/* itrust Pediatrics — Future edition · shared behaviors */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- 1. Scroll reveal ---- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- 2. Active nav ---- */
  var here = (location.pathname.split("/").pop() || "index.html");
  $$(".main-nav a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === here || (here === "" && href === "index.html")) a.setAttribute("aria-current", "page");
  });

  /* ---- 3. Mobile drawer ---- */
  var drawer = $("#moreDrawer"), trigger = $(".more-trigger");
  function openDrawer() { if (drawer) { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); if (trigger) trigger.setAttribute("aria-expanded", "true"); } }
  function closeDrawer() { if (drawer) { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); if (trigger) trigger.setAttribute("aria-expanded", "false"); } }
  if (trigger) trigger.addEventListener("click", openDrawer);
  if (drawer) $$("[data-close]", drawer).forEach(function (el) { el.addEventListener("click", closeDrawer); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  /* ---- 4. Accordions (concerns + faq) ---- */
  function wireAccordion(barSel, qSel, openClass) {
    $$(barSel).forEach(function (bar) {
      var q = $(qSel, bar);
      if (!q) return;
      q.addEventListener("click", function () {
        var isOpen = bar.classList.toggle(openClass);
        q.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
  }
  wireAccordion(".concern", ".concern-q", "open");
  wireAccordion(".faq-bar", ".faq-q", "open");

  /* ---- 5. Team filter ---- */
  var chips = $$(".team-chip");
  if (chips.length) {
    var tiles = $$(".team-tile, .provider-card");
    var empty = $(".team-empty");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
        chip.classList.add("active"); chip.setAttribute("aria-pressed", "true");
        var f = chip.getAttribute("data-filter");
        var shown = 0;
        tiles.forEach(function (t) {
          var spec = t.getAttribute("data-spec") || "";
          var match = f === "all" || spec.indexOf(f) > -1;
          t.classList.toggle("hide", !match);
          if (match) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
      });
    });
  }

  /* ---- 6. Video spotlight (click-to-play facade) ---- */
  var vp = $("#spotlightVideo");
  if (vp) {
    var playBtn = $(".video-play", vp);
    function play() {
      var embed = (vp.getAttribute("data-embed") || "").trim();
      if (!embed) {
        var note = $(".video-note", vp);
        if (note) note.hidden = false;
        if (playBtn) playBtn.style.display = "none";
        return;
      }
      var iframe = document.createElement("iframe");
      iframe.src = embed + (embed.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
      iframe.title = "Video message"; iframe.className = "video-embed";
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      iframe.setAttribute("allowfullscreen", "");
      vp.innerHTML = ""; vp.appendChild(iframe);
    }
    if (playBtn) playBtn.addEventListener("click", play);
    $$(".spotlight-watch").forEach(function (b) { b.addEventListener("click", play); });
  }

  /* ---- 7. Accessibility toolbar (persisted) ---- */
  var a11yOpen = $("#a11yOpen"), a11yPanel = $("#a11yPanel");
  var A11Y_KEY = "itrust-a11y";
  function loadA11y() {
    try {
      var saved = JSON.parse(localStorage.getItem(A11Y_KEY) || "[]");
      saved.forEach(function (m) { document.documentElement.classList.add("a11y-" + m); });
      $$(".a11y-opt").forEach(function (o) {
        if (saved.indexOf(o.getAttribute("data-a11y")) > -1) o.setAttribute("aria-pressed", "true");
      });
    } catch (e) {}
  }
  function saveA11y() {
    var modes = $$(".a11y-opt").filter(function (o) { return o.getAttribute("aria-pressed") === "true"; })
      .map(function (o) { return o.getAttribute("data-a11y"); });
    try { localStorage.setItem(A11Y_KEY, JSON.stringify(modes)); } catch (e) {}
  }
  loadA11y();
  if (a11yOpen && a11yPanel) {
    a11yOpen.addEventListener("click", function () { a11yPanel.hidden = !a11yPanel.hidden; });
    var a11yClose = $("#a11yClose");
    if (a11yClose) a11yClose.addEventListener("click", function () { a11yPanel.hidden = true; });
    $$(".a11y-opt").forEach(function (opt) {
      opt.addEventListener("click", function () {
        var mode = opt.getAttribute("data-a11y");
        var on = opt.getAttribute("aria-pressed") !== "true";
        opt.setAttribute("aria-pressed", on ? "true" : "false");
        document.documentElement.classList.toggle("a11y-" + mode, on);
        saveA11y();
      });
    });
    var a11yReset = $("#a11yReset");
    if (a11yReset) a11yReset.addEventListener("click", function () {
      $$(".a11y-opt").forEach(function (o) {
        o.setAttribute("aria-pressed", "false");
        document.documentElement.classList.remove("a11y-" + o.getAttribute("data-a11y"));
      });
      saveA11y();
    });
  }

  /* ---- 8. Clinic status + hours ---- */
  var statusEl = $("#clinicStatus"), hoursTable = $("#clinicHours");
  if (statusEl && hoursTable) {
    var now = new Date();
    var day = now.getDay(), hour = now.getHours() + now.getMinutes() / 60;
    var open = false;
    $$("tr", hoursTable).forEach(function (tr) {
      var days = (tr.getAttribute("data-days") || "").split(",");
      var o = parseFloat(tr.getAttribute("data-open")), c = parseFloat(tr.getAttribute("data-close"));
      if (days.indexOf(String(day)) > -1 && !isNaN(o) && !isNaN(c) && hour >= o && hour < c) open = true;
    });
    statusEl.textContent = open ? "Open now" : "Closed";
    statusEl.classList.add(open ? "open" : "closed");
  }
})();
