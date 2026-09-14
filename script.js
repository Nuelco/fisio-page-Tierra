(function(){
  'use strict';
  function initHeader(){
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('mobile-nav');
    if(toggle && menu){
      toggle.addEventListener('click', function(){
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
    document.querySelectorAll('[data-year]').forEach(function(el){
      el.textContent = new Date().getFullYear();
    });
  }
  document.addEventListener('DOMContentLoaded', initHeader);
})();

(function(){
  'use strict';
  function initReveals(){
    if(!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('[data-reveal]');
    if(reduce){
      items.forEach(function(el){ el.style.opacity = 1; });
      return;
    }
    items.forEach(function(el){
      gsap.set(el, {opacity:0, y:24});
      gsap.to(el, {
        opacity:1, y:0, duration:0.9, ease:'power2.out',
        scrollTrigger:{ trigger: el, start:'top 88%', once:true }
      });
    });
  }
  document.addEventListener('DOMContentLoaded', initReveals);
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
    var deck = document.getElementById('showcase-deck');
    var detail = document.getElementById('showcase-detail');
    if(!root || !deck || !detail) return;
    var cards = deck.querySelectorAll('.deck__card-face');
    var panels = detail.querySelectorAll('.showcase__panel');
    var counter = detail.querySelector('[data-showcase-current]');
    var prevBtn = detail.querySelector('[data-showcase-prev]');
    var nextBtn = detail.querySelector('[data-showcase-next]');
    var closeBtn = detail.querySelector('[data-showcase-close]');
    var total = panels.length;
    var current = 0;

    function show(index){
      current = (index + total) % total;
      panels.forEach(function(p, i){ p.classList.toggle('is-active', i === current); });
      if(counter) counter.textContent = String(current + 1).padStart(2, '0');
    }
    function open(index){
      show(index);
      deck.classList.add('is-receded');
      detail.classList.add('is-open');
    }
    function close(){
      deck.classList.remove('is-receded');
      detail.classList.remove('is-open');
    }
    cards.forEach(function(card, i){
      card.addEventListener('click', function(){ open(i); });
    });
    if(closeBtn) closeBtn.addEventListener('click', close);
    if(prevBtn) prevBtn.addEventListener('click', function(){ show(current - 1); });
    if(nextBtn) nextBtn.addEventListener('click', function(){ show(current + 1); });
  }
  document.addEventListener('DOMContentLoaded', initServiciosShowcase);
})();

(function(){
  'use strict';
  // Símbolo de marca (torso, 6 trazos) dibujándose desde fuera del encuadre,
  // igual que la animación de apertura del header en la rama desarrollo.
  // En el hero de Inicio: aparece grande y centrado; al terminar de dibujarse
  // se desliza a su columna final (derecha) mientras el texto del hero aparece.
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
    gsap.set(textEl, {opacity: 0, y: narrow ? -16 : 16});

    var heroRect = hero.getBoundingClientRect();
    var wrapRect = wrap.getBoundingClientRect();
    var axisProp = narrow ? 'y' : 'x';
    var offset = narrow
      ? (heroRect.height / 2) - ((wrapRect.top - heroRect.top) + wrapRect.height / 2)
      : (heroRect.width / 2) - ((wrapRect.left - heroRect.left) + wrapRect.width / 2);
    var setVars = {};
    setVars[axisProp] = offset;
    gsap.set(wrap, setVars);

    var t0 = null;
    function tick(ts){
      if(t0 === null) t0 = ts;
      var t = (ts - t0) / 1000;
      frame(Math.min(t, END));
      if(t < END){
        requestAnimationFrame(tick);
      } else {
        var textStarted = false;
        var toVars = {duration: 1.1, ease: 'power3.inOut', onUpdate: function(){
          if(!textStarted && this.progress() >= 0.65){
            textStarted = true;
            gsap.to(textEl, {opacity: 1, y: 0, duration: 0.9, ease: 'power2.out'});
          }
        }};
        toVars[axisProp] = 0;
        gsap.to(wrap, toVars);
      }
    }
    requestAnimationFrame(tick);
  }
  document.addEventListener('DOMContentLoaded', initHeroIntro);
})();
