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

const imgs = [
  {
    src: "data:image/jpeg;base64,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",
    alt: "Stand Bagó Neuronovo",
  },
  {
    src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCAWoBD4DASIAAhEBAxEB/8QAVRAAAgEDAwIEAwUGBQoFBQAAQQIDAAQRBRIhMUEGE1FhFCJxBzKBkaEVI0JSscEzYtEWJHLh8ENTgpKiJTRjsvFEc3SDkxc1NmSElMLSJkVUVaPi/8QAGwEAAwEBAQEBAAAAAAAAAAAAAAECAwQFBgf/xAA7EQACAgEEAQMDAgQFBAICAgMAAQIRAwQSITFBEyJRBTJhFHEjM4GRQqGxwfAkNFLRFeFicvEGNUOC/9oADAMBAAIRAxEAPwClSOoQ5Ga0stWuLDzlt9iiQYYlQ3HtnpWbuBonKrLG4/mQ5FBoGjmOVB+tcaKVEYTZyJPdl2xxklQf6U3e+W0hmCW1rPHcLt3Srkp9OciksUAuLgFIwG/ydamubVosrMpEh6Z4NTcozTTI1aDtEn0dTcDW4LqRSmIWt3A2N7g9a3h8PX1ysL26ibzidsaHLge4+lJC5QhXGMVefD3i55ZES+ZzNEmyG4hADD2YdGFZ9TLNFbsasKFPhhkUQ0jSPKkG2Q9R3B9KpOoMHkZ270/8Taq9zJy2STkn1qp3cjE4Bp2NPar7NIBc4INQWgzKB71PIcgitbRCZlA9a1p1EHyPLomGyVVIKvjPrW8WGhUN0xQ2oE/u0PXFblZPhk2DOOtZapBx7I7mMyEBOOaYXTra2UMTkjPJIGcY/tQunhpZcOOAaY3d3LZMs1ldPHMBtKqvBHvnr9KGT8FT6A9I1uewvYbq0uY451JUOwyuDwcj0qHV7SS1vXiu/L3t8+6NgysG5BBHahZizztcPtMjHccKACfoOK8H+IDSHr0NGopO0IUa5Nm0y7Ewt5GjRQ7OoyoU9CSOldI0LX/AB5Z6BYy6nN8bc2o2rAU2ugyeAOjAepqm+G/2hcXAtLQyOsvDxK+N6jkjmpPFdpZW2ovDp9vcwooG5LgYYH0HtWfJJZMixz/AH//AJL3Ncoaw3tlr+uXCpYSmGdy0awv80Q9+2Pam2uXV1a2i2dncrHBGuVRCM4Gep4OaR+BJdPsr0SX0rQSlhsnz8sY56j/AKFaeJLo6ne3MluxuYlcgXKxkbvf0FY8mK86Ve1EbuP5JoFg1l5bllSWaKAtOry7N2O6Dufaq7qN2hAS3QpEOQucmo5zJbBS4ZQR8pIIyPahVjmuXYo6hevzHFbseJJ3fAtsOjv4zCqQx4mBB8zdjBHTFWjSdA1zxbLFd3l2kqOfLFxNIPlx/CVHOfSqdYxb5vIC/PIcK2cAH6060rUbrRHlRtmG+WSKUBlf6j+9Xk9vES4teTq3h/wtHonx8WqLDcwSxBVwCd47jHY1y2G2OoeILfR5ibSAXBjAk+UxpnoffHAp54Z8V3EF35eo3skdjNkbx83knsQD29RQ1tpS634ruC2oJeoTua5jBXco9BxzV4s+WmsqWyPXyXFJfadFvNHsIGt7bTJLa3MUewqRnC+p7bvr61z/AMX3V1Zaq8enXuV24O5QCfUGujSR6fZ+G3itLiCONFysjtgu4x15yTXHdSN3fX7SmNvmPJzkY+tBlxN6hZ4fa0W25R2giW1xdWzkAK4PU/xVZPs9074jVYW1LesMb/KVBwX4wpNDWyLHAEB5x1rqml2dj/s5DHolwk6xpnMZH7x8DO7uDmtuHHNx3xXK8A5EoqmNUt7o3b41FyDyIWiUhRx3xk1Hbo1v8TJJpcYL5 [truncated for length]",
    alt: "Stand La Victoria",
  },
  {
    src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCAWoBD4DASIAAhEBAxEB/8QAHAAAAgIDAQEAAAAAAAAAAAAABAUDBgECBwAI/8QAVRAAAgEDAwIEBAMFBQQIAwATAQIDAAQRBRIhMUETIlFhBhRxgTKRoQcjQrHBFTNSYtEkcuHwFkNTY4KSorIlNPEmNURkc3TCVIPSFzaEk6NVlLPi/8QAGwEAAwEBAQEBAAAAAAAAAAAAAAECAwQFBgf/xAA0EQACAgICAQQCAgEDAwQCAwAAAQIRAyESMUEEEyJRMmEFcRRCgaEjUpEVM7HwwdFD4fH/2gAMAwEAAhEDEQA/AOVBXHvV0IRwQxwe1DgGrEBBr6JnkLsySMjIqoIc4FFu6letUE4bIpIbIbQOvWtH2qwgEE1kYBbBpklIUmpCMjBq8oBWfyosdEVbAxirFDSDAqokdqtil2HI6ikxoHcFWIIxitiTAxRhWO45bytQs0BjPByKEwaIq9FwvwBmgcGrYt2RQ0EXse2oYrRxhVo+etLbEvgYOcUxnfEI7NXNJbN41QquYMzhcYzVbWrbufwimsAjm5k/EO9VXzpDkAcYqlJ3Qml2Ipo9jY7VgjO3NbmfceKlA2Dg1v4MdWVMpHUVjdOlFsuQMioOinrSTBoFFbXg5q1I8t7CskXJqiaLEPkJrPxDIqp22rgVqKXaeelKirL0PmANXsjIKoDruzirWl3DmoaLRZHcuCBu6Uwhun7N0pQuGPBomNjjg8UnFAmxt83kbs89xWvmwenWk8k2DxmtxzMDk1Htlcx9HNuIzVni7GHNKUudoyKtF1vx61m4FqR0EFzkcmt+IDSqKUoRk9aISYhgDyDWTiXyG0G01eY8HIoPTwJXIJxinVsiTyBM9Kxlo1jsM06LxURTXTQoEjVR2FK9NtDG4J5UdKbdq5pu2apG6ytVupGZUWbFbrWM0AYpJHNb7VnSsoAysrKygDKysrKAMrKysoAysrKygDKysrKAMrKysoA1W6ysoAysrKygDKzFZWFhQBlZWA1lAGVlZmsJoAyszitMcVU74oA3I/FDO9bkehpHqkI3I4xQ8klad+KGkenQG5H96ElerHbAoKWTnrVJCZCZ+DS6d+cUXI+aAuOp+laxIYJN4YbLHpSjVLhU3HdnPQDtTIxSSYZX496SazbSLkoCa6sVXswndaEsx8zADOe9UAMGxjmmdnpV3cKHEbBSeop5YaANsm9WJIxu9PpXS8sYnOsbkcbKMtxVWMV2n/R1QxzyOxFUX2gx28bOyZyOvpQs8boTwyORrKJuoFjc7Cdvv1FDkV0LezF6I1lbxWCihWbHAqDHJrZzWsUUDZHFbqSozsFUZJ6VK4t5IGAkXGRkUWTTKTWjUiDWsUAarVb5rMUICNZW8VJI2c4UZpiIYrMUdBptxK6KEOCetOzoWyIkAYA+9ZyyRiawxuRy2DWU1m02Y4CLxmlsqGNyhPI61UZJ9Eyi49kK1WzWqok0aysIrMUgLImwwokvjpQYq1W45qWi4y0WPISKy3kw3NUsc9K3GpLChrQKTctD2xO7mmCnil+nA7MEUf0rgydndDo2TUGrZNRNZUaEGqNSNaAoA3WVmK3SA0a1UiK1igCOK0amRWsUAQNaNTIqLcVSQmQNQJqROagQc1okQyp2ycVNV8ta8PnNS6CrJNMvFUMoGc1ex44oS4YjpVRFIgAu7FFR9Bg0vUktk0bbckelVJaJi9h8fSpgorwKwmuZo6EarVSAreKQACmrFUscCqwKm [truncated for length]",
    alt: "Stand Lindsay",
  },
  {
    src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCAKjBLADASIAAhEBAxEB/8QAHAAAAQUBAQEAAAAAAAAAAAAAAQACAwQFBgcI/8QAUhAAAgEDAwEFBAYGBQoFAgUFAQIDAAQRBSESMQYTQVFhInGBkbEUMkKhwdEHIzNSYnIVJHOy4fAlNENTY4KS8RY1dKLCJkSDNlRkkxezRtJFVaP/xAAbAQACAwEBAQAAAAAAAAAAAAAAAQIDBAUGB//EADcRAAICAQQABQIFAwMFAAMBAAABAgDRAwQSITFBBRMiUWEUIzJxgaGRscEVQtHw8OEkMkNS/9oADAMBAAIRAxEAPwAlSOoQ5Ga0stWuLDzlt9iiQYYlQ3HtnpWbuBonKrLG4/mQ5FBoGjmOVB+tcaKVEYTZyJPdl2xxklQf6U3e+W0hmCW1rPHcLt3Srkp9OciksUAuLgFIwG/ydamubVosrMpEh6Z4NTcozTTI1aDtEn0dTcDW4LqRSmIWt3A2N7g9a3h8PX1ysL26ibzidsaHLge4+lJC5QhXGMVefD3i55ZES+ZzNEmyG4hADD2YdGFZ9TLNFbsasKFPhhkUQ0jSPKkG2Q9R3B9KpOoMHkZ270/8Taq9zJy2STkn1qp3cjE4Bp2NPar7NIBc4INQWgzKB71PIcgitbRCZlA9a1p1EHyPLomGyVVIKvjPrW8WGhUN0xQ2oE/u0PXFblZPhk2DOOtZapBx7I7mMyEBOOaYXTra2UMTkjPJIGcY/tQunhpZcOOAaY3d3LZMs1ldPHMBtKqvBHvnr9KGT8FT6A9I1uewvYbq0uY451JUOwyuDwcj0qHV7SS1vXiu/L3t8+6NgysG5BBHahZizztcPtMjHccKACfoOK8H+IDSHr0NGopO0IUa5Nm0y7Ewt5GjRQ7OoyoU9CSOldI0LX/AB5Z6BYy6nN8bc2o2rAU2ugyeAOjAepqm+G/2hcXAtLQyOsvDxK+N6jkjmpPFdpZW2ovDp9vcwooG5LgYYH0HtWfJJZMixz/AH//AJL3Ncoaw3tlr+uXCpYSmGdy0awv80Q9+2Pam2uXV1a2i2dncrHBGuVRCM4Gep4OaR+BJdPsr0SX0rQSlhsnz8sY56j/AKFaeJLo6ne3MluxuYlcgXKxkbvf0FY8mK86Ve1EbuP5JoFg1l5bllSWaKAtOry7N2O6Dufaq7qN2hAS3QpEOQucmo5zJbBS4ZQR8pIIyPahVjmuXYo6hevzHFbseJJ3fAtsOjv4zCqQx4mBB8zdjBHTFWjSdA1zxbLFd3l2kqOfLFxNIPlx/CVHOfSqdYxb5vIC/PIcK2cAH6060rUbrRHlRtmG+WSKUBlf6j+9Xk9vES4teTq3h/wtHonx8WqLDcwSxBVwCd47jHY1y2G2OoeILfR5ibSAXBjAk+UxpnoffHAp54Z8V3EF35eo3skdjNkbx83knsQD29RQ1tpS634ruC2oJeoTua5jBXco9BxzV4s+WmsqWyPXyXFJfadFvNHsIGt7bTJLa3MUewqRnC+p7bvr61z/AMX3V1Zaq8enXuV24O5QCfUGujSR6fZ+G3itLiCONFysjtgu4x15yTXHdSN3fX7SmNvmPJzkY+tBlxN6hZ4fa0W25R2giW1xdWzkAK4PU/xVZPs9074jVYW1LesMb/KVBwX4wpNDWyLHAEB5x1rqml2dj/s5DHolwk6xpnMZH7x8DO7uDmtuHHNx3xXK8A5EoqmNUt7o3b41FyDyIWiUhRx3xk1Hbo1v8TJJpcYL5 [truncated for length]",
    alt: "Activación Rappi Velo",
  },
  {
    src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCAWoBD4DASIAAhEBAxEB/8QAHAAAAQUBAQEAAAAAAAAAAAAAAQACAwQFBgcI/8QAVBAAAgEDAgMFBAYGBggFAwALAQIDAAQRBSESMUEGE1FhcSKBkbEUMkKhwdEHIzNSYnIVJHOy4fAlNENTY4KS8RY1dKLCJkSDNlRkkxezRtJFVaP/xAAbAQACAwEBAQAAAAAAAAAAAAAAAQIDBAUGB//EADcRAAICAQQABQIFAwMFAAMBAAABAgDRAwQSITFBBRMiUWEUIzJxgaGRscEV8ONS0fAkMkNT/9oADAMBAAIRAxEAPwClSOoQ5Ga0stWuLDzlt9iiQYYlQ3HtnpWbuBonKrLG4/mQ5FBoGjmOVB+tcaKVEYTZyJPdl2xxklQf6U3e+W0hmCW1rPHcLt3Srkp9OciksUAuLgFIwG/ydamubVosrMpEh6Z4NTcozTTI1aDtEn0dTcDW4LqRSmIWt3A2N7g9a3h8PX1ysL26ibzidsaHLge4+lJC5QhXGMVefD3i55ZES+ZzNEmyG4hADD2YdGFZ9TLNFbsasKFPhhkUQ0jSPKkG2Q9R3B9KpOoMHkZ270/8Taq9zJy2STkn1qp3cjE4Bp2NPar7NIBc4INQWgzKB71PIcgitbRCZlA9a1p1EHyPLomGyVVIKvjPrW8WGhUN0xQ2oE/u0PXFblZPhk2DOOtZapBx7I7mMyEBOOaYXTra2UMTkjPJIGcY/tQunhpZcOOAaY3d3LZMs1ldPHMBtKqvBHvnr9KGT8FT6A9I1uewvYbq0uY451JUOwyuDwcj0qHV7SS1vXiu/L3t8+6NgysG5BBHahZizztcPtMjHccKACfoOK8H+IDSHr0NGopO0IUa5Nm0y7Ewt5GjRQ7OoyoU9CSOldI0LX/AB5Z6BYy6nN8bc2o2rAU2ugyeAOjAepqm+G/2hcXAtLQyOsvDxK+N6jkjmpPFdpZW2ovDp9vcwooG5LgYYH0HtWfJJZMixz/AH//AJL3Ncoaw3tlr+uXCpYSmGdy0awv80Q9+2Pam2uXV1a2i2dncrHBGuVRCM4Gep4OaR+BJdPsr0SX0rQSlhsnz8sY56j/AKFaeJLo6ne3MluxuYlcgXKxkbvf0FY8mK86Ve1EbuP5JoFg1l5bllSWaKAtOry7N2O6Dufaq7qN2hAS3QpEOQucmo5zJbBS4ZQR8pIIyPahVjmuXYo6hevzHFbseJJ3fAtsOjv4zCqQx4mBB8zdjBHTFWjSdA1zxbLFd3l2kqOfLFxNIPlx/CVHOfSqdYxb5vIC/PIcK2cAH6060rUbrRHlRtmG+WSKUBlf6j+9Xk9vES4teTq3h/wtHonx8WqLDcwSxBVwCd47jHY1y2G2OoeILfR5ibSAXBjAk+UxpnoffHAp54Z8V3EF35eo3skdjNkbx83knsQD29RQ1tpS634ruC2oJeoTua5jBXco9BxzV4s+WmsqWyPXyXFJfadFvNHsIGt7bTJLa3MUewqRnC+p7bvr61z/AMX3V1Zaq8enXuV24O5QCfUGujSR6fZ+G3itLiCONFysjtgu4x15yTXHdSN3fX7SmNvmPJzkY+tBlxN6hZ4fa0W25R2giW1xdWzkAK4PU/xVZPs9074jVYW1LesMb/KVBwX4wpNDWyLHAEB5x1rqml2dj/s5DHolwk6xpnMZH7x8DO7uDmtuHHNx3xXK8A5EoqmNUt7o3b41FyDyIWiUhRx3xk1Hbo1v8TJJpcYL5 [truncated for length]",
    alt: "Stand Aperol Spritz",
  },
];

let cur = 0;
const lbEl = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
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

function lb(i) {
  cur = i;
  lbImg.src = imgs[i].src;
  lbImg.alt = imgs[i].alt;
  lbCount.textContent = "0" + (i + 1) + " / 0" + imgs.length;
  updateDots(i);
  lbEl.classList.add("open");
  document.body.style.overflow = "hidden";
}

function goLB(i) {
  cur = i;
  lbImg.src = imgs[i].src;
  lbImg.alt = imgs[i].alt;
  lbCount.textContent = "0" + (i + 1) + " / 0" + imgs.length;
  updateDots(i);
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
    lbImg.src = imgs[cur].src;
    lbImg.alt = imgs[cur].alt;
    lbCount.textContent = "0" + (cur + 1) + " / 0" + imgs.length;
    updateDots(cur);
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
