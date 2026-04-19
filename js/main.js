// main.js — keep this minimal, add things as you need them

// Highlight the active nav link based on current page
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (
      (href.includes("writing") && path.includes("writing")) ||
      (href.includes("writing") && path.includes("posts/")) ||
      (href.includes("index") &&
        (path.endsWith("/") || path.endsWith("index.html")))
    ) {
      link.classList.add("active");
    }
  });
});
