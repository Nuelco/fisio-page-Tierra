# Rediseño Fisioterapia Tierra (anti-plantilla) — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir fisioterapiatierra.es como 4 páginas HTML reales (Inicio, Servicios, Instalaciones, Contacto), escritas a mano sin runtime de componentes, siguiendo el manual de marca oficial, sin fotografía de stock/IA, con formulario de contacto funcional en Hostinger.

**Architecture:** Sitio estático sin build ni framework: 4 archivos `.html` comparten un único `styles.css` y un único `script.js` (GSAP + ScrollTrigger por CDN). Un sistema de líneas topográficas SVG generado desde JS (una sola fuente de verdad de `d` de path, inyectado donde haga falta) sustituye a cualquier imagen decorativa. El formulario de Contacto hace `POST` a `enviar-contacto.php` (PHP `mail()`, sin dependencias), que solo funciona en un host con PHP (Hostinger) — no en local ni en GitHub Pages.

**Tech Stack:** HTML5 semántico, CSS3 (custom properties, `clamp()`, Grid/Flexbox, sin preprocesador), JavaScript vanilla (ES2019+, sin bundler), GSAP 3.12.5 + ScrollTrigger vía `cdnjs.cloudflare.com`, PHP 7+ (`mail()`) para el backend de contacto.

**Spec:** `docs/superpowers/specs/2026-09-12-rediseno-anti-ia-design.md` — argumenta todas las decisiones de alcance; este plan las ejecuta. Fuente literal de todo el copy: `docs/brief/Prompt_Maestro_Fisioterapia_Tierra.txt`. Manual de marca: `docs/brief/Fisioterapia Tierra-manual de identidad.pdf`.

## Global Constraints

- Paleta exclusiva: crema `#ede7da`, terracota `#a56853`, azul grisáceo `#bbcccf`, marrón oscuro `#412f2b`. Ningún otro color.
- Tipografías exclusivas: **Space Mono** (titulares, navegación, números, etiquetas) y **Rethink Sans** (párrafos, formularios). Fuentes ya locales en `assets/fonts/` — nunca cargar Google Fonts.
- Símbolo/logotipo oficiales en `assets/logos/` — nunca redibujar, deformar ni generar con IA. Usar la variante de color correcta según el fondo (ver manual, pág. 16 "Usos incorrectos": nunca logo sobre fondo del mismo color de familia tonal, ni con gradientes/otros colores).
- Ningún texto de contenido se inventa: todo copy sale literal de `docs/brief/Prompt_Maestro_Fisioterapia_Tierra.txt` (título, subtítulos, frases, textos de los 10 tratamientos, método, contacto) — citado inline en cada tarea de este plan para que no haga falta reabrir el brief.
- Cero fotografía de personas/instalaciones (stock o IA): las secciones que la necesitarían se resuelven con tipografía + líneas topográficas + color, y cada hueco futuro se marca `<!-- FOTO PENDIENTE: descripción, ratio esperado, alt sugerido -->`.
- 4 páginas únicamente: `index.html`, `servicios.html`, `instalaciones.html`, `contacto.html`. Sin Sobre-mí/Tarifas/FAQ como páginas. El footer solo enlaza a esas 4 (ver nota en Tarea 4: se omiten "Aviso legal"/"Privacidad" del footer del prompt porque no hay página ni contenido legal aprobado por la clienta — no se inventa).
- Ninguna sección repite el patrón "3/6 tarjetas idénticas". Nada de iconos de librería (Font Awesome/Lucide/Material) — iconografía lineal propia.
- Animaciones: solo reveals, líneas que se dibujan, transiciones suaves, marquee — nunca rebotes/3D/partículas. Todo detrás de `prefers-reduced-motion`.
- `mail()` de contacto solo puede verificarse tras subir a Hostinger (no hay PHP local ni en GitHub Pages) — lo dice explícitamente la Tarea 12.

---

## File Structure

```
index.html                 (reescrito)
servicios.html              (reescrito)
instalaciones.html          (reescrito)
contacto.html                (reescrito)
styles.css                   (nuevo, sustituye estilos inline de x-dc)
script.js                    (nuevo, sustituye support.js/image-slot.js)
enviar-contacto.php          (nuevo)
sitemap.xml                  (nuevo)
robots.txt                   (nuevo)
README.md                    (reescrito)
assets/                      (ya existe: fonts/, logos/, ondas-1/2.png, rrss-*.jpg)

ELIMINAR: support.js, image-slot.js, andrea-retrato-mtlttzxg-96j1.jpg,
pasted-1788460567628-0-mtlv8tw0-7rhc.png, pasted-1788460601435-0-mtlv9jz1-z138.png,
pasted-1788460631717-0-mtlva7c6-lz00.png, pasted-1788460641530-0-mtlvaews-53g8.png,
pasted-1788460661471-0-mtlvauap-630n.png, pasted-1788460682740-0-mtlvbaqw-weod.png,
pasted-1788460685847-0-mtlvbd3t-k1e4.png
```

## Verificación visual (usada en todas las tareas)

No hay framework de tests para un sitio estático. La verificación de cada tarea es un **screenshot con Chrome headless** comparado contra los criterios listados en el paso "Verificar". Comando base (ajustar `--window-size` por breakpoint: `1440,900` desktop, `768,1024` tablet, `390,844` móvil):

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --window-size=1440,900 --screenshot="docs/superpowers/plans/_qa/<nombre>.png" \
  "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/<archivo>.html"
```

Crear la carpeta `docs/superpowers/plans/_qa/` (gitignorada) la primera vez que se use.

---

### Task 1: Limpieza del sitio antiguo + esqueleto de las 4 páginas

**Files:**
- Delete: `support.js`, `image-slot.js`, `andrea-retrato-mtlttzxg-96j1.jpg`, `pasted-1788460567628-0-mtlv8tw0-7rhc.png`, `pasted-1788460601435-0-mtlv9jz1-z138.png`, `pasted-1788460631717-0-mtlva7c6-lz00.png`, `pasted-1788460641530-0-mtlvaews-53g8.png`, `pasted-1788460661471-0-mtlvauap-630n.png`, `pasted-1788460682740-0-mtlvbaqw-weod.png`, `pasted-1788460685847-0-mtlvbd3t-k1e4.png`
- Create: `index.html`, `servicios.html`, `instalaciones.html`, `contacto.html`
- Create: `README.md` (sobrescribir)

**Interfaces:**
- Produces: 4 archivos `.html` con `<head>` boilerplate compartido (sin meta específicos por página — eso lo rellena la Tarea 14) y `<body>` con `<a class="skip-link">`, `<header id="site-header">` vacío (lo rellena la Tarea 4) y `<main>` vacío con un comentario `<!-- TODO Tarea N: contenido -->` marcando qué tarea lo completa, y `<footer id="site-footer">` vacío (Tarea 4).
- Consumes: nada (primera tarea).

- [ ] **Step 1: Eliminar los archivos del runtime x-dc y las fotos de stock**

```bash
cd "/c/Users/djman/Documents/Proyectos/fisio-page-Tierra"
git rm support.js image-slot.js \
  andrea-retrato-mtlttzxg-96j1.jpg \
  pasted-1788460567628-0-mtlv8tw0-7rhc.png \
  pasted-1788460601435-0-mtlv9jz1-z138.png \
  pasted-1788460631717-0-mtlva7c6-lz00.png \
  pasted-1788460641530-0-mtlvaews-53g8.png \
  pasted-1788460661471-0-mtlvauap-630n.png \
  pasted-1788460682740-0-mtlvbaqw-weod.png \
  pasted-1788460685847-0-mtlvbd3t-k1e4.png
```

- [ ] **Step 2: Crear el esqueleto compartido de `index.html`**

```html
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- TODO Tarea 14: title, meta description, canonical, Open Graph, JSON-LD -->
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link rel="stylesheet" href="styles.css">
</head>
<body data-page="inicio">
<a href="#main" class="skip-link">Saltar al contenido</a>
<header id="site-header"><!-- TODO Tarea 4: header/nav --></header>
<main id="main">
  <!-- TODO Tarea 5: hero + bloque de frases -->
  <!-- TODO Tarea 6: presentación de Tierra/Andrea + filosofía -->
  <!-- TODO Tarea 7: marquee de servicios -->
  <!-- TODO Tarea 8: método + CTA final -->
</main>
<footer id="site-footer"><!-- TODO Tarea 4: footer --></footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" integrity="sha512-7eHRwcbYkK4d9g/6tD/mhkf++eoTHwpNM9woBxtPUBWm67zeAfFC+HrdoE2GanKeocly/VxeLvIqwvCdk7qScg==" crossorigin="anonymous" referrerpolicy="no-referrer" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" integrity="sha512-onMTRKJBKz8M1TnqqDuGBlowlH0ohFzMXYRNebz+yOcc5TQr/zAKsthzhuv0hiyUKEiQEQXEynnXCvNTOk50dg==" crossorigin="anonymous" referrerpolicy="no-referrer" defer></script>
<script src="script.js" defer></script>
</body>
</html>
```

Repetir la misma estructura para `servicios.html` (`data-page="servicios"`, comentario `<!-- TODO Tarea 9: servicios -->`), `instalaciones.html` (`data-page="instalaciones"`, `<!-- TODO Tarea 10: instalaciones -->`) y `contacto.html` (`data-page="contacto"`, `<!-- TODO Tarea 11: contacto -->`).

- [ ] **Step 3: Reescribir `README.md`**

```markdown
# Fisioterapia Tierra — web

Sitio estatico. No necesita build ni dependencias: se sirve tal cual.

## Contenido
- index.html, servicios.html, instalaciones.html, contacto.html  paginas reales
- styles.css / script.js   sistema visual y animaciones (GSAP + ScrollTrigger por CDN)
- enviar-contacto.php      backend del formulario de contacto (solo funciona en hosting con PHP, ej. Hostinger)
- assets/                  fuentes, logos oficiales, recursos de marca
- sitemap.xml / robots.txt

## Publicar
Copiar todo el contenido de esta carpeta a la raiz del hosting (Hostinger).
Las rutas son relativas, funciona en cualquier subcarpeta sin cambios.
El formulario de contacto necesita PHP en el servidor (Hostinger lo tiene) para
enviar a info@fisioterapiatierra.es — no funciona en GitHub Pages ni en local.

