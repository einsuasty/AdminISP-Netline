
<?php

/*esta linea de codigo va en el renglon 548 y es para habilita el boton de queue tree:
<a href="queues.php?view=queue_tree" class="button button-module <?php echo ($view !== 'queue_tree') ? 'inactive' : ''; ?>">Queue Tree</a>*/

session_start();

$flash_message = null;
// Solo capturamos el mensaje si NO estamos intentando editar una queue/regla/tree
// para evitar que el mensaje de la acción anterior salte al abrir el formulario.
if (isset($_SESSION['flash_message']) && !isset($_GET['edit_id'])) {
    $flash_message = $_SESSION['flash_message'];
}

if (isset($_GET['logout'])) {
    unset($_SESSION['mikrotik_ip'], $_SESSION['mikrotik_user'], $_SESSION['mikrotik_pass']);
    header('Location: queues.php');
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['ip'])) {
    $_SESSION['mikrotik_ip'] = $_POST['ip'];
    $_SESSION['mikrotik_user'] = $_POST['user'];
    $_SESSION['mikrotik_pass'] = $_POST['password'];
    header('Location: queues.php');
    exit();
}

// --- Determinar qué vista mostrar ---
$view = $_GET['view'] ?? 'queues';

// RUTAS (Ajusta si es necesario)
require_once 'config.php'; // Agregado

$python_path = PYTHON_EXE;    // Cambiado
$script_path = PYTHON_SCRIPT; // Cambiado
$connection_error = '';

// Inicializar todas las variables de datos
$queues = [];
$queue_types = [];
$editing_queue = null;
$rules = [];
$routing_tables = [];
$editing_rule = null;
$queue_tree_items = [];
$editing_queue_tree = null;
$parent_queues = [];
$parent_options = []; 
$interfaces = [];
$packet_marks = []; 

function format_bytes($bytes) {
    if ($bytes == 0) return '0';
    $value = (int)$bytes;
    if ($value >= 1000000) return ($value / 1000000) . 'M';
    if ($value >= 1000) return ($value / 1000) . 'K';
    return $value;
}

function parse_mikrotik_speed($speed) {
    if (empty($speed)) return 0;
    $unit = strtoupper(substr($speed, -1));
    $value = (int)substr($speed, 0, -1);
    if (in_array($unit, ['K', 'M', 'G']) && is_numeric(substr($speed, 0, -1))) {
        if ($unit === 'K') return $value * 1000;
        if ($unit === 'M') return $value * 1000000;
        if ($unit === 'G') return $value * 1000000000;
    }
    return (int)$speed;
}

function format_speed_limit($limit) {
    if (!is_numeric($limit)) return $limit;
    if ($limit >= 1000000) return ($limit / 1000000) . 'M';
    if ($limit >= 1000) return ($limit / 1000) . 'K';
    return $limit;
}

// --- Función para obtener el SVG del icono ---
function get_icon_svg($icon_name) {
    $icons = [
        'edit' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>',
        'suspend' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5h-3z"/></svg>',
        'activate' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/></svg>',
        'delete' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM11 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5z"/></svg>',
        'winbox_check' => '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#0000FF" class="bi bi-check-lg" viewBox="0 0 16 16" style="stroke: #0000FF; stroke-width: 1.5;"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.42-6.446z"/></svg>',
        'winbox_x' => '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#FF0000" class="bi bi-x-lg" viewBox="0 0 16 16" style="stroke: #FF0000; stroke-width: 1.5;"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>'
    ];
    return $icons[$icon_name] ?? '';
}

