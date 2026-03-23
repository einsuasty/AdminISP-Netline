<?php
// api_users.php (VERSIÓN CORREGIDA Y DEFINITIVA)

// --- Debug ---
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

$data = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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

// =================================================================================
// --- LÓGICA PARA CAMBIAR LA CONTRASEÑA DEL USUARIO DE LA SESIÓN ---
// Se procesa esta acción ANTES de la verificación de permisos, ya que es una acción de auto-gestión.
// =================================================================================
if (isset($data['action']) && $data['action'] === 'change_self_password') {
    if (!isset($_SESSION['user_id'])) { // Se verifica directamente la variable de sesión
        http_response_code(401);
        echo json_encode(['error' => 'No hay una sesión de usuario activa.']);
        exit;
    }
    $new_password = $data['new_password'] ?? '';
    if (empty($new_password) || strlen($new_password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'La nueva contraseña debe tener al menos 6 caracteres.']);
        exit;
    }
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    try {
        $stmt = $pdo->prepare("UPDATE usuarios SET password_hash = ? WHERE usuario_id = ?");
        $stmt->execute([$hashed_password, $_SESSION['user_id']]); // Se usa el ID de la sesión
        http_response_code(200);
        echo json_encode(['message' => 'Contraseña actualizada exitosamente.']);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log("Error de BD al cambiar la contraseña: " . $e->getMessage());
        echo json_encode(['error' => 'Error de base de datos.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno.')]);
    }
    exit;
}
// =================================================================================
// --- FIN: LÓGICA PARA CAMBIAR LA CONTRASEÑA ---
// =================================================================================

// =================================================================================
// --- LÓGICA PARA OBTENER DATOS DE USUARIO PÚBLICAMENTE (USADO POR PAGOPSE.PHP) ---
// Se procesa antes de la verificación de permisos para que no requiera sesión.
// =================================================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_user_for_invoice' && isset($_GET['user_id'])) {
    $user_id_to_fetch = (int)$_GET['user_id'];
    
    if ($user_id_to_fetch <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de usuario inválido.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT usuario_id, nombre, correo FROM usuarios WHERE usuario_id = ?");
        $stmt->execute([$user_id_to_fetch]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado']);
            exit;
        }
        
        // Obtener planes asignados al usuario para mostrar en la factura
        $stmt_plans = $pdo->prepare("
            SELECT up.id AS usuario_plan_id, up.usuario_id, up.plan_id,
                    p.nombre_plan, p.velocidad, p.precio,
                    up.fecha_asignacion, up.estado_plan
            FROM usuario_planes up
            JOIN planes p ON up.plan_id = p.plan_id
            WHERE up.usuario_id = ?
            ORDER BY up.fecha_asignacion DESC
        ");
        $stmt_plans->execute([$user_id_to_fetch]);
        $user['planes_asignados'] = $stmt_plans->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($user);
        exit;

    } catch (PDOException $e) {
        http_response_code(500);
        error_log("Error de BD al obtener datos de usuario para factura: " . $e->getMessage());
        echo json_encode(['error' => 'Error de base de datos al buscar usuario.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno.')]);
        exit;
    }
}
// =================================================================================
// --- FIN: LÓGICA PARA OBTENER DATOS PÚBLICOS ---
// =================================================================================

// =================================================================================
// --- INICIO: SOLUCIÓN - OBTENER LISTA DE CLIENTES PARA EL MÓDULO DE INVENTARIO ---
// Se procesa antes de la verificación general de 'usuarios' para permitir que los
// usuarios con permiso de 'inventario' puedan listar clientes para asignar activos.
// =================================================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_client_list') {
    // Primero, verificamos que haya una sesión activa.
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No hay una sesión de usuario activa.']);
        exit;
    }
    // Segundo, verificamos que el usuario tenga permiso para el módulo de inventario.
    if (!check_permission('inventario')) {
        http_response_code(403);
        echo json_encode(['error' => 'No tienes permisos para acceder a esta función desde el módulo de inventario.']);
        exit;
    }

    try {
        // Buscamos el rol_id para 'Cliente' para no depender de un ID hardcodeado.
        $stmt_role = $pdo->prepare("SELECT rol_id FROM roles WHERE nombre_rol = 'Cliente'");
        $stmt_role->execute();
        $client_role_id = $stmt_role->fetchColumn();

        if (!$client_role_id) {
            http_response_code(500);
            echo json_encode(['error' => 'El rol "Cliente" no está configurado en el sistema.']);
            exit;
        }

        // Preparamos la consulta para obtener solo los clientes.
        $stmt = $pdo->prepare("SELECT usuario_id, nombre FROM usuarios WHERE rol_id = ? ORDER BY nombre ASC");
        $stmt->execute([$client_role_id]);
        $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($clients);
        exit;

    } catch (PDOException $e) {
        http_response_code(500);
        error_log("Error de BD al obtener lista de clientes para inventario: " . $e->getMessage());
        echo json_encode(['error' => 'Error de base de datos al buscar la lista de clientes.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno.')]);
        exit;
    }
}
// =================================================================================
// --- FIN: SOLUCIÓN ---
// =================================================================================

