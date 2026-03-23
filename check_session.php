<?php
// check_session.php

session_start();

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Requerir la conexión a la base de datos DESPUÉS de los encabezados y el inicio de sesión
require 'db_connect.php';

// Array con el nombre de TODOS los módulos existentes en el sistema
$all_system_modules = ['usuarios', 'planes', 'facturacion', 'ingresos-gastos', 'inventario', 'queues', 'monitoreo'];

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    
    $session_data = [
        'loggedin' => true,
        'username' => $_SESSION['username'],
        'role' => $_SESSION['role'],
        'user_id' => $_SESSION['user_id']
    ];

    $allowed_modules = [];

    // Lógica CORRECTA para determinar los módulos permitidos
    if ($_SESSION['role'] === 'SuperAdmin') {
        // El SuperAdmin siempre tiene acceso a todos los módulos
        $allowed_modules = $all_system_modules;
    } 
    elseif ($_SESSION['role'] === 'Usuario de Gestión') {
        // Para usuarios de gestión, AHORA consultamos sus permisos específicos en la base de datos
        try {
            $stmt = $pdo->prepare("SELECT nombre_modulo FROM usuario_modulos WHERE usuario_id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $allowed_modules = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
        } catch (PDOException $e) {
            // En caso de error, no se asignan módulos por seguridad
            $allowed_modules = [];
            error_log("Error al obtener permisos para el usuario {$_SESSION['user_id']}: " . $e->getMessage());
        }
    }
    // Para otros roles (como 'Cliente'), $allowed_modules permanecerá vacío y no verán ningún módulo.

    // Añadir la lista de módulos permitidos (obtenida de la base de datos) a la respuesta
    $session_data['allowed_modules'] = $allowed_modules;

    http_response_code(200); // OK
    echo json_encode($session_data);

} else {
    // Si el usuario no está loggeado
    http_response_code(401); // Unauthorized
    echo json_encode(['loggedin' => false, 'message' => 'No autorizado. Por favor, inicie sesión.']);
}