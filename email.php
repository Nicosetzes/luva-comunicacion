<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

const MAX_REQUEST_BYTES = 20_000;
const MIN_FILL_TIME_MS = 2_500;
const MAX_FORM_AGE_MS = 86_400_000;
const SUBMISSION_COOLDOWN_SECONDS = 20;

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

/**
 * @param array<string, string> $errors
 */
function respond(int $statusCode, bool $success, string $message, array $errors = []): never
{
    http_response_code($statusCode);

    echo json_encode(
        [
            'success' => $success,
            'message' => $message,
            'errors' => $errors,
        ],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    exit;
}

function postString(string $key): string
{
    $value = $_POST[$key] ?? '';
    return is_string($value) ? trim($value) : '';
}

function singleLine(string $value): string
{
    return trim((string) preg_replace('/\s+/u', ' ', $value));
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function environmentValue(string $name): ?string
{
    $value = getenv($name);
    return $value !== false && $value !== '' ? $value : null;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Método no permitido.');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > MAX_REQUEST_BYTES) {
    respond(413, false, 'La consulta supera el tamaño permitido.');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$requestHost = strtolower((string) preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
$originHost = $origin !== '' ? strtolower((string) parse_url($origin, PHP_URL_HOST)) : '';
if ($originHost !== '' && $requestHost !== '' && $originHost !== $requestHost) {
    respond(403, false, 'No se pudo validar el origen de la consulta.');
}

// Honeypot: los usuarios reales no ven ni completan este campo.
if (postString('website') !== '') {
    respond(200, true, 'Gracias. Recibimos tu consulta correctamente.');
}

$formStartedAt = filter_var(postString('form_started_at'), FILTER_VALIDATE_INT);
$nowInMilliseconds = (int) round(microtime(true) * 1000);
$formAge = $formStartedAt !== false ? $nowInMilliseconds - $formStartedAt : 0;

if ($formStartedAt === false || $formAge < MIN_FILL_TIME_MS || $formAge > MAX_FORM_AGE_MS) {
    respond(400, false, 'Recargá la página y volvé a enviar la consulta.');
}

$nombre = singleLine(postString('nombre'));
$empresa = singleLine(postString('empresa'));
$email = singleLine(postString('email'));
$telefono = singleLine(postString('telefono'));
$servicio = postString('servicio');
$ciudad = singleLine(postString('ciudad'));
$fecha = postString('fecha');
$cantidad = postString('cantidad');
$mensaje = trim(postString('mensaje'));

$serviceLabels = [
    'personal' => 'Promotoras y personal para eventos',
    'evento' => 'Evento corporativo en Mar del Plata',
    'comunicacion' => 'Imagen o comunicación corporativa',
    'otro' => 'Otra consulta',
];

$errors = [];

if (textLength($nombre) < 2 || textLength($nombre) > 80) {
    $errors['nombre'] = 'Ingresá un nombre válido de hasta 80 caracteres.';
}

if (textLength($empresa) < 2 || textLength($empresa) > 120) {
    $errors['empresa'] = 'Ingresá una empresa o marca válida.';
}

if (textLength($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errors['email'] = 'Ingresá un email válido.';
}

$phoneDigits = preg_replace('/\D+/', '', $telefono) ?? '';
if (textLength($telefono) > 40 || strlen($phoneDigits) < 6) {
    $errors['telefono'] = 'Ingresá un teléfono válido.';
}

if (!array_key_exists($servicio, $serviceLabels)) {
    $errors['servicio'] = 'Seleccioná un tipo de consulta.';
}

if (textLength($ciudad) < 2 || textLength($ciudad) > 100) {
    $errors['ciudad'] = 'Ingresá la ciudad del evento o proyecto.';
}

if ($fecha !== '') {
    // Formato argentino DD-MM-AAAA; también se aceptan "/" y "." como separadores.
    $fecha = str_replace(['/', '.'], '-', $fecha);
    $date = DateTimeImmutable::createFromFormat('!d-m-Y', $fecha);
    $dateErrors = DateTimeImmutable::getLastErrors();
    $hasDateErrors = $dateErrors !== false
        && ($dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0);

    if ($date === false || $hasDateErrors || $date->format('d-m-Y') !== $fecha) {
        $errors['fecha'] = 'Ingresá una fecha válida con el formato DD-MM-AAAA.';
    }
}

if ($cantidad !== '') {
    $validQuantity = filter_var(
        $cantidad,
        FILTER_VALIDATE_INT,
        ['options' => ['min_range' => 1, 'max_range' => 10_000]]
    );

    if ($validQuantity === false) {
        $errors['cantidad'] = 'Ingresá una cantidad válida.';
    }
}

if (textLength($mensaje) < 10 || textLength($mensaje) > 3_000) {
    $errors['mensaje'] = 'Contanos un poco más sobre el proyecto (entre 10 y 3000 caracteres).';
}

if ($errors !== []) {
    respond(422, false, 'Revisá los campos marcados e intentá nuevamente.', $errors);
}

session_name('luva_contact_form');
$sessionStarted = @session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'use_strict_mode' => true,
]);

if (!$sessionStarted) {
    error_log('[LUVA formulario] No se pudo iniciar la sesión para limitar envíos.');
    respond(503, false, 'El formulario no está disponible en este momento. Escribinos por WhatsApp o email.');
}

$lastSubmission = (int) ($_SESSION['last_submission'] ?? 0);
if ($lastSubmission > 0 && time() - $lastSubmission < SUBMISSION_COOLDOWN_SECONDS) {
    session_write_close();
    respond(429, false, 'Esperá unos segundos antes de enviar otra consulta.');
}

// Registrar el intento antes de contactar al SMTP para limitar reintentos automatizados.
$_SESSION['last_submission'] = time();
session_write_close();

$config = [
    'host' => '',
    'port' => 587,
    'encryption' => 'tls',
    'username' => '',
    'password' => '',
    'from_email' => '',
    'from_name' => 'LUVA Comunicación — Formulario web',
    'to_email' => 'comunicacionluva@gmail.com',
    'to_name' => 'LUVA Comunicación',
];

$configPath = __DIR__ . '/config/email.php';
if (is_file($configPath)) {
    try {
        $fileConfig = require $configPath;
    } catch (Throwable $exception) {
        error_log('[LUVA formulario] No se pudo cargar config/email.php: ' . $exception->getMessage());
        respond(503, false, 'El formulario no está disponible en este momento. Escribinos por WhatsApp o email.');
    }

    if (is_array($fileConfig)) {
        $config = array_replace($config, $fileConfig);
    } else {
        error_log('[LUVA formulario] config/email.php debe devolver un array.');
        respond(503, false, 'El formulario no está disponible en este momento. Escribinos por WhatsApp o email.');
    }
}

$environmentMap = [
    'host' => 'LUVA_SMTP_HOST',
    'port' => 'LUVA_SMTP_PORT',
    'encryption' => 'LUVA_SMTP_ENCRYPTION',
    'username' => 'LUVA_SMTP_USERNAME',
    'password' => 'LUVA_SMTP_PASSWORD',
    'from_email' => 'LUVA_MAIL_FROM',
    'from_name' => 'LUVA_MAIL_FROM_NAME',
    'to_email' => 'LUVA_MAIL_TO',
    'to_name' => 'LUVA_MAIL_TO_NAME',
];

foreach ($environmentMap as $configKey => $environmentName) {
    $environmentSetting = environmentValue($environmentName);
    if ($environmentSetting !== null) {
        $config[$configKey] = $environmentSetting;
    }
}

$requiredConfig = ['host', 'username', 'password', 'from_email', 'to_email'];
foreach ($requiredConfig as $configKey) {
    if (!is_string($config[$configKey]) || trim($config[$configKey]) === '') {
        error_log(sprintf('[LUVA formulario] Falta configurar %s.', $configKey));
        respond(503, false, 'El formulario no está disponible en este momento. Escribinos por WhatsApp o email.');
    }
}

if (
    filter_var($config['from_email'], FILTER_VALIDATE_EMAIL) === false
    || filter_var($config['to_email'], FILTER_VALIDATE_EMAIL) === false
) {
    error_log('[LUVA formulario] La configuración contiene una dirección de email inválida.');
    respond(503, false, 'El formulario no está disponible en este momento. Escribinos por WhatsApp o email.');
}

$port = filter_var(
    $config['port'],
    FILTER_VALIDATE_INT,
    ['options' => ['min_range' => 1, 'max_range' => 65_535]]
);

if ($port === false) {
    error_log('[LUVA formulario] El puerto SMTP configurado es inválido.');
    respond(503, false, 'El formulario no está disponible en este momento. Escribinos por WhatsApp o email.');
}

$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!is_file($autoloadPath)) {
    error_log('[LUVA formulario] No se encontró vendor/autoload.php.');
    respond(503, false, 'El formulario no está disponible en este momento. Escribinos por WhatsApp o email.');
}
try {
    require $autoloadPath;
} catch (Throwable $exception) {
    error_log('[LUVA formulario] No se pudo cargar Composer: ' . $exception->getMessage());
    respond(503, false, 'El formulario no está disponible en este momento. Escribinos por WhatsApp o email.');
}

$encryption = strtolower((string) $config['encryption']);
$encryptionMode = match ($encryption) {
    'tls', 'starttls' => PHPMailer::ENCRYPTION_STARTTLS,
    'ssl', 'smtps' => PHPMailer::ENCRYPTION_SMTPS,
    '', 'none' => '',
    default => null,
};

if ($encryptionMode === null) {
    error_log('[LUVA formulario] El modo de cifrado SMTP es inválido.');
    respond(503, false, 'El formulario no está disponible en este momento. Escribinos por WhatsApp o email.');
}

$escaped = [
    'nombre' => escapeHtml($nombre),
    'empresa' => escapeHtml($empresa),
    'email' => escapeHtml($email),
    'telefono' => escapeHtml($telefono),
    'servicio' => escapeHtml($serviceLabels[$servicio]),
    'ciudad' => escapeHtml($ciudad),
    'fecha' => escapeHtml($fecha !== '' ? $fecha : 'Sin definir'),
    'cantidad' => escapeHtml($cantidad !== '' ? $cantidad : 'Sin definir'),
    'mensaje' => nl2br(escapeHtml($mensaje)),
];

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = (string) $config['host'];
    $mail->Port = $port;
    $mail->SMTPAuth = true;
    $mail->Username = (string) $config['username'];
    $mail->Password = (string) $config['password'];
    $mail->SMTPSecure = $encryptionMode;
    $mail->SMTPAutoTLS = $encryptionMode !== '';
    $mail->Timeout = 15;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;

    $mail->setFrom((string) $config['from_email'], (string) $config['from_name']);
    $mail->addAddress((string) $config['to_email'], (string) $config['to_name']);
    $mail->addReplyTo($email, $nombre);

    $mail->isHTML(true);
    $mail->Subject = sprintf('Nueva consulta web — %s', $serviceLabels[$servicio]);
    $mail->Body = <<<HTML
<!doctype html>
<html lang="es">
  <body style="font-family: Arial, sans-serif; color: #1a1614; line-height: 1.6;">
    <h1 style="color: #6e2a2a; font-size: 22px;">Nueva consulta desde luvacomunicacion.com</h1>
    <table style="border-collapse: collapse; width: 100%; max-width: 680px;">
      <tr><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;"><strong>Nombre</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;">{$escaped['nombre']}</td></tr>
      <tr><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;"><strong>Empresa</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;">{$escaped['empresa']}</td></tr>
      <tr><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;"><strong>Email</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;">{$escaped['email']}</td></tr>
      <tr><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;"><strong>Teléfono</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;">{$escaped['telefono']}</td></tr>
      <tr><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;"><strong>Servicio</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;">{$escaped['servicio']}</td></tr>
      <tr><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;"><strong>Ciudad</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;">{$escaped['ciudad']}</td></tr>
      <tr><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;"><strong>Fecha</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;">{$escaped['fecha']}</td></tr>
      <tr><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;"><strong>Cantidad</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #ede9e0;">{$escaped['cantidad']}</td></tr>
    </table>
    <h2 style="color: #6e2a2a; font-size: 18px; margin-top: 24px;">Mensaje</h2>
    <p>{$escaped['mensaje']}</p>
  </body>
</html>
HTML;

    $mail->AltBody = implode("\n", [
        'Nueva consulta desde luvacomunicacion.com',
        'Nombre: ' . $nombre,
        'Empresa: ' . $empresa,
        'Email: ' . $email,
        'Teléfono: ' . $telefono,
        'Servicio: ' . $serviceLabels[$servicio],
        'Ciudad: ' . $ciudad,
        'Fecha: ' . ($fecha !== '' ? $fecha : 'Sin definir'),
        'Cantidad: ' . ($cantidad !== '' ? $cantidad : 'Sin definir'),
        '',
        'Mensaje:',
        $mensaje,
    ]);

    $mail->send();

    respond(200, true, '¡Gracias! Recibimos tu consulta y te vamos a responder a la brevedad.');
} catch (Throwable $exception) {
    error_log('[LUVA formulario] Error de envío: ' . $exception->getMessage());
    respond(500, false, 'No pudimos enviar la consulta. Intentá nuevamente o escribinos por WhatsApp.');
}
