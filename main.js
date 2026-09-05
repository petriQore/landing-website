// Entrance + scroll reveal, nav scroll-spy, scroll progress bar.
// Everything is opt-in and disabled under prefers-reduced-motion.

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".rv"));

  if (reduced || !("IntersectionObserver" in window)) {
    root.classList.add("rv-off");
    revealEls.forEach(function (el) { el.classList.add("on"); });
  } else {
    // Stagger siblings inside marked groups.
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      Array.prototype.slice.call(group.querySelectorAll(":scope > .rv")).forEach(
        function (el, i) {
          el.style.transitionDelay = Math.min(i * 80, 320) + "ms";
        }
      );
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );

    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Nav scroll-spy: highlight the section currently in view.
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".site-header nav a")
  );

  if ("IntersectionObserver" in window && navLinks.length) {
    var sectionIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) sectionIO.observe(section);
    });
  }

  // Scroll progress bar.
  var bar = document.querySelector(".progress");
  var ticking = false;

  function updateProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = max > 0 ? (h.scrollTop / max) * 100 + "%" : "0%";
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateProgress();
})();
