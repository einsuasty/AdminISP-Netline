<?php
// session_auth.php

// Inicia la sesión si no está ya iniciada.
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

/**
 * Función central para verificar los permisos de un usuario.
 * Esta versión es "inteligente": si los permisos no están en la sesión o están vacíos,
 * los consulta desde la base de datos.
 *
 * @param string $module_name El nombre del módulo para el que se requiere permiso.
 * @return bool Devuelve true si el usuario tiene permiso, false en caso contrario.
 */
function check_permission($module_name) {
    // 1. Si la sesión no existe o el usuario no está logueado, no hay permiso.
    if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
        return false;
    }

    // 2. El 'SuperAdmin' siempre tiene permiso para todo.
    if (isset($_SESSION['role']) && $_SESSION['role'] === 'SuperAdmin') {
        return true;
    }
    
    // 3. Si el rol no es 'Usuario de Gestión', no tiene permisos basados en módulos.
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'Usuario de Gestión') {
        return false;
    }

    // 4. VERIFICACIÓN INTELIGENTE DE PERMISOS PARA 'Usuario de Gestión'
    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE! ---
    // Usamos !empty() en lugar de isset(). Esto ignora los arreglos vacíos [].
    if (!empty($_SESSION['allowed_modules'])) {
        return in_array($module_name, $_SESSION['allowed_modules']);
    }

    // 5. SI LOS PERMISOS NO ESTÁN EN LA SESIÓN (O ESTÁN VACÍOS), los consultamos en la BD.
    if (isset($_SESSION['user_id'])) {
        
        require 'db_connect.php'; 

        try {
            $stmt = $pdo->prepare("SELECT nombre_modulo FROM usuario_modulos WHERE usuario_id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $allowed_modules = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

            // Guardamos los permisos en la sesión para no tener que consultar la BD en cada petición.
            $_SESSION['allowed_modules'] = $allowed_modules;

            // Ahora sí, verificamos el permiso con los datos recién obtenidos de la BD.
            return in_array($module_name, $allowed_modules);

        } catch (PDOException $e) {
            error_log("Error al consultar permisos en session_auth.php: " . $e->getMessage());
            return false; // Por seguridad, si hay un error en la BD, no damos permiso.
        }
    }
    
    // 6. Si no se cumple ninguna de las condiciones anteriores, no hay permiso.
    return false;
}
// NO HAY ETIQUETA DE CIERRE PHP para evitar espacios en blanco inesperados al final.