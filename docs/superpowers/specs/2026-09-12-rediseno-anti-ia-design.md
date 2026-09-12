# Rediseño Fisioterapia Tierra — anti-plantilla / anti-IA

Rama: `pre-produccion` (creada desde `desarrollo`). Fuente de contenido: [`docs/brief/Prompt_Maestro_Fisioterapia_Tierra.txt`](../../brief/Prompt_Maestro_Fisioterapia_Tierra.txt) — es la fuente de verdad para todo texto, estructura y regla de marca; este documento no repite el contenido literal salvo cuando hace falta fijar una decisión.

## Contexto

La web actual en `desarrollo` (single-page, generada por un runtime de componentes `x-dc`/`support.js`) ya usa la paleta e identidad correctas (beige `#ede7da`, terracota `#a56853`, azul `#bbcccf`, marrón `#412f2b`; Rethink Sans + Space Mono), pero la clienta la ve "muy típica de IA". Causas identificadas al auditar el repo:

1. **Markup generado por plantilla**: todo en un único nodo `<x-dc>` con estilos inline y atributos `sc-if`/`onClick="{{ }}"`. Imposible conseguir las composiciones asimétricas que pide el prompt (sección 6/7) sobre esa base.
2. **Fotografía de stock/IA**: `andrea-retrato-*.jpg` y los `pasted-*.png` de "instalaciones" muestran una modelo genérica, atrezzo de stock (esqueleto, láminas anatómicas) y un logo bordado **incorrecto** (el símbolo antiguo de bolas, no el símbolo torso actual). Contradice la sección 23 del prompt casi punto por punto.
3. **Estructura de 7 vistas** (incluye Tarifas y FAQ) cuando el prompt pide exactamente 4 páginas.

Dos assets sí son de marca genuina y de buena calidad: `assets/rrss-1.jpg` y `assets/rrss-2.jpg` (líneas topográficas sobre foto de cuerpo real, símbolo correcto, tono editorial) — se conservan y se usan como referencia de dirección de arte.

**Actualización:** el manual y los materiales oficiales sí existen en esta máquina, en `C:\Users\djman\Downloads\INFORMACION_TIERRA\` (no en la ruta `C:\_TIERRA\...` que citaba el prompt). Ya revisado íntegro (25 páginas) — confirma exactamente la paleta, tipografías y símbolo que ya se estaban usando, y aporta dos cosas que ya se han incorporado al repo:
- **Kit de logo oficial completo**: 6 colores (azul/beige/blanco/marrón/negro/terracota) × 4 variantes (horizontal/vertical/principal/símbolo solo) en `assets/logos/`, sustituyendo el subconjunto parcial que había en la raíz de `assets/`.
- **Patrón de líneas topográficas de referencia** (página "Vinilos cristales" del manual): confirma que `ondas-1/2.png` ya es el recurso gráfico oficial; los SVG nuevos que se dibujen deben seguir ese mismo lenguaje de curvas orgánicas.
- Dos imágenes rrss adicionales (`rrss-igstories1.jpg`, `rrss-igstories2.jpg`) copiadas también a `assets/`.

La carpeta de materiales **no contiene fotografía real de las instalaciones ni de Andrea** (solo logo, papelería, ropa, rótulos, fuentes y piezas de rrss) — la decisión de aplazar la fotografía real (ver más abajo) se mantiene sin cambios.

## Decisiones de alcance (acordadas con el usuario)

- **Sin fotografía real por ahora.** No se generan fotos nuevas de IA ni se reutiliza el stock actual. Las vistas que el prompt prevé con fotografía (hero, Instalaciones, presentación de Andrea) se resuelven con tipografía, color y líneas topográficas. Cada hueco de foto futura se marca en el HTML con un comentario `<!-- FOTO PENDIENTE: descripción, ratio esperado -->` en el lugar exacto de inserción, para que añadir la foto real sea un cambio quirúrgico. **Instalaciones quedará por debajo de su potencial** hasta que existan fotos reales — es una limitación conocida, no un olvido.
- **Reconstrucción completa en HTML/CSS/JS a mano**, sin el runtime `x-dc`. Se eliminan `support.js`, `image-slot.js` y toda la vista actual. Se elimina `andrea-retrato-*.jpg` y los `pasted-*.png`.
- **4 páginas HTML reales**: `index.html`, `servicios.html`, `instalaciones.html`, `contacto.html`. Decisión revisada en la propia conversación: la clienta quiere aparecer en Google con sitelinks (ej. captura de `fisiopinto.com` con Contacto/Instalaciones/etc. como resultados propios bajo el dominio). Eso exige páginas servidas de forma independiente con su propio `<title>`/meta/JSON-LD — no se consigue de forma fiable con una SPA de URL única, y menos aún si el hosting final no tiene lógica de servidor.
- **Despliegue final: Hostinger** (hosting real con servidor, subida manual de archivos según el propio `README.md` del repo). No hace falta ningún hack de fallback tipo GitHub Pages 404→index; rutas limpias funcionan de forma nativa.
- **Sin Tarifas ni FAQ.** Se eliminan como vistas; su contenido no se traslada a ningún otro sitio (así lo pidió el usuario).
- Contenido de texto: se copia **literal** del prompt maestro (títulos, subtítulos, frases, textos de los 10 servicios, método, contacto). No se inventa ni se parafrasea.

## Arquitectura de archivos

```
index.html
servicios.html
instalaciones.html
contacto.html
styles.css
script.js
sitemap.xml
robots.txt
assets/
  fonts/            (Rethink Sans, Space Mono)
  logos/            (kit oficial completo: 6 colores × h/v/principal/símbolo)
  ondas-1.png, ondas-2.png            (patrón topográfico oficial)
  rrss-1.jpg, rrss-2.jpg, rrss-igstories1.jpg, rrss-igstories2.jpg  (piezas de marca reutilizables)