Marca segun "Fisioterapia Tierra - manual de identidad" (docs/brief/):
crema #ede7da, terracota #a56853, azul grisaceo #bbcccf, marron oscuro #412f2b.
Tipografias: Space Mono (principal) y Rethink Sans (secundaria).
```

- [ ] **Step 4: Verificar**

```bash
cd "/c/Users/djman/Documents/Proyectos/fisio-page-Tierra" && git status --short
```
Esperado: 4 archivos `.html` modificados/nuevos, 8 archivos eliminados (`D`), `README.md` modificado. Ningún `support.js`/`image-slot.js`/`pasted-*`/`andrea-retrato*` debe quedar en `git status` como presente.

- [ ] **Step 5: Commit**

```bash
git add -A -- index.html servicios.html instalaciones.html contacto.html README.md support.js image-slot.js "andrea-retrato-mtlttzxg-96j1.jpg" pasted-*.png
git commit -m "Elimina el runtime x-dc y las fotos de stock; esqueleto de las 4 páginas

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Design tokens y CSS base (`styles.css`)

**Files:**
- Create: `styles.css`

**Interfaces:**
- Produces: custom properties (`--crema`, `--terracota`, `--terracota-dark`, `--azul`, `--marron`, `--font-display`, `--font-body`, `--container`, `--space-*`), reset, clases utilitarias `.container`, `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--dark`, `.eyebrow` (etiqueta Space Mono uppercase), `.visually-hidden`, `.skip-link`.
- Consumes: fuentes de `assets/fonts/`.

- [ ] **Step 1: Escribir el CSS base completo**

```css
/* ===== Fuentes ===== */
@font-face{font-family:'Rethink Sans';src:url('assets/fonts/RethinkSans-Regular.ttf') format('truetype');font-weight:400;font-display:swap}
@font-face{font-family:'Rethink Sans';src:url('assets/fonts/RethinkSans-Medium.ttf') format('truetype');font-weight:500;font-display:swap}
@font-face{font-family:'Rethink Sans';src:url('assets/fonts/RethinkSans-Bold.ttf') format('truetype');font-weight:700;font-display:swap}
@font-face{font-family:'Space Mono';src:url('assets/fonts/SpaceMono-Regular.ttf') format('truetype');font-weight:400;font-display:swap}
@font-face{font-family:'Space Mono';src:url('assets/fonts/SpaceMono-Bold.ttf') format('truetype');font-weight:700;font-display:swap}

/* ===== Tokens ===== */
:root{
  --crema:#ede7da;
  --terracota:#a56853;
  --terracota-dark:#8c5643;
  --azul:#bbcccf;
  --marron:#412f2b;
  --tinta-suave:#6b544c;
  --font-display:'Space Mono',monospace;
  --font-body:'Rethink Sans',system-ui,sans-serif;
  --container:1240px;
  --space-section:clamp(64px,9vw,120px);
  --space-inline:clamp(20px,4vw,48px);
  --radius:4px;
}

/* ===== Reset ===== */
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--crema);color:var(--marron);font-family:var(--font-body);font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}
img,svg{display:block;max-width:100%}
h1,h2,h3,h4{margin:0;font-family:var(--font-display);font-weight:700;letter-spacing:-.02em;line-height:1.05;text-wrap:pretty}
p{margin:0}
a{color:var(--terracota);text-decoration:none}
a:hover{color:var(--marron)}
button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
input,textarea,select{font:inherit;color:inherit}
::selection{background:var(--terracota);color:var(--crema)}
:focus-visible{outline:2px solid var(--terracota);outline-offset:3px}

/* ===== Utilidades ===== */
.container{max-width:var(--container);margin:0 auto;padding:0 var(--space-inline)}
.skip-link{position:absolute;left:-999px;top:0;background:var(--marron);color:var(--crema);padding:12px 20px;z-index:200;font-family:var(--font-display);text-transform:uppercase;font-size:12px;letter-spacing:.16em}
.skip-link:focus{left:var(--space-inline);top:var(--space-inline)}
.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.eyebrow{display:inline-block;font-family:var(--font-display);font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--terracota)}

/* ===== Botones ===== */
.btn{display:inline-flex;align-items:center;gap:10px;padding:16px 28px;border:1px solid transparent;border-radius:var(--radius);font-family:var(--font-display);font-size:13px;letter-spacing:.16em;text-transform:uppercase;transition:background .2s ease,color .2s ease,border-color .2s ease}
.btn--primary{background:var(--terracota);border-color:var(--terracota);color:var(--crema)}
.btn--primary:hover{background:var(--terracota-dark);border-color:var(--terracota-dark);color:#fff}
.btn--ghost{border-color:var(--terracota);color:var(--terracota)}
.btn--ghost:hover{background:rgba(165,104,83,.08)}
.btn--dark{background:var(--marron);border-color:var(--marron);color:var(--crema)}
.btn--dark:hover{background:#2c201d}

@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important;scroll-behavior:auto !important}
}
```

- [ ] **Step 2: Enlazar `styles.css` ya está hecho** (Tarea 1 ya añadió `<link rel="stylesheet" href="styles.css">` en las 4 páginas) — confirmar abriendo `index.html` y comprobando que la línea existe.

- [ ] **Step 3: Verificar**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,900 --screenshot="docs/superpowers/plans/_qa/task2-index.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/index.html"
```
Esperado: página en blanco de color **crema `#ede7da`** (no blanco puro), sin errores de consola visibles al abrir el archivo en un navegador normal con DevTools.

- [ ] **Step 4: Commit**

```bash
git add styles.css && git commit -m "Añade design tokens y CSS base (paleta, tipografía, botones, reset)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Sistema de líneas topográficas (SVG + animación de dibujo)

**Files:**
- Create: `script.js` (primera sección: módulo de líneas topográficas)
- Modify: `styles.css` (añadir `.topo-lines`)

**Interfaces:**
- Produces: función global `TierraTopo.inject(container, variant)` donde `variant` es `'hero' | 'divider' | 'metodo' | 'corner'`; función `TierraTopo.drawOnScroll(svgEl)` que anima cada `<path>` con `stroke-dasharray`/`stroke-dashoffset` vía GSAP ScrollTrigger. Se invocan automáticamente sobre cualquier elemento `[data-topo]` al cargar `script.js` (atributo `data-topo="hero"` etc.).
- Consumes: GSAP + ScrollTrigger globales (cargados por `<script>` CDN antes de `script.js`).

- [ ] **Step 1: Añadir el CSS de las líneas topográficas**

```css
/* ===== Líneas topográficas ===== */
.topo-lines{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;pointer-events:none;color:var(--terracota)}
.topo-lines path{fill:none;stroke:currentColor;stroke-width:1;opacity:.55}
.topo-lines--azul{color:var(--azul)}
.topo-lines--crema{color:var(--crema)}
```

- [ ] **Step 2: Escribir el módulo de líneas topográficas en `script.js`**

```js
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
```

- [ ] **Step 3: Verificar en un HTML temporal**

Crear `docs/superpowers/plans/_qa/topo-test.html` (no se commitea, solo para comprobar visualmente):

```html
<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="../../../../styles.css"></head>
<body style="padding:40px">
<div data-topo="hero" style="position:relative;height:400px;width:800px;border:1px solid #ccc"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" integrity="sha512-7eHRwcbYkK4d9g/6tD/mhkf++eoTHwpNM9woBxtPUBWm67zeAfFC+HrdoE2GanKeocly/VxeLvIqwvCdk7qScg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" integrity="sha512-onMTRKJBKz8M1TnqqDuGBlowlH0ohFzMXYRNebz+yOcc5TQr/zAKsthzhuv0hiyUKEiQEQXEynnXCvNTOk50dg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="../../../../script.js"></script>
</body></html>
```

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=900,600 --screenshot="docs/superpowers/plans/_qa/task3-topo.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/docs/superpowers/plans/_qa/topo-test.html"
```
Esperado: 5 líneas onduladas color terracota dentro del recuadro, sin errores de consola. Borrar `topo-test.html` después (no forma parte del sitio).

- [ ] **Step 4: Commit**

```bash
rm -f docs/superpowers/plans/_qa/topo-test.html
git add script.js styles.css && git commit -m "Añade el sistema de líneas topográficas (SVG + dibujo al hacer scroll)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Header/nav + footer compartidos (desktop y móvil)

**Files:**
- Modify: `index.html`, `servicios.html`, `instalaciones.html`, `contacto.html` (rellenar `#site-header`/`#site-footer`)
- Modify: `styles.css` (añadir estilos de header/nav/footer)
- Modify: `script.js` (añadir toggle de menú móvil + header con scroll)

**Interfaces:**
- Produces: clase `.is-active` en el enlace de nav correspondiente a `data-page`; función `initHeader()` invocada en `DOMContentLoaded`.
- Consumes: `assets/logos/logo-h-terracota.svg` (o variante que corresponda), `TierraTopo` no se usa aquí.

**Nota de alcance:** el footer del prompt (sección 16) pide enlaces "Aviso legal" y "Privacidad", pero esas páginas no existen en la estructura de 4 páginas aprobada y no hay contenido legal proporcionado por la clienta — se omiten del footer para no inventar ni enlazar a páginas inexistentes. El footer solo enlaza a Inicio/Servicios/Instalaciones/Contacto.

- [ ] **Step 1: CSS de header y footer**

```css
/* ===== Header ===== */
.site-header{position:sticky;top:0;z-index:50;background:var(--marron);color:var(--crema);border-bottom:1px solid rgba(237,231,218,.18)}
.site-header__inner{max-width:var(--container);margin:0 auto;padding:14px var(--space-inline);display:flex;align-items:center;justify-content:space-between;gap:24px}
.brand{display:flex;align-items:center;gap:12px}
.brand img{width:38px;height:auto}
.nav{display:none;align-items:center;gap:clamp(14px,2vw,28px);font-family:var(--font-display);font-size:12px;letter-spacing:.18em;text-transform:uppercase}
.nav a{color:var(--crema);padding:6px 0;position:relative}
.nav a:hover,.nav a.is-active{color:#fff}
.nav a.is-active::after{content:'';position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--crema)}
.nav .btn{color:var(--crema)}
.nav-toggle{display:inline-flex;flex-direction:column;gap:4px;padding:10px;border:1px solid rgba(237,231,218,.4);border-radius:var(--radius)}
.nav-toggle span{display:block;width:18px;height:1.5px;background:var(--crema)}
.mobile-nav{display:none;flex-direction:column;position:absolute;top:100%;right:var(--space-inline);left:var(--space-inline);background:var(--marron);border:1px solid rgba(237,231,218,.18);border-radius:var(--radius);padding:8px 20px;font-family:var(--font-display);font-size:13px;letter-spacing:.16em;text-transform:uppercase}
.mobile-nav.is-open{display:flex}
.mobile-nav a{color:var(--crema);padding:14px 0;border-bottom:1px solid rgba(237,231,218,.14)}
.mobile-nav .btn{margin:14px 0}
@media (min-width:900px){
  .nav{display:flex}
  .nav-toggle,.mobile-nav{display:none !important}
}

/* ===== Footer ===== */
.site-footer{background:var(--marron);color:var(--crema);padding:var(--space-section) 0 40px}
.site-footer__inner{max-width:var(--container);margin:0 auto;padding:0 var(--space-inline);display:flex;flex-wrap:wrap;gap:32px;justify-content:space-between;align-items:flex-start}
.site-footer nav{display:flex;flex-wrap:wrap;gap:20px;font-family:var(--font-display);font-size:12px;letter-spacing:.14em;text-transform:uppercase}
.site-footer nav a{color:var(--crema)}
.site-footer nav a:hover{color:var(--azul)}
.site-footer__brand img{width:120px;height:auto;margin-bottom:8px}
.site-footer__copy{width:100%;margin-top:32px;padding-top:20px;border-top:1px solid rgba(237,231,218,.14);font-size:12px;color:rgba(237,231,218,.7)}
```

