/* Fisioterapia Tierra — comportamiento de la web.
 *
 * El movimiento de toda la página habla el mismo idioma que el símbolo de la
 * marca: los trazos entran desde fuera del encuadre y se asientan. Por eso
 * casi nada aparece con un fade suelto — el contenido llega desde un borde a
 * través de una ventanilla (.mask) y se detiene.
 *
 * Orden de carga: gsap → ScrollTrigger → este archivo (los tres con defer),
 * así que aquí GSAP ya está disponible si el CDN respondió.
 */

/* Si GSAP no ha cargado, se retira el ocultado preventivo que hace el CSS
   (.js [data-reveal]{opacity:0}) para que el contenido no quede invisible.
   Esto corre antes de DOMContentLoaded, así que no hay parpadeo. */
if(!window.gsap || !window.ScrollTrigger){
  document.documentElement.classList.add('no-motion');
}

(function(){
  'use strict';

  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'power3.out';

  /* ------------------------------------------------------------------ *
   * Utilidad: partir un texto en líneas visuales dentro de ventanillas.
   * Mide dónde rompe el navegador de verdad (offsetTop de cada palabra) en
   * lugar de adivinar, y reconstruye el elemento como .mask > span por línea.
   * Devuelve los spans interiores, que son los que se animan.
   * ------------------------------------------------------------------ */
  function splitLines(el){
    if(el.querySelector('.mask')) {
      // Ya viene partido a mano desde el HTML (h1 del hero, frases).
      return Array.prototype.slice.call(el.querySelectorAll('.mask > span'));
    }
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    if(!text) return [];

    var words = text.split(' ');
    el.textContent = '';
    words.forEach(function(w, i){
      var s = document.createElement('span');
      s.className = 'sl-w';
      s.textContent = w;
      el.appendChild(s);
      if(i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });

    var lines = [], lastTop = null, current = null;
    Array.prototype.forEach.call(el.querySelectorAll('.sl-w'), function(w){
      var top = w.offsetTop;
      if(lastTop === null || Math.abs(top - lastTop) > 2){
        current = [];
        lines.push(current);
        lastTop = top;
      }
      current.push(w.textContent);
    });

    el.textContent = '';
    return lines.map(function(line){
      var mask = document.createElement('span');
      mask.className = 'mask';
      var inner = document.createElement('span');
      inner.textContent = line.join(' ');
      mask.appendChild(inner);
      el.appendChild(mask);
      return inner;
    });
  }

  /* ------------------------------------------------------------------ *
   * Header: se compacta al bajar, se retira al seguir bajando y vuelve al
   * subir. Mantiene --header-h al día para que las anclas no queden tapadas.
   * ------------------------------------------------------------------ */
  function initHeader(){
    var header = document.getElementById('site-header');
    var progress = document.getElementById('read-progress');
    if(!header) return;

    var lastY = window.scrollY;
    var ticking = false;
    var menuOpen = false;

    var wasScrolled = null;

    function syncHeight(){
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }

    function update(){
      var y = window.scrollY;
      var scrolled = y > 24;
      header.classList.toggle('is-scrolled', scrolled);

      // Solo se esconde una vez pasado el hero y nunca con el menú abierto.
      var goingDown = y > lastY + 4;
      var goingUp = y < lastY - 4;
      if(!menuOpen){
        if(goingDown && y > 320) header.classList.add('is-hidden');
        else if(goingUp) header.classList.remove('is-hidden');
      }
      if(goingDown || goingUp) lastY = y;

      if(progress){
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      }
      // offsetHeight fuerza un reflow, así que solo se remide cuando el header
      // cambia de tamaño de verdad (al compactarse), no en cada fotograma.
      if(scrolled !== wasScrolled){
        wasScrolled = scrolled;
        setTimeout(syncHeight, 360);
      }
      ticking = false;
    }

    window.addEventListener('scroll', function(){
      if(!ticking){ ticking = true; requestAnimationFrame(update); }
    }, {passive: true});
    window.addEventListener('resize', syncHeight);

    syncHeight();
    update();

    document.addEventListener('tierra:menu', function(e){
      menuOpen = e.detail.open;
      if(menuOpen) header.classList.remove('is-hidden');
    });

    document.querySelectorAll('[data-year]').forEach(function(el){
      el.textContent = new Date().getFullYear();
    });
  }

  /* ------------------------------------------------------------------ *
   * Menú móvil a pantalla completa: cierra al pulsar un enlace, con Escape
   * y al pasar a escritorio; bloquea el scroll del fondo, atrapa el foco
   * mientras está abierto y lo devuelve al botón al cerrar.
   * ------------------------------------------------------------------ */
  function initMobileNav(){
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('mobile-nav');
    if(!toggle || !menu) return;

    var links = menu.querySelectorAll('a');
    var open = false;

    function announce(){
      document.dispatchEvent(new CustomEvent('tierra:menu', {detail: {open: open}}));
    }

    function openMenu(){
      open = true;
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú');
      document.body.classList.add('no-scroll');
      announce();
      if(window.gsap && !REDUCE){
        gsap.fromTo(menu, {opacity: 0}, {opacity: 1, duration: .28, ease: 'power2.out'});
        gsap.fromTo(menu.querySelectorAll('nav a > span'),
          {yPercent: 110},
          {yPercent: 0, duration: .6, ease: EASE, stagger: .06, delay: .06});
      }
      if(links[0]) links[0].focus();
    }

    function closeMenu(){
      if(!open) return;
      open = false;
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('no-scroll');
      announce();
      toggle.focus();
    }

    toggle.addEventListener('click', function(){ open ? closeMenu() : openMenu(); });
    links.forEach(function(a){ a.addEventListener('click', closeMenu); });

    document.addEventListener('keydown', function(e){
      if(!open) return;
      if(e.key === 'Escape'){ closeMenu(); return; }
      if(e.key !== 'Tab') return;
      // Foco atrapado: el menú tapa la página entera, tabular fuera de él
      // dejaría al teclado navegando contenido que no se ve.
      var first = links[0], last = links[links.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });

    window.matchMedia('(min-width: 900px)').addEventListener('change', function(e){
      if(e.matches) closeMenu();
    });
  }

  /* ------------------------------------------------------------------ *
   * Botón flotante de contacto (móvil): bolita con el símbolo que despliega
   * llamar y WhatsApp. Cierra al tocar fuera, con Escape y al elegir opción.
   * ------------------------------------------------------------------ */
  function initFab(){
    var fab = document.getElementById('fab');
    var btn = document.getElementById('fab-btn');
    if(!fab || !btn) return;
    var ops = fab.querySelectorAll('.fab__op');

    function set(open){
      fab.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Cerrar opciones de contacto' : 'Abrir opciones de contacto');
      // Sin esto los enlaces se pueden tabular con el menu cerrado.
      ops.forEach(function(a){ a.setAttribute('tabindex', open ? '0' : '-1'); });
    }

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      set(!fab.classList.contains('is-open'));
    });
    ops.forEach(function(a){ a.addEventListener('click', function(){ set(false); }); });
    document.addEventListener('click', function(e){
      if(!fab.contains(e.target)) set(false);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') set(false);
    });
  }

  /* ------------------------------------------------------------------ *
   * Revelados. Tres niveles, no uno solo para todo:
   *   data-reveal="lines" → titulares, línea a línea desde su ventanilla
   *   data-reveal="rule"  → pasos del método: la regla se dibuja y sigue el texto
   *   data-reveal         → cuerpo de texto, un desplazamiento corto
   * ------------------------------------------------------------------ */
  function initReveals(){
    var items = document.querySelectorAll('[data-reveal]');

    function showEverything(){
      items.forEach(function(el){ el.style.opacity = 1; });
      document.querySelectorAll('.metodo__step').forEach(function(el){ el.classList.add('is-in'); });
    }

    if(!window.gsap || !window.ScrollTrigger){ showEverything(); return; }
    gsap.registerPlugin(ScrollTrigger);
    if(REDUCE){ showEverything(); return; }

    items.forEach(function(el){
      var kind = el.getAttribute('data-reveal');
      var trigger = {trigger: el, start: 'top 86%', once: true};

      if(kind === 'lines'){
        var lines = splitLines(el);
        gsap.set(el, {opacity: 1});
        gsap.from(lines, {yPercent: 115, duration: .85, ease: EASE, stagger: .08, scrollTrigger: trigger});
        return;
      }

      if(kind === 'rule'){
        gsap.set(el, {opacity: 1});
        ScrollTrigger.create({
          trigger: el, start: 'top 86%', once: true,
          onEnter: function(){ el.classList.add('is-in'); }
        });
        gsap.from(el.children, {opacity: 0, y: 14, duration: .6, ease: EASE, stagger: .07, delay: .18, scrollTrigger: trigger});
        return;
      }

      gsap.fromTo(el, {opacity: 0, y: 16}, {opacity: 1, y: 0, duration: .55, ease: EASE, scrollTrigger: trigger});
    });
  }

  /* ------------------------------------------------------------------ *
   * Frases: el único sitio donde el gesto del símbolo se usa a lo grande.
   * Cada línea llega desde el borde al que está alineada, ligada al scroll.
   * ------------------------------------------------------------------ */
  function initPhrases(){
    var section = document.getElementById('frases');
    if(!section || !window.gsap || !window.ScrollTrigger || REDUCE) return;

    section.querySelectorAll('[data-phrase]').forEach(function(p){
      var inner = p.querySelector('.mask > span');
      if(!inner) return;
      var side = p.getAttribute('data-phrase');
      var from = side === 'left' ? {xPercent: -115} : side === 'right' ? {xPercent: 115} : {yPercent: 115};
      gsap.fromTo(inner, from, {
        xPercent: 0, yPercent: 0, ease: 'none',
        scrollTrigger: {trigger: section, start: 'top 82%', end: 'center 58%', scrub: .6}
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Marquee: gira solo, y acelera y cambia de sentido con el scroll. Es el
   * mismo movimiento horizontal del símbolo, convertido en navegación.
   * ------------------------------------------------------------------ */
  function initMarquee(){
    var marquee = document.getElementById('tratamientos-marquee');
    var track = marquee && marquee.querySelector('[data-marquee-track]');
    if(!track || !window.gsap || !window.ScrollTrigger || REDUCE) return;

    marquee.classList.add('is-js');
    // El track lleva dos copias del listado, así que desplazarlo un 50% deja
    // la segunda copia exactamente donde estaba la primera: el bucle no salta.
    var loop = gsap.to(track, {xPercent: -50, duration: 38, ease: 'none', repeat: -1});

    // Un único sitio decide la velocidad, y todo lo que se anima son números
    // de este objeto — nunca loop.timeScale directamente. Antes había tweens
    // sobre loop.timeScale peleándose con escrituras directas desde el scroll,
    // y el resultado dependía de cuál escribiera el último.
    //   impulso: el acelerón que da el scroll (1 = velocidad de crucero)
    //   freno:   1 va, 0 parado al pasar el puntero por encima
    var mando = {impulso: 1, freno: 1};
    var sentido = 1, asentar, tweenAsentar;

    function aplicar(){
      loop.timeScale(sentido * mando.impulso * mando.freno);
    }

    ScrollTrigger.create({
      trigger: document.body, start: 0, end: 'max',
      onUpdate: function(self){
        var v = self.getVelocity();
        if(v) sentido = v < 0 ? -1 : 1;
        if(tweenAsentar) tweenAsentar.kill();
        // Tope 3,5x. Antes era 7x y a esa velocidad el texto se convierte en
        // una mancha: parecía que el navegador no daba abasto.
        mando.impulso = gsap.utils.clamp(1, 3.5, 1 + Math.abs(v) / 900);
        aplicar();
        clearTimeout(asentar);
        asentar = setTimeout(function(){
          tweenAsentar = gsap.to(mando, {impulso: 1, duration: .9, ease: 'power2.out', onUpdate: aplicar});
        }, 160);
      }
    });

    // Se para al pasar por encima para poder leer y pulsar los tratamientos.
    function frenar(parar){
      gsap.to(mando, {freno: parar ? 0 : 1, duration: .35, ease: 'power2.out',
        onUpdate: aplicar, overwrite: 'auto'});
    }
    marquee.addEventListener('pointerenter', function(){ frenar(true); });
    marquee.addEventListener('pointerleave', function(){ frenar(false); });
    // Redes de seguridad: si el puntero sale por el borde de la ventana o se
    // cambia de pestaña, pointerleave no siempre llega. Sin esto el marquee
    // se quedaba parado para siempre, porque además el gate de pausa impedía
    // que el scroll lo reactivara.
    window.addEventListener('blur', function(){ frenar(false); });
    document.addEventListener('visibilitychange', function(){
      if(document.hidden) frenar(false);
    });
  }

  /* ------------------------------------------------------------------ *
   * Señal de scroll del hero: desaparece en cuanto se empieza a bajar.
   * ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ *
   * Bloque del CTA final: en escritorio se abre al pasar el ratón, pero en
   * táctil no hay hover, así que se abre al tocarlo. Antes la tapa se
   * ocultaba en móvil y las dos tarjetas salían sueltas, sin el botón.
   * ------------------------------------------------------------------ */
  function initDuo(){
    var duo = document.querySelector('.duo');
    var tapa = duo && duo.querySelector('.duo__tapa');
    if(!duo || !tapa) return;
    tapa.addEventListener('click', function(){ duo.classList.add('is-open'); });
    // Si se toca fuera, vuelve a cerrarse para que el bloque siga siendo un
    // botón y no dos tarjetas permanentes.
    document.addEventListener('click', function(e){
      if(!duo.contains(e.target)) duo.classList.remove('is-open');
    });
  }

  function initHeroCue(){
    var cue = document.getElementById('hero-cue');
    if(!cue) return;
    window.addEventListener('scroll', function(){
      cue.classList.toggle('is-gone', window.scrollY > 40);
    }, {passive: true});
  }

  function init(){
    initHeader();
    initMobileNav();
    initFab();
    initReveals();
    initPhrases();
    initMarquee();
    initDuo();
    initHeroCue();
  }
  document.addEventListener('DOMContentLoaded', init);
})();

(function(){
  'use strict';
  function initContactForm(){
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    if(!form || !status) return;

    form.addEventListener('submit', function(evt){
      evt.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      var submitBtn = form.querySelector('button[type="submit"]');
      if(submitBtn) submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.ok){
          status.className = 'form-status is-visible form-status--ok';
          status.textContent = 'Mensaje enviado. Te responderemos lo antes posible.';
          form.reset();
        } else {
          status.className = 'form-status is-visible form-status--error';
          status.textContent = 'No se ha podido enviar: ' + (data.error || 'inténtalo de nuevo.');
        }
      })
      .catch(function(){
        // Sin backend disponible (ej. probando en GitHub Pages/local): caemos
        // a un envío de formulario normal, que en un host con PHP sí funciona.
        form.submit();
      })
      .finally(function(){
        if(submitBtn) submitBtn.disabled = false;
      });
    });

    var params = new URLSearchParams(window.location.search);
    if(params.has('enviado')){
      var ok = params.get('enviado') === '1';
      status.className = 'form-status is-visible ' + (ok ? 'form-status--ok' : 'form-status--error');
      status.textContent = ok ? 'Mensaje enviado. Te responderemos lo antes posible.' : 'No se ha podido enviar el mensaje.';
    }
  }
  document.addEventListener('DOMContentLoaded', initContactForm);
})();

(function(){
  'use strict';
  function initServiciosShowcase(){
    var root = document.getElementById('servicios-showcase');
    var content = document.getElementById('showcase-content');
    if(!root || !content) return;
    var items = root.querySelectorAll('.showcase__item');
    var panels = root.querySelectorAll('.showcase__panel');
    var counter = root.querySelector('[data-showcase-current]');
    var prevBtn = root.querySelector('[data-showcase-prev]');
    var nextBtn = root.querySelector('[data-showcase-next]');
    var mobileCloseBtn = root.querySelector('[data-showcase-mobile-close]');
    var mobileQuery = window.matchMedia('(max-width: 900px)');
    var total = items.length;
    var current = 0;

    // Nombres de los tratamientos, para la navegacion de movil (anterior /
    // siguiente). Se leen de la propia lista, asi no hay que repetirlos.
    var nombres = Array.prototype.map.call(items, function(it){
      var n = it.querySelector('.showcase__item-name');
      return n ? n.textContent.trim() : '';
    });
    var prevName = root.querySelector('[data-showcase-prev-name]');
    var nextName = root.querySelector('[data-showcase-next-name]');
    // El total va en cada ficha para poder pintar "01 / 08" desde el CSS sin
    // repetir el numero en el HTML.
    panels.forEach(function(p){
      var n = p.querySelector('.showcase__panel-num');
      if(n) n.setAttribute('data-total', String(total).padStart(2, '0'));
    });

    function show(index){
      current = (index + total) % total;
      items.forEach(function(it, i){ it.classList.toggle('is-active', i === current); });
      panels.forEach(function(p, i){ p.classList.toggle('is-active', i === current); });
      if(counter) counter.textContent = String(current + 1).padStart(2, '0');
      if(prevName) prevName.textContent = nombres[(current - 1 + total) % total];
      if(nextName) nextName.textContent = nombres[(current + 1) % total];
    }
    var contentParent = content.parentNode;
    var contentNextSibling = content.nextSibling;
    function openMobile(){
      // El contenedor vive dentro de .showcase__inner, que GSAP anima con
      // transform (data-reveal): eso lo convierte en el "containing block"
      // del position:fixed y el overflow:hidden de la sección lo recorta,
      // así que la pantalla completa no llegaba a cubrir la página. Se
      // saca temporalmente al body mientras está abierto.
      document.body.appendChild(content);
      content.classList.add('is-mobile-open');
      document.body.classList.add('no-scroll');
    }
    function closeMobile(){
      content.classList.remove('is-mobile-open');
      document.body.classList.remove('no-scroll');
      contentParent.insertBefore(content, contentNextSibling);
    }
    items.forEach(function(it, i){
      it.addEventListener('click', function(){
        show(i);
        if(mobileQuery.matches) openMobile();
      });
    });
    if(prevBtn) prevBtn.addEventListener('click', function(){ show(current - 1); });
    if(nextBtn) nextBtn.addEventListener('click', function(){ show(current + 1); });
    if(mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobile);

    // Los paneles están ocultos salvo el activo, así que un enlace del tipo
    // servicios.html#osteopatia no llegaba a mostrar nada: hay que abrir el
    // panel que pide el hash. Es lo que usan el marquee y el índice de
    // tratamientos de la página de inicio.
    function openFromHash(){
      var id = window.location.hash.replace('#', '');
      if(!id) return;
      var target = document.getElementById(id);
      if(!target) return;
      var panel = target.closest ? target.closest('.showcase__panel') : null;
      if(!panel) return;
      var index = Array.prototype.indexOf.call(panels, panel);
      if(index < 0) return;
      show(index);
      if(mobileQuery.matches) openMobile();
      else root.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  }
  document.addEventListener('DOMContentLoaded', initServiciosShowcase);
})();

(function(){
  'use strict';
  // Símbolo de marca (torso, 6 trazos) dibujándose desde fuera del encuadre.
  // En el hero de Inicio: aparece grande y centrado; al terminar de dibujarse
  // se desliza a su columna final (derecha) mientras el texto del hero entra
  // línea a línea desde su propia ventanilla.
  function initHeroIntro(){
    var hero = document.getElementById('hero');
    var wrap = document.getElementById('hero-symbol');
    var textEl = hero ? hero.querySelector('.hero__inner') : null;
    if(!hero || !wrap) return;
    var svg = wrap.querySelector('svg');
    var defs = svg && svg.querySelector('[data-ft-clips]');
    var marks = svg && svg.querySelector('[data-ft-marks]');
    if(!defs || !marks) return;

    var VB = { w: 473.89, h: 547 };
    var EXT = 520, SWEEP = 2.6, TIER_DELAY = 0.16, MAXD = 1200;

    var PATHS = [
      'M91.62,116.31H0v22.66h91.62c9.8,0,17.77,7.97,17.77,17.76v352.77h22.66V156.73c0-22.29-18.13-40.42-40.43-40.42Z',
      'M110.81,58.02H0v22.66h110.81c31.34,0,56.83,25.5,56.83,56.84v334.42h22.66V137.52c0-43.83-35.66-79.5-79.49-79.5Z',
      'M121.68,0H0v22.66h121.67c41.46,0,77.26,24.47,93.92,59.7,2.95-9.06,6.69-17.79,11.33-25.94C204.26,22.43,165.52,0,121.68,0Z',
      'M341.85,156.73v315.21h22.66V156.73c0-9.8,7.97-17.76,17.76-17.76h91.62v-22.66h-91.62c-22.28,0-40.41,18.13-40.41,40.42Z',
      'M283.58,137.52v353.2h22.66V137.52c0-31.34,25.5-56.84,56.84-56.84h110.8v-22.66h-110.8c-43.83,0-79.5,35.66-79.5,79.5Z',
      'M352.22,0c-51.09,0-95.39,30.59-115.33,74.32-7.25,15.97-11.33,33.65-11.33,52.34v420.34h22.66V126.66c0-57.32,46.67-104,104-104h121.67V0h-121.67Z'
    ];

    var STROKES = [
      { i: 2, side: 'L', tier: 0, by: 0,      hy: -4,    hh: 95,   hEnd: 240,    vx: null,   vw: 0,    vBottom: 0,     thick: 22.66 },
      { i: 5, side: 'R', tier: 0, by: 0,      hy: -4,    hh: 135,  hEnd: 221.5,  vx: 221.5,  vw: 30.7, vBottom: 551,   thick: 22.66 },
      { i: 1, side: 'L', tier: 1, by: 58.02,  hy: 54,    hh: 30.7, hEnd: 194.3,  vx: 163.6,  vw: 30.7, vBottom: 475.9, thick: 22.66 },
      { i: 4, side: 'R', tier: 1, by: 58.02,  hy: 54,    hh: 30.7, hEnd: 279.6,  vx: 279.6,  vw: 30.7, vBottom: 494.7, thick: 22.66 },
      { i: 0, side: 'L', tier: 2, by: 116.31, hy: 112.3, hh: 30.7, hEnd: 136,    vx: 105.4,  vw: 30.7, vBottom: 513.5, thick: 22.66 },
      { i: 3, side: 'R', tier: 2, by: 116.31, hy: 112.3, hh: 30.7, hEnd: 337.85, vx: 337.85, vw: 30.7, vBottom: 475.9, thick: 22.66 }
    ];

    var NS = 'http://www.w3.org/2000/svg';
    var clamp = function(v, a, b){ return Math.max(a, Math.min(b, v)); };
    var ease = function(t){ return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

    var items = STROKES.map(function(s, k){
      var hLen = s.side === 'L' ? s.hEnd : VB.w - s.hEnd;
      var vLen = s.vx == null ? 0 : s.vBottom - (s.hy + s.hh);

      var clip = document.createElementNS(NS, 'clipPath');
      clip.setAttribute('id', 'hero-ft-clip-' + k);
      var poly = document.createElementNS(NS, 'polygon');
      clip.appendChild(poly);
      defs.appendChild(clip);

      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', PATHS[s.i]);
      path.setAttribute('clip-path', 'url(#hero-ft-clip-' + k + ')');
      marks.appendChild(path);

      var ext = document.createElementNS(NS, 'rect');
      ext.setAttribute('y', s.by);
      ext.setAttribute('height', s.thick);
      marks.appendChild(ext);

      return { s: s, hLen: hLen, vLen: vLen, total: EXT + hLen + vLen, poly: poly, ext: ext };
    });

    var END = (STROKES.length ? 2 * TIER_DELAY : 0) + SWEEP;

    function frame(t){
      items.forEach(function(it){
        var s = it.s;
        var start = s.tier * TIER_DELAY;
        var prog = t <= start ? 0 : t >= start + SWEEP ? 1 : ease((t - start) / SWEEP);
        var h = Math.min(prog * MAXD, it.total);
        var e = clamp(h / EXT, 0, 1);
        var r = clamp(it.hLen ? (h - EXT) / it.hLen : 1, 0, 1);
        var vP = clamp(it.vLen ? (h - EXT - it.hLen) / it.vLen : 0, 0, 1);

        var extW = EXT * Math.max(0, e - r);
        it.ext.setAttribute('width', extW);
        it.ext.setAttribute('x', s.side === 'L' ? -EXT * (1 - r) : VB.w + EXT * (1 - e));

        var hw = r * (s.side === 'L' ? s.hEnd + 4 : VB.w - s.hEnd + 4);
        var bandBottom = s.hy + s.hh;
        var legBottom = s.vx != null ? bandBottom + vP * (s.vBottom - bandBottom) : bandBottom;
        var pts;
        if(s.side === 'L'){
          var head = -4 + hw;
          var edge = vP > 0 ? Math.max(s.vx + s.vw, head) : head;
          pts = [[-4, s.hy], [head, s.hy], [head, bandBottom], [edge, bandBottom], [edge, legBottom], [-4, legBottom]];
        } else {
          var headR = VB.w + 4 - hw;
          var edgeR = vP > 0 ? Math.min(s.vx, headR) : headR;
          pts = [[VB.w + 4, s.hy], [headR, s.hy], [headR, bandBottom], [edgeR, bandBottom], [edgeR, legBottom], [VB.w + 4, legBottom]];
        }
        it.poly.setAttribute('points', pts.map(function(p){ return p[0].toFixed(2) + ',' + p[1].toFixed(2); }).join(' '));
      });
    }

    // El viewBox original deja mucho margen vacío alrededor del símbolo (lo
    // necesitan los trazos para "crecer" desde fuera del encuadre). getBBox()
    // mide la geometría completa de los paths sin tener en cuenta el
    // clip-path que los revela, así que podemos recortar el encuadre al
    // símbolo real desde YA — el símbolo mantiene siempre el mismo tamaño
    // final, tanto en el momento centrado como al asentarse; lo único que
    // se anima es el dibujo de los trazos y la posición, nunca la escala.
    var bbox = marks.getBBox();
    var FIT_PAD = 30;
    var FIT_VB = [bbox.x - FIT_PAD, bbox.y - FIT_PAD, bbox.width + FIT_PAD * 2, bbox.height + FIT_PAD * 2];
    svg.setAttribute('viewBox', FIT_VB.join(' '));

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Las líneas del h1 vienen ya envueltas en .mask desde el HTML.
    var titleLines = hero.querySelectorAll('.hero__title .mask > span');
    var restEls = [hero.querySelector('.eyebrow'), hero.querySelector('.hero__lead'), hero.querySelector('.hero__actions')].filter(Boolean);

    if(reduce || !window.gsap){
      frame(END);
      if(textEl) textEl.style.opacity = 1;
      return;
    }

    // Por debajo de 900px el hero apila texto/símbolo en columna (ver CSS),
    // así que el símbolo se desliza hacia abajo (eje Y) en vez de hacia la
    // derecha (eje X); el texto queda arriba en ambos casos.
    var narrow = window.innerWidth < 900;

    frame(0);
    gsap.set(textEl, {opacity: 1});
    // El CSS solo oculta el titular con opacity (ver styles.css): el
    // desplazamiento inicial lo pone GSAP aquí, para que sea el único dueño
    // del transform y no herede un offset en píxeles que luego no sabría quitar.
    gsap.set(titleLines, {yPercent: 115, y: 0});
    gsap.set(hero.querySelector('.hero__title'), {opacity: 1});
    gsap.set(restEls, {opacity: 0, y: 14});

    var heroRect = hero.getBoundingClientRect();
    var wrapRect = wrap.getBoundingClientRect();
    var axisProp = narrow ? 'y' : 'x';
    var offset = narrow
      ? (heroRect.height / 2) - ((wrapRect.top - heroRect.top) + wrapRect.height / 2)
      : (heroRect.width / 2) - ((wrapRect.left - heroRect.left) + wrapRect.width / 2);
    var setVars = {};
    setVars[axisProp] = offset;
    gsap.set(wrap, setVars);

    // El titular entra línea a línea desde su ventanilla, con el mismo gesto
    // con el que acaban de dibujarse los trazos.
    //
    // IMPORTANTE: esto NO puede depender solo de que la cadena de
    // requestAnimationFrame de abajo llegue al final. El CSS oculta el
    // titular desde el primer pintado, así que si esa cadena se corta
    // (pestaña en segundo plano al cargar, rAF ralentizado, un móvil que
    // va justo) el hero se quedaría permanentemente sin texto. Por eso
    // revelar es idempotente y tiene varias vías de entrada, incluida una
    // de seguridad por tiempo.
    var textStarted = false;
    function revealHeroText(){
      if(textStarted) return;
      textStarted = true;
      gsap.to(titleLines, {yPercent: 0, y: 0, duration: .9, ease: 'power3.out', stagger: .09});
      gsap.to(restEls, {opacity: 1, y: 0, duration: .7, ease: 'power3.out', stagger: .09, delay: .18});
    }
    // Red de seguridad: pase lo que pase con la animación, a los 5 s hay texto.
    // Por encima del momento normal de entrada (~3,4 s: los 2,9 s de dibujado
    // de los trazos más parte del deslizamiento), para no robarle el turno.
    var failsafe = setTimeout(revealHeroText, 5000);
    // Si alguien empieza a bajar antes de que acabe la intro, el hero tiene
    // que estar legible ya: no se le hace esperar a una animación.
    window.addEventListener('scroll', function onFirstScroll(){
      window.removeEventListener('scroll', onFirstScroll);
      clearTimeout(failsafe);
      revealHeroText();
    }, {passive: true, once: true});

    // Las dos partes se solapan en vez de ir una detrás de otra: el símbolo
    // empieza a deslizarse hacia su columna cuando aún le quedan trazos por
    // dibujar, y el titular entra cuando el símbolo ya va de salida. Antes
    // todo iba en serie y el hero se quedaba sin texto ~3,4 s.
    //
    // El titular NO puede entrar antes de que el símbolo le deje el hueco:
    // arranca centrado en el hero y se cruza con la caja del texto (en
    // escritorio por la derecha del h1, en móvil por debajo del bloque).
    //
    // Ese momento NO se puede fijar a ojo: lo que recorre el símbolo y lo que
    // ocupa el texto escalan distinto, así que un umbral fijo que va bien a
    // 1440 px deja el símbolo encima del título a 900 y a 1100. Se despeja del
    // propio recorrido. wrapRect es la posición YA ASENTADA (se midió antes de
    // apartar el símbolo), y en progreso p el símbolo está en offset*(1-p),
    // así que su borde vale wrapRect + offset*(1-p). Imponiendo que ese borde
    // libre el del texto más un margen, sale p >= 1 - (hueco libre al final /
    // recorrido total).
    var SETTLE_AT = END * 0.62;
    var MARGEN = 28;
    // La referencia es el h1, no el bloque entero: es lo que hay que poder
    // leer. En móvil el símbolo solo sube hasta el centro del hero y nunca
    // llega al titular, así que el texto puede entrar mucho antes; medir
    // contra el fondo de los botones retrasaba la entrada sin motivo.
    var TEXT_AT = (function(){
      if(!offset) return 0.2;
      var titulo = hero.querySelector('.hero__title').getBoundingClientRect();
      var holguraFinal = narrow
        ? wrapRect.top - titulo.bottom - MARGEN
        : wrapRect.left - titulo.right - MARGEN;
      return clamp(1 - (holguraFinal / -offset), 0.2, 0.95);
    })();
    var settleStarted = false;

    var t0 = null;
    function tick(ts){
      if(t0 === null) t0 = ts;
      var t = (ts - t0) / 1000;
      frame(Math.min(t, END));

      if(!settleStarted && t >= SETTLE_AT){
        settleStarted = true;
        var toVars = {duration: 1.1, ease: 'power3.inOut', onUpdate: function(){
          if(this.progress() >= TEXT_AT){
            clearTimeout(failsafe);
            revealHeroText();
          }
        }};
        toVars[axisProp] = 0;
        gsap.to(wrap, toVars);
      }

      if(t < END) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  document.addEventListener('DOMContentLoaded', initHeroIntro);
})();
