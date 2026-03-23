<?php
// api_plans.php

// --- Debug ---
// En producción, estas líneas deberían estar a 0 para no mostrar errores
ini_set('display_errors', 0); // <<-- CORREGIDO a 0 para evitar salida inesperada en producción
error_reporting(E_ALL & ~E_NOTICE); // Se mantiene para loguear, pero no mostrar

// --- Encabezados CORS y JSON ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Solo GET y POST permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- Conexión ---
// Asegúrate de que db_connect.php NO emita nada antes de su lógica PHP
require 'db_connect.php';
// --- Autenticación y Autorización (¡IMPORTANTE!) ---
// Asegúrate de que session_auth.php NO emita nada antes de su lógica PHP
require 'session_auth.php'; // Se añade la inclusión de session_auth.php para consistencia y seguridad

// Verifica los permisos para el módulo de planes
if (!check_permission('planes')) {
    http_response_code(403); // Forbidden
    echo json_encode(['error' => 'No tienes permisos para acceder a este módulo.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $plan_id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : 0;

        if ($plan_id) {
            $stmt = $pdo->prepare("SELECT plan_id, nombre_plan, velocidad, precio FROM planes WHERE plan_id = ?");
            $stmt->execute([$plan_id]);
            $plan = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($plan) {
                http_response_code(200); // OK
                echo json_encode($plan);
            } else {
                http_response_code(404); // Not Found
                echo json_encode(['error' => 'Plan no encontrado.']);
            }
        } else {
            $stmt = $pdo->query("SELECT plan_id, nombre_plan, velocidad, precio FROM planes ORDER BY plan_id ASC");
            http_response_code(200); // OK
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $data['action'] ?? null;

        if (!$action) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Acción no especificada en la petición POST.']);
            exit;
        }

        switch ($action) {
            case 'create_plan':
                if (empty($data['nombre_plan']) || empty($data['velocidad']) || !isset($data['precio']) || !is_numeric($data['precio'])) { // Validación más estricta para precio
                    http_response_code(400); // Bad Request
                    echo json_encode(['error' => 'Nombre del plan, velocidad y un precio numérico son requeridos.']);
                    exit;
                }
                try {
                    $stmt = $pdo->prepare("INSERT INTO planes (nombre_plan, velocidad, precio) VALUES (?, ?, ?)");
                    $stmt->execute([trim($data['nombre_plan']), trim($data['velocidad']), (float)$data['precio']]);
                    http_response_code(201); // Created
                    echo json_encode(['message' => 'Plan creado exitosamente.']);
                } catch (PDOException $e) {
                    if ($e->getCode() == 23000) { // Código para violación de unicidad (nombre_plan UNIQUE)
                        http_response_code(409); // Conflict
                        echo json_encode(['error' => 'El nombre de plan ya existe.']);
                    } else {
                        http_response_code(500); // Internal Server Error
                        error_log("Error de BD al crear plan en api_plans.php: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al crear plan', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
                    }
                }
                break;

            case 'update_plan':
                if (empty($data['plan_id']) || !is_numeric($data['plan_id']) || empty($data['nombre_plan']) || empty($data['velocidad']) || !isset($data['precio']) || !is_numeric($data['precio'])) {
                    http_response_code(400); // Bad Request
                    echo json_encode(['error' => 'ID, nombre del plan, velocidad y un precio numérico son requeridos para actualizar.']);
                    exit;
                }
                $plan_id_to_update = (int)$data['plan_id'];
                try {
                    $stmt = $pdo->prepare("UPDATE planes SET nombre_plan = ?, velocidad = ?, precio = ? WHERE plan_id = ?");
                    $stmt->execute([trim($data['nombre_plan']), trim($data['velocidad']), (float)$data['precio'], $plan_id_to_update]);
                    
                    if ($stmt->rowCount() > 0) {
                        http_response_code(200); // OK
                        echo json_encode(['message' => 'Plan actualizado exitosamente.']);
                    } else {
                        // Si rowCount es 0, puede que el plan no exista o no hubo cambios
                        // Se devuelve 200 OK con un mensaje informativo
                        http_response_code(200); 
                        echo json_encode(['message' => 'Plan no encontrado o no se realizaron cambios.']);
                    }
                } catch (PDOException $e) {
                    if ($e->getCode() == 23000) { // Código para violación de unicidad (nombre_plan UNIQUE)
                        http_response_code(409); // Conflict
                        echo json_encode(['error' => 'El nombre de plan ya existe.']);
                    } else {
                        http_response_code(500); // Internal Server Error
                        error_log("Error de BD al actualizar plan en api_plans.php: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al actualizar plan', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
                    }
                }
                break;

            case 'delete_plan':
                if (empty($data['plan_id']) || !is_numeric($data['plan_id'])) {
                    http_response_code(400); // Bad Request
                    echo json_encode(['error' => 'ID de plan requerido para eliminar.']);
                    exit;
                }
                $plan_id_to_delete = (int)$data['plan_id'];
                try {
                    $pdo->beginTransaction();
                    // Eliminar registros relacionados en `usuario_planes`
                    $stmt = $pdo->prepare("DELETE FROM usuario_planes WHERE plan_id = ?");
                    $stmt->execute([$plan_id_to_delete]);
                    // Eliminar registros relacionados en `facturas`
                    $stmt = $pdo->prepare("DELETE FROM facturas WHERE plan_id = ?");
                    $stmt->execute([$plan_id_to_delete]);

                    // Finalmente, eliminar el plan
                    $stmt = $pdo->prepare("DELETE FROM planes WHERE plan_id = ?");
                    $stmt->execute([$plan_id_to_delete]);
                    $pdo->commit();
                    http_response_code(200); // OK
                    echo json_encode(['message' => 'Plan eliminado exitosamente.']);
                } catch (PDOException $e) {
                    $pdo->rollBack();
                    http_response_code(500); // Internal Server Error
                    error_log("Error de BD al eliminar plan en api_plans.php: " . $e->getMessage());
                    echo json_encode(['error' => 'Error al eliminar plan', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
                }
                break;

            default:
                http_response_code(400); // Bad Request
                echo json_encode(['error' => 'Acción POST no reconocida.']);
                break;
        }
        break;

    case 'PUT':
    case 'DELETE':
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Método no permitido. Use POST para todas las operaciones de modificación.']);
        break;

    default: // Manejar cualquier método no reconocido
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Método no permitido.']);
        break;
}
// NO HAY ETIQUETA DE CIERRE PHP para evitar espacios en blanco inesperados al final.