- [ ] **Step 2: Markup de header (idéntico en las 4 páginas salvo `href` activo)**

Reemplazar `<header id="site-header"><!-- TODO Tarea 4: header/nav --></header>` por, en **cada** una de las 4 páginas (ajustando qué `<a>` lleva `is-active` según `data-page`):

```html
<header id="site-header" class="site-header">
  <div class="site-header__inner">
    <a href="index.html" class="brand" aria-label="Fisioterapia Tierra, inicio">
      <img src="assets/logos/logo-h-beige.svg" alt="Fisioterapia Tierra" width="160" height="40">
    </a>
    <nav class="nav" aria-label="Navegación principal">
      <a href="index.html" class="is-active">Inicio</a>
      <a href="servicios.html">Servicios</a>
      <a href="instalaciones.html">Instalaciones</a>
      <a href="contacto.html">Contacto</a>
      <a href="contacto.html" class="btn btn--primary">Pedir cita</a>
    </nav>
    <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-nav">
      <span></span><span></span><span></span>
    </button>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Navegación móvil">
      <a href="index.html" class="is-active">Inicio</a>
      <a href="servicios.html">Servicios</a>
      <a href="instalaciones.html">Instalaciones</a>
      <a href="contacto.html">Contacto</a>
      <a href="contacto.html" class="btn btn--primary">Pedir cita</a>
    </nav>
  </div>
</header>
```

En `servicios.html` mover `is-active` a los dos `<a href="servicios.html">`; en `instalaciones.html` a los dos `<a href="instalaciones.html">`; en `contacto.html` a los dos `<a href="contacto.html">`.

- [ ] **Step 3: Markup de footer (idéntico en las 4 páginas)**

```html
<footer id="site-footer" class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__brand">
      <img src="assets/logos/logo-h-beige.svg" alt="Fisioterapia Tierra" width="140" height="35">
      <p class="eyebrow" style="color:var(--azul)">FISIOTERAPIA TIERRA</p>
    </div>
    <nav aria-label="Navegación del pie">
      <a href="index.html">Inicio</a>
      <a href="servicios.html">Servicios</a>
      <a href="instalaciones.html">Instalaciones</a>
      <a href="contacto.html">Contacto</a>
    </nav>
    <p class="site-footer__copy">© <span data-year></span> Fisioterapia Tierra. Todos los derechos reservados.</p>
  </div>
</footer>
```

- [ ] **Step 4: JS del menú móvil + año automático en `script.js`**

```js
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
```

- [ ] **Step 5: Verificar**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,900 --screenshot="docs/superpowers/plans/_qa/task4-desktop.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/index.html"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=390,844 --screenshot="docs/superpowers/plans/_qa/task4-mobile.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/index.html"
```
Esperado desktop: header marrón con logo + nav horizontal + botón "Pedir cita" visible, footer marrón con logo/nav/copy. Esperado móvil: header marrón con logo + botón hamburguesa (nav horizontal oculta). Repetir el screenshot desktop para las otras 3 páginas y confirmar que el enlace correcto lleva `is-active` (subrayado).

- [ ] **Step 6: Commit**

```bash
git add index.html servicios.html instalaciones.html contacto.html styles.css script.js
git commit -m "Añade header y footer compartidos (nav desktop/móvil, menú hamburguesa)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Inicio — Hero + bloque de frases

**Files:**
- Modify: `index.html` (sustituir `<!-- TODO Tarea 5 -->`)
- Modify: `styles.css` (añadir `.hero`, `.phrases`)

**Interfaces:**
- Consumes: `TierraTopo` (Tarea 3), `.btn` (Tarea 2).
- Produces: sección `#hero` y `#frases` reveladas con `[data-reveal]` (usado por la Tarea 13 para el wiring de ScrollTrigger).

**Copy literal (Prompt Maestro sección 11.1 y 11.2):**
- Título: "Vuelve al origen de tu bienestar"
- Subtítulo: "Volver al origen, conectar con el cuerpo y recuperar el equilibrio en Zamora"
- CTA principal: "PEDIR CITA" → `contacto.html`
- CTA secundario: "CONÓCENOS" → `#presentacion` (ancla dentro de Inicio, ver Tarea 6)
- Frases: "Entender tu cuerpo." / "Escucharlo." / "Acompañarlo en el proceso."

- [ ] **Step 1: CSS del hero y del bloque de frases**

```css
/* ===== Hero ===== */
.hero{position:relative;overflow:hidden;padding:var(--space-section) 0;border-bottom:1px solid rgba(65,47,43,.16)}
.hero__inner{position:relative;z-index:1;max-width:var(--container);margin:0 auto;padding:0 var(--space-inline);text-align:center}
.hero h1{font-size:clamp(34px,6vw,72px);max-width:16ch;margin:0 auto 20px}
.hero__lead{font-family:var(--font-body);font-size:clamp(17px,1.6vw,22px);color:var(--tinta-suave);max-width:44ch;margin:0 auto 36px}
.hero__actions{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}

/* ===== Bloque de frases ===== */
.phrases{padding:var(--space-section) 0;background:var(--marron);color:var(--crema)}
.phrases__inner{max-width:var(--container);margin:0 auto;padding:0 var(--space-inline);display:flex;flex-direction:column;gap:clamp(24px,5vw,56px)}
.phrases p{font-family:var(--font-display);font-size:clamp(28px,6vw,64px);line-height:1.1}
.phrases p:nth-child(1){text-align:left}
.phrases p:nth-child(2){text-align:center;color:var(--azul)}
.phrases p:nth-child(3){text-align:right}
```

- [ ] **Step 2: Markup del hero + frases**

```html
<section class="hero" id="hero" data-topo="hero" data-topo-color="azul">
  <div class="hero__inner" data-reveal>
    <p class="eyebrow">Fisioterapia · Zamora</p>
    <h1>Vuelve al origen de tu bienestar</h1>
    <p class="hero__lead">Volver al origen, conectar con el cuerpo y recuperar el equilibrio en Zamora.</p>
    <!-- FOTO PENDIENTE: fotografía editorial del hero descrita en el prompt (11.1) — retrato o gesto corporal con líneas topográficas superpuestas, formato apaisado grande. Alt sugerido: "Fotografía editorial de Fisioterapia Tierra con líneas topográficas superpuestas" -->
    <div class="hero__actions">
      <a href="contacto.html" class="btn btn--primary">Pedir cita</a>
      <a href="#presentacion" class="btn btn--ghost">Conócenos</a>
    </div>
  </div>
</section>

<section class="phrases" id="frases">
  <div class="phrases__inner">
    <p data-reveal>Entender tu cuerpo.</p>
    <p data-reveal>Escucharlo.</p>
    <p data-reveal>Acompañarlo en el proceso.</p>
  </div>
</section>
```

- [ ] **Step 3: Verificar**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,1200 --screenshot="docs/superpowers/plans/_qa/task5-hero.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/index.html"
```
Esperado: hero centrado con título Space Mono grande "Vuelve al origen de tu bienestar", líneas topográficas azules de fondo, dos botones; debajo banda marrón con las 3 frases en distinta alineación (izquierda/centro-azul/derecha), no como tarjetas.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css && git commit -m "Inicio: hero y bloque de frases

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Inicio — Presentación de Tierra/Andrea + Filosofía

**Files:**
- Modify: `index.html`
- Modify: `styles.css` (añadir `.presentacion`, `.filosofia`)

**Copy literal (Prompt Maestro 11.3 y 11.4):**
- Presentación: "En Tierra trabajamos desde una fisioterapia personalizada, con criterio clínico basado en la evidencia científica y atención individual a cada persona, con el fin de ofrecer el mejor tratamiento de manera honesta y sensata." + "Soy Andrea Legido Andrés, fisioterapeuta y estoy detrás de tierra. Nº Col 3186"
- Filosofía (título "La filosofía"): "No trato solo el dolor: busco su origen para devolverte el movimiento y la confianza en tu propio cuerpo." / "En Tierra entiendo el cuerpo como un todo. A través de la fisioterapia y la osteopatía te acompaño en un proceso cercano y personalizado, respetando tus tiempos y tus necesidades." / "Porque sanar no es solo aliviar. Es volver a ti."

- [ ] **Step 1: CSS**

```css
/* ===== Presentación ===== */
.presentacion{padding:var(--space-section) 0}
.presentacion__inner{max-width:var(--container);margin:0 auto;padding:0 var(--space-inline);display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:clamp(32px,5vw,72px);align-items:center}
.presentacion blockquote{font-size:clamp(22px,2.4vw,32px);line-height:1.3;margin:0 0 24px;font-weight:500}
.presentacion cite{display:block;font-style:normal;font-family:var(--font-display);font-size:13px;letter-spacing:.1em;color:var(--terracota)}

/* ===== Filosofía ===== */
.filosofia{padding:0 0 var(--space-section)}
.filosofia__inner{max-width:var(--container);margin:0 auto;padding:0 var(--space-inline);display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(32px,5vw,72px);align-items:end}
.filosofia__lead{font-size:clamp(26px,3.2vw,44px);font-weight:700;line-height:1.15;max-width:26ch}
.filosofia__body{max-width:42ch;display:flex;flex-direction:column;gap:16px;color:var(--tinta-suave)}
.filosofia__closing{color:var(--marron) !important;font-weight:700}
```

- [ ] **Step 2: Markup**

```html
<section class="presentacion" id="presentacion">
  <div class="presentacion__inner">
    <div data-reveal>
      <!-- FOTO PENDIENTE: retrato de Andrea Legido Andrés, formato vertical o cuadrado. Alt sugerido: "Andrea Legido Andrés, fisioterapeuta de Fisioterapia Tierra" -->
      <blockquote>
        En Tierra trabajamos desde una fisioterapia personalizada, con criterio clínico basado en la evidencia científica y atención individual a cada persona, con el fin de ofrecer el mejor tratamiento de manera honesta y sensata.
      </blockquote>
    </div>
    <div data-reveal>
      <p class="eyebrow" style="margin-bottom:12px">Andrea Legido Andrés</p>
      <cite>Fisioterapeuta — Nº Col 3186</cite>
    </div>
  </div>
