// Aussie Bridge Japan — shared behaviour for sub-pages
(function () {
  var header = document.querySelector('header.site');
  if (header) {
    addEventListener('scroll', function () {
      header.classList.toggle('scrolled', scrollY > 40);
    }, { passive: true });
  }

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    // Stagger: items that sit side by side (cards, steps, FAQ rows) appear one after another.
    document.querySelectorAll('.reveal').forEach(function (el) {
      var p = el.parentElement; if (!p) return;
      var sibs = [].filter.call(p.children, function (c) { return c.classList.contains('reveal'); });
      var i = sibs.indexOf(el);
      if (sibs.length > 1 && i > 0) el.style.transitionDelay = Math.min(i, 6) * 90 + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; el.classList.add('in'); io.unobserve(el);
        // Once shown, hand the element back to its own hover transitions (no delay, normal speed).
        setTimeout(function () { el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 1400);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Banner videos: wide screens only; never for reduced motion or data-saver. The photo stays underneath.
  var vids = document.querySelectorAll("video[data-src]");
  var saveData = navigator.connection && navigator.connection.saveData;
  if (vids.length && "IntersectionObserver" in window && !saveData &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(min-width: 801px)").matches) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; v.addEventListener("playing", function () { v.classList.add("on"); }); }
          var p = v.play(); if (p) p.catch(function () {});
        } else if (v.src) { v.pause(); }
      });
    }, { threshold: 0.4 });
    vids.forEach(function (v) { vio.observe(v); });
  }
})();
