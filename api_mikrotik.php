<?php
// api_mikrotik.php

// --- Configuración de Depuración (¡IMPORTANTE: Desactivar en producción!) ---
// En producción, estas líneas deberían estar a 0 para no mostrar errores
ini_set('display_errors', 0); // Establecido en 0 para evitar salida inesperada en producción
ini_set('html_errors', 0);    // Asegura que los errores sean texto plano si display_errors se activa (para depuración)
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

// --- Autenticación y Autorización (¡IMPORTANTE!) ---
// Asegúrate de que session_auth.php NO emita nada (espacios, saltos de línea, etc.) antes de su código PHP
require 'session_auth.php'; 

// Verifica permisos para el módulo de Gestión Queues
if (!check_permission('gestion-queues')) {
    http_response_code(403); // Forbidden
    echo json_encode(['error' => 'No tienes permisos para acceder a la gestión de Queues.']);
    exit;
}

// Incluir la librería RouterOS API via Composer
// Asegúrate de que este path es correcto desde la ubicación de api_mikrotik.php
require __DIR__ . '/vendor/autoload.php'; 
use RouterOSAPI as MikrotikAPI; // Alias para usar MikrotikAPI en lugar de RouterOSAPI

// Obtener datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? ($data['action'] ?? '');

// Parámetros de conexión a MikroTik
$mikrotik_ip = trim($data['mikrotik_ip'] ?? null);
$mikrotik_user = trim($data['mikrotik_user'] ?? null);
$mikrotik_pass = $data['mikrotik_pass'] ?? null;

/**
 * Intenta establecer una conexión con el dispositivo MikroTik.
 * @param string $ip La dirección IP del MikroTik.
 * @param string $user El nombre de usuario para la conexión.
 * @param string $pass La contraseña para la conexión.
 * @return MikrotikAPI El objeto de la API de MikroTik conectado.
 * @throws Exception Si la conexión falla.
 */
function connectToMikroTik($ip, $user, $pass) {
    try {
        $API = new MikrotikAPI();
        $API->debug = false; 

        // Puedes especificar el puerto si no es el predeterminado (8728) o si usas SSL (8729)
        // $API->port = 8728; 
        // Puedes ajustar el tiempo de espera de la conexión
        // $API->timeout = 5; // 5 segundos de timeout

        if (!$API->connect($ip, $user, $pass)) {
            // Se mejora el mensaje para incluir el error específico de la API si existe
            throw new Exception("No se pudo conectar a MikroTik. Verifique la IP, usuario y contraseña. Posiblemente el servicio API no está habilitado o los datos son incorrectos." . (isset($API->error) ? " Detalles: " . $API->error : ""));
        }
        return $API;
    } catch (Exception $e) {
        // Relanza la excepción para que el bloque try-catch principal la capture
        throw $e;
    }
}

// Conexión a tu base de datos local para obtener usuarios para el select
// Asegúrate de que db_connect.php NO emita nada (espacios, saltos de línea, etc.) antes de su código PHP
require 'db_connect.php'; 

