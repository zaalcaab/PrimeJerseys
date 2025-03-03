<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Cargar PHPMailer
require 'libs/Exception.php';
require 'libs/PHPMailer.php';
require 'libs/SMTP.php';

// Datos del formulario
$producto = $_POST['producto'];
$precio = $_POST['precio'];
$cantidad = $_POST['cantidad'];
$total = $_POST['total'];
$emailDestino = "contact.primejersey@gmail.com"; // Tu correo Gmail

// Configurar PHPMailer
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';  // Servidor SMTP de Gmail
    $mail->SMTPAuth = true;
    $mail->Username = 'TU_CORREO@gmail.com';  // ⚠️ Tu correo Gmail
    $mail->Password = 'TU_CONTRASEÑA';  // ⚠️ Tu contraseña de aplicación (ver abajo)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Configurar el email
    $mail->setFrom('TU_CORREO@gmail.com', 'Prime Jerseys');
    $mail->addAddress($emailDestino);
    $mail->Subject = "Nuevo Pedido - Prime Jerseys";
    $mail->Body = "Se ha recibido un nuevo pedido:\n\n"
                . "Producto: $producto\n"
                . "Precio unitario: €$precio\n"
                . "Cantidad: $cantidad\n"
                . "Total a pagar: €$total";

    // Enviar email
    $mail->send();
    echo "Pedido enviado con éxito. Te contactaremos pronto.";
} catch (Exception $e) {
    echo "Error al enviar el pedido: {$mail->ErrorInfo}";
}
?>
