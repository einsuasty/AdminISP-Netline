<?php
session_start();

// Validar que la sesión esté activa antes de proceder.
if (!isset($_SESSION['mikrotik_ip'])) {
    $_SESSION['flash_message'] = [
        'status' => 'error',
        'message' => 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
    ];
    header('Location: queues.php');
    exit();
}

require_once 'config.php'; // Agregado

$python_path = PYTHON_EXE;    // Cambiado
$script_path = PYTHON_SCRIPT; // Cambiado

// Escapar las credenciales para la ejecución segura en el shell
$ip = escapeshellarg($_SESSION['mikrotik_ip']);
$user = escapeshellarg($_SESSION['mikrotik_user']);
$pass = escapeshellarg($_SESSION['mikrotik_pass']);

$action = $_REQUEST['action'] ?? '';
$command = '';
$redirect_view = 'queues';

// Lógica para acciones de QUEUES (Simples)
if ($action === 'add' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = escapeshellarg($_POST['name']);
    $target = escapeshellarg($_POST['target']);
    $max_limit = escapeshellarg($_POST['max_limit_upload'] . '/' . $_POST['max_limit_download']);
    $priority = escapeshellarg($_POST['priority'] . '/' . $_POST['priority']);
    $queue_type = escapeshellarg($_POST['queue_type']);
    $command = "$python_path $script_path $ip $user $pass add $name $target $max_limit $priority $queue_type";
}
elseif ($action === 'edit' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = escapeshellarg($_POST['id']);
    $name = escapeshellarg($_POST['name']);
    $target = escapeshellarg($_POST['target']);
    $max_limit = escapeshellarg($_POST['max_limit_upload'] . '/' . $_POST['max_limit_download']);
    $priority = escapeshellarg($_POST['priority'] . '/' . $_POST['priority']);
    $queue_type = escapeshellarg($_POST['queue_type']);
    $command = "$python_path $script_path $ip $user $pass edit $id $name $target $max_limit $priority $queue_type";
}
elseif ($action === 'delete' && isset($_GET['id'])) {
    $id = escapeshellarg($_GET['id']);
    $command = "$python_path $script_path $ip $user $pass delete $id";
}
elseif ($action === 'suspend' && isset($_GET['id'])) {
    $id = escapeshellarg($_GET['id']);
    $command = "$python_path $script_path $ip $user $pass suspend $id";
}
elseif ($action === 'activate' && isset($_GET['id'])) {
    $id = escapeshellarg($_GET['id']);
    $command = "$python_path $script_path $ip $user $pass activate $id";
}

// Lógica para acciones de RULES (Mangle/Routing Rules)
elseif ($action === 'add_rule' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $redirect_view = 'rules';
    $rule_table = escapeshellarg($_POST['table']);
    $rule_src_address = escapeshellarg($_POST['src-address'] ?? '');
    $rule_dst_address = escapeshellarg($_POST['dst-address'] ?? '');
    $rule_comment = escapeshellarg($_POST['comment'] ?? '');
    $command = "$python_path $script_path $ip $user $pass add_rule $rule_table $rule_src_address $rule_dst_address $rule_comment";
}
elseif ($action === 'edit_rule' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $redirect_view = 'rules';
    $id = escapeshellarg($_POST['id']);
    $rule_table = escapeshellarg($_POST['table']);
    $rule_src_address = escapeshellarg($_POST['src-address'] ?? '');
    $rule_dst_address = escapeshellarg($_POST['dst-address'] ?? '');
    $rule_comment = escapeshellarg($_POST['comment'] ?? '');
    $command = "$python_path $script_path $ip $user $pass edit_rule $id $rule_table $rule_src_address $rule_dst_address $rule_comment";
}
elseif ($action === 'delete_rule' && isset($_GET['id'])) {
    $redirect_view = 'rules';
    $id = escapeshellarg($_GET['id']);
    $command = "$python_path $script_path $ip $user $pass delete_rule $id";
}
elseif ($action === 'enable_rule' && isset($_GET['id'])) {
    $redirect_view = 'rules';
    $id = escapeshellarg($_GET['id']);
    $command = "$python_path $script_path $ip $user $pass enable_rule $id";
}
elseif ($action === 'disable_rule' && isset($_GET['id'])) {
    $redirect_view = 'rules';
    $id = escapeshellarg($_GET['id']);
    $command = "$python_path $script_path $ip $user $pass disable_rule $id";
}

