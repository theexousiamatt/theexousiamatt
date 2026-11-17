
(function () {
  "use strict";
  // Replace these empty strings with Astro's confirmed links before opening bookings.
  const SETTINGS = { bookingUrl: "", xUrl: "", linkedInUrl: "" };
  const root = document.documentElement;
  const dialog = document.getElementById("contactDialog");
  const toggles = document.querySelectorAll("[data-theme-toggle]");
  function syncTheme() {
    const dark = root.dataset.theme === "dark";
    toggles.forEach(function (el) {
      el.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      el.setAttribute("aria-pressed", String(dark));
    });
  }
  syncTheme();
  toggles.forEach(function (button) {
    button.addEventListener("click", function () {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("astropsd-theme", next); } catch (error) {}
      syncTheme();
    });
  });
  document.querySelectorAll("[data-booking]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (SETTINGS.bookingUrl) {
        window.open(SETTINGS.bookingUrl, "_blank", "noopener,noreferrer");
      } else if (dialog) {
        dialog.showModal();
      }
    });
  });
  document.querySelectorAll("[data-social]").forEach(function (link) {
    const url = link.getAttribute("data-social") === "x" ? SETTINGS.xUrl : SETTINGS.linkedInUrl;
    if (url) { link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer"; }
    else { link.removeAttribute("href"); link.setAttribute("aria-disabled","true"); link.setAttribute("title","Social profile link is being connected"); }
  });
  if (dialog) {
    const close = dialog.querySelector("[data-close-dialog]");
    if (close) close.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
    const form = dialog.querySelector("form");
    if (form) form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const message = "Project enquiry for AstroPSD\n\nName: " + String(data.get("name") || "") +
        "\nEmail: " + String(data.get("email") || "") + "\n\n" + String(data.get("brief") || "");
      const status = dialog.querySelector(".dialog-message");
      try {
        await navigator.clipboard.writeText(message);
        status.textContent = "Copied. Share this with Astro when the contact link is connected.";
      } catch (error) {
        window.prompt("Copy your project enquiry:", message);
        status.textContent = "Your project enquiry is ready to share.";
      }
    });
  }
  document.querySelectorAll("[data-back-top]").forEach(function (button) {
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  });
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const reveal = Array.from(document.querySelectorAll(".reveal"));
    reveal.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight + 100) el.classList.add("pending-reveal");
    });
    root.classList.add("motion-ready");
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .04 });
    reveal.forEach(function (el) { observer.observe(el); });
  }
})();
