(function () {
  "use strict";

  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("overlay");
  var menuBtn = document.getElementById("menuBtn");
  var closeBtn = document.getElementById("sidebarClose");

  if (menuBtn && sidebar && overlay) {
    function openNav() {
      sidebar.classList.add("is-open");
      overlay.classList.add("is-open");
      menuBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeNav() {
      sidebar.classList.remove("is-open");
      overlay.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    menuBtn.addEventListener("click", openNav);
    if (closeBtn) closeBtn.addEventListener("click", closeNav);
    overlay.addEventListener("click", closeNav);
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeNav();
    });
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el, target, duration, formatter) {
    if (!el) return;
    var start = performance.now();
    var from = 0;
    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var v = from + (target - from) * easeOutCubic(t);
      el.textContent = formatter ? formatter(v) : String(Math.round(v));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var donut = document.querySelector(".om-donut__fill");
  var pctEl = document.querySelector(".om-donut__pct");
  if (donut && pctEl) {
    var targetPct = parseInt(pctEl.getAttribute("data-target"), 10) || 85;
    donut.style.setProperty("--om-progress", "0");
    requestAnimationFrame(function () {
      donut.style.setProperty("--om-progress", String(targetPct / 100));
    });
    animateCount(pctEl, targetPct, 1000, function (n) {
      return String(Math.round(n));
    });
  }

  var relNum = document.querySelector(".om-rel-num");
  if (relNum) {
    var relTarget = parseInt(relNum.getAttribute("data-target"), 10) || 78;
    animateCount(relNum, relTarget, 900, function (n) {
      return String(Math.round(n));
    });
  }

  var chartArea = document.querySelector(".om-chart__area");
  var chartLine = document.querySelector(".om-chart__line");
  if (chartArea && chartLine) {
    var w = 400;
    var h = 120;
    var pad = 8;
    var vals = [0.35, 0.55, 0.42, 0.68, 0.5, 0.62, 0.45];
    var n = vals.length;
    var step = (w - pad * 2) / (n - 1);
    var pts = vals.map(function (v, i) {
      var x = pad + i * step;
      var y = pad + (1 - v) * (h - pad * 2);
      return [x, y];
    });
    var lineD =
      "M " +
      pts
        .map(function (p) {
          return p[0] + "," + p[1];
        })
        .join(" L ");
    var areaD =
      lineD +
      " L " +
      (pad + (n - 1) * step) +
      "," +
      h +
      " L " +
      pad +
      "," +
      h +
      " Z";
    chartLine.setAttribute("d", lineD);
    chartArea.setAttribute("d", areaD);
  }

  var observed = document.querySelectorAll(".om-bar, .om-scale");
  if (observed.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    observed.forEach(function (el) {
      io.observe(el);
    });
  } else {
    observed.forEach(function (el) {
      el.classList.add("is-inview");
    });
  }
})();
