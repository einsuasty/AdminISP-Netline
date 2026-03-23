<?php

// --- Configuración de Depuración (¡IMPORTANTE: Desactivar en producción!) ---
ini_set('display_errors', 0); 
error_reporting(E_ALL & ~E_NOTICE);

// --- Encabezados CORS y JSON ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db_connect.php'; 
require 'session_auth.php'; 

if (!check_permission('ingresos-gastos')) {
    http_response_code(403);
    echo json_encode(['error' => 'No tienes permisos para acceder a este módulo.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$data = [];
if ($method === 'POST') {
    $input = file_get_contents('php://input');
    if (!empty($input)) {
        $data = json_decode($input, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'Formato JSON inválido en la solicitud.', 'detalle' => json_last_error_msg()]);
            exit;
        }
    }
}

$action = $_GET['action'] ?? ($data['action'] ?? '');

try {
    switch ($action) {
        // --- ACCIONES PARA GASTOS REGISTRADOS (HISTORIAL) ---
        case 'get_expenses':
            $start_date = trim($_GET['start_date'] ?? '');
            $end_date = trim($_GET['end_date'] ?? '');

            $sql = "SELECT expense_id, category, description, amount, date FROM gastos";
            $conditions = [];
            $params = [];

            if ($start_date && $end_date) {
                $conditions[] = "`date` BETWEEN ? AND ?";
                $params[] = $start_date;
                $params[] = $end_date;
            } elseif ($start_date) {
                $conditions[] = "`date` >= ?";
                $params[] = $start_date;
            } elseif ($end_date) {
                $conditions[] = "`date` <= ?";
                $params[] = $end_date;
            }

            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY `date` DESC, expense_id DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($expenses);
            break;

        case 'delete_expense': // Eliminar del historial de gastos
            $id = filter_var($data['expense_id'] ?? null, FILTER_VALIDATE_INT);
            if (!$id || $id <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de gasto inválido para eliminar.']);
                exit();
            }
            $stmt = $pdo->prepare("DELETE FROM gastos WHERE expense_id = ?");
            $stmt->execute([$id]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Gasto del historial eliminado exitosamente.']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Gasto no encontrado en el historial.']);
            }
            break;

        // --- ACCIONES PARA GASTOS RECURRENTES (PLANTILLAS) ---
        case 'get_recurring_expenses':
            $stmt = $pdo->query("SELECT id, category, description, amount FROM gastos_recurrentes ORDER BY category, description");
            $recurring_expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($recurring_expenses);
            break;

        case 'add_recurring_expense':
            $category = trim($data['category'] ?? '');
            $description = trim($data['description'] ?? '');
            $amount = filter_var($data['amount'] ?? 0, FILTER_VALIDATE_FLOAT);

            if (empty($category) || empty($description) || $amount === false || $amount <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos de gasto recurrente incompletos o inválidos.', 'recibido' => $data]);
                exit();
            }

            $stmt = $pdo->prepare("INSERT INTO gastos_recurrentes (category, description, amount) VALUES (?, ?, ?)");
            $stmt->execute([$category, $description, $amount]);

            http_response_code(201);
            echo json_encode(['message' => 'Gasto recurrente añadido a la lista exitosamente.', 'id' => $pdo->lastInsertId()]);
            break;

        case 'update_recurring_expense':
            $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
            $category = trim($data['category'] ?? '');
            $description = trim($data['description'] ?? '');
            $amount = filter_var($data['amount'] ?? 0, FILTER_VALIDATE_FLOAT);

            if (!$id || $id <= 0 || empty($category) || empty($description) || $amount === false || $amount <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos de gasto recurrente incompletos o inválidos para actualizar.']);
                exit();
            }

            $stmt = $pdo->prepare("UPDATE gastos_recurrentes SET category = ?, description = ?, amount = ? WHERE id = ?");
            $stmt->execute([$category, $description, $amount, $id]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Gasto recurrente actualizado exitosamente.']);
            } else {
                http_response_code(200);
                echo json_encode(['message' => 'Gasto recurrente no encontrado o no se realizaron cambios.']);
            }
            break;
            
        case 'delete_recurring_expense':
            $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
            if (!$id || $id <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de gasto recurrente inválido.']);
                exit();
            }
            $stmt = $pdo->prepare("DELETE FROM gastos_recurrentes WHERE id = ?");
            $stmt->execute([$id]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Gasto recurrente eliminado exitosamente.']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Gasto recurrente no encontrado.']);
            }
            break;

        case 'register_bulk_expenses':
            $ids = $data['ids'] ?? [];
            $date = $data['date'] ?? '';

            $date_obj = DateTime::createFromFormat('Y-m-d', $date);
            if (empty($ids) || !$date_obj || $date_obj->format('Y-m-d') !== $date) {
                http_response_code(400);
                echo json_encode(['error' => 'Debe seleccionar al menos un gasto y proporcionar una fecha válida.']);
                exit();
            }

            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            $stmt_get = $pdo->prepare("SELECT category, description, amount FROM gastos_recurrentes WHERE id IN ($placeholders)");
            $stmt_get->execute($ids);
            $expenses_to_add = $stmt_get->fetchAll(PDO::FETCH_ASSOC);
            
            if(empty($expenses_to_add)){
                 http_response_code(404);
                 echo json_encode(['error' => 'No se encontraron los gastos recurrentes seleccionados.']);
                 exit();
            }

            $pdo->beginTransaction();
            $stmt_insert = $pdo->prepare("INSERT INTO gastos (category, description, amount, `date`) VALUES (?, ?, ?, ?)");
            $count = 0;
            foreach ($expenses_to_add as $expense) {
                $stmt_insert->execute([$expense['category'], $expense['description'], $expense['amount'], $date]);
                $count++;
            }
            $pdo->commit();

            http_response_code(201);
            echo json_encode(['message' => "$count gastos han sido registrados exitosamente en el historial."]);
            break;

        // --- ACCIONES PARA CATEGORÍAS ---
        case 'get_categories':
            // **CAMBIO REALIZADO AQUÍ**
            $sql = "SELECT category_name FROM gastos_categoria ORDER BY category_name";
            $stmt = $pdo->query($sql);
            $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
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
                // **CAMBIO REALIZADO AQUÍ**
                $stmt = $pdo->prepare("INSERT INTO gastos_categoria (category_name) VALUES (?)");
                $stmt->execute([$category_name]);
                http_response_code(201);
                echo json_encode(['message' => "Categoría '{$category_name}' añadida exitosamente."]);
            } catch (PDOException $e) {
                if ($e->getCode() == 23000) {
                    http_response_code(409);
                    echo json_encode(['error' => "La categoría '{$category_name}' ya existe."]);
                } else {
                    http_response_code(500);
                    error_log("Error al añadir categoría: " . $e->getMessage());
                    echo json_encode(['error' => 'Error interno del servidor.']);
                }
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Acción no reconocida.']);
            break;
    }
} catch (PDOException $e) {
    if(isset($pdo) && $pdo->inTransaction()){ $pdo->rollBack(); }
    http_response_code(500);
    error_log("Error de BD en api_expenses.php: " . $e->getMessage());
    echo json_encode(['error' => 'Error de base de datos.', 'detalle' => $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Error interno en api_expenses.php: " . $e->getMessage());
    echo json_encode(['error' => 'Error interno del servidor.', 'detalle' => $e->getMessage()]);
}