try {
    // La acción 'get_users_for_queues' no necesita conexión a MikroTik,
    // así que se maneja antes de intentar la conexión a MikroTik.
    if ($action === 'get_users_for_queues') {
        $sql = "SELECT usuario_id, nombre, celular FROM usuarios ORDER BY nombre ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        http_response_code(200); // OK
        echo json_encode($users);
        exit; // Sale del script después de enviar la respuesta
    }
    // Para todas las demás acciones, se requiere conexión a MikroTik
    else {
        // Validar que se proporcionaron las credenciales de MikroTik
        if (empty($mikrotik_ip) || empty($mikrotik_user) || !isset($mikrotik_pass)) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'IP, usuario y contraseña de MikroTik son requeridos.']);
            exit; // Sale del script
        }
        // Intenta la conexión a MikroTik
        $API = connectToMikroTik($mikrotik_ip, $mikrotik_user, $mikrotik_pass);
    }
    
    // Si la conexión a MikroTik fue exitosa (o no necesaria para get_users_for_queues),
    // procede con las acciones de la API
    switch ($action) {
        case 'get_queues':
            $queues = $API->comm("/queue/simple/print");
            $formatted_queues = [];
            foreach ($queues as $queue) {
                // Asegúrate de que cada elemento tiene un ID para evitar errores al acceder a $queue['.id']
                if (isset($queue['.id'])) { 
                    $formatted_queues[] = [
                        '.id' => $queue['.id'],
                        'name' => $queue['name'] ?? 'N/A', // Usar null coalescing operator para valores no existentes
                        'target' => $queue['target'] ?? 'N/A',
                        'max-limit' => $queue['max-limit'] ?? 'N/A',
                        'priority' => $queue['priority'] ?? 'N/A',
                        'comment' => $queue['comment'] ?? '', // Vacío si no existe
                        'disabled' => ($queue['disabled'] ?? 'false') == 'true' // Convertir a booleano
                    ];
                }
            }
            http_response_code(200); // OK
            echo json_encode($formatted_queues);
            break;

        case 'add_queue':
            $name = trim($data['name'] ?? '');
            $target = trim($data['target'] ?? '');
            $max_limit = trim($data['max_limit'] ?? '');
            $priority = trim($data['priority'] ?? '8');
            $comment = trim($data['comment'] ?? '');
            $disabled_status = filter_var($data['disabled'] ?? 'false', FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

            if (empty($name) || empty($target) || empty($max_limit)) {
                http_response_code(400);
                echo json_encode(['error' => 'Nombre, Target y Max-Limit son requeridos para agregar una queue.']);
                exit;
            }

            // Normalizar el formato de max-limit si es solo un número (ej. "10" -> "10M/10M")
            // Asume megabits si es un número y no tiene sufijo (M, K, G)
            if (is_numeric($max_limit) && !preg_match('/[MKG]$/i', $max_limit)) {
                 $max_limit = "{$max_limit}M/{$max_limit}M";
            } elseif (!preg_match('/^\d+(M|K|G)?\/\d+(M|K|G)?$/i', $max_limit)) {
                // Si no es un número simple ni un formato X/Y (ej. 10M/10M)
                http_response_code(400);
                echo json_encode(['error' => 'Formato de Max-Limit inválido. Use un número (ej. 10), o un formato como 10M o 10M/10M.']);
                exit;
            }

            $add_params = [
                "name" => $name,
                "target" => $target,
                "max-limit" => $max_limit,
                "priority" => $priority,
                "comment" => $comment
            ];
            // Solo añade 'disabled' si está presente y es true
            if ($disabled_status) {
                $add_params['disabled'] = 'yes';
            }

            $API->comm("/queue/simple/add", $add_params);
            http_response_code(201); // Created
            echo json_encode(['message' => 'Queue añadida exitosamente.']);
            break;

        case 'update_queue':
            $id = trim($data['.id'] ?? '');
            $name = trim($data['name'] ?? '');
            $target = trim($data['target'] ?? '');
            $max_limit = trim($data['max_limit'] ?? '');
            $priority = trim($data['priority'] ?? '8');
            $comment = trim($data['comment'] ?? '');
            $disabled_status = filter_var($data['disabled'] ?? 'false', FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

            if (empty($id) || empty($name) || empty($target) || empty($max_limit)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID, Nombre, Target y Max-Limit son requeridos para actualizar la queue.']);
                exit;
            }

            // Normalizar el formato de max-limit si es solo un número (ej. "10" -> "10M/10M")
            if (is_numeric($max_limit) && !preg_match('/[MKG]$/i', $max_limit)) {
                 $max_limit = "{$max_limit}M/{$max_limit}M";
            } elseif (!preg_match('/^\d+(M|K|G)?\/\d+(M|K|G)?$/i', $max_limit)) {
                // Si no es un número simple ni un formato X/Y (ej. 10M/10M)
                http_response_code(400);
                echo json_encode(['error' => 'Formato de Max-Limit inválido. Use un número (ej. 10), o un formato como 10M o 10M/10M.']);
                exit;
            }

            $update_params = [
                ".id" => $id,
                "name" => $name,
                "target" => $target,
                "max-limit" => $max_limit,
                "priority" => $priority,
                "comment" => $comment,
                "disabled" => $disabled_status ? 'yes' : 'no'
            ];

            $API->comm("/queue/simple/set", $update_params);
            http_response_code(200); // OK
            echo json_encode(['message' => 'Queue actualizada exitosamente.']);
            break;

        case 'delete_queue':
            $id = trim($data['.id'] ?? '');
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de queue requerido para eliminar.']);
                exit;
            }
            $API->comm("/queue/simple/remove", [".id" => $id]);
            http_response_code(200); // OK
            echo json_encode(['message' => 'Queue eliminada exitosamente.']);
            break;
        
        case 'disconnect':
            // Esta acción en PHP es más simbólica, la conexión MikroTik se cierra automáticamente
            // al final de la ejecución del script. Solo se usa para informar al frontend.
            http_response_code(200); // OK
            echo json_encode(['message' => 'Sesión MikroTik cerrada.']);
            break;

        default:
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Acción no reconocida o no soportada.']);
            break;
    }

    // Asegúrate de desconectar la API de MikroTik al final de la ejecución exitosa.
    // Esto es importante si la conexión es persistente o se reusa en el script (aunque aquí no lo es).
    if (isset($API) && $API->connected) {
        $API->disconnect();
    }

} catch (Exception $e) {
    // Manejo de excepciones generales
    http_response_code(500); // Internal Server Error
    error_log("Error en la API de MikroTik: " . $e->getMessage()); // Siempre registra el error completo
    // Muestra detalle del error en el frontend para depuración si display_errors está en 1
    echo json_encode(['error' => 'Error al comunicarse con MikroTik.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
} catch (RouterOSAPIException $e) {
    // Manejo de excepciones específicas de la librería RouterOSAPI
    http_response_code(500); // Internal Server Error
    error_log("Error de RouterOS API: " . $e->getMessage()); // Siempre registra el error completo
    // Muestra detalle del error en el frontend para depuración si display_errors está en 1
    echo json_encode(['error' => 'Error de la API de RouterOS.', 'detalle' => (ini_get('display_errors') == 1 ? $e->getMessage() : 'Error interno del servidor.')]);
}
// ¡IMPORTANTE!: No hay etiqueta de cierre ?> al final de este archivo PHP para evitar espacios en blanco inesperados.