</section>

<section class="filosofia" id="filosofia" data-topo="divider">
  <div class="filosofia__inner">
    <p class="filosofia__lead" data-reveal>No trato solo el dolor: busco su origen para devolverte el movimiento y la confianza en tu propio cuerpo.</p>
    <div class="filosofia__body" data-reveal>
      <p class="eyebrow">La filosofía</p>
      <p>En Tierra entiendo el cuerpo como un todo. A través de la fisioterapia y la osteopatía te acompaño en un proceso cercano y personalizado, respetando tus tiempos y tus necesidades.</p>
      <p class="filosofia__closing">Porque sanar no es solo aliviar. Es volver a ti.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verificar**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,1600 --screenshot="docs/superpowers/plans/_qa/task6.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/index.html"
```
Esperado: cita grande de presentación + nombre de Andrea; debajo sección filosofía en dos columnas asimétricas con línea divisoria topográfica de fondo.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css && git commit -m "Inicio: presentación de Tierra/Andrea y filosofía

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Inicio — Marquee de tratamientos

**Files:**
- Modify: `index.html`
- Modify: `styles.css` (añadir `.marquee`)

**Copy literal (Prompt Maestro 11.5) — 10 tratamientos, solo el nombre:**
FISIOTERAPIA, OSTEOPATÍA, FISIOTERAPIA DEPORTIVA, FISIOTERAPIA INVASIVA, PUNCIÓN SECA, ELECTRÓLISIS PERCUTÁNEA, ECOGRAFÍA, REHABILITACIÓN FUNCIONAL, PILATES TERAPÉUTICO, DIATERMIA.

*(Nota de corrección: la spec de diseño decía "9 tratamientos" por error de recuento — son 10, coincide con los 10 de `servicios.html`.)*

- [ ] **Step 1: CSS del marquee (loop infinito real, sin salto, pausa en hover, respeta reduced-motion)**

```css
/* ===== Marquee ===== */
.marquee{overflow:hidden;white-space:nowrap;background:var(--marron);color:var(--crema);padding:20px 0;border-top:1px solid rgba(237,231,218,.14);border-bottom:1px solid rgba(237,231,218,.14)}
.marquee__track{display:inline-flex;animation:marquee-scroll 42s linear infinite}
.marquee:hover .marquee__track{animation-play-state:paused}
.marquee__group{display:inline-flex;align-items:center;font-family:var(--font-display);font-size:clamp(14px,1.6vw,18px);letter-spacing:.2em;text-transform:uppercase}
.marquee__sep{width:6px;height:6px;background:var(--terracota);margin:0 clamp(20px,2.5vw,32px);display:inline-block;border-radius:50%}
@keyframes marquee-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media (prefers-reduced-motion: reduce){.marquee__track{animation:none}}
```

- [ ] **Step 2: Markup (la lista se duplica una vez para el loop sin salto — técnica estándar)**

```html
<div class="marquee" id="tratamientos" aria-label="Tratamientos de Fisioterapia Tierra">
  <div class="marquee__track">
    <span class="marquee__group">FISIOTERAPIA<span class="marquee__sep"></span>OSTEOPATÍA<span class="marquee__sep"></span>FISIOTERAPIA DEPORTIVA<span class="marquee__sep"></span>FISIOTERAPIA INVASIVA<span class="marquee__sep"></span>PUNCIÓN SECA<span class="marquee__sep"></span>ELECTRÓLISIS PERCUTÁNEA<span class="marquee__sep"></span>ECOGRAFÍA<span class="marquee__sep"></span>REHABILITACIÓN FUNCIONAL<span class="marquee__sep"></span>PILATES TERAPÉUTICO<span class="marquee__sep"></span>DIATERMIA<span class="marquee__sep"></span></span>
    <span class="marquee__group" aria-hidden="true">FISIOTERAPIA<span class="marquee__sep"></span>OSTEOPATÍA<span class="marquee__sep"></span>FISIOTERAPIA DEPORTIVA<span class="marquee__sep"></span>FISIOTERAPIA INVASIVA<span class="marquee__sep"></span>PUNCIÓN SECA<span class="marquee__sep"></span>ELECTRÓLISIS PERCUTÁNEA<span class="marquee__sep"></span>ECOGRAFÍA<span class="marquee__sep"></span>REHABILITACIÓN FUNCIONAL<span class="marquee__sep"></span>PILATES TERAPÉUTICO<span class="marquee__sep"></span>DIATERMIA<span class="marquee__sep"></span></span>
  </div>
</div>
```

- [ ] **Step 3: Verificar**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,300 --screenshot="docs/superpowers/plans/_qa/task7-marquee.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/index.html"
```
Abrir también en un navegador normal (no headless) y comprobar visualmente 5+ segundos que el desplazamiento es continuo, sin salto visible, y que al pasar el ratón por encima se detiene.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css && git commit -m "Inicio: marquee infinito de los 10 tratamientos

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Inicio — Método + CTA final

**Files:**
- Modify: `index.html`
- Modify: `styles.css` (añadir `.metodo`, `.cta-final`)

**Copy literal (Prompt Maestro 11.6 y 11.7):**
- Título: "MÉTODO"
- "01 — ESCUCHA REAL"
- "02 — RAÍZ, NO SÍNTOMA"
- "03 — CONECTAR PARA TRATAR" con texto: "Las manos nos ayudan a conocer el cuerpo y a entender lo que necesita. A partir de ahí, combinamos diferentes técnicas para adaptar cada tratamiento."
- CTA final: "Vuelve al origen de tu bienestar." + botón "PEDIR CITA"

- [ ] **Step 1: CSS**

```css
/* ===== Método ===== */
.metodo{position:relative;padding:var(--space-section) 0;overflow:hidden}
.metodo__inner{max-width:var(--container);margin:0 auto;padding:0 var(--space-inline)}
.metodo h2{font-size:clamp(32px,4.4vw,60px);margin-bottom:clamp(40px,6vw,80px)}
.metodo__steps{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.metodo__step{display:flex;flex-direction:column;gap:12px}
.metodo__step:nth-child(1){margin-top:0}
.metodo__step:nth-child(2){margin-top:clamp(20px,4vw,60px)}
.metodo__step:nth-child(3){margin-top:clamp(40px,8vw,120px)}
.metodo__num{font-family:var(--font-display);font-size:14px;color:var(--terracota);letter-spacing:.14em}
.metodo__step h3{font-size:clamp(20px,2vw,26px);font-family:var(--font-body);font-weight:700}
.metodo__step p{color:var(--tinta-suave);font-size:15px}
@media (max-width:800px){
  .metodo__steps{grid-template-columns:1fr}
  .metodo__step:nth-child(2),.metodo__step:nth-child(3){margin-top:32px}
}

/* ===== CTA final ===== */
.cta-final{position:relative;overflow:hidden;background:var(--terracota);color:var(--crema);padding:var(--space-section) 0;text-align:center}
.cta-final__inner{position:relative;z-index:1;max-width:700px;margin:0 auto;padding:0 var(--space-inline)}
.cta-final h2{font-size:clamp(30px,4vw,52px);margin-bottom:28px}
```

- [ ] **Step 2: Markup**

```html
<section class="metodo" id="metodo" data-topo="metodo">
  <div class="metodo__inner">
    <h2 data-reveal>Método</h2>
    <div class="metodo__steps">
      <div class="metodo__step" data-reveal>
        <span class="metodo__num">01</span>
        <h3>Escucha real</h3>
      </div>
      <div class="metodo__step" data-reveal>
        <span class="metodo__num">02</span>
        <h3>Raíz, no síntoma</h3>
      </div>
      <div class="metodo__step" data-reveal>
        <span class="metodo__num">03</span>
        <h3>Conectar para tratar</h3>
        <p>Las manos nos ayudan a conocer el cuerpo y a entender lo que necesita. A partir de ahí, combinamos diferentes técnicas para adaptar cada tratamiento.</p>
      </div>
    </div>
  </div>
</section>

<section class="cta-final" data-topo="divider" data-topo-color="crema">
  <div class="cta-final__inner" data-reveal>
    <h2>Vuelve al origen de tu bienestar.</h2>
    <a href="contacto.html" class="btn btn--dark">Pedir cita</a>
  </div>
</section>
```

