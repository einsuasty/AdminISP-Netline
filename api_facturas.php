<?php
// ==================================================================
// --- INICIO: CORRECCIÓN DE SESIÓN ---
// Se añade este bloque para garantizar que la sesión esté siempre
// iniciada al principio del script.
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// --- FIN: CORRECCIÓN DE SESIÓN ---
// ==================================================================


// --- INICIO: CÓDIGO DE DIAGNÓSTICO (VERSIÓN 2 - CORREGIDA) ---
$input_for_debug = file_get_contents('php://input');
$data_for_debug = json_decode($input_for_debug, true);

if (isset($data_for_debug['action']) && $data_for_debug['action'] === 'update_invoice_status') {
    $log_file = 'debug_facturas.log';
    $current_time = date('Y-m-d H:in:s');
    $log_message = "[$current_time] --- INICIO DE PETICIÓN ---\n";
    $log_message .= "DATOS RECIBIDOS (JSON): " . $input_for_debug . "\n";
    
    // Agregamos una comprobación de la sesión antes de intentar imprimirla
    if (session_status() === PHP_SESSION_ACTIVE && !empty($_SESSION)) {
        $log_message .= "SESIÓN ACTUAL: " . print_r($_SESSION, true) . "\n";
    } else {
        $log_message .= "SESIÓN ACTUAL: No hay sesión activa o está vacía.\n";
    }
    
    $log_message .= "--- FIN DE PETICIÓN ---\n\n";
    file_put_contents($log_file, $log_message, FILE_APPEND);
}
// --- FIN: CÓDIGO DE DIAGNÓSTICO ---


// api_facturas.php

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

// --- Conexión y Autenticación ---
require 'db_connect.php';
require 'session_auth.php'; 

// =================================================================================
// --- INICIO: PUERTA DE ENLACE PÚBLICA PARA PORTAL DE PAGOS ---
// =================================================================================
if (!isset($_SESSION['user_id'])) {
    try {
        // ACCIÓN PÚBLICA GET: Obtener facturas pendientes de un usuario
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['usuario_id']) && is_numeric($_GET['usuario_id'])) {
            $public_user_id = (int)$_GET['usuario_id'];
            
            // Se ha modificado la consulta para usar COALESCE y garantizar
            // que el campo 'descripcion' siempre exista en la respuesta.
            $sql_public = "
                SELECT 
                    f.factura_id, 
                    COALESCE(p.nombre_plan, f.concepto, '') AS descripcion, 
                    f.monto, 
                    f.fecha_factura, 
                    f.estado
                FROM facturas f
                LEFT JOIN planes p ON f.plan_id = p.plan_id
                WHERE f.usuario_id = ? AND f.estado = 'Pendiente'
                ORDER BY f.fecha_factura ASC
            ";
            $stmt_public = $pdo->prepare($sql_public);
            $stmt_public->execute([$public_user_id]);
            $invoices_public = $stmt_public->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($invoices_public);
            exit;
        }

        // ACCIÓN PÚBLICA POST: Marcar facturas como pagadas
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input_public = file_get_contents('php://input');
            if (!empty($input_public)) {
                $data_public = json_decode($input_public, true);
                if (
                    isset($data_public['action']) && $data_public['action'] === 'update_invoice_status' &&
                    isset($data_public['factura_id']) && is_numeric($data_public['factura_id']) &&
                    isset($data_public['estado']) && $data_public['estado'] === 'Pagada'
                ) {
                    $factura_id_public = (int)$data_public['factura_id'];
                    $stmt_update_public = $pdo->prepare("UPDATE facturas SET estado = 'Pagada' WHERE factura_id = ?");
                    $stmt_update_public->execute([$factura_id_public]);
                    echo json_encode(['message' => 'Factura actualizada exitosamente.']);
                    exit;
                }
            }
        }
    } catch (PDOException $e) {
        http_response_code(500);
        error_log("Error de BD en acceso público de api_facturas.php: " . $e->getMessage());
        echo json_encode(['error' => 'Error al procesar la solicitud pública.']);
        exit;
    }
}
// --- FIN: PUERTA DE ENLACE PÚBLICA ---


