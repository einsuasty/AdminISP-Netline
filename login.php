<?php
session_start();

// -- INICIO DE LA SECCIÓN DE CONFIGURACIÓN --
$super_admin_username = 'tu_superadmin@email.com'; // Cambia esto por tu usuario superadmin
$super_admin_password = 'tu_contraseña_superadmin'; // Cambia esto por tu contraseña
// -- FIN DE LA SECCIÓN DE CONFIGURACIÓN --

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $username_ingresado = $_POST['username'];
    $password_ingresado = $_POST['password'];
    
    // Validar si es el superadministrador fijo
    if ($username_ingresado === $super_admin_username && $password_ingresado === $super_admin_password) {
    
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $super_admin_username;
        $_SESSION['role'] = 'SuperAdmin';
        $_SESSION['allowed_modules'] = ['usuarios', 'planes', 'facturacion', 'ingresos-gastos', 'inventario', 'queues', 'monitoreo'];

        session_write_close();
        
        header("Location: Administrador.html");
        exit();
        
    } else {
        // --- Lógica para validar usuarios de la base de datos ---
        require_once 'db_connect.php';
        try {
            $stmt = $pdo->prepare("
                SELECT u.usuario_id, u.nombre, u.correo, u.rol_id, r.nombre_rol, u.password_hash
                FROM usuarios u
                JOIN roles r ON u.rol_id = r.rol_id
                WHERE u.correo = ?
            ");
            $stmt->execute([$username_ingresado]);
            $db_user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($db_user && password_verify($password_ingresado, $db_user['password_hash'])) {
                
                $_SESSION['loggedin'] = true;
                $_SESSION['user_id'] = $db_user['usuario_id'];
                $_SESSION['username'] = $db_user['nombre'];
                $_SESSION['role'] = $db_user['nombre_rol'];

                if ($db_user['nombre_rol'] === 'Usuario de Gestión' || $db_user['nombre_rol'] === 'SuperAdmin') {
                    $stmt_modules = $pdo->prepare("SELECT nombre_modulo FROM usuario_modulos WHERE usuario_id = ?");
                    $stmt_modules->execute([$db_user['usuario_id']]);
                    $_SESSION['allowed_modules'] = $stmt_modules->fetchAll(PDO::FETCH_COLUMN, 0);
                    
                    session_write_close();
                    
                    header("Location: Administrador.html");
                    exit();
                    
                } else { // Asumimos que cualquier otro rol (como 'Cliente') va al portal de pagos
                    $_SESSION['allowed_modules'] = ['pagopse'];
                    
                    session_write_close();
                    
                    header("Location: pagopse.php"); 
                    exit();
                }

            } else {
                $error_message = "Usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.";
            }
        } catch (PDOException $e) {
            error_log("Error de base de datos en login: " . $e->getMessage());
            $error_message = "Error en el servidor al intentar iniciar sesión. Inténtelo más tarde.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login Admin - NetLine</title>
    <link rel="icon" href="img/icono2.ico" type="image/x-icon">
    <link rel="stylesheet" href="css/styles.css">
    
    <style>
        /* Estilos para el fondo de partículas */
        #particles-js {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #144896ff; 
            z-index: 1; /* Fondo */
        }
        
        /* Aseguramos que el login-box esté encima del fondo */
        .login-box {
            position: relative; 
            z-index: 10; 
            background-color: rgba(255, 255, 255, 0.7) !important;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            /* **AJUSTE DE ANCHO SOLICITADO** */
            max-width: 320px; /* Aumentar el ancho del panel */
            width: 90%; /* Asegura que se vea bien en móviles */
            /* **Ajuste para centrar el formulario** */
            transform: none !important; 
        }

        /* Reducir el tamaño de la fuente de INICIE SESION (H2) */
        .login-box h2 {
            font-size: 1.8rem; /* Tamaño más pequeño */
            color: #333;
        }
        
        /* Estilos del campo de contraseña */
        .password-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
        }
        .password-wrapper input {
            padding-right: 40px;
        }
        .toggle-password {
            position: absolute;
            right: 15px;
            cursor: pointer;
            color: #6c757d;
            user-select: none;
        }
        
        /* Aseguramos que el body ocupe toda la pantalla y el contenido esté centrado */
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            overflow: hidden; 
        }
        
        /* Asegurar que el contenido del formulario tenga buen contraste */
        .login-box label, .login-box p {
            color: #333;
        }

        /* CSS para alinear los botones en la parte inferior */
        .button-group {
            display: flex;
            justify-content: space-between; 
            gap: 10px; 
            margin-top: 20px;
        }

        /* Hacer que los botones dentro de button-group ocupen el mismo ancho */
        .button-group button {
            flex-grow: 1; 
            padding: 10px;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            text-transform: uppercase;
            /* Aplicamos !important para anular estilos externos conflictivos */
            position: static !important;
            top: auto !important;
            right: auto !important;
            margin: 0 !important;
            padding: 10px !important;
        }

        /* Estilo para el botón INGRESAR (VERDE - tipo submit) */
        .button-group button[type="submit"] {
            background-color: #28a745 !important; /* VERDE */
            color: white !important;
            border: 1px solid #28a745 !important; 
            order: 2; 
        }
        
        /* Estilo para el botón REGRESAR (AMARILLO - tipo button) */
        .button-group button[type="button"] {
            background-color: #f7d24f !important; /* AMARILLO */
            color: #333 !important; /* Texto oscuro */
            border: 1px solid #f7d24f !important; 
            order: 1; 
        }
        
    </style>
</head>
<body>
    
    <div id="particles-js"></div>

    <section class="login-box">
        
        <img src="img/AdminISP.png" alt="Logo NetLine" id="logo"> 
        <h2>INICIE SESION</h2>

        <?php
        if (isset($error_message)) {
            echo '<p style="color: red; text-align: center; margin-top: 10px;">' . htmlspecialchars($error_message) . '</p>';
        }
        ?>

        <form action="login.php" method="post">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required>

            <label for="password">Contraseña:</label>
            <div class="password-wrapper">
                <input type="password" id="password" name="password" required>
                <span id="toggle-password" class="toggle-password">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
                </span>
            </div>
            
            <div class="button-group">
                <button type="submit">INGRESAR</button>
                <button type="button" id="admin-login" onclick="location.href='index.html'">REGRESAR</button>
            </div>
        </form>
    </section>

<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>

<script>
    // Inicialización de Particle.js con la configuración para el efecto de red
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80, 
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff" 
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3, 
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150, 
                "color": "#ffffff", 
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 6, 
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab" 
                },
                "onclick": {
                    "enable": true,
                    "mode": "push" 
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
    
    // Script original para alternar la visibilidad de la contraseña
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    // Definimos los dos iconos SVG como cadenas de texto
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>`;
    const eyeSlashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/></svg>`;

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            // Cambiar el tipo del input
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Cambiar el ícono SVG
            this.innerHTML = type === 'password' ? eyeIcon : eyeSlashIcon;
        });
    }
</script>

</body>
</html>