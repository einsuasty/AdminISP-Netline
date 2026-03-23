<?php
// confirmacion_wompi.php

// Deshabilita el reporte de errores para evitar que se muestren en la respuesta a Wompi
error_reporting(0);

// Incluye el archivo de conexión a la base de datos
require 'db_connect.php';

// Define tu clave de integridad (¡importante que sea la misma de tu panel de Wompi!)
const WOMPI_INTEGRITY_KEY = 'test_integrity_c9S9j6t34cW8A0c49s91wG75Fq';

// Obtiene los datos del cuerpo de la petición (petición POST)
$input_data = file_get_contents('php://input');
$data = json_decode($input_data, true);

// Verifica si los datos son válidos
if (!isset($data['data']['transaction'])) {
    http_response_code(400); // Bad Request
    echo "Invalid data received.";
    exit;
}

$transaction = $data['data']['transaction'];
$status = $transaction['status'];
$reference = $transaction['reference'];
$amount_in_cents = $transaction['amount_in_cents'];
$currency = $transaction['currency'];
$signature = $data['signature']['checksum'];

// La llave de integridad de tu cuenta de Wompi no debe ser pública
$string_to_hash = $reference . $amount_in_cents . $currency . WOMPI_INTEGRITY_KEY;
$calculated_signature = hash('sha256', $string_to_hash);

// Compara la firma calculada con la firma recibida
if ($calculated_signature === $signature) {
    if ($status === 'APPROVED') {
        // La transacción fue aprobada, actualiza el estado de las facturas en tu base de datos

        // CORRECCIÓN: Obtener el string de IDs del campo de referencia, que es confiable
        $parts = explode('-', $reference);
        $facturas_ids_string = end($parts);
        $facturas_ids = explode(',', $facturas_ids_string);

        try {
         $pdo->beginTransaction();
            foreach ($facturas_ids as $factura_id) {
                // Revisa si el factura_id no está vacío para evitar errores
                if (!empty($factura_id)) {
                    $stmt = $pdo->prepare("UPDATE facturas SET estado = 'Pagada' WHERE factura_id = ?");
                    $stmt->execute([$factura_id]);
                }
            }
            $pdo->commit();

            http_response_code(200); // OK
            echo "Transaction approved and database updated.";
        } catch (PDOException $e) {
                 $pdo->rollBack();
                http_response_code(500); // Internal Server Error
                error_log("Error de BD al actualizar factura: " . $e->getMessage());
                echo "Error updating database.";
        }

     } elseif ($status === 'DECLINED' || $status === 'VOIDED' || $status === 'ERROR') {
        http_response_code(200); // OK
        echo "Transaction was declined.";

    } elseif ($status === 'PENDING') {
        http_response_code(200); // OK
        echo "Transaction is pending.";
    }

} else {
    http_response_code(401); // Unauthorized
    echo "Invalid signature.";
}
?>