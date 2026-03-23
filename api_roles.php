<?php
// api_roles.php

// --- Configuración de Depuración (¡IMPORTANTE: Desactivar en producción!) ---
// En producción, estas líneas deberían estar a 0 para no mostrar errores
ini_set('display_errors', 0); // <<-- CORREGIDO a 0 para evitar salida inesperada en producción
error_reporting(E_ALL & ~E_NOTICE);

// --- Encabezados CORS y JSON ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Permitimos GET y POST para futuras expansiones
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=UTF-8');

// Manejo de solicitudes OPTIONS (preflight requests de CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- Conexión a la Base de Datos ---
// Asegúrate de que db_connect.php NO emita nada antes de su lógica PHP
require 'db_connect.php'; 
// --- Autenticación y Autorización (¡IMPORTANTE!) ---
// Asegúrate de que session_auth.php NO emita nada antes de su lógica PHP
require 'session_auth.php'; 

// Verifica los permisos administrativos para acceder a la información de roles
// Esto debería ser solo para SuperAdmin o un rol con permiso de 'usuarios'
if (!check_permission('usuarios') && ($_SESSION['role'] ?? '') !== 'SuperAdmin') {
    http_response_code(403); // Forbidden
    echo json_encode(['error' => 'No tienes permisos para acceder a la gestión de roles.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Intentar decodificar el cuerpo JSON para solicitudes POST
$data = [];
if ($method === 'POST') {
    $input = file_get_contents('php://input');
    if (!empty($input)) {
        $data = json_decode($input, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Formato JSON inválido en la solicitud.', 'detalle' => json_last_error_msg()]);
            exit;
        }
    }
}

// Determinar la acción a realizar
$action = $_GET['action'] ?? ($data['action'] ?? '');

// Usar un bloque try-catch a nivel superior para capturar cualquier excepción no manejada
try {
    switch ($action) {
        case 'get_roles':
            // Obtener todos los roles disponibles
            $sql = "SELECT rol_id, nombre_rol FROM roles ORDER BY nombre_rol ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200); // OK
            echo json_encode($roles);
            break;

        case 'get_role_permissions':
            // Obtener los módulos a los que un rol específico tiene permiso
            $rol_id = filter_var($_GET['rol_id'] ?? null, FILTER_VALIDATE_INT);

            if (!$rol_id || $rol_id <= 0) {
                http_response_code(400); // Bad Request
                echo json_encode(['error' => 'ID de rol inválido o no proporcionado.']);
                exit;
            }

            $sql = "SELECT nombre_modulo FROM rol_modulos WHERE rol_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$rol_id]);
            $modules = $stmt->fetchAll(PDO::FETCH_COLUMN, 0); // Obtener solo los nombres de los módulos
            http_response_code(200); // OK
            echo json_encode($modules);
            break;
        
        default:
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Acción no reconocida o método no soportado para esta acción.']);
            break;
    }
} catch (PDOException $e) {
    // Captura errores de la base de datos no manejados específicamente
    http_response_code(500); // Internal Server Error
    error_log("Error de BD en api_roles.php: " . $e->getMessage()); // Log del error
    // Muestra detalle solo si display_errors está en 1 (para depuración)
    echo json_encode(['error' => 'Error de base de datos.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
} catch (Exception $e) {
    // Captura cualquier otra excepción no manejada
    http_response_code(500); // Internal Server Error
    error_log("Error interno en api_roles.php: " . $e->getMessage()); // Log del error
    // Muestra detalle solo si display_errors está en 1 (para depuración)
    echo json_encode(['error' => 'Error interno del servidor.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
}

// NO HAY ETIQUETA DE CIERRE PHP para evitar espacios en blanco inesperados al final.