- [ ] **Step 3: Verificar**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,1000 --screenshot="docs/superpowers/plans/_qa/task8-metodo.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/index.html"
```
Esperado: 3 columnas del método con desnivel vertical entre ellas (no alineadas en fila recta) y una línea topográfica horizontal de fondo conectándolas; debajo banda terracota con CTA final.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css && git commit -m "Inicio: sección Método y CTA final — página Inicio completa

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: Página Servicios completa

**Files:**
- Modify: `servicios.html`
- Modify: `styles.css` (añadir `.servicios-hero`, `.servicio`)

**Copy literal íntegra (Prompt Maestro sección 12).** Título de página: "Soluciones personalizadas: conoce nuestros tratamientos fisioterapéuticos". Los 10 tratamientos, en este orden, con su texto exacto:

1. **Fisioterapia** — "Abordamos el dolor y las limitaciones de movimiento mediante técnicas de terapia manual y otras herramientas terapéuticas. Cada tratamiento parte de una valoración individual para recuperar el movimiento, mejorar la función y favorecer tu bienestar."
2. **Osteopatía** — "Un enfoque manual que entiende el cuerpo como un todo. A través de una valoración global, identificamos las restricciones que pueden afectar al movimiento y al funcionamiento del organismo para adaptar el tratamiento a las necesidades de cada persona. Trabajamos sobre los diferentes planos corporales —estructural, visceral y craneal—, entendiendo que cada parte está relacionada con el conjunto."
3. **Fisioterapia deportiva** — "Evaluamos y tratamos las lesiones relacionadas con la práctica deportiva, tanto en deportistas amateurs como profesionales y en cualquier disciplina. Partimos de una valoración individual y un razonamiento clínico para diseñar un tratamiento adaptado a cada persona, combinando terapia manual y ejercicio terapéutico. Nuestro objetivo es recuperar la función y acompañarte de forma progresiva hasta volver a tu actividad deportiva con confianza y seguridad."
4. **Fisioterapia invasiva** — "Técnicas que utilizan agujas de punción para acceder de forma precisa a los tejidos y complementar el tratamiento fisioterapéutico."
5. **Punción seca** — "Técnica dirigida principalmente al tratamiento del dolor y las alteraciones musculares, especialmente en presencia de puntos gatillo miofasciales. Mediante una aguja fina se accede de forma precisa al tejido muscular, permitiendo actuar sobre zonas profundas que pueden ser difíciles de abordar mediante técnicas manuales."
6. **Electrólisis percutánea** — "Técnica de fisioterapia invasiva que permite aplicar una corriente galvánica de forma precisa sobre el tejido lesionado, mediante una aguja y con control ecográfico. La aplicación de la corriente provoca una respuesta local en el tejido que puede ayudar a modular el dolor, favorecer la respuesta inflamatoria necesaria para la reparación y estimular los procesos de recuperación y regeneración tisular. Se utiliza principalmente en el tratamiento de lesiones musculoesqueléticas, especialmente en tendones, músculos y otros tejidos blandos."
7. **Ecografía** — "La ecografía musculoesquelética es una herramienta de valoración que permite observar en tiempo real diferentes estructuras del aparato locomotor, como músculos, tendones, ligamentos y otras partes blandas. Nos ayuda a conocer con mayor precisión el estado de los tejidos, orientar el diagnóstico fisioterapéutico y adaptar el tratamiento a cada caso. Además, permite realizar un seguimiento de la evolución durante el proceso de recuperación."
8. **Rehabilitación funcional** — destacado: "El movimiento como parte del tratamiento." Texto: "Diseñamos programas de ejercicio terapéutico adaptados a cada persona y a cada proceso, con el objetivo de aliviar síntomas, recuperar la función y mejorar la capacidad física. Contamos con un espacio equipado para acompañarte durante todo el proceso de recuperación, desde las primeras fases hasta la vuelta a tu actividad habitual."
9. **Pilates terapéutico** — "Una forma de trabajar el cuerpo desde el control, la precisión y la conciencia del movimiento. A través de ejercicios basados en los principios del método Pilates, trabajamos la respiración, la estabilidad, la movilidad y el control corporal, adaptando cada ejercicio a las características y necesidades de la persona. Un trabajo consciente y progresivo que busca mejorar la relación con tu cuerpo y la calidad de tus movimientos."
10. **Diatermia** — "La diatermia es una técnica que utiliza corrientes de alta frecuencia para generar un efecto térmico en los tejidos y favorecer determinados procesos fisiológicos. En Tierra contamos con Fisiowarm 7.0, que utilizamos como complemento al tratamiento de fisioterapia. Su aplicación puede ayudar a disminuir el dolor, mejorar la circulación y el aporte de oxígeno y nutrientes a los tejidos, favorecer la relajación muscular y acompañar los procesos de recuperación y reparación tisular. La intensidad y aplicación se adaptan a las necesidades de cada persona y al objetivo del tratamiento."

- [ ] **Step 1: CSS — composición editorial de escalas variables (no grid uniforme)**

```css
/* ===== Servicios ===== */
.servicios-hero{padding:var(--space-section) 0 clamp(40px,6vw,72px)}
.servicios-hero__inner{max-width:var(--container);margin:0 auto;padding:0 var(--space-inline)}
.servicios-hero h1{font-size:clamp(30px,4.2vw,56px);max-width:22ch}

.servicio{border-top:1px solid rgba(65,47,43,.16)}
.servicio__inner{max-width:var(--container);margin:0 auto;padding:clamp(32px,5vw,56px) var(--space-inline);display:grid;grid-template-columns:120px 1fr;gap:clamp(20px,3vw,40px)}
.servicio__num{font-family:var(--font-display);font-size:clamp(28px,3vw,40px);color:var(--terracota)}
.servicio__body h2{font-size:clamp(24px,2.6vw,36px);margin-bottom:14px}
.servicio__body p{color:var(--tinta-suave);max-width:68ch}
.servicio__highlight{font-family:var(--font-display);font-size:clamp(18px,1.8vw,24px);color:var(--marron);margin-bottom:14px;text-transform:none}
/* Variante destacada: cada 4º servicio ocupa fondo de color para romper el ritmo uniforme */
.servicio--destacado{background:var(--azul)}
.servicio--destacado .servicio__num{color:var(--marron)}
@media (max-width:700px){
  .servicio__inner{grid-template-columns:1fr;gap:12px}
}
```

- [ ] **Step 2: Markup completo** (sustituir header/footer ya puestos en Tarea 4/1; insertar entre ellos)

```html
<section class="servicios-hero" data-topo="divider">
  <div class="servicios-hero__inner" data-reveal>
    <p class="eyebrow">Servicios</p>
    <h1>Soluciones personalizadas: conoce nuestros tratamientos fisioterapéuticos</h1>
  </div>
</section>

<section class="servicio" id="fisioterapia">
  <div class="servicio__inner" data-reveal>
    <span class="servicio__num">01</span>
    <div class="servicio__body">
      <h2>Fisioterapia</h2>
      <p>Abordamos el dolor y las limitaciones de movimiento mediante técnicas de terapia manual y otras herramientas terapéuticas. Cada tratamiento parte de una valoración individual para recuperar el movimiento, mejorar la función y favorecer tu bienestar.</p>
    </div>
  </div>
</section>

<section class="servicio servicio--destacado" id="osteopatia">
  <div class="servicio__inner" data-reveal>
    <span class="servicio__num">02</span>
    <div class="servicio__body">
      <h2>Osteopatía</h2>
      <p>Un enfoque manual que entiende el cuerpo como un todo. A través de una valoración global, identificamos las restricciones que pueden afectar al movimiento y al funcionamiento del organismo para adaptar el tratamiento a las necesidades de cada persona.</p>
      <p>Trabajamos sobre los diferentes planos corporales —estructural, visceral y craneal—, entendiendo que cada parte está relacionada con el conjunto.</p>
    </div>
  </div>
</section>

<section class="servicio" id="fisioterapia-deportiva">
  <div class="servicio__inner" data-reveal>
    <span class="servicio__num">03</span>
    <div class="servicio__body">
      <h2>Fisioterapia deportiva</h2>
      <p>Evaluamos y tratamos las lesiones relacionadas con la práctica deportiva, tanto en deportistas amateurs como profesionales y en cualquier disciplina.</p>
      <p>Partimos de una valoración individual y un razonamiento clínico para diseñar un tratamiento adaptado a cada persona, combinando terapia manual y ejercicio terapéutico.</p>
      <p>Nuestro objetivo es recuperar la función y acompañarte de forma progresiva hasta volver a tu actividad deportiva con confianza y seguridad.</p>
    </div>
  </div>
</section>

<section class="servicio" id="fisioterapia-invasiva">
  <div class="servicio__inner" data-reveal>
    <span class="servicio__num">04</span>
    <div class="servicio__body">
      <h2>Fisioterapia invasiva</h2>
      <p>Técnicas que utilizan agujas de punción para acceder de forma precisa a los tejidos y complementar el tratamiento fisioterapéutico.</p>
    </div>
  </div>
</section>

<section class="servicio servicio--destacado" id="puncion-seca">
  <div class="servicio__inner" data-reveal>
    <span class="servicio__num">05</span>
    <div class="servicio__body">
      <h2>Punción seca</h2>
      <p>Técnica dirigida principalmente al tratamiento del dolor y las alteraciones musculares, especialmente en presencia de puntos gatillo miofasciales. Mediante una aguja fina se accede de forma precisa al tejido muscular, permitiendo actuar sobre zonas profundas que pueden ser difíciles de abordar mediante técnicas manuales.</p>
    </div>
  </div>
</section>

<section class="servicio" id="electrolisis-percutanea">
  <div class="servicio__inner" data-reveal>
    <span class="servicio__num">06</span>
    <div class="servicio__body">
      <h2>Electrólisis percutánea</h2>
      <p>Técnica de fisioterapia invasiva que permite aplicar una corriente galvánica de forma precisa sobre el tejido lesionado, mediante una aguja y con control ecográfico.</p>
      <p>La aplicación de la corriente provoca una respuesta local en el tejido que puede ayudar a modular el dolor, favorecer la respuesta inflamatoria necesaria para la reparación y estimular los procesos de recuperación y regeneración tisular.</p>
      <p>Se utiliza principalmente en el tratamiento de lesiones musculoesqueléticas, especialmente en tendones, músculos y otros tejidos blandos.</p>
    </div>
  </div>
</section>

<section class="servicio" id="ecografia">
  <div class="servicio__inner" data-reveal>
    <span class="servicio__num">07</span>
    <div class="servicio__body">
      <h2>Ecografía</h2>
      <p>La ecografía musculoesquelética es una herramienta de valoración que permite observar en tiempo real diferentes estructuras del aparato locomotor, como músculos, tendones, ligamentos y otras partes blandas.</p>
      <p>Nos ayuda a conocer con mayor precisión el estado de los tejidos, orientar el diagnóstico fisioterapéutico y adaptar el tratamiento a cada caso. Además, permite realizar un seguimiento de la evolución durante el proceso de recuperación.</p>
    </div>
  </div>
</section>

<section class="servicio servicio--destacado" id="rehabilitacion-funcional">
  <div class="servicio__inner" data-reveal>
    <span class="servicio__num">08</span>
    <div class="servicio__body">
      <p class="servicio__highlight">El movimiento como parte del tratamiento.</p>
      <h2>Rehabilitación funcional</h2>
      <p>Diseñamos programas de ejercicio terapéutico adaptados a cada persona y a cada proceso, con el objetivo de aliviar síntomas, recuperar la función y mejorar la capacidad física.</p>
      <p>Contamos con un espacio equipado para acompañarte durante todo el proceso de recuperación, desde las primeras fases hasta la vuelta a tu actividad habitual.</p>
    </div>
  </div>
</section>

<section class="servicio" id="pilates-terapeutico">
  <div class="servicio__inner" data-reveal>
    <span class="servicio__num">09</span>
    <div class="servicio__body">
      <h2>Pilates terapéutico</h2>
      <p>Una forma de trabajar el cuerpo desde el control, la precisión y la conciencia del movimiento.</p>
      <p>A través de ejercicios basados en los principios del método Pilates, trabajamos la respiración, la estabilidad, la movilidad y el control corporal, adaptando cada ejercicio a las características y necesidades de la persona.</p>
      <p>Un trabajo consciente y progresivo que busca mejorar la relación con tu cuerpo y la calidad de tus movimientos.</p>
    </div>
  </div>
</section>

