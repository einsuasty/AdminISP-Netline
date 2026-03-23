<?php
session_start();

// Solo proceder si hay una sesión activa
if (!isset($_SESSION['mikrotik_ip'])) {
    // Si no hay sesión, devuelve un error JSON
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'No autenticado.']);
    exit();
}

require_once 'config.php'; // Agregado

$python_path = PYTHON_EXE;    // Cambiado
$script_path = PYTHON_SCRIPT; // Cambiado

// Credenciales de la sesión
$ip = escapeshellarg($_SESSION['mikrotik_ip']);
$user = escapeshellarg($_SESSION['mikrotik_user']);
$pass = escapeshellarg($_SESSION['mikrotik_pass']);

// Llamar a la nueva acción 'traffic' en el script de Python
$command = "$python_path $script_path $ip $user $pass traffic";
$response_json = shell_exec($command);

// Devolver la respuesta JSON directamente al frontend
header('Content-Type: application/json');

// Si shell_exec falla, puede devolver null. Nos aseguramos de devolver un JSON válido.
if ($response_json === null) {
    echo json_encode(['status' => 'error', 'message' => 'El script de Python no devolvió una respuesta.']);
} else {
    echo $response_json;
}
?>