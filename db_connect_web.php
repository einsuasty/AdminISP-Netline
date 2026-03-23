<?php
// db_connect.php

// **MUY IMPORTANTE:** En un entorno de producción, DEBERÍAS RESTRINGIR Access-Control-Allow-Origin
// a tu dominio específico (ej. "https://tupaneladmin.com").
// El "*" es solo para facilitar el desarrollo local.
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Maneja las solicitudes OPTIONS (pre-vuelo CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// --- Configuración para tu hosting cPanel ---
$host = 'localhost';                 // IP pública de tu servidor
$db   = 'ynetliny3_netlinecolombiaisp'; // Nombre completo de la base de datos
$user = 'ynetliny3_einsuasty';        // Usuario completo de la base de datos
$pass = 'NetLine15*'; // <-- ¡IMPORTANTE! Reemplaza esto
$charset = 'utf8mb4';
// Data Source Name (DSN)
$dsn = "mysql:host=$host;port=3306;dbname=$db;charset=$charset";

// Opciones de PDO para seguridad y manejo de errores
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lanza excepciones en caso de errores
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,     // Devuelve los resultados como arrays asociativos
    PDO::ATTR_EMULATE_PREPARES   => false,                // Usa consultas preparadas reales para mayor seguridad
];

try {
    // Intenta crear la conexión
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Si la conexión falla, registra el error real en el servidor
    error_log("Error de conexión a la base de datos: " . $e->getMessage());
    
    // Y devuelve un mensaje de error genérico al usuario
    http_response_code(500); 
    echo json_encode(['error' => 'No se pudo conectar a la base de datos. Por favor, inténtelo de nuevo más tarde.']);
    exit(); 
}

// No se necesita etiqueta de cierre de PHP si el archivo solo contiene código PHP.