<section class="servicio" id="diatermia">
  <div class="servicio__inner" data-reveal>
    <span class="servicio__num">10</span>
    <div class="servicio__body">
      <h2>Diatermia</h2>
      <p>La diatermia es una técnica que utiliza corrientes de alta frecuencia para generar un efecto térmico en los tejidos y favorecer determinados procesos fisiológicos.</p>
      <p>En Tierra contamos con Fisiowarm 7.0, que utilizamos como complemento al tratamiento de fisioterapia. Su aplicación puede ayudar a disminuir el dolor, mejorar la circulación y el aporte de oxígeno y nutrientes a los tejidos, favorecer la relajación muscular y acompañar los procesos de recuperación y reparación tisular.</p>
      <p>La intensidad y aplicación se adaptan a las necesidades de cada persona y al objetivo del tratamiento.</p>
    </div>
  </div>
</section>

<section class="cta-final" data-topo="divider" data-topo-color="crema">
  <div class="cta-final__inner" data-reveal>
    <h2>¿Empezamos?</h2>
    <a href="contacto.html" class="btn btn--dark">Pedir cita</a>
  </div>
</section>
```

- [ ] **Step 3: Verificar**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,4000 --screenshot="docs/superpowers/plans/_qa/task9-servicios.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/servicios.html"
```
Esperado: los 10 tratamientos en orden, alternando fondo azul cada 4 (02, 06, no — según el CSS es `.servicio--destacado` puesto manualmente en 02/05/08, revisar visualmente que rompe el ritmo sin ser un patrón rígido de "cada N"), texto completo y literal de cada uno visible.

- [ ] **Step 4: Commit**

```bash
git add servicios.html styles.css && git commit -m "Página Servicios completa (10 tratamientos, copy literal del brief)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 10: Página Instalaciones (sin fotografía real)

**Files:**
- Modify: `instalaciones.html`
- Modify: `styles.css` (añadir `.instalaciones-*`)

**Contexto:** sin fotografía real disponible (ver Global Constraints). Esta página se resuelve con tipografía grande, color y líneas topográficas, dejando marcados los huecos de foto futura. Es una limitación conocida y aceptada, no un error de esta tarea.

- [ ] **Step 1: CSS**

```css
/* ===== Instalaciones ===== */
.instalaciones-hero{padding:var(--space-section) 0;text-align:center}
.instalaciones-hero h1{font-size:clamp(36px,6vw,80px)}
.instalaciones-block{padding:clamp(40px,6vw,80px) 0;border-top:1px solid rgba(65,47,43,.16)}
.instalaciones-block--dark{background:var(--marron);color:var(--crema)}
.instalaciones-block__inner{max-width:var(--container);margin:0 auto;padding:0 var(--space-inline);display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(28px,4vw,56px)}
.instalaciones-block h2{font-size:clamp(26px,3vw,40px);margin-bottom:16px}
.instalaciones-block p{color:var(--tinta-suave)}
.instalaciones-block--dark p{color:rgba(237,231,218,.8)}
.instalaciones-photo-slot{position:relative;min-height:280px;border:1px dashed rgba(65,47,43,.3);border-radius:var(--radius);display:flex;align-items:center;justify-content:center}
.instalaciones-photo-slot span{font-family:var(--font-display);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--tinta-suave);opacity:.6}
```

- [ ] **Step 2: Markup** (nota: `.instalaciones-photo-slot` es un marcador visual discreto, no una caja gris genérica de "imagen rota" — solo aparece en fondo claro con un borde punteado sutil, coherente con la paleta, para que quien gestione el sitio vea dónde falta la foto sin que rompa la estética)

```html
<section class="instalaciones-hero" data-topo="hero" data-topo-color="azul">
  <div class="container" data-reveal>
    <p class="eyebrow">Instalaciones</p>
    <h1>El espacio donde ocurre el proceso</h1>
  </div>
</section>

<section class="instalaciones-block" id="recepcion">
  <div class="instalaciones-block__inner">
    <div data-reveal>
      <h2>Recepción</h2>
      <p>Un espacio pensado para llegar con calma: el primer contacto con Tierra, antes de cualquier tratamiento.</p>
    </div>
    <!-- FOTO PENDIENTE: fotografía grande de la recepción/entrada, formato apaisado. Alt sugerido: "Recepción de Fisioterapia Tierra en Zamora" -->
    <div class="instalaciones-photo-slot" data-reveal><span>Foto pendiente — recepción</span></div>
  </div>
</section>

<section class="instalaciones-block instalaciones-block--dark" id="gabinetes" data-topo="divider" data-topo-color="crema">
  <div class="instalaciones-block__inner">
    <!-- FOTO PENDIENTE: fotografía de un gabinete de tratamiento, formato vertical. Alt sugerido: "Gabinete de tratamiento de Fisioterapia Tierra" -->
    <div class="instalaciones-photo-slot" data-reveal style="border-color:rgba(237,231,218,.3)"><span style="color:rgba(237,231,218,.6)">Foto pendiente — gabinete</span></div>
    <div data-reveal>
      <h2>Gabinetes de tratamiento</h2>
      <p>Tres gabinetes equipados para terapia manual, técnicas invasivas y ecografía, cada uno pensado para la atención individual que define el método de Tierra.</p>
    </div>
  </div>
</section>

<section class="instalaciones-block" id="rehabilitacion">
  <div class="instalaciones-block__inner">
    <div data-reveal>
      <h2>Área de rehabilitación funcional</h2>
      <p>Un espacio equipado para acompañarte durante todo el proceso de recuperación, desde las primeras fases hasta la vuelta a tu actividad habitual.</p>
    </div>
    <!-- FOTO PENDIENTE: fotografía del área de rehabilitación/ejercicio, formato apaisado, puede incluir detalle de equipamiento. Alt sugerido: "Área de rehabilitación funcional de Fisioterapia Tierra" -->
    <div class="instalaciones-photo-slot" data-reveal><span>Foto pendiente — área de rehabilitación</span></div>
  </div>
</section>

<section class="cta-final" data-topo="divider" data-topo-color="crema">
  <div class="cta-final__inner" data-reveal>
    <h2>Conoce Tierra en persona.</h2>
    <a href="contacto.html" class="btn btn--dark">Pedir cita</a>
  </div>
</section>
```

- [ ] **Step 3: Verificar**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,1800 --screenshot="docs/superpowers/plans/_qa/task10-instalaciones.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/instalaciones.html"
```
Esperado: 3 bloques alternando fondo claro/oscuro y orden imagen-texto/texto-imagen, cada slot de foto marcado con borde punteado discreto y etiqueta "Foto pendiente — ...", sin que la página se vea rota.

- [ ] **Step 4: Commit**

