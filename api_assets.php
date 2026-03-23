<?php
// api_assets.php

ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE);

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

if (!check_permission('inventario')) {
    http_response_code(403);
    echo json_encode(['error' => 'No tienes permisos para acceder a este módulo.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? ($data['action'] ?? '');
$search_query = $_GET['search'] ?? ''; 
$search_query_lower = strtolower($search_query);

try {
    switch ($action) {
        
        case 'get_tipos_activos':
            $stmt = $pdo->query("SELECT id, nombre, cantidad_total, cantidad_disponible FROM tipos_activos ORDER BY nombre ASC");
            $tipos_activos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($tipos_activos);
            break;

        case 'add_stock':
            $tipo_id = $data['tipo_id'] ?? null;
            $nuevo_nombre = trim($data['nuevo_nombre'] ?? '');
            $cantidad = filter_var($data['cantidad'] ?? 0, FILTER_VALIDATE_INT);

            if ($cantidad <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'La cantidad debe ser un número positivo.']);
                exit;
            }

            $pdo->beginTransaction();

            if (!empty($nuevo_nombre)) {
                $stmt = $pdo->prepare("INSERT INTO tipos_activos (nombre, cantidad_total, cantidad_disponible) VALUES (?, ?, ?)");
                $stmt->execute([$nuevo_nombre, $cantidad, $cantidad]);
            } elseif (!empty($tipo_id)) {
                $stmt = $pdo->prepare("UPDATE tipos_activos SET cantidad_total = cantidad_total + ?, cantidad_disponible = cantidad_disponible + ? WHERE id = ?");
                $stmt->execute([$cantidad, $cantidad, $tipo_id]);
            } else {
                $pdo->rollBack();
                http_response_code(400);
                echo json_encode(['error' => 'Debe seleccionar un activo existente o proporcionar un nombre para uno nuevo.']);
                exit;
            }
            
            $pdo->commit();
            echo json_encode(['message' => 'Inventario actualizado exitosamente.']);
            break;

        case 'delete_tipo_activo':
            // 1. Validar el ID recibido
            $tipo_id = filter_var($data['tipo_id'] ?? null, FILTER_VALIDATE_INT);
            if (!$tipo_id || $tipo_id <= 0) {
                http_response_code(400); // Bad Request
                echo json_encode(['error' => 'ID de tipo de activo inválido.']);
                exit();
            }

            try {
                // 2. Condición Clave: Verificar si hay activos de este tipo ya asignados
                $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM activos_asignados WHERE tipo_activo_id = ?");
                $stmt_check->execute([$tipo_id]);
                $assignment_count = $stmt_check->fetchColumn();

                if ($assignment_count > 0) {
                    // Si hay activos asignados, no se permite eliminar
                    http_response_code(409); // Conflict
                    echo json_encode(['error' => 'Este tipo de activo no se puede eliminar porque tiene ' . $assignment_count . ' unidad(es) asignada(s).']);
                    exit();
                }

                // 3. Si no hay asignaciones, proceder a eliminar
                $stmt_delete = $pdo->prepare("DELETE FROM tipos_activos WHERE id = ?");
                $stmt_delete->execute([$tipo_id]);

                if ($stmt_delete->rowCount() > 0) {
                    http_response_code(200); // OK
                    echo json_encode(['message' => 'Tipo de activo eliminado exitosamente.']);
                } else {
                    http_response_code(404); // Not Found
                    echo json_encode(['error' => 'El tipo de activo no fue encontrado o ya había sido eliminado.']);
                }

            } catch (PDOException $e) {
                http_response_code(500);
                error_log("Error al eliminar tipo de activo: " . $e->getMessage());
                echo json_encode(['error' => 'Error de base de datos al intentar eliminar el tipo de activo.']);
            }
            break;


        case 'remove_stock':
            $tipo_id = filter_var($data['tipo_id'] ?? null, FILTER_VALIDATE_INT);
            $cantidad = filter_var($data['cantidad'] ?? 0, FILTER_VALIDATE_INT);

            if (empty($tipo_id) || $cantidad <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Se requiere un tipo de activo y una cantidad positiva.']);
                exit;
            }

            $pdo->beginTransaction();

            $stmt_check = $pdo->prepare("SELECT cantidad_total, cantidad_disponible FROM tipos_activos WHERE id = ? FOR UPDATE");
            $stmt_check->execute([$tipo_id]);
            $stock = $stmt_check->fetch(PDO::FETCH_ASSOC);

            if (!$stock) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(['error' => 'Tipo de activo no encontrado.']);
                exit;
            }

            if ($stock['cantidad_disponible'] < $cantidad) {
                $pdo->rollBack();
                http_response_code(409);
                echo json_encode(['error' => 'No se pueden eliminar más unidades de las que hay disponibles. Unidades disponibles: ' . $stock['cantidad_disponible'] . '.']);
                exit;
            }

            $stmt = $pdo->prepare("UPDATE tipos_activos SET cantidad_total = cantidad_total - ?, cantidad_disponible = cantidad_disponible - ? WHERE id = ?");
            $stmt->execute([$cantidad, $cantidad, $tipo_id]);
            
            $pdo->commit();
            echo json_encode(['message' => 'Unidades eliminadas del inventario exitosamente.']);
            break;

        case 'get_clientes_para_asignacion':
            $stmt = $pdo->prepare("SELECT usuario_id, nombre FROM usuarios WHERE rol_id = 1 ORDER BY nombre ASC");
            $stmt->execute();
            $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($clientes);
            break;

        case 'assign_activo':
            $tipo_activo_id = filter_var($data['tipo_activo_id'] ?? null, FILTER_VALIDATE_INT);
            $cliente_id = !empty($data['cliente_id']) ? filter_var($data['cliente_id'], FILTER_VALIDATE_INT) : null;
            $ip = trim($data['ip'] ?? null);
            $serial = trim($data['serial'] ?? null);
            $notas = trim($data['notas'] ?? null);

            if (empty($tipo_activo_id)) {
                http_response_code(400);
                echo json_encode(['error' => 'El tipo de activo es requerido.']);
                exit;
            }
            
            $pdo->beginTransaction();

            $stmt_check = $pdo->prepare("SELECT cantidad_disponible FROM tipos_activos WHERE id = ?");
            $stmt_check->execute([$tipo_activo_id]);
            $stock = $stmt_check->fetchColumn();

            if ($stock < 1) {
                $pdo->rollBack();
                http_response_code(409);
                echo json_encode(['error' => 'No hay stock disponible para este tipo de activo.']);
                exit;
            }
            
            $stmt_assign = $pdo->prepare(
                "INSERT INTO activos_asignados (tipo_activo_id, cliente_id, fecha_asignacion, ip, serial, notas) VALUES (?, ?, CURDATE(), ?, ?, ?)"
            );
            $stmt_assign->execute([$tipo_activo_id, $cliente_id, $ip, $serial, $notas]);

            $stmt_update = $pdo->prepare("UPDATE tipos_activos SET cantidad_disponible = cantidad_disponible - 1 WHERE id = ?");
            $stmt_update->execute([$tipo_activo_id]);

            $pdo->commit();
            echo json_encode(['message' => 'Activo asignado exitosamente.']);
            break;
            
        case 'get_activos_asignados':
            // INICIO DE LA CORRECCIÓN FINAL
            $params = [];
            $where_clause = "";
            $search_term_wildcard = "%" . $search_query . "%";
            $search_term_lower_wildcard = "%" . $search_query_lower . "%";

            if (!empty($search_query)) {
                $where_clause = "
                    WHERE 
                        LOWER(ta.nombre) LIKE ? OR 
                        LOWER(u.nombre) LIKE ? OR 
                        LOWER(aa.ip) LIKE ? OR 
                        LOWER(aa.serial) LIKE ? OR 
                        LOWER(aa.notas) LIKE ? OR
                        -- CORRECCIÓN: Usar LIKE %...% para buscar coincidencias parciales con 'Empresa (Uso Interno)'
                        (aa.cliente_id IS NULL AND (
                            ? LIKE '%empresa%' OR
                            ? LIKE '%uso interno%' OR
                            'empresa (uso interno)' LIKE ? 
                        ))
                ";
                
                // Parámetros para la búsqueda con LIKE
                $params = [
                    $search_term_lower_wildcard,
                    $search_term_lower_wildcard,
                    $search_term_lower_wildcard,
                    $search_term_lower_wildcard,
                    $search_term_lower_wildcard,
                    // Parámetros para el chequeo de "Empresa (Uso Interno)"
                    $search_query_lower, 
                    $search_query_lower,
                    $search_term_lower_wildcard // Nueva comprobación: ¿el término ingresado está contenido en 'empresa (uso interno)'?
                ];
            }
            
            $sql = "
                SELECT
                    aa.id,
                    ta.nombre AS nombre_activo,
                    u.nombre AS nombre_cliente,
                    aa.fecha_asignacion,
                    aa.ip,
                    aa.serial,
                    aa.notas
                FROM
                    activos_asignados aa
                JOIN
                    tipos_activos ta ON aa.tipo_activo_id = ta.id
                LEFT JOIN 
                    usuarios u ON aa.cliente_id = u.usuario_id
                {$where_clause}
                ORDER BY
                    aa.fecha_asignacion DESC
            ";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $asignados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($asignados);
            break;
        // FIN DE LA CORRECCIÓN

        case 'delete_asignacion':
            $asignacion_id = filter_var($data['asignacion_id'] ?? null, FILTER_VALIDATE_INT);

            if (empty($asignacion_id)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de asignación inválido.']);
                exit;
            }

            $pdo->beginTransaction();

            $stmt_get_tipo = $pdo->prepare("SELECT tipo_activo_id FROM activos_asignados WHERE id = ?");
            $stmt_get_tipo->execute([$asignacion_id]);
            $tipo_activo_id = $stmt_get_tipo->fetchColumn();

            if (!$tipo_activo_id) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(['error' => 'La asignación no fue encontrada.']);
                exit;
            }
            
            $stmt_delete = $pdo->prepare("DELETE FROM activos_asignados WHERE id = ?");
            $stmt_delete->execute([$asignacion_id]);

            $stmt_update_stock = $pdo->prepare("UPDATE tipos_activos SET cantidad_disponible = cantidad_disponible + 1 WHERE id = ?");
            $stmt_update_stock->execute([$tipo_activo_id]);

            $pdo->commit();
            echo json_encode(['message' => 'Asignación eliminada y activo devuelto al inventario.']);
            break;

        case 'get_asignacion_details':
            $asignacion_id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);

            if (empty($asignacion_id)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de asignación inválido.']);
                exit;
            }

            $stmt = $pdo->prepare("SELECT * FROM activos_asignados WHERE id = ?");
            $stmt->execute([$asignacion_id]);
            $asignacion = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($asignacion) {
                echo json_encode($asignacion);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Asignación no encontrada.']);
            }
            break;

        case 'update_asignacion':
            $asignacion_id = filter_var($data['asignacion_id'] ?? null, FILTER_VALIDATE_INT);
            $new_tipo_id = filter_var($data['tipo_activo_id'] ?? null, FILTER_VALIDATE_INT);
            $cliente_id = !empty($data['cliente_id']) ? filter_var($data['cliente_id'], FILTER_VALIDATE_INT) : null;
            $ip = trim($data['ip'] ?? null);
            $serial = trim($data['serial'] ?? null);
            $notas = trim($data['notas'] ?? null);

            if (empty($asignacion_id) || empty($new_tipo_id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Faltan datos requeridos para la actualización.']);
                exit;
            }

            $pdo->beginTransaction();

            // 1. Obtener el tipo de activo original de la asignación
            $stmt_old_tipo = $pdo->prepare("SELECT tipo_activo_id FROM activos_asignados WHERE id = ?");
            $stmt_old_tipo->execute([$asignacion_id]);
            $old_tipo_id = $stmt_old_tipo->fetchColumn();

            if (!$old_tipo_id) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(['error' => 'La asignación a editar no fue encontrada.']);
                exit;
            }

            // 2. Si el tipo de activo cambió, se debe ajustar el stock
            if ($old_tipo_id != $new_tipo_id) {
                // Verificar si hay stock del nuevo tipo de activo
                $stmt_check_stock = $pdo->prepare("SELECT cantidad_disponible FROM tipos_activos WHERE id = ?");
                $stmt_check_stock->execute([$new_tipo_id]);
                $stock_disponible = $stmt_check_stock->fetchColumn();

                if ($stock_disponible < 1) {
                    $pdo->rollBack();
                    http_response_code(409);
                    echo json_encode(['error' => 'No hay stock disponible para el nuevo tipo de activo seleccionado.']);
                    exit;
                }

                // Devolver 1 unidad del activo viejo al stock
                $stmt_return = $pdo->prepare("UPDATE tipos_activos SET cantidad_disponible = cantidad_disponible + 1 WHERE id = ?");
                $stmt_return->execute([$old_tipo_id]);

                // Tomar 1 unidad del nuevo activo del stock
                $stmt_take = $pdo->prepare("UPDATE tipos_activos SET cantidad_disponible = cantidad_disponible - 1 WHERE id = ?");
                $stmt_take->execute([$new_tipo_id]);
            }

            // 3. Finalmente, actualizar la asignación con los nuevos datos
            $stmt_update = $pdo->prepare(
                "UPDATE activos_asignados SET tipo_activo_id = ?, cliente_id = ?, ip = ?, serial = ?, notas = ? WHERE id = ?"
            );
            $stmt_update->execute([$new_tipo_id, $cliente_id, $ip, $serial, $notas, $asignacion_id]);

            $pdo->commit();
            echo json_encode(['message' => 'Asignación actualizada exitosamente.']);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Acción no reconocida.']);
            break;
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>