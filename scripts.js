const nav = document.getElementById("nav");

window.addEventListener(
  "scroll",
  () => nav.classList.toggle("scrolled", scrollY > 60),
  { passive: true },
);

const mm = document.getElementById("mobileMenu");

document.getElementById("menuToggle").addEventListener("click", () => {
  mm.classList.add("active");
  document.body.style.overflow = "hidden";
});

document.getElementById("menuClose").addEventListener("click", closeMM);
function closeMM() {
  mm.classList.remove("active");
  document.body.style.overflow = "";
}
const ro = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("on");
        ro.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".reveal").forEach((el) => ro.observe(el));

const GALLERY = [
  {
    alt: "Stand Bagó Neuronovo",
    base: "stand-corporativo-01",
    ext: "jpg",
    width: 1086,
    height: 1448,
    widths: [400, 800, 1086],
  },
  {
    alt: "Stand La Victoria",
    base: "stand-corporativo-02",
    ext: "jpg",
    width: 1086,
    height: 1448,
    widths: [400, 800, 1086],
  },
  {
    alt: "Stand Lindsay",
    base: "stand-corporativo-03",
    ext: "jpg",
    width: 1086,
    height: 1448,
    widths: [400, 800, 1086],
  },
  {
    alt: "Activación Rappi Velo",
    base: "stand-corporativo-04",
    ext: "jpg",
    width: 1600,
    height: 900,
    widths: [400, 800, 1200, 1600],
  },
  {
    alt: "Stand Aperol Spritz",
    base: "stand-corporativo-05",
    ext: "jpg",
    width: 1086,
    height: 1448,
    widths: [400, 800, 1086],
  },
];

const imgs = GALLERY.map((item) => ({
  alt: item.alt,
  src: `./media/${item.base}.${item.ext}`,
  srcset: item.widths
    .map((w) => `./media/${item.base}-${w}.webp ${w}w`)
    .join(", "),
  sizes: `min(78vw, ${Math.round((76 * item.width) / item.height)}vh)`,
  width: item.width,
  height: item.height,
}));

let cur = 0;
const lbEl = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbSource = document.getElementById("lbSource");
const lbCount = document.getElementById("lbCount");
const lbDots = document.getElementById("lbDots");

imgs.forEach((_, i) => {
  const d = document.createElement("div");
  d.className = "lb-dot";
  d.onclick = () => goLB(i);
  lbDots.appendChild(d);
});

function updateDots(i) {
  lbDots
    .querySelectorAll(".lb-dot")
    .forEach((d, idx) => d.classList.toggle("active", idx === i));
}

function showLB(i) {
  const img = imgs[i];
  cur = i;
  lbSource.sizes = img.sizes;
  lbSource.srcset = img.srcset;
  lbImg.width = img.width;
  lbImg.height = img.height;
  lbImg.alt = img.alt;
  lbImg.src = img.src;
  lbCount.textContent = "0" + (i + 1) + " / 0" + imgs.length;
  updateDots(i);
}

function lb(i) {
  showLB(i);
  lbEl.classList.add("open");
  document.body.style.overflow = "hidden";
}

function goLB(i) {
  showLB(i);
}

function closeLB() {
  lbEl.style.opacity = "0";
  lbEl.style.transition = "opacity 0.25s";
  setTimeout(() => {
    lbEl.classList.remove("open");
    lbEl.style.opacity = "";
    lbEl.style.transition = "";
    document.body.style.overflow = "";
  }, 250);
}

function moveLB(d) {
  cur = (cur + d + imgs.length) % imgs.length;
  lbImg.style.opacity = "0";
  lbImg.style.transform = "scale(0.96)";
  lbImg.style.transition = "opacity 0.18s,transform 0.18s";
  setTimeout(() => {
    showLB(cur);
    lbImg.style.opacity = "1";
    lbImg.style.transform = "scale(1)";
    setTimeout(() => {
      lbImg.style.transition = "";
    }, 200);
  }, 180);
}

lbEl.addEventListener("click", (e) => {
  if (e.target === lbEl) closeLB();
});

document.addEventListener("keydown", (e) => {
  if (!lbEl.classList.contains("open")) return;
  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowRight") moveLB(1);
  if (e.key === "ArrowLeft") moveLB(-1);
});

let tx = 0;

lbEl.addEventListener(
  "touchstart",
  (e) => {
    tx = e.changedTouches[0].screenX;
  },
  { passive: true },
);

lbEl.addEventListener(
  "touchend",
  (e) => {
    const d = tx - e.changedTouches[0].screenX;
    if (Math.abs(d) > 50) moveLB(d > 0 ? 1 : -1);
  },
  { passive: true },
);

const heroLeft = document.querySelector(".hero-left");

if (heroLeft && matchMedia("(min-width:768px)").matches) {
  window.addEventListener(
    "scroll",
    () => {
      if (scrollY < innerHeight * 1.2)
        heroLeft.style.transform = `translateY(${scrollY * 0.06}px)`;
    },
    { passive: true },
  );
}
