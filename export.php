<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - NetLine</title>
    <link rel="icon" href="img/icono2.ico" type="image/x-icon">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/Styles_panel.css"> 
</head>
<body class="flex h-screen overflow-hidden">

    <aside class="w-64 bg-gradient-to-br from-blue-700 to-blue-900 text-white flex flex-col shadow-lg">
        <div class="p-6 text-center border-b border-blue-800">
            <img src="img/AdminISP.png" alt="Logo NetLine" id="logo">
        </div>
        <nav class="flex-1 px-4 py-6 space-y-2">
            <a href="#" class="sidebar-link active block py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200" data-module="usuarios">
                Módulo de Usuarios
            </a>
            <a href="#" class="sidebar-link block py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200" data-module="planes">
                Módulo de Planes
            </a>
            <a href="#" class="sidebar-link block py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200" data-module="facturacion">
                Módulo de Facturación
            </a>
            <a href="#" class="sidebar-link block py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200" data-module="ingresos-gastos">
                Módulo de Ingresos y Gastos
            </a>
            <a href="#" class="sidebar-link block py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200" data-module="inventario">
                Módulo de Inventario
            </a>
            <a href="mikrotik-queues/queues.php" class="sidebar-link external-link block py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200" data-module="queues">
                Módulo de Queues
            </a>
            <a href="monitor.php" class="sidebar-link external-link block py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200" data-module="monitoreo">
                Módulo de Monitoreo
            </a>
            </nav>
        <div class="p-4 border-t border-blue-800">
            <button onclick="window.location.href='logout.php'" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">
             Cerrar Sesión
            </button>
        </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
        <header class="bg-white shadow-md p-4 flex justify-between items-center z-10">
            <h1 class="text-2xl font-semibold text-gray-800">Panel de Administración</h1>
            <div class="flex items-center space-x-4">
                <span class="text-gray-700 font-medium" id="welcomeMessage">Bienvenido, Admin</span>
                <div class="relative">
                    <button id="userMenuButton">
                        <img src="https://placehold.co/40x40/cccccc/ffffff?text=U" alt="User Avatar" class="rounded-full border-2 border-blue-500 cursor-pointer">
                    </button>
                    <div id="userMenuDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                        <a href="#" id="openChangePasswordModalBtn" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cambiar Contraseña</a>
                    </div>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6 bg-gray-100">

            
            <section id="usuarios-module" class="module-content active bg-white p-8 rounded-lg shadow-md mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold text-gray-800">Gestión de Usuarios y Clientes</h2>
                    <div class="flex items-center space-x-2">
                        <input type="text" id="userSearchInput" placeholder="Buscar por ID o Nombre" class="mt-1 block w-64 border border-gray-300 rounded-md shadow-sm p-2">
                        <button id="searchUserBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">
                            Buscar
                        </button>
                        <button id="clearUserSearchBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">
                            Limpiar
                        </button>
                        
                        
                    </div>
                    <button id="addUserBtn" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-200">
                        + Agregar Usuario
                    </button>
                </div>
                
                <div id="userFormContainer" class="hidden bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                    <h3 class="text-xl font-semibold mb-4" id="userFormTitle">Agregar Nuevo Usuario</h3>
                    <form id="userForm" class="space-y-4">
                        <div>
                            <label for="userRoleSelect" class="block text-sm font-medium text-gray-700">Rol:</label>
                            <select id="userRoleSelect" name="rol_id" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                                <option value="">Seleccione un rol</option>
                            </select>
                        </div>
                        <div>
                            <label for="userId" class="block text-sm font-medium text-gray-700">ID de Usuario :</label>
                            <input type="text" id="userId" name="usuario_id" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Ingresa tu numero de Idenficacion">
                        </div>
                        <input type="hidden" id="originalUserId">
                        <div>
                            <label for="userName" class="block text-sm font-medium text-gray-700">Nombre:</label>
                            <input type="text" id="userName" name="nombre" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                        </div>
                        <div>
                            <label for="userEmail" class="block text-sm font-medium text-gray-700">Correo:</label>
                            <input type="email" id="userEmail" name="correo" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                        </div>
                        <div>
                            <label for="userPhone" class="block text-sm font-medium text-gray-700">Número de Celular:</label>
                            <input type="tel" id="userPhone" name="celular" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Ej: 3001234567">
                        </div>
                        <div>
                            <label for="userAddress" class="block text-sm font-medium text-gray-700">Dirección:</label>
                            <input type="text" id="userAddress" name="direccion" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Ej: Calle 1 # 2-34">
                        </div>
                        <div id="passwordFields">
                            <div>
                                <label for="userPassword" class="block text-sm font-medium text-gray-700">Contraseña:</label>
                                <input type="password" id="userPassword" name="new_password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Ingresa una nueva contraseña" minlength="6">
                            </div>
                            <div>
                                <label for="userConfirmPassword" class="block text-sm font-medium text-gray-700">Confirmar Contraseña:</label>
                                <input type="password" id="userConfirmPassword" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Confirma la nueva contraseña" minlength="6">
                            </div>
                        </div>
                        <div id="modulePermissionsSection" class="hidden border-t pt-4 mt-4 border-gray-200">
                            <h4 class="text-lg font-semibold mb-3">Permisos de Módulos:</h4>
                            <div id="moduleCheckboxes" class="grid grid-cols-2 gap-2">
                            </div>
                        </div>
                        <div id="manageUserPlansSection" class="hidden border-t pt-4 mt-4 border-gray-200">
                            <h4 class="text-lg font-semibold mb-3">Planes Asignados</h4>
                            <div id="assignedPlansList" class="space-y-2 mb-4">
                                <p class="text-gray-500">No hay planes asignados.</p>
                            </div>
                            <div class="flex items-end space-x-2">
                                <div class="flex-1">
                                    <label for="assignPlanSelect" class="block text-sm font-medium text-gray-700">Asignar Nuevo Plan:</label>
                                    <select id="assignPlanSelect" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                        <option value="">Seleccione un plan</option>
                                    </select>
                                </div>
                                <button type="button" id="assignPlanBtn" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Asignar</button>
                            </div>
                        </div>
                        <div class="flex space-x-4">
                            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Guardar Usuario</button>
                            <button type="button" id="cancelUserBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Cancelar</button>
                        </div>
                    </form>
                </div>
                
                <div class="mt-8">
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Usuarios de Gestión</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celular</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permisos de Módulos</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="gestionUsersTableBody" class="divide-y divide-gray-200">
                                </tbody>
                        </table>
                    </div>
                </div>

                <div class="mt-8">
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Clientes</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celular</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Principal Asignado</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="clientesTableBody" class="divide-y divide-gray-200">
                                </tbody>
                        </table>
                    </div>
                </div>
            </section>


            <section id="planes-module" class="module-content bg-white p-8 rounded-lg shadow-md mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold text-gray-800">Gestión de Planes</h2>
                    <div class="flex items-center space-x-2">
                        
                        
                        <button id="addPlanBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-200">
                            + Agregar Plan
                        </button>
                    </div>
                </div>
                <div id="planFormContainer" class="hidden bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                    <h3 class="text-xl font-semibold mb-4" id="planFormTitle">Agregar Nuevo Plan</h3>
                    <form id="planForm" class="space-y-4">
                        <input type="hidden" id="planId">
                        <div>
                            <label for="planName" class="block text-sm font-medium text-gray-700">Nombre del Plan:</label>
                            <input type="text" id="planName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                        </div>
                        <div>
                            <label for="planSpeed" class="block text-sm font-medium text-gray-700">Velocidad:</label>
                            <input type="text" id="planSpeed" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                        </div>
                        <div>
                            <label for="planPrice" class="block text-sm font-medium text-gray-700">Valor:</label>
                            <input type="number" step="0.01" id="planPrice" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                        </div>
                        <div class="flex space-x-4">
                            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Guardar Plan</button>
                            <button type="button" id="cancelPlanBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Cancelar</button>
                        </div>
                    </form>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Plan</th>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Velocidad</th>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="plansTableBody" class="divide-y divide-gray-200">
                        </tbody>
                    </table>
                </div>
            </section>
            <section id="facturacion-module" class="module-content bg-white p-8 rounded-lg shadow-md mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold text-gray-800">Generar Factura</h2>
                    <div class="flex items-center space-x-2">
                        
                        
                        <button type="button" id="generateBulkInvoicesBtn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-200">
                            Generar Facturas Masivas
                        </button>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Resumen de Facturas</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                            <p class="text-lg font-semibold text-gray-700">Facturas Pagadas:</p>
                            <p class="text-2xl font-bold text-green-600" id="paidInvoicesCount">0</p>
                            <p class="text-lg text-gray-600">Suma Total: <span class="font-bold" id="paidInvoicesSum">$0.00</span></p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
                            <p class="text-lg font-semibold text-gray-700">Facturas Pendientes:</p>
                            <p class="text-2xl font-bold text-yellow-600" id="pendingInvoicesCount">0</p>
                            <p class="text-lg text-gray-600">Suma Total: <span class="font-bold" id="pendingInvoicesSum">$0.00</span></p>
                        </div>
                    </div>
                    <div class="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                        <h3 class="text-xl font-semibold mb-4">Generar Factura Individual</h3>
                        <form id="facturacionForm" class="space-y-4">
                            <div>
                                <label for="facturaUserId" class="block text-sm font-medium text-gray-700">ID del Usuario:</label>
                                <div class="flex">
                                    <input type="text" id="facturaUserId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 mr-2" placeholder="Ingrese ID del usuario" required>
                                    <button type="button" id="buscarUsuarioBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Buscar Usuario</button>
                                </div>
                            </div>
                            <div id="userInfoDisplay" class="hidden grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Nombre del Cliente:</label>
                                    <p id="facturaClientName" class="mt-1 p-2 bg-gray-100 border border-gray-300 rounded-md"></p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Correo del Cliente:</label>
                                    <p id="facturaClientEmail" class="mt-1 p-2 bg-gray-100 border border-gray-300 rounded-md"></p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Planes Asignados:</label>
                                    <p id="facturaClientAssignedPlans" class="mt-1 p-2 bg-gray-100 border border-gray-300 rounded-md"></p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Precio de Plan Principal:</label>
                                    <p id="facturaClientPlanPrice" class="mt-1 p-2 bg-gray-100 border border-gray-300 rounded-md"></p>
                                </div>
                            </div>
                            <div id="planSelectionContainer" class="hidden">
                                <div>
                                    <label for="facturaPlanSelect" class="block text-sm font-medium text-gray-700">Seleccionar Plan para Facturar:</label>
                                    <select id="facturaPlanSelect" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                        <option value="">Seleccione un plan</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="facturaMonto" class="block text-sm font-medium text-gray-700">Monto a Facturar:</label>
                                    <input type="number" step="0.01" id="facturaMonto" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                                </div>
                            </div>
                            <div class="flex space-x-4">
                                <button type="submit" id="generarFacturaBtn" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 hidden">Generar Factura</button>
                                <button type="button" id="cancelarFacturaBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Cancelar</button>
                            </div>
                        </form>
                    </div>

                    <div class="flex justify-between items-center mb-4 mt-6">
                        <h3 class="text-2xl font-bold text-gray-800">Detalle de Facturas</h3>
                        <div class="flex items-center space-x-2">
                            <input type="text" id="invoiceDetailSearchIdInput" placeholder="ID Factura/Usuario" class="mt-1 block w-40 border border-gray-300 rounded-md shadow-sm p-2 text-sm">
                            <input type="date" id="invoiceDetailStartDateInput" class="mt-1 block w-40 border border-gray-300 rounded-md shadow-sm p-2 text-sm">
                            <input type="date" id="invoiceDetailEndDateInput" class="mt-1 block w-40 border border-gray-300 rounded-md shadow-sm p-2 text-sm">
                            <button id="searchInvoiceDetailsBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 text-sm">
                                Filtrar
                            </button>
                            <button id="clearInvoiceDetailsSearchBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 text-sm">
                                Limpiar
                            </button>
                        </div>
                    </div>

                    <div class="overflow-x-auto mt-6">
                        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Factura</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Usuario</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="facturasTableBody" class="divide-y divide-gray-200">
                                <tr><td colspan="8" class="py-4 px-6 text-center text-gray-500">Cargando facturas...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="statusModal" class="modal-overlay hidden">
                    <div class="modal-content">
                        <h3 class="text-xl font-semibold mb-4">Cambiar Estado de Factura</h3>
                        <input type="hidden" id="modalFacturaId">
                        <div class="mb-4">
                            <label for="modalCurrentStatusDisplay" class="block text-sm font-medium text-gray-700">Estado Actual:</label>
                            <p id="modalCurrentStatusDisplay" class="mt-1 p-2 bg-gray-100 border border-gray-300 rounded-md"></p>
                        </div>
                        <div class="mb-4">
                            <label for="modalNewStatus" class="block text-sm font-medium text-gray-700">Nuevo Estado:</label>
                            <select id="modalNewStatus" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option value="Pendiente">Pendiente</option>
                                <option value="Pagada">Pagada</option>
                                <option value="Anulada">Anulada</option>
                            </select>
                        </div>
                        <div class="flex justify-end space-x-4">
                            <button type="button" id="saveStatusBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Guardar</button>
                            <button type="button" id="cancelStatusBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Cancelar</button>
                        </div>
                    </div>
                </div>
            </section>
            <section id="ingresos-gastos-module" class="module-content bg-white p-8 rounded-lg shadow-md mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold text-gray-800">Gestión de Ingresos y Gastos</h2>
                    <div class="flex items-center space-x-2">
                        
                        
                    </div>
                </div>

                <div class="mb-8">
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Estado de Resultados (Ingresos - Gastos)</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                            <p class="text-lg font-semibold text-gray-700">Ingresos Totales:</p>
                            <p class="text-2xl font-bold text-green-600" id="totalIncome">$0.00</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
                            <p class="text-lg font-semibold text-gray-700">Gastos Totales:</p>
                            <p class="text-2xl font-bold text-red-600" id="totalExpenses">$0.00</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                            <p class="text-lg font-semibold text-gray-700">Ganancia/Pérdida:</p>
                            <p class="text-2xl font-bold text-blue-600" id="profitLoss">$0.00</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label for="profitLossStartDate" class="text-sm font-medium text-gray-700">Desde:</label>
                        <input type="date" id="profitLossStartDate" class="mt-1 block border border-gray-300 rounded-md shadow-sm p-2 text-sm">
                        <label for="profitLossEndDate" class="text-sm font-medium text-gray-700">Hasta:</label>
                        <input type="date" id="profitLossEndDate" class="mt-1 block border border-gray-300 rounded-md shadow-sm p-2 text-sm">
                        <button id="filterProfitLossBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 text-sm">
                            Filtrar
                        </button>
                        <button id="clearProfitLossFilterBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 text-sm">
                            Limpiar
                        </button>
                    </div>
                </div>

                <div class="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-semibold">Gestión de Gastos</h3>
                        <button id="addExpenseBtn" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">
                            + Añadir Gasto
                        </button>
                    </div>
                    <div id="expenseFormContainer" class="hidden bg-white p-6 rounded-lg shadow-md mb-6">
                        <h4 class="text-lg font-semibold mb-4" id="expenseFormTitle">Añadir Nuevo Gasto</h4>
                        <form id="expenseForm" class="space-y-4">
                            <input type="hidden" id="expenseId">
                            <div>
                                <label for="expenseCategory" class="block text-sm font-medium text-gray-700">Categoría:</label>
                                <select id="expenseCategory" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                                    <option value="">Seleccione o añada una categoría</option>
                                </select>
                            </div>
                            <div class="flex items-end space-x-2">
                                <input type="text" id="newCategoryInput" placeholder="Nueva Categoría" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 hidden">
                                <button type="button" id="addCategoryBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 hidden">Añadir Categoría</button>
                                <button type="button" id="cancelAddCategoryBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 hidden">Cancelar</button>
                            </div>
                            <div>
                                <label for="expenseDescription" class="block text-sm font-medium text-gray-700">Descripción:</label>
                                <input type="text" id="expenseDescription" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                            </div>
                            <div>
                                <label for="expenseAmount" class="block text-sm font-medium text-gray-700">Monto:</label>
                                <input type="number" step="0.01" id="expenseAmount" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                            </div>
                            <div>
                                <label for="expenseDate" class="block text-sm font-medium text-gray-700">Fecha:</label>
                                <input type="date" id="expenseDate" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                            </div>
                            <div class="flex space-x-4">
                                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Guardar Gasto</button>
                                <button type="button" id="cancelExpenseBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Cancelar</button>
                            </div>
                        </form>
                    </div>

                    <div class="overflow-x-auto mt-6">
                        <h4 class="text-lg font-semibold mb-3">Detalle de Gastos</h4>
                        <div class="flex items-center space-x-2 mb-4">
                            <label for="expenseStartDateFilter" class="text-sm font-medium text-gray-700">Desde:</label>
                            <input type="date" id="expenseStartDateFilter" class="mt-1 block border border-gray-300 rounded-md shadow-sm p-2 text-sm">
                            <label for="expenseEndDateFilter" class="text-sm font-medium text-gray-700">Hasta:</label>
                            <input type="date" id="expenseEndDateFilter" class="mt-1 block border border-gray-300 rounded-md shadow-sm p-2 text-sm">
                            <button id="filterExpensesBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 text-sm">
                                Filtrar Gastos
                            </button>
                            <button id="clearExpensesFilterBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 text-sm">
                                Limpiar Filtro
                            </button>
                        </div>
                        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="expensesTableBody" class="divide-y divide-gray-200">
                                <tr><td colspan="6" class="py-4 px-6 text-center text-gray-500">No hay gastos registrados.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <section id="inventario-module" class="module-content bg-white p-8 rounded-lg shadow-md mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold text-gray-800">Inventario de Activos</h2>
                    <div class="flex items-center space-x-2">
                        
                        
                        <button id="addAssetBtn" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-200">
                            + Agregar Activo
                        </button>
                    </div>
                </div>

                <div class="flex items-center space-x-2 mb-6">
                    <input type="text" id="assetSearchInput" placeholder="Buscar por Nombre, ID o Propietario" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <button id="searchAssetBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">
                        Buscar
                    </button>
                    <button id="clearAssetSearchBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">
                        Limpiar
                    </button>
                </div>

                <div id="assetFormContainer" class="hidden bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                    <h3 class="text-xl font-semibold mb-4" id="assetFormTitle">Agregar Nuevo Activo</h3>
                    <form id="assetForm" class="space-y-4">
                        <input type="hidden" id="assetId">
                        <div>
                            <label for="assetNameSelect" class="block text-sm font-medium text-gray-700">Nombre del Activo:</label>
                            <select id="assetNameSelect" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                                <option value="">Seleccione o añada un tipo de activo</option>
                                <option value="Router">Router</option>
                                <option value="Antena">Antena</option>
                                <option value="Switch">Switch</option>
                                <option value="Servidor">Servidor</option>
                                <option value="Cable">Cable</option>
                                <option value="Otros">Otros</option>
                                <option value="new-asset-name">-- Nuevo Nombre de Activo --</option>
                            </select>
                        </div>
                        <div id="newAssetNameContainer" class="hidden">
                            <label for="newAssetNameInput" class="block text-sm font-medium text-gray-700">Nuevo Nombre de Activo:</label>
                            <input type="text" id="newAssetNameInput" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        </div>
                        
                        <div>
                            <label for="assetOwnerType" class="block text-sm font-medium text-gray-700">Tipo de Propietario:</label>
                            <select id="assetOwnerType" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                                <option value="">Seleccione</option>
                                <option value="usuario">Usuario</option>
                                <option value="empresa">Empresa (Interno)</option>
                            </select>
                        </div>
                        <div id="assetUserSelectContainer" class="hidden">
                            <label for="assetUserSelect" class="block text-sm font-medium text-gray-700">Seleccione Usuario:</label>
                            <select id="assetUserSelect" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option value="">Cargando usuarios...</option>
                            </select>
                        </div>
                        
                        <div>
                            <label for="assetIpAddress" class="block text-sm font-medium text-gray-700">IP del Activo:</label>
                            <input type="text" id="assetIpAddress" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Ej: 192.168.1.1">
                        </div>

                        <div>
                            <label for="assetSerialNumberMac" class="block text-sm font-medium text-gray-700">Serial o MAC:</label>
                            <input type="text" id="assetSerialNumberMac" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Ej: AA:BB:CC:DD:EE:FF o Serial123">
                        </div>

                        <div class="flex space-x-4">
                            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Guardar Activo</button>
                            <button type="button" id="cancelAssetBtn" class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">Cancelar</button>
                        </div>
                    </form>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Activo</th>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Activo</th>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Propietario</th>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propietario (ID/Nombre)</th>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial/MAC</th>
                                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="assetsTableBody" class="divide-y divide-gray-200">
                            <tr><td colspan="7" class="py-4 px-6 text-center text-gray-500">Cargando activos...</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
    <script src="js/Script_panel.js"></script>
</body>
</html>