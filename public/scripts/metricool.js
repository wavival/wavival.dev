// Metricool web tracker. Loaded as a same-origin file so the CSP needs no
// inline-script hash. The ClientRouter swaps pages without a full load, so
// every client-side navigation is reported as its own page view.
(() => {
  if (window.__metricoolLoaded) return;
  window.__metricoolLoaded = true;
  const track = () => window.beTracker?.t({ hash: "d1d332b33e1afb7c28e17dddc2b2cee0" });
  const script = document.createElement("script");
  script.src = "https://tracker.metricool.com/resources/be.js";
  script.async = true;
  script.onload = () => {
    track();
    document.addEventListener("astro:after-swap", track);
  };
  document.head.appendChild(script);
})();
