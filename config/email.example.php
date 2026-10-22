<?php

declare(strict_types=1);

// Renombrar a config/email.php y completar con los datos de la cuenta de Gmail.

// Combinaciones habituales de Gmail:
// - Puerto 465 + 'ssl'  (SMTPS)
// - Puerto 587 + 'tls'  (STARTTLS)
return [
    'host' => 'smtp.gmail.com',
    'port' => 465,
    'encryption' => 'ssl', // ssl/smtps (puerto 465), tls/starttls (puerto 587) o none.
    'username' => 'REEMPLAZAR_CON_GMAIL_DEL_CLIENTE@gmail.com',
    // Contraseña de aplicación de Gmail (16 caracteres), no la contraseña de la cuenta.
    'password' => 'REEMPLAZAR_CON_CONTRASENA_DE_APLICACION',
    // Debe ser la misma cuenta autenticada en 'username'; si no, Gmail reescribe
    // el remitente o rechaza el envío.
    'from_email' => 'REEMPLAZAR_CON_GMAIL_DEL_CLIENTE@gmail.com',
    'from_name' => 'LUVA Comunicación — Formulario web',
    // Cuenta que recibe las consultas. Puede ser la misma u otra.
    'to_email' => 'comunicacionluva@gmail.com',
    'to_name' => 'LUVA Comunicación',
];
