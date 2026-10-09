(() => {
  "use strict";

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  const getFocusable = (container) =>
    Array.from(container.querySelectorAll(focusableSelector)).filter(
      (element) => !element.hasAttribute("hidden"),
    );

  const trapFocus = (event, container) => {
    if (event.key !== "Tab") return;

    const focusable = getFocusable(container);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const setPageLocked = (locked) => {
    document.body.classList.toggle("is-locked", locked);
  };

  const initNavigation = () => {
    const nav = document.getElementById("nav");
    const menu = document.getElementById("mobileMenu");
    const menuToggle = document.getElementById("menuToggle");
    const menuClose = document.getElementById("menuClose");

    if (nav) {
      const updateNav = () => nav.classList.toggle("scrolled", scrollY > 48);
      updateNav();
      window.addEventListener("scroll", updateNav, { passive: true });
    }

    if (!menu || !menuToggle || !menuClose) return;

    let previousFocus = null;

    const openMenu = () => {
      previousFocus = document.activeElement;
      menu.classList.add("active");
      menu.setAttribute("aria-hidden", "false");
      menuToggle.setAttribute("aria-expanded", "true");
      setPageLocked(true);
      menuClose.focus();
    };

    const closeMenu = ({ restoreFocus = true } = {}) => {
      menu.classList.remove("active");
      menu.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
      setPageLocked(false);

      if (restoreFocus && previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };

    menuToggle.addEventListener("click", openMenu);
    menuClose.addEventListener("click", () => closeMenu());

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        const target = link.hash ? document.querySelector(link.hash) : null;
        closeMenu({ restoreFocus: false });

        if (!target) return;

        requestAnimationFrame(() => {
          const hadTabIndex = target.hasAttribute("tabindex");
          if (!hadTabIndex) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          if (!hadTabIndex) {
            target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
              once: true,
            });
          }
        });
      });
    });

    document.addEventListener("keydown", (event) => {
      if (!menu.classList.contains("active")) return;
      if (event.key === "Escape") closeMenu();
      trapFocus(event, menu);
    });
  };

  const initRevealAnimations = () => {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("on"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("on");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    elements.forEach((element) => observer.observe(element));
  };

  const initGallery = () => {
    const items = Array.from(document.querySelectorAll("[data-gallery-item]"));
    const lightbox = document.getElementById("lightbox");
    const image = document.getElementById("lbImg");
    const source = document.getElementById("lbSource");
    const count = document.getElementById("lbCount");
    const dots = document.getElementById("lbDots");
    const closeButton = lightbox?.querySelector("[data-lightbox-close]");
    const previousButton = lightbox?.querySelector("[data-lightbox-previous]");
    const nextButton = lightbox?.querySelector("[data-lightbox-next]");

    if (
      !items.length ||
      !lightbox ||
      !image ||
      !source ||
      !count ||
      !dots ||
      !closeButton ||
      !previousButton ||
      !nextButton
    ) {
      return;
    }

    const gallery = items.map((item) => {
      const itemImage = item.querySelector("img");
      const itemSource = item.querySelector("source");

      return {
        alt: itemImage?.alt || "Trabajo realizado por LUVA Comunicación",
        src: itemImage?.currentSrc || itemImage?.src || "",
        srcset: itemSource?.srcset || "",
        sizes: "(max-width: 560px) 92vw, 78vw",
        width: itemImage?.width || 1200,
        height: itemImage?.height || 900,
      };
    });

    let currentIndex = 0;
    let previousFocus = null;
    let touchStartX = 0;

    const dotButtons = gallery.map((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lb-dot";
      button.setAttribute("aria-label", `Ver imagen ${index + 1}`);
      button.addEventListener("click", () => show(index));
      dots.appendChild(button);
      return button;
    });

    const updateDots = () => {
      dotButtons.forEach((button, index) => {
        const active = index === currentIndex;
        button.classList.toggle("active", active);
        button.setAttribute("aria-current", active ? "true" : "false");
      });
    };

    const show = (index) => {
      currentIndex = (index + gallery.length) % gallery.length;
      const item = gallery[currentIndex];

      source.sizes = item.sizes;
      source.srcset = item.srcset;
      image.width = item.width;
      image.height = item.height;
      image.alt = item.alt;
      image.src = item.src;
      count.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`;
      updateDots();
    };

    const open = (index, trigger) => {
      previousFocus = trigger;
      show(index);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      setPageLocked(true);
      closeButton.focus();
    };

    const close = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      setPageLocked(false);

      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };

    items.forEach((item, index) => {
      item.addEventListener("click", () => open(index, item));
    });

    closeButton.addEventListener("click", close);
    previousButton.addEventListener("click", () => show(currentIndex - 1));
    nextButton.addEventListener("click", () => show(currentIndex + 1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });

    lightbox.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].screenX;
      },
      { passive: true },
    );

    lightbox.addEventListener(
      "touchend",
      (event) => {
        const distance = touchStartX - event.changedTouches[0].screenX;
        if (Math.abs(distance) > 50) show(currentIndex + (distance > 0 ? 1 : -1));
      },
      { passive: true },
    );

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("open")) return;

      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") show(currentIndex + 1);
      if (event.key === "ArrowLeft") show(currentIndex - 1);
      trapFocus(event, lightbox);
    });
  };

  const initContactForm = () => {
    const form = document.querySelector("[data-contact-form]");
    const service = document.getElementById("servicio");
    const status = document.getElementById("formStatus");
    const startedAt = document.getElementById("formStartedAt");
    const submitButton = form?.querySelector("button[type='submit']");
    const requestedService = new URLSearchParams(location.search).get("servicio");
    const allowedServices = ["personal", "evento", "comunicacion", "otro"];

    const applyRequestedService = () => {
      if (service && allowedServices.includes(requestedService)) {
        service.value = requestedService;
      }
    };

    const refreshStartTime = () => {
      if (startedAt) startedAt.value = String(Date.now());
    };

    applyRequestedService();
    refreshStartTime();

    if (!form || !status || !submitButton) return;

    form.querySelectorAll("[data-date-mask]").forEach((input) => {
      input.addEventListener("input", () => {
        const caret = input.selectionStart ?? input.value.length;
        const digitsBeforeCaret = input.value.slice(0, caret).replace(/\D/g, "").length;
        const digits = input.value.replace(/\D/g, "").slice(0, 8);
        const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
        const formatted = parts.join("-");

        if (formatted === input.value) return;
        input.value = formatted;

        let position = 0;
        let seenDigits = 0;
        while (position < formatted.length && seenDigits < digitsBeforeCaret) {
          if (/\d/.test(formatted[position])) seenDigits += 1;
          position += 1;
        }
        input.setSelectionRange(position, position);
      });
    });

    const defaultButtonLabel = submitButton.textContent;

    const clearFieldErrors = () => {
      form.querySelectorAll(".field-error").forEach((error) => error.remove());
      form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
        field.removeAttribute("aria-invalid");
        const errorId = `error-${field.name}`;
        const describedBy = (field.getAttribute("aria-describedby") || "")
          .split(" ")
          .filter((id) => id && id !== errorId);

        if (describedBy.length) {
          field.setAttribute("aria-describedby", describedBy.join(" "));
        } else {
          field.removeAttribute("aria-describedby");
        }
      });
    };

    const showFieldErrors = (errors = {}) => {
      let firstInvalidField = null;

      Object.entries(errors).forEach(([name, message]) => {
        const field = form.elements.namedItem(name);
        if (!(field instanceof HTMLElement)) return;

        const container = field.closest(".form-field");
        if (!container) return;

        const error = document.createElement("span");
        const errorId = `error-${name}`;
        error.className = "field-error";
        error.id = errorId;
        error.textContent = message;
        container.appendChild(error);

        field.setAttribute("aria-invalid", "true");
        const describedBy = new Set(
          (field.getAttribute("aria-describedby") || "").split(" ").filter(Boolean),
        );
        describedBy.add(errorId);
        field.setAttribute("aria-describedby", Array.from(describedBy).join(" "));
        firstInvalidField ||= field;
      });

      firstInvalidField?.focus();
    };

    const showStatus = (message, state, focus = false) => {
      status.textContent = message;
      status.className = `form-status is-${state}`;
      if (focus) status.focus();
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearFieldErrors();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      submitButton.textContent = "Enviando…";
      showStatus("Estamos enviando tu consulta…", "loading");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("La respuesta del servidor no es JSON.");
        }

        const result = await response.json();
        if (!response.ok || !result.success) {
          showFieldErrors(result.errors);
          showStatus(
            result.message || "No pudimos enviar la consulta. Revisá los datos e intentá nuevamente.",
            "error",
            !result.errors || Object.keys(result.errors).length === 0,
          );
          return;
        }

        form.reset();
        applyRequestedService();
        refreshStartTime();

        const successUrl = form.dataset.successUrl;
        if (successUrl) {
          showStatus(result.message, "success");
          window.location.assign(successUrl);
          return;
        }

        showStatus(result.message, "success", true);
      } catch (error) {
        console.error("No se pudo enviar el formulario:", error);
        showStatus(
          "No pudimos enviar la consulta. Intentá nuevamente o escribinos por WhatsApp.",
          "error",
          true,
        );
      } finally {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
        submitButton.textContent = defaultButtonLabel;
      }
    });
  };

  initNavigation();
  initRevealAnimations();
  initGallery();
  initContactForm();
})();
