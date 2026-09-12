(function(){
  'use strict';

  // Coordenadas propias, trazadas a mano siguiendo el lenguaje de curvas de nivel
  // del manual de marca (ver docs/brief/, página "Vinilos cristales"): líneas
  // paralelas onduladas + un núcleo concéntrico, nunca geometría perfecta.
  var VARIANTS = {
    hero: [
      'M -20,120 C 120,60 260,180 400,110 C 540,40 680,150 820,90',
      'M -20,180 C 120,120 260,240 400,170 C 540,100 680,210 820,150',
      'M -20,240 C 120,180 260,300 400,230 C 540,160 680,270 820,210',
      'M -20,300 C 120,240 260,360 400,290 C 540,220 680,330 820,270',
      'M 300,60 C 340,140 260,200 300,280 C 330,340 380,360 420,420'
    ],
    divider: [
      'M -20,40 C 200,0 400,80 600,30 C 800,-20 1000,60 1220,20',
      'M -20,70 C 200,30 400,110 600,60 C 800,10 1000,90 1220,50',
      'M -20,100 C 200,60 400,140 600,90 C 800,40 1000,120 1220,80'
    ],
    metodo: [
      'M 40,260 C 160,60 320,60 400,220 C 460,340 620,340 680,180 C 720,80 860,60 940,200'
    ],
    corner: [
      'M 0,0 C 60,40 60,120 20,180 C -10,225 -10,280 30,320',
      'M 30,0 C 90,45 90,130 45,195 C 12,242 12,300 55,345',
      'M 60,0 C 120,50 120,140 70,210 C 34,259 34,320 80,370',
      'M 90,0 C 150,55 150,150 95,225 C 56,276 56,340 105,395'
    ]
  };

  function inject(container, variant, extraClass){
    var paths = VARIANTS[variant];
    if(!paths || !container) return null;
    var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','topo-lines' + (extraClass ? ' ' + extraClass : ''));
    svg.setAttribute('viewBox', variant === 'metodo' ? '0 0 980 400' : (variant === 'corner' ? '0 0 140 400' : '0 0 800 400'));
    svg.setAttribute('preserveAspectRatio','none');
    svg.setAttribute('aria-hidden','true');
    paths.forEach(function(d){
      var p = document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d', d);
      svg.appendChild(p);
    });
    container.appendChild(svg);
    return svg;
  }

  function drawOnScroll(svg){
    if(!svg || !window.gsap || !window.ScrollTrigger) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var paths = svg.querySelectorAll('path');
    paths.forEach(function(path, i){
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = reduce ? 0 : len;
      if(reduce) return;
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.6,
        delay: i * 0.08,
        ease: 'power1.out',
        scrollTrigger: { trigger: svg, start: 'top 85%', once: true }
      });
    });
  }

  function initAll(){
    document.querySelectorAll('[data-topo]').forEach(function(el){
      var variant = el.getAttribute('data-topo');
      var extraClass = el.getAttribute('data-topo-color') ? 'topo-lines--' + el.getAttribute('data-topo-color') : '';
      var svg = inject(el, variant, extraClass);
      drawOnScroll(svg);
    });
  }

  window.TierraTopo = { inject: inject, drawOnScroll: drawOnScroll };
  document.addEventListener('DOMContentLoaded', initAll);
})();

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
          status.textContent = 'Mensaje enviado. Te responderemos lo antes posible.';
          status.className = 'form-status is-visible form-status--ok';
          form.reset();
        } else {
          status.textContent = 'No se ha podido enviar: ' + (data.error || 'inténtalo de nuevo.');
          status.className = 'form-status is-visible form-status--error';
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
      status.textContent = ok ? 'Mensaje enviado. Te responderemos lo antes posible.' : 'No se ha podido enviar el mensaje.';
      status.className = 'form-status is-visible ' + (ok ? 'form-status--ok' : 'form-status--error');
    }
  }
  document.addEventListener('DOMContentLoaded', initContactForm);
})();
