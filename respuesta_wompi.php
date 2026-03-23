<?php
// respuesta_wompi.php

// Define tus URL de redirección
$success_url = "https://netlinecolombiaisp.com.co/pago-exitoso.html";
$pending_url = "https://netlinecolombiaisp.com.co/pago-pendiente.html";
$failure_url = "https://netlinecolombiaisp.com.co/pago-fallido.html";

// Obtiene el ID de la transacción y el estado de la URL
$transaction_id = isset($_GET['id']) ? $_GET['id'] : null;
$status = isset($_GET['status']) ? $_GET['status'] : null;

// Redirige al usuario a una página de destino basada en el estado
if ($status === 'APPROVED') {
    header("Location: " . $success_url);
} elseif ($status === 'PENDING') {
    header("Location: " . $pending_url);
} else {
    header("Location: " . $failure_url);
}
exit;
?>