// Verifica los permisos para el módulo de facturación
if (!check_permission('facturacion') && !check_permission('ingresos-gastos') && !check_permission('recaudo')) {
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
    switch ($method) {
        case 'GET':
            $search_query = trim($_GET['id'] ?? '');
            $usuario_id_filter = isset($_GET['usuario_id']) && is_numeric($_GET['usuario_id']) ? (int)$_GET['usuario_id'] : 0;
            $start_date = trim(isset($_GET['start_date']) ? $_GET['start_date'] : '');
            $end_date = trim(isset($_GET['end_date']) ? $_GET['end_date'] : '');
            $status_filter = trim(isset($_GET['status']) ? $_GET['status'] : '');
            $modificado_por_id = isset($_GET['modificado_por_id']) && is_numeric($_GET['modificado_por_id']) ? (int)$_GET['modificado_por_id'] : 0;
            // NUEVO: Captura del parámetro para seleccionar el campo de fecha de filtro (para Ingresos/Gastos)
            $date_field_param = filter_input(INPUT_GET, 'date_field', FILTER_SANITIZE_STRING);

        $sql = "
            SELECT 
                f.factura_id, 
                LPAD(f.factura_id, 3, '0') AS numero_factura, 
                f.usuario_id, 
                u.nombre AS nombre_usuario, 
                f.plan_id, 
                p.nombre_plan,
                f.monto, 
                f.concepto, 
                f.fecha_factura, 
                f.estado,
                u_mod.nombre AS nombre_modificador,
                f.fecha_modificacion
            FROM facturas f
            JOIN usuarios u ON f.usuario_id = u.usuario_id
            LEFT JOIN planes p ON f.plan_id = p.plan_id
            LEFT JOIN usuarios u_mod ON f.modificado_por = u_mod.usuario_id
        ";
            
            $conditions = [];
            $params = [];

            if (!empty($search_query)) {
                $conditions[] = "(u.nombre LIKE ? OR f.usuario_id LIKE ? OR f.factura_id LIKE ?)";
                $params[] = "%$search_query%";
                $params[] = "%$search_query%";
                $params[] = "%$search_query%";
            }

            if ($usuario_id_filter > 0) {
                $conditions[] = "f.usuario_id = ?";
                $params[] = $usuario_id_filter;
            }

            if (!empty($status_filter)) {
                $conditions[] = "f.estado = ?";
                $params[] = $status_filter;
            }

            // INICIO: LÓGICA DE FECHAS CORREGIDA
            // Usa f.fecha_modificacion si se pide explícitamente (para Ingresos/Gastos)
            $date_column = 'f.fecha_factura';
            if ($date_field_param === 'modification') {
                $date_column = 'f.fecha_modificacion';
            }

            if ($start_date) {
                $conditions[] = "{$date_column} >= ?";
                $params[] = $start_date;
            }
            if ($end_date) {
                // Ajuste para que el filtro final sea inclusivo (hasta 23:59:59) si se usa la columna de fecha con hora.
                $end_date_modified = $end_date;
                if ($date_column === 'f.fecha_modificacion') {
                    $end_date_modified = $end_date . ' 23:59:59';
                }
                $conditions[] = "{$date_column} <= ?";
                $params[] = $end_date_modified;
            }
            // FIN: LÓGICA DE FECHAS CORREGIDA

            if ($modificado_por_id > 0) {
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

        case 'POST':
            $action = $data['action'] ?? null;
            if (!$action) {
                http_response_code(400);
                echo json_encode(['error' => 'Acción no especificada en la petición POST.']);
                exit;
            }

            switch ($action) {
                
                // --- ACCIÓN MODIFICADA: OBTENER LISTA PRELIMINAR DE FACTURAS (Para revisión) ---
                case 'get_preliminary_invoices':
                    
                    // --- INICIO CÓDIGO CORREGIDO: TRADUCCIÓN DEL MES ---
                    $fecha_actual = time();
                    $anio = date('Y', $fecha_actual);
                    $numero_mes = (int)date('n', $fecha_actual); // Obtiene el número del mes (1-12)

                    // Tabla de traducción: array manual de meses en español (minúsculas)
                    $meses_espanol = [
                        1 => 'enero', 2 => 'febrero', 3 => 'marzo', 4 => 'abril',
                        5 => 'mayo', 6 => 'junio', 7 => 'julio', 8 => 'agosto',
                        9 => 'septiembre', 10 => 'octubre', 11 => 'noviembre', 12 => 'diciembre'
                    ];

                    // Obtener el nombre del mes en español
                    $nombre_mes_espanol = $meses_espanol[$numero_mes];

                    // Capitalizar la primera letra
                    $nombre_mes_capitalizado = ucfirst($nombre_mes_espanol);

                    // Crear la base del concepto: "Noviembre 2025"
                    $concepto_base = "$nombre_mes_capitalizado $anio";
                    // --- FIN CÓDIGO CORREGIDO: TRADUCCIÓN DEL MES ---

                    // Verifica si ya se facturó este mes (lógica de negocio)
                    $fecha = $data['fecha'] ?? date('Y-m-d'); // Usar la fecha del post o la actual
                    $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM facturas WHERE MONTH(fecha_factura) = MONTH(?) AND YEAR(fecha_factura) = YEAR(?)");
                    $stmt_check->execute([$fecha, $fecha]);
                    if ($stmt_check->fetchColumn() > 0) {
                        http_response_code(409); // Conflict
                        echo json_encode(['error' => 'Ya se generaron facturas para este mes. No se puede duplicar la facturación masiva.']);
                        exit;
                    }

                    $sql_preliminary = "
                        SELECT 
                            up.usuario_id, 
                            up.plan_id, 
                            u.nombre AS nombre_usuario, 
                            p.nombre_plan,
                            p.precio AS monto,
                            NULL AS concepto
                        FROM usuario_planes up
                        JOIN usuarios u ON up.usuario_id = u.usuario_id
                        JOIN planes p ON up.plan_id = p.plan_id
                        WHERE up.estado_plan = 'Activo'
                    ";
                    $stmt_preliminary = $pdo->query($sql_preliminary);
                    $preliminary_invoices = $stmt_preliminary->fetchAll(PDO::FETCH_ASSOC);
                    
                    // Inicializar el concepto con un valor por defecto que el usuario puede editar
                    foreach ($preliminary_invoices as &$invoice) {
                        $invoice['monto'] = (float)($invoice['monto'] ?? 0);
                        // Concatena el nombre del plan con el mes y año usando la variable $concepto_base
                        $invoice['concepto'] = $invoice['nombre_plan'] ? ("Servicio " . $invoice['nombre_plan'] . " - " . $concepto_base) : '';
                    }
                    unset($invoice); // Romper la referencia

                    echo json_encode($preliminary_invoices);
                    break;
                // --- FIN ACCIÓN MODIFICADA: OBTENER LISTA PRELIMINAR ---
                
                // --- ACCIÓN: EJECUTAR GENERACIÓN FINAL DE FACTURAS EDITADAS ---
                case 'execute_bulk_invoices':
                    $invoices_to_insert = $data['invoices'] ?? [];
                    $fecha_factura_bulk = trim($data['fecha'] ?? date('Y-m-d'));
                    
                    if (empty($invoices_to_insert)) {
                        http_response_code(400);
                        echo json_encode(['error' => 'No se recibieron facturas para generar.']);
                        exit;
                    }

                    // Vuelve a verificar si ya se facturó este mes por seguridad
                    $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM facturas WHERE MONTH(fecha_factura) = MONTH(?) AND YEAR(fecha_factura) = YEAR(?)");
                    $stmt_check->execute([$fecha_factura_bulk, $fecha_factura_bulk]);
                    if ($stmt_check->fetchColumn() > 0) {
                         http_response_code(409); // Conflict
                         echo json_encode(['error' => 'Ya se generaron facturas para este mes. No se puede duplicar la facturación masiva.']);
                         exit;
                    }
                    
                    try {
                        $pdo->beginTransaction();
                        $generated_count = 0;
                        
                        $stmt_insert = $pdo->prepare(
                            "INSERT INTO facturas (usuario_id, plan_id, monto, concepto, fecha_factura, estado) 
                             VALUES (?, ?, ?, ?, ?, 'Pendiente')"
                        );
                        
                        foreach ($invoices_to_insert as $invoice) {
                            $usuario_id = filter_var($invoice['usuario_id'] ?? null, FILTER_VALIDATE_INT);
                            $plan_id = filter_var($invoice['plan_id'] ?? null, FILTER_VALIDATE_INT);
                            $monto = filter_var($invoice['monto'] ?? null, FILTER_VALIDATE_FLOAT);
                            $concepto = trim($invoice['concepto'] ?? '');
                            
                            $final_concepto = $concepto;
                            $final_plan_id = $plan_id; // Mantener el plan_id original
                            
                            // Validar que exista plan o concepto para insertar
                            if (empty($final_concepto) && empty($final_plan_id)) {
                                 continue; // Ignorar si no tiene ni plan ni concepto
                            }

                            if ($usuario_id && $monto > 0) {
                                $stmt_insert->execute([
                                    $usuario_id, 
                                    $final_plan_id, 
                                    $monto, 
                                    $final_concepto, 
                                    $fecha_factura_bulk
                                ]);
                                $generated_count++;
                            }
                        }

                        $pdo->commit();
                        http_response_code(201);
                        echo json_encode(['message' => "Se generaron $generated_count facturas exitosamente."]);

                    } catch (PDOException $e) {
                        $pdo->rollBack();
                        http_response_code(500);
                        error_log("Error de BD al ejecutar facturas masivas: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al generar facturas masivas']);
                    }
                    break;
                // --- FIN ACCIÓN: EJECUTAR GENERACIÓN FINAL ---

                // --- NUEVA ACCIÓN: ACTUALIZAR SOLO MONTO DE FACTURA ---
                case 'update_invoice_monto':
                    $factura_id = filter_var($data['factura_id'] ?? null, FILTER_VALIDATE_INT);
                    $monto = filter_var($data['monto'] ?? null, FILTER_VALIDATE_FLOAT);
                    $modificado_por_usuario_id = $_SESSION['user_id'];

                    if (!$factura_id || $factura_id <= 0 || $monto === null || $monto <= 0) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID de factura y monto positivo requeridos para actualizar.']);
                        exit;
                    }
                    
                    try {
                        // Solo se actualiza el monto, y se registra la modificación.
                        $stmt = $pdo->prepare("
                            UPDATE facturas 
                            SET monto = ?, modificado_por = ?, fecha_modificacion = NOW() 
                            WHERE factura_id = ? AND estado = 'Pendiente'
                        ");
                        $stmt->execute([$monto, $modificado_por_usuario_id, $factura_id]);
                        
                        if ($stmt->rowCount() > 0) {
                            http_response_code(200);
                            echo json_encode(['message' => 'Monto de factura actualizado exitosamente.']);
                        } else {
                            http_response_code(400);
                            echo json_encode(['error' => 'No se pudo actualizar el monto. La factura no existe o su estado no es Pendiente.']);
                        }
                    } catch (PDOException $e) {
                        http_response_code(500);
                        error_log("Error de BD al actualizar monto de factura: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al actualizar monto de factura', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
                    }
                    break;
                // --- FIN NUEVA ACCIÓN: ACTUALIZAR SOLO MONTO DE FACTURA ---

                case 'get_modificadores':
                    try {
                        $stmt = $pdo->query("
                            SELECT DISTINCT u.usuario_id, u.nombre
                            FROM usuarios u
                            JOIN facturas f ON u.usuario_id = f.modificado_por
                            WHERE f.modificado_por IS NOT NULL
                            ORDER BY u.nombre ASC
                        ");
                        $modificadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        echo json_encode($modificadores);
                    } catch (PDOException $e) {
                        http_response_code(500);
                        error_log("Error al obtener modificadores: " . $e->getMessage());
                        echo json_encode(['error' => 'Error de base de datos al obtener la lista de modificadores.']);
                    }
                    break;
                case 'generate_single_invoice':
                    $usuario_id = filter_var($data['usuario_id'] ?? null, FILTER_VALIDATE_INT);
                    $plan_id = filter_var($data['plan_id'] ?? null, FILTER_VALIDATE_INT);
                    $monto = filter_var($data['monto'] ?? null, FILTER_VALIDATE_FLOAT);
                    $concepto = !empty($data['concepto']) ? trim($data['concepto']) : null;
                    $fecha = trim($data['fecha'] ?? date('Y-m-d'));

                    if (!$usuario_id || !$monto || $monto <= 0) {
                        http_response_code(400);
                        echo json_encode(['error' => 'El ID de usuario y un monto válido son requeridos.']);
                        exit;
                    }

                    if (empty($plan_id) && empty($concepto)) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Debe especificar un plan o un concepto para la factura.']);
                        exit;
                    }
                    
                    try {
                        if ($plan_id) {
                            $stmt = $pdo->prepare(
                                "INSERT INTO facturas (usuario_id, plan_id, monto, fecha_factura, estado) VALUES (?, ?, ?, ?, 'Pendiente')"
                            );
                            $stmt->execute([$usuario_id, $plan_id, $monto, $fecha]);
                        } else { 
                            $stmt = $pdo->prepare(
                                "INSERT INTO facturas (usuario_id, plan_id, monto, concepto, fecha_factura, estado) VALUES (?, NULL, ?, ?, ?, 'Pendiente')"
                            );
                            $stmt->execute([$usuario_id, $monto, $concepto, $fecha]);
                        }
                        http_response_code(201);
                        echo json_encode(['message' => 'Factura generada exitosamente.']);
                    } catch (PDOException $e) {
                        http_response_code(500);
                        error_log("Error de BD al generar factura: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al guardar la factura en la base de datos.']);
                    }
                    break;

                case 'generate_bulk_invoices':
                    // **NOTA: Esta acción es la versión antigua, se recomienda usar las nuevas acciones para la revisión.**
                    try {
                        $pdo->beginTransaction();
                        $generated_count = 0;
                        $fecha_factura_bulk = trim($data['fecha'] ?? date('Y-m-d'));

                        $stmt_users = $pdo->query("
                            SELECT up.usuario_id, up.plan_id, p.precio
                            FROM usuario_planes up
                            JOIN planes p ON up.plan_id = p.plan_id
                            WHERE up.estado_plan = 'Activo'
                        ");
                        $users_with_active_plans = $stmt_users->fetchAll(PDO::FETCH_ASSOC);

                        if (empty($users_with_active_plans)) {
                            $pdo->rollBack();
                            http_response_code(200);
                            echo json_encode(['message' => 'No hay usuarios con planes activos para generar facturas.']);
                            exit;
                        }

                        foreach ($users_with_active_plans as $user_plan) {
                            $usuario_id = (int)$user_plan['usuario_id'];
                            $plan_id = (int)$user_plan['plan_id'];
                            $monto = (float)$user_plan['precio'];
                            
                            $check_stmt = $pdo->prepare("SELECT COUNT(*) FROM facturas WHERE usuario_id = ? AND plan_id = ? AND fecha_factura = ?");
                            $check_stmt->execute([$usuario_id, $plan_id, $fecha_factura_bulk]);
                            if ($check_stmt->fetchColumn() > 0) {
                                continue;
                            }

                            $stmt_insert = $pdo->prepare("INSERT INTO facturas (usuario_id, plan_id, monto, fecha_factura, estado) VALUES (?, ?, ?, ?, 'Pendiente')");
                            $stmt_insert->execute([$usuario_id, $plan_id, $monto, $fecha_factura_bulk]);
                            $generated_count++;
                        }

                        $pdo->commit();
                        http_response_code(201);
                        echo json_encode(['message' => "Se generaron $generated_count facturas masivas exitosamente."]);

                    } catch (PDOException $e) {
                        $pdo->rollBack();
                        http_response_code(500);
                        error_log("Error de BD al generar facturas masivas en api_facturas.php: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al generar facturas masivas']);
                    }
                    break;

                case 'update_invoice_status':
                    $factura_id = filter_var($data['factura_id'] ?? null, FILTER_VALIDATE_INT);
                    $estado = trim($data['estado'] ?? '');
                    $modificado_por_usuario_id = $_SESSION['user_id'];

                    if (!$factura_id || $factura_id <= 0 || empty($estado)) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID de factura y estado requeridos para actualizar.']);
                        exit;
                    }
                    $valid_states = ['Pendiente', 'Pagada', 'Anulada'];
                    if (!in_array($estado, $valid_states)) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Estado de factura inválido. Valores permitidos: Pendiente, Pagada, Anulada.']);
                        exit;
                    }
                    try {
                        $stmt = $pdo->prepare("UPDATE facturas SET estado = ?, modificado_por = ?, fecha_modificacion = NOW() WHERE factura_id = ?");
                        $stmt->execute([$estado, $modificado_por_usuario_id, $factura_id]);
                        
                        http_response_code(200);
                        echo json_encode(['message' => 'Estado de factura actualizado exitosamente.']);
                    } catch (PDOException $e) {
                        http_response_code(500);
                        error_log("Error de BD al actualizar estado de factura en api_facturas.php: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al actualizar estado de factura', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
                    }
                    break;

                default:
                    http_response_code(400);
                    echo json_encode(['error' => 'Acción POST no reconocida.']);
                    break;
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método HTTP no permitido.']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log("Error en api_facturas.php: " . $e->getMessage());
    echo json_encode(['error' => 'Ocurrió u error inesperado en el servidor.']);
}
?>