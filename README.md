# Fisioterapia Tierra — web

Sitio estatico. No necesita build ni dependencias: se sirve tal cual.

## Contenido
- index.html, servicios.html, instalaciones.html, contacto.html  paginas reales
- styles.css / script.js   sistema visual y animaciones (GSAP + ScrollTrigger por CDN)
- enviar-contacto.php      backend del formulario de contacto (solo funciona en hosting con PHP, ej. Hostinger)
- assets/                  fuentes, logos oficiales, recursos de marca
- sitemap.xml / robots.txt

## Publicar
Subir SOLO estos archivos y carpetas a la raiz del hosting (Hostinger):
- index.html, servicios.html, instalaciones.html, contacto.html
- styles.css, script.js, enviar-contacto.php
- sitemap.xml, robots.txt
- assets/fonts/, assets/logos/

NO subir docs/, .superpowers/, README.md, ni los assets/*.jpg y assets/ondas-*.png
sin usar (rrss-1.jpg, rrss-2.jpg, rrss-igstories1.jpg, rrss-igstories2.jpg,
ondas-1.png, ondas-2.png no estan referenciados por ninguna pagina actual).

Las rutas son relativas, funciona en cualquier subcarpeta sin cambios.
El formulario de contacto necesita PHP en el servidor (Hostinger lo tiene) para
enviar a info@fisioterapiatierra.es — no funciona en GitHub Pages ni en local.

Marca segun "Fisioterapia Tierra - manual de identidad" (docs/brief/):
crema #ede7da, terracota #a56853, azul grisaceo #bbcccf, marron oscuro #412f2b.
Tipografias: Space Mono (principal) y Rethink Sans (secundaria).

## Probar el formulario tras subir a Hostinger
1. Abrir contacto.html en el dominio real y enviar un mensaje de prueba.
2. Confirmar que llega a info@fisioterapiatierra.es (revisar tambien Spam).
3. Si no llega: comprobar en el panel de Hostinger que mail() esta habilitado
   para el dominio y que el registro SPF permite el envio desde el propio
   hosting (Hostinger -> Emails -> Autenticacion).
