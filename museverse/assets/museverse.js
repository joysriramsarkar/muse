/* ============================================================
   মিউজভার্স — shared interactions
   ============================================================ */
(() => {
  "use strict";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  /* ---------- mobile nav ---------- */
  const burger = $(".mv-burger");
  const nav = $(".mv-nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  }

  /* ---------- reveal on scroll ---------- */
  const revealItems = $$("[data-reveal]");
  if (revealItems.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revealItems.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealItems.forEach((el) => io.observe(el));
    }
  }

  /* ---------- animated counters ---------- */
  const counters = $$("[data-count]");
  if (counters.length) {
    const bn = (n) => Number(n).toLocaleString("bn-BD");
    const animate = (el) => {
      const target = Number(el.dataset.count) || 0;
      if (reduce) { el.textContent = bn(target); return; }
      const start = performance.now();
      const dur = 1400;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = bn(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => { el.textContent = "০"; io.observe(el); });
    } else {
      counters.forEach(animate);
    }
  }

  /* ---------- hub filter + search ---------- */
  const grid = $("#pageGrid");
  if (grid) {
    const cards = $$(".page-card", grid);
    const tabs = $$("[data-filter]");
    const search = $("#pageSearch");
    const countEl = $("#resultCount");
    const empty = $("#emptyState");
    let cat = "all";

    const apply = () => {
      const q = (search ? search.value : "").trim().toLowerCase();
      let n = 0;
      cards.forEach((card) => {
        const okCat = cat === "all" || card.dataset.cat === cat;
        const hay = (card.dataset.search || "") + " " + card.textContent.toLowerCase();
        const okQ = !q || hay.toLowerCase().includes(q);
        const show = okCat && okQ;
        card.hidden = !show;
        if (show) n++;
      });
      if (countEl) countEl.textContent = n.toLocaleString("bn-BD");
      if (empty) empty.hidden = n > 0;
    };

    const activate = (value, push) => {
      cat = value || "all";
      tabs.forEach((t) => {
        const on = t.dataset.filter === cat;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-pressed", String(on));
      });
      apply();
      if (push && cat !== "all") {
        history.replaceState(null, "", "#" + cat);
      } else if (push) {
        history.replaceState(null, "", location.pathname + location.search);
      }
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.dataset.filter, true));
    });
    if (search) {
      search.addEventListener("input", apply);
      document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== search && !/input|textarea|select/i.test(document.activeElement.tagName)) {
          e.preventDefault();
          search.focus();
        }
      });
    }

    const hash = location.hash.replace("#", "");
    if (hash && tabs.some((t) => t.dataset.filter === hash)) activate(hash, false);
    else activate("all", false);

    window.addEventListener("hashchange", () => {
      const h = location.hash.replace("#", "");
      if (h && tabs.some((t) => t.dataset.filter === h)) activate(h, false);
      else if (!h) activate("all", false);
    });
  }

  /* ---------- random page ---------- */
  $$("[data-random]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const cards = $$(".page-card");
      if (!cards.length) return;
      const pick = cards[Math.floor(Math.random() * cards.length)];
      if (pick && pick.href) location.href = pick.href;
    });
  });

  /* ---------- copy buttons ---------- */
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = $(btn.dataset.copy);
      if (!target) return;
      const text = target.textContent || "";
      const label = btn.dataset.label || btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "কপি হয়েছে ✓";
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); btn.textContent = "কপি হয়েছে ✓"; }
        catch { btn.textContent = "কপি করা গেল না"; }
        ta.remove();
      }
      setTimeout(() => { btn.textContent = label; }, 1800);
    });
  });

  /* ---------- reading progress ---------- */
  const progress = $("#readProgress");
  if (progress) {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      progress.style.transform = "scaleX(" + p.toFixed(4) + ")";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------- motion specimens ---------- */
  const runDemo = (stage, name) => {
    if (name === "particles") {
      const field = $(".particle-field", stage);
      if (!field) return;
      field.innerHTML = "";
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 44; i++) {
        const dot = document.createElement("i");
        dot.className = "particle js-artifact";
        dot.style.setProperty("--x", (Math.random() * 100).toFixed(2) + "%");
        dot.style.setProperty("--y", (Math.random() * 100).toFixed(2) + "%");
        dot.style.setProperty("--s", (2 + Math.random() * 5).toFixed(1) + "px");
        dot.style.setProperty("--d", (2.4 + Math.random() * 3.2).toFixed(2) + "s");
        dot.style.setProperty("--delay", (-Math.random() * 4).toFixed(2) + "s");
        dot.style.setProperty("--dx", (Math.random() * 90 - 45).toFixed(0) + "px");
        frag.appendChild(dot);
      }
      field.appendChild(frag);
    }

    if (name === "confetti") {
      const field = $(".confetti-field", stage);
      if (!field) return;
      field.innerHTML = "";
      const colors = ["var(--accent)", "var(--accent-2)", "var(--ink)", "var(--muted)"];
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 70; i++) {
        const bit = document.createElement("i");
        bit.className = "confetti-bit js-artifact";
        bit.style.setProperty("--x", (Math.random() * 100).toFixed(2) + "%");
        bit.style.setProperty("--r", (Math.random() * 360).toFixed(0) + "deg");
        bit.style.setProperty("--c", colors[i % colors.length]);
        bit.style.setProperty("--d", (1.5 + Math.random() * 1.8).toFixed(2) + "s");
        bit.style.setProperty("--delay", (Math.random() * 0.35).toFixed(2) + "s");
        bit.style.setProperty("--w", (4 + Math.random() * 6).toFixed(0) + "px");
        frag.appendChild(bit);
      }
      field.appendChild(frag);
      setTimeout(() => { field.innerHTML = ""; }, 4200);
    }

    if (name === "cursor-trail") {
      const field = $(".trail-field", stage);
      if (!field) return;
      field.innerHTML = "";
      if (!stage.dataset.trailBound) {
        stage.dataset.trailBound = "1";
        stage.addEventListener("pointermove", (e) => {
          if (reduce) return;
          const r = stage.getBoundingClientRect();
          const dot = document.createElement("i");
          dot.className = "trail-dot js-artifact";
          dot.style.left = (e.clientX - r.left) + "px";
          dot.style.top = (e.clientY - r.top) + "px";
          dot.style.setProperty("--h", String(Math.round(Math.random() * 60)));
          field.appendChild(dot);
          setTimeout(() => dot.remove(), 950);
        });
      }
    }

    if (name === "parallax") {
      if (!stage.dataset.parallaxBound) {
        stage.dataset.parallaxBound = "1";
        stage.addEventListener("pointermove", (e) => {
          const r = stage.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          stage.style.setProperty("--mx", x.toFixed(3));
          stage.style.setProperty("--my", y.toFixed(3));
        });
        stage.addEventListener("pointerleave", () => {
          stage.style.setProperty("--mx", "0");
          stage.style.setProperty("--my", "0");
        });
      }
    }
  };

  $$("[data-motion-stage]").forEach((stage) => {
    const shell = stage.closest(".motion-shell");
    const replay = shell ? $("[data-replay]", shell) : null;
    const pause = shell ? $("[data-pause]", shell) : null;
    const speed = shell ? $("[data-speed]", shell) : null;
    const speedVal = shell ? $(".speed-val", shell) : null;
    const demo = stage.dataset.demo || "";

    const run = () => {
      stage.classList.remove("run", "is-paused");
      $$(".js-artifact", stage).forEach((n) => n.remove());
      void stage.offsetWidth;
      stage.classList.add("run");
      if (pause) { pause.textContent = "থামাও"; pause.setAttribute("aria-pressed", "false"); }
      if (demo) runDemo(stage, demo);
    };

    if (!reduce) run();
    else stage.classList.add("run");

    if (replay) replay.addEventListener("click", run);
    if (pause) {
      pause.addEventListener("click", () => {
        const paused = stage.classList.toggle("is-paused");
        pause.textContent = paused ? "চালাও" : "থামাও";
        pause.setAttribute("aria-pressed", String(paused));
      });
    }
    if (speed) {
      speed.addEventListener("input", () => {
        stage.style.setProperty("--speed", speed.value);
        if (speedVal) speedVal.textContent = Number(speed.value).toFixed(1) + "×";
      });
    }
  });

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear().toLocaleString("bn-BD");
  });
})();
