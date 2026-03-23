<?php
// Es fundamental iniciar la sesión para poder manipularla.
session_start();

// Paso 1: Eliminar todas las variables de la sesión.
// Esto vacía el array $_SESSION, borrando datos como 'username', 'role', etc.
$_SESSION = array();

// Paso 2: Destruir la sesión por completo.
// Esta es la función clave que elimina el archivo de sesión del servidor.
session_destroy();

// Paso 3: Redirigir al usuario a la página de inicio de sesión.
// Después de que la sesión ha sido destruida, lo enviamos de vuelta al login.
header("location: login.php");
exit; // Es una buena práctica para asegurar que el script se detenga después de la redirección.
?>