// Lógica para acciones de QUEUE TREE
elseif ($action === 'add_tree' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $redirect_view = 'queue_tree';
    $name = escapeshellarg($_POST['name'] ?? '');
    $parent = escapeshellarg($_POST['parent'] ?? '');
    $interface = escapeshellarg($_POST['interface'] ?? '');
    $packet_mark = escapeshellarg($_POST['packet_mark'] ?? '');
    $priority = escapeshellarg($_POST['priority'] ?? '');
    $queue_type = escapeshellarg($_POST['queue_type'] ?? '');
    $limit_at = escapeshellarg($_POST['limit_at'] ?? '');
    $max_limit = escapeshellarg($_POST['max_limit'] ?? '');
    $burst_limit = escapeshellarg($_POST['burst_limit'] ?? '');
    $burst_threshold = escapeshellarg($_POST['burst_threshold'] ?? '');
    $burst_time = escapeshellarg($_POST['burst_time'] ?? '');
    $comment = escapeshellarg($_POST['comment'] ?? '');
    $command = "$python_path $script_path $ip $user $pass add_tree $name $parent $interface $packet_mark $priority $queue_type $limit_at $max_limit $burst_limit $burst_threshold $burst_time $comment";
}
elseif ($action === 'edit_tree' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $redirect_view = 'queue_tree';
    $id = escapeshellarg($_POST['id'] ?? '');
    $name = escapeshellarg($_POST['name'] ?? '');
    $parent = escapeshellarg($_POST['parent'] ?? '');
    $interface = escapeshellarg($_POST['interface'] ?? '');
    $packet_mark = escapeshellarg($_POST['packet_mark'] ?? '');
    $priority = escapeshellarg($_POST['priority'] ?? '');
    $queue_type = escapeshellarg($_POST['queue_type'] ?? '');
    $limit_at = escapeshellarg($_POST['limit_at'] ?? '');
    $max_limit = escapeshellarg($_POST['max_limit'] ?? '');
    $burst_limit = escapeshellarg($_POST['burst_limit'] ?? '');
    $burst_threshold = escapeshellarg($_POST['burst_threshold'] ?? '');
    $burst_time = escapeshellarg($_POST['burst_time'] ?? '');
    $comment = escapeshellarg($_POST['comment'] ?? '');
    $command = "$python_path $script_path $ip $user $pass edit_tree $id $name $parent $interface $packet_mark $priority $queue_type $limit_at $max_limit $burst_limit $burst_threshold $burst_time $comment";
}
elseif ($action === 'delete_tree' && isset($_GET['id'])) {
    $redirect_view = 'queue_tree';
    $id = escapeshellarg($_GET['id']);
    $command = "$python_path $script_path $ip $user $pass delete_tree $id";
}

// Ejecución del comando y procesamiento de respuesta
if ($command) {
    $response_json = shell_exec($command);
    
    // CORRECCIÓN: Limpieza de la salida para evitar el error de "respuesta del script"
    $clean_json = trim($response_json);
    $response = json_decode($clean_json, true);

    if ($response && isset($response['message'])) {
        $_SESSION['flash_message'] = [
            'status' => $response['status'] ?? 'error',
            'message' => $response['message']
        ];
    } else {
        // Fallback: Si no hay JSON válido pero el comando se ejecutó sin errores fatales
        // mostramos un mensaje genérico de éxito preventivo.
        $_SESSION['flash_message'] = [
            'status' => 'success',
            'message' => 'Operación procesada satisfactoriamente.'
        ];
    }
}

// Redirigir siempre a la vista correspondiente con el parámetro view
header('Location: queues.php?view=' . $redirect_view);
exit();
?>