// =================================================================================
// --- INICIO: ACCIÓN PARA LISTAR PLANES PARA LOS FORMULARIOS (SOLUCIÓN DEFINITIVA) ---
// =================================================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_all_plans') {
    // Se verifica que haya una sesión activa.
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No hay una sesión de usuario activa.']);
        exit;
    }

    try {
        // Se consultan los datos básicos de los planes.
        $stmt = $pdo->prepare("SELECT plan_id, nombre_plan, velocidad, precio FROM planes ORDER BY nombre_plan ASC");
        $stmt->execute();
        $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($plans);
        exit;

    } catch (PDOException $e) {
        http_response_code(500);
        error_log("Error de BD al obtener todos los planes: " . $e->getMessage());
        echo json_encode(['error' => 'Error de base de datos al buscar los planes.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno.')]);
        exit;
    }
}
// =================================================================================
// --- FIN: NUEVA ACCIÓN ---
// =================================================================================

// =================================================================================
// --- INICIO: ACCIÓN PARA BUSCAR USUARIOS PARA FACTURACIÓN (SOLUCIÓN CORREGIDA) ---
// =================================================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_user_for_billing') {
    // Permitir acceso si el usuario tiene permiso para facturación, usuarios O recaudo.
    // Esto resuelve el issue: usuarios con solo 'recaudo' pueden generar recibos con datos completos.
    if (!check_permission('facturacion') && !check_permission('usuarios') && !check_permission('recaudo')) {
        http_response_code(403);
        echo json_encode(['error' => 'No tienes permisos para buscar usuarios desde este módulo.']);
        exit;
    }

    $search_term = trim($_GET['search_term'] ?? '');
    if (empty($search_term)) {
        http_response_code(400);
        echo json_encode(['error' => 'Se requiere un término de búsqueda (ID o nombre).']);
        exit;
    }

    try {
        // La consulta ahora busca por ID o por coincidencia de nombre.
        $stmt = $pdo->prepare("
            SELECT u.usuario_id, u.nombre, u.correo, u.celular, u.direccion, u.rol_id, r.nombre_rol 
            FROM usuarios u 
            JOIN roles r ON u.rol_id = r.rol_id 
            WHERE u.usuario_id = ? OR u.nombre LIKE ?
            LIMIT 1 
        ");
        $stmt->execute([$search_term, "%" . $search_term . "%"]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado.']);
            exit;
        }

        // Reutilizamos la lógica para obtener los planes asignados, que es necesaria para facturar.
        $stmt_plans = $pdo->prepare("
            SELECT up.id AS usuario_plan_id, up.plan_id, p.nombre_plan, p.velocidad, p.precio, up.estado_plan
            FROM usuario_planes up
            JOIN planes p ON up.plan_id = p.plan_id
            WHERE up.usuario_id = ?
            ORDER BY up.fecha_asignacion DESC
        ");
        $stmt_plans->execute([$user['usuario_id']]);
        $user['planes_asignados'] = $stmt_plans->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($user);
        exit; // Salimos para no continuar con la validación de permiso 'usuarios' general.

    } catch (PDOException $e) {
        http_response_code(500);
        error_log("Error de BD al buscar usuario para facturación: " . $e->getMessage());
        echo json_encode(['error' => 'Error de base de datos al buscar el usuario.']);
        exit;
    }
}
// =================================================================================
// --- FIN: ACCIÓN PARA BUSCAR USUARIOS PARA FACTURACIÓN ---
// =================================================================================
// De aquí en adelante, el código solo se ejecuta si la petición NO fue pública (o tiene context=admin).
if (!check_permission('usuarios')) {
    http_response_code(403);
    echo json_encode(['error' => 'No tienes permisos para acceder a la gestión de usuarios.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Parsear la URL para identificar el recurso y posibles IDs
$request_uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$request_segments = explode('/', $request_uri);

$resource_type = 'users';
$user_id_from_url = 0;

$api_users_pos = array_search('api_users.php', $request_segments);

if ($api_users_pos !== false && isset($request_segments[$api_users_pos + 1]) && is_numeric($request_segments[$api_users_pos + 1])) {
    $resource_type = 'single_user';
    $user_id_from_url = (int)$request_segments[$api_users_pos + 1];
}

$user_id_from_get = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : 0;
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$role_filter = isset($_GET['role_filter']) ? trim($_GET['role_filter']) : '';


/**
 * Actualiza los permisos de módulo para un USUARIO específico.
 */
function updateUserPermissions($pdo, $usuario_id, $selected_modules) {
    $stmt_delete = $pdo->prepare("DELETE FROM usuario_modulos WHERE usuario_id = ?");
    $stmt_delete->execute([$usuario_id]);

    if (!empty($selected_modules)) {
        $insert_values = [];
        $insert_params = [];
        foreach ($selected_modules as $module_name) {
            $insert_values[] = '(?, ?)';
            $insert_params[] = $usuario_id;
            $insert_params[] = $module_name;
        }
        $sql_insert = "INSERT INTO usuario_modulos (usuario_id, nombre_modulo) VALUES " . implode(', ', $insert_values);
        $stmt_insert = $pdo->prepare($sql_insert);
        $stmt_insert->execute($insert_params);
    }
}

try {
    switch ($method) {
        case 'GET':
            // Acción para obtener todos los usuarios para un select/dropdown (ej. para asignar activos)
            if (isset($_GET['action']) && $_GET['action'] === 'get_all_users_for_selection') {
                $sql = "SELECT usuario_id, nombre, celular FROM usuarios ORDER BY nombre ASC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($users);
                exit;
            }

            // Lógica para obtener un solo usuario o todos con filtros
            $user_id_to_fetch = 0;
            if ($resource_type === 'single_user' && $user_id_from_url > 0) {
                $user_id_to_fetch = $user_id_from_url;
            } elseif ($user_id_from_get > 0) {
                $user_id_to_fetch = $user_id_from_get;
            }

            if ($user_id_to_fetch > 0) {
                // Obtener datos del usuario y su rol
                $stmt = $pdo->prepare("SELECT u.usuario_id, u.nombre, u.correo, u.celular, u.direccion, u.rol_id, r.nombre_rol FROM usuarios u JOIN roles r ON u.rol_id = r.rol_id WHERE u.usuario_id = ?");
                $stmt->execute([$user_id_to_fetch]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$user) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Usuario no encontrado']);
                    exit;
                }

                // Obtener planes asignados al usuario
                $stmt_plans = $pdo->prepare("
                    SELECT up.id AS usuario_plan_id, up.usuario_id, up.plan_id,
                            p.nombre_plan, p.velocidad, p.precio,
                            up.fecha_asignacion, up.estado_plan
                    FROM usuario_planes up
                    JOIN planes p ON up.plan_id = p.plan_id
                    WHERE up.usuario_id = ?
                    ORDER BY up.fecha_asignacion DESC
                ");
                $stmt_plans->execute([$user_id_to_fetch]);
                $user['planes_asignados'] = $stmt_plans->fetchAll(PDO::FETCH_ASSOC);

                // Determinar el plan principal
                if (!empty($user['planes_asignados'])) {
                    $primary_plan = null;
                    foreach ($user['planes_asignados'] as $plan) {
                        if ($plan['estado_plan'] === 'Activo') {
                            $primary_plan = $plan;
                            break;
                        }
                    }
                    if (!$primary_plan) {
                        $primary_plan = $user['planes_asignados'][0];
                    }
                    
                    $user['plan_id_principal'] = $primary_plan['plan_id'];
                    $user['nombre_plan_principal'] = $primary_plan['nombre_plan'];
                    $user['precio_plan'] = $primary_plan['precio'];
                } else {
                    $user['plan_id_principal'] = null;
                    $user['nombre_plan_principal'] = 'Sin plan';
                    $user['precio_plan'] = 0;
                }
                
                // Obtener permisos de la nueva tabla `usuario_modulos`
                $user['allowed_modules'] = [];
                if ($user['nombre_rol'] === 'Usuario de Gestión') {
                    $stmt_user_modules = $pdo->prepare("SELECT nombre_modulo FROM usuario_modulos WHERE usuario_id = ?");
                    $stmt_user_modules->execute([$user['usuario_id']]);
                    $user['allowed_modules'] = $stmt_user_modules->fetchAll(PDO::FETCH_COLUMN, 0);
                }

                echo json_encode($user);
                exit;
            }

            // Obtener todos los usuarios con filtros de búsqueda y rol
            $sql = "
                SELECT
                    u.usuario_id, u.nombre, u.correo, u.celular, u.direccion,
                    r.nombre_rol,
                    COALESCE(lp.nombre_plan, 'Sin plan') AS nombre_plan_principal
                FROM usuarios u
                JOIN roles r ON u.rol_id = r.rol_id 
                LEFT JOIN
                    (SELECT
                        up.usuario_id, p.nombre_plan,
                        ROW_NUMBER() OVER (PARTITION BY up.usuario_id ORDER BY up.fecha_asignacion DESC) as rn
                    FROM usuario_planes up
                    JOIN planes p ON up.plan_id = p.plan_id
                    WHERE up.estado_plan = 'Activo'
                    ) AS lp ON u.usuario_id = lp.usuario_id AND lp.rn = 1
            ";
            $conditions = [];
            $params = [];

            if ($search) {
                $search_param = "%" . $search . "%";
                $conditions[] = "(CAST(u.usuario_id AS CHAR) LIKE ? OR u.nombre LIKE ? OR u.correo LIKE ? OR u.celular LIKE ? OR u.direccion LIKE ? OR r.nombre_rol LIKE ?)";
                $params = [$search_param, $search_param, $search_param, $search_param, $search_param, $search_param];
            }

            if (!empty($role_filter)) {
                $conditions[] = "r.nombre_rol = ?";
                $params[] = $role_filter;
            }

            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY u.usuario_id ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'POST':
            $action = $data['action'] ?? null;
            if (!$action) {
                http_response_code(400);
                echo json_encode(['error' => 'Acción no especificada en la petición POST.']);
                exit;
            }

            switch ($action) {
                case 'create_user':
                    $nombre = trim($data['nombre'] ?? '');
                    $correo = filter_var(trim($data['correo'] ?? ''), FILTER_VALIDATE_EMAIL);
                    $celular = trim($data['celular'] ?? null);
                    $direccion = trim($data['direccion'] ?? null);
                    $rol_id = filter_var($data['rol_id'] ?? null, FILTER_VALIDATE_INT);
                    $new_password = $data['new_password'] ?? ''; 
                    $allowed_modules = $data['allowed_modules'] ?? [];
                    $plan_id = filter_var($data['plan_id'] ?? null, FILTER_VALIDATE_INT);

                    $stmt_rol_name = $pdo->prepare("SELECT nombre_rol FROM roles WHERE rol_id = ?");
                    $stmt_rol_name->execute([$rol_id]);
                    $current_rol_name = $stmt_rol_name->fetchColumn();

                    if (empty($nombre) || $correo === false || empty($rol_id) || $rol_id <= 0 || $current_rol_name === false) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Nombre, correo válido y rol son requeridos.']);
                        exit;
                    }
                    if ($current_rol_name !== 'Cliente') {
                        if (empty($new_password) || strlen($new_password) < 6) {
                            http_response_code(400);
                            echo json_encode(['error' => 'Contraseña de al menos 6 caracteres es requerida para este rol.']);
                            exit;
                        }
                    } else {
                        $new_password = null;
                        if (empty($plan_id)) {
                             http_response_code(400);
                             echo json_encode(['error' => 'ID de plan requerido para un nuevo cliente.']);
                             exit;
                        }
                    }

                    try {
                        $pdo->beginTransaction();
                        $usuario_id_to_insert = isset($data['usuario_id']) && $data['usuario_id'] !== '' ? (int)$data['usuario_id'] : null;
                        $hashed_password = ($new_password !== null) ? password_hash($new_password, PASSWORD_DEFAULT) : null;

                        if ($usuario_id_to_insert) {
                             $stmt_check_id = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE usuario_id = ?");
                            $stmt_check_id->execute([$usuario_id_to_insert]);
                            if ($stmt_check_id->fetchColumn() > 0) {
                                http_response_code(409);
                                echo json_encode(['error' => 'El ID de usuario especificado ya existe.']);
                                $pdo->rollBack();
                                exit;
                            }
                            $stmt = $pdo->prepare("INSERT INTO usuarios (usuario_id, nombre, correo, celular, direccion, rol_id, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)");
                            $stmt->execute([$usuario_id_to_insert, $nombre, $correo, $celular, $direccion, $rol_id, $hashed_password]);
                        } else {
                            $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, correo, celular, direccion, rol_id, password_hash) VALUES (?, ?, ?, ?, ?, ?)");
                            $stmt->execute([$nombre, $correo, $celular, $direccion, $rol_id, $hashed_password]);
                            $usuario_id_to_insert = $pdo->lastInsertId();
                        }

                        if ($plan_id) {
                            $stmt_assign = $pdo->prepare("INSERT INTO usuario_planes (usuario_id, plan_id, fecha_asignacion, estado_plan) VALUES (?, ?, NOW(), 'Activo')");
                            $stmt_assign->execute([$usuario_id_to_insert, $plan_id]);
                        }


                        if ($current_rol_name === 'Usuario de Gestión') {
                            updateUserPermissions($pdo, $usuario_id_to_insert, $allowed_modules);
                        }

                        $pdo->commit();
                        http_response_code(201);
                        echo json_encode(['message' => 'Usuario y plan creados exitosamente.']);
                    } catch (PDOException $e) {
                        $pdo->rollBack();
                        if ($e->getCode() == 23000) {
                            http_response_code(409);
                            echo json_encode(['error' => 'El correo o ID ya está registrado.']);
                        } else {
                            http_response_code(500);
                            error_log("Error de BD al crear usuario: " . $e->getMessage());
                            echo json_encode(['error' => 'Error al crear usuario']);
                        }
                    }
                    break;

                case 'update_user':
                    $original_id = filter_var($data['original_id'] ?? null, FILTER_VALIDATE_INT);
                    $usuario_id = filter_var($data['usuario_id'] ?? null, FILTER_VALIDATE_INT);
                    $nombre = trim($data['nombre'] ?? '');
                    $correo = filter_var(trim($data['correo'] ?? ''), FILTER_VALIDATE_EMAIL);
                    $celular = trim($data['celular'] ?? null);
                    $direccion = trim($data['direccion'] ?? null);
                    $rol_id = filter_var($data['rol_id'] ?? null, FILTER_VALIDATE_INT);
                    $new_password = $data['new_password'] ?? '';
                    $allowed_modules = $data['allowed_modules'] ?? [];

                    $stmt_rol_name_check = $pdo->prepare("SELECT nombre_rol FROM roles WHERE rol_id = ?");
                    $stmt_rol_name_check->execute([$rol_id]);
                    $current_rol_name_for_update = $stmt_rol_name_check->fetchColumn();

                    if (empty($original_id) || empty($usuario_id) || empty($nombre) || $correo === false || empty($rol_id)) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Datos incompletos o inválidos.']);
                        exit;
                    }
                    
                    if (!empty($new_password) && strlen($new_password) < 6) {
                        http_response_code(400);
                        echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres.']);
                        exit;
                    }

                    try {
                        $pdo->beginTransaction();

                        $update_sql = "UPDATE usuarios SET nombre = ?, correo = ?, celular = ?, direccion = ?, rol_id = ?";
                        $update_params = [$nombre, $correo, $celular, $direccion, $rol_id];

                        if (!empty($new_password)) {
                            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
                            $update_sql .= ", password_hash = ?";
                            $update_params[] = $hashed_password;
                        } else if ($current_rol_name_for_update === 'Cliente') {
                            $update_sql .= ", password_hash = NULL";
                        }
                        
                        if ($original_id != $usuario_id) {
                            $stmt_check_id = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE usuario_id = ? AND usuario_id != ?");
                            $stmt_check_id->execute([$usuario_id, $original_id]);
                            if ($stmt_check_id->fetchColumn() > 0) {
                                http_response_code(409);
                                echo json_encode(['error' => 'El nuevo ID de usuario ya existe.']);
                                $pdo->rollBack();
                                exit;
                            }
                            $update_sql .= ", usuario_id = ?";
                            $update_params[] = $usuario_id;
                        }
                        
                        $update_sql .= " WHERE usuario_id = ?";
                        $update_params[] = $original_id;

                        $stmt = $pdo->prepare($update_sql);
                        $stmt->execute($update_params);
                        
                        $user_id_for_permissions = ($original_id != $usuario_id) ? $usuario_id : $original_id;
                        
                        if ($current_rol_name_for_update === 'Usuario de Gestión') {
                            updateUserPermissions($pdo, $user_id_for_permissions, $allowed_modules);
                        } else {
                            $stmt_delete_permissions = $pdo->prepare("DELETE FROM usuario_modulos WHERE usuario_id = ?");
                            $stmt_delete_permissions->execute([$user_id_for_permissions]);
                        }
                        
                        $pdo->commit();
                        echo json_encode(['message' => 'Usuario actualizado exitosamente.']);
                    } catch (PDOException $e) {
                        $pdo->rollBack();
                        if ($e->getCode() == 23000) {
                            http_response_code(409);
                            echo json_encode(['error' => 'El correo o el nuevo ID ya están registrados.']);
                        } else {
                            http_response_code(500);
                            error_log("Error de BD al actualizar usuario: " . $e->getMessage());
                            echo json_encode(['error' => 'Error al actualizar usuario.']);
                        }
                    }
                    break;


                case 'delete_user':
                    if (empty($data['usuario_id'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID de usuario requerido para eliminar.']);
                        exit;
                    }
                    $user_id_to_delete = (int)$data['usuario_id'];

                    try {
                        // 1. Obtener el rol del usuario para aplicar las reglas correctas.
                        $stmt_role = $pdo->prepare("SELECT r.nombre_rol FROM usuarios u JOIN roles r ON u.rol_id = r.rol_id WHERE u.usuario_id = ?");
                        $stmt_role->execute([$user_id_to_delete]);
                        $user_role = $stmt_role->fetchColumn();

                        if (!$user_role) {
                            http_response_code(404);
                            echo json_encode(['error' => 'El usuario que intentas eliminar no existe.']);
                            exit;
                        }

                        // 2. Si es un Cliente, verificar si tiene facturas pendientes.
                        if ($user_role === 'Cliente') {
                            $stmt_invoices = $pdo->prepare("SELECT COUNT(*) FROM facturas WHERE usuario_id = ? AND estado = 'Pendiente'");
                            $stmt_invoices->execute([$user_id_to_delete]);
                            $pending_invoices = $stmt_invoices->fetchColumn();

                            if ($pending_invoices > 0) {
                                http_response_code(409); 
                                echo json_encode(['error' => 'Este cliente no puede ser eliminado porque tiene ' . $pending_invoices . ' factura(s) con estado "Pendiente".']);
                                exit;
                            }
                        }
                        
                        // 3. Si las validaciones pasan, proceder con la eliminación.
                        $pdo->beginTransaction();

                        // --- INICIO: Nueva Lógica para Devolver Activos al Inventario ---
                        
                        // 3.1. Buscar todos los tipos de activos que el usuario tiene asignados.
                        $stmt_find_assets = $pdo->prepare("SELECT tipo_activo_id FROM activos_asignados WHERE cliente_id = ?");
                        $stmt_find_assets->execute([$user_id_to_delete]);
                        $assigned_assets = $stmt_find_assets->fetchAll(PDO::FETCH_COLUMN);

                        // 3.2. Si se encontraron activos, devolverlos al stock.
                        if (!empty($assigned_assets)) {
                            $stmt_update_stock = $pdo->prepare(
                                "UPDATE tipos_activos SET cantidad_disponible = cantidad_disponible + 1 WHERE id = ?"
                            );
                            // Se ejecuta por cada activo que tenga el usuario.
                            foreach ($assigned_assets as $tipo_id) {
                                $stmt_update_stock->execute([$tipo_id]);
                            }

                            // 3.3. Eliminar los registros de asignación.
                            $stmt_delete_assignments = $pdo->prepare("DELETE FROM activos_asignados WHERE cliente_id = ?");
                            $stmt_delete_assignments->execute([$user_id_to_delete]);
                        }
                        
                        // --- FIN: Nueva Lógica para Devolver Activos al Inventario ---


                        // 4. Continuar con la eliminación del resto de datos del usuario.
                        $stmt_facturas = $pdo->prepare("DELETE FROM facturas WHERE usuario_id = ?");
                        $stmt_facturas->execute([$user_id_to_delete]);

                        $stmt_planes = $pdo->prepare("DELETE FROM usuario_planes WHERE usuario_id = ?");
                        $stmt_planes->execute([$user_id_to_delete]);

                        $stmt_modulos = $pdo->prepare("DELETE FROM usuario_modulos WHERE usuario_id = ?");
                        $stmt_modulos->execute([$user_id_to_delete]);

                        // Finalmente, eliminar el usuario
                        $stmt_usuario = $pdo->prepare("DELETE FROM usuarios WHERE usuario_id = ?");
                        $stmt_usuario->execute([$user_id_to_delete]);
                        
                        $pdo->commit();
                        
                        http_response_code(200);
                        echo json_encode(['message' => 'Usuario y sus datos relacionados eliminados exitosamente.']);

                    } catch (PDOException $e) {
                        if ($pdo->inTransaction()) {
                            $pdo->rollBack();
                        }
                        http_response_code(500);
                        error_log("Error de BD al eliminar usuario: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al eliminar usuario y sus datos.', 'detalle_tecnico' => $e->getMessage()]);
                    }
                    break;

                    
                case 'assign_plan':
                    if (empty($data['usuario_id']) || empty($data['plan_id'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID de usuario y ID de plan requeridos para asignar.']);
                        exit;
                    }
                    try {
                        $check_stmt = $pdo->prepare("SELECT COUNT(*) FROM usuario_planes WHERE usuario_id = ? AND plan_id = ?");
                        $check_stmt->execute([(int)$data['usuario_id'], (int)$data['plan_id']]);
                        if ($check_stmt->fetchColumn() > 0) {
                            http_response_code(409);
                            echo json_encode(['error' => 'Este plan ya está asignado a este usuario.']);
                            exit;
                        }
                        $stmt = $pdo->prepare("INSERT INTO usuario_planes (usuario_id, plan_id, fecha_asignacion, estado_plan) VALUES (?, ?, NOW(), 'Activo')");
                        $stmt->execute([(int)$data['usuario_id'], (int)$data['plan_id']]);
                        http_response_code(201);
                        echo json_encode(['message' => 'Plan asignado exitosamente.']);
                    } catch (PDOException $e) {
                        http_response_code(500);
                        error_log("Error de BD al asignar plan: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al asignar plan.']);
                    }
                    break;
                case 'update_assigned_plan_status':
                    if (empty($data['usuario_plan_id']) || empty($data['estado_plan'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID de asignación y estado requeridos.']);
                        exit;
                    }
                    try {
                        $stmt = $pdo->prepare("UPDATE usuario_planes SET estado_plan = ? WHERE id = ?");
                        $stmt->execute([trim($data['estado_plan']), (int)$data['usuario_plan_id']]);
                        http_response_code(200);
                        echo json_encode(['message' => 'Estado de plan actualizado.']);
                    } catch (PDOException $e) {
                        http_response_code(500);
                        error_log("Error de BD al actualizar estado de plan: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al actualizar estado del plan.']);
                    }
                    break;
                case 'remove_assigned_plan':
                    if (empty($data['usuario_plan_id'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID de plan asignado requerido.']);
                        exit;
                    }
                    try {
                        $stmt = $pdo->prepare("DELETE FROM usuario_planes WHERE id = ?");
                        $stmt->execute([(int)$data['usuario_plan_id']]);
                        http_response_code(200);
                        echo json_encode(['message' => 'Plan asignado eliminado.']);
                    } catch (PDOException $e) {
                        http_response_code(500);
                        error_log("Error de BD al eliminar plan asignado: " . $e->getMessage());
                        echo json_encode(['error' => 'Error al eliminar plan asignado.']);
                    }
                    break;
                default:
                    http_response_code(400);
                    echo json_encode(['error' => 'Acción POST no reconocida.']);
                    break;
            }
            break;

        case 'PUT':
        case 'DELETE':
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido. Use POST.']);
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Acción GET no reconocida.']);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Error de BD en api_users.php: " . $e->getMessage());
    echo json_encode(['error' => 'Error de base de datos.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno.')]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Error interno en api_users.php: " . $e->getMessage());
    echo json_encode(['error' => 'Error interno del servidor.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno.')]);
}
?>