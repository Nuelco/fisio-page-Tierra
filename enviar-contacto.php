<?php
// enviar-contacto.php — Fisioterapia Tierra
// Requiere PHP con mail() habilitado (Hostinger lo tiene por defecto).
// No funciona en GitHub Pages ni en un servidor estático.

declare(strict_types=1);

ini_set('display_errors', '0');

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

$asunto = mb_encode_mimeheader('Nuevo contacto web — ' . $motivo, 'UTF-8');

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
    . "Reply-To: " . mb_encode_mimeheader($nombre, 'UTF-8') . " <{$email}>\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n";

$enviado = mail($DESTINATARIO, $asunto, $cuerpo, $headers);

respond($enviado, $enviado ? '' : 'No se pudo enviar el correo');