docs/
  brief/Prompt_Maestro_Fisioterapia_Tierra.txt
  brief/Fisioterapia Tierra-manual de identidad.pdf
  superpowers/specs/... (este documento)
README.md          (se actualiza: ya no es single-page ni x-dc)
```

Cada página comparte `styles.css` y `script.js` (sin bundler, sin build — coherente con el resto de proyectos del usuario). GSAP + ScrollTrigger se cargan por CDN como en la versión editorial antigua (`master` histórico).

## Sistema de contenido por página

Fuente literal: prompt maestro secciones 11–14. Resumen de qué vive dónde (sin repetir el texto):

- **`index.html`**: hero (título/subtítulo exactos, sin foto real — composición tipográfica + líneas topográficas, más un `<!-- FOTO PENDIENTE -->` en el punto donde iría la fotografía editorial descrita en 11.1), bloque de frases (11.2, composición tipográfica progresiva, no tarjetas), presentación de Tierra/Andrea (11.3, con `<!-- FOTO PENDIENTE: retrato Andrea -->`), filosofía (11.4), marquee de 9 tratamientos (11.5), Método (11.6, trayectoria topográfica conectando 3 puntos), CTA final (11.7).
- **`servicios.html`**: título exacto de sección 12, recorrido editorial de los 10 tratamientos con sus textos literales, composición de escalas variables (nunca grid uniforme de 10 tarjetas iguales).
- **`instalaciones.html`**: sin fotografía real (ver limitación arriba). Se resuelve con tipografía grande, paleta de marca, líneas topográficas y los `<!-- FOTO PENDIENTE -->` marcados en los puntos donde el prompt (sección 13) pide fotografía grande/pequeña y detalles.
- **`contacto.html`**: dirección, mapa, teléfono/email clicables, formulario (Nombre/Email/Teléfono/Motivo/Mensaje). El formulario hace `POST` a `enviar-contacto.php`, un endpoint PHP propio (sin dependencias) que envía el mensaje por `mail()` a **`info@fisioterapiatierra.es`** — funciona automáticamente en cuanto el sitio se sube a Hostinger (hosting con PHP), sin tocar nada más. **No funciona en GitHub Pages** (solo sirve estático, no ejecuta PHP) ni se puede probar en esta máquina (no hay PHP instalado) — la primera prueba de envío real se hace ya en Hostinger tras subir los archivos. El PHP valida y sanea los campos (evita inyección de cabeceras de correo vía `\r`/`\n` en Nombre/Email/Motivo), incluye un campo honeypot oculto anti-spam, y el JS del formulario hace el `POST` por `fetch` mostrando éxito/error en la propia página sin recargar; si JS está desactivado, el `<form>` cae a un envío normal con redirección a la propia página con un aviso de confirmación por query string.

## Sistema visual

- **Líneas topográficas**: SVGs propios, trazados a mano por coordenadas (no geometría perfecta), inspirados en `rrss-1/2.jpg` y el símbolo torso ya existente. Reutilizables como fondo de hero, divisores entre secciones, trayectoria del Método, CTA final y footer — con continuidad entre secciones (línea que empieza en una sección y sigue en la siguiente, sección 24 del prompt).
- **Iconografía**: lineal, dibujada a mano en el mismo lenguaje del símbolo torso. Nada de Font Awesome/Lucide/Material Icons.
- **Marquee**: loop infinito real (mismo mecanismo `translateX(-50%)` que ya existe, pero con separadores inspirados en el símbolo y tipografía Space Mono), pausa al hover en desktop, respeta `prefers-reduced-motion`.
- **Anti-plantilla**: cada sección tiene una composición distinta (sección 6/7 del prompt); ningún patrón de "3 tarjetas idénticas" se repite dos veces en el sitio.

## Animación

GSAP + ScrollTrigger: reveals de texto, líneas que se dibujan al hacer scroll, transiciones suaves, marquee, sin rebotes/elasticidad/3D/partículas (sección 17). `prefers-reduced-motion` desactiva o simplifica todas las animaciones no esenciales.

## SEO

- Cada página: `<title>` y meta description propios, Open Graph, canonical, JSON-LD (`Physiotherapy`/`LocalBusiness`) con lista de servicios y dirección real de contacto.
- `sitemap.xml` con las 4 URLs, `robots.txt` apuntando a él.
- Navegación clara e interlinking (header + footer) entre las 4 páginas — es lo que ayuda a Google a entender la jerarquía y ofrecer sitelinks; no hay garantía de que Google los muestre (es una decisión algorítmica suya), pero esta estructura es la condición necesaria.
- Palabras clave objetivo: sección 21 del prompt (fisioterapia/osteopatía/rehabilitación/Pilates terapéutico en Zamora), integradas de forma natural en títulos y copy, no forzadas.

## Accesibilidad

HTML semántico, contraste AA mínimo con la paleta de marca, navegación por teclado, focus states visibles, formulario accesible (labels reales), alt text descriptivo (incluido en los placeholders `<!-- FOTO PENDIENTE -->`, para que el alt correcto quede definido de antemano), skip-link, `prefers-reduced-motion`.

## Rendimiento

Sin fotos pesadas que optimizar por ahora (ver limitación). Fuentes locales ya en `assets/fonts` (evitar Google Fonts). SVGs de líneas topográficas optimizados (paths limpios, sin metadata de editor). `ondas-1/2.png` y `rrss-1/2.jpg` a revisar de tamaño/compresión antes de publicar.

## QA final (checklist del propio prompt, sección 28/31)

Antes de dar por cerrado el rediseño, repasar sección por sección: ¿podría esta sección pertenecer a cualquier clínica de fisioterapia? ¿Es reconocible la identidad de Tierra sin leer el nombre? ¿Hay demasiadas tarjetas/grids repetidos? ¿Las animaciones tienen una razón? Más el checklist de marca/páginas/contenido/experiencia/responsive/técnico de la sección 31.

## Fuera de alcance

1. **Fotografía real** de instalaciones y de Andrea — bloquea que Instalaciones y el hero alcancen el nivel que describe el prompt. Se retoma cuando el usuario la aporte.
2. Migrar el histórico de Tarifas/FAQ a otro canal (folleto, WhatsApp) queda fuera de esta spec — el usuario pidió eliminarlos sin más.
3. Verificación end-to-end del envío de correo real — no se puede probar hasta que el sitio esté subido a Hostinger (sin PHP disponible en local ni en GitHub Pages).
