<?php

declare(strict_types=1);

// Renombrar a config/email.php y completar con los datos del SMTP.

// Combinaciones habituales:
// - Puerto 465 + 'ssl'  (SMTPS)
// - Puerto 587 + 'tls'  (STARTTLS)
return [
    'host' => 'mail.luvacomunicacion.com',
    'port' => 465,
    'encryption' => 'ssl', // ssl/smtps (puerto 465), tls/starttls (puerto 587) o none.
    'username' => 'web@luvacomunicacion.com',
    'password' => 'REEMPLAZAR_CON_CREDENCIAL_PRIVADA',
    // Debe ser la misma casilla autenticada para evitar rechazos o spam.
    'from_email' => 'web@luvacomunicacion.com',
    'from_name' => 'LUVA Comunicación — Formulario web',
    'to_email' => 'comunicacionluva@gmail.com',
    'to_name' => 'LUVA Comunicación',
];