if (isset($_SESSION['mikrotik_ip'])) {
    $ip = escapeshellarg($_SESSION['mikrotik_ip']);
    $user = escapeshellarg($_SESSION['mikrotik_user']);
    $pass = escapeshellarg($_SESSION['mikrotik_pass']);

    // --- Lógica para la vista de QUEUES ---
    if ($view === 'queues') {
        $command_types = "$python_path $script_path $ip $user $pass get_queue_types";
        $response_types_json = shell_exec($command_types);
        if ($response_types_json) {
            $response_types = json_decode($response_types_json, true);
            if ($response_types && $response_types['status'] === 'success') {
                $queue_types = $response_types['data'];
            }
        }

        if (isset($_GET['edit_id'])) {
            $edit_id = escapeshellarg($_GET['edit_id']);
            $command = "$python_path $script_path $ip $user $pass get_one $edit_id";
            $response_json = shell_exec($command);
            if ($response_json) {
                $response = json_decode($response_json, true);
                if ($response && $response['status'] === 'success' && $response['data']) {
                    $editing_queue = $response['data'];
                    if (isset($editing_queue['max-limit']) && strpos($editing_queue['max-limit'], '/') !== false) {
                        list($upload, $download) = explode('/', $editing_queue['max-limit']);
                        $editing_queue['max_limit_upload'] = format_bytes($upload);
                        $editing_queue['max_limit_download'] = format_bytes($download);
                    } else {
                        $editing_queue['max_limit_upload'] = '0';
                        $editing_queue['max_limit_download'] = '0';
                    }
                }
            }
        }
        
        $command = "$python_path $script_path $ip $user $pass list";
        $response_json = shell_exec($command);
        if ($response_json) {
            $response = json_decode($response_json, true);
            if ($response && $response['status'] === 'success') {
                $queues = $response['data'];
                usort($queues, function($a, $b) { return strcasecmp($a['name'], $b['name']); });
            } else { $connection_error = $response['message'] ?? 'Error desconocido.'; }
        } else { $connection_error = 'No se pudo obtener respuesta del MikroTik.'; }
    }
    
    // --- Lógica para la vista de RULES ---
    elseif ($view === 'rules') {
        $command_tables = "$python_path $script_path $ip $user $pass get_routing_tables";
        $response_tables_json = shell_exec($command_tables);
        if($response_tables_json) {
            $response_tables = json_decode($response_tables_json, true);
            if ($response_tables && $response_tables['status'] === 'success') {
                $routing_tables = $response_tables['data'];
            }
        }
        
        if (isset($_GET['edit_id'])) {
            $edit_id = escapeshellarg($_GET['edit_id']);
            $command = "$python_path $script_path $ip $user $pass get_one_rule $edit_id";
            $response_json = shell_exec($command);
            if ($response_json) {
                $response = json_decode($response_json, true);
                if ($response && $response['status'] === 'success' && $response['data']) {
                    $editing_rule = $response['data'];
                }
            }
        }

        $command = "$python_path $script_path $ip $user $pass list_rules";
        $response_json = shell_exec($command);
        if ($response_json) {
            $response = json_decode($response_json, true);
            if ($response && $response['status'] === 'success') {
                $rules = $response['data'];
                usort($rules, function($a, $b) {
                    return version_compare($a['src-address'] ?? '0.0.0.0', $b['src-address'] ?? '0.0.0.0');
                });
            } else { $connection_error = $response['message'] ?? 'Error desconocido.'; }
        } else { $connection_error = 'No se pudo obtener respuesta del MikroTik.'; }
    }
    
    // --- Lógica para la vista de QUEUE TREE ---
    elseif ($view === 'queue_tree') {
        $command_options = "$python_path $script_path $ip $user $pass get_interfaces_and_queues"; 
        $response_options_json = shell_exec($command_options);
        if ($response_options_json) {
            $response_options = json_decode($response_options_json, true);
            if ($response_options && $response_options['status'] === 'success') {
                $parent_options = $response_options['data'];
            }
        }
        
        $command_all_queues = "$python_path $script_path $ip $user $pass get_parent_queues";
        $response_all_queues_json = shell_exec($command_all_queues);
        if ($response_all_queues_json) {
            $response_all_queues = json_decode($response_all_queues_json, true);
            if ($response_all_queues && $response_all_queues['status'] === 'success') {
                $parent_queues = $response_all_queues['data'];
            }
        }

        $command_types = "$python_path $script_path $ip $user $pass get_queue_types";
        $response_types_json = shell_exec($command_types);
        if ($response_types_json) {
            $response_types = json_decode($response_types_json, true);
            if ($response_types && $response_types['status'] === 'success') {
                $queue_types = $response_types['data'];
            }
        }

        $command_marks = "$python_path $script_path $ip $user $pass get_packet_marks";
        $response_marks_json = shell_exec($command_marks);
        if ($response_marks_json) {
            $response_marks = json_decode($response_marks_json, true);
            if ($response_marks && $response_marks['status'] === 'success') {
                $packet_marks = $response_marks['data'] ?? [];
            }
        } else {
            $packet_marks = [];
        }

        if (isset($_GET['edit_id'])) {
            $edit_id = escapeshellarg($_GET['edit_id']);
            $command = "$python_path $script_path $ip $user $pass get_one_tree $edit_id";
            $response_json = shell_exec($command);
            if ($response_json) {
                $response = json_decode($response_json, true);
                if ($response && $response['status'] === 'success' && $response['data']) {
                    $editing_queue_tree = $response['data'];
                }
            }
        }

        $command = "$python_path $script_path $ip $user $pass list_tree";
        $response_json = shell_exec($command);
        if ($response_json) {
            $response = json_decode($response_json, true);
            if ($response && $response['status'] === 'success') {
                $queue_tree_items = $response['data'];
            } else { $connection_error = $response['message'] ?? 'Error desconocido.'; }
        } else { $connection_error = 'No se pudo obtener respuesta del MikroTik.'; }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="icono2.ico" type="image/x-icon">
    <title>Administrador MikroTik</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        #particles-js {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #144896ff;
            z-index: 1; 
        }

        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            background-color: transparent;
            color: #333; 
            margin: 0; 
            padding: 20px; 
            display: flex; 
            justify-content: center; 
            align-items: flex-start;
            min-height: 100vh;
            position: relative;
            z-index: 5;
            overflow-y: auto;
        }
        .container { 
            width: 100%; 
            max-width: 1300px;
            background-color: rgba(255, 255, 255, 0.8) !important;
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); 
            position: relative;
            z-index: 10;
        }
        
        <?php if (!isset($_SESSION['mikrotik_ip']) || $connection_error): ?>
        .container {
            max-width: 380px;
        }
        <?php endif; ?>

        .header-logo { display: block; margin: 0 auto 20px auto; max-width: 300px; height: 85px; width: auto; }
        h1 { color: #1e3a8a; text-align: center; margin-bottom: 20px; }
        
        h2 { color: #1e3a8a; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px; text-align: center; 
}
        .text-center { text-align: center; }
        hr { border: none; border-top: 1px solid #e5e7eb; margin: 30px 0; }
        
        .info-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            background-color: #eff6ff; 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 20px; 
            gap: 10px; 
        }
        
        form { display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; width: 100%; }
        .login-form { 
            display: flex; 
            flex-direction: column; 
            gap: 15px; 
            max-width: 100%;
            width: 100%; 
            margin: 0 auto; 
        }
        .login-button-group {
            display: flex;
            gap: 10px;
            justify-content: space-between;
        }
        .login-button-group > * {
            flex-grow: 1;
        }

        input[type="text"], input[type="password"], input[type="number"], select { width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1em; background-color: white; }
        label { display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9em; color: #4b5563; }
        button, .button, .login-button { display: inline-block; padding: 12px 20px; border: none; border-radius: 8px; background-color: #1e40af; color: white; font-size: 1em; font-weight: bold; cursor: pointer; text-decoration: none; text-align: center; white-space: nowrap; }
        
        .login-button-connect { background-color: #1e40af; }
        .login-button-back { background-color: #cac719ff; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
        .actions-cell { display: flex; align-items: center; gap: 8px; }
        .status-icon { display: inline-block; width: 30px; height: 30px; border-radius: 50%; margin-right: 8px; background-color: #d1d5db; transition: background-color 0.5s ease; }
        .status-green { background-color: #22c55e; }
        .status-orange { background-color: #f97316; }
        .status-red { background-color: #ef4444; }
        tr.is-suspended { background-color: #f3f4f6 !important; opacity: 0.8; }
        tr.is-suspended td { color: #ef4444;}
        .header-actions { display: flex; gap: 10px; }
        .button-logout { background-color: #ef4444; } /* ROJO */
        .button-logout:hover { background-color: #dc2626; } /* ROJO OSCURO AL PASAR MOUSE */
        .button-back { background-color: #6b7280; }
        .button-back:hover { background-color: #4b5563; }
        
        .button-action { 
            width: 34px;
            height: 34px;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1em; 
            text-align: center; 
            border-radius: 6px; 
        }
        .button-action svg {
            color: white;
        }

        .button-edit { background-color: #22c55e; }
        .button-edit:hover { background-color: #16a34a; }
        .button-delete { background-color: #ef4444; }
        .button-delete:hover { background-color: #dc2626; }
        .button-suspend { background-color: #f59e0b; }
        .button-suspend:hover { background-color: #d97706; }
        .button-activate { background-color: #10b981; }
        .button-activate:hover { background-color: #059669; }
        .button-module { background-color: #3b82f6; }
        .button-module:hover { background-color: #2563eb; }
        
        .button-module.inactive { background-color: #9ca3af !important; color: #fff; }

        .alert { padding: 15px; margin-bottom: 20px; border: 1px solid transparent; border-radius: 8px; font-weight: 500; }
        .alert-success { color: #0f5132; background-color: #d1e7dd; border-color: #badbcc; }
        .alert-error { color: #842029; background-color: #f8d7da; border-color: #f5c2c7; }
        .alert-warning { color: #664d03; background-color: #fff3cd; border-color: #ffecb5; }
        .password-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .toggle-password { position: absolute; right: 15px; cursor: pointer; user-select: none; color: #6b7280; }
        
        .queue-name.is-parent { font-weight: 700; }
        tr.is-disabled { background-color: #f3f4f6 !important; opacity: 0.8; }
        tr.is-disabled td { color: #ef4444; }
        
        .button-toggle-enable { background-color: #10b981; }
        .button-toggle-enable:hover { background-color: #059669; }
        .button-toggle-disable { background-color: #f59e0b; }
        .button-toggle-disable:hover { background-color: #d97706; }

        .collapsible-form { display: none; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
        .btn-show-form { background-color: #10b981; margin-bottom: 0; /* Quitamos margen para alinear */ }
        .btn-show-form:hover { background-color: #059669; }

        /* Estilo Winbox para los botones de visto/X */
        .button-winbox {
            background-color: #f0f0f0 !important;
            border: 1px solid #ababab !important;
            transition: all 0.2s;
        }
        .button-winbox:hover {
            background-color: #e0e0e0 !important;
            transform: scale(1.05);
        }

        /* --- ESTILOS DASHBOARD GRAFICAS --- */
        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
        }

        .graph-card {
            background: rgba(255, 255, 255, 0.4);
            border: 1px solid #fcf7f7;
            border-radius: 12px;
            padding: 10px 15px;
            /*flex: 1;*/
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 140px; /* Altura REDUCIDA */
            width: 380px;  /* Ancho REDUCIDA */
            position: relative;
            overflow: hidden;
        }

        .graph-card.upload-card { border-left: 5px solid #0000FF; } /* Azul */
        .graph-card.download-card { border-right: 5px solid #FF0000; } /* Rojo */

        .graph-header-title {
            font-size: 0.75em;
            font-weight: 700;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 0px;
            z-index: 2;
            position: relative;
        }

        .graph-value {
            font-size: 1.5em; /* Fuente reducida */
            font-weight: 800;
            z-index: 2;
            position: relative;
            margin-bottom: auto;
        }
        
        .val-up { color: #0000FF; }
        .val-down { color: #FF0000; }

        .traffic-unit {
            font-size: 0.6em;
            color: #6b7280;
        }

        .chart-container-box {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50px; /* Grafica reducida */
            z-index: 1;
        }

        .center-logo-container {
            flex: 0 0 auto;
            text-align: center;
        }
        .center-logo {
            height: 100px; /* Logo reducido */
            width: auto;
            display: block;
        }
        
        /* Contenedor flexible para la barra de búsqueda y el botón */
        .controls-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }
       .search-container {
            flex-grow: 1; /* <--- Esto hace que el contenedor ocupe todo el espacio vacío */
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .search-container input {
            width: 100% !important; /* <--- Esto hace que la barra llene ese espacio */
            margin: 0;
        }
        }
        .search-container label {
            white-space: nowrap;
            margin-bottom: 0;
        }
        
    </style>
</head>
<body>

<div id="particles-js"></div>

<div class="container">
    
    <?php if (isset($_SESSION['mikrotik_ip']) && !$connection_error): ?>
        
        <?php if ($view === 'queues'): ?>
            <div class="dashboard-header">
                <div class="graph-card upload-card">
                    <div class="graph-header-title">Carga Total (UP)</div>
                    <div id="total-upload" class="graph-value val-up">0.00 <span class="traffic-unit">Mbps</span></div>
                    <div class="chart-container-box">
                        <canvas id="uploadChart"></canvas>
                    </div>
                </div>

                <div class="center-logo-container">
                    <img src="Mikrotik_1.png" alt="Logo Mikrotik" class="center-logo">
                </div>

                <div class="graph-card download-card">
                    <div class="graph-header-title" style="text-align: right;">Descarga Total (DOWN)</div>
                    <div id="total-download" class="graph-value val-down" style="text-align: right;">0.00 <span class="traffic-unit">Mbps</span></div>
                    <div class="chart-container-box">
                        <canvas id="downloadChart"></canvas>
                    </div>
                </div>
            </div>
        <?php else: ?>
            <img src="Mikrotik_1.png" alt="Logo Mikrotik" class="header-logo" style="margin: 0 auto 20px auto;">
        <?php endif; ?>

    <?php else: ?>
        <img src="Mikrotik_1.png" alt="Logo Mikrotik" class="header-logo" style="margin: 0 auto 20px auto;">
    <?php endif; ?>
  

    <?php if (isset($_SESSION['mikrotik_ip']) && !$connection_error): ?>
        <div class="info-header">
            <p>Conectado a: <strong><?php echo htmlspecialchars($_SESSION['mikrotik_ip']); ?></strong></p>
            <div class="header-actions">
                <a href="queues.php?view=queues" class="button button-module <?php echo ($view !== 'queues') ? 'inactive' : ''; ?>">Simple Queues</a>
                <a href="queues.php?view=rules" class="button button-module <?php echo ($view !== 'rules') ? 'inactive' : ''; ?>">Rules</a>
                
            
                <a href="?logout=true" class="button button-logout">Desconectar</a>
            </div>
        </div>
        <hr>

        <?php if ($view === 'queues'): ?>
            <div id="form-container" class="collapsible-form" style="<?php echo $editing_queue ? 'display:block;' : ''; ?>">
                <h2><?php echo $editing_queue ? 'Editar Queue' : 'Añadir Nueva Queue'; ?></h2>
                <form action="actions.php" method="POST">
                    <?php if ($editing_queue): ?>
                        <input type="hidden" name="action" value="edit">
                        <input type="hidden" name="id" value="<?php echo htmlspecialchars($editing_queue['id'] ?? ''); ?>">
                    <?php else: ?>
                        <input type="hidden" name="action" value="add">
                    <?php endif; ?>
                    <div class="form-grid">
                        <div><label for="queue_name">Nombre:</label><input type="text" id="queue_name" name="name" placeholder="Nombre del cliente" required value="<?php echo htmlspecialchars($editing_queue['name'] ?? ''); ?>"></div>
                        <div><label for="queue_target">Target (IP):</label><input type="text" id="queue_target" name="target" placeholder="192.168.x.x" required value="<?php echo htmlspecialchars($editing_queue['target'] ?? ''); ?>"></div>
                        <div><label for="queue_upload">Límite de Subida:</label><input type="text" id="queue_upload" name="max_limit_upload" placeholder="ej: 2M" required value="<?php echo htmlspecialchars($editing_queue['max_limit_upload'] ?? ''); ?>"></div>
                        <div><label for="queue_download">Límite de Bajada:</label><input type="text" id="queue_download" name="max_limit_download" placeholder="ej: 10M" required value="<?php echo htmlspecialchars($editing_queue['max_limit_download'] ?? ''); ?>"></div>
                        <div>
                            <label for="queue_priority">Prioridad:</label>
                            <select id="queue_priority" name="priority" required>
                                <?php
                                    $priority_value = isset($editing_queue['priority']) ? explode('/', $editing_queue['priority'])[0] : '8';
                                    for ($i = 1; $i <= 8; $i++) {
                                        $selected = ($i == $priority_value) ? 'selected' : '';
                                        echo "<option value='{$i}' {$selected}>{$i}/{$i}</option>";
                                    }
                                ?>
                            </select>
                        </div>
                        <div>
                            <label for="queue_type">Queue Type:</label>
                            <select id="queue_type" name="queue_type" required>
                                <?php
                                    $full_queue_type = $editing_queue['queue'] ?? 'default-small';
                                    $current_upload_type = explode('/', $full_queue_type)[0]; 
                                    foreach ($queue_types as $type) {
                                        if ($type['dynamic'] === 'true') continue;
                                        $selected = (strcasecmp($type['name'], $current_upload_type) == 0) ? 'selected' : '';
                                        echo "<option value='" . htmlspecialchars($type['name']) . "' {$selected}>" . htmlspecialchars($type['name']) . "</option>";
                                    }
                                ?>
                            </select>
                        </div>
                    </div>
                    <button type="submit"><?php echo $editing_queue ? 'Actualizar' : 'Añadir'; ?></button>
                    <button type="button" onclick="toggleForm()" class="button button-logout">Cancelar</button>
                </form>
            </div>
            
            <h2>SIMPLE QUEUES - ACTUALES</h2>
            
            <div class="controls-row">
                <div class="search-container">
                    <label for="queueSearch">Buscar:</label>
                    <input type="text" id="queueSearch" placeholder="Nombre o Target..." >
                </div>
                <button onclick="toggleForm()" class="button btn-show-form" style="white-space: nowrap;">+ <?php echo $editing_queue ? 'Editar' : 'Añadir Queue'; ?></button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Estado</th>
                        <th>Nombre</th>
                        <th>Target</th>
                        <th>Max Limit</th>
                        <th>Queue Type</th>
                        <th>Subida Actual</th>
                        <th>Bajada Actual</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($queues as $queue):
                        $is_suspended = (isset($queue['comment']) && strpos($queue['comment'], 'suspended_plan=') !== false);
                    ?>
                    <tr id="queue-<?php echo htmlspecialchars($queue['id']); ?>" class="<?php echo $is_suspended ? 'is-suspended' : ''; ?>">
                        <td><span id="status-<?php echo htmlspecialchars($queue['id']); ?>" class="status-icon"></span></td>
                        <td><?php echo htmlspecialchars($queue['name']); ?></td>
                        <td><?php echo htmlspecialchars($queue['target']); ?></td>
                        <td>
                            <?php
                                if (isset($queue['max-limit']) && strpos($queue['max-limit'], '/') !== false) {
                                    list($upload, $download) = explode('/', $queue['max-limit']);
                                    echo format_bytes($upload) . ' / ' . format_bytes($download);
                                } else { echo '0 / 0'; }
                            ?>
                        </td>
                        <td><?php echo htmlspecialchars($queue['queue']); ?></td>
                        <td id="rate-up-<?php echo htmlspecialchars($queue['id']); ?>">--</td>
                        <td id="rate-down-<?php echo htmlspecialchars($queue['id']); ?>">--</td>
                        <td class="actions-cell">
                            <a href="queues.php?view=queues&edit_id=<?php echo urlencode($queue['id']); ?>" class="button button-edit button-action" title="Editar Queue">
                                <?php echo get_icon_svg('edit'); ?>
                            </a>
                            <?php if ($is_suspended): ?>
                                <a href="actions.php?action=activate&id=<?php echo urlencode($queue['id']); ?>" class="button button-activate button-action" title="Activar Queue">
                                    <?php echo get_icon_svg('activate'); ?>
                                </a>
                            <?php else: ?>
                                <a href="actions.php?action=suspend&id=<?php echo urlencode($queue['id']); ?>" class="button button-suspend button-action" title="Suspender Queue">
                                    <?php echo get_icon_svg('suspend'); ?>
                                </a>
                            <?php endif; ?>
                            <a href="actions.php?action=delete&id=<?php echo urlencode($queue['id']); ?>" onclick="return confirm('¿Estás seguro de eliminar esta Queue?');" class="button button-delete button-action" title="Eliminar Queue">
                                <?php echo get_icon_svg('delete'); ?>
                            </a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            
        <?php elseif ($view === 'rules'): ?>
            <div id="form-container" class="collapsible-form" style="<?php echo $editing_rule ? 'display:block;' : ''; ?>">
                <h2><?php echo $editing_rule ? 'Editar Regla de Ruteo' : 'Añadir Nueva Regla'; ?></h2>
                <form action="actions.php" method="POST">
                    <?php if ($editing_rule): ?>
                        <input type="hidden" name="action" value="edit_rule">
                        <input type="hidden" name="id" value="<?php echo htmlspecialchars($editing_rule['.id'] ?? $editing_rule['id'] ?? ''); ?>">
                    <?php else: ?>
                        <input type="hidden" name="action" value="add_rule">
                    <?php endif; ?>
                    <div class="form-grid">
                        <div>
                            <label for="src-address">Src. Address:</label>
                            <input type="text" id="src-address" name="src-address" placeholder="Ej: 192.168.10.0/24" value="<?php echo htmlspecialchars($editing_rule['src-address'] ?? ''); ?>">
                        </div>
                        <div>
                            <label for="dst-address">Dst. Address:</label>
                            <input type="text" id="dst-address" name="dst-address" placeholder="Ej: 0.0.0.0/0" value="<?php echo htmlspecialchars($editing_rule['dst-address'] ?? ''); ?>">
                        </div>
                        <div>
                            <label for="table">Tabla:</label>
                            <select id="table" name="table" required>
                                <?php 
                                    $current_table = $editing_rule['table'] ?? 'main';
                                    foreach ($routing_tables as $table_name) {
                                        $selected = ($table_name == $current_table) ? 'selected' : '';
                                        echo "<option value='" . htmlspecialchars($table_name) . "' {$selected}>" . htmlspecialchars($table_name) . "</option>";
                                    }
                                ?>
                            </select>
                        </div>
                        <div>
                            <label for="comment">Comentario:</label>
                            <input type="text" id="comment" name="comment" placeholder="Descripción de la regla" value="<?php echo htmlspecialchars($editing_rule['comment'] ?? ''); ?>">
                        </div>
                    </div>
                    <button type="submit"><?php echo $editing_rule ? 'Actualizar Regla' : 'Añadir Regla'; ?></button>
                    <button type="button" onclick="toggleForm()" class="button button-logout">Cancelar</button>
                </form>
            </div>
            
            <h2>REGLAS DE TABLAS DE RUTEO</h2>
            
            <div class="controls-row">
                <div class="search-container">
                    <label for="ruleSearch">Buscar:</label>
                    <input type="text" id="ruleSearch" placeholder="Src. Address o comentario...">
                </div>
                <button onclick="toggleForm()" class="button btn-show-form" style="white-space: nowrap;">+ <?php echo $editing_rule ? 'Editar' : 'Añadir Regla'; ?></button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Src. Address</th>
                        <th>Dst. Address</th>
                        <th>Tabla</th>
                        <th>Comentario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($rules as $rule): 
                        $is_disabled = (isset($rule['disabled']) && $rule['disabled'] === 'true');
                        $toggle_action = $is_disabled ? 'enable_rule' : 'disable_rule';
                        $toggle_text = $is_disabled ? 'Habilitar' : 'Deshabilitar';
                        $toggle_icon = $is_disabled ? 'winbox_check' : 'winbox_x';
                    ?>
                    <tr class="<?php echo $is_disabled ? 'is-disabled' : ''; ?>">
                        <td><?php echo htmlspecialchars($rule['src-address'] ?? '0.0.0.0/0'); ?></td>
                        <td><?php echo htmlspecialchars($rule['dst-address'] ?? '0.0.0.0/0'); ?></td>
                        <td><?php echo htmlspecialchars($rule['table']); ?></td>
                        <td><?php echo htmlspecialchars($rule['comment'] ?? ''); ?></td>
                        <td class="actions-cell">
                            <a href="queues.php?view=rules&edit_id=<?php echo urlencode($rule['id']); ?>" class="button button-edit button-action" title="Editar Regla">
                                <?php echo get_icon_svg('edit'); ?>
                            </a>
                            
                            <a href="actions.php?action=<?php echo $toggle_action; ?>&id=<?php echo urlencode($rule['id']); ?>&view=rules" 
                                class="button button-action button-winbox" title="<?php echo $toggle_text; ?>">
                                <?php echo get_icon_svg($toggle_icon); ?>
                            </a>
                            
                            <a href="actions.php?action=delete_rule&id=<?php echo urlencode($rule['id']); ?>" onclick="return confirm('¿Estás seguro de que quieres eliminar esta regla?');" class="button button-delete button-action" title="Eliminar Regla">
                                <?php echo get_icon_svg('delete'); ?>
                            </a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

        <?php elseif ($view === 'queue_tree'): ?>
            <button onclick="toggleForm()" class="button btn-show-form">+ <?php echo $editing_queue_tree ? 'Editar Queue Tree' : 'Añadir Nueva Queue Tree'; ?></button>
            
            <div id="form-container" class="collapsible-form" style="<?php echo $editing_queue_tree ? 'display:block;' : ''; ?>">
                <h2><?php echo $editing_queue_tree ? 'Editar Queue Tree' : 'Añadir Nueva Queue Tree'; ?></h2>
                <form action="actions.php" method="POST">
                    <?php if ($editing_queue_tree): ?>
                        <input type="hidden" name="action" value="edit_tree">
                        <input type="hidden" name="id" value="<?php echo htmlspecialchars($editing_queue_tree['id'] ?? ''); ?>">
                    <?php else: ?>
                        <input type="hidden" name="action" value="add_tree">
                    <?php endif; ?>
                    <div class="form-grid">
                        <div><label for="tree_name">Nombre:</label><input type="text" id="tree_name" name="name" placeholder="Nombre de la cola" required value="<?php echo htmlspecialchars($editing_queue_tree['name'] ?? ''); ?>"></div>
                        <div>
                            <label for="tree_parent">Parent:</label>
                            <select id="tree_parent" name="parent" required>
                                <option value="">Seleccionar Parent...</option>
                                <?php 
                                    $current_parent_name = $editing_queue_tree['parent'] ?? '';
                                    foreach ($parent_options as $option): 
                                        $selected = ($option['id'] == $current_parent_name || $option['name'] == $current_parent_name) ? 'selected' : '';
                                ?>
                                    <option value="<?php echo htmlspecialchars($option['id']); ?>" <?php echo $selected; ?>>
                                        <?php echo htmlspecialchars($option['name']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div>
                            <label for="tree_packet_mark">Packet Mark:</label>
                            <select id="tree_packet_mark" name="packet_mark">
                                <option value="">Seleccionar Packet Mark...</option>
                                <?php
                                    $current_mark = $editing_queue_tree['packet-mark'] ?? '';
                                    foreach ($packet_marks as $mark):
                                        $selected = ($mark == $current_mark) ? 'selected' : '';
                                ?>
                                    <option value="<?php echo htmlspecialchars($mark); ?>" <?php echo $selected; ?>>
                                        <?php echo htmlspecialchars($mark); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div>
                            <label for="tree_priority">Prioridad:</label>
                            <select id="tree_priority" name="priority">
                                <?php 
                                    $priority_value = isset($editing_queue_tree['priority']) ? $editing_queue_tree['priority'] : '8';
                                    for ($i = 1; $i <= 8; $i++) {
                                        $selected = ($i == $priority_value) ? 'selected' : '';
                                        echo "<option value='{$i}' {$selected}>{$i}</option>";
                                    }
                                ?>
                            </select>
                        </div>
                        <div>
                            <label for="tree_queue_type">Queue Type:</label>
                            <select id="tree_queue_type" name="queue_type">
                                <option value="">default</option>
                                <?php 
                                    $current_type = $editing_queue_tree['queue'] ?? 'default';
                                    foreach ($queue_types as $type) {
                                        if ($type['dynamic'] === 'true') continue;
                                        $selected = ($type['name'] == $current_type) ? 'selected' : '';
                                        echo "<option value='" . htmlspecialchars($type['name']) . "' {$selected}>" . htmlspecialchars($type['name']) . "</option>";
                                    }
                                ?>
                            </select>
                        </div>
                        <div><label for="tree_limit_at">Limit At:</label><input type="text" id="tree_limit_at" name="limit_at" placeholder="ej: 5M" value="<?php echo htmlspecialchars(format_speed_limit(parse_mikrotik_speed($editing_queue_tree['limit-at'] ?? ''))); ?>"></div>
                        <div><label for="tree_max_limit">Max Limit:</label><input type="text" id="tree_max_limit" name="max_limit" placeholder="ej: 10M" value="<?php echo htmlspecialchars(format_speed_limit(parse_mikrotik_speed($editing_queue_tree['max-limit'] ?? ''))); ?>"></div>
                        <div><label for="tree_burst_limit">Burst Limit:</label><input type="text" id="tree_burst_limit" name="burst_limit" placeholder="ej: 15M" value="<?php echo htmlspecialchars(format_speed_limit(parse_mikrotik_speed($editing_queue_tree['burst-limit'] ?? ''))); ?>"></div>
                        <div><label for="tree_burst_threshold">Burst Threshold:</label><input type="text" id="tree_burst_threshold" name="burst_threshold" placeholder="ej: 8M" value="<?php echo htmlspecialchars(format_speed_limit(parse_mikrotik_speed($editing_queue_tree['burst-threshold'] ?? ''))); ?>"></div>
                        <div><label for="tree_burst_time">Burst Time (s):</label><input type="number" id="tree_burst_time" name="burst_time" placeholder="ej: 10" value="<?php echo htmlspecialchars($editing_queue_tree['burst-time'] ?? ''); ?>"></div>
                        <div><label for="tree_comment">Comentario:</label><input type="text" id="tree_comment" name="comment" placeholder="Descripción" value="<?php echo htmlspecialchars($editing_queue_tree['comment'] ?? ''); ?>"></div>
                    </div>
                    <button type="submit"><?php echo $editing_queue_tree ? 'Actualizar' : 'Añadir'; ?></button>
                    <button type="button" onclick="toggleForm()" class="button button-logout">Cancelar</button>
                </form>
            </div>
            
            <hr>
            <h2>Queue Tree Actual</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Parent</th>
                        <th>Packet Mark</th>
                        <th>Priority</th>
                        <th>Max Limit</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                        $queue_id_to_name = [];
                        foreach ($parent_queues as $q) {
                            if (isset($q['id']) && isset($q['name'])) {
                                $queue_id_to_name[$q['id']] = $q['name'];
                            }
                        }
                    ?>
                    <?php foreach ($queue_tree_items as $item): ?>
                    <?php 
                        $is_child = isset($item['parent']) && isset($queue_id_to_name[$item['parent']]);
                        $indent_style = $is_child ? "style='margin-left: 20px; display: inline-block;'" : '';
                        $bold_class = !$is_child ? 'is-parent' : '';
                        $parent_display_name = '';
                        if (isset($item['parent'])) {
                            if (isset($queue_id_to_name[$item['parent']])) {
                                $parent_display_name = $queue_id_to_name[$item['parent']];
                            } else {
                                $parent_display_name = $item['parent'];
                            }
                        }
                    ?>
                    <tr>
                        <td><span class="queue-name <?php echo $bold_class; ?>" <?php echo $indent_style; ?>><?php echo htmlspecialchars($item['name'] ?? ''); ?></span></td>
                        <td><?php echo htmlspecialchars($parent_display_name); ?></td>
                        <td><?php echo htmlspecialchars($item['packet-mark'] ?? 'N/A'); ?></td>
                        <td><?php echo htmlspecialchars($item['priority'] ?? 'N/A'); ?></td>
                        <td><?php echo htmlspecialchars($item['max-limit'] ?? 'N/A'); ?></td>
                        <td class="actions-cell">
                            <a href="queues.php?view=queue_tree&edit_id=<?php echo urlencode($item['id']); ?>" class="button button-edit button-action" title="Editar Queue Tree"><?php echo get_icon_svg('edit'); ?></a>
                            <a href="actions.php?action=delete_tree&id=<?php echo urlencode($item['id']); ?>" onclick="return confirm('¿Estás seguro de eliminar esta Queue Tree?');" class="button button-delete button-action" title="Eliminar Queue Tree"><?php echo get_icon_svg('delete'); ?></a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>

    <?php else: ?>
        <h2 class="text-center">INICIAR SESION</h2>
        <form action="queues.php" method="POST" class="login-form">
            <input type="text" name="ip" placeholder="IP del MikroTik" required>
            <input type="text" name="user" placeholder="Usuario" required>
            <div class="password-wrapper">
                <input type="password" name="password" id="login-password" required placeholder="Contraseña">
                <span id="toggle-password" class="toggle-password">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
                </span>
            </div>
            
            <div class="login-button-group">
                <button type="submit" class="login-button login-button-connect">Conectar</button>
                <a href="../Administrador.html" class="button login-button login-button-back">Volver al Panel</a>
            </div>
        </form>
        <?php if ($connection_error): ?><p class="error"><?php echo htmlspecialchars($connection_error); ?></p><?php endif; ?>
    <?php endif; ?>
</div>

<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>

<script>
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#ffffff" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5 },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 6 }
        },
        "interactivity": {
            "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } }
        },
        "retina_detect": true
    });
</script>

<script>
function toggleForm() {
    const form = document.getElementById('form-container');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function parseSpeedToBps(speedStr) {
    if (!speedStr || speedStr === 0 || speedStr === "0") return 0;
    const speed = parseFloat(speedStr);
    const unit = speedStr.toString().toUpperCase().slice(-1);
    if (unit === 'K') return speed * 1000;
    if (unit === 'M') return speed * 1000000;
    if (unit === 'G') return speed * 1000000000;
    return speed;
}
const formatRate = (bps) => {
    if (bps < 1000) return bps.toFixed(0) + ' bps';
    if (bps < 1000000) return (bps / 1000).toFixed(1) + ' Kbps';
    return (bps / 1000000).toFixed(2) + ' Mbps';
};

// --- CONFIGURACIÓN DE GRAFICAS ---
let uploadChartInstance = null;
let downloadChartInstance = null;

function initCharts() {
    const ctxUp = document.getElementById('uploadChart');
    const ctxDown = document.getElementById('downloadChart');

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
            x: { display: false },
            y: { display: false, beginAtZero: true }
        },
        elements: {
            point: { radius: 0 },
            line: { tension: 0.4, borderWidth: 2 }
        },
        animation: { duration: 0 }
    };

    if (ctxUp) {
        uploadChartInstance = new Chart(ctxUp.getContext('2d'), {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    data: Array(20).fill(0),
                    borderColor: '#0000FF',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    fill: true
                }]
            },
            options: commonOptions
        });
    }

    if (ctxDown) {
        downloadChartInstance = new Chart(ctxDown.getContext('2d'), {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    data: Array(20).fill(0),
                    borderColor: '#FF0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    fill: true
                }]
            },
            options: commonOptions
        });
    }
}

function updateChartData(chart, newValue) {
    if (!chart) return;
    const data = chart.data.datasets[0].data;
    data.shift();
    data.push(newValue);
    chart.update();
}

async function updateTraffic() {
    // Si no estamos en la vista de queues, no ejecutamos la actualización
    const currentView = new URLSearchParams(window.location.search).get('view') || 'queues';
    if (currentView !== 'queues') return;

    try {
        const response = await fetch('api_traffic.php');
        const result = await response.json();
        if (result.status === 'success' && result.data) {
            
            let sumUploadBps = 0;
            let sumDownloadBps = 0;

            result.data.forEach(queue => {
                const queueId = queue['id']; 
                if (!queueId) return;
                
                const queueRow = document.getElementById(`queue-${queueId}`);
                const statusIcon = document.getElementById(`status-${queueId}`);
                const rateUpCell = document.getElementById(`rate-up-${queueId}`);
                const rateDownCell = document.getElementById(`rate-down-${queueId}`);
                
                if (queueRow && statusIcon && rateUpCell && rateDownCell) {
                    const [rateUpBps, rateDownBps] = queue.rate.split('/').map(Number);
                    
                    sumUploadBps += rateUpBps;
                    sumDownloadBps += rateDownBps;

                    rateUpCell.textContent = formatRate(rateUpBps);
                    rateDownCell.textContent = formatRate(rateDownBps);
                    
                    const isSuspended = queueRow.classList.contains('is-suspended');
                    if (!isSuspended) {
                        const [maxLimitUpStr, maxLimitDownStr] = queue['max-limit'].split('/');
                        const totalRate = Math.max(rateUpBps, rateDownBps);
                        const totalMaxLimit = Math.max(parseSpeedToBps(maxLimitUpStr), parseSpeedToBps(maxLimitDownStr));
                        let percentage = totalMaxLimit > 0 ? (totalRate / totalMaxLimit) * 100 : 0;
                        statusIcon.className = 'status-icon ' + (percentage > 75 ? 'status-red' : (percentage > 50 ? 'status-orange' : 'status-green'));
                    }
                }
            });

            // Actualizar Graficas y Texto Total
            const totalUpElem = document.getElementById('total-upload');
            const totalDownElem = document.getElementById('total-download');

            if (totalUpElem && totalDownElem) {
                totalUpElem.innerHTML = formatRate(sumUploadBps).replace(' ', ' <span class="traffic-unit">') + '</span>';
                totalDownElem.innerHTML = formatRate(sumDownloadBps).replace(' ', ' <span class="traffic-unit">') + '</span>';
                
                // Actualizar charts si existen
                updateChartData(uploadChartInstance, sumUploadBps / 1000000); 
                updateChartData(downloadChartInstance, sumDownloadBps / 1000000);
            }
        }
    } catch (error) {
        console.error("Error actualizando tráfico total:", error);
    }
}


<?php if (isset($_SESSION['mikrotik_ip']) && !$connection_error): ?>
    document.addEventListener('DOMContentLoaded', function() {
        initCharts();
        updateTraffic();
        
        const queueSearchInput = document.getElementById('queueSearch');
        if (queueSearchInput) {
            queueSearchInput.addEventListener('keyup', function() {
                const filter = this.value.toLowerCase();
                document.querySelectorAll('table tbody tr').forEach(row => {
                    const text = row.innerText.toLowerCase();
                    row.style.display = text.includes(filter) ? '' : 'none';
                });
            });
        }
        
        const ruleSearchInput = document.getElementById('ruleSearch');
        if (ruleSearchInput) {
            ruleSearchInput.addEventListener('keyup', function() {
                const filter = this.value.toLowerCase();
                document.querySelectorAll('table tbody tr').forEach(row => {
                    const text = row.innerText.toLowerCase();
                    row.style.display = text.includes(filter) ? '' : 'none';
                });
            });
        }
    });

    setInterval(updateTraffic, 1000);
<?php endif; ?>

const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('login-password');
const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>`;
const eyeSlashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/></svg>`;

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? eyeIcon : eyeSlashIcon;
    });
}
</script>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
    <?php if ($flash_message): ?>
        // Disparar la ventana emergente solo si existe el mensaje
        Swal.fire({
            title: '<?php echo ($flash_message['status'] === 'success') ? "¡Operación Exitosa!" : "Atención"; ?>',
            text: '<?php echo addslashes($flash_message['message']); ?>',
            icon: '<?php echo ($flash_message['status'] === 'success') ? "success" : "error"; ?>',
            confirmButtonColor: '#1e40af', 
            confirmButtonText: 'Aceptar',
            timer: 4000,
            timerProgressBar: true
        });

        <?php 
            // Limpiar la sesión inmediatamente después de generar el JS del modal
            unset($_SESSION['flash_message']); 
        ?>
    <?php endif; ?>
});
</script>


</body>
</html>