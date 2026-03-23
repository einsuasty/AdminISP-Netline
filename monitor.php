<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mapa de Red</title>
    <link rel="icon" href="img/icono2.ico" type="image/x-icon">
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    
    <style>
        /* --- ESTILOS GENERALES Y DE PÁGINA --- */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            height: 100vh;
            margin: 0;
            background: #f0f2f5;
            overflow: hidden; 
        }
        #network-map {
            width: 100%;
            height: 100%;
            background-color: #e9ebee;
            position: absolute;
            top: 0;
            left: 0;
        }

        /* --- PANELES Y CONTENEDORES DE UI --- */
        .panel {
            position: fixed;
            right: 0;
            top: 0;
            width: 25%;
            min-width: 380px;
            max-width: 420px;
            height: 100%;
            padding: 20px;
            background: #fff;
            overflow-y: auto; 
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
            transform: translateX(100%); 
            transition: transform 0.4s ease-in-out;
            z-index: 200;
        }
        .panel.visible {
            transform: translateX(0);
        }
        #top-left-container {
            position: absolute;
            top: 15px;
            left: 15px;
            z-index: 100;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        #bottom-left-container {
            position: absolute;
            bottom: 15px;
            left: 15px;
            z-index: 100;
            max-width: 250px; 
        }
        
        /* ESTILOS DE LOS ÍCONOS EN LA LEYENDA (Convenciones) */
        .icono-ejemplo {
            display: inline-block;
            width: 32px; 
            height: 32px;
        }
        .icono-ejemplo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .estado-indicador {
            display: inline-block;
            width: 12px; 
            height: 12px;
            border-radius: 50%;
            border: 1px solid #374151;
            box-shadow: 0 0 3px rgba(0,0,0,0.3);
            margin-right: 5px;
        }

        .logo-image {
            height: 120px;
        }

        /* --- ESTILOS DE BOTONES GENERALES --- */
        .map-button {
            z-index: 100;
            background-color: #fff;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 50%; 
            width: 45px;
            height: 45px;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            text-decoration: none;
            transition: background-color 0.2s, box-shadow 0.2s;
        }
        .map-button.disabled {
            pointer-events: none; 
            opacity: 0.5; 
            cursor: not-allowed;
        }
        .map-button:hover {
            background-color: #f5f5f5;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        #open-panel-btn {
            position: absolute;
            top: 15px;
            right: 15px;
        }
        .panel-close-btn {
            position: absolute;
            top: 10px;
            right: 20px;
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #aaa;
            transition: color 0.2s;
        }
        .panel-close-btn:hover {
            color: #333;
        }
        #toggleMonitorBtn {
            position: absolute;
            top: 15px;
            right: 70px; 
            width: auto;
            border-radius: 4px;
            font-size: 14px;
            padding: 10px 15px;
            background-color: #1d0ea8ff;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 100;
        }
        #toggleMonitorBtn:hover {
            background-color: #0056b3;
        }
        
        /* --- ESTILOS DE BOTONES CON ICONOS (AJUSTE CLAVE DE ESPACIO) --- */
        .device-actions button {
            margin-left: 5px; 
            border: none;
            padding: 8px; 
            cursor: pointer;
            border-radius: 4px;
            transition: opacity 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 35px; 
            height: 35px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .device-actions button:first-child {
            margin-left: 0; 
        }
        .device-actions button svg {
            width: 16px;
            height: 16px;
            fill: white; 
        }
        .edit-btn {
            background-color: #ffc107; 
        }
        .edit-btn svg {
            fill: black; 
        }
        .delete-btn {
            background-color: #dc3545; 
        }

        /* Contenedor con scroll limitado para la lista de dispositivos (Admin Panel) */
        #manage-devices-buttons {
            max-height: 300px; /* Limita la altura a ~5-6 botones */
            overflow-y: auto; /* Habilita el scroll vertical */
            padding-right: 5px; 
        }
        
        /* Contenedor con scroll limitado para la Leyenda (Convenciones) */
        #legend-list {
            max-height: 400px; 
            overflow-y: auto; /* Mantiene la funcionalidad de scroll */
            padding: 0; 
            padding-right: 5px;
            
            /* OCULTAR BARRA DE SCROLL (CORRECCIÓN CLAVE) */
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        
        /* Regla específica para WebKit (Chrome, Safari, Edge) */
        #legend-list::-webkit-scrollbar {
            display: none;
        }

        .manage-buttons button {
            width: 100%;
            padding: 8px 12px; 
            margin-bottom: 5px; 
            background-color: #f7f7f7; 
            color: #333; 
            border: 1px solid #ddd;
            cursor: pointer;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 500;
            text-align: left; 
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: space-between; 
            overflow: hidden; 
        }
        .manage-buttons button:hover {
            background-color: #eee;
        }
        /* Estilo para el SVG/IMG inyectado dentro de los botones de administración */
        .manage-buttons button img {
            margin-right: 8px;
            width: 20px;
            height: 20px;
            vertical-align: middle;
            flex-shrink: 0; 
        }
        /* Estilo para el texto del dispositivo (ocupa el espacio restante) */
        .manage-buttons button span.device-text {
            font-weight: bold;
            display: flex;
            align-items: center;
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis;
            flex-grow: 1;
        }

        /* --- ESTILOS DEL COLOR PICKER (Ajustado para ser más compacto) --- */
        .color-picker-wrapper {
            position: relative;
            display: inline-block;
            width: 24px;  
            height: 24px; 
            border: 2px solid #333;
            border-radius: 50%;
            cursor: pointer;
            transition: box-shadow 0.2s;
            margin-left: 10px;
            overflow: hidden; 
            flex-shrink: 0; 
        }
        .color-picker-wrapper:hover {
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        .color-picker-wrapper input[type="color"] {
            position: absolute;
            top: 0;
            left: 0;
            width: 200%; 
            height: 200%;
            opacity: 0; 
            cursor: pointer;
            transform: translate(-25%, -25%); 
        }
        .color-picker-indicator {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 50%;
            border: none;
            box-sizing: border-box;
        }

        /* --- ESTILOS PARA FORMULARIOS Y TÍTULOS --- */
        .panel h2 {
            margin-top: 0;
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        form div {
            margin-bottom: 15px;
        }
        form label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
            font-size: 14px;
        }
        
       /* ESTILO CLAVE AGREGADO: Hace que los campos de filtro sean de ancho completo Y con la altura adecuada (padding) */
        #deviceFilter, 
        #connectionFilter {
            width: 40%;
            padding: 10px; /* Asegura la altura del campo */
            box-sizing: border-box; /* Crucial para que el padding no exceda el 100% de ancho */
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        
        form input,
        form select,
        form textarea {
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        
        /* ESTILO UNIFICADO PARA BOTONES DE CREACIÓN Y GESTIÓN DE CONEXIÓN */
        form button[type="submit"], 
        .manage-buttons .connection-manage-btn { 
            background-color: #1d0ea8ff;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.2s;
            width: 100%; 
            padding: 12px;
            
            /* Usar Flexbox para el centrado perfecto */
            display: flex; 
            justify-content: center; 
            align-items: center; 
            text-align: center; 
        }
        form button[type="submit"]:hover,
        .manage-buttons .connection-manage-btn:hover {
            background-color: #0056b3;
        }

        /* --- CAMBIO CLAVE: Estilo para el botón de cerrar modal (X) --- */
        .modal-close {
            /* Mantiene la posición absoluta heredada por el span */
            position: absolute;
            
            /* Ajustado el posicionamiento a la esquina del modal (el modal-content tiene padding) */
            /* El modal-content tiene padding: 25px. Colocamos la 'X' justo en el borde superior-derecho del content. */
            top: 0px; 
            right: 0px; 
            
            /* Estilos para parecer un botón de acción */
            background-color: #dc3545; /* Rojo */
            color: white; /* Letra X blanca */
            font-size: 24px; /* Aumenta el tamaño de la X */
            font-weight: bold;
            line-height: 24px; /* Ajusta la altura de la línea para centrar la X */
            
            width: 30px; /* Tamaño del botón */
            height: 30px;
            border-radius: 0 8px 0 3px; /* Esquinas cuadradas en top-right, borde redondo en bottom-left */
            
            display: flex;
            align-items: center;
            justify-content: center;
            
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s;
            z-index: 1002; 
        }
        .modal-close:hover {
            background-color: #c82333; /* Rojo más oscuro al pasar el mouse */
        }
        
        /* --- ESTILOS DE LISTAS Y MODALES (Resto del CSS...) --- */
        .modal-content {
            background-color: #fefefe;
            /* Mantener el margen y el padding original */
            margin: 10% auto;
            padding: 25px;
            border: 1px solid #888;
            width: 90%;
            max-width: 900px;
            border-radius: 8px; /* Importante para que la X encaje en la esquina */
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
            position: relative; /* Asegura que .modal-close se posicione respecto a este */
        }
        .device-list {
            list-style: none;
            padding: 0;
            min-height: 50px;
            max-height: 500px;
            overflow-y: auto;
            border: 1px solid #ddd;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .device-list li {
            padding: 8px 12px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .device-list li:last-child {
            border-bottom: none;
        }
        .device-actions {
            display: flex;
            align-items: center;
        }
        .modal {
            display: none; 
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .pagination-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            margin-top: -15px;
            margin-bottom: 10px;
        }
        .pagination-controls button {
            width: auto;
            font-size: 14px;
            padding: 5px 15px;
            background-color: #6c757d; 
        }
        .pagination-controls button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .pagination-info {
            font-size: 14px;
            color: #555;
        }
        #status, #modalStatus, #connectionModalStatus {
            margin-top: 15px;
            font-weight: bold;
            padding: 10px;
            border-radius: 4px;
            display: none; 
        }
        .success {
            display: block !important;
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            display: block !important;
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>

    <div id="network-map"></div>
    
    <div id="top-left-container">
        <a href="Administrador.html" id="back-btn" class="map-button" title="Regresar">&#8678;</a>
        <img src="img/Logo1.png" alt="Logo Cedenar" class="logo-image">
    </div>
    
    <div id="bottom-left-container">
        <div id="leyenda-convenciones" class="p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
            <h3 style="font-size: 1.15em; font-weight: bold; color: #333; margin-top:0; margin-bottom: 10px;">Convenciones del Mapa</h3>
            <ul id="legend-list" style="list-style: none; padding: 0; margin: 0; font-size: 0.9em;">
                </ul>
            <hr style="margin: 10px 0;">
            <p style="font-size: 0.9em; margin-bottom: 0; color:#555;">
                <span class="estado-indicador" style="background-color: #2ecc71; border-color: #2ecc71;"></span> <span style="font-weight: bold;">Activo</span> | 
                <span class="estado-indicador" style="background-color: #e74c3c; border-color: #e74c3c;"></span> <span style="font-weight: bold;">Inactivo</span> | 
                <span class="estado-indicador" style="background-color: #f39c12; border-color: #f39c12;"></span> <span style="font-weight: bold;">Error</span>
            </p>
        </div>
    </div>
    <button onclick="toggleMonitoreo()" id="toggleMonitorBtn">INICIAR SINCRONIZACIÓN</button>
    <button id="open-panel-btn" class="map-button" title="Administrar Red">&#9881;</button>

    <div class="panel" id="side-panel">
        <button id="close-panel-btn" class="panel-close-btn" title="Cerrar Panel">&times;</button>
        
        <h2>Administrar Dispositivos</h2>
        <div class="manage-buttons" id="manage-devices-buttons">
            </div>
        <hr style="margin: 25px 0;">

        <h2>Crear Conexión</h2>
        <form id="add-connection-form">
            <div><label for="origen_id">Dispositivo Origen:</label><select id="origen_id" name="origen_id" required></select></div>
            <div><label for="destino_id">Dispositivo Destino:</label><select id="destino_id" name="destino_id" required></select></div>
            <button type="submit">Crear Conexión</button>
        </form>
        <div id="status"></div>
        <hr style="margin: 25px 0;">

        <h2>Administrar Conexiones</h2>
        <div class="manage-buttons">
            <button onclick="openConnectionModal()" class="connection-manage-btn">Gestionar Conexiones</button>
        </div>
    </div>

    <div id="manageModal" class="modal">
        <div class="modal-content">
            <span class="modal-close" onclick="closeManageModal()">&times;</span>
            <h2 id="modalTitle"></h2>
            <h3>Lista Actual</h3>
            
            <div style="margin-bottom: 15px;">
                <label for="deviceFilter">Filtrar por Nombre/IP:</label>
                <input type="text" id="deviceFilter" placeholder="Escriba aquí para filtrar..." onkeyup="filterList('deviceList', 'deviceFilter')" />
            </div>
            <ul id="deviceList" class="device-list"></ul>
            <div id="devicePagination" class="pagination-controls"></div>
            <hr>
            <h3 id="formTitle">Agregar Nuevo</h3>
            <form id="addDeviceForm">
                <input type="hidden" id="deviceType" name="tipo"><input type="hidden" id="deviceId" name="id">
                <div><label for="deviceName">Nombre:</label><input type="text" id="deviceName" name="nombre" required></div>
                <div><label for="deviceIp">Dirección IP:</label><input type="text" id="deviceIp" name="ip" required></div>
                <div><label for="deviceDireccion">Dirección:</label><input type="text" id="deviceDireccion" name="direccion"></div>
                <div><label for="deviceObservaciones">Observaciones:</label><textarea id="deviceObservaciones" name="observaciones" rows="3"></textarea></div>
                <button type="submit">Agregar</button>
            </form>
            <div id="modalStatus"></div>
        </div>
    </div>

    <div id="connectionModal" class="modal">
        <div class="modal-content">
            <span class="modal-close" onclick="closeConnectionModal()">&times;</span>
            <h2>Administrar Conexiones</h2>
            <h3>Lista de Conexiones</h3>
            
            <div style="margin-bottom: 15px;">
                <label for="connectionFilter">Filtrar por Origen/Destino:</label>
                <input type="text" id="connectionFilter" placeholder="Escriba aquí para filtrar..." onkeyup="filterList('connectionList', 'connectionFilter')" />
            </div>
            <ul id="connectionList" class="device-list"></ul>
            <div id="connectionPagination" class="pagination-controls"></div>
            <hr>
            <h3 id="connectionFormTitle">Editar Conexión</h3>
            <form id="editConnectionForm" style="display: none;">
                <input type="hidden" id="connectionId" name="id">
                <div><label for="editOrigenId">Dispositivo Origen:</label><select id="editOrigenId" name="origen_id" required></select></div>
                <div><label for="editDestinoId">Dispositivo Destino:</label><select id="editDestinoId" name="destino_id" required></select></div>
                <button type="submit">Guardar Cambios</button>
            </form>
            <div id="connectionModalStatus"></div>
        </div>
    </div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    
    // --- ESTADO GLOBAL Y CONSTANTES ---
    let network = null; 
    const nodes = new vis.DataSet([]); 
    const edges = new vis.DataSet([]); 
    const ITEMS_PER_PAGE = 9999; 
    let deviceState = { currentPage: 1, totalPages: 1, type: '' };
    let connectionState = { currentPage: 1, totalPages: 1 };
    let isMonitoring = false;
    // CLAVE DE ACCESO
    const ADMIN_PASSWORD = "12345"; 

    // --- CONFIGURACIÓN CENTRALIZADA DE COLORES Y NOMBRES DE DISPOSITIVOS (EXPANDIDA) ---
    const DEFAULT_DEVICE_COLORS = {
        // Existentes
        router: '#3568b4ff',        // Azul oscuro
        repetidora: '#fe08f5ff',    // Magenta/Rosa
        switch: '#1f1d88ff',        // Índigo
        firewall: '#d32f2f',        // Rojo
        servidor_vpn: '#be8a11ff',  // Amarillo/Naranja
        equipo_borde: '#9c27b0',    // Púrpura
        proveedor_internet: '#0cd5f0ff', // Cyan
        cliente: '#2d8d43ff',       // Verde
        default: '#CCCCCC',          
        gateway: '#008080',           // Teal
        switch_l3: '#6a0dad',         // Púrpura oscuro
        load_balancer: '#ff7f50',     // Coral
        ids_ips: '#8b0000',           // Rojo Oscuro (Seguridad)
        proxy_server: '#3cb371',      // Verde medio
        dns_server: '#20b2aa',        // Azul verdoso
        switch_poe: '#4682b4',        // Azul Acero
        bridge: '#d2b48c',            // Tostado
        transceiver: '#ffa07a',       // Salmón claro (Pequeño componente)
        patch_panel: '#a9a9a9',       // Gris Oscuro (Componente pasivo)
        hub: '#c0c0c0',               // Plata
        virtual_server: '#ff4500',    // Rojo-Naranja
        external_cloud: '#1e90ff',    // Azul Brillante
        telefonia_ip: '#daa520',      // Dorado
    };
    
    let DEVICE_COLORS = { ...DEFAULT_DEVICE_COLORS };
    try {
        const storedColors = JSON.parse(localStorage.getItem('deviceColors'));
        if (storedColors) {
            DEVICE_COLORS = { ...DEFAULT_DEVICE_COLORS, ...storedColors };
        }
    } catch (e) {
        console.error("Error al cargar colores de localStorage:", e);
    }

    const DEVICE_NAMES = {
        router: 'Routers',
        repetidora: 'Repetidoras',
        switch: 'Switches',
        firewall: 'Firewalls',
        servidor_vpn: 'Servidores VPN',
        equipo_borde: 'Equipos de Borde',
        proveedor_internet: 'Proveedor Internet',
        cliente: 'Clientes',
        gateway: 'Gateways (Puertas de Enlace)',
        switch_l3: 'Switches (Core)',
        load_balancer: 'Balanceadores de Carga',
        ids_ips: 'IDS/IPS (Seguridad)',
        proxy_server: 'Servidores Proxy',
        dns_server: 'Servidores DNS',
        switch_poe: 'Switches PoE',
        bridge: 'Bridges',
        transceiver: 'Transceptores (SFP)',
        patch_panel: 'Patch Panels',
        hub: 'Concentradores (Hubs)',
        virtual_server: 'Servidores Virtuales/VMs',
        external_cloud: 'Nube Externa (Servicios)',
        telefonia_ip: 'Telefonía IP (PBX/Servidor)',
    };
    // -----------------------------------------------------------

    // --- OBTENCIÓN DE ELEMENTOS DEL DOM ---
    const container = document.getElementById('network-map');
    const sidePanel = document.getElementById('side-panel');
    const openPanelBtn = document.getElementById('open-panel-btn');
    const closePanelBtn = document.getElementById('close-panel-btn');
    const modal = document.getElementById('manageModal');
    const modalTitle = document.getElementById('modalTitle');
    const deviceList = document.getElementById('deviceList');
    const addDeviceForm = document.getElementById('addDeviceForm');
    const deviceTypeInput = document.getElementById('deviceType');
    const deviceIdInput = document.getElementById('deviceId');
    const formTitle = document.getElementById('formTitle');
    const addDeviceFormButton = document.querySelector('#addDeviceForm button');
    const modalStatus = document.getElementById('modalStatus');
    const addConnectionForm = document.getElementById('add-connection-form');
    const statusDiv = document.getElementById('status');
    const connectionModal = document.getElementById('connectionModal');
    const connectionList = document.getElementById('connectionList');
    const editConnectionForm = document.getElementById('editConnectionForm');
    const connectionIdInput = document.getElementById('connectionId');
    const editOrigenSelect = document.getElementById('editOrigenId');
    const editDestinoSelect = document.getElementById('editDestinoId');
    const connectionModalStatus = document.getElementById('connectionModalStatus');
    const devicePaginationDiv = document.getElementById('devicePagination');
    const connectionPaginationDiv = document.getElementById('connectionPagination');
    const toggleMonitorBtn = document.getElementById('toggleMonitorBtn');
    const backBtn = document.getElementById('back-btn');
    const manageDevicesButtonsContainer = document.getElementById('manage-devices-buttons');


    // --- ÍCONOS SVG DE ADMINISTRACIÓN ---
    const ICONOS_SVG = {
        edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>',
        delete: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM11 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5z"/></svg>'
    };

    // --- ICONOS Y OPCIONES DE VIS.JS (EXPANDIDA) ---
    // Función para generar los SVGs de Vis.js (para el mapa y la leyenda)
    const icons = {
        router: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="7" y="22" width="50" height="20" rx="4" fill="${color}" stroke="#333" stroke-width="2"/><path d="M17 22V17h30v5M20 42v-5h4m8 5v-5h4m8 5v-5h4" stroke="#333" stroke-width="2" fill="none"/></svg>`),
        repetidora: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="12" y="40" width="40" height="12" rx="3" fill="${color}" stroke="#000" stroke-width="2"/><path d="M32 40V15m-12 5l12-10 12 10" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M25 25a12 12 0 0 1 14 0m-19 5a19 19 0 0 1 24 0" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`),
        cliente: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><circle cx="30" cy="30" r="25" fill="${color}" stroke="#333" stroke-width="2"/><circle cx="30" cy="23" r="8" fill="#fff"/><path d="M15 45q15-15 30 0" stroke="#fff" stroke-width="3" fill="none"/></svg>`),
        switch: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="4" y="22" width="56" height="20" rx="3" fill="${color}" stroke="#333" stroke-width="2" /><path d="M12 32h-4l6-6m-2 12h-4l6 6m12-12h-4l6-6m-2 12h-4l6 6m12-12h-4l6-6m-2 12h-4l6 6m12-12h-4l6-6m-2 12h-4l6 6" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/></svg>`),
        firewall: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M4 8 V56 H60 V8 H4 M4 28 H60 M4 42 H60 M22 8 V56 M42 8 V56" fill="${color}" stroke="#333" stroke-width="2" /></svg>`),
        servidor_vpn: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="8" y="8" width="48" height="48" rx="5" fill="${color}" stroke="#333" stroke-width="2"/><rect x="22" y="26" width="20" height="22" rx="2" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M32 26V20a6 6 0 1 1 12 0v6" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`),
        proveedor_internet: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M49.2,21.3C47.4,12.7,40.3,6,32,6c-6.2,0-11.7,3.5-14.5,8.6C10.9,15,5,20.1,5,26.9c0,6.9,5.8,12.4,12.9,12.4h28.5c5,0,9.1-3.9,9.1-8.8C55.5,25.9,52.8,22.2,49.2,21.3z" fill="${color}" stroke="#333" stroke-width="2"/></svg>`),
        equipo_borde: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="24" fill="${color}" stroke="#333" stroke-width="2"/><path d="M8 32h48M32 8v48" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4,4"/><path d="M32 20 l-10 10 l10 10 l10-10 Z" fill="#fff" stroke="#333" stroke-width="1.5"/></svg>`),
        gateway: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="12" y="12" width="40" height="40" rx="5" fill="${color}" stroke="#333" stroke-width="2"/><path d="M12 32h40M32 12v40" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`),
        switch_l3: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="4" y="20" width="56" height="24" rx="4" fill="${color}" stroke="#333" stroke-width="2" /><path d="M10 32h44M10 24h44M10 40h44" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`),
        load_balancer: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="15" y="15" width="34" height="34" rx="3" fill="${color}" stroke="#333" stroke-width="2"/><path d="M32 15v34M15 32h34M22 25l-5 7 5 7M42 25l5 7-5 7" stroke="#fff" stroke-width="2" fill="none"/></svg>`),
        ids_ips: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="28" fill="${color}" stroke="#333" stroke-width="2"/><path d="M32 10v44M10 32h44M25 25l14 14M25 39l14-14" stroke="#fff" stroke-width="2" fill="none"/></svg>`),
        proxy_server: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="10" y="20" width="44" height="24" rx="3" fill="${color}" stroke="#333" stroke-width="2"/><circle cx="32" cy="32" r="5" fill="#fff"/><path d="M18 32h8M38 32h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`),
        dns_server: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="12" y="12" width="40" height="40" rx="5" fill="${color}" stroke="#333" stroke-width="2"/><text x="32" y="38" font-size="17" font-family="Arial, sans-serif" fill="#fff" text-anchor="middle">DNS</text></svg>`),
        switch_poe: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="4" y="22" width="56" height="20" rx="3" fill="${color}" stroke="#333" stroke-width="2" /><path d="M12 32h-4l6-6m-2 12h-4l6 6m12-12h-4l6-6m-2 12h-4l6 6m12-12h-4l6-6m-2 12h-4l6 6m12-12h-4l6-6m-2 12h-4l6 6" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/><circle cx="55" cy="18" r="5" fill="#fff"/></svg>`),
        bridge: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="12" y="22" width="40" height="20" rx="3" fill="${color}" stroke="#333" stroke-width="2"/><path d="M12 32h40M17 22V15h30v7" stroke="#fff" stroke-width="2" fill="none"/></svg>`),
        transceiver: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="25" y="10" width="14" height="44" rx="2" fill="${color}" stroke="#333" stroke-width="2"/><circle cx="32" cy="17" r="4" fill="#fff"/><circle cx="32" cy="47" r="4" fill="#fff"/></svg>`),
        patch_panel: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="4" y="10" width="56" height="44" rx="3" fill="${color}" stroke="#333" stroke-width="2"/><path d="M10 20h44M10 32h44M10 44h44M15 20v-5m10 5v-5m15 5v-5" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`),
        hub: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="10" y="25" width="44" height="14" rx="3" fill="${color}" stroke="#333" stroke-width="2"/><circle cx="15" cy="32" r="3" fill="#fff"/><circle cx="32" cy="32" r="3" fill="#fff"/><circle cx="49" cy="32" r="3" fill="#fff"/></svg>`),
        virtual_server: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="8" y="8" width="48" height="48" rx="5" fill="${color}" stroke="#333" stroke-width="2"/><path d="M32 15v34M15 32h34" stroke="#fff" stroke-width="3" stroke-dasharray="8,4"/></svg>`),
        external_cloud: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M49.2,21.3C47.4,12.7,40.3,6,32,6c-6.2,0-11.7,3.5-14.5,8.6C10.9,15,5,20.1,5,26.9c0,6.9,5.8,12.4,12.9,12.4h28.5c5,0,9.1-3.9,9.1-8.8C55.5,25.9,52.8,22.2,49.2,21.3z" fill="${color}" stroke="#333" stroke-width="2"/><path d="M22 35l10 10 10-10" stroke="#fff" stroke-width="2" fill="none"/></svg>`),
        telefonia_ip: (color) => `data:image/svg+xml;charset=utf-8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="12" y="12" width="40" height="40" rx="5" fill="${color}" stroke="#333" stroke-width="2"/><path d="M42 22v-6c0-3-3-6-6-6h-8c-3 0-6 3-6 6v6m0 10v10h20v-10h-20" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`),
    };
    const options = {
        nodes: { shape: 'image', font: { size: 13, color: '#333' }, borderWidth: 0 },
        edges: { width: 1.5, color: { color: '#848484', hover: '#007bff' }, arrows: { to: { enabled: false } }, smooth: { type: "dynamic" } },
        physics: { barnesHut: { gravitationalConstant: -1400, centralGravity: 0.1, springLength: 200 } },
        interaction:{ hover: true }
    };
    
    function getIcon(type, color) { 
        const iconGenerator = icons[type];
        if (iconGenerator) {
            return iconGenerator(color);
        }
        return icons.cliente(color); 
    }
    
    // -----------------------------------------------------------


    window.toggleMonitoreo = () => {
        if (isMonitoring) {
            clearInterval(window.monitorInterval);
            isMonitoring = false;
            toggleMonitorBtn.textContent = 'REANUDAR SINCRONIZACIÓN';
            console.log('Monitoreo de red pausado.');
            backBtn.classList.remove('disabled'); 
        } else {
            realizarCicloDePing(); 
            window.monitorInterval = setInterval(realizarCicloDePing, 30000);
            isMonitoring = true;
            toggleMonitorBtn.textContent = 'PAUSAR SINCRONIZACIÓN';
            console.log('Monitoreo de red reanudado.');
            backBtn.classList.add('disabled'); 
        }
    };
    
    /**
     * Inicializa los íconos de la leyenda usando los colores actuales de DEVICE_COLORS.
     */
    function initializeLegendIcons() {
        const legendList = document.getElementById('legend-list');
        legendList.innerHTML = ''; // Limpiar la lista existente

        Object.keys(DEVICE_NAMES).forEach(type => {
            const friendlyName = DEVICE_NAMES[type];
            const color = DEVICE_COLORS[type] || DEVICE_COLORS.default; 
            const iconUrl = getIcon(type, color); // Usa la función corregida getIcon
            
            const li = document.createElement('li');
            li.style.cssText = "display: flex; align-items: center; margin-bottom: 5px; color:#555;";
            
            li.innerHTML = `
                <span class="icono-ejemplo ${type}-icon" data-type="${type}" style="background-color: transparent;">
                    <img src="${iconUrl}" alt="${type}" style="width:100%; height:100%;" />
                </span> 
                <span style="margin-left: 8px;">${friendlyName}</span>
            `;
            legendList.appendChild(li);
        });
    }

    /**
     * Genera los botones de administración con íconos, colores y selector de color.
     */
    function renderManageButtons() {
        manageDevicesButtonsContainer.innerHTML = '';
        Object.keys(DEVICE_NAMES).forEach(type => {
            const friendlyName = DEVICE_NAMES[type];
            let color = DEVICE_COLORS[type];
            const button = document.createElement('button');
            
            button.className = 'device-manage-button'; 
            button.onclick = (e) => {
                // Previene que el clic en el botón active el selector de color si se hizo clic en él
                if (e.target.closest('.color-picker-wrapper')) {
                    e.stopPropagation();
                    return;
                }
                openManageModal(type);
            };
            
            // Contenedor del nombre y el icono
            const nameContainer = document.createElement('span');
            nameContainer.className = 'device-text';
            nameContainer.style.color = color;

            // Renderizamos el ícono al inicio del nombre
            const iconUrl = getIcon(type, color);
            nameContainer.insertAdjacentHTML('afterbegin', `<img src="${iconUrl}" alt="${type}" />`);
            nameContainer.insertAdjacentText('beforeend', friendlyName);

            button.appendChild(nameContainer);

            // Añadir el Color Picker
            const colorPickerWrapper = document.createElement('div');
            colorPickerWrapper.className = 'color-picker-wrapper';
            
            const colorPickerIndicator = document.createElement('span');
            colorPickerIndicator.className = 'color-picker-indicator';
            colorPickerIndicator.style.backgroundColor = color;
            colorPickerWrapper.appendChild(colorPickerIndicator);

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = color;
            colorInput.setAttribute('data-device-type', type);
            colorInput.addEventListener('input', (e) => {
                // Actualiza el indicador visual en tiempo real
                colorPickerIndicator.style.backgroundColor = e.target.value;
                // Previene que se dispare el modal si se está cambiando el color
                e.stopPropagation();
            });
            colorInput.addEventListener('change', (e) => {
                const newColor = e.target.value;
                DEVICE_COLORS[type] = newColor;
                localStorage.setItem('deviceColors', JSON.stringify(DEVICE_COLORS));
                
                // Aplicar el nuevo color inmediatamente al botón
                nameContainer.style.color = newColor;
                // Re-renderiza el ícono para el botón
                nameContainer.querySelector('img').src = getIcon(type, newColor); 

                cargarMapa(); // Recarga el mapa para aplicar el nuevo color a los nodos existentes
                initializeLegendIcons(); // Actualiza la leyenda
                e.stopPropagation();
            });
            colorPickerWrapper.appendChild(colorInput);
            button.appendChild(colorPickerWrapper);
            
            manageDevicesButtonsContainer.appendChild(button);
        });
    }
    // ---------------------------------------------------------------------------------


    async function fetchData(url, options = {}) {
        const response = await fetch(url, { cache: 'no-store', ...options });
        if (!response.ok) throw new Error(`Error del servidor: ${response.status} (${response.statusText})`);
        const text = await response.text();
        try { 
            return JSON.parse(text); 
        } catch (e) { 
            console.error("Respuesta no es JSON válido:", text); 
            throw new Error(`La respuesta del servidor no es válida o está vacía. Detalles: ${text.substring(0, 100)}...`); 
        }
    }
    
    function resetAddDeviceForm() {
        formTitle.textContent = 'Agregar Nuevo';
        addDeviceForm.reset();
        deviceIdInput.value = '';
        addDeviceFormButton.textContent = 'Agregar';
        modalStatus.className = '';
        modalStatus.textContent = '';
    }
    
    // --- NUEVA FUNCIÓN DE FILTRADO (Cliente) ---
    /**
     * Filtra los elementos de una lista (UL) basándose en el texto de un campo de entrada.
     * @param {string} listId - El ID del <ul> (ej: 'deviceList', 'connectionList').
     * @param {string} filterInputId - El ID del <input> de filtro (ej: 'deviceFilter', 'connectionFilter').
     */
    window.filterList = (listId, filterInputId) => {
        const filter = document.getElementById(filterInputId).value.toUpperCase();
        const ul = document.getElementById(listId);
        // Verificar si la UL existe y contiene elementos
        if (!ul || ul.children.length === 0) return;
        
        const li = ul.getElementsByTagName('li');

        // Iterar sobre todos los elementos de la lista
        for (let i = 0; i < li.length; i++) {
            // Saltamos la paginación o elementos de carga si se hubieran añadido como LI
            if (li[i].classList.contains('pagination-info') || li[i].textContent.includes('Cargando')) continue;

            // Obtenemos el texto visible (el <span> con nombre/IP/conexión)
            const span = li[i].querySelector('span');
            if (span) {
                const txtValue = span.textContent || span.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "flex"; // Mostrar como flex para mantener el diseño
                } else {
                    li[i].style.display = "none"; // Ocultar
                }
            } else if (li[i].textContent.toUpperCase().indexOf(filter) > -1) {
                // Caso alternativo si el LI solo tiene texto (ej. "No hay dispositivos")
                li[i].style.display = "flex";
            } else {
                 li[i].style.display = "none";
            }
        }
    };
    // ------------------------------------------


    // Dibuja los controles de paginación (botones Anterior/Siguiente).
    function renderPaginationControls(container, state, onPageChange) {
        if (state.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <button class="prev-btn" ${state.currentPage <= 1 ? 'disabled' : ''}>Anterior</button>
            <span class="pagination-info">Página ${state.currentPage} de ${state.totalPages}</span>
            <button class="next-btn" ${state.currentPage >= state.totalPages ? 'disabled' : ''}>Siguiente</button>
        `;
        container.querySelector('.prev-btn').addEventListener('click', () => {
            if (state.currentPage > 1) { state.currentPage--; onPageChange(); }
        });
        container.querySelector('.next-btn').addEventListener('click', () => {
            if (state.currentPage < state.totalPages) { state.currentPage++; onPageChange(); }
        });
    }

    // Carga una página específica de la lista de dispositivos.
    async function loadDevicePage() {
        deviceList.innerHTML = '<li>Cargando...</li>';
        devicePaginationDiv.innerHTML = '';
        try {
            // Reemplaza guiones bajos por nada para el nombre de la acción (ej. telefonia_ip -> telefoniaip)
            const action = `obtener_${deviceState.type.replace(/_/g, '')}s`;
            const data = await fetchData(`ping.php?action=${action}&page=${deviceState.currentPage}&limit=${ITEMS_PER_PAGE}`);
            deviceState.totalPages = Math.ceil(data.total / ITEMS_PER_PAGE) || 1;
            deviceList.innerHTML = data.items.length ? '' : '<li>No hay dispositivos de este tipo.</li>';
            data.items.forEach(d => {
                const li = document.createElement('li');
                // Se modifican los botones de Editar y Eliminar para usar íconos
                li.innerHTML = `<span>${d.nombre} (${d.ip})</span>
                                <div class="device-actions">
                                    <button class="edit-btn" data-id="${d.id}" data-nombre="${d.nombre}" data-ip="${d.ip}" data-direccion="${d.direccion || ''}" data-observaciones="${d.observaciones || ''}" title="Editar">
                                        ${ICONOS_SVG.edit}
                                    </button>
                                    <button class="delete-btn" data-id="${d.id}" title="Eliminar">
                                        ${ICONOS_SVG.delete}
                                    </button>
                                </div>`;
                deviceList.appendChild(li);
            });
            renderPaginationControls(devicePaginationDiv, deviceState, loadDevicePage);
            
            // Lógica de filtro: Se resetea el campo y se aplica un filtro (limpio)
            const deviceFilterInput = document.getElementById('deviceFilter');
            if (deviceFilterInput) {
                 deviceFilterInput.value = ''; 
                 window.filterList('deviceList', 'deviceFilter');
            }
            
        } catch(error) {
            deviceList.innerHTML = `<li class="error">${error.message}</li>`;
        }
    }

    // Abre el modal de administración de dispositivos.
    window.openManageModal = async (tipo) => {
        resetAddDeviceForm();
        const friendlyName = DEVICE_NAMES[tipo] || tipo; // Usamos la lista de nombres
        modalTitle.textContent = `Administrar ${friendlyName}`;
        deviceTypeInput.value = tipo;
        deviceState.type = tipo;
        deviceState.currentPage = 1;
        modal.style.display = 'block';
        await loadDevicePage(); // Esto es lo que llama a la lista
    };
    
    window.closeManageModal = () => { modal.style.display = 'none'; };

    // Carga una página específica de la lista de conexiones.
    async function loadConnectionPage() {
        connectionList.innerHTML = '<li>Cargando...</li>';
        connectionPaginationDiv.innerHTML = '';
        try {
            const data = await fetchData(`ping.php?action=obtener_conexiones_detalle&page=${connectionState.currentPage}&limit=${ITEMS_PER_PAGE}`);
            connectionState.totalPages = Math.ceil(data.total / ITEMS_PER_PAGE) || 1;
            connectionList.innerHTML = data.items.length ? '' : '<li>No hay conexiones.</li>';
            data.items.forEach(c => {
                const li = document.createElement('li');
                // Se modifican los botones de Editar y Eliminar para usar íconos
                li.innerHTML = `<span>${c.origen_nombre} &harr; ${c.destino_nombre}</span>
                                <div class="device-actions">
                                    <button class="edit-btn" data-id="${c.id}" data-origen-id="${c.origen_id}" data-destino-id="${c.destino_id}" title="Editar">
                                        ${ICONOS_SVG.edit}
                                    </button>
                                    <button class="delete-btn" data-id="${c.id}" title="Eliminar">
                                        ${ICONOS_SVG.delete}
                                    </button>
                                </div>`;
                connectionList.appendChild(li);
            });
            renderPaginationControls(connectionPaginationDiv, connectionState, loadConnectionPage);
            
            // Lógica de filtro: Se resetea el campo y se aplica un filtro (limpio)
            const connectionFilterInput = document.getElementById('connectionFilter');
            if (connectionFilterInput) {
                 connectionFilterInput.value = ''; 
                 window.filterList('connectionList', 'connectionFilter');
            }
            
        } catch(error) {
            connectionList.innerHTML = `<li class="error">${error.message}</li>`;
        }
    }

    // Abre el modal de administración de conexiones.
    window.openConnectionModal = async () => {
        editConnectionForm.style.display = 'none';
        connectionState.currentPage = 1;
        connectionModal.style.display = 'block';
        await Promise.all([ populateAllDevicesSelect('editOrigenId'), populateAllDevicesSelect('editDestinoId'), loadConnectionPage() ]);
    };
    window.closeConnectionModal = () => { connectionModal.style.display = 'none'; };

    // Carga la lista completa de dispositivos en los menús desplegables (selects).
    async function populateAllDevicesSelect(selectId) {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Cargando...</option>';
        try {
            const devices = await fetchData(`ping.php?action=obtener_todos_dispositivos`);
            select.innerHTML = `<option value="">-- Seleccionar Dispositivo --</option>`;
            devices.forEach(d => { select.innerHTML += `<option value="${d.id}">${d.nombre} (${d.ip})</option>`; });
        } catch (error) { select.innerHTML = `<option value="">Error al cargar</option>`; }
    }
    const populateConnectionSelects = () => { populateAllDevicesSelect('origen_id'); populateAllDevicesSelect('destino_id'); };

    // Carga todos los dispositivos y conexiones para dibujar el mapa.
    async function cargarMapa() {
        try {
            const data = await fetchData('ping.php?action=obtener_dispositivos');
            const deviceNodes = data.dispositivos.map(d => {
                
                // *** TAMAÑO FIJO ÚNICO APLICADO ***
                const iconSize = 35; 
                // **********************************
                
                let color = DEVICE_COLORS[d.tipo] || DEVICE_COLORS.default;

                const tooltipElement = document.createElement('div');
                tooltipElement.innerHTML = `<ul style="margin:5px; padding-left:15px; text-align:left; list-style:square;">` +
                                             `<li><b>IP:</b> ${d.ip}</li>` +
                                             `<li><b>Dirección:</b> ${d.direccion || 'N/A'}</li>` +
                                             `<li><b>Obs:</b> ${d.observaciones || 'N/A'}</li></ul>`;
                
                return { 
                    id: d.id, 
                    label: `${d.nombre}\n(${d.ip})`, 
                    ip: d.ip, 
                    type: d.tipo, 
                    image: getIcon(d.tipo, color), 
                    shape: 'image', 
                    size: iconSize, // Utiliza el tamaño uniforme
                    color: { background: color }, 
                    title: tooltipElement 
                };
            });
            const deviceEdges = data.conexiones.map(c => ({ id: 'c' + c.id, from: c.origen_id, to: c.destino_id }));
            nodes.clear(); edges.clear();
            nodes.add(deviceNodes); edges.add(deviceEdges);
            if (!network) { network = new vis.Network(container, { nodes, edges }, options); } 
            else { network.setData({ nodes, edges }); }
            
        } catch (error) {
            container.innerHTML = `<div style="text-align:center;padding:50px;color:red;"><b>Error al cargar el mapa.</b><br>${error.message}</div>`;
        }
    }

    // Contiene la lógica para un solo ciclo de pings.
    function realizarCicloDePing() {
        nodes.getIds().forEach(async (id) => {
            const node = nodes.get(id);
            if (!node || !node.ip) return;
            // Guardamos el color base del dispositivo (sin el estado de monitoreo)
            const baseColor = DEVICE_COLORS[node.type] || DEVICE_COLORS.default; 
            
            try {
                const result = await fetchData(`ping.php?action=ping&ip=${node.ip}`);
                // El color de estado es verde o rojo/naranja
                const statusColor = result.status === 'up' ? '#2ecc71' : '#e74c3c';
                
                // Si el color cambia, actualizamos el nodo en el mapa
                if (node.color.background !== statusColor) {
                    // Usamos el color de estado para el fondo, y el ícono también lo toma
                    nodes.update({ id: id, color: { background: statusColor }, image: getIcon(node.type, statusColor) });
                }
                
                // Lógica de actualización de botones en el panel lateral
                const deviceType = node.type;
                const button = manageDevicesButtonsContainer.querySelector(`button[onclick*="openManageModal('${deviceType}')"]`);

                if (button) {
                    const nameContainer = button.querySelector('.device-text');
                    const colorPickerIndicator = button.querySelector('.color-picker-indicator');
                    
                    if (nameContainer) {
                         // Actualizamos el color del texto y re-renderizamos el ícono con el color de estado
                        nameContainer.style.color = statusColor;
                        nameContainer.querySelector('img').src = getIcon(deviceType, statusColor);
                    }
                    
                    // Si el color está en rojo o amarillo, se podría cambiar el fondo del botón para llamar la atención.
                    if(statusColor === '#e74c3c' || statusColor === '#f39c12') {
                        button.style.backgroundColor = '#ffeeee';
                        button.style.borderColor = '#e74c3c';
                    } else {
                        // Vuelve a su estado normal si está activo
                        button.style.backgroundColor = '#f7f7f7';
                        button.style.borderColor = '#ddd';
                    }
                    // El color picker mantiene el color base, no el color de estado
                    if (colorPickerIndicator) {
                        colorPickerIndicator.style.backgroundColor = baseColor;
                    }
                }

            } catch (error) {
                const statusColor = '#f39c12'; // Estado de Error/No responde
                if (node.color.background !== statusColor) {
                    // Usamos el color de estado para el fondo, y el ícono también lo toma
                    nodes.update({ id: id, color: { background: statusColor }, image: getIcon(node.type, statusColor) });
                }
                
                // Lógica de actualización de botones para el estado 'Error'
                const deviceType = node.type;
                const button = manageDevicesButtonsContainer.querySelector(`button[onclick*="openManageModal('${deviceType}')"]`);
                if (button) {
                    const nameContainer = button.querySelector('.device-text');
                    const colorPickerIndicator = button.querySelector('.color-picker-indicator');

                    if (nameContainer) {
                        nameContainer.style.color = statusColor;
                        nameContainer.querySelector('img').src = getIcon(deviceType, statusColor);
                    }
                    button.style.backgroundColor = '#fff3cd'; // Fondo claro para estado de Error
                    button.style.borderColor = '#f39c12';
                    // El color picker mantiene el color base
                    if (colorPickerIndicator) {
                        colorPickerIndicator.style.backgroundColor = baseColor;
                    }
                }
            }
        });
    }

    // --- EVENT LISTENERS (MANEJADORES DE EVENTOS) ---
    // Función de autenticación para abrir el panel
    openPanelBtn.addEventListener('click', () => {
        const password = prompt("Ingrese la clave de administración:");
        if (password === ADMIN_PASSWORD) {
            sidePanel.classList.add('visible');
        } else if (password !== null) {
            alert("Clave incorrecta.");
        }
    });

    closePanelBtn.addEventListener('click', () => sidePanel.classList.remove('visible'));

    if (backBtn) {
        backBtn.addEventListener('click', function(event) {
            if (isMonitoring) {
                event.preventDefault(); 
                alert('Detenga el monitoreo antes de salir de la página.');
            } else {
                if (window.monitorInterval) {
                    clearInterval(window.monitorInterval);
                    console.log('Monitoreo de red detenido.');
                }
            }
        });
    }

    window.addEventListener('beforeunload', function() {
        if (window.monitorInterval) {
            clearInterval(window.monitorInterval);
        }
    });

    async function handleFormSubmit(e, action, statusElement, onSuccess) {
        e.preventDefault();
        statusElement.textContent = 'Guardando...';
        statusElement.className = '';
        try {
            const result = await fetchData(`ping.php?action=${action}`, { method: 'POST', body: new FormData(e.target) });
            statusElement.textContent = result.message;
            statusElement.className = result.success ? 'success' : 'error';
            if (result.success && onSuccess) onSuccess(result);
        } catch (error) {
            statusElement.textContent = error.message;
            statusElement.className = 'error';
        }
    }

    addDeviceForm.addEventListener('submit', (e) => {
        handleFormSubmit(e, deviceIdInput.value ? 'editar_dispositivo' : 'agregar_dispositivo', modalStatus, () => {
            const currentType = deviceTypeInput.value;
            resetAddDeviceForm();
            openManageModal(currentType);
            populateConnectionSelects();
            cargarMapa();
            renderManageButtons(); // Actualiza los botones
            initializeLegendIcons(); // Asegura la actualización de la leyenda
        });
    });

    addConnectionForm.addEventListener('submit', (e) => {
        handleFormSubmit(e, 'agregar_conexion', statusDiv, () => { e.target.reset(); cargarMapa(); });
    });

    editConnectionForm.addEventListener('submit', (e) => {
        handleFormSubmit(e, 'editar_conexion', connectionModalStatus, async () => {
            editConnectionForm.style.display = 'none';
            await loadConnectionPage();
            cargarMapa();
        });
    });

    deviceList.addEventListener('click', async (e) => {
        const target = e.target.closest('button'); 
        if (!target) return;

        if (target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro? Las conexiones asociadas se eliminarán.')) {
                await fetchData('ping.php?action=eliminar_dispositivo', { method: 'POST', body: new URLSearchParams({id: target.dataset.id}) });
                loadDevicePage();
                populateConnectionSelects();
                cargarMapa();
                renderManageButtons(); // Actualiza los botones
                initializeLegendIcons(); // Asegura la actualización de la leyenda
            }
        } else if (target.classList.contains('edit-btn')) {
            deviceIdInput.value = target.dataset.id;
            document.getElementById('deviceName').value = target.dataset.nombre;
            document.getElementById('deviceIp').value = target.dataset.ip;
            document.getElementById('deviceDireccion').value = target.dataset.direccion;
            document.getElementById('deviceObservaciones').value = target.dataset.observaciones;
            formTitle.textContent = 'Editando Dispositivo';
            addDeviceFormButton.textContent = 'Guardar Cambios';
            document.getElementById('deviceName').focus();
        }
    });

    connectionList.addEventListener('click', async (e) => {
        const target = e.target.closest('button'); 
        if (!target) return;

        if (target.classList.contains('delete-btn')) {
            if (confirm('¿Eliminar esta conexión?')) {
                await fetchData('ping.php?action=eliminar_conexion', { method: 'POST', body: new URLSearchParams({id: target.dataset.id}) });
                loadConnectionPage();
                cargarMapa();
            }
        } else if (target.classList.contains('edit-btn')) {
            connectionIdInput.value = target.dataset.id;
            editOrigenSelect.value = target.dataset.origenId;
            editDestinoSelect.value = target.dataset.destinoId;
            editConnectionForm.style.display = 'block';
        }
    });

    // --- INICIALIZACIÓN ---
    populateConnectionSelects();
    cargarMapa();
    initializeLegendIcons(); // Inicializa la leyenda con los colores correctos
    renderManageButtons(); // Inicializa los botones de administración
    backBtn.classList.remove('disabled');
});
</script>
</body>
</html>