```bash
git add instalaciones.html styles.css && git commit -m "Página Instalaciones (sin fotografía real, huecos marcados)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 11: Página Contacto — markup, mapa, formulario

**Files:**
- Modify: `contacto.html`
- Modify: `styles.css` (añadir `.contacto-*`)

**Datos literales (Prompt Maestro sección 14):**
Fisioterapia Tierra · Av. del Cardenal Cisneros 44, bajo (entrada por C. Miguel de Unamuno) · 49014 Zamora · 614 05 95 66 · info@fisioterapiatierra.es · www.fisioterapiatierra.es

- [ ] **Step 1: CSS**

```css
/* ===== Contacto ===== */
.contacto-hero{padding:var(--space-section) 0 clamp(32px,5vw,56px)}
.contacto-hero__inner{max-width:var(--container);margin:0 auto;padding:0 var(--space-inline)}
.contacto-hero h1{font-size:clamp(30px,4.2vw,56px);max-width:20ch}
.contacto-grid{max-width:var(--container);margin:0 auto;padding:0 var(--space-inline) var(--space-section);display:grid;grid-template-columns:minmax(280px,380px) 1fr;gap:clamp(32px,5vw,64px)}
.contacto-info{display:flex;flex-direction:column;gap:24px}
.contacto-info dt{font-family:var(--font-display);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--terracota);margin-bottom:4px}
.contacto-info dd{margin:0;color:var(--marron)}
.contacto-map{border-radius:var(--radius);overflow:hidden;border:1px solid rgba(65,47,43,.16);aspect-ratio:4/3}
.contacto-map iframe{width:100%;height:100%;border:0}
.contacto-form{display:flex;flex-direction:column;gap:18px}
.contacto-form label{display:flex;flex-direction:column;gap:6px;font-family:var(--font-display);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--tinta-suave)}
.contacto-form input,.contacto-form select,.contacto-form textarea{padding:14px 16px;border:1px solid rgba(65,47,43,.3);border-radius:var(--radius);background:#fff;font-size:16px}
.contacto-form textarea{min-height:140px;resize:vertical}
.contacto-form__honeypot{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.form-status{font-family:var(--font-display);font-size:13px;padding:12px 16px;border-radius:var(--radius);display:none}
.form-status.is-visible{display:block}
.form-status--ok{background:rgba(165,104,83,.12);color:var(--terracota-dark)}
.form-status--error{background:rgba(65,47,43,.1);color:var(--marron)}
@media (max-width:800px){.contacto-grid{grid-template-columns:1fr}}
```

- [ ] **Step 2: Markup**

```html
<section class="contacto-hero">
  <div class="contacto-hero__inner" data-reveal>
    <p class="eyebrow">Contacto</p>
    <h1>Cuéntanos qué te ocurre</h1>
  </div>
</section>

<section class="contacto-grid">
  <div>
    <dl class="contacto-info" data-reveal>
      <div>
        <dt>Dirección</dt>
        <dd><a href="https://www.google.com/maps/search/?api=1&query=Av.+del+Cardenal+Cisneros+44,+49014+Zamora" target="_blank" rel="noopener">Av. del Cardenal Cisneros 44, bajo<br>(entrada por C. Miguel de Unamuno)<br>49014 Zamora</a></dd>
      </div>
      <div>
        <dt>Teléfono</dt>
        <dd><a href="tel:+34614059566">614 05 95 66</a></dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd><a href="mailto:info@fisioterapiatierra.es">info@fisioterapiatierra.es</a></dd>
      </div>
    </dl>
    <div class="contacto-map" data-reveal style="margin-top:28px">
      <iframe title="Mapa de Fisioterapia Tierra en Zamora" loading="lazy" src="https://www.google.com/maps?q=Av.+del+Cardenal+Cisneros+44,+49014+Zamora&output=embed"></iframe>
    </div>
  </div>

  <form class="contacto-form" id="contact-form" method="POST" action="enviar-contacto.php" data-reveal>
    <div class="form-status" id="form-status" role="status"></div>
    <label>Nombre
      <input type="text" name="nombre" required autocomplete="name">
    </label>
    <label>Email
      <input type="email" name="email" required autocomplete="email">
    </label>
    <label>Teléfono
      <input type="tel" name="telefono" autocomplete="tel">
    </label>
    <label>Motivo de consulta
      <select name="motivo" required>
        <option value="">Selecciona un motivo</option>
        <option>Fisioterapia</option>
        <option>Osteopatía</option>
        <option>Fisioterapia deportiva</option>
        <option>Fisioterapia invasiva</option>
        <option>Punción seca</option>
        <option>Electrólisis percutánea</option>
        <option>Ecografía</option>
        <option>Rehabilitación funcional</option>
        <option>Pilates terapéutico</option>
        <option>Diatermia</option>
        <option>Otro</option>
      </select>
    </label>
    <label>Mensaje
      <textarea name="mensaje" required></textarea>
    </label>
    <label class="contacto-form__honeypot" aria-hidden="true">No rellenar
      <input type="text" name="website" tabindex="-1" autocomplete="off">
    </label>
    <button type="submit" class="btn btn--primary">Enviar</button>
  </form>
</section>
```

- [ ] **Step 3: Verificar**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,1200 --screenshot="docs/superpowers/plans/_qa/task11-contacto.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/contacto.html"
```
Esperado: columna izquierda con dirección/teléfono/email clicables + mapa embebido; columna derecha con formulario (Nombre/Email/Teléfono/Motivo con desplegable de los 10 tratamientos/Mensaje) y botón "Enviar". Abrir en navegador normal y comprobar que `tel:` y `mailto:` funcionan (se ofrece abrir la app correspondiente) y que el mapa carga.

- [ ] **Step 4: Commit**

```bash
git add contacto.html styles.css && git commit -m "Página Contacto: información, mapa y formulario

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 12: Backend del formulario (`enviar-contacto.php`)

**Files:**
- Create: `enviar-contacto.php`

**Interfaces:**
- Consumes: `POST` con campos `nombre`, `email`, `telefono` (opcional), `motivo`, `mensaje`, `website` (honeypot, debe llegar vacío).
- Produces: respuesta JSON `{"ok": true}` o `{"ok": false, "error": "..."}` con `Content-Type: application/json` (para el `fetch` de `script.js` en la Tarea 13); si la petición no es AJAX (`X-Requested-With` ausente), redirige a `contacto.html?enviado=1` o `contacto.html?enviado=0`.

**Importante:** este archivo no se puede ejecutar ni probar en esta máquina (no hay PHP instalado) ni en GitHub Pages (solo sirve estático). La verificación real de envío se hace tras subir a Hostinger.

- [ ] **Step 1: Escribir el script completo**

```php
<?php
// enviar-contacto.php — Fisioterapia Tierra
// Requiere PHP con mail() habilitado (Hostinger lo tiene por defecto).
// No funciona en GitHub Pages ni en un servidor estático.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$DESTINATARIO = 'info@fisioterapiatierra.es';

function respond(bool $ok, string $error = ''): void {
    global $DESTINATARIO;
    $isAjax = ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'XMLHttpRequest'
        || strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

    if ($isAjax) {
        echo json_encode(['ok' => $ok, 'error' => $error], JSON_UNESCAPED_UNICODE);
        exit;
    }
    header('Location: contacto.html?enviado=' . ($ok ? '1' : '0'));
    exit;
}

// Solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'Método no permitido');
}

// Honeypot: si el campo oculto "website" trae algo, es un bot — respondemos ok sin enviar nada
if (!empty($_POST['website'])) {
    respond(true);
}

// Sanea un campo de texto: recorta espacios y elimina \r\n para evitar
// inyección de cabeceras de correo si el valor se usara en un header.
function sanitize(string $value): string {
    $value = trim($value);
    return preg_replace('/[\r\n]+/', ' ', $value);
}

$nombre   = sanitize((string) ($_POST['nombre'] ?? ''));
$email    = sanitize((string) ($_POST['email'] ?? ''));
$telefono = sanitize((string) ($_POST['telefono'] ?? ''));
$motivo   = sanitize((string) ($_POST['motivo'] ?? ''));
$mensaje  = trim((string) ($_POST['mensaje'] ?? '')); // el mensaje va en el cuerpo, no en cabeceras: no hace falta quitar saltos de línea

if ($nombre === '' || $mensaje === '' || $motivo === '') {
    respond(false, 'Faltan campos obligatorios');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Email no válido');
}

$asunto = 'Nuevo contacto web — ' . $motivo;

$cuerpo = "Nuevo mensaje desde el formulario de fisioterapiatierra.es\n\n"
    . "Nombre: {$nombre}\n"
    . "Email: {$email}\n"
    . "Teléfono: " . ($telefono !== '' ? $telefono : '(no indicado)') . "\n"
    . "Motivo de consulta: {$motivo}\n\n"
    . "Mensaje:\n{$mensaje}\n";

// El remitente (From) es del propio dominio para evitar que el proveedor de
// correo marque el mensaje como spam; el email de la persona que escribe va
// en Reply-To, así "Responder" en el cliente de correo va directo a ella.
$headers = "From: Web Fisioterapia Tierra <no-responder@fisioterapiatierra.es>\r\n"
    . "Reply-To: {$nombre} <{$email}>\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n";

$enviado = mail($DESTINATARIO, $asunto, $cuerpo, $headers);

respond($enviado, $enviado ? '' : 'No se pudo enviar el correo');
```

- [ ] **Step 2: Verificar sintaxis (sin ejecutar, solo comprobar que el PHP es válido)**

No hay PHP local para `php -l`. Verificación alternativa: revisión manual línea a línea de que cada `{` abre y cierra, que las comillas están balanceadas, y que el archivo termina sin `?>` de cierre (buena práctica para evitar salida accidental). Confirmar leyendo el archivo completo con el tool de lectura.

- [ ] **Step 3: Documentar el plan de prueba post-despliegue** (añadir al final de `README.md`)

```markdown
## Probar el formulario tras subir a Hostinger
1. Abrir contacto.html en el dominio real y enviar un mensaje de prueba.
2. Confirmar que llega a info@fisioterapiatierra.es (revisar tambien Spam).
3. Si no llega: comprobar en el panel de Hostinger que mail() esta habilitado
   para el dominio y que el registro SPF permite el envio desde el propio
   hosting (Hostinger -> Emails -> Autenticacion).
```

- [ ] **Step 4: Commit**

```bash
git add enviar-contacto.php README.md && git commit -m "Añade el backend PHP del formulario de contacto (solo activo en Hostinger)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 13: Wiring de animaciones (GSAP ScrollTrigger) + fetch del formulario

**Files:**
- Modify: `script.js`

**Interfaces:**
- Consumes: `[data-reveal]` (presente en todas las páginas desde las Tareas 5-11), `#contact-form`/`#form-status` (Tarea 11).
- Produces: función `initReveals()` y `initContactForm()`, ambas llamadas en `DOMContentLoaded`.

- [ ] **Step 1: Reveals de scroll**

```js
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
```

- [ ] **Step 2: Envío del formulario de contacto por `fetch`, con fallback a envío normal**

```js
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
        form.removeEventListener('submit', arguments.callee);
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
```

- [ ] **Step 3: Verificar**

Abrir `index.html`, `servicios.html`, `instalaciones.html` en un navegador normal (no headless) con scroll — cada bloque marcado `data-reveal` debe aparecer con un fundido/desplazamiento suave al entrar en viewport, una sola vez. En `contacto.html`, enviar el formulario: como no hay PHP disponible aquí, `fetch` debe fallar (red/404) y el `catch` debe intentar el envío normal (verificar en la pestaña Red de DevTools que se intentan ambos caminos, sin que la página quede colgada o lance un error no controlado en consola).

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,900 --screenshot="docs/superpowers/plans/_qa/task13-reveals.png" "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/index.html"
```

- [ ] **Step 4: Commit**

```bash
git add script.js && git commit -m "Añade reveals de scroll (ScrollTrigger) y el envío del formulario de contacto

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 14: SEO — meta por página, JSON-LD, sitemap y robots

**Files:**
- Modify: `index.html`, `servicios.html`, `instalaciones.html`, `contacto.html` (completar `<head>`)
- Create: `sitemap.xml`, `robots.txt`

**Interfaces:** ninguna (tarea de contenido/metadatos, no de código compartido).

- [ ] **Step 1: `<head>` de `index.html`** (sustituir el comentario `<!-- TODO Tarea 14 -->`)

```html
<title>Fisioterapia Tierra | Fisioterapeuta en Zamora — Andrea Legido Andrés</title>
<meta name="description" content="Fisioterapia y osteopatía en Zamora con Andrea Legido Andrés. Fisioterapia deportiva, punción seca, electrólisis percutánea, ecografía y Pilates terapéutico. Pide tu cita.">
<link rel="canonical" href="https://www.fisioterapiatierra.es/">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_ES">
<meta property="og:site_name" content="Fisioterapia Tierra">
<meta property="og:title" content="Fisioterapia Tierra | Fisioterapeuta en Zamora">
<meta property="og:description" content="Fisioterapia y osteopatía en Zamora con Andrea Legido Andrés. Terapia manual, fisioterapia deportiva y tratamiento personalizado.">
<meta property="og:url" content="https://www.fisioterapiatierra.es/">
<meta property="og:image" content="https://www.fisioterapiatierra.es/assets/logos/logo-principal-terracota.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#412f2b">
<link rel="icon" href="assets/logos/simbolo-terracota.svg" type="image/svg+xml">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Physiotherapy",
  "name": "Fisioterapia Tierra",
  "image": "https://www.fisioterapiatierra.es/assets/logos/logo-principal-terracota.svg",
  "url": "https://www.fisioterapiatierra.es/",
  "telephone": "+34614059566",
  "email": "info@fisioterapiatierra.es",
  "priceRange": "€€",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. del Cardenal Cisneros 44, bajo",
    "addressLocality": "Zamora",
    "postalCode": "49014",
    "addressCountry": "ES"
  },
  "medicalSpecialty": ["Physiotherapy", "Osteopathic"],
  "areaServed": "Zamora",
  "founder": { "@type": "Person", "name": "Andrea Legido Andrés" },
  "makesOffer": [
    {"@type":"Offer","itemOffered":{"@type":"MedicalTherapy","name":"Fisioterapia"}},
    {"@type":"Offer","itemOffered":{"@type":"MedicalTherapy","name":"Osteopatía"}},
    {"@type":"Offer","itemOffered":{"@type":"MedicalTherapy","name":"Fisioterapia deportiva"}},
    {"@type":"Offer","itemOffered":{"@type":"MedicalTherapy","name":"Fisioterapia invasiva"}},
    {"@type":"Offer","itemOffered":{"@type":"MedicalTherapy","name":"Punción seca"}},
    {"@type":"Offer","itemOffered":{"@type":"MedicalTherapy","name":"Electrólisis percutánea"}},
    {"@type":"Offer","itemOffered":{"@type":"MedicalTherapy","name":"Ecografía"}},
    {"@type":"Offer","itemOffered":{"@type":"MedicalTherapy","name":"Rehabilitación funcional"}},
    {"@type":"Offer","itemOffered":{"@type":"MedicalTherapy","name":"Pilates terapéutico"}},
    {"@type":"Offer","itemOffered":{"@type":"MedicalTherapy","name":"Diatermia"}}
  ]
}
</script>
```

- [ ] **Step 2: `<head>` de `servicios.html`**

```html
<title>Tratamientos de fisioterapia en Zamora | Fisioterapia Tierra</title>
<meta name="description" content="Fisioterapia, osteopatía, fisioterapia deportiva, punción seca, electrólisis percutánea, ecografía, rehabilitación funcional, Pilates terapéutico y diatermia en Zamora.">
<link rel="canonical" href="https://www.fisioterapiatierra.es/servicios.html">
<meta property="og:type" content="website">
<meta property="og:title" content="Tratamientos de fisioterapia en Zamora | Fisioterapia Tierra">
<meta property="og:description" content="Soluciones personalizadas: conoce nuestros tratamientos fisioterapéuticos en Zamora.">
<meta property="og:url" content="https://www.fisioterapiatierra.es/servicios.html">
<meta name="theme-color" content="#412f2b">
<link rel="icon" href="assets/logos/simbolo-terracota.svg" type="image/svg+xml">
```

- [ ] **Step 3: `<head>` de `instalaciones.html`**

```html
<title>Instalaciones en Zamora | Fisioterapia Tierra</title>
<meta name="description" content="Conoce las instalaciones de Fisioterapia Tierra en Zamora: recepción, gabinetes de tratamiento y área de rehabilitación funcional.">
<link rel="canonical" href="https://www.fisioterapiatierra.es/instalaciones.html">
<meta property="og:type" content="website">
<meta property="og:title" content="Instalaciones en Zamora | Fisioterapia Tierra">
<meta property="og:description" content="El espacio donde ocurre el proceso: recepción, gabinetes de tratamiento y área de rehabilitación funcional.">
<meta property="og:url" content="https://www.fisioterapiatierra.es/instalaciones.html">
<meta name="theme-color" content="#412f2b">
<link rel="icon" href="assets/logos/simbolo-terracota.svg" type="image/svg+xml">
```

- [ ] **Step 4: `<head>` de `contacto.html`**

```html
<title>Contacto | Fisioterapia Tierra — Zamora</title>
<meta name="description" content="Pide tu cita en Fisioterapia Tierra, Av. del Cardenal Cisneros 44, Zamora. Teléfono 614 05 95 66, info@fisioterapiatierra.es.">
<link rel="canonical" href="https://www.fisioterapiatierra.es/contacto.html">
<meta property="og:type" content="website">
<meta property="og:title" content="Contacto | Fisioterapia Tierra — Zamora">
<meta property="og:description" content="Pide tu cita en Fisioterapia Tierra, Zamora.">
<meta property="og:url" content="https://www.fisioterapiatierra.es/contacto.html">
<meta name="theme-color" content="#412f2b">
<link rel="icon" href="assets/logos/simbolo-terracota.svg" type="image/svg+xml">
```

- [ ] **Step 5: `sitemap.xml` y `robots.txt`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.fisioterapiatierra.es/</loc><priority>1.0</priority></url>
  <url><loc>https://www.fisioterapiatierra.es/servicios.html</loc><priority>0.9</priority></url>
  <url><loc>https://www.fisioterapiatierra.es/instalaciones.html</loc><priority>0.7</priority></url>
  <url><loc>https://www.fisioterapiatierra.es/contacto.html</loc><priority>0.8</priority></url>
</urlset>
```

```
User-agent: *
Allow: /
Sitemap: https://www.fisioterapiatierra.es/sitemap.xml
```

- [ ] **Step 6: Verificar**

Abrir cada archivo `.html` y confirmar visualmente en el `<head>` (con el tool de lectura, no en navegador) que `<title>` es único por página, que `canonical`/`og:url` coinciden con el archivo, y que el favicon (`simbolo-terracota.svg`) aparece en la pestaña al abrir en un navegador normal.

- [ ] **Step 7: Commit**

```bash
git add index.html servicios.html instalaciones.html contacto.html sitemap.xml robots.txt
git commit -m "SEO: meta/OG/canonical/JSON-LD por página, sitemap.xml y robots.txt

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 15: QA final — responsive, accesibilidad y checklist anti-IA

**Files:** ninguno nuevo; solo lectura/verificación y pequeños arreglos puntuales que surjan (documentar cualquier fix en el commit).

- [ ] **Step 1: Capturas responsive de las 4 páginas**

```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
for page in index servicios instalaciones contacto; do
  for size in "1440,1200:desktop" "820,1400:tablet" "390,1600:mobile"; do
    dims="${size%%:*}"; label="${size##*:}"
    "$CHROME" --headless=new --disable-gpu --window-size=$dims \
      --screenshot="docs/superpowers/plans/_qa/final-${page}-${label}.png" \
      "file:///C:/Users/djman/Documents/Proyectos/fisio-page-Tierra/${page}.html"
  done
done
```

Revisar las 12 capturas: sin scroll horizontal, texto legible, botones con tamaño cómodo en móvil, header/menú hamburguesa funcionando, ninguna imagen rota, ninguna sección con fondo blanco puro (todo debe ser crema/terracota/azul/marrón).

- [ ] **Step 2: Checklist anti-IA (Prompt Maestro sección 28)** — responder por escrito, sección por sección de las 4 páginas:
  - ¿Podría esta sección pertenecer a cualquier clínica de fisioterapia?
  - ¿Es reconocible la identidad de Tierra sin leer el nombre (símbolo, paleta, Space Mono)?
  - ¿Las curvas topográficas están integradas de forma inteligente o son mero fondo decorativo repetido?
  - ¿Hay demasiado contenido dentro de tarjetas / demasiados grids idénticos?
  - ¿Las animaciones tienen una razón (revelan, conectan, guían) o son adorno?

Si alguna respuesta es negativa, corregir esa sección concreta en el archivo correspondiente antes de continuar.

- [ ] **Step 3: Accesibilidad — spot check manual**
  - Navegar las 4 páginas solo con teclado (Tab/Shift+Tab/Enter): el foco debe ser visible en todo momento (outline terracota) y el orden lógico.
  - Confirmar que el `skip-link` funciona (Tab nada más cargar la página debe mostrar "Saltar al contenido").
  - Confirmar `alt` en cada `<img>` (logos: `alt="Fisioterapia Tierra"`; huecos de foto no tienen `<img>` real, así que no aplica hasta que se sustituyan).
  - Confirmar contraste: texto `--marron` sobre `--crema` y texto `--crema` sobre `--marron`/`--terracota` (ambos superan AA por construcción — no se necesita herramienta adicional dado que son los 4 colores fijos del manual).

- [ ] **Step 4: Checklist técnico final (Prompt Maestro sección 31, resumido)**
  - [ ] 4 páginas presentes y enlazadas entre sí (header + footer)
  - [ ] Marquee infinito sin salto, pausa en hover, reduced-motion respetado
  - [ ] Formulario de contacto con validación HTML5 nativa (`required`, `type="email"`) + backend preparado
  - [ ] Teléfono y email clicables, dirección abre mapa
  - [ ] `sitemap.xml`/`robots.txt` presentes y coherentes con las 4 URLs reales
  - [ ] Ningún archivo del runtime `x-dc` ni foto de stock permanece en el repo (`git status` limpio, `ls` no muestra `support.js`/`image-slot.js`/`pasted-*`/`andrea-retrato*`)

- [ ] **Step 5: Limpiar capturas de QA y confirmar `.gitignore`**

```bash
cd "/c/Users/djman/Documents/Proyectos/fisio-page-Tierra"
echo "docs/superpowers/plans/_qa/" >> .gitignore
git add .gitignore
git status --short
```
Esperado: las capturas de `_qa/` no aparecen como untracked pendientes de commit (quedan ignoradas).

- [ ] **Step 6: Commit final**

```bash
git add -A
git commit -m "QA final: responsive, accesibilidad y checklist anti-IA del rediseño

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

- [ ] **Step 7: Informar al usuario** de que el rediseño está listo en la rama `pre-produccion` para revisión, recordando los dos pendientes fuera de alcance de este plan (fotografía real de instalaciones/Andrea, y verificación real del envío de correo una vez subido a Hostinger).

---

## Self-review de este plan

**Cobertura de la spec:** Contexto/decisiones de alcance → Global Constraints + notas por tarea. Arquitectura de archivos → File Structure + Task 1. Contenido por página → Tasks 5-11 (copy literal citado). Sistema visual (líneas topográficas, iconografía, marquee, anti-plantilla) → Tasks 3, 7, 9 (variación de composición). Animación → Tasks 3, 13. SEO → Task 14. Accesibilidad → Task 2 (`:focus-visible`, skip-link), Task 15. Rendimiento → fuentes locales (Task 2), sin fotos pesadas nuevas. QA final → Task 15. Formulario/backend → Tasks 11-13.

**Nota de alcance añadida durante la escritura del plan (no estaba explícita en la spec):** el footer del prompt pide enlaces "Aviso legal"/"Privacidad" que no tienen página ni contenido aprobado — se documentó la decisión de omitirlos en la Tarea 4 en vez de dejarlo ambiguo.

**Corrección de un error de la spec:** la spec decía "marquee de 9 tratamientos"; el prompt maestro lista 10 (coincide con los 10 de Servicios) — corregido en la Tarea 7.

**Placeholders:** ninguno — todo el copy es literal, todo el código es completo y ejecutable tal cual está escrito. Los `<!-- FOTO PENDIENTE -->` son intencionales y forman parte del diseño acordado (no son placeholders de plan sin resolver).

**Consistencia de tipos/nombres:** `TierraTopo.inject`/`drawOnScroll` (Task 3) se consumen vía `[data-topo]`/`data-topo-color` en Tasks 5, 6, 8, 9, 10 — nombres coherentes. `#contact-form`/`#form-status` definidos en Task 11 y consumidos en Task 13 — coherente. `enviar-contacto.php` responde `{ok, error}` (Task 12), consumido exactamente así en Task 13.
