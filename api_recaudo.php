<?php
// api_recaudo.php

// --- Supresión de Errores y Arranque de Sesión ---
ini_set('display_errors', 0); // No mostrar errores no críticos en la salida
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING); // Reportar todos los errores excepto Notices y Warnings
session_start(); // Asegurarse de que la sesión esté iniciada antes de cualquier otra cosa

// --- Encabezados CORS y JSON ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=UTF-8');

// Manejo de solicitudes OPTIONS (preflight requests de CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- Conexión y Autenticación ---
require 'db_connect.php';
require 'session_auth.php';

// --- Verificación de Permisos ---
// Se valida el nuevo permiso llamado 'recaudo'
if (!check_permission('recaudo')) {
    http_response_code(403); // Forbidden
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
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Formato JSON inválido.', 'detalle' => json_last_error_msg()]);
            exit;
        }
    }
}

$action = $_GET['action'] ?? ($data['action'] ?? null);

try {
    switch ($action) {
        // --- Obtener Facturas (Lógica principal del módulo) ---
        case 'get_facturas':
            $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_STRING);
            $start_date = filter_input(INPUT_GET, 'start_date', FILTER_SANITIZE_STRING);
            $end_date = filter_input(INPUT_GET, 'end_date', FILTER_SANITIZE_STRING);
            $status = filter_input(INPUT_GET, 'status', FILTER_SANITIZE_STRING);
            $modificado_por_id = filter_input(INPUT_GET, 'modificado_por_id', FILTER_VALIDATE_INT);

        $sql = "SELECT f.factura_id, LPAD(f.factura_id, 3, '0') as numero_factura, f.usuario_id, u.nombre as nombre_usuario, p.nombre_plan, f.concepto, f.monto, f.fecha_factura, f.estado, f.modificado_por, mu.nombre as nombre_modificador, f.fecha_modificacion 
            FROM facturas f 
            JOIN usuarios u ON f.usuario_id = u.usuario_id 
            LEFT JOIN planes p ON f.plan_id = p.plan_id
            LEFT JOIN usuarios mu ON f.modificado_por = mu.usuario_id";
            $conditions = [];
            $params = [];

            if ($id) {
                // Busca tanto por ID de factura, ID de usuario o nombre de usuario
                $conditions[] = "(f.factura_id = ? OR f.usuario_id = ? OR u.nombre LIKE ?)";
                $like_id = "%$id%";
                array_push($params, $id, $id, $like_id);
            }
            
            // INICIO: CORRECCIÓN DE FILTRO DE FECHAS
            // Determina la columna de fecha a usar para el rango
            $date_column = ($status === 'Pagada' || $status === 'Anulada') ? 'f.fecha_modificacion' : 'f.fecha_factura';
            
            if ($start_date) {
                // Filtro de fecha inicial (desde el inicio del día)
                $conditions[] = "{$date_column} >= ?";
                $params[] = $start_date;
            }
            if ($end_date) {
                // CORRECCIÓN CLAVE: Añadir 23:59:59 a la fecha final para incluir todo el día.
                $end_date_modified = $end_date . ' 23:59:59';
                $conditions[] = "{$date_column} <= ?";
                $params[] = $end_date_modified;
            }
            // FIN: CORRECCIÓN DE FILTRO DE FECHAS
            
            if ($status) {
                $conditions[] = "f.estado = ?";
                $params[] = $status;
            }
             if ($modificado_por_id) {
                $conditions[] = "f.modificado_por = ?";
                $params[] = $modificado_por_id;
            }

            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }

            $sql .= " ORDER BY f.factura_id DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $facturas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($facturas);
            break;

        // --- Actualizar Estado de una Factura ---
       case 'update_invoice_status':
        // --- INICIO DE LA CORRECCIÓN DE SEGURIDAD ---
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            http_response_code(401); // Unauthorized
            echo json_encode(['error' => 'Sesión no válida o expirada. Por favor, inicie sesión de nuevo.']);
            exit;
        }
        // --- FIN DE LA CORRECCIÓN DE SEGURIDAD ---

        $factura_id = $data['factura_id'] ?? null;
        $estado = $data['estado'] ?? null;
        $modificado_por = $_SESSION['user_id']; // Ahora es seguro usarlo
        
        if (!$factura_id || !$estado) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de factura y nuevo estado son requeridos.']);
            exit;
        }
        
        $stmt = $pdo->prepare("UPDATE facturas SET estado = ?, modificado_por = ?, fecha_modificacion = NOW() WHERE factura_id = ?");
        $stmt->execute([$estado, $modificado_por, $factura_id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Estado de la factura actualizado exitosamente.']);
        } else {
            echo json_encode(['message' => 'No se realizaron cambios o la factura no fue encontrada.']);
        }
        break;


        // --- INICIO: NUEVA LÓGICA PARA OBTENER DETALLES DE CLIENTE ---
        case 'get_client_details_for_receipt':
            if (!isset($_GET['usuario_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de usuario no proporcionado.']);
                exit;
            }
            $usuario_id = filter_input(INPUT_GET, 'usuario_id', FILTER_VALIDATE_INT);
            if (!$usuario_id) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de usuario inválido.']);
                exit;
            }

            try {
                $stmt = $pdo->prepare("SELECT correo, celular, direccion FROM usuarios WHERE usuario_id = ?");
                $stmt->execute([$usuario_id]);
                $user_details = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$user_details) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Detalles del cliente no encontrados.']);
                } else {
                    echo json_encode($user_details);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                error_log("Error de BD al obtener detalles para recibo: " . $e->getMessage());
                echo json_encode(['error' => 'Error de base de datos.']);
            }
            break;
        // --- FIN: NUEVA LÓGICA ---



        // --- Generar Facturas Masivas (Funcionalidad de apoyo) ---
        case 'generate_bulk_invoices':
            $fecha = $data['fecha'] ?? date('Y-m-d');
            $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM facturas WHERE MONTH(fecha_factura) = MONTH(?) AND YEAR(fecha_factura) = YEAR(?)");
            $stmt_check->execute([$fecha, $fecha]);
            if ($stmt_check->fetchColumn() > 0) {
                http_response_code(409); // Conflict
                echo json_encode(['error' => 'Ya se generaron facturas para este mes. No se puede duplicar la facturación masiva.']);
                exit;
            }

            $stmt_users = $pdo->prepare("SELECT DISTINCT usuario_id FROM usuario_planes WHERE estado_plan = 'Activo'");
            $stmt_users->execute();
            $usuarios_activos = $stmt_users->fetchAll(PDO::FETCH_COLUMN);

            $planes_info = $pdo->query("SELECT plan_id, precio FROM planes")->fetchAll(PDO::FETCH_KEY_PAIR);

            $pdo->beginTransaction();
            $insert_stmt = $pdo->prepare("INSERT INTO facturas (usuario_id, plan_id, monto, fecha_factura, estado) VALUES (?, ?, ?, ?, 'Pendiente')");
            $count = 0;
            foreach ($usuarios_activos as $usuario_id) {
                $stmt_planes = $pdo->prepare("SELECT plan_id FROM usuario_planes WHERE usuario_id = ? AND estado_plan = 'Activo'");
                $stmt_planes->execute([$usuario_id]);
                $planes_del_usuario = $stmt_planes->fetchAll(PDO::FETCH_ASSOC);

                foreach($planes_del_usuario as $asignacion){
                    $precio = $planes_info[$asignacion['plan_id']] ?? 0;
                    if ($precio > 0) {
                        $insert_stmt->execute([$usuario_id, $asignacion['plan_id'], $precio, $fecha]);
                        $count++;
                    }
                }
            }
            $pdo->commit();
            echo json_encode(['message' => "Se generaron $count facturas masivas exitosamente."]);
            break;

        // --- Obtener lista de usuarios que han modificado facturas ---
        case 'get_modificadores':
            $stmt = $pdo->query("SELECT DISTINCT u.usuario_id, u.nombre FROM usuarios u JOIN facturas f ON u.usuario_id = f.modificado_por WHERE f.modificado_por IS NOT NULL ORDER BY u.nombre ASC");
            $modificadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($modificadores);
            break;

        default:
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Acción no reconocida en el módulo de recaudo.']);
            break;
    }
} catch (PDOException $e) {
    if(isset($pdo) && $pdo->inTransaction()){ $pdo->rollBack(); }
    http_response_code(500);
    error_log("Error de BD en api_recaudo.php: " . $e->getMessage());
    echo json_encode(['error' => 'Error de base de datos.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno.')]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Error general en api_recaudo.php: " . $e->getMessage());
    echo json_encode(['error' => 'Error interno del servidor.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno.')]);
}
?>