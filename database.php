<?php
// database.php

// Incluye el archivo de configuración
require_once 'config.php';

class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    public $conn;

    /**
     * Obtiene la conexión a la base de datos.
     * @return PDO|null
     */
    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8mb4");
            // Configurar el modo de error para que lance excepciones
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            // Manejo de errores de conexión
            error_log("Error de conexión a la base de datos: " . $exception->getMessage());
            // En un entorno de producción, puedes mostrar un mensaje genérico
            // echo "Error de conexión: " . $exception->getMessage();
            exit(); 
        }
        return $this->conn;
    }
}
?>