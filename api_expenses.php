<?php
// api_expenses.php

// --- Configuración de Depuración (¡IMPORTANTE: Desactivar en producción!) ---
// En producción, estas líneas deberían estar a 0 para no mostrar errores
ini_set('display_errors', 0); // Recomendado para producción
error_reporting(E_ALL & ~E_NOTICE); // Esto mostrará errores en el log, pero no en la salida al cliente

// --- Encabezados CORS y JSON ---
// **IMPORTANTE: En producción, restringe Access-Control-Allow-Origin a tu dominio específico.**
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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

// Verifica los permisos para el módulo de ingresos-gastos
if (!check_permission('ingresos-gastos')) {
    http_response_code(403); // Forbidden
    echo json_encode(['error' => 'No tienes permisos para acceder a este módulo.']);
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
        case 'get_expenses':
            $start_date = trim($_GET['start_date'] ?? '');
            $end_date = trim($_GET['end_date'] ?? '');

            $sql = "SELECT expense_id, category, description, amount, date FROM gastos";
            $conditions = [];
            $params = [];

            if ($start_date && $end_date) {
                $start_date_obj = DateTime::createFromFormat('Y-m-d', $start_date);
                $end_date_obj = DateTime::createFromFormat('Y-m-d', $end_date);

                if (!$start_date_obj || $start_date_obj->format('Y-m-d') !== $start_date ||
                    !$end_date_obj || $end_date_obj->format('Y-m-d') !== $end_date) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Formato de fecha inválido o fecha no válida. Use YYYY-MM-DD.']);
                    exit;
                }
                $conditions[] = "`date` BETWEEN ? AND ?"; // `date` es palabra reservada, mejor entre backticks
                $params[] = $start_date;
                $params[] = $end_date;
            } elseif ($start_date) {
                $start_date_obj = DateTime::createFromFormat('Y-m-d', $start_date);
                if (!$start_date_obj || $start_date_obj->format('Y-m-d') !== $start_date) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Formato de fecha de inicio inválido o fecha no válida. Use YYYY-MM-DD.']);
                    exit;
                }
                $conditions[] = "`date` >= ?";
                $params[] = $start_date;
            } elseif ($end_date) {
                $end_date_obj = DateTime::createFromFormat('Y-m-d', $end_date);
                if (!$end_date_obj || $end_date_obj->format('Y-m-d') !== $end_date) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Formato de fecha de fin inválido o fecha no válida. Use YYYY-MM-DD.']);
                    exit;
                }
                $conditions[] = "`date` <= ?";
                $params[] = $end_date;
            }

            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY `date` DESC, expense_id DESC"; // `date` con backticks

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($expenses);
            break;

        case 'get_expense':
            $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
            if (!$id || $id <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de gasto inválido o no proporcionado.']);
                exit;
            }

            $stmt = $pdo->prepare("SELECT expense_id, category, description, amount, `date` FROM gastos WHERE expense_id = ?"); // `date` con backticks
            $stmt->execute([$id]);
            $expense = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($expense) {
                echo json_encode($expense);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Gasto no encontrado.']);
            }
            break;

        case 'add_expense':
            $category = trim($data['category'] ?? '');
            $description = trim($data['description'] ?? '');
            $amount = filter_var($data['amount'] ?? 0, FILTER_VALIDATE_FLOAT);
            $date = trim($data['date'] ?? date('Y-m-d'));

            $date_obj = DateTime::createFromFormat('Y-m-d', $date);
            if (empty($category) || empty($description) || $amount === false || $amount <= 0 || !$date_obj || $date_obj->format('Y-m-d') !== $date) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos de gasto incompletos o inválidos.', 'recibido' => $data]);
                exit();
            }

            $stmt = $pdo->prepare("INSERT INTO gastos (category, description, amount, `date`) VALUES (?, ?, ?, ?)"); // `date` con backticks
            $stmt->execute([$category, $description, $amount, $date]);

            http_response_code(201); // Created
            echo json_encode(['message' => 'Gasto añadido exitosamente.', 'expense_id' => $pdo->lastInsertId()]);
            break;

        case 'update_expense':
            $id = filter_var($data['expense_id'] ?? null, FILTER_VALIDATE_INT);
            $category = trim($data['category'] ?? '');
            $description = trim($data['description'] ?? '');
            $amount = filter_var($data['amount'] ?? 0, FILTER_VALIDATE_FLOAT);
            $date = trim($data['date'] ?? date('Y-m-d'));

            $date_obj = DateTime::createFromFormat('Y-m-d', $date);
            if (!$id || $id <= 0 || empty($category) || empty($description) || $amount === false || $amount <= 0 || !$date_obj || $date_obj->format('Y-m-d') !== $date) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos de gasto incompletos o inválidos para actualizar.']);
                exit();
            }

            $stmt = $pdo->prepare("UPDATE gastos SET category = ?, description = ?, amount = ?, `date` = ? WHERE expense_id = ?"); // `date` con backticks
            $stmt->execute([$category, $description, $amount, $date, $id]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Gasto actualizado exitosamente.']);
            } else {
                // Considerar 200 OK con mensaje de "no cambios" si no es un error 404
                http_response_code(200); 
                echo json_encode(['message' => 'Gasto no encontrado o no se realizaron cambios.']);
            }
            break;

        case 'delete_expense':
            $id = filter_var($data['expense_id'] ?? null, FILTER_VALIDATE_INT);
            if (!$id || $id <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de gasto inválido o no proporcionado para eliminar.']);
                exit();
            }

            $stmt = $pdo->prepare("DELETE FROM gastos WHERE expense_id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Gasto eliminado exitosamente.']);
            http_response_code(200); // 200 OK para eliminación exitosa
            } else {
                http_response_code(404); // Si no se encuentra, es 404
                echo json_encode(['error' => 'Gasto no encontrado o ya eliminado.']);
            }
            break;

        case 'get_categories':
            // Opción recomendada: Obtener categorías de una tabla dedicada 'expense_categories'
            $sql = "SELECT category_name FROM expense_categories ORDER BY category_name";
            $stmt = $pdo->query($sql);
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($categories);
            break;

        case 'add_category':
            $category_name = trim($data['category_name'] ?? '');
            if (empty($category_name)) {
                http_response_code(400);
                echo json_encode(['error' => 'Nombre de categoría no proporcionado.']);
                exit();
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO expense_categories (category_name) VALUES (?)");
                $stmt->execute([$category_name]);
                http_response_code(201); // Created
                echo json_encode(['message' => "Categoría '{$category_name}' añadida exitosamente."]);
            } catch (PDOException $e) {
                // Código de error 23000 es para violación de unicidad (duplicado)
                if ($e->getCode() == 23000) {
                    http_response_code(409); // Conflict
                    echo json_encode(['error' => "La categoría '{$category_name}' ya existe."]);
                } else {
                    http_response_code(500);
                    error_log("Error al añadir categoría: " . $e->getMessage()); // Log del error
                    echo json_encode(['error' => 'Error al añadir categoría: ' . (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
                }
            }
            break;

        default:
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Acción no reconocida o método no soportado para esta acción.']);
            break;
    }
} catch (PDOException $e) {
    // Captura errores de la base de datos no manejados específicamente
    http_response_code(500); // Internal Server Error
    error_log("Error de BD en api_expenses.php: " . $e->getMessage()); // Log del error
    // Muestra detalle solo si display_errors está en 1 (para depuración)
    echo json_encode(['error' => 'Error de base de datos.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
} catch (Exception $e) {
    // Captura cualquier otra excepción no manejada
    http_response_code(500); // Internal Server Error
    error_log("Error interno en api_expenses.php: " . $e->getMessage()); // Log del error
    // Muestra detalle solo si display_errors está en 1 (para depuración)
    echo json_encode(['error' => 'Error interno del servidor.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
}

// NO HAY ETIQUETA DE CIERRE PHP para evitar espacios en blanco inesperados al final.