// /head.js

document.write('<link rel="stylesheet" href="/style.css">');

const links = [
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
  },
  {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  },
];

function loadScript({ src, onload }) {
  const el = document.createElement("script");
  el.src = src;
  if (onload) el.onload = onload;
  document.head.appendChild(el);
}

links.forEach((attrs) => {
  const el = document.createElement("link");
  Object.assign(el, attrs);
  document.head.appendChild(el);
});

loadScript({ src: "https://cdn.jsdelivr.net/npm/d3@7" });
loadScript({
  src: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js",
  onload: () =>
    loadScript({
      src: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js",
      onload: () =>
        renderMathInElement(document.body, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
        }),
    }),
});
