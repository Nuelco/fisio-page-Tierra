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
