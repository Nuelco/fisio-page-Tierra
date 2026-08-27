(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===========================================================
     1. NAV MÓVIL (overlay a pantalla completa)
        La clase "nav-open" vive en <body>: controla el overlay,
        la metamorfosis del botón (2 líneas -> X) y el scroll.
     =========================================================== */
  const toggle = $(".header__toggle");
  const nav = $("#nav-menu");
  if (toggle && nav) {
    const closeNav = () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    };
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", closeNav));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) closeNav();
    });
  }

  /* ===========================================================
     2. LOGO: apertura del símbolo
        Se anima moviendo el atributo SVG "transform" (no CSS),
        para que funcione en cualquier dispositivo (Safari iOS no
        anima "transform" CSS sobre SVG de forma fiable). Es
        independiente de GSAP: siempre funciona.

        Cada trazo (.spine-mark) sale desde su lateral (izquierda
        o derecha según en qué mitad del viewBox esté su bbox) y
        se desliza hasta su posición final, formando el símbolo en
        el centro. El punto de salida y el escalonado NO están
        escritos a mano: se calculan leyendo la geometría real de
        cada trazo (getBBox) respecto al centro del viewBox, así
        el mismo símbolo se abre igual a cualquier tamaño (header,
        divisor o footer) sin mantener valores por trazo.
     =========================================================== */
  function openSpine(spine) {
    if (spine.__opened) return;
    spine.__opened = true;
    const svg = spine.querySelector("svg");
    const marks = $$(".spine-mark", spine);
    const DUR = 700, STAGGER = 0.9, REACH = 90;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const vb = svg && svg.viewBox && svg.viewBox.baseVal;
    const centerX = vb && vb.width ? vb.x + vb.width / 2 : 0;

    marks.forEach((m) => {
      const box = m.getBBox();
      const cx = box.x + box.width / 2;
      const side = cx < centerX ? -1 : 1; // -1 = mitad izquierda, entra desde la izquierda
      const dist = Math.abs(cx - centerX);
      m._from = side * (REACH + dist * 0.35); // cuanto más lejos del centro, más lejos empieza
      m._delay = dist * STAGGER;
      m.setAttribute("transform", "translate(" + m._from.toFixed(2) + " 0)");
      m.style.opacity = "0";
    });
    const t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    function frame(now) {
      const el = now - t0;
      let done = true;
      marks.forEach((m) => {
        let t = (el - m._delay) / DUR;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        if (t < 1) done = false;
        const x = m._from * (1 - easeOut(t));
        m.setAttribute("transform", "translate(" + x.toFixed(2) + " 0)");
        m.style.opacity = Math.min(1, t * 2.5).toFixed(3);
      });
      if (!done) requestAnimationFrame(frame);
      else marks.forEach((m) => m.removeAttribute("transform"));
    }
    requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    document.documentElement.classList.add("js-spine");
    $$(".spine[data-spine]").forEach((spine) => {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            openSpine(entry.target);
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.3 }
      );
      io.observe(spine);
    });
  }

  /* ===========================================================
     3. MOTION SYSTEM (GSAP, progressive enhancement)
        Todo el contenido es visible por defecto en el CSS. Solo si
        GSAP + ScrollTrigger cargaron Y el usuario no pidió menos
        movimiento, añadimos "js-motion" al <html> (el CSS oculta
        el estado inicial bajo ese selector) y GSAP se encarga de
        revelarlo. Si algo falla, el sitio se queda simplemente
        estático y legible: nunca invisible.
     =========================================================== */
  const gsapReady = window.gsap && window.ScrollTrigger && !prefersReducedMotion;

  if (gsapReady) {
    try {
      gsap.registerPlugin(ScrollTrigger);
      document.documentElement.classList.add("js-motion");

      // Revelado por scroll, con escalonado dentro de los grupos
      $$("[data-reveal]").forEach((el, i) => {
        const group = el.closest("[data-reveal-group]");
        gsap.fromTo(
          el,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power4.out",
            delay: group ? (i % 4) * 0.09 : 0,
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      // Parallax suave en los medios marcados con data-parallax="0.12".
      // fromTo simétrico: en el punto medio del recorrido el offset es 0,
      // así la imagen cubre siempre su hueco (el contenedor tiene margen).
      $$("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        gsap.fromTo(el, { yPercent: speed * -33 }, {
          yPercent: speed * 33,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest(".hero, .photo-band, section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Las bandas fotográficas también se desplazan sutilmente
      $$(".photo-band img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: img.closest(".photo-band"), start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

    } catch (err) {
      // Si algo del motion system falla, no debe romper el resto del sitio.
      document.documentElement.classList.remove("js-motion");
    }
  }

  /* ===========================================================
     4. FORMULARIO DE CONTACTO
        Validación en cliente. No hay backend conectado todavía:
        sustituir el TODO por una llamada real antes de publicar.
     =========================================================== */
  const form = $(".contact__form");
  if (form) {
    const status = $(".form-status", form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      $$(".field", form).forEach((field) => {
        const input = $("input, textarea", field);
        if (!input || !input.hasAttribute("required")) return;
        const ok = input.type === "email" ? input.value.includes("@") && input.value.includes(".") : input.value.trim().length > 1;
        field.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        status.textContent = "Revisa los campos marcados antes de enviar.";
        status.classList.remove("is-ok");
        return;
      }
      // TODO: sustituir por el envío real (fetch a un endpoint de contacto).
      status.textContent = "Gracias, he recibido tu solicitud. Te contactaré en breve.";
      status.classList.add("is-ok");
      form.reset();
    });
  }

  /* ===========================================================
     5. AÑO EN EL FOOTER
     =========================================================== */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
