<?php
// ping.php (Versión con corrección de parámetros SQL y nuevos dispositivos)

header('Content-Type: application/json');

// --- Bloque de conexión de base de datos ---
$host = '127.0.0.1';
$dbname = 'netlinecolombiaisp';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    exit;
}
// --- Fin del bloque de conexión ---

$action = $_GET['action'] ?? '';

// --- LISTA COMPLETA DE TIPOS DE DISPOSITIVOS PERMITIDOS ---
$allowed_types = [
    'router', 'repetidora', 'cliente', 'switch', 'servidor_vpn', 'proveedor_internet', 'firewall', 'equipo_borde',
    // Nuevos
    'gateway', 'switch_l3', 'load_balancer', 'ids_ips', 'proxy_server', 'dns_server', 'switch_poe', 'bridge', 
    'transceiver', 'patch_panel', 'hub', 'virtual_server', 'external_cloud', 'telefonia_ip'
];
// --- ---

switch ($action) {

    // --- CASOS DE LISTA CON PAGINACIÓN (EXPANDIDOS Y CORREGIDOS) ---
    case 'obtener_routers':
    case 'obtener_repetidoras':
    case 'obtener_clientes':
    case 'obtener_switchs':
    case 'obtener_servidorvpns':
    case 'obtener_proveedorinternets':
    case 'obtener_firewalls':
    case 'obtener_equipobordes':
    // Nuevos Casos
    case 'obtener_gateways':
    case 'obtener_switchl3s':
    case 'obtener_loadbalancers':
    case 'obtener_idsipss':
    case 'obtener_proxyservers':
    case 'obtener_dnsservers':
    case 'obtener_switchpoes':
    case 'obtener_bridges':
    case 'obtener_transceivers':
    case 'obtener_patchpanels':
    case 'obtener_hubs':
    case 'obtener_virtualservers':
    case 'obtener_externalclouds':
    case 'obtener_telefoniaips':
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $offset = ($page - 1) * $limit;

        $temp_tipo = str_replace('obtener_', '', $action);
        // Quita la 's' final. Si el nombre termina en 's', lo elimina.
        $tipo_sin_s = (substr($temp_tipo, -1) === 's') ? substr($temp_tipo, 0, -1) : $temp_tipo;
        
        // CORRECCIÓN CLAVE: Mapear los nombres de acción sin guiones bajos (que es como llegan) 
        // a los nombres de base de datos con guiones bajos (que es como están guardados).
        $mapeo_nombres = [
            'servidorvpn' => 'servidor_vpn', 
            'proveedorinternet' => 'proveedor_internet', 
            'equipoborde' => 'equipo_borde', 
            'switchl3' => 'switch_l3', 
            'loadbalancer' => 'load_balancer', 
            'idsips' => 'ids_ips', 
            'proxyserver' => 'proxy_server', 
            'dnsserver' => 'dns_server', 
            'switchpoe' => 'switch_poe', 
            'patchpanel' => 'patch_panel', 
            'virtualserver' => 'virtual_server', 
            'externalcloud' => 'external_cloud', 
            'telefoniaip' => 'telefonia_ip'
        ];
        
        $tipo = $mapeo_nombres[$tipo_sin_s] ?? $tipo_sin_s;

        // Asegura que el tipo resultante esté en la lista permitida para evitar inyección SQL
        if (!in_array($tipo, $allowed_types)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Tipo de dispositivo no reconocido: ' . $tipo]);
            exit;
        }

        $total_stmt = $pdo->prepare("SELECT COUNT(*) FROM dispositivos WHERE tipo = :tipo");
        $total_stmt->execute([':tipo' => $tipo]);
        $total_items = $total_stmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT id, ip, nombre, direccion, observaciones FROM dispositivos WHERE tipo = :tipo ORDER BY INET_ATON(ip) LIMIT :limit OFFSET :offset");
        
        $stmt->bindValue(':tipo', $tipo);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['items' => $items, 'total' => $total_items]);
        break;

    case 'obtener_conexiones_detalle':
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $offset = ($page - 1) * $limit;

        $total_stmt = $pdo->query("SELECT COUNT(*) FROM conexiones");
        $total_items = $total_stmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT c.id, d1.nombre AS origen_nombre, d2.nombre AS destino_nombre, c.origen_id, c.destino_id FROM conexiones c JOIN dispositivos d1 ON c.origen_id = d1.id JOIN dispositivos d2 ON c.destino_id = d2.id ORDER BY d1.nombre, d2.nombre LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['items' => $items, 'total' => $total_items]);
        break;

    case 'obtener_todos_dispositivos':
        $stmt = $pdo->query("SELECT id, ip, nombre FROM dispositivos ORDER BY INET_ATON(ip)");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
    
    case 'obtener_dispositivos':
        $dispositivos_stmt = $pdo->query("SELECT id, ip, nombre, tipo, direccion, observaciones FROM dispositivos");
        $dispositivos = $dispositivos_stmt->fetchAll(PDO::FETCH_ASSOC);
        $conexiones_stmt = $pdo->query("SELECT id, origen_id, destino_id FROM conexiones");
        $conexiones = $conexiones_stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['dispositivos' => $dispositivos, 'conexiones' => $conexiones]);
        break;

    case 'agregar_dispositivo':
        $ip = trim($_POST['ip'] ?? '');
        $nombre = trim($_POST['nombre'] ?? '');
        $tipo = $_POST['tipo'] ?? '';
        $direccion = trim($_POST['direccion'] ?? null);
        $observaciones = trim($_POST['observaciones'] ?? null);
        
        // Se utiliza la lista EXPANDIDA para la validación
        if (filter_var($ip, FILTER_VALIDATE_IP) && !empty($nombre) && in_array($tipo, $allowed_types)) {
            $stmt = $pdo->prepare("INSERT INTO dispositivos (ip, nombre, tipo, direccion, observaciones) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$ip, $nombre, $tipo, $direccion, $observaciones]);
            echo json_encode(['success' => true, 'message' => 'Dispositivo agregado correctamente.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error: Datos inválidos o incompletos.']);
        }
        break;
        
    case 'editar_dispositivo':
        $id = $_POST['id'] ?? 0;
        $ip = trim($_POST['ip'] ?? '');
        $nombre = trim($_POST['nombre'] ?? '');
        $direccion = trim($_POST['direccion'] ?? null);
        $observaciones = trim($_POST['observaciones'] ?? null);
        if ($id && filter_var($ip, FILTER_VALIDATE_IP) && !empty($nombre)) {
            $stmt = $pdo->prepare("UPDATE dispositivos SET nombre = ?, ip = ?, direccion = ?, observaciones = ? WHERE id = ?");
            $stmt->execute([$nombre, $ip, $direccion, $observaciones, $id]);
            echo json_encode(['success' => true, 'message' => 'Dispositivo actualizado.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error: Datos para editar inválidos.']);
        }
        break;

    case 'eliminar_dispositivo':
        $id = $_POST['id'] ?? 0;
        if ($id) {
            $pdo->prepare("DELETE FROM dispositivos WHERE id = ?")->execute([$id]);
            $pdo->prepare("DELETE FROM conexiones WHERE origen_id = ? OR destino_id = ?")->execute([$id, $id]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'ID no proporcionado.']);
        }
        break;

    case 'agregar_conexion':
        $origen_id = $_POST['origen_id'] ?? 0;
        $destino_id = $_POST['destino_id'] ?? 0;
        if ($origen_id && $destino_id && $origen_id != $destino_id) {
            $stmt = $pdo->prepare("INSERT INTO conexiones (origen_id, destino_id) VALUES (?, ?)");
            $stmt->execute([$origen_id, $destino_id]);
            echo json_encode(['success' => true, 'message' => 'Conexión creada correctamente.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error en datos de conexión.']);
        }
        break;

    case 'editar_conexion':
        $id = $_POST['id'] ?? 0;
        $origen_id = $_POST['origen_id'] ?? 0;
        $destino_id = $_POST['destino_id'] ?? 0;
        if ($id && $origen_id && $destino_id && $origen_id != $destino_id) {
            $stmt = $pdo->prepare("UPDATE conexiones SET origen_id = ?, destino_id = ? WHERE id = ?");
            $stmt->execute([$origen_id, $destino_id, $id]);
            echo json_encode(['success' => true, 'message' => 'Conexión actualizada.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al editar conexión.']);
        }
        break;
    
    case 'eliminar_conexion':
        $id = $_POST['id'] ?? 0;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM conexiones WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } else {
             echo json_encode(['success' => false]);
        }
        break;

    case 'ping':
        $ip = $_GET['ip'] ?? '';
        if(filter_var($ip, FILTER_VALIDATE_IP)) {
            $escaped_ip = escapeshellarg($ip);
            $command = (stristr(PHP_OS, 'WIN')) ? "ping -n 1 " . $escaped_ip : "ping -c 1 " . $escaped_ip;
            $output = [];
            exec($command, $output, $return_var);
            $output_string = implode(' ', $output);
            $failure_keywords = ['unreachable', 'timed out', 'inaccesible', 'tiempo de espera', '100% packet loss', '100% de perdida', 'could not find host'];
            $is_down = false;
            foreach ($failure_keywords as $keyword) {
                if (stripos($output_string, $keyword) !== false) {
                    $is_down = true;
                    break;
                }
            }
            if ($return_var !== 0 || $is_down) {
                echo json_encode(['status' => 'down']);
            } else {
                echo json_encode(['status' => 'up']);
            }
        } else {
            echo json_encode(['status' => 'invalid_ip']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
        break;
}
?>