document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '';
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const moduleContents = document.querySelectorAll('.module-content');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const emptySpaceModule = document.getElementById('empty-space-module');
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    const openChangePasswordModalBtn = document.getElementById('openChangePasswordModalBtn');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    const cancelChangePasswordBtn = document.getElementById('cancelChangePasswordBtn');
    let userSession = {};
    let modalOpenerModule = '';

    // --- Selectores Módulo Usuarios ---
    const usersTableBody = document.getElementById('usersTableBody');
    const addUserBtn = document.getElementById('addUserBtn');
    const userFormContainer = document.getElementById('userFormContainer');
    const userForm = document.getElementById('userForm');
    const userId = document.getElementById('userId');
    const originalUserId = document.getElementById('originalUserId');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhone = document.getElementById('userPhone');
    const userAddress = document.getElementById('userAddress');
    const passwordFields = document.getElementById('passwordFields');
    const userPassword = document.getElementById('userPassword');
    const userConfirmPassword = document.getElementById('userConfirmPassword');
    const userFormTitle = document.getElementById('userFormTitle');
    const cancelUserBtn = document.getElementById('cancelUserBtn');
    const userSearchInput = document.getElementById('userSearchInput');
    const searchUserBtn = document.getElementById('searchUserBtn');
    const clearUserSearchBtn = document.getElementById('clearUserSearchBtn');
    const manageUserPlansSection = document.getElementById('manageUserPlansSection');
    const assignedPlansList = document.getElementById('assignedPlansList');
    const assignPlanSelect = document.getElementById('assignPlanSelect');
    const assignPlanBtn = document.getElementById('assignPlanBtn');
    let currentEditingUserId = null;
    const userRoleSelect = document.getElementById('userRoleSelect');
    const modulePermissionsSection = document.getElementById('modulePermissionsSection');
    const moduleCheckboxes = document.getElementById('moduleCheckboxes');
    const clientesTableBody = document.getElementById('clientesTableBody');
    const gestionUsersTableBody = document.getElementById('gestionUsersTableBody');
    const exportGestionUsersExcelBtn = document.getElementById('exportGestionUsersExcelBtn');
    const exportClientesExcelBtn = document.getElementById('exportClientesExcelBtn');
    let allRoles = [];
    let allModules = ['usuarios', 'planes', 'facturacion', 'recaudo', 'ingresos-gastos', 'inventario', 'queues', 'monitoreo'];

    // --- Selectores Módulo Inventario ---
    const assetSearchInput = document.getElementById('assetSearchInput');
    const searchAssetBtn = document.getElementById('searchAssetBtn');
    const clearAssetSearchBtn = document.getElementById('clearAssetSearchBtn');
    // --- Fin Selectores Módulo Inventario ---

    // --- Selectores Módulo Planes ---
    const plansTableBody = document.getElementById('plansTableBody');
    const addPlanBtn = document.getElementById('addPlanBtn');
    const planFormContainer = document.getElementById('planFormContainer');
    const planForm = document.getElementById('planForm');
    const planId = document.getElementById('planId');
    const planName = document.getElementById('planName');
    const planSpeed = document.getElementById('planSpeed');
    const planPrice = document.getElementById('planPrice');
    const planFormTitle = document.getElementById('planFormTitle');
    const cancelPlanBtn = document.getElementById('cancelPlanBtn');
    const exportPlanesExcelBtn = document.getElementById('exportPlanesExcelBtn');

    // --- Selectores Módulo Facturación y Recaudo (compartidos) ---
    const facturacionForm = document.getElementById('facturacionForm');
    const facturacionModeSelect = document.getElementById('facturacionModeSelect');
    const facturaIndividualContainer = document.getElementById('facturaIndividualContainer');
    const facturaConceptoContainer = document.getElementById('facturaConceptoContainer');
    const montoYBotonesContainer = document.getElementById('montoYBotonesContainer');
    const facturaUserId = document.getElementById('facturaUserId');
    const buscarUsuarioBtn = document.getElementById('buscarUsuarioBtn');
    const userInfoDisplay = document.getElementById('userInfoDisplay');
    const facturaClientName = document.getElementById('facturaClientName');
    const facturaClientEmail = document.getElementById('facturaClientEmail');
    const facturaClientAssignedPlans = document.getElementById('facturaClientAssignedPlans');
    const facturaClientPlanPrice = document.getElementById('facturaClientPlanPrice');
    const planSelectionContainer = document.getElementById('planSelectionContainer');
    const facturaPlanSelect = document.getElementById('facturaPlanSelect');
    const facturaUserIdConcepto = document.getElementById('facturaUserIdConcepto');
    const buscarUsuarioBtnConcepto = document.getElementById('buscarUsuarioBtnConcepto');
    const conceptoUserName = document.getElementById('conceptoUserName');
    const facturaConceptoInput = document.getElementById('facturaConceptoInput');
    const facturaMonto = document.getElementById('facturaMonto');
    const generarFacturaBtn = document.getElementById('generarFacturaBtn');
    const cancelarFacturaBtn = document.getElementById('cancelarFacturaBtn');
    let currentClientData = null; 
    let facturacionMode = '';
    const facturasTableBody = document.getElementById('facturasTableBody');
    const generateBulkInvoicesBtn = document.getElementById('generateBulkInvoicesBtn');
    
    // --- Selectores Modal Revisión Facturación Masiva (NUEVOS) ---
    const bulkInvoiceReviewModal = document.getElementById('bulkInvoiceReviewModal');
    const bulkInvoicesReviewTableBody = document.getElementById('bulkInvoicesReviewTableBody');
    const selectAllBulkInvoices = document.getElementById('selectAllBulkInvoices');
    const closeBulkReviewModalBtn = document.getElementById('closeBulkReviewModalBtn');
    const cancelBulkGenerationBtn = document.getElementById('cancelBulkGenerationBtn');
    const executeBulkGenerationBtn = document.getElementById('executeBulkGenerationBtn');
    const invoicesToGenerateCount = document.getElementById('invoicesToGenerateCount');
    const executeBulkCount = document.getElementById('executeBulkCount');
    let preliminaryInvoices = []; // Para almacenar los datos preliminares
    // --- Fin Selectores Modal Revisión Facturación Masiva ---
    
    // --- Selectores Resumen Facturación ACTUALIZADOS ---
    const generatedInvoicesCount = document.getElementById('generatedInvoicesCount');
    const generatedInvoicesSum = document.getElementById('generatedInvoicesSum');
    const paidInvoicesCount = document.getElementById('paidInvoicesCount'); // Reutilizado, ahora con lógica de modificación
    const paidInvoicesSum = document.getElementById('paidInvoicesSum');     // Reutilizado, ahora con lógica de modificación
    const pendingInvoicesCount = document.getElementById('pendingInvoicesCount');
    const pendingInvoicesSum = document.getElementById('pendingInvoicesSum');
    const annulledInvoicesCount = document.getElementById('annulledInvoicesCount'); 
    const annulledInvoicesSum = document.getElementById('annulledInvoicesSum');     
    // --- Fin Selectores Resumen Facturación ACTUALIZADOS ---

    const statusModal = document.getElementById('statusModal');
    const modalFacturaId = document.getElementById('modalFacturaId');
    const modalCurrentStatusDisplay = document.getElementById('modalCurrentStatusDisplay');
    const modalNewStatus = document.getElementById('modalNewStatus');
    const saveStatusBtn = document.getElementById('saveStatusBtn');
    const cancelStatusBtn = document.getElementById('cancelStatusBtn');
    const invoiceDetailSearchIdInput = document.getElementById('invoiceDetailSearchIdInput');
    const invoiceDetailStartDateInput = document.getElementById('invoiceDetailStartDateInput');
    const invoiceDetailEndDateInput = document.getElementById('invoiceDetailEndDateInput');
    const searchInvoiceDetailsBtn = document.getElementById('searchInvoiceDetailsBtn');
    const clearInvoiceDetailsSearchBtn = document.getElementById('clearInvoiceDetailsSearchBtn');
    const exportFacturacionExcelBtn = document.getElementById('exportFacturacionExcelBtn');
    const viewPaidInvoicesBtn = document.getElementById('viewPaidInvoicesBtn');
    const viewRecaudoPaidInvoicesBtn = document.getElementById('viewRecaudoPaidInvoicesBtn');
    const paidInvoicesModal = document.getElementById('paidInvoicesModal');
    const closePaidModalBtn = document.getElementById('closePaidModalBtn');
    const paidInvoicesTableBody = document.getElementById('paidInvoicesTableBody');
    const paidModalTitle = document.getElementById('paidModalTitle');
    const statusSelectionModal = document.getElementById('statusSelectionModal');
    const statusSelect = document.getElementById('statusSelect');
    const confirmStatusSelectionBtn = document.getElementById('confirmStatusSelectionBtn');
    const cancelStatusSelectionBtn = document.getElementById('cancelStatusSelectionBtn');
    const paidSearchInput = document.getElementById('paidSearchInput');
    const paidStartDateInput = document.getElementById('paidStartDateInput');
    const paidEndDateInput = document.getElementById('paidEndDateInput');
    const paidFilterBtn = document.getElementById('paidFilterBtn');
    const paidClearBtn = document.getElementById('paidClearBtn');
    const exportPaidExcelBtn = document.getElementById('exportPaidExcelBtn');
    const paidModifierFilter = document.getElementById('paidModifierFilter');
    const paidInvoicesTotalSum = document.getElementById('paidInvoicesTotalSum');
    
    // --- [NUEVOS SELECTORES] Añadimos los selectores para el modal de editar monto ---
    const editInvoiceModal = document.getElementById('editInvoiceModal');
    const editInvoiceForm = document.getElementById('editInvoiceForm');
    const editInvoiceId = document.getElementById('editInvoiceId');
    const editInvoiceDisplayId = document.getElementById('editInvoiceDisplayId');
    const editInvoiceDisplayConcept = document.getElementById('editInvoiceDisplayConcept');
    const editInvoiceMonto = document.getElementById('editInvoiceMonto');
    const cancelEditInvoiceBtn = document.getElementById('cancelEditInvoiceBtn');
    // --- Fin [NUEVOS SELECTORES] ---

    // --- Selectores Módulo Ingresos y Gastos ---
    const exportIngresosgastosExcelBtn = document.getElementById('exportIngresos-gastosExcelBtn');
    const totalIncomeDisplay = document.getElementById('totalIncome');
    const totalExpensesDisplay = document.getElementById('totalExpenses');
    const profitLossDisplay = document.getElementById('profitLoss');
    const profitLossStartDate = document.getElementById('profitLossStartDate');
    const profitLossEndDate = document.getElementById('profitLossEndDate');
    const filterProfitLossBtn = document.getElementById('filterProfitLossBtn');
    const clearProfitLossFilterBtn = document.getElementById('clearProfitLossFilterBtn');
    const expensesTableBody = document.getElementById('expensesTableBody');
    const newCategoryInput = document.getElementById('newCategoryInput');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const cancelAddCategoryBtn = document.getElementById('cancelAddCategoryBtn');
    const expenseStartDateFilter = document.getElementById('expenseStartDateFilter');
    const expenseEndDateFilter = document.getElementById('expenseEndDateFilter');
    const filterExpensesBtn = document.getElementById('filterExpensesBtn');
    const clearExpensesFilterBtn = document.getElementById('clearExpensesFilterBtn');
    const addRecurringExpenseBtn = document.getElementById('addRecurringExpenseBtn');
    const recurringExpenseFormContainer = document.getElementById('recurringExpenseFormContainer');
    const recurringExpenseForm = document.getElementById('recurringExpenseForm');
    const recurringExpenseFormTitle = document.getElementById('recurringExpenseFormTitle');
    const recurringExpenseId = document.getElementById('recurringExpenseId');
    const recurringExpenseCategory = document.getElementById('recurringExpenseCategory');
    const recurringExpenseDescription = document.getElementById('recurringExpenseDescription');
    const recurringExpenseAmount = document.getElementById('recurringExpenseAmount');
    const cancelRecurringExpenseBtn = document.getElementById('cancelRecurringExpenseBtn');
    const recurringExpensesTableBody = document.getElementById('recurringExpensesTableBody');
    const registerSelectedExpensesBtn = document.getElementById('registerSelectedExpensesBtn');
    const bulkRegisterDate = document.getElementById('bulkRegisterDate');
    const selectAllRecurringExpenses = document.getElementById('selectAllRecurringExpenses');

    // --- Selectores y Variables para Recibo PDF ---
    const pdfActionModal = document.getElementById('pdfActionModal');
    const imprimirReciboBtn = document.getElementById('imprimirReciboBtn');
    const descargarReciboBtn = document.getElementById('descargarReciboBtn');
    const cancelPdfActionBtn = document.getElementById('cancelPdfActionBtn');
    let datosParaRecibo = {};

    // =================================================================
    // FUNCIONES DE ÍCONOS (NUEVAS)
    // =================================================================

    const getIconSvg = (iconName) => {
        const icons = {
            // Ícono de Lápiz para Editar
            edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>',
            // Ícono de Papelera para Eliminar
            delete: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM11 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5z"/></svg>'
        };
        return icons[iconName] || '';
    };
    
    // =================================================================
    // FIN FUNCIONES DE ÍCONOS
    // =================================================================


    function formatCurrency(value) {
        if (value === null || isNaN(value)) {
            return '$0';
        }
        // Usamos Intl.NumberFormat para formatear la moneda sin decimales.
        const formatter = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP', // Asumiendo pesos colombianos, ajusta si es necesario
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        // Removemos el símbolo de moneda para solo devolver el número formateado con el signo '$'
        return `$${parseFloat(value).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }

    userMenuButton.addEventListener('click', () => {
        userMenuDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!userMenuButton.contains(e.target) && !userMenuDropdown.contains(e.target)) {
            userMenuDropdown.classList.add('hidden');
        }
    });

    openChangePasswordModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        userMenuDropdown.classList.add('hidden');
        changePasswordModal.classList.remove('hidden');
        changePasswordForm.reset();
    });

    cancelChangePasswordBtn.addEventListener('click', () => {
        changePasswordModal.classList.add('hidden');
    });

    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPasswordValue = newPassword.value;
        const confirmNewPasswordValue = confirmNewPassword.value;

        if (newPasswordValue.length < 6) {
            alert('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (newPasswordValue !== confirmNewPasswordValue) {
            alert('Las contraseñas no coinciden. Por favor, inténtelo de nuevo.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}api_users.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'change_self_password',
                    new_password: newPasswordValue,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error desconocido al cambiar la contraseña.');
            }

            const result = await response.json();
            alert(result.message);
            changePasswordModal.classList.add('hidden');
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            alert('Error al cambiar la contraseña: ' + error.message);
        }
    });

    function setupExportButtons() {
        if (exportGestionUsersExcelBtn) {
            exportGestionUsersExcelBtn.addEventListener('click', () => {
                exportTableToXLSX('gestionUsersTable', 'Usuarios_de_Gestion');
            });
        }
        if (exportClientesExcelBtn) {
            exportClientesExcelBtn.addEventListener('click', () => {
                exportTableToXLSX('clientesTable', 'Clientes');
            });
        }
        if (exportPlanesExcelBtn) {
            exportPlanesExcelBtn.addEventListener('click', () => {
                exportTableToXLSX('plansTable', 'Planes');
            });
        }
        if (exportFacturacionExcelBtn) {
            exportFacturacionExcelBtn.addEventListener('click', () => {
                exportTableToXLSX('facturasTable', 'Facturas');
            });
        }
        if (exportIngresosgastosExcelBtn) {
            exportIngresosgastosExcelBtn.addEventListener('click', () => {
                exportTableToXLSX('expensesTable', 'Historial_Gastos_Registrados');
            });
        }
        const exportAsignadosBtn = document.getElementById('exportAsignadosExcelBtn');
        if (exportAsignadosBtn) {
            exportAsignadosBtn.addEventListener('click', () => {
                exportTableToXLSX('tablaActivosAsignados', 'Activos_Asignados');
            });
        }
        const exportDisponiblesBtn = document.getElementById('exportDisponiblesExcelBtn');
        if (exportDisponiblesBtn) {
            exportDisponiblesBtn.addEventListener('click', () => {
                exportTableToXLSX('tablaAsignacionActivos', 'Inventario_Disponible');
            });
        }
        const exportRecaudoBtn = document.getElementById('exportRecaudoExcelBtn');
        if (exportRecaudoBtn) {
            exportRecaudoBtn.addEventListener('click', () => {
                exportTableToXLSX('recaudoFacturasTable', 'Facturas_Pendientes_Recaudo');
            });
        }
    }


    function exportTableToXLSX(tableId, filename) {
        const table = document.getElementById(tableId);
        if (!table) {
            alert(`No se encontró la tabla con ID '${tableId}' para exportar.`);
            return;
        }

        const data = [];
        const headers = [];
        const tHead = table.querySelector('thead');
        const tBody = table.querySelector('tbody');

        let actionCellIndex = -1;
        tHead.querySelectorAll('tr th').forEach((th, index) => {
            const headerText = th.textContent.trim();
            if (headerText === 'Acciones' || headerText === 'Recibo') { // Añadir 'Recibo' para ignorar en exportación
                actionCellIndex = index;
            } else if (th.querySelector('input[type="checkbox"]')) {
            }
            else {
                headers.push(headerText);
            }
        });
        data.push(headers);
        
        const valorColumnIndex = headers.indexOf('Valor');
        const montoColumnIndex = headers.indexOf('Monto');
        // AÑADIR ESTA VARIABLE PARA LA CORRECCIÓN DE NOTAS
        const notasColumnIndex = headers.indexOf('Notas'); 

        tBody.querySelectorAll('tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach((td, index) => {
                // Verificar si esta columna es la de Acciones/Recibo (índice 7 u 8 dependiendo de la tabla)
                const headerCount = tHead.querySelectorAll('tr th').length;
                let isActionOrReceiptColumn = false;
                
                // Lógica de exclusión de columnas de acción
                if (headerCount === 8 && index === 7 && tableId === 'recaudoFacturasTable') {
                    isActionOrReceiptColumn = true; // Excluye "Acciones" en la tabla de Recaudo
                } else if (headerCount === 8 && index === 7 && tableId === 'facturasTable') {
                    isActionOrReceiptColumn = true; // Excluye "Acciones" en la tabla de Facturación
                } else if (tableId === 'paidInvoicesTable' && (index === 7 || index === 8)) {
                    // Excluye las columnas extra que se puedan añadir al modal (Fecha Modificación y Recibo)
                    // Hacemos el check más robusto:
                    const headerText = tHead.querySelectorAll('tr th')[index]?.textContent.trim();
                    if (headerText === 'Fecha Modificación' || headerText === 'Recibo') {
                         // No hay que hacer nada, ya se maneja en el array de headers que no las incluye
                    }
                }
                
                // Lógica alternativa para ignorar la última columna si es Acciones o Recibo
                const allCells = row.querySelectorAll('td');
                const cellHeader = tHead.querySelectorAll('tr th')[index]?.textContent.trim();
                if (cellHeader === 'Acciones' || cellHeader === 'Recibo') {
                     return;
                }
                if (td.querySelector('input[type="checkbox"]')) return;

                let cellValue;

                // --- INICIO CORRECCIÓN: Leer el valor completo de Notas para tabla Activos Asignados ---
                if (tableId === 'tablaActivosAsignados' && index === notasColumnIndex) {
                    cellValue = td.dataset.exportNotes || td.textContent.trim();
                }
                // --- FIN CORRECCIÓN ---
                else if (index === valorColumnIndex || index === montoColumnIndex) {
                    const textValue = td.textContent.trim();
                    const numericValue = parseInt(textValue.replace(/[^0-9]/g, ''), 10);
                    
                    if (!isNaN(numericValue)) {
                        cellValue = numericValue;
                    } else {
                        cellValue = 0;
                    }
                } else {
                    cellValue = td.textContent.trim();
                }
                
                rowData.push(cellValue);
            });
            if (rowData.length > 0) {
               data.push(rowData);
            }
        });

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, filename);

        XLSX.writeFile(wb, `${filename}.xlsx`);
    }

    async function checkSession() {
        try {
            const response = await fetch(`${API_BASE_URL}check_session.php`);
            if (!response.ok) {
                window.location.href = 'index.html';
                return;
            }
            const sessionData = await response.json();
            userSession = sessionData;
            
            if (!userSession.loggedin) {
                window.location.href = 'index.html';
                return;
            }

            welcomeMessage.textContent = `Bienvenido(a), ${userSession.username} (${userSession.role})`;
            applyModulePermissions(userSession.allowed_modules); 
        } catch (error) {
            console.error('Error al verificar la sesión:', error);
            alert('Error al verificar la sesión. Por favor, inicie sesión de nuevo.');
            window.location.href = 'index.html';
        }
    }

    function applyModulePermissions(allowedModules) {
        sidebarLinks.forEach(link => {
            const moduleName = link.dataset.module;
            const moduleSection = document.getElementById(`${moduleName}-module`);

            if (userSession.role === 'SuperAdmin' || (allowedModules && allowedModules.includes(moduleName))) {
                link.style.display = '';
                if (moduleSection) {
                    moduleSection.style.display = '';
                }
            } else {
                link.style.display = 'none';
                if (moduleSection) {
                    moduleSection.style.display = 'none';
                }
            }
        });
    }

    async function handleInitialLoad() {
        await checkSession();
        
        setupExportButtons();
        
        moduleContents.forEach(content => content.classList.remove('active'));
        sidebarLinks.forEach(link => link.classList.remove('active'));
        if (emptySpaceModule) {
            emptySpaceModule.classList.add('active');
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('external-link')) {
                return;
            }

            e.preventDefault();
            if (link.style.display === 'none') {
                console.warn('Acceso denegado a este módulo.');
                return;
            }
            
            if (emptySpaceModule) {
                emptySpaceModule.classList.remove('active');
            }

            sidebarLinks.forEach(item => item.classList.remove('active'));
            moduleContents.forEach(content => content.classList.remove('active'));
            link.classList.add('active');
            const targetModuleId = link.dataset.module + '-module';
            const targetModule = document.getElementById(targetModuleId);
            if (targetModule) {
                targetModule.classList.add('active');
                switch (link.dataset.module) {
                    case 'usuarios':
                        loadUsers();
                        userFormContainer.classList.add('hidden');
                        userForm.reset();
                        userId.value = '';
                        originalUserId.value = '';
                        manageUserPlansSection.classList.add('hidden');
                        currentEditingUserId = null;
                        modulePermissionsSection.classList.add('hidden');
                        moduleCheckboxes.innerHTML = '';
                        passwordFields.classList.remove('hidden');
                        userPassword.required = false;
                        userConfirmPassword.required = false;
                        userPassword.value = '';
                        userConfirmPassword.value = '';
                        break;
                    case 'planes':
                        loadPlans();
                        planFormContainer.classList.add('hidden');
                        planForm.reset();
                        planId.value = '';
                        break;
                    case 'facturacion':
                        resetFacturacionForm();
                        // Al cargar el módulo, cargamos todas las facturas sin filtro de estado inicial
                        loadFacturas({ targetTableBody: facturasTableBody });
                        break;
                    case 'recaudo':
                        initializeRecaudoModule();
                        break;
                    case 'ingresos-gastos':
                        profitLossStartDate.value = '';
                        profitLossEndDate.value = '';
                        loadIncomeAndExpenses(); 
                        loadRecurringExpenses(); 
                        loadExpenseCategories();
                        recurringExpenseFormContainer.classList.add('hidden');
                        recurringExpenseForm.reset();
                        recurringExpenseId.value = '';
                        newCategoryInput.classList.add('hidden');
                        addCategoryBtn.classList.add('hidden');
                        cancelAddCategoryBtn.classList.add('hidden');
                        if (bulkRegisterDate) {
                            bulkRegisterDate.value = new Date().toISOString().slice(0, 10);
                        }
                        break;
                    case 'inventario':
                        cargarTiposDeActivos();
                        window.cargarActivosAsignados(); // CORRECCIÓN 1: Llamar como función global
                        break;
                }
            }
        });
    });
    
    handleInitialLoad();
    
    // =================================================================
    // MÓDULO USUARIOS
    // =================================================================
    
    async function loadRoles() {
        try {
            const response = await fetch(`${API_BASE_URL}api_roles.php?action=get_roles`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorText}`);
            }
            allRoles = await response.json();
            userRoleSelect.innerHTML = '<option value="">Seleccione un rol</option>';
            allRoles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.rol_id;
                option.textContent = role.nombre_rol;
                userRoleSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar roles:', error);
            alert('Error al cargar roles. Verifique la consola para más detalles.');
        }
    }

    userRoleSelect.addEventListener('change', async () => {
        const selectedRoleObject = allRoles.find(role => String(role.rol_id) === userRoleSelect.value);
        const selectedRoleName = selectedRoleObject ? selectedRoleObject.nombre_rol : '';

        if (selectedRoleName === 'Usuario de Gestión' || selectedRoleName === 'SuperAdmin') {
            passwordFields.classList.remove('hidden');
            userPassword.required = true;
            userConfirmPassword.required = true;
            modulePermissionsSection.classList.remove('hidden');
            moduleCheckboxes.innerHTML = '';
            allModules.forEach(module => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <input type="checkbox" id="module-${module}" value="${module}" class="mr-2">
                    <label for="module-${module}" class="text-gray-700">${module.charAt(0).toUpperCase() + module.slice(1).replace('-', ' ')}</label>
                `;
                moduleCheckboxes.appendChild(div);
            });
            manageUserPlansSection.classList.add('hidden');
        } else if (selectedRoleName === 'Cliente') {
            passwordFields.classList.add('hidden');
            userPassword.required = false;
            userConfirmPassword.required = false;
            userPassword.value = '';
            userConfirmPassword.value = '';
            modulePermissionsSection.classList.add('hidden');
            moduleCheckboxes.innerHTML = '';
            manageUserPlansSection.classList.remove('hidden');
            await loadAllPlansForAssignment();
        } else {
            passwordFields.classList.add('hidden');
            userPassword.required = false;
            userConfirmPassword.required = false;
            userPassword.value = '';
            userConfirmPassword.value = '';
            modulePermissionsSection.classList.add('hidden');
            moduleCheckboxes.innerHTML = '';
            manageUserPlansSection.classList.add('hidden');
        }
    });

    // --- INICIO MODIFICACIÓN BÚSQUEDA INSTANTÁNEA: MÓDULO USUARIOS ---
    const handleUserSearch = () => {
        const searchQuery = userSearchInput.value.trim();
        loadUsers(searchQuery);
    };

    if (searchUserBtn) {
        searchUserBtn.addEventListener('click', handleUserSearch);
    }

    if (clearUserSearchBtn) {
        clearUserSearchBtn.addEventListener('click', () => {
            userSearchInput.value = '';
            loadUsers();
        });
    }

    if (userSearchInput) {
        // ✨ Búsqueda instantánea al escribir (input event)
        userSearchInput.addEventListener('input', handleUserSearch);
        
        // Manejar 'Enter'
        userSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Evitar cualquier acción por defecto (como submit)
                handleUserSearch();
            }
        });
    }
    // --- FIN MODIFICACIÓN BÚSQUEDA INSTANTÁNEA: MÓDULO USUARIOS ---

    async function loadAllPlansForAssignment() {
        try {
            const response = await fetch(`${API_BASE_URL}api_users.php?action=get_all_plans`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error HTTP! estado: ${response.status}`);
            }
            const plans = await response.json();
            assignPlanSelect.innerHTML = '<option value="">Seleccione un plan</option>';
            plans.forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.plan_id;
                option.textContent = `${plan.nombre_plan} (${plan.velocidad} - ${formatCurrency(plan.precio)})`;
                assignPlanSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar todos los planes para asignación:', error);
            alert('Error al cargar planes para asignación. Verifica la consola para más detalles.');
        }
    }

    async function loadAssignedPlansForUser(userId) {
        assignedPlansList.innerHTML = '<p class="text-gray-500">Cargando planes asignados...</p>';
        try {
            const response = await fetch(`${API_BASE_URL}api_users.php?id=${userId}&context=admin`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorData.error || 'Error desconocido'}`);
            }
            const user = await response.json();
            const assignedPlans = user.planes_asignados || [];
            assignedPlansList.innerHTML = '';
            if (assignedPlans.length === 0) {
                assignedPlansList.insertAdjacentHTML('beforeend', '<p class="text-gray-500">No hay planes asignados a este usuario.</p>');
                return;
            }
            assignedPlans.forEach(plan => {
                const planItem = `
                    <div class="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-md shadow-sm">
                        <span>${plan.nombre_plan} (${plan.velocidad} - ${formatCurrency(plan.precio)}) (${plan.estado_plan})</span>
                        <div class="space-x-2">
                            <button class="text-yellow-600 hover:text-yellow-800 text-sm" onclick="changeAssignedPlanStatus(${plan.usuario_plan_id}, '${plan.estado_plan}', ${plan.usuario_id})">Cambiar Estado</button>
                            <button class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md text-sm" onclick="removeAssignedPlan(${plan.usuario_plan_id}, ${plan.usuario_id})">Eliminar</button>
                        </div>
                    </div>
                `;
                assignedPlansList.insertAdjacentHTML('beforeend', planItem);
            });
        } catch (error) {
            console.error('Error al cargar planes asignados:', error);
            assignedPlansList.innerHTML = `<p class="text-red-500">Error al cargar planes asignados: ${error.message}</p>`;
        }
    };

    window.changeAssignedPlanStatus = async (usuarioPlanId, currentStatus, userId) => {
        const newStatus = prompt(`Cambiar estado del plan asignado ${usuarioPlanId} (Actual: ${currentStatus}). Ingrese nuevo estado (Activo, Inactivo, Suspendido):`, currentStatus);
        if (newStatus === null) return;
        if (!['Activo', 'Inactivo', 'Suspendido'].includes(newStatus)) {
            alert('Estado inválido. Use "Activo", "Inactivo" o "Suspendido".');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}api_users.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_assigned_plan_status', usuario_plan_id: usuarioPlanId, estado_plan: newStatus })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorData.error || 'Error desconocido'}`);
            }
            const result = await response.json();
            alert(result.message);
            loadAssignedPlansForUser(userId);
            loadUsers();
        } catch (error) {
            console.error('Error al cambiar estado del plan asignado:', error);
            alert('Error al cambiar estado del plan asignado: ' + error.message);
        }
    };

    window.removeAssignedPlan = async (usuarioPlanId, userId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este plan asignado al usuario?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}api_users.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'remove_assigned_plan', usuario_plan_id: usuarioPlanId })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorData.error || 'Error desconocido'}`);
            }
            const result = await response.json();
            alert(result.message);
            loadAssignedPlansForUser(userId);
            loadUsers();
        } catch (error) {
            console.error('Error al eliminar plan asignado:', error);
            alert('Error al eliminar plan asignado: ' + error.message);
        }
    };

    assignPlanBtn.addEventListener('click', async () => {
        const planToAssignId = assignPlanSelect.value;
        if (!currentEditingUserId) {
            alert('Error: No hay un usuario seleccionado para asignar planes.');
            return;
        }
        if (!planToAssignId) {
            alert('Por favor, seleccione un plan para asignar.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}api_users.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'assign_plan', usuario_id: currentEditingUserId, plan_id: planToAssignId })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorData.error || 'Error desconocido'}`);
            }
            const result = await response.json();
            alert(result.message);
            assignPlanSelect.value = '';
            loadAssignedPlansForUser(currentEditingUserId);
            loadUsers();
        } catch (error) {
            console.error('Error al asignar plan:', error);
            alert('Error al asignar plan: ' + error.message);
        }
    });

    async function loadUsers(searchQuery = '') {
        const headers = { 'Content-Type': 'application/json' };
        let url = `${API_BASE_URL}api_users.php`;
        const params = new URLSearchParams();
        if (searchQuery) {
            params.append('search', searchQuery);
        }
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorText}`);
            }
            const users = await response.json();
            clientesTableBody.innerHTML = '';
            gestionUsersTableBody.innerHTML = '';
            
            const clientes = users.filter(user => user.nombre_rol === 'Cliente');
            const gestionUsers = users.filter(user => user.nombre_rol !== 'Cliente');

            if (clientes.length === 0) {
                clientesTableBody.insertAdjacentHTML('beforeend', '<tr><td colspan="8" class="py-4 px-6 text-center text-gray-500">No hay clientes registrados que coincidan con la búsqueda.</td></tr>');
            } else {
                clientes.forEach(user => {
                    const row = `
                        <tr>
                            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">${user.usuario_id}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.nombre}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.correo}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.celular || 'N/A'}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.direccion || 'N/A'}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.nombre_rol || 'Sin Rol'}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.nombre_plan_principal || 'Sin plan'}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium space-x-2">
                                <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg shadow-md" onclick="editUser(${user.usuario_id})" title="Editar">${getIconSvg('edit')}</button>
                                <button class="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg shadow-md" onclick="deleteUser(${user.usuario_id})" title="Eliminar">${getIconSvg('delete')}</button>
                            </td>
                        </tr>
                    `;
                    clientesTableBody.insertAdjacentHTML('beforeend', row);
                });
            }

            if (gestionUsers.length === 0) {
                gestionUsersTableBody.insertAdjacentHTML('beforeend', '<tr><td colspan="8" class="py-4 px-6 text-center text-gray-500">No hay usuarios de gestión registrados que coincidan con la búsqueda.</td></tr>');
            } else {
                gestionUsers.forEach(user => {
                    const row = `
                        <tr>
                            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">${user.usuario_id}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.nombre}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.correo}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.celular || 'N/A'}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.direccion || 'N/A'}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${user.nombre_rol || 'Sin Rol'}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">N/A</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium space-x-2">
                                <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg shadow-md" onclick="editUser(${user.usuario_id})" title="Editar">${getIconSvg('edit')}</button>
                                <button class="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg shadow-md" onclick="deleteUser(${user.usuario_id})" title="Eliminar">${getIconSvg('delete')}</button>
                            </td>
                        </tr>
                    `;
                    gestionUsersTableBody.insertAdjacentHTML('beforeend', row);
                });
            }

        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            usersTableBody.innerHTML = `<tr><td colspan="8" class="py-4 px-6 text-center text-red-500">Error al cargar usuarios: ${error.message}</td></tr>`;
            alert('Error al cargar usuarios. Verifica la consola para más detalles.');
        }
    };

    addUserBtn.addEventListener('click', async () => {
        userFormContainer.classList.remove('hidden');
        userFormTitle.textContent = 'Agregar Nuevo Usuario';
        userForm.reset();
        userId.value = '';
        originalUserId.value = '';
        manageUserPlansSection.classList.add('hidden');
        currentEditingUserId = null;
        assignedPlansList.innerHTML = '';
        await loadRoles();
        userRoleSelect.value = '';
        passwordFields.classList.remove('hidden');
        userPassword.required = true;
        userConfirmPassword.required = true;
        userPassword.value = '';
        userConfirmPassword.value = '';
        modulePermissionsSection.classList.add('hidden');
        moduleCheckboxes.innerHTML = '';
    });

    cancelUserBtn.addEventListener('click', () => {
        userFormContainer.classList.add('hidden');
        userForm.reset();
        userId.value = '';
        originalUserId.value = '';
        manageUserPlansSection.classList.add('hidden');
        currentEditingUserId = null;
        modulePermissionsSection.classList.add('hidden');
        moduleCheckboxes.innerHTML = '';
        passwordFields.classList.remove('hidden');
        userPassword.required = false;
        userConfirmPassword.required = false;
        userPassword.value = '';
        userConfirmPassword.value = '';
    });

    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submittedUserId = userId.value.trim();
        const currentOriginalUserId = originalUserId.value.trim();
        const selectedRoleId = userRoleSelect.value;
        const selectedRoleObject = allRoles.find(role => String(role.rol_id) === selectedRoleId);
        const selectedRoleName = selectedRoleObject ? selectedRoleObject.nombre_rol : '';

        if (!selectedRoleId) {
            alert('Por favor, seleccione un rol para el usuario.');
            return;
        }

        const password = userPassword.value;
        const confirmPassword = userConfirmPassword.value;

        if (selectedRoleName !== 'Cliente') {
            if (userFormTitle.textContent === 'Agregar Nuevo Usuario' || (password !== '' || confirmPassword !== '')) {
                if (password === '') {
                    alert('La contraseña es requerida para un nuevo usuario que no sea Cliente.');
                    return;
                }
                if (password.length < 6) {
                    alert('La contraseña debe tener al menos 6 caracteres.');
                    return;
                }
                if (password !== confirmPassword) {
                    alert('Las contraseñas no coinciden.');
                    return;
                }
            }
        } else {
            if (password !== '' || confirmPassword !== '') {
                alert('Los clientes no necesitan contraseña para acceder al panel. Los campos de contraseña deben estar vacíos.');
                userPassword.value = '';
                userConfirmPassword.value = '';
                return;
            }
        }

        let selectedModules = [];
        if (selectedRoleName === 'Usuario de Gestión' || selectedRoleName === 'SuperAdmin') {
            const checkboxes = moduleCheckboxes.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(cb => selectedModules.push(cb.value));
        }

        let assignedPlanId = null;
        if (selectedRoleName === 'Cliente' && userFormTitle.textContent === 'Agregar Nuevo Usuario') {
            assignedPlanId = assignPlanSelect.value;
            if (!assignedPlanId) {
                alert('Por favor, seleccione un plan para el cliente.');
                return;
            }
        }

        const user = {
            nombre: userName.value,
            correo: userEmail.value,
            celular: userPhone.value,
            direccion: userAddress.value,
            rol_id: selectedRoleId,
            allowed_modules: selectedModules,
            plan_id: assignedPlanId
        };

        if (!user.nombre || !user.correo) {
            alert('Por favor, completa todos los campos requeridos (Nombre, Correo).');
            return;
        }

        if (password) {
            user.new_password = password;
        }

        let actionType;
        let requestBodyData;
        if (userFormTitle.textContent === 'Editar Usuario') {
            actionType = 'update_user';
            if (!currentOriginalUserId) {
                alert('Error: No se pudo determinar el ID original del usuario para editar.');
                return;
            }
            requestBodyData = { action: actionType, original_id: currentOriginalUserId, usuario_id: submittedUserId, ...user };
        } else {
            actionType = 'create_user';
            requestBodyData = { action: actionType, usuario_id: submittedUserId !== '' ? submittedUserId : null, ...user };
        }

        try {
            const response = await fetch(`${API_BASE_URL}api_users.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBodyData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error HTTP! estado: ${response.status}`);
            }
            const result = await response.json();
            alert(result.message);
            userFormContainer.classList.add('hidden');
            userForm.reset();
            userId.value = '';
            originalUserId.value = '';
            manageUserPlansSection.classList.add('hidden');
            currentEditingUserId = null;
            modulePermissionsSection.classList.add('hidden');
            moduleCheckboxes.innerHTML = '';
            passwordFields.classList.remove('hidden');
            userPassword.required = false;
            userConfirmPassword.required = false;
            userPassword.value = '';
            userConfirmPassword.value = '';
            loadUsers();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            alert('Error al guardar usuario: ' + error.message);
        }
    });

    window.editUser = async (id) => {
        try {
            await loadAllPlansForAssignment();
            await loadRoles();
            const response = await fetch(`${API_BASE_URL}api_users.php?id=${id}&context=admin`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorText}`);
            }
            const user = await response.json();

            if (user) {
                document.querySelectorAll('.module-content').forEach(content => content.classList.remove('active'));
                document.getElementById('usuarios-module').classList.add('active');
                
                userFormContainer.classList.remove('hidden');
                userFormTitle.textContent = 'Editar Usuario';

                setTimeout(() => {
                    userFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);

                userId.value = user.usuario_id;
                originalUserId.value = user.usuario_id;
                userName.value = user.nombre;
                userEmail.value = user.correo;
                userPhone.value = user.celular || '';
                userAddress.value = user.direccion || '';
                userRoleSelect.value = user.rol_id;

                // 🌟 CORRECCIÓN CLAVE: Buscar el rol por el ID de rol del usuario.
                const selectedRoleObject = allRoles.find(role => String(role.rol_id) === String(user.rol_id));
                const selectedRoleName = selectedRoleObject ? selectedRoleObject.nombre_rol : '';

                manageUserPlansSection.classList.add('hidden');
                passwordFields.classList.add('hidden');
                modulePermissionsSection.classList.add('hidden');
                moduleCheckboxes.innerHTML = '';
                userPassword.required = false;
                userConfirmPassword.required = false;
                userPassword.value = '';
                userConfirmPassword.value = '';

                if (selectedRoleName === 'Cliente') {
                    manageUserPlansSection.classList.remove('hidden');
                    currentEditingUserId = user.usuario_id;
                    loadAssignedPlansForUser(user.usuario_id);
                } else if (selectedRoleName === 'Usuario de Gestión' || selectedRoleName === 'SuperAdmin') {
                    passwordFields.classList.remove('hidden');
                    modulePermissionsSection.classList.remove('hidden');
                    allModules.forEach(module => {
                        const div = document.createElement('div');
                        const isChecked = user.allowed_modules && user.allowed_modules.includes(module);
                        div.innerHTML = `
                            <input type="checkbox" id="module-${module}" value="${module}" ${isChecked ? 'checked' : ''} class="mr-2">
                            <label for="module-${module}" class="text-gray-700">${module.charAt(0).toUpperCase() + module.slice(1).replace('-', ' ')}</label>
                        `;
                        moduleCheckboxes.appendChild(div);
                    });
                }
            }
        } catch (error) {
            console.error('Error al obtener usuario para editar:', error);
            alert('Error al cargar datos del usuario para edición. Verifica la consola para más detalles.');
        }
    };

    window.deleteUser = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Se eliminarán también sus planes asignados, facturas y los activos asociados serán reasignados a "Empresa".')) return;
        try {
            const response = await fetch(`${API_BASE_URL}api_users.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_user', usuario_id: id })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorData.error || 'Error desconocido'}`);
            }
            const result = await response.json();
            alert(result.message);
            loadUsers();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert('Error al eliminar usuario: ' + error.message);
        }
    };
    
    // =================================================================
    // MÓDULO PLANES
    // =================================================================
    
    async function loadPlans() {
        try {
            const response = await fetch(`${API_BASE_URL}api_plans.php`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorText}`);
            }
            const plans = await response.json();
            plansTableBody.innerHTML = '';
            if (plans.length === 0) {
                plansTableBody.insertAdjacentHTML('beforeend', '<tr><td colspan="5" class="py-4 px-6 text-center text-gray-500">No hay planes registrados.</td></tr>');
                return;
            }
            plans.forEach(plan => {
                const row = `
                    <tr>
                        <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">${plan.plan_id}</td>
                        <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${plan.nombre_plan}</td>
                        <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${plan.velocidad}</td>
                        <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${formatCurrency(plan.precio)}</td>
                        <td class="py-4 px-6 whitespace-nowrap text-sm font-medium space-x-2">
                            <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg shadow-md" onclick="editPlan(${plan.plan_id})" title="Editar">${getIconSvg('edit')}</button>
                            <button class="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg shadow-md" onclick="deletePlan(${plan.plan_id})" title="Eliminar">${getIconSvg('delete')}</button>
                        </td>
                    </tr>
                `;
                plansTableBody.insertAdjacentHTML('beforeend', row);
            });
        } catch (error) {
            console.error('Error al cargar planes:', error);
            alert('Error al cargar planes. Verifica la consola para más detalles.');
        }
    };

    addPlanBtn.addEventListener('click', () => {
        planFormContainer.classList.remove('hidden');
        planFormTitle.textContent = 'Agregar Nuevo Plan';
        planForm.reset();
        planId.value = '';
    });

    cancelPlanBtn.addEventListener('click', () => {
        planFormContainer.classList.add('hidden');
        planForm.reset();
    });

    planForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const plan = {
            nombre_plan: planName.value,
            velocidad: planSpeed.value,
            precio: parseFloat(planPrice.value)
        };
        if (!plan.nombre_plan || !plan.velocidad || isNaN(plan.precio)) {
            alert('Por favor, completa todos los campos requeridos (Nombre del Plan, Velocidad, Valor).');
            return;
        }
        let actionType;
        let requestBodyData;
        if (planId.value) {
            actionType = 'update_plan';
            requestBodyData = { action: actionType, plan_id: planId.value, ...plan };
        } else {
            actionType = 'create_plan';
            requestBodyData = { action: actionType, ...plan };
        }
        try {
            const response = await fetch(`${API_BASE_URL}api_plans.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBodyData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorData.error || 'Error desconocido'}`);
            }
            const result = await response.json();
            alert(result.message);
            planFormContainer.classList.add('hidden');
            loadPlans();
            loadUsers();
        } catch (error) {
            console.error('Error al guardar plan:', error);
            alert('Error al guardar plan: ' + error.message);
        }
    });

    window.editPlan = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}api_plans.php?id=${id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorText}`);
            }
            const plan = await response.json();
            if (plan) {
                document.querySelectorAll('.module-content').forEach(content => content.classList.remove('active'));
                document.getElementById('planes-module').classList.add('active');

                planFormContainer.classList.remove('hidden');
                planFormTitle.textContent = 'Editar Plan';

                setTimeout(() => {
                    planFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);

                planId.value = plan.plan_id;
                planName.value = plan.nombre_plan;
                planSpeed.value = plan.velocidad;
                planPrice.value = plan.precio;
            }
        } catch (error) {
            console.error('Error al obtener plan para editar:', error);
            alert('Error al cargar datos del plan para edición. Verifica la consola para más detalles.');
        }
    };

    window.deletePlan = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este plan? Esto podría afectar a los usuarios asignados y facturas.')) return;
        try {
            const response = await fetch(`${API_BASE_URL}api_plans.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_plan', plan_id: id })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorData.error || 'Error desconocido'}`);
            }
            const result = await response.json();
            alert(result.message);
            loadPlans();
            loadUsers();
        } catch (error) {
            console.error('Error al eliminar plan:', error);
            alert('Error al eliminar plan: ' + error.message);
        }
    };
    
    // =================================================================
    // MÓDULO FACTURACIÓN (REESTRUCTURADO)
    // =================================================================

    function resetFacturacionForm() {
        facturacionForm.reset();
        facturacionModeSelect.value = '';
        facturaIndividualContainer.classList.add('hidden');
        facturaConceptoContainer.classList.add('hidden');
        montoYBotonesContainer.classList.add('hidden');
        userInfoDisplay.classList.add('hidden');
        planSelectionContainer.classList.add('hidden');
        conceptoUserName.textContent = '';
        currentClientData = null;
        facturacionMode = '';
        facturaUserId.required = false;
        facturaUserIdConcepto.required = false;
        facturaConceptoInput.required = false;
    }

    facturacionModeSelect.addEventListener('change', () => {
        facturacionMode = facturacionModeSelect.value;
        currentClientData = null; 

        facturaIndividualContainer.classList.add('hidden');
        facturaConceptoContainer.classList.add('hidden');
        montoYBotonesContainer.classList.add('hidden');
        userInfoDisplay.classList.add('hidden');
        
        facturaUserId.value = '';
        facturaUserIdConcepto.value = '';
        conceptoUserName.textContent = '';
        facturaConceptoInput.value = '';
        facturaMonto.value = '';

        if (facturacionMode === 'individual') {
            facturaIndividualContainer.classList.remove('hidden');
            facturaUserId.required = true;
            facturaUserIdConcepto.required = false;
            facturaConceptoInput.required = false;
        } else if (facturacionMode === 'concepto') {
            facturaConceptoContainer.classList.remove('hidden');
            facturaUserId.required = false;
            facturaUserIdConcepto.required = true;
            facturaConceptoInput.required = true;
        }
    });

    buscarUsuarioBtn.addEventListener('click', async () => {
        const searchTerm = facturaUserId.value.trim(); 
        if (!searchTerm) {
            alert('Por favor, ingrese el ID o el nombre del usuario para buscar.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}api_users.php?action=get_user_for_billing&search_term=${encodeURIComponent(searchTerm)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error del servidor: ${response.status}`);
            }
            const user = await response.json();
            currentClientData = user;
            facturaClientName.textContent = user.nombre;
            facturaClientEmail.textContent = user.correo;
            
            if (user.planes_asignados && user.planes_asignados.length > 0) {
                facturaClientAssignedPlans.textContent = user.planes_asignados.map(p => `${p.nombre_plan} (${p.estado_plan})`).join(', ');
                
                facturaPlanSelect.innerHTML = '<option value="">Seleccione un plan</option>';
                user.planes_asignados.forEach(plan => {
                    const option = document.createElement('option');
                    option.value = plan.plan_id;
                    option.textContent = `${plan.nombre_plan} (${formatCurrency(plan.precio)}) - ${plan.estado_plan}`;
                    facturaPlanSelect.appendChild(option);
                });

                const mainPlan = user.planes_asignados[0];
                facturaPlanSelect.value = mainPlan.plan_id;
                facturaMonto.value = parseFloat(mainPlan.precio || 0);
                facturaClientPlanPrice.textContent = formatCurrency(mainPlan.precio);

            } else {
                facturaClientAssignedPlans.textContent = 'Sin planes asignados';
                facturaPlanSelect.innerHTML = '<option value="">Sin planes para facturar</option>';
                facturaMonto.value = 0;
                facturaClientPlanPrice.textContent = '$0';
            }
            
            userInfoDisplay.classList.remove('hidden');
            planSelectionContainer.classList.remove('hidden');
            montoYBotonesContainer.classList.remove('hidden');

        } catch (error) {
            alert('Error al buscar usuario: ' + error.message);
            userInfoDisplay.classList.add('hidden');
            planSelectionContainer.classList.add('hidden');
            montoYBotonesContainer.classList.add('hidden');
            currentClientData = null;
        }
    });

    buscarUsuarioBtnConcepto.addEventListener('click', async () => {
        const searchId = facturaUserIdConcepto.value.trim();
        if (!searchId) {
            alert('Por favor, ingrese el ID o el nombre del usuario.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}api_users.php?action=get_user_for_billing&search_term=${encodeURIComponent(searchId)}`);
            if (!response.ok) throw new Error((await response.json()).error || 'Usuario no encontrado.');

            const user = await response.json();
            currentClientData = user;
            conceptoUserName.textContent = `Cliente: ${user.nombre}`;
            montoYBotonesContainer.classList.remove('hidden');
        } catch (error) {
            alert('Error al buscar usuario: ' + error.message);
            currentClientData = null;
            conceptoUserName.textContent = 'No se encontró el cliente.';
            montoYBotonesContainer.classList.add('hidden');
        }
    });

    facturaPlanSelect.addEventListener('change', () => {
        if (!currentClientData) return;
        const selectedPlanId = facturaPlanSelect.value;
        const selectedPlan = currentClientData.planes_asignados.find(p => String(p.plan_id) === String(selectedPlanId));
        if (selectedPlan) {
            facturaMonto.value = parseFloat(selectedPlan.precio || 0);
            facturaClientPlanPrice.textContent = formatCurrency(selectedPlan.precio);
        } else {
            facturaMonto.value = 0;
            facturaClientPlanPrice.textContent = '$0';
        }
    });

    cancelarFacturaBtn.addEventListener('click', resetFacturacionForm);

    facturacionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let facturaData = {
            action: 'generate_single_invoice',
            fecha: new Date().toISOString().slice(0, 10),
            usuario_id: null,
            plan_id: null,
            monto: null,
            concepto: null
        };

        if (!currentClientData) {
            alert('Debe buscar y seleccionar un cliente antes de generar una factura.');
            return;
        }
        facturaData.usuario_id = currentClientData.usuario_id;
        facturaData.monto = parseFloat(facturaMonto.value);

        if (facturacionMode === 'individual') {
            facturaData.plan_id = facturaPlanSelect.value;
            if (!facturaData.plan_id) {
                alert('Por favor, seleccione un plan para facturar.');
                return;
            }
        } else if (facturacionMode === 'concepto') {
            facturaData.plan_id = null;
            facturaData.concepto = facturaConceptoInput.value.trim();
            if (!facturaData.concepto) {
                alert('Por favor, ingrese el concepto de la factura.');
                return;
            }
        } else {
            alert('Por favor, seleccione un tipo de facturación.');
            return;
        }

        if (isNaN(facturaData.monto) || facturaData.monto <= 0) {
            alert('El monto a facturar debe ser un número positivo.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}api_facturas.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(facturaData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error desconocido');
            
            alert(result.message);
            resetFacturacionForm();
            // Cargar la tabla y resumen sin filtro de estado
            loadFacturas({ targetTableBody: facturasTableBody });
            loadIncomeAndExpenses();
        } catch (error) {
            console.error('Error al generar factura:', error);
            alert('Error al generar factura: ' + error.message);
        }
    });
    
    async function loadModifiersFilter() {
        try {
            const response = await fetch(`${API_BASE_URL}api_facturas.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get_modificadores' })
            });
            if (!response.ok) throw new Error('No se pudo cargar la lista de modificadores.');
            
            const modifiers = await response.json();
            paidModifierFilter.innerHTML = '<option value="">-- Filtrar por Modificador --</option>';
            modifiers.forEach(mod => {
                const option = document.createElement('option');
                option.value = mod.usuario_id;
                option.textContent = mod.nombre;
                paidModifierFilter.appendChild(option);
            });
        } catch (error) {
            console.error(error);
            paidModifierFilter.innerHTML = '<option value="">Error al cargar</option>';
        }
    }
    
    // --- FUNCIÓN loadFacturas REESTRUCTURADA ---
    async function loadFacturas(options = {}) {
        // En el módulo de Facturación, el RESUMEN GENERADAS/PENDIENTES/ANULADAS se filtra por FECHA DE GENERACIÓN (fecha_factura).
        // El resumen PAGADAS se filtra por FECHA DE MODIFICACIÓN (fecha_modificacion).
        
        const { searchId = '', startDate = '', endDate = '', status = '', targetTableBody = facturasTableBody } = options;
        
        const isModalTable = targetTableBody === paidInvoicesTableBody;
        const isFacturacionModule = targetTableBody === facturasTableBody;
        
        // Colspan de 8 para la tabla principal (con la columna de acciones)
        const colspan = isFacturacionModule ? "8" : (isModalTable ? "8" : "9"); 

        targetTableBody.innerHTML = `<tr><td colspan="${colspan}" class="py-4 px-6 text-center text-gray-500">Cargando facturas...</td></tr>`;
        if(isModalTable) paidInvoicesTotalSum.textContent = 'Calculando...';

        // 1. Consulta para la TABLA y el RESUMEN DE GENERACIÓN/PENDIENTES/ANULADAS
        // Estos usan la fecha de factura (fecha_factura).
        let url_table = `${API_BASE_URL}api_facturas.php`;
        const params_table_summary = new URLSearchParams();

        if (searchId) params_table_summary.append('id', searchId);
        if (startDate) params_table_summary.append('start_date', startDate);
        if (endDate) params_table_summary.append('end_date', endDate);
        if (status) params_table_summary.append('status', status); // Si status está presente (desde modal), se aplica a la consulta de la tabla

        if (params_table_summary.toString()) url_table += '?' + params_table_summary.toString();

        try {
            const response = await fetch(url_table);
            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorData.error || 'Error desconocido'}`);
            }
            const allInvoices = await response.json();
            targetTableBody.innerHTML = ''; 
            
            // --- CÁLCULO Y ACTUALIZACIÓN DEL RESUMEN ---
            if (!isModalTable) {
                
                // A. CALCULAR GENERADAS, PENDIENTES, ANULADAS (Usa datos de allInvoices)
                let generatedCount = 0, generatedSum = 0;
                let pendingCount = 0, annulledCount = 0;
                let pendingSum = 0, annulledSum = 0;
                
                if(Array.isArray(allInvoices)) {
                    generatedCount = allInvoices.length;
                    allInvoices.forEach(factura => {
                        const monto = parseFloat(factura.monto || 0);
                        generatedSum += monto;

                        if (factura.estado === 'Pendiente') {
                            pendingCount++;
                            pendingSum += monto;
                        } else if (factura.estado === 'Anulada') {
                            annulledCount++;
                            annulledSum += monto;
                        }
                    });
                }
                
                // B. CALCULAR PAGADAS (Recaudadas) - Consulta SEPARADA usando FECHA DE MODIFICACIÓN
                let paidCount = 0, paidSum = 0;
                const paidParams = new URLSearchParams();
                paidParams.append('status', 'Pagada');
                
                if (searchId) paidParams.append('id', searchId);
                
                // Forzar 'date_field=modification' si hay filtros de fecha
                if (startDate || endDate) {
                    paidParams.append('date_field', 'modification');
                    if (startDate) paidParams.append('start_date', startDate);
                    if (endDate) paidParams.append('end_date', endDate);
                }
                
                const paidUrl = `${API_BASE_URL}api_facturas.php?${paidParams.toString()}`;
                
                try {
                    const paidResponse = await fetch(paidUrl);
                    const paidInvoices = await paidResponse.json();
                    if (Array.isArray(paidInvoices)) {
                        paidCount = paidInvoices.length;
                        paidSum = paidInvoices.reduce((sum, f) => sum + parseFloat(f.monto || 0), 0);
                    }
                } catch (paidError) {
                    console.error("Error al calcular resumen de Pagadas:", paidError);
                }

                // C. ACTUALIZAR EL DOM
                generatedInvoicesCount.textContent = generatedCount;
                generatedInvoicesSum.textContent = `${formatCurrency(generatedSum)}`;
                
                paidInvoicesCount.textContent = paidCount; 
                paidInvoicesSum.textContent = `${formatCurrency(paidSum)}`; 

                pendingInvoicesCount.textContent = pendingCount;
                pendingInvoicesSum.textContent = `${formatCurrency(pendingSum)}`;
                annulledInvoicesCount.textContent = annulledCount;
                annulledInvoicesSum.textContent = `${formatCurrency(annulledSum)}`;
            }

            // --- POBLAR LA TABLA DE DETALLE (TODAS LAS FACTURAS FILTRADAS POR FECHA DE FACTURA) ---
            
            if (isModalTable) {
                 const totalMonto = allInvoices.reduce((sum, factura) => sum + parseFloat(factura.monto || 0), 0);
                 paidInvoicesTotalSum.textContent = formatCurrency(totalMonto);
            }
            
            if (allInvoices.length === 0) {
                targetTableBody.insertAdjacentHTML('beforeend', `<tr><td colspan="${colspan}" class="py-4 px-6 text-center text-gray-500">No se encontraron facturas.</td></tr>`);
            } else {
                allInvoices.forEach(factura => {
                    const monto = parseFloat(factura.monto || 0);
                    const planDisplay = factura.concepto ? `<span class="italic text-gray-500">${factura.concepto}</span>` : factura.nombre_plan;
                    
                    const row = document.createElement('tr');
                    row.dataset.facturaId = factura.factura_id; 

                    const estadoClass = factura.estado === 'Pagada' ? 'text-green-600' : (factura.estado === 'Anulada' ? 'text-red-600' : 'text-yellow-600');
                    
                    let rowContent;

                    if (isModalTable) {
                        // Si es el modal, se muestra más detalle.
                        const fechaModificacion = factura.fecha_modificacion ? new Date(factura.fecha_modificacion).toLocaleString('es-CO') : 'N/A';
                         rowContent = `
                            <td class="py-4 px-6 text-sm font-medium text-gray-900">${factura.numero_factura}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${factura.usuario_id}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${factura.nombre_usuario}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${planDisplay}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${formatCurrency(monto)}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${factura.fecha_factura}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${factura.nombre_modificador || 'N/A'}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${fechaModificacion}</td>
                        `;
                    } else {
                        // --- [BLOQUE MODIFICADO] ---
                        // Tabla principal de Facturación (8 columnas)
                        rowContent = `
                            <td class="py-4 px-6 text-sm font-medium text-gray-900">${factura.numero_factura}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${factura.usuario_id}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${factura.nombre_usuario}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${planDisplay}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${formatCurrency(monto)}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${factura.fecha_factura}</td>
                            <td class="py-4 px-6 text-sm font-semibold ${estadoClass}">${factura.estado}</td>
                        `;
                         
                        // Lógica de habilitación/deshabilitación
                        const isPending = factura.estado === 'Pendiente';
                        const disabledClass = isPending ? '' : 'opacity-50 cursor-not-allowed';
                        
                        // Usamos JSON.stringify en el planDisplay para escapar comillas y saltos de línea
                        const escapedPlanDisplay = JSON.stringify(planDisplay);

                        rowContent += `
                            <td class="py-4 px-6 text-sm font-medium space-x-2 whitespace-nowrap">
                                <button 
                                    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg shadow-md ${disabledClass}" 
                                    onclick='openEditMontoModal(${factura.factura_id}, "${factura.numero_factura}", ${escapedPlanDisplay}, ${monto})'
                                    title="Editar Monto"
                                    ${isPending ? '' : 'disabled'}>
                                    ${getIconSvg('edit')}
                                </button>
                                <button 
                                    class="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg shadow-md ${disabledClass}" 
                                    onclick="confirmAnnulment(${factura.factura_id}, '${factura.numero_factura}')"
                                    title="Anular Factura"
                                    ${isPending ? '' : 'disabled'}>
                                    ${getIconSvg('delete')}
                                </button>
                            </td>
                        `;
                        // --- [FIN BLOQUE MODIFICADO] ---
                    }
                    row.innerHTML = rowContent;
                    targetTableBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error al cargar facturas:', error);
            targetTableBody.innerHTML = `<tr><td colspan="7" class="py-4 px-6 text-center text-red-500">Error al cargar facturas: ${error.message}</td></tr>`;
            if(isModalTable) paidInvoicesTotalSum.textContent = '$ Error';
        }
    };
    // --- FIN FUNCIÓN loadFacturas REESTRUCTURADA ---
    
    // --- [NUEVA FUNCIÓN] Lógica de anulación (Eliminar) ---
    window.confirmAnnulment = async (facturaId, numeroFactura) => {
        if (!confirm(`¿Está seguro de que desea ANULAR la factura N° ${numeroFactura}? Esta acción es irreversible y la factura pasará al estado "Anulada".`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}api_facturas.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'update_invoice_status', 
                    factura_id: facturaId, 
                    estado: 'Anulada' // La eliminación se maneja como anulación
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error desconocido al anular la factura.');
            }

            const result = await response.json();
            alert(result.message);
            // Recargar la tabla y el resumen
            loadFacturas({ targetTableBody: facturasTableBody });

        } catch (error) {
            console.error('Error al anular la factura:', error);
            alert('Error al anular la factura: ' + error.message);
        }
    };
    // --- Fin [NUEVA FUNCIÓN] ---
    
    // --- INICIO CORRECCIÓN FILTROS FACTURACIÓN: LÓGICA AÑADIDA ---
    
    // Función para manejar el filtro de la tabla principal de facturas
    const handleInvoiceDetailsSearch = () => {
        loadFacturas({
            searchId: invoiceDetailSearchIdInput.value.trim(),
            startDate: invoiceDetailStartDateInput.value,
            endDate: invoiceDetailEndDateInput.value,
            targetTableBody: facturasTableBody
        });
    };

    if (searchInvoiceDetailsBtn) {
        searchInvoiceDetailsBtn.addEventListener('click', handleInvoiceDetailsSearch);
    }
    
    if (clearInvoiceDetailsSearchBtn) {
        clearInvoiceDetailsSearchBtn.addEventListener('click', () => {
            invoiceDetailSearchIdInput.value = '';
            invoiceDetailStartDateInput.value = '';
            invoiceDetailEndDateInput.value = '';
            // Llama a loadFacturas sin filtros para recargar todos los datos
            loadFacturas({ targetTableBody: facturasTableBody });
        });
    }

    if (invoiceDetailSearchIdInput) {
        // Manejar Enter en el campo de ID para mayor usabilidad
        invoiceDetailSearchIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleInvoiceDetailsSearch();
            }
        });
    }
    // --- FIN CORRECCIÓN FILTROS FACTURACIÓN: LÓGICA AÑADIDA ---

    if (viewPaidInvoicesBtn) {
        viewPaidInvoicesBtn.addEventListener('click', () => {
            modalOpenerModule = 'facturacion';
            statusSelectionModal.classList.remove('hidden');
        });
    }

    // ... (El resto de la lógica de Recaudo y Modals continúa igual) ...


    // =================================================================
    // [NUEVA FUNCIÓN] Lógica para el modal de Edición de Monto
    // =================================================================

    /**
     * Abre el modal para editar el monto de una factura pendiente.
     * Esta función se llama desde el botón de icono de lápiz en la tabla de facturación.
     */
    window.openEditMontoModal = (facturaId, numeroFactura, concepto, monto) => {
        if (!editInvoiceModal) {
            console.error('El modal "editInvoiceModal" no se encontró en el DOM.');
            return;
        }
        editInvoiceId.value = facturaId;
        editInvoiceDisplayId.textContent = numeroFactura;
        editInvoiceDisplayConcept.innerHTML = concepto; // Usar innerHTML por si el concepto tiene spans
        editInvoiceMonto.value = monto;
        
        editInvoiceModal.classList.remove('hidden');
    };

    // [NUEVA LÓGICA] Añadir event listeners para el modal de edición de monto
    if (cancelEditInvoiceBtn) {
        cancelEditInvoiceBtn.addEventListener('click', () => {
            editInvoiceModal.classList.add('hidden');
        });
    }

    if (editInvoiceForm) {
        editInvoiceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const facturaId = editInvoiceId.value;
            const nuevoMonto = parseFloat(editInvoiceMonto.value);

            if (!facturaId || isNaN(nuevoMonto) || nuevoMonto <= 0) {
                alert('Por favor, ingrese un monto válido y positivo.');
                return;
            }

            try {
                // Usamos la acción 'update_invoice_monto' que ya existe en api_facturas.php
                const response = await fetch(`${API_BASE_URL}api_facturas.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update_invoice_monto',
                        factura_id: parseInt(facturaId, 10),
                        monto: nuevoMonto
                    })
                });

                const result = await response.json();
                if (!response.ok) {
                    // La API ya valida si la factura no está 'Pendiente'
                    throw new Error(result.error || 'Error desconocido');
                }

                alert(result.message);
                editInvoiceModal.classList.add('hidden');
                
                // Recargar la vista de facturación
                loadFacturas({ targetTableBody: facturasTableBody });
                // Recargar el resumen de ingresos/gastos (por si el monto afectaba el total pendiente)
                loadIncomeAndExpenses();

            } catch (error) {
                console.error('Error al actualizar el monto de la factura:', error);
                alert('Error al actualizar el monto: ' + error.message);
            }
        });
    }
    // --- Fin [NUEVA LÓGICA] ---
    // =================================================================
    // FIN Lógica para el modal de Edición de Monto
    // =================================================================

    // ... (El resto de funciones y lógica del archivo continúa sin cambios) ...

    if (viewRecaudoPaidInvoicesBtn) {
        viewRecaudoPaidInvoicesBtn.addEventListener('click', () => {
            modalOpenerModule = 'recaudo';
            statusSelectionModal.classList.remove('hidden');
        });
    }

    confirmStatusSelectionBtn.addEventListener('click', () => {
        const statusToShow = statusSelect.value;
        statusSelectionModal.classList.add('hidden');
        
        paidModalTitle.textContent = `Facturas - ${statusToShow}s`;
        paidInvoicesModal.classList.remove('hidden');
        paidSearchInput.value = '';
        paidStartDateInput.value = '';
        paidEndDateInput.value = '';
        paidModifierFilter.value = '';
        loadModifiersFilter();
        
        // Se añade la columna 'Recibo' si estamos en el módulo de recaudo y viendo facturas pagadas
        if (modalOpenerModule === 'recaudo' && statusToShow === 'Pagada') {
            document.getElementById('paidInvoicesTable').querySelector('thead tr').innerHTML = `
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Factura</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Usuario</th> <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan / Concepto</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Factura</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modificado por</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Modificación</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recibo</th>
            `;
        } else {
             // Restaurar la cabecera original para Facturación o Anuladas
            document.getElementById('paidInvoicesTable').querySelector('thead tr').innerHTML = `
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Factura</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Usuario</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan / Concepto</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Factura</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modificado por</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Modificación</th>
            `;
        }

    
        if (modalOpenerModule === 'recaudo') {
            loadRecaudoFacturas({ status: statusToShow, targetTableBody: paidInvoicesTableBody });
        } else {
            // Nota: Aquí se mantiene loadFacturas porque el modal se reutiliza para Facturación (historial)
            // Se debe pasar status para que la consulta API filtre solo pagadas o anuladas.
            loadFacturas({ status: statusToShow, targetTableBody: paidInvoicesTableBody });
        }
    });

    cancelStatusSelectionBtn.addEventListener('click', () => { 
        statusSelectionModal.classList.add('hidden'); 
    });

    closePaidModalBtn.addEventListener('click', () => { paidInvoicesModal.classList.add('hidden'); });

    paidFilterBtn.addEventListener('click', () => {
        const options = {
            searchId: paidSearchInput.value.trim(),
            startDate: paidStartDateInput.value,
            endDate: paidEndDateInput.value,
            status: statusSelect.value,
            targetTableBody: paidInvoicesTableBody,
            modificadoPorId: paidModifierFilter.value
        };

        if (modalOpenerModule === 'recaudo') {
            loadRecaudoFacturas(options);
        } else {
            loadFacturas(options);
        }
    });
    
    paidClearBtn.addEventListener('click', () => {
        paidSearchInput.value = '';
        paidStartDateInput.value = '';
        paidEndDateInput.value = '';
        paidModifierFilter.value = '';
        const options = { 
            status: statusSelect.value, 
            targetTableBody: paidInvoicesTableBody 
        };

        if (modalOpenerModule === 'recaudo') {
            loadRecaudoFacturas(options);
        } else {
            loadFacturas(options);
        }
    });

    exportPaidExcelBtn.addEventListener('click', () => {
        const filename = `Reporte_Facturas_${statusSelect.value}s`;
        exportTableToXLSX('paidInvoicesTable', filename);
    });

    const bulkInvoiceConfirmModal = document.getElementById('bulkInvoiceConfirmModal');
    const bulkConfirmInput = document.getElementById('bulkConfirmInput');
    const confirmBulkInvoiceBtn = document.getElementById('confirmBulkInvoiceBtn');
    const cancelBulkInvoiceBtn = document.getElementById('cancelBulkInvoiceBtn');

    generateBulkInvoicesBtn.addEventListener('click', () => {
        bulkInvoiceConfirmModal.classList.remove('hidden');
        bulkConfirmInput.value = '';
        confirmBulkInvoiceBtn.disabled = true;
        confirmBulkInvoiceBtn.classList.add('opacity-50', 'cursor-not-allowed');
    });
 
    cancelBulkInvoiceBtn.addEventListener('click', () => {
        bulkInvoiceConfirmModal.classList.add('hidden');
    });

    bulkConfirmInput.addEventListener('input', () => {
        if (bulkConfirmInput.value === 'facturacion') {
            confirmBulkInvoiceBtn.disabled = false;
            confirmBulkInvoiceBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            confirmBulkInvoiceBtn.disabled = true;
            confirmBulkInvoiceBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    });

    // --- LÓGICA MODIFICADA PARA ABRIR EL MODAL DE REVISIÓN EN LUGAR DE GENERAR DIRECTO ---
    confirmBulkInvoiceBtn.addEventListener('click', async () => {
        bulkInvoiceConfirmModal.classList.add('hidden');
        generateBulkInvoicesBtn.disabled = true;
        generateBulkInvoicesBtn.textContent = 'Cargando revisión...';
        
        try {
            // 1. Obtener lista preliminar de facturas
            await loadPreliminaryInvoices();

            // 2. Abrir el modal de revisión/edición
            bulkInvoiceReviewModal.classList.remove('hidden');

        } catch (error) {
            alert('Error al obtener el listado preliminar: ' + error.message);
        } finally {
            generateBulkInvoicesBtn.disabled = false;
            generateBulkInvoicesBtn.textContent = 'Generar Facturas Masivas';
        }
    });
    // --- FIN LÓGICA MODIFICADA ---
    
    // --- NUEVAS FUNCIONES PARA EL MODAL DE REVISIÓN/EDICIÓN ---
    
    /**
     * Obtiene la lista preliminar de facturas masivas y puebla el modal.
     */
    async function loadPreliminaryInvoices() {
        bulkInvoicesReviewTableBody.innerHTML = `<tr><td colspan="6" class="py-4 px-6 text-center text-gray-500">Generando lista preliminar...</td></tr>`;
        try {
            const response = await fetch(`${API_BASE_URL}api_facturas.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get_preliminary_invoices', fecha: new Date().toISOString().slice(0, 10) })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            
            preliminaryInvoices = Array.isArray(result) ? result : [];
            populateBulkReviewTable(preliminaryInvoices);

        } catch (error) {
            console.error('Error al obtener lista preliminar:', error);
            bulkInvoicesReviewTableBody.innerHTML = `<tr><td colspan="6" class="py-4 px-6 text-center text-red-500">Error: ${error.message}</td></tr>`;
            throw new Error('Facturacion generada el dia de hoy, no se permite doble facturacion.');
        }
    }
    
    /**
     * Rellena la tabla del modal con las facturas preliminares.
     */
    function populateBulkReviewTable(invoices) {
        bulkInvoicesReviewTableBody.innerHTML = '';
        if (invoices.length === 0) {
            bulkInvoicesReviewTableBody.insertAdjacentHTML('beforeend', '<tr><td colspan="6" class="py-4 px-6 text-center text-gray-500">No se generó ninguna factura preliminar con planes activos.</td></tr>');
            updateBulkCount(0);
            return;
        }
        
        invoices.forEach((invoice, index) => {
            // Inicializar el concepto si no existe (para facturas que no tienen plan_id)
            if (!invoice.concepto) {
                invoice.concepto = invoice.nombre_plan ? `Servicio ${invoice.nombre_plan} - ${new Date().getFullYear()}/${new Date().getMonth() + 1}` : '';
            }
            
            const row = document.createElement('tr');
            row.id = `bulk-invoice-row-${index}`;
            
            const isPlanInvoice = invoice.plan_id && invoice.plan_id !== '';
            
            const rowContent = `
                <td class="py-4 px-2 text-sm w-12"><input type="checkbox" class="bulk-invoice-checkbox" data-index="${index}" checked></td>
                <td class="py-4 px-6 text-sm text-gray-700">${invoice.usuario_id}</td>
                <td class="py-4 px-6 text-sm text-gray-700">${invoice.nombre_usuario}</td>
                <td class="py-4 px-6 text-sm text-gray-700">${isPlanInvoice ? invoice.nombre_plan : 'Concepto Libre'}</td>
                <td class="py-4 px-6 text-sm text-gray-700">
                    <input type="text" value="${invoice.concepto || ''}" data-field="concepto" data-index="${index}" class="w-full border border-gray-300 rounded-md p-1 text-sm ${isPlanInvoice ? 'bg-gray-100 italic' : ''}" ${isPlanInvoice ? 'disabled' : ''}>
                </td>
                <td class="py-4 px-6 text-sm text-gray-700">
                    <input type="number" step="1" value="${invoice.monto}" data-field="monto" data-index="${index}" class="w-24 border border-gray-300 rounded-md p-1 text-sm text-right">
                </td>
            `;
            row.innerHTML = rowContent;
            bulkInvoicesReviewTableBody.appendChild(row);
        });
        
        // Inicializar el contador
        updateBulkCount(invoices.length);
        
        // Agregar manejadores de eventos a los inputs
        bulkInvoicesReviewTableBody.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => {
            input.addEventListener('change', handleBulkInvoiceEdit);
        });
        
        bulkInvoicesReviewTableBody.querySelectorAll('.bulk-invoice-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateBulkCountFromCheckboxes);
        });
        
        // Reiniciar el estado del "Seleccionar Todo"
        selectAllBulkInvoices.checked = invoices.length > 0;
        selectAllBulkInvoices.indeterminate = false;
    }

    /**
     * Actualiza el contador de facturas a generar.
     */
    function updateBulkCount(count) {
        invoicesToGenerateCount.textContent = count;
        executeBulkCount.textContent = count;
        executeBulkGenerationBtn.disabled = count === 0;
        executeBulkGenerationBtn.classList.toggle('opacity-50', count === 0);
        executeBulkGenerationBtn.classList.toggle('cursor-not-allowed', count === 0);
    }
    
    /**
     * Recalcula el contador basándose en los checkboxes marcados.
     */
    function updateBulkCountFromCheckboxes() {
        const checkedCount = bulkInvoicesReviewTableBody.querySelectorAll('.bulk-invoice-checkbox:checked').length;
        updateBulkCount(checkedCount);
        
        // Actualizar el checkbox "Seleccionar Todo"
        selectAllBulkInvoices.checked = checkedCount === preliminaryInvoices.length && preliminaryInvoices.length > 0;
        selectAllBulkInvoices.indeterminate = checkedCount > 0 && checkedCount < preliminaryInvoices.length;
    }

    /**
     * Maneja la edición de los campos de monto/concepto.
     */
    function handleBulkInvoiceEdit(e) {
        const input = e.target;
        const index = parseInt(input.dataset.index, 10);
        const field = input.dataset.field;
        
        if (preliminaryInvoices[index]) {
            if (field === 'monto') {
                preliminaryInvoices[index].monto = parseFloat(input.value) || 0;
            } else if (field === 'concepto') {
                preliminaryInvoices[index].concepto = input.value;
            }
        }
    }
    
    // Evento de "Seleccionar Todo"
    selectAllBulkInvoices.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        bulkInvoicesReviewTableBody.querySelectorAll('.bulk-invoice-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        updateBulkCountFromCheckboxes();
    });

    // Evento de cierre del modal de revisión
    closeBulkReviewModalBtn.addEventListener('click', () => {
        bulkInvoiceReviewModal.classList.add('hidden');
    });

    // Evento de cancelación de la generación
    cancelBulkGenerationBtn.addEventListener('click', () => {
        bulkInvoiceReviewModal.classList.add('hidden');
    });
    
    // Evento de ejecución final de la generación
    executeBulkGenerationBtn.addEventListener('click', async () => {
        const checkedInvoices = [];
        bulkInvoicesReviewTableBody.querySelectorAll('.bulk-invoice-checkbox:checked').forEach(checkbox => {
            const index = parseInt(checkbox.dataset.index, 10);
            const invoice = preliminaryInvoices[index];
            
            // Validar que el monto sea positivo antes de enviar
            if (parseFloat(invoice.monto) > 0) {
                 checkedInvoices.push(invoice);
            } else {
                 // Opcional: alertar al usuario sobre una factura no generada por monto
                 console.warn(`Factura para el usuario ${invoice.usuario_id} ignorada por monto de $${invoice.monto}.`);
            }
        });
        
        if (checkedInvoices.length === 0) {
            alert('Por favor, seleccione al menos una factura con monto positivo para generar.');
            return;
        }
        
        if (!confirm(`¿Está seguro de que desea generar las ${checkedInvoices.length} facturas seleccionadas con los valores editados?`)) {
            return;
        }

        bulkInvoiceReviewModal.classList.add('hidden');
        generateBulkInvoicesBtn.disabled = true;
        generateBulkInvoicesBtn.textContent = 'Generando facturas...';
        
        try {
            const response = await fetch(`${API_BASE_URL}api_facturas.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'execute_bulk_invoices', // NUEVA ACCIÓN FINAL
                    invoices: checkedInvoices, 
                    fecha: new Date().toISOString().slice(0, 10)
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            
            alert(result.message);
            // Recargar la tabla y resumen sin filtro de estado
            loadFacturas({ targetTableBody: facturasTableBody });
        } catch (error) {
            alert('Error al generar facturas masivas: ' + error.message);
        } finally {
            generateBulkInvoicesBtn.disabled = false;
            generateBulkInvoicesBtn.textContent = 'Generar Facturas Masivas';
        }
    });
    
    // --- FIN NUEVAS FUNCIONES PARA EL MODAL DE REVISIÓN/EDICIÓN ---

    window.openStatusModal = (facturaId, currentStatus, numeroFactura) => {
        modalFacturaId.value = facturaId;
        modalCurrentStatusDisplay.value = currentStatus;
        modalNewStatus.value = currentStatus;
        const modifiedByDisplay = document.getElementById('modalModifiedByDisplay');
        if (userSession && userSession.username) {
            modifiedByDisplay.value = userSession.username;
        } else {
            modifiedByDisplay.value = 'Usuario no identificado';
        }
        statusModal.classList.remove('hidden');
    };

    cancelStatusBtn.addEventListener('click', () => {
        statusModal.classList.add('hidden');
    });
    
    // =================================================================
    // [NUEVA FUNCIÓN] Lógica para el modal de Edición de Monto
    // =================================================================

    /**
     * Abre el modal para editar el monto de una factura pendiente.
     * Esta función se llama desde el botón de icono de lápiz en la tabla de facturación.
     */
    window.openEditMontoModal = (facturaId, numeroFactura, concepto, monto) => {
        if (!editInvoiceModal) {
            console.error('El modal "editInvoiceModal" no se encontró en el DOM.');
            return;
        }
        editInvoiceId.value = facturaId;
        editInvoiceDisplayId.textContent = numeroFactura;
        editInvoiceDisplayConcept.innerHTML = concepto; // Usar innerHTML por si el concepto tiene spans
        editInvoiceMonto.value = monto;
        
        editInvoiceModal.classList.remove('hidden');
    };

    // [NUEVA LÓGICA] Añadir event listeners para el modal de edición de monto
    if (cancelEditInvoiceBtn) {
        cancelEditInvoiceBtn.addEventListener('click', () => {
            editInvoiceModal.classList.add('hidden');
        });
    }

    if (editInvoiceForm) {
        editInvoiceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const facturaId = editInvoiceId.value;
            const nuevoMonto = parseFloat(editInvoiceMonto.value);

            if (!facturaId || isNaN(nuevoMonto) || nuevoMonto <= 0) {
                alert('Por favor, ingrese un monto válido y positivo.');
                return;
            }

            try {
                // Usamos la acción 'update_invoice_monto' que ya existe en api_facturas.php
                const response = await fetch(`${API_BASE_URL}api_facturas.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update_invoice_monto',
                        factura_id: parseInt(facturaId, 10),
                        monto: nuevoMonto
                    })
                });

                const result = await response.json();
                if (!response.ok) {
                    // La API ya valida si la factura no está 'Pendiente'
                    throw new Error(result.error || 'Error desconocido');
                }

                alert(result.message);
                editInvoiceModal.classList.add('hidden');
                
                // Recargar la vista de facturación
                loadFacturas({ targetTableBody: facturasTableBody });
                // Recargar el resumen de ingresos/gastos (por si el monto afectaba el total pendiente)
                loadIncomeAndExpenses();

            } catch (error) {
                console.error('Error al actualizar el monto de la factura:', error);
                //alert('Error al actualizar el monto: ' + error.message);
            }
        });
    }
    // --- Fin [NUEVA LÓGICA] ---
    // =================================================================
    // FIN Lógica para el modal de Edición de Monto
    // =================================================================


    // =================================================================
    // MÓDULO INGRESOS Y GASTOS
    // =================================================================
    recurringExpenseCategory.addEventListener('change', () => {
        if (recurringExpenseCategory.value === 'Nueva Categoría') {
            newCategoryInput.classList.remove('hidden');
            addCategoryBtn.classList.remove('hidden');
            cancelAddCategoryBtn.classList.remove('hidden');
            newCategoryInput.focus();
        } else {
            newCategoryInput.classList.add('hidden');
            addCategoryBtn.classList.add('hidden');
            cancelAddCategoryBtn.classList.add('hidden');
            newCategoryInput.value = '';
        }
    });

    addCategoryBtn.addEventListener('click', async () => {
        const newCategoryName = newCategoryInput.value.trim();
        if (newCategoryName) {
            try {
                const response = await fetch(`${API_BASE_URL}api_gastos.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'add_category', category_name: newCategoryName })
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                
                alert(result.message);
                await loadExpenseCategories();
                recurringExpenseCategory.value = newCategoryName; 
                newCategoryInput.classList.add('hidden');
                addCategoryBtn.classList.add('hidden');
                cancelAddCategoryBtn.classList.add('hidden');
                newCategoryInput.value = '';
            }
            catch (error) {
                console.error('Error al añadir categoría:', error);
                alert('Error al añadir categoría: ' + error.message);
            }
        } else {
            alert('Por favor, ingrese un nombre para la nueva categoría.');
        }
    });

    cancelAddCategoryBtn.addEventListener('click', () => {
        newCategoryInput.classList.add('hidden');
        addCategoryBtn.classList.add('hidden');
        cancelAddCategoryBtn.classList.add('hidden');
        newCategoryInput.value = '';
        recurringExpenseCategory.value = '';
    });

    async function loadExpenseCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}api_gastos.php?action=get_categories`);
            if (!response.ok) throw new Error('Error al cargar categorías.');
            const categories = await response.json(); 
            
            recurringExpenseCategory.innerHTML = '<option value="">Seleccione o añada una categoría</option>';
            recurringExpenseCategory.innerHTML += '<option value="Nueva Categoría">-- Nueva Categoría --</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat; 
                option.textContent = cat;
                recurringExpenseCategory.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar categorías de gastos:', error);
        }
    }

    addRecurringExpenseBtn.addEventListener('click', () => {
        recurringExpenseFormContainer.classList.remove('hidden');
        recurringExpenseFormTitle.textContent = 'Añadir Nuevo Gasto a la Lista';
        recurringExpenseForm.reset();
        recurringExpenseId.value = '';
        newCategoryInput.classList.add('hidden');
        addCategoryBtn.classList.add('hidden');
        cancelAddCategoryBtn.classList.add('hidden');
        loadExpenseCategories();
    });

    cancelRecurringExpenseBtn.addEventListener('click', () => {
        recurringExpenseFormContainer.classList.add('hidden');
        recurringExpenseForm.reset();
        recurringExpenseId.value = '';
    });
    
    async function loadRecurringExpenses() {
        try {
            const response = await fetch(`${API_BASE_URL}api_gastos.php?action=get_recurring_expenses`);
            if (!response.ok) throw new Error('Error al cargar la lista de gastos recurrentes.');
            const expenses = await response.json();

            recurringExpensesTableBody.innerHTML = '';
            if (expenses.length === 0) {
                recurringExpensesTableBody.innerHTML = `<tr><td colspan="5" class="py-4 px-6 text-center text-gray-500">No hay gastos en la lista. Añade uno para empezar.</td></tr>`;
            } else {
                expenses.forEach(expense => {
                    const row = `
                        <tr id="recurring-row-${expense.id}">
                            <td class="py-4 px-4"><input type="checkbox" class="recurring-expense-checkbox" value="${expense.id}"></td>
                            <td class="py-4 px-6 text-sm text-gray-700">${expense.category}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${expense.description}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${formatCurrency(expense.amount)}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium space-x-2">
                                <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg shadow-md" onclick="editRecurringExpense(${expense.id}, '${expense.category}', '${expense.description}', ${expense.amount})" title="Editar">${getIconSvg('edit')}</button>
                                <button class="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg shadow-md" onclick="deleteRecurringExpense(${expense.id})" title="Eliminar">${getIconSvg('delete')}</button>
                            </td>
                        </tr>
                    `;
                    recurringExpensesTableBody.insertAdjacentHTML('beforeend', row);
                });
            }
        } catch (error) {
            console.error(error);
            recurringExpensesTableBody.innerHTML = `<tr><td colspan="5" class="py-4 px-6 text-center text-red-500">${error.message}</td></tr>`;
        }
    }

    recurringExpenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const expenseData = {
            category: recurringExpenseCategory.value,
            description: recurringExpenseDescription.value,
            amount: parseFloat(recurringExpenseAmount.value)
        };

        if (!expenseData.category || !expenseData.description || isNaN(expenseData.amount) || expenseData.amount <= 0) {
            alert('Por favor, completa todos los campos con valores válidos.');
            return;
        }

        let action, body;
        const id = recurringExpenseId.value;
        if (id) {
            action = 'update_recurring_expense';
            body = { action, id, ...expenseData };
        } else {
            action = 'add_recurring_expense'; 
            body = { action, ...expenseData };
        }

        try {
            const response = await fetch(`${API_BASE_URL}api_gastos.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            
            alert(result.message);
            recurringExpenseFormContainer.classList.add('hidden');
            loadRecurringExpenses(); 
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });

    window.editRecurringExpense = (id, category, description, amount) => {
        recurringExpenseFormContainer.classList.remove('hidden');
        recurringExpenseFormTitle.textContent = 'Editar Gasto de la Lista';
        
        recurringExpenseId.value = id;
        loadExpenseCategories().then(() => {
             recurringExpenseCategory.value = category;
        });
        recurringExpenseDescription.value = description;
        recurringExpenseAmount.value = amount;
    };

    window.deleteRecurringExpense = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este gasto de la lista de plantillas?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}api_gastos.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_recurring_expense', id: id })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            alert(result.message);
            loadRecurringExpenses();
        } catch (error) {
             alert('Error: ' + error.message);
        }
    };
    
    registerSelectedExpensesBtn.addEventListener('click', async () => {
        const selectedCheckboxes = document.querySelectorAll('.recurring-expense-checkbox:checked');
        const idsToRegister = Array.from(selectedCheckboxes).map(cb => cb.value);
        const dateToRegister = bulkRegisterDate.value;

        if (idsToRegister.length === 0) {
            alert('Por favor, selecciona al menos un gasto para registrar.');
            return;
        }
        if (!dateToRegister) {
            alert('Por favor, selecciona una fecha para el registro.');
            return;
        }

        if (!confirm(`¿Confirmas que deseas registrar ${idsToRegister.length} gastos con fecha ${dateToRegister}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}api_gastos.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'register_bulk_expenses',
                    ids: idsToRegister,
                    date: dateToRegister
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            alert(result.message);
            selectedCheckboxes.forEach(cb => cb.checked = false); 
            selectAllRecurringExpenses.checked = false;
            loadExpenses(); 
            loadIncomeAndExpenses(); 
        } catch (error) {
            alert('Error al registrar los gastos: ' + error.message);
        }
    });
    
    selectAllRecurringExpenses.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.recurring-expense-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });

    window.deleteRegisteredExpense = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este gasto del historial? Esta acción no se puede deshacer.')) return;
        try {
            const response = await fetch(`${API_BASE_URL}api_gastos.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_expense', expense_id: id })
            });
             const result = await response.json();
            if (!response.ok) throw new Error(result.error);
           
            alert(result.message);
            loadIncomeAndExpenses(); 
        } catch (error) {
            alert('Error al eliminar gasto del historial: ' + error.message);
        }
    };

    filterExpensesBtn.addEventListener('click', () => {
        loadExpenses(expenseStartDateFilter.value, expenseEndDateFilter.value);
    });

    clearExpensesFilterBtn.addEventListener('click', () => {
        expenseStartDateFilter.value = '';
        expenseEndDateFilter.value = '';
        loadExpenses();
    });

    filterProfitLossBtn.addEventListener('click', () => {
        loadIncomeAndExpenses(profitLossStartDate.value, profitLossEndDate.value);
    });

    clearProfitLossFilterBtn.addEventListener('click', () => {
        profitLossStartDate.value = '';
        profitLossEndDate.value = '';
        loadIncomeAndExpenses();
    });

    // --- FUNCIÓN CORREGIDA: Incluye date_field=modification para filtrar por FECHA DE PAGO ---
    async function loadIncomeAndExpenses(startDate = '', endDate = '') {
        // CORRECCIÓN CLAVE: Añadir date_field=modification para forzar el filtro por fecha_modificacion
        let incomeUrl = `${API_BASE_URL}api_facturas.php?status=Pagada&date_field=modification`;
        if (startDate) incomeUrl += `&start_date=${startDate}`;
        if (endDate) incomeUrl += `&end_date=${endDate}`;
        let totalIncome = 0;
        try {
            const incomeResponse = await fetch(incomeUrl);
            const paidInvoices = await incomeResponse.json();
            if(Array.isArray(paidInvoices)) {
                totalIncome = paidInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.monto || 0), 0);
            } else if (paidInvoices && paidInvoices.error) {
                console.error('Error al cargar ingresos:', paidInvoices.error);
                totalIncome = 0;
            } else {
                totalIncome = 0;
            }
            
            totalIncomeDisplay.textContent = `${formatCurrency(totalIncome)}`;
        } catch (error) {
            console.error('Error al cargar ingresos:', error);
            totalIncomeDisplay.textContent = '$ Error';
        }

        await loadExpenses(startDate, endDate, (totalExpenses) => {
             const profitLoss = totalIncome - totalExpenses;
             totalExpensesDisplay.textContent = `${formatCurrency(totalExpenses)}`;
             profitLossDisplay.textContent = `${formatCurrency(profitLoss)}`;
             profitLossDisplay.classList.toggle('text-green-600', profitLoss >= 0);
             profitLossDisplay.classList.toggle('text-red-600', profitLoss < 0);
        });
    }

    async function loadExpenses(startDate = '', endDate = '', callback) {
        expensesTableBody.innerHTML = '<tr><td colspan="6" class="py-4 px-6 text-center text-gray-500">Cargando gastos...</td></tr>';
        let url = `${API_BASE_URL}api_gastos.php?action=get_expenses`;
        if (startDate) url += `&start_date=${startDate}`;
        if (endDate) url += `&end_date=${endDate}`;
        
        let totalExpenses = 0;
        try {
            const response = await fetch(url);
            const expenses = await response.json();
            if (!response.ok) throw new Error(expenses.error || 'Error desconocido');
            
            expensesTableBody.innerHTML = '';
            if (expenses.length === 0) {
                expensesTableBody.insertAdjacentHTML('beforeend', '<tr><td colspan="6" class="py-4 px-6 text-center text-gray-500">No hay gastos registrados para el rango de fechas seleccionado.</td></tr>');
            } else {
                expenses.forEach(expense => {
                    const monto = parseFloat(expense.amount || 0);
                    totalExpenses += monto;
                    const row = `
                        <tr>
                            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">${expense.expense_id}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${expense.category}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${expense.description}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${formatCurrency(monto)}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-700">${expense.date}</td>
                            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium">
                                <button class="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg shadow-md" onclick="deleteRegisteredExpense(${expense.expense_id})" title="Eliminar">${getIconSvg('delete')}</button>
                            </td>
                        </tr>
                    `;
                    expensesTableBody.insertAdjacentHTML('beforeend', row);
                });
            }
            if (callback) callback(totalExpenses);

        } catch (error) {
            console.error('Error al cargar gastos:', error);
            expensesTableBody.innerHTML = `<tr><td colspan="6" class="py-4 px-6 text-center text-red-500">Error al cargar gastos.</td></tr>`;
            if (callback) callback(0);
        }
    }
    
    // =================================================================
    // MÓDULO INVENTARIO
    // =================================================================
    const formGestionTiposActivo = document.getElementById('formGestionTiposActivo');
    const listaTiposActivo = document.getElementById('listaTiposActivo');
    const nuevoTipoActivoNombre = document.getElementById('nuevoTipoActivoNombre');
    const cantidadActivo = document.getElementById('cantidadActivo');
    const bodyAsignacionActivos = document.getElementById('bodyAsignacionActivos');
    const bodyActivosAsignados = document.getElementById('bodyActivosAsignados');
    const exportAsignadosExcelBtn = document.getElementById('exportAsignadosExcelBtn');
    const modalAsignarActivo = document.getElementById('modalAsignarActivo');
    const formAsignarActivo = document.getElementById('formAsignarActivo');
    const tituloModalAsignar = document.getElementById('tituloModalAsignar');
    const asignarTipoActivoId = document.getElementById('asignarTipoActivoId');
    const tipoAsignacion = document.getElementById('tipoAsignacion');
    const contenedorSelectCliente = document.getElementById('contenedorSelectCliente');
    const selectCliente = document.getElementById('selectCliente');
    const cancelarAsignacionBtn = document.getElementById('cancelarAsignacionBtn');
    const modalEditarAsignacion = document.getElementById('modalEditarAsignacion');
    const formEditarAsignacion = document.getElementById('formEditarAsignacion');
    const editAsignacionId = document.getElementById('editAsignacionId');
    const editTipoActivo = document.getElementById('editTipoActivo');
    const editTipoAsignacion = document.getElementById('editTipoAsignacion');
    const contenedorEditSelectCliente = document.getElementById('contenedorEditSelectCliente');
    const editSelectCliente = document.getElementById('editSelectCliente');
    const cancelarEdicionBtn = document.getElementById('cancelarEdicionBtn');
    const decrementoActivoBtn = document.getElementById('decrementoActivoBtn');

    async function cargarTiposDeActivos() {
        if (!bodyAsignacionActivos) return;
        try {
            // CAMBIO DE api_assets.php a api_inventario.php
            const response = await fetch(`${API_BASE_URL}api_inventario.php?action=get_tipos_activos`);
            if (!response.ok) throw new Error('Error al cargar los tipos de activos.');
            const tipos = await response.json();

            listaTiposActivo.innerHTML = '<option value="">Seleccione un tipo existente</option><option value="nuevo">-- Agregar Nuevo Tipo de Activo --</option>';
            tipos.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id;
                option.textContent = tipo.nombre;
                listaTiposActivo.appendChild(option);
            });

            bodyAsignacionActivos.innerHTML = '';
            if (tipos.length === 0) {
                bodyAsignacionActivos.innerHTML = `<tr><td colspan="4" class="py-4 px-6 text-center text-gray-500">No hay tipos de activo registrados.</td></tr>`;
            } else {
                 tipos.forEach(tipo => {
                    const row = `
                        <tr>
                            <td class="py-4 px-6 text-sm font-medium text-gray-900">${tipo.nombre}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${tipo.cantidad_total}</td>
                            <td class="py-4 px-6 text-sm font-bold ${tipo.cantidad_disponible > 0 ? 'text-green-600' : 'text-red-600'}">${tipo.cantidad_disponible}</td>
                            <td class="py-4 px-6 text-sm font-medium">
                                <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md" onclick="abrirModalAsignacion(${tipo.id}, '${tipo.nombre}')" ${tipo.cantidad_disponible === 0 ? 'disabled' : ''}>
                                    Asignar
                                </button>
                                <button class="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg shadow-md ml-2" onclick="eliminarTipoActivo(${tipo.id})" title="Eliminar">${getIconSvg('delete')}</button>
                            </td>
                        </tr>
                    `;
                    bodyAsignacionActivos.insertAdjacentHTML('beforeend', row);
                });
            }
        } catch (error) {
            console.error('Error:', error);
            bodyAsignacionActivos.innerHTML = `<tr><td colspan="4" class="py-4 px-6 text-center text-red-500">Error al cargar datos.</td></tr>`;
        }
    }


    window.eliminarTipoActivo = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este tipo de activo? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            // CAMBIO DE api_assets.php a api_inventario.php
            const response = await fetch(`${API_BASE_URL}api_inventario.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete_tipo_activo',
                    tipo_id: id
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error desconocido del servidor.');
            }

            alert(result.message);
            cargarTiposDeActivos();
            
        } catch (error) {
            console.error('Error al eliminar tipo de activo:', error);
            alert('Error: ' + error.message);
        }
    };

    // CORRECCIÓN CLAVE: Hacemos la función global para que sea accesible desde los event listeners de búsqueda.
    window.cargarActivosAsignados = async (searchQuery = '') => {
        const bodyActivosAsignados = document.getElementById('bodyActivosAsignados');
        if (!bodyActivosAsignados) return;
        bodyActivosAsignados.innerHTML = `<tr><td colspan="8" class="py-4 px-6 text-center text-gray-500">Cargando...</td></tr>`;
        
        // CAMBIO DE api_assets.php a api_inventario.php
        let url = `${API_BASE_URL}api_inventario.php?action=get_activos_asignados`;
        if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar los activos asignados.');
            const asignados = await response.json();

            bodyActivosAsignados.innerHTML = '';
            if (asignados.length === 0) {
                bodyActivosAsignados.innerHTML = `<tr><td colspan="8" class="py-4 px-6 text-center text-gray-500">No se encontraron activos asignados.</td></tr>`;
            } else {
                asignados.forEach(asig => {
                    const asignadoA = asig.nombre_cliente ? asig.nombre_cliente : '<span class="font-semibold text-blue-600">Empresa (Uso Interno)</span>';
                    const displayNotas = asig.notas && asig.notas.length > 25 ? asig.notas.substring(0, 25) + '...' : (asig.notas || 'N/A');
                    const fullNotas = asig.notas || '';

                    const row = `
                        <tr>
                            <td class="py-4 px-6 text-sm font-medium text-gray-900">${asig.id}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${asig.nombre_activo}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${asignadoA}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${asig.fecha_asignacion}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${asig.ip || 'N/A'}</td>
                            <td class="py-4 px-6 text-sm text-gray-700">${asig.serial || 'N/A'}</td>
                            <td class="py-4 px-6 text-sm text-gray-700" title="${fullNotas}" data-export-notes="${fullNotas}">${displayNotas}</td>
                            <td class="py-4 px-6 text-sm font-medium space-x-2">
                                <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg shadow-md mr-2" onclick="abrirModalEdicion(${asig.id})" title="Editar">${getIconSvg('edit')}</button>
                                <button class="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg shadow-md" onclick="eliminarAsignacion(${asig.id})" title="Eliminar">${getIconSvg('delete')}</button>
                            </td>
                        </tr>
                    `;
                    bodyActivosAsignados.insertAdjacentHTML('beforeend', row);
                });
            }
        } catch (error) {
            console.error('Error:', error);
            bodyActivosAsignados.innerHTML = `<tr><td colspan="8" class="py-4 px-6 text-center text-red-500">Error al cargar datos.</td></tr>`;
        }
    };


    async function cargarClientesParaSelect(selectElement = selectCliente) {
        try {
            const response = await fetch(`${API_BASE_URL}api_users.php?action=get_client_list`);

            if (!response.ok) {
                throw new Error('Error al cargar clientes desde el servidor.');
            }
            const clientes = await response.json();
            
            selectElement.innerHTML = '<option value="">-- Seleccione un cliente --</option>';
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.usuario_id;
                option.textContent = `${cliente.nombre} (ID: ${cliente.usuario_id})`;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('Error en cargarClientesParaSelect:', error);
            selectElement.innerHTML = '<option value="" style="color: red;">Error al cargar clientes</option>';
        }
    }

    window.abrirModalAsignacion = (tipoActivoId, nombreActivo) => {
        tituloModalAsignar.textContent = `Asignar: ${nombreActivo}`;
        asignarTipoActivoId.value = tipoActivoId;
        formAsignarActivo.reset();
        contenedorSelectCliente.classList.add('hidden');
        modalAsignarActivo.classList.remove('hidden');
    };
    
    window.abrirModalEdicion = async (asignacionId) => {
        try {
            // CAMBIO DE api_assets.php a api_inventario.php
            const response = await fetch(`${API_BASE_URL}api_inventario.php?action=get_asignacion_details&id=${asignacionId}`);
            if (!response.ok) throw new Error('No se pudieron obtener los detalles de la asignación.');
            const data = await response.json();

            // CAMBIO DE api_assets.php a api_inventario.php
            const tiposResponse = await fetch(`${API_BASE_URL}api_inventario.php?action=get_tipos_activos`);
            const tipos = await tiposResponse.json();
            editTipoActivo.innerHTML = '';
            tipos.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id;
                option.textContent = tipo.nombre;
                editTipoActivo.appendChild(option);
            });

            formEditarAsignacion.reset();
            editAsignacionId.value = data.id;
            editTipoActivo.value = data.tipo_activo_id;
            document.getElementById('editIpActivo').value = data.ip || '';
            document.getElementById('editSerialActivo').value = data.serial || '';
            document.getElementById('editNotasAsignacion').value = data.notas || '';

            if (data.cliente_id) {
                editTipoAsignacion.value = 'cliente';
                contenedorEditSelectCliente.classList.remove('hidden');
                await cargarClientesParaSelect(editSelectCliente);
                editSelectCliente.value = data.cliente_id;
            } else {
                editTipoAsignacion.value = 'interno';
                contenedorEditSelectCliente.classList.add('hidden');
            }

            modalEditarAsignacion.classList.remove('hidden');
        } catch (error) {
            console.error("Error al abrir modal de edición:", error);
            alert(error.message);
        }
    };

    window.eliminarAsignacion = async (asignacionId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta asignación? El activo volverá al inventario disponible.')) { return; }
        try {
            // CAMBIO DE api_assets.php a api_inventario.php
            const response = await fetch(`${API_BASE_URL}api_inventario.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_asignacion', asignacion_id: asignacionId })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            alert(result.message);
            cargarTiposDeActivos();
            window.cargarActivosAsignados(); // CORRECCIÓN 2: Llamar como función global
        } catch (error) {
            console.error('Error al eliminar asignación:', error);
            alert('Error: ' + error.message);
        }
    };
    
    function inicializarModuloInventario() {
        if (!formGestionTiposActivo) return;

        listaTiposActivo.addEventListener('change', () => {
            nuevoTipoActivoNombre.classList.toggle('hidden', listaTiposActivo.value !== 'nuevo');
            nuevoTipoActivoNombre.required = listaTiposActivo.value === 'nuevo';
        });

        formGestionTiposActivo.addEventListener('submit', async (e) => {
            e.preventDefault();
            const esNuevo = listaTiposActivo.value === 'nuevo';
            const requestBody = { action: 'add_stock', tipo_id: esNuevo ? null : listaTiposActivo.value, nuevo_nombre: esNuevo ? nuevoTipoActivoNombre.value : null, cantidad: parseInt(cantidadActivo.value, 10) };
            if ((esNuevo && !requestBody.nuevo_nombre) || (!esNuevo && !requestBody.tipo_id)) { alert('Por favor, seleccione o ingrese un tipo de activo.'); return; }
            try {
                // CAMBIO DE api_assets.php a api_inventario.php
                const response = await fetch(`${API_BASE_URL}api_inventario.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                alert(result.message);
                formGestionTiposActivo.reset();
                nuevoTipoActivoNombre.classList.add('hidden');
                cargarTiposDeActivos();
            } catch (error) { console.error('Error al agregar stock:', error); alert('Error: ' + error.message); }
        });

        if (decrementoActivoBtn) {
            decrementoActivoBtn.addEventListener('click', async () => {
                const tipoId = listaTiposActivo.value;
                const cantidad = parseInt(cantidadActivo.value, 10);

                if (!tipoId || tipoId === 'nuevo') {
                    alert('Por favor, seleccione un tipo de activo existente para eliminar unidades.');
                    return;
                }
                if (isNaN(cantidad) || cantidad <= 0) {
                    alert('Por favor, ingrese una cantidad válida para eliminar.');
                    return;
                }
                if (!confirm(`¿Está seguro de que desea eliminar ${cantidad} unidad(es) del tipo de activo seleccionado? Esta acción es irreversible.`)) {
                    return;
                }

                const requestBody = {
                    action: 'remove_stock',
                    tipo_id: tipoId,
                    cantidad: cantidad
                };

                try {
                    // CAMBIO DE api_assets.php a api_inventario.php
                    const response = await fetch(`${API_BASE_URL}api_inventario.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody)
                    });
                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.error || 'Error desconocido');
                    }
                    alert(result.message);
                    formGestionTiposActivo.reset();
                    nuevoTipoActivoNombre.classList.add('hidden');
                    cargarTiposDeActivos();
                } catch (error) {
                    console.error('Error al eliminar stock:', error);
                    alert('Error: ' + error.message);
                }
            });
        }
        
        tipoAsignacion.addEventListener('change', () => {
            const esCliente = tipoAsignacion.value === 'cliente';
            contenedorSelectCliente.classList.toggle('hidden', !esCliente);
            selectCliente.required = esCliente;
            if (esCliente) cargarClientesParaSelect();
        });

        formAsignarActivo.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!tipoAsignacion.value || (tipoAsignacion.value === 'cliente' && !selectCliente.value)) { alert('Debe completar los campos de asignación requeridos.'); return; }
            const requestBody = { action: 'assign_activo', tipo_activo_id: asignarTipoActivoId.value, cliente_id: tipoAsignacion.value === 'cliente' ? selectCliente.value : null, ip: document.getElementById('ipActivo').value, serial: document.getElementById('serialActivo').value, notas: document.getElementById('notasAsignacion').value };
            try {
                // CAMBIO DE api_assets.php a api_inventario.php
                const response = await fetch(`${API_BASE_URL}api_inventario.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                alert(result.message);
                modalAsignarActivo.classList.add('hidden');
                cargarTiposDeActivos();
                window.cargarActivosAsignados(); // CORRECCIÓN 3: Llamar como función global
            } catch (error) { console.error('Error al asignar activo:', error); alert('Error: ' + error.message); }
        });

        cancelarAsignacionBtn.addEventListener('click', () => modalAsignarActivo.classList.add('hidden'));
        
        editTipoAsignacion.addEventListener('change', () => {
            const esCliente = editTipoAsignacion.value === 'cliente';
            contenedorEditSelectCliente.classList.toggle('hidden', !esCliente);
            editSelectCliente.required = esCliente;
            if (esCliente) cargarClientesParaSelect(editSelectCliente);
        });

        formEditarAsignacion.addEventListener('submit', async (e) => {
            e.preventDefault();
            const esCliente = editTipoAsignacion.value === 'cliente';
            if (esCliente && !editSelectCliente.value) { alert('Debe seleccionar un cliente.'); return; }
            const requestBody = { action: 'update_asignacion', asignacion_id: editAsignacionId.value, tipo_activo_id: editTipoActivo.value, cliente_id: esCliente ? editSelectCliente.value : null, ip: document.getElementById('editIpActivo').value, serial: document.getElementById('editSerialActivo').value, notas: document.getElementById('editNotasAsignacion').value };
            try {
                // CAMBIO DE api_assets.php a api_inventario.php
                const response = await fetch(`${API_BASE_URL}api_inventario.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                alert(result.message);
                modalEditarAsignacion.classList.add('hidden');
                cargarTiposDeActivos();
                window.cargarActivosAsignados(); // CORRECCIÓN 4: Llamar como función global
            } catch (error) { console.error('Error al actualizar asignación:', error); alert('Error: ' + error.message); }
        });
        
        cancelarEdicionBtn.addEventListener('click', () => modalEditarAsignacion.classList.add('hidden'));

        // --- INICIO CORRECCIÓN BÚSQUEDA INSTANTÁNEA: MÓDULO INVENTARIO (ACTIVOS ASIGNADOS) ---
        const handleAssetSearch = () => {
            const query = assetSearchInput.value.trim();
            window.cargarActivosAsignados(query); // <-- Usar la función global
        };

        if (searchAssetBtn) {
            searchAssetBtn.addEventListener('click', handleAssetSearch);
        }
        
        if (clearAssetSearchBtn) {
            clearAssetSearchBtn.addEventListener('click', () => {
                assetSearchInput.value = '';
                window.cargarActivosAsignados(); // <-- Usar la función global
            });
        }
        
        if (assetSearchInput) {
            // ✨ Búsqueda instantánea al escribir (input event)
            assetSearchInput.addEventListener('input', handleAssetSearch);
            
            // Mantener la funcionalidad de Enter
            assetSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAssetSearch();
                }
            });
        }
        // --- FIN CORRECCIÓN BÚSQUEDA INSTANTÁNEA: MÓDULO INVENTARIO (ACTIVOS ASIGNADOS) ---
    }
    
    inicializarModuloInventario();

    // =================================================================
    // MÓDULO RECAUDO Y LÓGICA DE PDF
    // =================================================================
    const recaudoPaidInvoicesCount = document.getElementById('recaudoPaidInvoicesCount');
    const recaudoPaidInvoicesSum = document.getElementById('recaudoPaidInvoicesSum');
    const recaudoPendingInvoicesCount = document.getElementById('recaudoPendingInvoicesCount');
    const recaudoPendingInvoicesSum = document.getElementById('recaudoPendingInvoicesSum');
    const recaudoFacturasTableBody = document.getElementById('recaudoFacturasTableBody');
    const searchRecaudoDetailsBtn = document.getElementById('searchRecaudoDetailsBtn');
    const clearRecaudoDetailsSearchBtn = document.getElementById('clearRecaudoDetailsSearchBtn');
    const recaudoDetailSearchIdInput = document.getElementById('recaudoDetailSearchIdInput');
    const recaudoDetailStartDateInput = document.getElementById('recaudoDetailStartDateInput');
    const recaudoDetailEndDateInput = document.getElementById('recaudoDetailEndDateInput');
    
    function initializeRecaudoModule() {
        // Al iniciar, cargar sin filtros de fecha para mostrar el total histórico
        loadRecaudoFacturas({ 
            status: 'Pendiente', 
            startDate: '', 
            endDate: '' // Dejar vacíos para forzar el resumen histórico
        });
    }

    /**
     * Obtiene detalles adicionales de un cliente desde la API.
     * @param {string} usuarioId - El ID del usuario a buscar.
     * @returns {object} Un objeto con el correo, celular y dirección del cliente.
     */
    async function obtenerDetallesCliente(usuarioId) {
        try {
            // La llamada ahora apunta a api_recaudo.php, que el usuario SÍ tiene permitido usar.
            const response = await fetch(`${API_BASE_URL}api_recaudo.php?action=get_client_details_for_receipt&usuario_id=${usuarioId}`);
            
            if (!response.ok) {
                console.error('No se pudo obtener los detalles del cliente.');
                return { correo: 'No disponible', celular: 'No disponible', direccion: 'No disponible' };
            }
            const user = await response.json();
            return {
                correo: user.correo || 'N/A',
                celular: user.celular || 'N/A',
                direccion: user.direccion || 'N/A'
            };
        } catch (error) {
            console.error('Error al obtener detalles del cliente:', error);
            return { correo: 'Error', celular: 'Error', direccion: 'Error' };
        }
    }
    
    // Hacemos global la función para poder llamarla desde la tabla del modal
    window.obtenerDetallesCliente = obtenerDetallesCliente;

    /**
     * Función para generar el PDF del recibo de pago con nuevo estilo.
     * @param {object} datos - Los datos del recibo, incluyendo detalles del cliente.
     * @param {string} accion - 'imprimir' o 'descargar'.
     */
        function generarReciboPDF(datos, accion) {
        const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABkAAAAL1CAMAAAComthAAAADAFBMVEVHcEwQN316uUYSZ6X+/v12uEUQN3oCeTwCdToUdLAQNncskEYEfD8mjUV8ukgaqNr+///8/v0SZaEYotVXp0cWZqMfrd14ukgUf7h2uEAjseBkr0h+uUEykkUqsuB6u0IXh0RytkIVcKhrskcVlswVd7IRYZwUisAJf0EWda0RXZgTcKwUnNAQRX0XaqgPg0P5/fsVg7txtUYQSIMVhr4gptcVj8NtskJlrkMWk8dKoEcmrdwROX8xvul/uUvz/Pfw+/UYZJ7p+PIruugntuQ0lknq+vECbzjp+/F+rVWEsFzk+fEcbZ8SWZEedKYZY5cMeEIcks0dYpAMcT+JtGUia5cdgbEraI0eXIjf9dDl+vrY8MpOlk8lgKq219W54eqRuG8tosjH5MXV7sS54OkjjLhCjk2z3ucfOmEqlr/m+fSgw4XB37Mpdp6RuHMVakC826y/3a+bwHu82qij0980j7E4dJepyo89qsqGsGWXv9Gny5Q4gqSYvs6SuXXB6PBQrcc9dpduo7o9oL6vz5Wf1OJfnV7o+vZljaZMiqm62KObv4KfxpnS68F1p192qL6Rv9FxmK9zpb2pyowvbpMPZTpgtMuDp7wdVX6IxNVimrR7v9KFscVbepWWub5NhKEgbkdSpb/C5/CBrMJHl7RKgqBro3x7oKuky6Pu+/ZotsxokZ8tdk9+r3tRjquKx9m+4+5YlXEyTnLO6Lub0+JCd5eKupZ7wNNjlrGeyq3s+/ZSkmFpoWo6VHV1qYKEtpOcv8w6gVlFh2NGcI8qRGkpXoI5ZofA3KhLZYRtrHGUs8d3q4oJYDXp+/Kw2udifJfk+feAp6smZpJNaocVaD9Xk3IwdVPK9O96p56v3q1FhGNux96IyI+a3uwmbksea0U2dmNDf3A/mkdGnUhcqUY4lEVBnUhSpEg6l0dOokkgikVfrEd7tUUTfLUSbKQcm9B7tE12tEWAtFMPNHF4rU0SMmgemMoQLlxqplEvq9Ncn04yhkkQUogZPW4dfEg4s9kUCTyhAAAA6XRSTlMA/v7+Af7+/v7+/v7+/v7+Agb+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v4M/v7+/v7+/v7+/v7+/v4SF/4e/v7+Jf4t/v03/v7+/v7+/v79/v78/UdCX/7+MFP6/j15RP7+ZPz+Ud1X/en+kHTzq3/8/Kf+8XTF+lzYcvnvzfzbl/1gw/vEwoyW/LmSpevw9PzvjPyp3cDUqUbQ/O2Jovfx33ZvcNeJ++7l0qTo/bm337fm9aOF9+/lx9i3+fK68fXz4dL97qD+nM/guVzV7ui85ekk+c/8/PedyXpO/////////usWm0kAACAASURBVHja7J3NbhpZGkAji3WpallSSbwCT1AgFoiCrTeEDTI7O0I2XkTIUmaDZIk0vclLTBYjjcQui5mlV3mAeYe7qCnxAHO/794qyhg76Z4kbZtzaBMbY7pjt+r4+71v3gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxHGmEYRVGr1WpbOvexj9hPtOznw0aDbxUAwJH7QnRhVdHt9Yej0Wg8nlrWyuYh+rg8Yzwej0bDfr/XsU6xPuE7CQBwJITWGtYZo/Ox88X1ZrO6Ez7VmevbvPaR8J9Pn/Spd04pohPrkm7HhiYh31kAgNfsjeHIakMCjFIY8/l8IpwqA32ztz3sA6cl+vTJXLBfv1SZWJeMVSXtFjkuAIDXQSOKWh0bb4zHU8lMqTfm4gtRgrihkFuRpcUfZWcV0YmGJs4ko35PQxI8AgDwYt1h1TGsi8Obw5JlmVogT1OTJmli0Tv9098ecOAh+xL2pTRIUZGIR6xGJLWl4QgSAQB4ceron1l1XK9WS5elcuJw1ijSwtiLvzEmSB7DWUXv051cklIsey4pxCQ2lNl5ZLly0YgEI1gEAODZiyOMona3PxpPL6+tOSTk0MqGDTi2PuTQq3+SmCRReZgkedIhpT/2TZLWn6b3lUdKkYhHbDhSWiQkpQUA8FwJbdhh3bHeSNRR5qqcNIpdGuo7SO9FHNWbk8hOJoe+cpfsEpOIRuYajExHw247CvkhAQA8M6TaYd1xXakjK4schaSqqipHedlvPrj0m3owUhVBytgj2aWtkrqLnvSRfYqUR0Qi8+Xd6lpCkXaLQAQA4FnQCCMXdzh3TKryuFzhSyk8yDclwX13lAox+hXpfYv4uwPV9MC+E6T3Apb7oYgrjQxUIxqKXF8iEQCAZxJ49M+n6424Q67ThXVHmkvIsWeOdC8xVfvUTh/yrrlfK/8juJcMdjLaq7EXapGlRCL9TivkpwcA8BeFHlHbJ63mk1PXXpXlW+O7qx5UuqtCeP0TexX02D8mGa/65d87QDUg/wz0T/eBfcvSTOZIcn2SVZc0Bmv8U3sJE7gvH1QSGfW7rYgfIwDALyWM2t2hK5aLPLIs225NnmsCyiSHe6ueLFaYmkJc5ODccFpo668bRdebNOnKTe4qBn6yRAcSXRjkeoXzoqreB9XYiL7a5JNGIsNeK2JuHQDgFxG1+6Pp2lXLB+qOugdikUCcfC9xmbsyZeWisPGESCAbaP17MZnMLBeWpbK6z3LlHl66rShuL8qpWk1eQmVShiClQtwY+2R+sVytx6Mu2SwAgJ+OS1u5kod2WsnFuZ5/qvQRP9afu/9eYBzWHWarF/3BwjL78OHDx4/v37+/vLycTq/GyshxNjwbOkYl5/p5v8z32rJa3Sytc2Yz+1oSohRFnhdlYGJDkzy3/zKXzVpPRz0afAEAfro8pNlKIw/XaeXlEceJu+0VNB7vr7UG8WXuInfeEHGINaw2fru6+vu7d6Ozfq/X7ewOAonceqswDO37cuc+ihzyrJYeJCLr4c90PfzlpXWJqGQ+94Mp8h8+8NOGVUVkLWV1HAIA8DOIOn3fqXsql9/EuM7aMuoQgyQu+nhMHE0/+5HWOqyKIitUHTbgUG9YbZxZbXT1pA/rizBsNB6pUTxauZCvEMdErfKkEYlNbFyyWi4vdKmKdhpbdxSnxSCrHDLqE4cAAPxQwqjVHU3LvFUtaZUerIM/PWLuGqSKVEvZA5er+vj+8krDDaeNH7VypPGmMomqREwiex2tR1wGbrc0XkYNL1ab6TkOAQD4cfaQ0GNT5a3KXSRpqQyJOmLjJwCrMsjhFJYvYbvieBl0jN+d9WRtrojjp/VDiUhCEUm3P6w0clFulfeThvNP0t1LPQQA4AdcdqPOcLze3EneSoseqXFhRzNI0yBoNusbSUxdG3FyP5tVbV6XX/etO6w6rq7euaDjF245bPjMVq8/PPca8cGIDtAPFvPltSuH0NoLAPDnYw9NXJVjglmWW2eU1YzAcmLfmg93Wrl6ej0CcSkrXyafuYTVWb8MOn65FH1aS45H7L+VKfrNnVhk4dZ3LWYXNz4MIQ4BAPgTSMeVlD3mruCcS+liV+ZoNk9UH81DYx1xvYs3TXR0Lyvd8Zt1hzst0Krjr/4tv6Gr59/eTr9uJMqanKpEBtYh2trLMSIAAH889rD28Imr7VaODDxQJrf+kNujs+VKarZbvSSLO/7u3BE+qyPLQxeJ3H5eb9xZu4vB778vZrrrBIUAAHz/7+SNRiT2uF66skdeO7/DJOmB4wODh8usEl1HlSX2Vsrj6p2cLxtFf33UceCvrHWRjkQi643W1mX48B8zqYYMu1Z4/G8BAPCdscd65ZaUlPYoU1LGPFxoFRwMPlJdSZUtFveSVs/5t/kwLNNZriYyWSwmksn6QmMvAMD32KPr7KF1jzyXgCOOa1741k7EWKIUk7otVAsNPKw72uKOF5AKkkik1e4Nz2+/aE1kNpt9+HBDXy8AwDcunjIsONaeK8lcFX61bvJwQ8lTO3Vt7JEXZcmjDDxe3DdCZkXOp7JS66MOOU7Hb3tksgAAHok9OsNbGTUXe0jLlZxBa+L4+7fqup1WWjBfqDz6Io+XWoJWi4hENncXF/++WW00k0VBHQBgj6jdl2nBuc7T1TaVJLXF7PFTB3tYeeR54fNWl1ejvvZaveyQzIYi7d7bz1++2jjkXx+v1+Nhl0wWAED9Qmntcb52UxCyJPGhHeL4iUikOqXJumMyu3gvB46LPV7DL+uh7/AdT9fXN9eX09vzIQt7AQDKa6SUzdUebs1Vst9nFVfDH/GBCCTY2UPmty/HZ7326xqd0NrQ8PPXjfL1ts/ZUwAAbyR1pYUPaw+XuDKHNupK9NGMDx0RpfLYbrPBROXhElev73hYVcj57ecv680//zYkjQUAx46fF/TT5qqP9NHe3Dj23bzG7AyT6rDH4FTsMdUCwWtdQOjae61EPn8eDzu0YwHAsQcfneF0ffdJu66yqmweHDjWY1cBiauhEIk98jL28OPajdfdo2SF2317/lZXQIas6gWAYyWMuiOpm09Os2yruSujpY1mM5EViSf7CazaOGHsBSK7dScXyyOxh4tDonbnxx54BQDw0uyhTbtl6srUlpIEBxaT1Bt5XShiUjlNUNYNrscjaW09lqtpI3Rn7KIPADhKGlFHKx8TX/jYDZGfnBzca7U3B2LMtvD7zsfHueLj0SPaAQBe82/QYas3Xq+08lEtaXf9VSYIguQJf3h95FL3mC9XMu7RbnFsHwDAUeByVyutm+e5Rh/x7gCok2/qIzXb3VlLL2VBIgAA/N/60JFBd8Cgjv+d7KofJ+abm67MVpquZhc3l1OZ9yD0AAA4Dhou+PD60GkOfxqtkeqHObRvN6gv2c2zmj3IXAEAHEvw4Yc+dF1JYfUR+7HAajbQNONk/3zzYHcwrQ0+Frvz+bAHAMCRRB+73JUUzoP76Srjb0l88HBzk2+LweDUBh/H2nQFAHCs9ohavXPd1J5tszQ15r/m/ky5338lH1U5rWrY3M0LLmZyKh+pKwCAo9KH77uSifOtMUFS2aIse+yXz9OaPxJrDxt8rC5d6orvJwDAkdjD6mPo9FFk212w8fQhg82g2TzRLe15NpCRD38kOLEHAMCx6EMr55q7kr6r2qZ2HRyMdf2VHvZh7u1NbJ6oPiR1dTqXZSXUzQEAjopq6kNSV2ntWMHY1z/MXvbKaHNWEqs/imJwugs+0AcAwPFEH3v6iJ0+YlcqrxU/9F11iQgkaTaDQA4318qHBh/IAwDgqPQhjVcy9ZHn/gQoH3+4o6F8u5WPQPyO3fhE5glPjFtXcqPBB7krAIBjwutjPsi2/2PvbFbbyNIwDIVrK1sbhRKFD74DbbwSKQnJCP1ss7ENsd02mLaH4L8m7g60xCjauAk0HdBgDAPx7LKRFwZfwuz6BnwLB6ZUaOOV5nzfOadUScaJG1dlFn4fuR3HnZUEevSe7+fwEKDWhufx9KAn+H5aEetDzoofemSw1X7165uDdTTtAgDAk0sfNaOPVhTQfLk9veKzKuk43mzg/POmLF61+2r/9SEmBgEA4OmlD6UP6tttt6KQN5aQL6w/PFq566gU4sSHWHLWmKUPr0gfNRTOAQDgiemDL6p9T427URBIRwjhaUy1XH2Tnw6BBDmjD9q2S6WP9U61tIA97QAA8BT1QRuvQjqr4vgRF8/txVG+Xbwr9L5EvVBx0mopfRyQPvKQBwAAPCHm5vLVNd242wqlFBQ+hG29shKxYyC6l1fQ4Zb6P0HAy3b33xz8rVnNo3IOAABPyx/6onNauEv3nAsbPujPeARkpg8eBxG6EML6eLV/fLDaQPgAAICnp4+OGRsMaQWiEKb6ITzH9ezouS6l24uj+N8IGjqn9EFTH9iWCAAAT00fC6Xm+vG/37/guQ+e6dB2EI5LJNp46SfTdyV86ThBEEZtlT4OV7HvCgAAnhw8N8iXDVL88G284KMrQV/C6IP/4LIHycXPySCKWpQ+SB/ouwIAgKcWP/LV1XdnR5vtdhQFQZDje2i1O4S2hoi7sHzfkXbs3HNo4W6bD69qqH0AAMCTI19Z3T6jzl2lDxnoW8wFl8ftyisv8fB9Ofa0X3y67cPqA/Ej45CYL1Wq1Vqt0WhqGrVqtVLK5/HUAAD+b/ooNbf1zsSAih9KHDxiLnxrEPoSsT9kwGt3VTrxc6EpnUMfGaZDEket2dnY7V4OBteK0fWIoZ+vLi+7G2udRhWvAADg+78/lRrr794ebbYn0nReeUI4XN8wK7BMAtGnWcLRB1hSyiCcTGJ94InMKHRUm2sb3UtljdHNUNH7jOGNYvTn1WV3rYnpTQDA940fdutVFNimXCHi9MFDHnyMRVLxuKgu+FrCIIx46nwbnVeZ2UPJY697dT26uSFvnPYVW6enW8SP9NX/sf/TT/TbPnmEJYL1lQCA73Y6Ul3VN35EUZATJn7E+DpzkEBc3mnCcyE6f2h9HOi5D/gj9RcmX2msdQdKHsodyht9JY3TuyRb6qGYnmr6vd4tS2Svgw36AIDv8RGXih9HKn2EIfvjE3uIuO6hVWI2YunjK7pskK77qOC9KotYWGlsdFkeKnZQ4NDOWC6Xi4VCoUjfCsXF4uLidPqcuZ2SSFRMubkZXV/uNavIIQCAjPWxfkxz522VPhyueohnjniWkIid+/CEDh9GH7mw1aaNu9BHNvZoblxej4a9PsvjP3dl9VDuYGsQ6vvKykq9rt3xfKoe9E3RUw4ZDm9GKoc08NoAADI7JMnX1t/R1isa/MjlBCeMZwpWCQUOu/TK8+NgwvowY+fQR0b22Lu8vrH2WF5enlfeWC7Mx8mD9BHL4zOmbBFyyJ9X3TUUpwAA2eiDJz82eWliTtjqueOYJGLF4XPd3MyEsD2iqM366OCUJINXpdrRJ1faHuV5hVLGPHvD2ONzfUzjGEKPW+sQOsoihaC1FwCQ7hsVFT+OrT44cfixP/SK9vj+D3t4JUgfYRS12pv7x9tcqMUTmXL6qK5R+GB53FH0YHtofRiKiyv3hI8vc8jt6KrbQVMWACDtD7p7796aufOckkYul9isq9uv7OCHXaDoyRz5o93+ef9sexW3DabOgtZHj+1xV1b+UOIwCcTao7jyNX3c2jSiHULlkNFgo4bREABAim9VKn6cvd+kCwcDtoc+uOLVuub4SsxujzJ32dLC9ihqbx69OdjDhR+ZpI8u6aNPJ1flMsUPnT6WZ/5YeUD6MNSVQk77H/64+KVZQgQBAKQWP2rrx283261WGOQk2YNPrkztwzRfCS/hDv1FS69eHOnOXegjdX10Lo0+7srlgrFHYZY/1A/Fh+tjWn9eVwrpffj7P/6JVwsAkNpbVamzfcYX1gb6+Iou+3Co+UpPfoj4FilzAaFGyskEnbsZKX2h0uzODq8SR1Zc/5i3+eOh/pg+J38sUgL5104tjwACAEjJH3H8kDkVQKTOHnEC8WcJJGEP35NBRDt3D9F6lYE/SrW9qxGVzu8ofRRNs27ctfuN46vp/zzBWlT+OB2e76ICAgBIiYXS6vbbozY3X9HaXcclc0i948rRyxN525W9BYT1IVX8aLWPeOsV0kfa+qDa+UwfelJwZo55HUOKf6X6oeJHnWroHwc7FegeAJCOPvKNderdnYRhjjdbeZ6yBy/XtTd++J5D+3Z1BNE4tHO3TWtLsKcvg9fEnl7psys9ZZ40iG7jXfn6kdUn1Q8lkBXyB9XPoXsAQErvVRw/WpPx2LXX1FICiW/88H1JPlGJxBHS1kCc0Fz50UHxI31U/Bio+DE7vCpaZvr4ev6Yfpk/ps+nd6fDi90Gjq8AAOnogxZf7VPx3HFMvKA/pKsbeJUrHI8rITKuolMwcTh+0OQH3o3SZm6h0uleD3v9U60P/ioUv8gf7I+Hd2ARp8PzjSp8DwBIhVKid1cPlmuBUOVD33cuuJYuPcl+oWkQurl20tKnVxgmSN8f+drGFZ9eTRcLbA7deVX8pHrOm690tLhfItPPDNL7+PsOXjEAQBrvVLz46s2RGf3wjTtouEOK2b52x3XNTYTC1M7Hk0nrBa29wixBFk5vqPhBxXMTP7Q8CvHPhpWvquNLlXD5/PeXKH8AANIgX+LieWsS0tigjEfMlTMcvumDWq9cpQ+Xvjl6g4ngyY/NIz69wofZ1Fmo7FyOKH4slqnKUdTaMBmkOKt/mPJHnR9GJNP7Q8gi548TlM8BAOn4g/buUvE8dKh4LlW08PSlUL7kTe10fKXsYQ+1OIHIIGjx6RW17uI5TP9Fqe4N+PgqvuOjYAsgCZeoX1p/PKiKrv4Z5Y9fXkL5AIAUmKP4sb/ZboWuy5VzlUHIIawPqe8aVKjs4WmJUCld6SOctDbpzg+svcoifuQbuxfUfFVOzn0kDFI0e0wePv7Bu9ypfbf/8QTtVwCANPSRr64ecO9uyL27Sg80+OEqe/g0/0FVECHUr/TsoCdyrjfW+qDBc9pbgvvOU39RFirNk5H1x6x7t1D8PIL8he1X8QrejyfNPJ5jAMDjP+nq6kc0mYyl9odKGmPXdTxKH9L3yCFCX0HomXxCG06o9+r14Q+onWcjkEpncNFjf5jih5WG9Ujxm9uvpon/ZgmE6h+DDl41AEAK/tDVjyjUc+ckibHLePwbweODNDvI99nyNVKOiR8Hq1ijlJXVdwYflT+WC7blKnGClfhF8eHHV7P+3ZtBp4SnGADw6DeqfFPFjxetydhODnpSBZGxu0T1DlffeS7MOkWhd2B5Y8mTg68PsbQ9o/gxV9045+MrM/ehC+jWG8X48tr78kf9vjo6+WM42IA/AABpxA++dTAMHW9JPcx+XUn5g/7mC5oadGmfomsUIoQThq3Wz78dUOsu/JEFeeOPZS2QYnEWQ7RB7DjhygM7r+LxD/LH+U4FLxsA4NHxw8x+REFuthjRwDaRnq/Th+vSlSC8xJ23tv/6mgbP8T6UjT9qu9cf+lt6764d+ijOGrDsPSBKIH/9AGt4sVvFUwwAeOQ5yULFXhsVjpe4dO4aeYy98VgvSvRJIqQOT0+fO7lAxY9Xvx3+gL1XWb0u+WZXt++WE5dGmTJ6ITH+8UB/TBMV9dvpcHRSRQMWAODRn3NXzearUI6XYnmQMbxx8qJaFUbs9pKxih/UfIW9Vxm+Ls0uT58rf5QLSV3EJXTOJfOFYr1+320f9bgKMv2kg/e0d3PSwSsHAHjcx9y5UnP77D3fWivHHh1QLSmsPqTxyezCQT1gSPFj880Bencz9EfjZNTb2iqruFE2w+dJedhqeuFbA4T1RAKhnxdJIL2b85fIHwCAx+kjX119R/GDVl9R+WNJn1+5JArJx1mSf2CFCCUX11H5I4xaVP2oYYlSViwsNLsXva340vPkzsSZTBILeL+SQPhrqv9e1xsUh+cbFTzJAIDHfcytbR9T9WMytkdXS0s8+zF2qQNLuiqUjOV/2Tuf1ra1NIyXEm+jmIKNszCIfgFzwGhRHBvLmLjedpMpNE0bCHdSSjIJ3KZlpoHcbG65ncIFQ+iqMKtsuin0SxlGJ2gxWXnO+75HR5LjpHGKdTfP49RVHK8k0E/P+7c2HicZ9VJ1eXl5LR4csf3ACVzchdkx/uPy0hgMzwEkDV1lUiA/WmCbzOedCE9C5sfXHeyvhSDo5x5zG0Ma3B7H0dqy5QfBwzcvwYcxIvq+IYiuje1fl9fWooizH7Afi7SG3R3jP3h6oo1XJZ5jNdMFsvpDflhmtJwBCWUDyPt1XDwIgn6KHx07uH0tqlZLYj/EfxA5xjW2IcaaKK0TB1JajuKYej9eYGftAvFR7m7S+JJHlYq36roFHTOyupEfyUh3+5WQA1rcgY4JWBAE/dRdaqX/lIp3Y728XCpVBR1kPvhNc/aDQMKf22qs++O1KH78+t1+v4ETuMAr09n59mXLji95lJlckiZAEtVvWGBr0x9hK0mFEEEogPUJE0wgCPqZmxRVX/3G9uN+qUqMUFUl5oOJURvrkmYL4vu1tLI3iih7vtFZwRlcoDqbZ+I/yIFQDiQdeTVlQlZ/WIEVJlkQDmCFLcOPz/8s4/pBEPQTQZLOiz1e/HGf6VGqkpSt4fXJcvja19oYEMl9SGOITE4cthG9WqTa22ejk0vaPZhp/Zip1ewK2/C69Ln1IZYfx+c7XZxjCILurnKXFkcNBpHFR6kUKTrW2idk+DWihzbv3BIiE014be3rd/vreH5dLNu3T0cnvzQrCT+8SuVGfrRuDGIl3oP5wQbkrI8ECARBd9ZKY52qrwaxYUbNEkRrrto1yDDsMPajZg5pFi8RxLBkPNaa+LH3CgMwFqtG/9P5ydbWgww3vGkPspodYZL2oU/nQ8LkM4uPsGcMyBlG8EIQ9BOPuB22HxdRxNkPZV46uj8eU9pDPAc7kJo4EJ+8iI6S6iuMLlks21f6h8QPWlFLPSDeLAOyKlSxBiQUTvSuqeJ19DD8qF8ef3/bxRWEIOiut6hynxZHxfHamkt/6CRjTraDkEEz3bUvACEDYtxHzM0fsB+LVbm7c540oNskyOwQlnfdEqkwfxS2UoT0Lt+MzrbBDwiC7sqPtuw9jww+VJIAkQG8to7XdybE+g9fx1E8eLKL0VcFXB1uIGw2vcqqoMObaT9kCWGY2oxZxiOBiTMgk8nxZ2TQIQi6o5ZWKHt+RNW7hh+EjvuMDUmWmwOtBBs1NiG+H+jAj3Vsmz9QfbVg0QIp5od3DT6uZtDDGyeYCEsYHwYgx98/IYMOQdAdRaN3//FYNn9w7wd3gEiuXNeYJFqSHub/IAg4mU57a9H8UYT/KG9/G52IAaEI1g34IH6EmT6Pa/rPw5ar4A1DzqCDHxAE3c1+8OjdAfGD2gVVNekdlBG8WiqySpxAp3R6wBYkvhgcvdsfInteAN4PhR9sPTybQ5+ZR6cAVpiOunJd5+mn0ngujej8cX3r+HwTTwEQBN0FH9L88YT4oYUUSlWV8ikJomh+u21Cp24Q5oehR6DHcTzA4qhirlDn/Wcq4KUIVkIOqcW6voUwsRjZV9hK2eJKeFs9agF5hiAkBEF3io9I9ZVtHqz5vpLxJYqT6XYSL2mstfmpBWQ/ZPTuBpo/ClB7mxLohh8JMbyKl9Txetl8iDly/Ahdp0fGd0zxg74qLSDtewAIBEHz86OxQbOvBvFFSXHK3NgNw4+qsomQZAyWn3gQil9x+mN370UD/CgA8NunX7gBJJFDx9USXmohzKEjbRh00Mi4ERrCe3n8/RBV2BAE3SE6stTZOKDFtRfGfxAj/JqMT5SXTOHVCUV8pWgiVi2g5sF3++sNnMDFX6Fy9+35ydYjIYdUYNmDaZBYAxKmM64kzTHDgITuC5PJCBl0CILudHei0e1UfVVVqlSl2e1+KQleuTG8tZLMdFcl2wFC6Y+DV3hsLeQSdagDpGkLsFJ6eF7laknvapip0U1zIa00cR7mKWIAcny+00f8CoKguW9ODUl/RJGhQ6AkVqVcEa8ErSQFwo5EUShL62hwtEvVu7jtFCAawcsNIMkQk4rFx4wkOpXwhrbiKhfDyjuQTBKdp7hvw0lCEDSvaHMtrf64WGaLoQgRjha+9SGc+CiVKCtCASweXnL0r300nxej8pBGYDUr3gNXgWURkg9gcR96L3QTsK68piqx7A+tsT1EDzoEQXPzo/P3ParepeYP3/JC0udMj5Jv1xBSYRYNNiGEaF798e5pv7yCE1gEPzqHXw0/XPZcCOJy6V4mhuURP8KwdbVwd5bEnXAJ799gQCAImhMf5f7TA9pcG1Hqw/woIQg7EAcUNiBkTKqRMSDVKIqo+Ryj24vR0r325pmMwMrxI+knzBsRDmC1pixGjiCtXCjL/NAe9LfIZUEQNN+taanR3+fZu7pUrSZJciM2I74tuOKyLJrHy2sJIxVFMrq9DftRkAF5dkoBrKYQpJKxHt50M4hne9Cnqq7SnR8zrMhkMhmdbiMWCUHQfP6DVkc9Hxh8ECq4ukr5XLTLQxMJIcpPej84fhWR+4jjI5qdiDtOQVeJZ7g3WVJ05fpAvEw7uuVHL7zSNehqeVsOLc6S2AwIpvBCEDTnk217Y2/3ecz88INAqnPZh3Dig3lCFkT6QIgfRgYfg+e/vuqWUX5VkE1sbJ594QreZjPbRpgGs1woy6MMyKyMRysfwcr9acJDTBDAgiBonhvTCq0efBzLYCuLDyKGIh/CLBEzwj0gFNqKlDYGZPDk9d5GG/woSo11WmLbfFTx0oiVlx2H5bkwlpcp4Z2mRyv/e4oUY0C+HrZxniEImsd/dKl7MA5kqm5CD8OOLELkTTZLGYDEUfSYVkc1VjA1qSCtj99l9QAAIABJREFU9N8bfvyXZvASJ5ouj55lh5vMmwNIK4uP1jQ47Hfqk+PRpyEMCARB8zzY9l/+/noQx7TWw/kPSZrbQz9JpcsILFWtGvsxOPqA4SVF8qO9+e3LL7JEKk2ge/kAVlLWSz0gs6t1c5GrnCWhEqwd1ENAEDSH/WgM/9h9/njwPwuMTAQrpYm2+JCdhL6KLgaD19T9AfdRlJbKw8MvtAQkU37lrEclcySHq7MBkhF9oS6HdfNqhZM3o2/biEdCEDTHc+3G3p80fFcph4sgdSCpJ0km8FIqvUqra3992sXdpkCAyBKQlBtejiKpDREHcjNAeoQP89aq5yJYWIQOQdBct6UNXn0eqyAgl5EJYqlsPEtyIDzYXVXXIsOPg1cd+I8C1RiejU62mg+8bAdINoGecSC35AebEOdCqARr2MCJhiDolip3ePiu4YfiZHmQWBCXTieiKO4oZIRUuQNkQLs/2kvgR4Falwx6jhvZDEhmM6HU8Fo+ZFBxlSD15A8tW4K1ghMNQdAt+dF9+fvrx4OLyMWrUteR/qICW49F/ejGgcQfj3b38axaqFbKkkH3pgyId7X+ykv2SPXCLDjyFKmnYSz5tH45GZ1iDwgEQbe+KXH3+SCKdN6A0P8UwNK+lkN2IIq2g1SrF4YfH/bXy3hWLU5L98r9tzzDJJf2yJmRSrqc0Kv0rubL3UFPolb1BCoCkjotIuzjokIQdDt+NIZ7vzE/pGXQsSMQ16E4kqXlmCa7U/+5rD5/2kX6o1i1N8/+s7XVnEp85AZhVdxsE8mA9PLsyEexMg5EqCJ7QAAQCIJuxY/28I/dJ4MLsh9KBUHWfVDMigwI/aoDtiC0/UNVo3jwkdPnOH+FqtznHvQHzmhU8lmQNHvuxijmDUgv4z+c+2CMcAirV5+8OT99hqo6CIJux4+Ng10a3q6VDrSr4TUcMSwJFP2QA9HcEMKMUQ9peuLH3b0NpM8L1lJn899pBmTKgEwpbULvCR56UyypJ+yo22w6IWTyBjW8EATd8o601H168OcTbv+QqVeEkMC8MTooaMWxrIAOtP0C4YPT58BHwVervE1T3B9kej5yE9ynOtM5A8LoSAJUmWIsgQe/t5J6LAbI6FO/gVMNQdAtQiIy/YrKdyn7YS2GrwQegZCEYllsSSgBYr4S0/KPfewe/Avc4s5nMSDpCsLKFffhhrtX0uKqXj790Usy6DYJwp/Rf5NLY0DwYABB0K34QeW7xI+kgNcChIyIfQvEkwRainiFH+/2u7jNFK7G8NOXEzvDpDKd9PByY3lJqy7dkfEfPec+ZHKJS4vQq375ZnQ6xIMBBEE/fqDl8t2PcRxF1nnYGJX1IA+V+BBxH/TP/D0O4vjowyv4j79APMQkXWOb50jmQ/tvNUl/uCCW40dSfJWxIPRp/fL4fLODJwMIgn78QLv+Usp3ubJKU/yK8+jKguPhQ/WQ7YcVHdDyqCMq3wU/itZS+dn/2Tuf1ybaLY5LyGzTDAMtGcqEYbZ3MQzIXHgxCTGE/NhmEwNXawSpFdG04C/wLTTlhfJWLhSE0pWXu+rGhYJ/gn/E/RcGnCmD1FXvc8555ldMUxeJ0Hi+aZPYRhAk88n3fM85z/G7zY2bqytaFiHTU3RqwWpEDGkkTkMmH+JGKUgjikZgi8kJ73FnsVhXX4/s1tMxtF/5FG3EckIACdDCIn7ItixQeB62nzx/XP2FF5miqtp2tSZUF6pVq7at/pZnVxVrd09fbPyxmt1bsjJpQWKgNCjXaBA/ZJsVfjWS5COVj9wysIe3yW8NFot11eXI7h8K/4HxuQL8QIS4FH3gQAjYDwt2K8YeJBD2o/Pm+f3q4i/feeBGtd7q9geD4fDw8PBjJPF8OBw86ndb9aqtFou/DUvUB/vvYYZQW7mZbrdaXZl4Ih/1iBwpRQiRbbx0i0KRhnEBe3hr/N5gsVhX+Y87OH4e+opCC0qk/zADR1gQl/IQC54kNazQD9+++fv+wjft5VW71uwOBDe2D8bjo6PR6F6skdDR0ZcvXwAlw0ddQZHib/E/Vqy++pBaYjJVaa6QAZkkSGp9YmoanapbFKHb/OZgsVhXXI3i8cEkOc9IToGgA3EDR8H847zz5ul9e7HrS4p2rfVoCOjYEtzodTrtdvus3TmDRyHxBNQDlByNv3w8HA4ERNRlh0geDkJ/Ry1YcIitNh0fycNqlH1M4ON2qg8LyGHgYSCGAXWt77sfdni5AIvFuqIaUhscEj9gObsTZehBCiBmIDGCLVjwjMbPW/bCakb5IjiP/vAwxY7Q9/0K3EIPnkqFQmeCKoCRI4CIcCL2Ugcj+Rv1hyd7Gzdnuo90QUuX9mPChiQhCNBDniNl3LoNALm4ePfpLi83Y7FYsz/k4/h5eB4qJhoQhZgRSnZYwAvaa4Lz6FTDQv+xyO3tRbXWHQy3DwQ8yG2cnVUqhVxJ8bwo3/dA8tE/EwgREhA5+iIgMujWlriYVVT/dSyXmPzxMwxZ1Rs/FrCSDASHPlKzIMCPxsXF6Z8tfnewWKyZ/qM5OBi9hfgDzxZU5IZEJ+NAoB0rwClC4kcQnuP4+WI+oArzUW0NhPU4GvU67RDZUSkoJZJJ92ZJyeVynleGP3m5gnjJ2Rm4kXaHjMigVVWXdD2XWn94urd5c3XlKkV1LH0qPyRBouoVJSGynmW82D15UOW3B4vFmnktenYw6pyH/ppJ5SvChy+zD/IhLha0hA/Bde6SHwvbvqvazf5we3x0D+gBpSqBh0KhLEhRJoQIlAQl+Bb366UySDAkEK+qCC8SMeRge9iv28tYycrbd4/fb2ysrM5mRzJIqEtcpLxHVkacnUN8Tnt4P+83OQFhsVizPus3h6/vdWB7ooIAWVubTM8TDxLIBe/QwAv8WEyJqGiD+TiCwlUI+BA2QwADGBERRPzRQ3oEJc8rRRL/fPgV2hKESG80/igQoi5fJUut75zuySVYM6xH8tsp1Jj4k+zhlYMit28Z0MPLBoTFYs26FLWevX4C9StHked7+LEJSSMkpBYscCCOifwY1IsLuDLn1WpLmI9RD0IP3xfGY02AoxxTopR66nnr4iYJIoxI/DtFEV7EP2sLH3J0cPiouXQupHrneHfz282Vn65gTRiQyVpWPANiRAt74Sjbf/MUOovFmiFb+I+XUCai7buOY4XWlCZeiyIROEZKPPrh+cvXz2oLyD+KarU72N661xGWyK8UhPMgdsCdUlaEhL3IiZ95kiBCJS9XpkJWhA8KSdY935cIGTTt5eomav15urep4QzhT2h1eoSerV/FBEEbAmuwPr+qMkBYLNbl9Ss8/Tze3k7hh+X8WMSyHAEWF4J01wkx/6gv4FM9FK8AH1C78iDkoNhjDchRwi+U9B8CGgAOcR94paSSFYXsgJBKhJB+c4lasvLqg0/vNzc0wQ9tYgJE+9GCiJfpDb0xQ0b8xMAopEFrsD494APCWCzW5f6j9WzcQ3zg8naBCSuDDzfu5MUf4wihA8dHPX+8gOp40W4Otsfoh3xJCek8MNqQtSlFmo9UJauU5YesZAFevAohZCQQsjxZiFp/BS1YmkCDpk3iYxIp8MeZ+Mg4kIYRVbBenO63bjBAWCzWZR9km8PXvdAiNoibk8x/hJkIXYDFkiekh5B/PL8//8/zebXWfzqG06z8NQXzcIJBubyGpoMSjnIaFICNmBxB5jeIj9J6oVDI+TBiKFzIsLssFRn7zvF/N78BQDQtch1a9JBgQ5NAyQ6B6DOTELynKXQ+ypbFYs34IAv1K4o8aMOuc6kET3AVL9avnjy/P3//UbRbQ9ymEkLUgvww0XKg8chyA39nykberPmYEPy9XKEiENIbjbcH9eVIQmo7J3sIEDAgKW78CBH6yWoGGljPSn81jIY0HwY8bVzAECEscrf5PcJisS6vX70k/yGX7VqpvVeOE6XpbjwW4sL55+2Xf/fn3tWUt+sDwge1eiHP4izjUkX4mPVCaAJeq/i+QMjBsL/wxY+/AvxwDsg3dB/aZPihxdYjKWet6vqV7oOMhxwuvG1cwBBIvchvEhaLdQk/sH7lWG7UZpUQRP6E6ljCD8CZIJYDNa72W+E/7DmXgvJqtT88GMHURyDhIQmixBhRSkk7loKRiKnQOKEyDRvriQkp5xRFgY6szj1hQq790Yn5G7W7J3sbXzUt4oSWuk0E6VpcwZrFjzgCgRS9YdwSJuTF7ocdHgJhsViXXLO7w63euSU7dF1a1U5rr5zkFBA5hA788OE3kJ/3q3POVvMq7uKC6pUbuCUzTZCMu0gQYhI2TIo+8IVuCb7MySwk+ivU0ytMyHUvzOSL3Z33m9++kgPR0r4jLlplfEhkQHSqXulTaljkPGR+ftsAA7L76RH38LJYrOkloy4ePyj5gfBwY4645sQUoU8v88/bgh/zvgAXhf3AWUYAiEACnlhlRlUsU4nmOiRLTPIc4uf0CoxDzNIlWXrMkPVCxT9DE9Jf0AD9L1LRvnvyfvMrxeeapmUNR4YnkJFoBBD9Mn7EEYjMz/HpxffddzstBgiLxZp2EVJbdPygJQtXuKY98h40bp7YD/EC3wktWN/+ZO79V2g/tqB3N3QD03RLaEEigGAZC8tVZgYhmZkP8h9wA3wElIzQlEhA4yLrQh4sWxQE2doeXOszLtTmzrs9NCCpslWq5yr9qEUAMfSIIKAf7Id0HvE0iDAgnx8uQ1zEYrEWUb96utWT+HDReVh0T5YDHIhkSJDE6cSP+RbG80W7OzwYdcJzwQ+oX7mJ/yjFZSxTiTiRrOJNzwyaZiZXhw1ZdBfQjIjAh2BIYX29UjkLoYzVvMbdWLVHx5iARHxIRelaqhtLUoRKWAANA/Bh4GO2giX7sJJGXwOOIvz0gPnBYrGmCOpXnZAasFxZvCLvEd252SwELEi73Yb5wbl+eM8Xa/3Dca9tYXqOW+LJeiQOJHIhEUTSCJEZSSoCCQL48iQ9aNlizkMLkisUcoIgXti5Nx52r+1qk3xz/3Tv2z+0SQeirUywY0W+BPiB0DCIIbqeIoeetSESIGBA/sMngbBYrGn1q+4h+A/fca3olEEnikDckB5lDhLg8itckRWeP3n9eM77r9QanKQL1at/UvOuREiaHgQIxcw4kIm+3ciCBPHNK8kHDzdmCX4IFcrrcGZIuzc+vK5BSF59cCJ7eKUHkT4j24YV2RJZwRII0bGKZehGihzRt9x0Epewvr/YPfmLpwhZLNZU/7GF+0ssiyJzJ7YecOAHhehYxEqF6T70Xw1q+TnzY7ANo+eOBeAgDyL+AehAEimmQl9kNjL4kKaEIBMokh5Zebi0F/hRgHNDCkCQre3+9QxC8k04SEomIFp24ENLzxLGBS50ILpODAFg6JIXOvmRhq6nZgzFN1Sw/rfPU4QsFmvKVbv1FPZNCf/h4nB54CbmI8BvpIf4lvgQF3PKP+Zcv8JJ+FE7tFw87lDBgw6BWuhAfkQIJelm0pJlpqbSESGBghUsEtW0SutkQMpl3OJbLpVywoSEvdHB9YzSi3f238sIXUtPok+Ws+II5OYq4sOIIKKn+rHiZ3rakUAP1uf9OvdgseZb+FDVYpHXc1535VtDnPiG9VbUgBXIk85dN8lA4hoWLHGHBbyCH/3afP/z7dYQOsFo9DyQ4+dwXm5CDlfygxACBImSEHOyhAUjIYp0Hx6iI9qW9X/2zq6lrTWL4yWY27wQUCwSCdvLXIRAZlsCTQgSspMrwZsYzqmpp0gaCWqO1DRDFWIp6HRP4UCGTudG27npjcII3s4nkPkgAbPLRpKrM89a63n2i40zncP2NBmetUOyfUMxL7/813+9gAMyiwSZpwgEHveLjCD5yctiTSU2zk4wg2Xzw7p1+Ol2gstWINxBJxfdKsoSLEF8sO+LggA5uJA1WDK85UcmXyrlspkEcgRAIlEykfojB/NLwEAnfihkn5ODDQaIqopSXngtd+Svyhmv+fGWOlHUGBMgjCAEDzJA3Poj6eorjN0x1cQ+bqWw5pgAmZt3ROAxJ8jEvcvGGt5aROSnXKojEnT0pdNHkRTwg+ODAEFeiBVLPIf1UBRgscveXvf1qhQgMrx85xMu7Z+fn+6/eb5aKhXyeSSJlCMTdzeGcutt1B8sMIOl2PRQeQqJCJJkX+dDTkwT6q+8zfhA+W59DTJpSTTPoQGEZ65UUYhFkXTnssgKmf1ahhj2pccoovbgABd93jdL/Ag4GIIEWZ+44YpiE2FE1FhF3K0g9lhFIUC49sAcFpcgAiBcfzwU/kcUF4JADdbnDZnBkuHpK0/m5T//dnl2dnZ1cXHOSEIoyecS4ZCkyCS9ga2013RwrTGBxRQHDsNSVQXlB+LDtBoKFVQgimnqa8ebHr/WZkqWE8NQMcu54VIhsZhFFKKIf1T2ap6GmjjwMdtTUYXMqXMq1vH6ufwIWDeMKL6exghSmKiH79QDWIVuZbAERay+c+c4E5IhKUuAiGRV1HLOnZ9FCRLF+HVYPfjw0//R+i0ZY5H5+Mtf//7HTyw6J91u9/Ly8urq6l/n5/vPS7lMOCwhMiH3YuWohfxQaDi7SuxQVCuFhZ8BbDABwm122l/r6SvtVOLpFjgxhpGMGUkj5tJAt0101wezfnciy+9WINQR0puFpFgPFhUaxqzP5+fWRyAwNz83FyAvxIdZrMly0kM/vscxWEFnCsuayus2QYKOLkIhQOiy5Epf8aIs+DpEOj3sdF//+EACRIaHkSh8/LS7u1ur1Tq13Q47gCUnXeDI+emb1QJIEflfGvfIkf5QuIEOxgOa6e4UFnSk8xZDIIipt+rbeY/zV9D+oX3pJ3EHCfdbDLLSHQhxnqhWNVbMtbk2ZpnliI8YdqLHoJvQMHoqA4nh88345hk5gB8Bpj98MzO4mgqyWM1KdpL4kfnpQ+fZtZigKKwQe5DJLQXCBUiaHSKTdYsdzlwWCZD0cG/vw35OWpwyPH3vCgCpuYLxhDDCKHIBUiSfgYSWfOCNbQIku9luDMy+QgY6BwZ9pHAVYqoiccWOmAryQ28db+c9lR8PsuXmzooGkPLTvHin/uEIsZ0ZbC+0XBB/zN0GIsYrGjRckUZpQTWvCvhQ4awHPSBzcJCZzhE0b5jaTrM8QUPLw/mXVMNrOyCijzAY/MpGD/ImkIcPpxEh3D1fum2gWyYJnjCAHLxflZPcZXj80P14ssvEsxXVm2q19owFYKRz0L08u7g43V8tZBMynzWm/MhsNhuaVX9F7jnRY5GLEAPXSqGNzqtrYf95e9tbRzWUKbM/ROvP0JYqKMOy+GHaQgiaGeEgEUII8WNLodX54egpNKjHEAa6G1jWZfR6JjsMs9frs3hMgW6IaD6c7Zkr9bflyXnAhp+8P6ne2ENMHCaI20l37CJkkX44bQmQ6AgFssR71FGn/Lp30H2Xlxa6DG9TWAwgFj9S/PbmpnZT+0ONKLLbOQGKMIjkJEPGMbLlFzu61sfSKxQgaH4sIj4UK40F400wiYWZLcUctI43Pc5fZSrNRlFsQhT8MCx2GOqosMdj0Y4p0U0orBEwQ2CW7ywDh8GwYUdf07QvGIiQALSDIILUWVjvfrheSExIviacefl5t5ZyOegR9xgs51xeGmMSRX5YWayRwYUJuCM4B+vnyR54L2M8FQgAJGXRAwHC4tGjRzXGEZ7SOumeXZzvr1I2S/7bxifAdmjoumkBRFFtBWKnsNA5N+AGfRJzoB9v50OevpwQyEyRv4IUViwG7YyGDREGC8PtqyNl3DOyQI+g6BAMASFicHZoWrG4grFGsbJSLBY1FCMBn9/AH+j1TW2tPSmzeafChXddXIUu4OEK0XoesWp4I5aF7sCHyFi5XRCSIOzTadhFuJGQTxgZ3j52HQokdR1hF3YIhlwzijA1wqTIDz8AQy7Pzk+fF7KyEnCcJGR5q6EPTN59zp1zxXZAGCwUU6WaXl6cpSQHA73+p5zn/nmjqJnJWwH97gANUx0dMX7hsGAASEKDut/WIT2fr9fj7Gg1duqHh0dHR81/0MFODw8Pf9lZYxAx+yaTKT34KfYD2uS0pGef/LlTE2NMgs5a3qA9VzHoLPClMSaAj2kbIVHb9KDarOiSjZH0ELoI5TNXxn0pEODHNVzi1wsLcYaPBXZ2zc7Zaa3KKAJC5ACSWRulXELKkDHhR2Grruua2H2eFKVXFj5Qg+ApvWAvIlP0V1tPvX17jiCDScAkPMQSXUxl3QUPVY05ElkYhj/m4od/xtdH8aG1GvV2s7m1XamUy6VSgaJUKpcrlfW3zaN2fafFGGL2+z0GIYMRR2s0n0/CO+6pqcLrz7u1m3g8HhklQCLuhbZ2EW+UK5C0bYEIfAgREqUMFuPMcLj3eV9OcpdxPwoktUwiBNRHhBGEsQPoEY8vsOtl0CE31Wq1UxPJrDeSIWNx94VgAO9gkEwKA51SVGiDCHaABhG6BHNZio4LCL3lR6lZ10387daoXwXqsAynh27yK/OWIgGTA/EhekK4EeL3z/QZCZjweHX8YrtSLuRo5M6UNXEnFAqHE5lsvlSurDfb9QZABGQIaJbi4dYk9F3DIPeTZzduaNj0sCuynALEqtx1WyBR+4hGbZaAAKkenD3JyqeMjPtRIBDLFkMoFpyuSPUaGVKrdTrAkCtiiPwHft97r7Bdb5mm0B+EEFWxU1gCH0CQRdzNwb5hAAMUPX1vHgpj/yDUX2FxFf9rkjHIX8HykTvCdDYZgm6xTA/QHoHHiI9Wo93cqpTz2UR4tP82NcUwkkhkC+X1rWZ9DXSIYfa/mOZKuzIByy9CuZc0yD04ygGxq3odia1pwQ7IYYkslTWbN+q6IYIwgHQvSrIGS4bXKZD8x0/OKl6BEedJhIwRTHGlCCJQ3nt1+qaQkXVZ3/WlZ73d0gd9vuyc+MFzV6otQBhCFqEqS11koSoDs/Vi01v2JxjIigPuf1iL18UGK94ar9zuCblthdBgE649ZmZIfDTqzW1SHqFQ6K6qKkAISJFsvlxpHu7AUDDT7Jta46g8/q+Z4dI7eA8Xj3xLWPyIOroHnS6I3ZfOv4UqsYbDzuXrvHyyyrhHBcKQscyvEB8L4IcgPQghqetUKhJJpYYMIeipX51Dba9MZX2v3Edus72mD7B1MMYVCM9g2ZG0yrGgsJcBZDBoHZc9zWVMhfPrdZ2EkJK08RFTqZvQBZCR+kOMCFaFAokBPcziWr29VYGqjW97jAFFMoXK2yMmQ8Bz11Z2tsafIImND2ChkwUS/O/8iDjGmIzIXy0581jCDpmGXYT7MoMl4x4AwhXI8vUNHJYaYedkgxA82AOXXaUohmCIdIghb0pShnwf/QENhLqGYwtjSSridQDDUcjLLoucH4qp6cfb3i4A4ZMc+zM4qBEXIiI+YgCPGE1whD4UxQEOc6QKwZ2FNI1EQ/GxXs7/j4+uqXAiV15v1htFDZa9H62Pe+vDVPbnz7RJ6ts0iABI1OWBRN0eiE0RiiG2oSfkk0bGfQFkmVfuIkaukRxxtNItCQKtIgwhBJHhkPyQA5Ihsjnk93/hyZS3doo6rY0l7cFn8X5FEGSHgldMf3g9ACuc3W63wEDnf0GSj4sXO3XpioZw/YeCLMpiwe3M4z7krg6bldJvGcUWZggpraMZorfqW4Ux36CUKMAg9zjwIz5acUQcK9LZt/FJ7owi6Wm4nk5P39lJyIt80+lqp/tzQVogMjx/+FoK5IYH2efxmzj0gZClHqFGwxQlsVKpILtmnxoKO+Ti9HleDl38nfmReNqs65pJrYOjlIejk5BdOEQGWMDr6V2VrbxY002bYPj3iL2H9gJdhfeimHxL4h0smZ3pmwNzZQfwkf1t70vAU8+W3x79sqa3Xr2ojDlBck8gg2XV8MYd18G7LZBphg1y0BlEpq2KLOfBsJFOT8OX01CDdbmRlQCR4bkCKdgAieOB9bvgfjCIRP7N3vm9tLGmcVzKnFuTMDDSRpAyXs5FCIyODJiQi5DEq4I3aTi1aZQSFVGj2Bx7bKlKl3iSdlfw0Hpl171Yb7qgnEIv9tar/U8KEQlhzl7t+zzvj5mJiae7Z9LNgfeJmqmxNNRJPvN9vs+PtmfGCSeIaWpaiHDENs2iCQg5RRlCXu5ShXw7fkTyUMDbiuvuCsIeFEF8TAI+Jh0owMoEmskAkK00Wrp4AnRUCt89wgepIF3YYsRbdQh1zvcqJXI+/e8nVDicmCmdXx7u/PNgtTDYxUeZ/ZNyuUmR4YPIbRksDeeYaBotwnIViAsP1mWI6gQBcjEniyZlBK9AZv7sKpBxFB2YwzKabaMIjYVFk+euCEJM7FZnWSzbZrks6A45AoRIM+TbgT+1ttdw2AIpXqwb74GPSSi+0i2dXNpXfwq2gHcIQJZzmAPDq79YURgA5D4303WdL0VkDY2dYeGMR8fJPkb18ftm5iiRROb1v84rB7/8Uv/7AI+gVZT5i5MFECDG13kgIQYQDTNXGt7ueQeb2KLAF+/gcdssPjvan5evThnBA2T+DQBkHAUI5K48zR9ofhiMH2h/NE0RFB8Y4Kif7h59RBUizZBv8bYzlFo7mHWcK44MGOU+0iOFhW/VkL4ib87VwBsI06usAIsvI2E7EWkxL2s2Z0ksRo9WV4LQp+lkq0uoPrBZ8Pf8F4VjyZnFwurWwV59gCeaKLEfz3YX2jxxJRjSuyLLO4nX5lLEixBPEov9FBEgz85epOVLU0bg529i/s1muT3+gJCDTr/yNoAYQBD4BEww+5yqEUQI+6QIYWaILOv9FhFOLoNvHe/IWnUgJEpuOk0owb0DBbzLyWDPn3TpIEdAJpSHLvav+5ZZcaUU1z3VvBa74QcRSYQsTnalVsoH0qGqhCOxVGaxVNmrzMQG9jcZSf5wUp6CCzWD8cPo1pHu+T7lh8bFByoM5qm7uSsOEvpDkME6npMe03JhAAAgAElEQVSTeGUEH8k5AEizPU6HXrV5GwgnCOJDnMTUA6FOuqtAWF1veXPzBBCSjMjlU33mR6JQqYoN6NwEadxoPvfBhACksb0WrJGKIHNa5N9j7e8UVrRsV8y5gvGNQA4w0S2UH1bL8isQC7JsrVb28VKl8F8U7iosejy7cCSRXvx8XskPrI2uRGZ+PqVdhFAv39v+8HjrrtwQFoh274aNTut7NaZAnh29y8Tkq1JGfwAy1Sb0YBKEt4RwBcK6QIQTQvEBpVi2DyLk0XJ5c/flpwuayJJnax9/aTA43c0bCR0yItJZghrMmYharZbT2FkLuJIzRkCWda7iFp+0xcZtuRLkvhBAceHns3yVNcn1B9wcy2nliPyYSUS+9t3+t88xIkIyi5/r+cHdZJN4Sl5/TYNKD8PoZaEb7FHyofkUiKZxJ52DxPZ66cgXIkB2P+2nZGZARvCRevqKAASmJY7Dh+ExQVB98MorchIDP4pooXutEJcgRRNUiECI/L/t21Xrk8pOo+HouocderzDQnfcQ2gidFoNKOANthAnAqOAHfwXkAq0YJg2DOpu9znwhEkUv+vRstxElvPvRnWvXkh/xVu9AlNLYolEMpWGyKTTqWSi66AsBTXI60xyQLfYKEPJt2cUIPjB0liGatzsCkHGMIAwcGg2WOmIEKY1yJ+h9IrxQ2MFv2Zx9/iFXGYro08AWSD8mHqABCHncNvgvYRIEOSGyuqvIJ1FeWKGzFAIGkJEqFCfBV7I7tHHixcZWTPYr4jMrEEBb8trfTB4jES7uOhQwgsbpFa28olghWGmtJRzHN3iFjgcecb+cknibifxJ63IrWVhEH6Q51cr3XrhoShIjmQqk18slOr1+jmJWu388rx2XqnXSyWY1osTF8MirQVGSALwMaCX35FHb07K8LJDbrA7n+5gQDGoS2KoIcoI+gU5gvVYmtAbwvnQoASLcETDbeh/iMn2Mv5wkX5BADIxRfjxAPJYBB/GOC3IMqgDgmtuqAtSxCMqQdBHD5kMIU1GENVsw5wsgpD9Remm9yfCKdgA0uqcdTXSpQyrRXRIFDNHkL/aWk4E3YG+V3UctL/5qhFBDw9EaHHvDf3BElgsl+VUlyp5kB/KLboDTXECjsvLy8PDw/V1tpIQv64fHu7t1c7rJTq3lxMDJ/WGB5UfQ8m5V6yL0CM/eMpK9TSHCGUSAsFh0ypejRNE45IEaQJ4wZt2D1sJzV+fHb2Vk3hl9BMgEESDjBvwYfBxJpQfTao8KEKKogqLwEMVEkTFdJZqEBmCFVmyIKtvmrGw/Zhc9jt6N6O8I3lFEBIl8sOKtxyiP5LB/jpii1swylG3LO5r4BZ2wIjFmhdRe8R130YrTg+qPOiB06puo/uh9KZHIj1TIKKDoGMd9tjO5mDYFUxMvM7SyOVmASOXBCKLPGl1q8k+AJHZeF+eaKoGQ4jAhL/wSqS0yA+YXH3Q5JX4SltD/LKEyA87BBmsZ582UhIgMgIPRXm08WqzPAE5rPY4IGScyGmgh8r4Qa1zlcsQk2kQldf1quxOpUYJggQnLZ6AFSI7CwPXH4nlWpXpj6h+Szi8GIv8FEzg3VoOuIwznKYGCGDAYmaGpU/yvSMWM8/vu7t1u/UO4t92GiuVQrpX5YWC9HhYIsqDsiOXvcaYvp6mcTVNDq+vrq9gBCOByOXl+WfKkLAy0NUc4bl3p7SLEOnBslQe1SG8EAEWU9M84BCHXJJQjHDGoBgxfy3DNvSwfPHICDwiM/vvCUAm0EaHvYPjBp3hXsT5JUW2KJ2pD6ZEWA4LfRCTaRPhreMRs0L+8TQdk+VYQQJ/KJHfWnGc+O346FQnLWwACfYSVEktQyujzk0MdqdTFSJEh657XBA/OnRagQXtKTuriz0H4WBHYAHpQVRHToBjmHyOkvjy5e4XT8AklNl10CGvcRTjIIvgcOKHMw9ADG8VltdGNwzXDwEk2BwOXcL2ocU2bdsulo8uZBu6jH6cwbH5/fffLyxMTFAR0mZTeNH4IPwQI3j5IF5VjOPlvYV0skmRHBTNIjPYzSa2hZweffwwn5BdIQG+a8eebK00HAsG7Eaj0W5tg06HCwL4aGV31gLuQw5H8hV4JhYnBwAB72kCS+DDt5LEGzoVLkR+PN5ezffkRySWzpcqNaI9QHggO4bvjAE5RsdGh8eG8RCXUH2Bo+lpwpBsNgs6pAItiZGeW6j+/7/NSPrtSXmKAkR1c1j+JFZHXVbIRkCEbHLTNFNoEB9ShAlC9AdksM4+yG3oMvpyChMF8nxzoYwxUZ6YGme+B+0bxAmKJs5SpNukvC66KiAi/tT8telW9ZbLmydn+0SESCcksF9XfnWHpo0IMKI9XBD/9+O0ACsT8G8hlvmJ8MPhLgYqEHhacKOz4yky4h4RMul2D9INiZPY3diz+koJK5HETKkOmatZIj0AHcMkxiAIPsZYAD1GvwBFxu6SB0aJNrnGXNblOXa1D+wVTOzhX9kqKS5AXN3ReUyLtFSYZCpURjcd0qlAIKP88vhpSr56ZPThHSmc+vFPf3v+/HsSCyTK2EoIb/8sF2syapg0l6Wa3PcwVeac08SV2xlSFLOyYHEh1GPNpWQPbFDv2mA7YNoI8OF0qo+bHkhcv3LQYQg6lZhaO2jQCiyRw9KjKEJ0i2kQkbhiR8JG58O5WpMOeXJLtUKm2y4AsD6SMyXYUDubo/gYHiG4GGbYGBWHQI6xsTtAj7v4CCiRq+vr3Oz63nkpkxjUtlYlCQZk2/AThJnlvHrXQxUGEPMmKPy2iO1RINgEcvTuoewCkdEXgCQe/fzqLycnp6ebGGUiRh6UHyBHuBKh7gZLYqnqzVRWUS1CAqsjqJ2+uXsETSGSIEGkjdKlbbAd0HdAZkQpO6IdnronjQUN6NXtoA30odiT7arXAEGMRFk+S2dCxLOVXRdZLd6IDlk4sD+WKsAPpcupiZsFCT5yWchdUeExMjYi+DE6PDYyIlTId3fuiGOqQqavwA2p1RdTA9pGOPTo3clCu9lk6HBLeT2JK/F9muAKkdCAISGevbpBkRB5DNJbkOTScMoQbEOXNVgy+pMUiT2ae/Fh/+Li+PjsDEByukswQqJYZAwxcaSbSw8mQvhIE75kqhMfcLFk27Skd39O7rIJgB8pGDxFLvuj4H9Efaoj2ttAb1QPCqmAL8HD+dWVrOPHh84IQvHBRYiPIkKEWDgdC/lRh9lXHRIBmjcAH7XD9VmkxzRNXLn4GEMpApKEMWSUaZHv+KPIkGwr+/iwVsoP5pDoyPzxy/IU1D3eyGEZfHiJ744AhMDDTWKZ1ATxoQS5YZM7jTkgBCAfNxLyCk5Gn96WsFc3lc48nJt7urGx/+747D0KEoBIu9h0WwndGiyfk44JLO83qBb5D3tn95rGtobxIs6towwYPBMaxFzmQgSrRVDxQky8zU0i7MTaIialtPmg6S6nDTHhQLJjAxsC2YUDnuZiE+jpgQb6D3mnEA1Sxque9b7rY9aYj6atbeZiLaON2kKwmfnN8z7v+6wBFsJoQ9YhdPT61Wf9Y6yH4CnL6oP4QAMkEeH6w7zIETFJaDX2no16BsCfrWw3LDMpdWAlktLiEoQyJOaUIjz2JILaqHJZThX07RYJPhZh1ANtc8EMRo4J3zh1QySiIEN8tg4JeTwe2J5qcZuIEDc2IeWqJ/VH9zk5sJLllB8CHkyBYJa7zvSHLpWw4tIXapAUggSGCMkB2DytRtXxo9ZPLmYFAkiSwkPCkaM3Wwwi5XL5jGVh6Wz+Q+7AOjMcyViSByIF9YII+d+SEiE/tjJFaMDqR5JUgURo06xEDvOSTt6fkaCIYY6LooBll65kgjBpwjeZSvBZENGKhcMp25XixfoS8z5gT/N+v5tOd5hfjqzw+ShFoPtqQl7imcacELBFtB609c4ur1ZcGK3jL641a7XJqTM2RGgXspzig42IoAWCjVcUHwQTgiVB8cXfg8c4aJF4eaO5M6+OPbV+EUcISDLZ/MOF3w+OTgAiyJA4xJroYv5c1KyMYS0ihSzqA1Ah2AZSQxGSV63oP3C2wQRFi9sdeIKGbieHABGz6DzoxLKsV89HnKB4x+uFTWwtM5K8Yol3qBFCXXM+ns6iFmF3q0WYPh/mhxc7rz5ur8wQenQ7Hc2D5oYP2eFcw8/HhQfCbJFOp9PrdLvn04vL+3MZt5WxAgunx7X7U6zBakpGxiVVLIoRHctXKDVoI6/OoGHfWIMv8CQFBa/yxuFaQQFErV+sRzK5wkL14Gir2USI8LhEXQDD4B5I2UDZYUgBvZjRGxRhvShCPvxnXk3Dfv/ZpvAM5r5NC4pXpnR65uAY0iB9PkH4fC476h8l+3h51jKTreRXV2SoyiWasEAaLW7vFzMBnBaX8OH3Z+f2t1dmpwk+NLqY3yHUh0NwiBd8HihfhQQ+JqCE1en1NJ+vez7752opF3DVr58/uvap7pgidNjoF1wQWHE9mNK5xIgjJThFgqhIhPrAMlYcnpTrJ9WcOvDU+uUQCUQzuSJRIm9OmuvrWMsq0xoWG0NnCSZG3OGJpJhMCTKC4DDsoFze2Px0tJBVIyHf+Z+RrbxsWBazz+2hC3hhWIH0RQWLnKWXn428dBide/7CdkDk1cYvSYokTZq6Sx/EGAghn9V4sl0pRv3OpCrcAqr0cRms826v1wtrYVghhwFyGT6wpuWzG7HIXwmNhzT855rWAYJ8LLmrFSmQOzhcpwCZtCcJDamUJRqzxKtxWrfSASL4DcACjjUdb/RPRAnIEJp0Wtt8u6AMSLVu46yFYdj5h9W1N1v/PV6vE4bwQUGDd1rxdKwr6ljkHsRewkG5Xj88hWgT9bl+x8rOQYIikR/kxG2b1xF6jX/RTOcGyMyrpw9Gfd0dyOEwiimzwmT44BBpy28kuAARG6HjbOPuRV/CC2Pn+9tofvR7sDRkAB30GL9SfQxXtIj6AH6QFab/utOdnl3ZrbiKINHiu81H92yAOIWIITPEEB46IwT+gfsp6Oyp7a3TZ5QnkCqEOSYKIGrdGkT80WxhYe3d1l+EIbUyS+O1N7ph/VlObgSlvabAySME2YB0rJ15JUK+RwxiboiFcsNkhaEIHQaRwCEpETNCh7xXH4y8gTNXggwslEEtp/pgr7QkAZKUalgRtnFIOBah6YnDFxNef6YA5vn0NOIjRvABBNEwqMSDs4LXL+a2M3gAP9jDhA8JUsq75kTqhb1A67X7lB3DBJm6vLClYxOWzp0P+AYRgmKE6Q+q/qn+gGfl+slOQR1zat3mIkIk+9vCGrjq6IdAtkmcpe9SdhiXyo8B+iGwK8Hd1BdAyOan06rKlf72i36aG0JOyCa9M4IweNjjhGbEwgoWFImmrcaL549HPoHsf7D6vgH8MJNX46PlbNBKsJ8XnfTYWAz0h3PvQbhO8QfA/ViE1isPVq5itAKFGiIkzI1rAUIZQgjiVCChUPr8fIYQxDXtvN47ORhDpwCZtEExJEOcrwAx6B1XkKFD1K2CbMwQ4YFFLPDQ377Oqzg6tW759x0YUqzuvD1p1uvQmEX3j+KpWWc0zaR8SQULt7SBjW0GVIScvlZlrG/98LNP92iCiYmig1/e24UryURH9xyqWuQs/XLEW0gBy/J/P2EFrLaED7i1HAqkTX9aiTMRHKGPgP6AcpKj/Qq6yDP5yi6Y5/2xXpgBhK0QFSHahDZxo0VgQ/nhYfKFfEcJUnELQbxeHENnHvpFghiXiBBDQILqD52qjzh6IWJ7UF3ID3inXN48WsqqY0gtNxRSorli9eAtb8uCpiwa13tm2AMgAwc+GEEggpohZPNkZ15tE/JNK/t47wVNMGEX/jgGArUsk5vopjON12QR7rmRf86ZEpr5KINaQm+0beHRYi9ccNST9IcF/4PyQ4pax90G5yovV2am+90xLZEIhxNIkBj1QMKMA9cRZNxBEExYhKB3WsYa76TTadQgLmkm9wf+vXX8iAcpTl5RuXISBZp4dVuCBNFF19ne0sz1SNFSFuoQ8n78c/1wpxhVx5BaLtEhmTyWsuqQuwiy4zNz1WlNq8wQwtp4oYqVoluopVIUIRsbm59O/5VTBPmGU81jmEDHS3qTnohRgAAxMMBQKBDIV4zxvaYajb2no/+YA3nYjgT40RZlqxZDSUuuX7VYXcu05wxN7swQfhQCov/K6+WxicuzfcKPXgzYkQhjDxUKEHjkDJm4oQYJQThWh5sh4yyjd+bJbskdA63+7D//WhdNvJNT96e+vgzWqStLEOqpB7mXHuf8wLsOFsinHVU0VstFDKGlrOYxH1M/43G85SEnnVwFpZgEwXWXi5DDD6/VZNONV7QIBgiOXUTY+TiSxEAsyUPnBawYm0A3rcb7P+ZGvpuXN1d6BQKkjRKEYUO+DTGkLfBhUvuGOvsVSQZ4afDV0j6ODhJ+aAAPqkDCHB/MydBCUtjVtfiY0MagesXNdIhXDI2n092ZldVS1g0XL4HiwXHt8+TVAsRwzqczgNAaFndBmP/huGEFS6dKBMYINz+8VuNXarmtlPUQZMj6I4qQy410UNgpehMIufuPwaBMRMiHnYKS1Te8VM2jASJZ1hGTcoRJEE4Q0/ZAiP6wXvwEA+SOf271PQgQBIjl4EfbwRFbjwjNhAoEwObsv8Lsg+wSdc97vV6CGSDhMHTxYhcWnQUBJ0TTJsa0m3ggEGnC7Q8mQkKQ8t6dWV6dc8NURKB6tE4Acg1BHBG9U8IDkUwQNhDipEiQmyApeB2CsJbUxZpa7pMhFCHkIDijEVnOcRDaawg72jgJQjTIl0EZxtKLqop1s2t+jOAVlSBmTCM6bAliCjvdgq+u1WjsVfLeUZ8oA7m/l4UAgSqWaMESYoSrEM4P6oTg3wXpBPklpYLsgcG8aqG0+ye45wQYVHmg+oA5EPYtrWSFECJjoa/TA0WHxxOaEPzAF8fHO/3Z5YoLfvW80bWT9UefJ6e+YRnM/wjafVhihFC4IM5bvFxv7swrAaKW6xa5aixUD1CFfOYhiyIjK4gPGDodTw3wlsI70SB371IjZGc+o7rTb3CiKdGuWVPM6pmsA0tIELsbCxGCMemNJ3/8BI2XKT1HBx2AABRB89yhOhwgaaGbDjfq2hDRQoRRpSDnX2FJFLuvprsxqjZiiVgs1sNBkHAPSlj8hhpkAm5jNzFBiIAJYS0Me4BBhMAO6ueL0Ip164dP/l1z/Z4wPm4CEsNwdPAGhX+u2+wYwkc8Xts4qebVYaSWC09tMDa8sPa2Wa/VauCDnBl2yGJct/dGo/pjgPqD3L6Qb74MMNjEZeFEblxRjOCl4bsmL2BZHCFcggiGQK8sAKTx/vnc6PkR+A0ddKooTOSHQISEEcRcm7ZiJVv0bZQfMBq//BTyryQLPZAt7u+uzPS73W6CNe8CSHqAkFAvRMDR07gmAQ1CGHIBH2OQtOiTJYgPNpRKewBDIfKWp0drWKFOp3O+srqUve3BiOjDN/XavUud88lrACJasOISNeL0D+MSgpRrmx8W1GaEarl0+QlCDraax7B1yBmLxZIsELqjTUoqYaGRTkTIF7DST6tqn7SvQPpOHmJDUG6YrHiFF/OQyguht6IPi4EECQL7NO2NfA9C8tPk0UEHlLVRgjB2wHdO60NIjzbcmQJJJmH/2tU5Ij/8yA9czP6YPk+PcXaQFcMUE4/WCWEZqxfWaCxWCHqzQIEMMcQ35vON0e2mYJuQdLoLq4+BKN1Ot9vpdTo+Ij+gn7c/s7z/4LZHkXJVnCKcBFzwWUL8mrwaIYZ+YQndYegGPjoRwnJM1IGkllvPcEyFHEPYonFmSFEmOjZhsQkQKkEGKEKwiAVVLEx4V5/hdYDOPqZ72Eb+z975vaaVpnE8hONtohgi9YBLiLA3uTgcsDEEqpwL8cdtGDDCptaUkDGIjQ1pRmrCJk4hbZ1ZBgKZwCztzsUQ6HagZbsLe99/Yf+Ac2ehJkg5etN9n+d53/ccjc1Mh4gNnOdEPTEpTVP14/f5Pj9U54BCgAdVYRE37FsacoI7pK7+FVLbAAfdUkXroGr3EPYokCaXIXiYCBH8qdjPtVnhs4GVMW6fG48qsDeqFQC7PBAIeITnEYA5JjfOPAwgCI8zxAf30m/0CRBYTMj+wDjIjvNWikU6vcQjjZO12m0mPt5Ba8hZ+/bBqOcqKn+p/3j37sKCAx8DVQj/Og1bJImBlx5+CBWC+PCLcSZQwxv5sP/mddJNFLvxBYdPM1a+P8F5vZDI6tgT3SmDtdgXIYwOZLGOXt7PuFmsy363OPeWUlSYMiLzmuqZoqhCeDbLgs+pzJe9z689SQwhgZVkaqhrNQURUHrAlYkX01YeXHdwgHCgzFpd60UlZ1dAQfO5lsi9+mEp1boV0GcYPjxSgjARMoOGCF3psjQLJAhZGs7RJhPj44HxAIPH+Tkjx06pWK1WDw8PK+xyWK0Wi6WdNNZ4vcP2wvNS5WttpP+x3tWTn+/eXBCDTMI9rJBICTsoEuYpLNE1KDkihmH7YfM03YGzsuFb/Pn9l88N93nkxheOkOTa8Sn2hVBXYWeSCCLoEeQSBBUIOSGhjyEmQo7e3He7ZC+Rd4knZIDQ1MRozzErpUiUqxBySCCBtb0xhNJ/IwflxE2LNxFSXyOgQ7UViOSGOJNpLRWM/Wou6cgd+YR9zviBAkI4HfxE19H+YBfAxxnXIJDCQoaI1R8TEyJrhfDYLFYrhVw2m81kMslkJsPOcrlyebtau50+b6EIae8cFEbaTujVHp5ufXVzAbgQpo8ByiMs4EIfjBSACDikABF5K8YQAsek3wYIu8nvnTyKu88kN770V7pYZhfa03F5YV7ksWz1EXQIkM7iR7hiDIFy3tP6qrur4FORuPe4gXMLo2IPCJY+8Y489iHGYVlRUCD0BRAg94Ywr8N7p1Lq4kR5tUk6Q6XDhDPUIE0MVd7APSbxw4x2oQAr4yjg9WpGFuzzVKsF/GAahM9PFJ65riM3ZlCOSAnCx/P+iU81mcBFUxO3UHqUCB6JuOYDo94Ha5pxU7ORzOYKlYPNJUBIq53a3M6O0lr2Jb75eevuzTAEJ4W4ccgQgkdYnAmTfNIhPyKkQGg3DxBDCBA48Ufe5/eOl913aG588QTx+ozV+yeEEBxm0sEy3unpyGLHYYKI+BgMcSedEWQl5hohA3+pGnaAEECis1E+iLfJnXSq7MUyXi5PsFeP/YHSlS+xhYhv1PgQLEqlNYkgTVOFA70OUCA9EAGGmKRNwEC/l7DXyiqKN7ZcOCilwT4PeHTMX9kyBDCi61x6sBPOErsaC+YkjgfQO8fUVSpdKlbKDB4XduTS41OLJbK5p4fFUqrdTqWWHhcSIywi15b/ARksyQ9xc9EQETiBDFYEZQUZHXiQc070EAfOxxYAye8f3XdtRjeuRWjGSv3kCAmSx0Huooy3xwAhBSI4gg0hxyuuyB74NjX7ZKeBMxSJEjRJUbXDotYK1ZoVdVrIjxfbufiYcvU/zX+gH6Vp2QpD5agAgjB64NEToE0YQMwpduk2SuUsDFAU+MDNtbcZP1qMGgE9oKNvLgGCM0xAhUDM6Gc66hFphMCkq/Fx9g0BsM2Z+ihVy4VsMq45JjQ6CQKGvWZkmAx5XNtJsW+vZEc44EPbPZEChESG0/6wFYgtRcIgQCh9RTkssjuAIGiZU/oKjRDbEcmv779ccwW+G9dEhcQSa3UmQvL5TidC/GD46EwLCdLpBQm7A1sKH7x57WaxBqWM4mV4y0+bm1RJCEdIL8TC1hAuQBrVe0Pok/PGYSW76tAWzaZFvOAKJMqRIdiBOEFdYmIC68VhNi5e3eHlPIa7PyB/5cEEVqCHH2IViC7jzAkQsELGxyeYCgkAPm4Xq+Uc0MPnveTxCRsJktlCpVhKN3aK90Y3jk2JQxs6FfGGZY7KWcjrlCD8K7RFWkIEzQ7hgdAoCClA8iRD5vLrz16vuQMf3LguCPHFyQphBOEprMUgQ4gDHSFxHQrh1SKsuj2qr7jj3gakjHAHCOameLd5P0FUrkDUWZ7Bghb0WnkYkzri2X8tdcntaDpkSI/cUHsFCGqPKYSI2bWWqgVD7j+Hl/JlnH7VCmDdFeADKrACXHhwLx3FR19wBXJjxhMYhwG7qfRS8bAM41G8v5GUUmipTeHV201GkO3RjeX1Jo6f3f0zAiRMVxf6QJwuCAkT4WxMTkqCTNqeOdTw9qawGEDW15/Vl11+uHFtCKJo8ZX6yyMQIYuXRSjEa7HYeZ4R5Hg1NuY+0HteY3zYdMEbQFQxzBYnUPUCJMqtEWjMUK1vwQAZws9zp1yzrCY6H6YF6sIy+7NVQnHQiYkaBLNXUdXsNg7KGW1Mdp9rCZqeGAD54YEKXt3DU1g0gBfoAcNL9Av8mJ+BbSGwatDTat2iXedMfYDxofz2A1Txwl/99odS7cmGoY3m3bniy3y3/xUW8QoXRIqQ8KDGdO6hR8j28HP3Qzghkb5D3EAG63Q36T6X3LhOL3xaYu34zR6KEBIcEZm8CkoJwm+Ci0F2Xye/d8oI4np9ztBwie0sL7kidERnnQYIfHAznQ/JaqqW9d/tjdjVvyp6YxvVRtcifrDD4vkp8wJCQHbYZ1CDxRAy1W3Unmbl/zC8iD9CfuigP0hs2PQAJTKjgw65iA9KZNGw93etdjuVLh1UcjBc6/f/o30xJkIOt3/ZSMZHInxhG/pft4SH7jTQ+wuwej71UxGv35HDmvwEPyjm8ut7p2tuF4gb1yt8sdX6Caax+gp4eVt6EO4LhUiF4CeUxYq5EsQRRuExjjCx9cesOiD4aJMmDb2FBNYvQzBAFO9y+UWjK/SFBR9OfFAtL31uCorwm6moGe12a5VsnL/GQyIp8eiVzF9hBstjNxBKBdLjgAh8MAUyP38DFhYGWuep9Ga1kstA8uqz/rBZjH8AACAASURBVDlaIpfb2PjpTnIkQxWVscTajwIgXILM2T7IAPVBjehSgWDDoHRBhOSISBskj7Ox/fkP63snq+4gLDeunQhJ7r4+BRECOiMYnHbWYQXtJBY56cCUDs9iuSF+hfEsznDnBvoFfIgslijmRYZABVatfMc3hHfVsQLssTVNqTXsM4dpLkSHzRBzasqMmt3uznYuwUUC8iP36i3nRwAVB1joPNAKQV2iowSxITLDM1iYwjprM/mxU2P4YDJC+bz8J+w/NIz/GYYxEtmrKKv1f+Ick7BkiF3JK0yR8FyPtz7nd4YDIX47aUWJKy5A5uY+rG8dHbuL29y4dqEwEXJfiJDIdC9BUH8shoJED3aZng6GOvkHR8euk24nsLIV3oKuyvntnBY4xFDlPXw03Z2GhZg4QzEbH0J7g5bcvv1tl+emTJmd4tkqUXJlOq6cYXUbVewAGePltDEan9gCA0Snw9MTtAgdFMgZyQ4GlTNUIIwdqEGAH41StcDw8Qd8DJjB5dM0LTaSR5zX9xDnmIQXgCG8FZ1f2U0h/HNBkzmyxoUL4kSJDFmDBR9zH/LrW2/qCfc55cYw3wxBbWMsFoMCSK+iXJmT7TNWjlGEdKifsJ8gwVAoKJwQIgjTIO7cafmCXS7Kpj1VTCkhuzyK7ejNKF9LzhVI08QKrGJ5KMvmk4Vaw+qixJCwkGc8c2U6CSIFCDSAdBu1Qoa9YtP8RJ8vlnz6FsYnkvRosUtf+gouumgmnOGpKyy/mtfngR6Ij6UibDb8g7jEB75PG4Za+x0K/SEV8dr64xNhg6RPgTjR4XA9MN7759jx3v+BKZCT53H32eTG8PjhxeW09V9/fb779XIyYcQuraT/vGcJOiH7D5gKmZZLQRxVWEHCR4iRBADDs1iuDwJhFCiB1XQUW1EyK4q6w4pyIUIcoTVTsASknNWuvppN8WYPX1gWoaEr2MAp4mz7MB05LAmQbtfarGRiXqqxVbCOtgr5K2wcbIH8AIUB3Aig8UG2yIxHFvI6CnihAmteb7XbVrp0WIa+ksspIU4G/qsUr3cUzeiKz/jm2dZNAMOCkxUD6SHTWX20mOQMiTjkR0R8Oc/4EYm8X1/fP15z35O5MVQ1bfz0t7//+9nR6enLk+N6/fnuo+WM8bmm5CfeRifWoCcECYKyI+hoBgmifx7Eu6aDk5PTwkl3U7ZjinanCmPTZ+3KXb7Qb5YXXAFF+E4nK2pFcV4IJLCqG8PoyPw/e+fz00Z6xvEcTA651CMsoxgJyTLSXoxkTUSwBZItK7IcfLKUC9ANOA7CdiIExCgQtjEK8W5EFmcVJFZZuJiylYqUEnlpSVf9wSmr7WE55NI/wFIPPgx0jRlGstr3ed73nRn/gDawhm2ZZwZjHIcDGH/m+3yfHwL0ECpIDrBB8q0MEkqr6pqrzkhFDgvxociZmajPrDaAeEPR+VHgR0sL7PygKawmLNm1s/SVzlQX7bwZHfEB9geRH3JxmsiP4NEJKBAYEHQUFm6vqk+Rc9GXoV+vDX9Ex1zp6eHUzBB9VouNWoRtOxpFqvNWnZXqhDw70hyPZ78wRpUa0VAF4rrz5e8/mcRYW3ubfbm+tbFJ5Eh/0O8VTnl5ZhJ83AnpBMlhtdr0JgiSAx8iHCGfD9EHSRiS+5IQghZ0B2ynbaWbm+j6PwoRFB0si0UJ4ubLmp5HG7K81NX3cBoSWJXOBgGJQoWI2jXI01iq/LBYIIGl7/k2eYPR+WngB26thepdEW1zexPTHZi/aqGlWWyWCWNIFwoQUSzKN6efHis/iLL2+vyBYKifRgimK/5s9id7R15ABsvp/C/yV6oTImFySusTbNbfl2AbqPpoxBmhRbxzS4/8xgWZEY0ECHkxfz05HI/Hh+PDnCNrWaTISIgZnyf+7iBCKEEOu7tvtNk0/UGLea020CCAFoISrMXa2rx74S+ZBP/4zDTOvHWopVdaMW+BOR9umd0jj+fzCJDRRiwBga4FMGSUvIJDESsYoskOfRYLT6SHxUIEyOiDPtRFJkxshhaeDsnFori3S5sEmQSxq6pDZD4IPXnruSg6RAf4H11gf0zMR/uOuMCBIi+vv/+z1dU3b7a3VzB++OFNmkjr4Olezj9Z+JJPECDVvKj7BR+46KzQHJWSg4ODGugoQMhZGp7bGnEZADGigQAxEYB8QvjhCYdLpXgJQDI8jBTJviQUWR3pP123rhm8dDRCOttu2KzaICwgh01NatlopRYhyHr6gi/gJO/XA3+YpgW8jlZtgZTbzfsJ6Shc3MGBlVgK0CUPLYR9DfnRuW4/nFaUKgXizqutgipGNB+kkKf4AIC8nhlgs+VN5ktCMPrdUNHh2NvbE3dFdDvQQxeZeU5EB2GJ1hWCrYQUIIQfRIHsicXircX5KMCgdq05zioBemz+7eXbnffvcjze7bxd2X7zW/Jq/gkLRU76G/77q+zH1z11NcfRQkQi+kNfpVujQnQRAT3iLMWzG4M/D2Qa8X/7buUdJHI6XiqVwoCQkkoRCpGlrY03qUTQd4qXofduEo0QtZfQqiKDd4UQKQIfVhtMNVlPNuIy+n8nzK4+GGHC+j4KBVpsRV103gJS0N8v0I1NcubxfV8j3hpxETrhh4WhQ3HrslgcHwVdAwgli4VVYMkz0aBLnaDoi84P3ZR3xS7IXzFvAyACTR5NdP4VY4m9RW0pZLtBRKY/pmn1VR1+gKIOJla3V3ZysXIsV46Vy7kyjVgslnv/cnM1EXCd93BB4faLNZjEe2wGq5ovIEBonor75VXYiGi3EVQrMAhr867JAIgRDVUgDCDhsCRJgBCpVGoHhsTjLKG1RIRIInhic9ssBMEIIRrkEOcn8vHuOGcRvrTBHRtms4Ags8vJgPkC12IJoXF17YasbzgvuCuHuWMiCzrAW3HbuPJ47HYjfm4mgQBNQYBYqjwQXtTLOZLXeSH06YQfr8dYCzrUzfr75icyxaIDnAzODnZQdoACoR+sCOsqn87bJdr3oPvj5vTMWF89CoD68IVS6SeEHjFKjY4OcpK4Al8cHBzEcjsr6c+C54wQ790nCJBjc1iAEH6wKl6p+aiINFeW8TZLEgBkbn01ZEyYM6KhAHGBoVfyEHBgkE9OwhBCEUKQSAS1CBEiG5vJwZMaIibVCNFLEOp6MBcEElg2ZqXPzW6MBATThX3de1kFr9ZuXqhtQKd9hHjmYS4utIA0aMUeK8HClFQ+X+2jqwNMeDMIr8Ci8kNRpmd4Czq8vycW7t0qyuhliOKuyD0QUaR2iJ1rEDtrBoHNgzg20W6/SuXHzdGZcTo4sQZ0rkB/cnvnXS62D+i4BtFxDQGCn5AhsdzXK+mE/1wJ4oc5Jp5jFQjDhke9S/khHQMRtfyqGQqwSJRgkmLAAIgRjVUgCBCiQCRylHjFB7KEPFiSIiXMZwFDUv2BkzTumkzYVDg3hWksPtiEJbIAGlYb5ccNTGtFpmaXU/4Lu8PAFXoIa5t45VUtOgraB21Gd5N3bdz215jh5K7+P77+VFGQHxaexFLQBeFOelUqK6/mupRfyo8XQqz+yST4+scWe4soQLgEQXIwDQJjS3Cue1OLvQV7QlCCYDMhSBCQH5mJ+YGAUIcfZiGQSK8w8UHpoQWlyBUCkX1QIS9SwVPkZE8doeTv6C4pp8oQz1EM8TANIjE21NEhUl2KSM0wCMvY1GbEGSgQtEAIMtqZDKERgRs0RuJQoAW5rPRIwHUSbSD4mJXOpAcumlIFiI3mr6gI6T6cmlpaHrmwWSzs+dbjotB6RPB/gq2xcuY3Y3caA11/9Dnyo54C0ep2C6olkteGYBF+DD1I+AS0uwk/+hae3pLlogMA4nDUDtplGIGaLDiYDmliQ9xBf/ROzEdr7A9wxQmckoCPA1V8qOAgMuQa5weRIfv75XdffdHvM53XK8w8+Gpt+D/0oHt0CIGTWujHyQ9JYwk8V3JKBCCvjC4QI85AgcTB9pDC7eiBQAJLH+QRDzgiYKtn1zdToZM46mbX3eT6LLQUdqLe4EYIqg9sKGQYsXa3HU7NLW1e0IZCtgW9ihuFuhqEaRTsKlSmnzcmgXVJuIMOCK2pYqmp+gTRCrBYCS/5b5mnUb9gxkVPgrd/YX5Clt2EH25ydDlEB5uQSE9Wscunu9uxHov2opMn4viSzCjoD5O6loq9uMzke6de7OQODvYJPi6rAEF2kOghBxUh5R8xkZXb2R48twYJYWR9cjhcJ4Hl0QsRNYmFGkSS1OLcimSViowqmEiQwZpcShvr0I1o7BvWJdevqAKRwvCKLlUTBLyREmMIyJDs1sbq4AkyWSbX7eTy7BSsmbKqQTNaTIDYbG022pkODYXp/gt57SSEPqcJLDe30As1K6Raa5NZcub5uL8xF9SBgb9+T/jxD5UgjA5HE0RLYSmZ0YU+gbaEm7yhb7+b6JWxm4OeEPZKgjSJdPoVxQe7QQWyKxZv9t57MOCvuXwxCd5gahvUx36Zig1kxjXUHhwm5Ouejh5GkfJ+7v2T1DkRxOx9lJ38KKyhItxezzzXKRCCEO5/IEIk/DhChDTjIKxmJ/mLndxK+wwHxIjGBgNIO+gPRAUtxFItdYk/WGIyZG5pIz0Y+HAV4gokN7KRyL/arL+ALBa1QmxqT6GuKQT2pK+nb19Agph848+xAstdqGd/VOOD6xQl8/rzBiUroARL5hksC62tQnxYamSI7g4ljaIMgWBgA0WC336z2Av5K1AgDB+0sRwmJFIB0iKK1O+gtzSLRbvQd3eLt+6NDdSUX5lMgi+RfvY+dnDwYwd3O3o6qPzg2awe1CM9l4EgZUhllWPvnqUC5/HuahICX64NXw+3s1G8dRRIdf4KFEgnw0cdYEh1LBAnFPGuLaeMDJYRZwCQ65DCam93hnX4qMxj0UxWiRb3rmXBDPF+YMody3lhPK8qQWxsPJatm01WbOu20kW3h1Oz68ngxTPSXXcevpZlpcD7P3RWeeEIN71QKMjKnx7eb8xccrNv/GmG8oNJEEtFaByx6NrTcQuhBRJYCyGvGebvCl7/wDeLt2TZ4XYDPhycIESCdKkbP1rgxIlXQBCGj6s4T7GI+qOveiCJifAj8Nn2DqqPjitXLndw0dGh0x7ap47L3A05yH316FwSPN7+F7BLCoWFpj88eohU1mCRKHVKlB4EDOSUnKweS6rjpDvpQf5W114ljAyWEWcCEOCHFAYZ4pTapZrgPSJchsxl1zdHgh84t4/8qaeWl7QB71abNtqkTbfkFhByGJnduHANhSYzzsCS0RYvYAqL8qPQqj+qFYksZ/5yvzFX0yaoCftU0fGCKRHKjiN8dRQhbqKL7i0k/C4EiNefWFgcgg3vbrcDRYhKEI0fDj4zEWWIiOW8UNfb0iTu/rPYuwg7DSv4gasIQslnfwZ+lFm1LqvavVZdidWjL8gCEZJ7lvSZz/637E89+ThOoBDWFIhObagHLb+i/LgudXdKkrOZjWl3qpRghjmDCdMobJb78Fw2GTIAYsTZAMSDFbxSO7KiPkFAhXigYQQosjb7b/bO77XJLI3jM/DOXHhjssmMMIWAJCjIWwiVN02oS2KQ0B8UCchCW7Rm2pCGirTaYLVqxdoquk3rCrq2yw7ZdlnGpRQcWRFG9mYZZ6688F8I5CIXkbFm37wYuud5nnNOTtoI7UIyYHOSSdJSBoZJ3k++3+/z4wlTIbs0suzhxGNGkBgnCI88OEHwgcIQnGlyY3l6j0WA9tD4VNq0WviWWK4z8qgy8tXlu+pmdHPu/KX6+H0a7tW1LOf2k1WerayT2gxhXi8jSp4MLPM87Cq3A0CCkf75V2dhPqSb8aOtXeVH+0F3O8y5kvzgrekcH5CCwPh2WP4R3lJ/xfARGVx5zRs/JECOtm6FRzVH6E/K5Z/uJMKNbpPQPjszuwQAQQsrII2sgHSrtt0CvoDhMtg3O1xrS9TgWUihwhFdhB8OvgskPvOnK2Fb8wLXPHUGyBVSIAFPtBCNeiQstuNDZOrsMZZMplYzy7OD4d2NOKWGECAIzU/8Rt1zS7OxoB+E77hdHtxbH4AgDr1F4VFhyHb1kd+iP8z0vwbqs0bFZhMlWLXpgQrEImhYeQvI4YQxik7sQT81NdCJlpPNG+4funshDQLEjfaVuBE/DrZBpi4Z8oW4Y5YOG24ZPyA/j+BUduW/1B7sucLkxwjHB48/uAipcq6qECIKe0de3rzW6I2Emu3McuYPhxkqolxkeAKeimNVAyCegK9ouBwFkCBgX/EMXSTquqQIPTuohlePxVf/MuhtZujNU99j8165mfIFPEU0Y6EFPaoCIxpjN3rpwB51SRIIQzLrf+sP7Sap0GzB4UWa727wCbxyQyGIEC5BYOQJFfPupR23tsjYdcg/KmvGpX0lQpAaBDEhQa/T3mt76Ny/qQndyQP0aopk+a8tnpo789zkgs5G8/pYJOiFCl7cAHKhGzpA/P52qOCFAyTBKOSgG9lBT8r6c9QhByA+fwv8uA3LB6sAYgv1LN7h8uNL0SooWj9asfBqq4ElCIJUeT/y0/3BBtukmhfnmABAohh/BJTUI1D7Fih0uNgnE/SHTilIAR+IGkKESP2Bn9ViMp55NmxrAqR56qyogwCQqAfqsLBrECp5VekRlSVZkKMXYvhViERIcoaphOmeXQ2Mhj2FTIOUjNJ+qN+VCoR7Vy4XtoK40MW68Xx2DzVC2ULn7qWtimfFESKfVAViKgYWbJHapZW4Y4D0j63N1RYgigixACJ5CxwsiyGEnXw+a5mXL/UFcZeTzRv5HguwNtra/X4/L+GFVhDKQsDSQldLahBaY/sFbw359deN7uvkhqlfRRiXhldeP4X0Y58kR5m9+rLCkC3kYD/1oofF05DyyJv7DV4ZroWvLaUQIB4AiAg6POrgki03cLA2IZnU6RRIiCBCKFSvtrDoy14ytTR7pnmBa556X7YQIEUPOFhMgIAGwVEmvBkkWqnmjcGtqBeKjiJCJAYMmck8n02Ed3H90rTgMOYghlyVDrT4xsVusKWQs+QEahCIQfbMdyh73xjOwMqK4VJKfJ5vMRWCmGalEMs009eHOuvj5GvBoak5mqLo3F6AJQECeQeqD9p3y37DKGKlb51jV3zghy3U98OrU2YWAnRQIG43j9G5nUUH4KEQRJ4Db7u60qMX+0DNVOXnWnDw/htMz99VpId6aiNEdbRay09/TkQa+3nrnMiIIqwo1fIGKtEHuVj8Nx4ZgZRcHQIgvA7LwVWIXuGG1CeYqBeTqZvTkeb1rXnq/r1XWFhAEA++T6vLd7e9LhpF2HmmM0ESS0JbyC59LC+6WLycF3MQSD6QIC6UILytsFSafLg++FsUyvwm/AiPj6ZNd7UAUVWIyWghkhCzZY7rj5b02Uv1kmnezheYgFgVfORytQmCNhZwhLpAYIvUfI/Gd8pCB2Fa7E30iwhE4INrEIKIcLEOtlNZLzhYXd0XLg6EvHY1boPBjMOMH+/flfcBPN610mMrmlnHFIZwYNSK1UGxvFy41tA3mH3w8WoyyeNziYtA1fzdgKjPop8O+zY3S0UPSg8donS66zp/KqgmFqgRHeeYrC40B2E1TwOuW4+WUmjJFqI66g0GEQxDolX5uc6xAvoDqtJBJ8eMQiyWnFl9+Gy6c+dhhWbzDkOSznvScZQJ5R9AEJfMQTqQIHumIx0TdNPMZ/P5rfzg7R4Vephqgj41HqyTSgsP3PvFyjkVCyu3NQLhd1AgTqZAACPgaGXNU1NDkc+wA8Qb+v7Vg27T725HAQJtIIId/FWbYIdSi0VdIWBgwfzE8YjXZlfiD7DFEgsvR/5broo+1Jc8KK+VolcI8udy+c2jRtb6ad7E8mo8TmMSo4Eo0SLgCSiT2xWkwAvf4eLmZoEBRFhYDp07V7oEB+XmqD3gg6oDQGYWeoLN61vz1PkNbQ8vZmA0aBRCPSjDwkIs3pAO9ChWMnQ5YZGSEMMwSpwg67P9u5hdpQWHF6EWy1C6CQEe6GHRYKwT8KvN0uSN57N7ohtE086MXZ8zs3Itk1g0DtJDdhPK4iyZpFvm2njdiv2/nVd6QD5iYFXS9LxTNodY1tyDi/1BBIgXOkBOYQcIwEM8+P1CfVTuRA/FxTrQ5t7Y6Dp7a74HarmghFcT1+HO6TsvR95j+lHLvhKVWHKq+1FlrIkyK6tcHnk90cAv6rbg4pNUPInU8AXEkbgQNKkoEPZnvhgTIDpIEI4P7CPUeV1vQQnSSZxQRpnMrHR6mxe45qnz8UZWMjBYgfBBgsMDoxWLYgqWUpNlMI5wAWLADwYcQsjjRHjnJR92crGMDmUqlovsK/wHbq6Ojs1NGMw7vRcG81KCjvqjsupP7tpoyZtKM6EpOkNAgKxNfVunWk3Ne+7WL8LAEg6WM1cLIeyPKDx30qNlpu8OsS/2sF821Dd/FzpACB3yBuNMUIGQIuEhiNIPcpD6zzfSl2/N9yktq8gQeyeU7zL9sa8WPT6Hal6Ynyj2gSAtPsDtAzyqJhaTIAtnGmdi2SOLGQQIZhs+hIhwrQKqgyWR4ksmGUACjCBCgjhk9AH0oJ9JgGA0An8FEcjDxXCzjbB56n3h8nausHc05HnRaJQTxFPQMRLhgxXpwYEaxED1YXBF4jC+3m84YoCQzHJCLC7d0RcxTNKNrzvoBhlIBw1TBCXiQguro8QIArW8oU//g+Dte7FmWiYt15AaBO+wLooyENAiaioCW0DuDYXrda3rHF9L0xjFmh6WKkEYOeaIHXPgZGEPOkhSrOD94UHa9FME0u4XHKGJJv72SluIYAg5WbiCsO1tV9dl9q9S3wAaLFaPTNx8isNLPiI/jhE4jol2EAaO3t4j/PT29n4AktC4xfLTn681ToIEexZW4zxD91UEiIKOKlECAIkTQJgCKYrYo4AFWNzNol85CCaYf7CPZjGeejKxy0kRzdM8/4eFFXm0dBU1dTQK+6OiBWgIKXioDEvQAx5iXIZAEZbDwPXMTH/sBxFSiiWTmfXZ/h23Fdq00ODjzCTXINRQiCEIjuR10dlkEmQTank//RjEHhkbxSGKeU4Nmm6L+DBVZEgd4scZWObaH+vmU3hvT/1o5aqokctt1yCQkVjVBpdlrd0dwInNmjd8G0dgQXbu5+aVm27stIAI8fPhJjIIISsLxmGB/hiFjbjKlZCpGltkAto/tokOJT1v5aMUWwEejBi9R04ex/PVV8cPAUQYRj5wDfJypb9h/6PDiZup+GGfL1DzKBChMVlgYMWTkwAQj04A0WUSUiBgkHFVJHggWKANJL66nGi2ETZP3a13e/gf3109HWcnGU8m0bbC926BKnlptqIY0svDEAPY4UD/CvlhGDEjFpvJPEvsNEuHBUCJ5YwM0vlYLEaPEwIfQBBIQSZvrM9+8g3p4YF7NAMLVtTK+ej5bEtWZuqmrOtFfPjRwUpPnavXVcIWHhudQ/2REwiR+MiJm1XT0LKYLuqBwjzNFhIjTPz+Fne7iRE6MsPvJ4gonpZSzIsK5MDbDbN7dKxnKz+8kWt3nlJ8vo8kyOdyCBZWYRFGqF8QlMfJIydPHj8E+Dh06PjvCCSHjjOKMBnSerT8n6UrDZO4kdml0wwgPOjAeVgfZYlQIDH2NSrgKeoeFR88/wCOwO89VI5FPNEdOEmx0T2SzbMnFUjwr//87u9XU6nU6RRQJFlM4voPJpnxfVwseAQ/YnB3xDhCjOpTYgR5uD7Rs9OKIM0WHgSCMAbxsVgyPq8Q5PeMIKXJh5/6Yk4NJoaYWAMLfJAGlpll9zx3sMjDQsSw42dwYfxYG6/byOJg39SaZUHZLuoOAkYOXtMrFB6AEHzOc3jAszV34UV/JAhTFL28gtctdQYpDvinBX5qcZOZ5fYr3SEkQKADpPs8FvAqA7Bs9v+xd3YxTaVpHMfQzMXe9ANhE5uY7LaBhIA5wbTbbmfTD0lTLaTRTNxBRAbbphaNwUFGBlbHiFbjR8WYOAKzTrp2sy6bejHOOjdsZpNZJ/FiLjZebbglIYYEvKjN4QTSfZ/ned9zTmWy6U2RdM8LHE8LVwj8+v//nw9/9PyNf+mHl2gjTDQNwiPzDZIerbFWho5WODa8AykSDMYYQvZv/GLz1d+2rRDrxEx+IOnWKZDDWpzuVC+oQA5DlZbX3cYB4tQLkDVRiEXZB6qTtTWRhHTAKF5jkqJxtuVvl1UKPZqYmZubn83l8nkGEqAI4wj7qUbJAWVZeg0C/tUaKJAml5kosg5KxOeC+Yfz1wb91up23jLtgxrE5TO38AmKkKJ30yATEiB7ywfKuBskUdcSxBJ+cjar0I5xRIWysqKuGkdXSxbRB5+rCAYWA0jh1smazXoJx2GR1LKKDhIey9oTy+hebU1FFOXlzXg4AFNMrJHrEIDIKDnssgPePGo/CNDDIQIREYP8Sm0s/GWxmP3kan8EGkA0ZxSn735zCreed/6vg/TojcVirfARhDdb0GazIUJabcHmZo6Qzs1vftimVygm66OvACBeMc3dWxl88CG8qokFg9yTyXEOkA4uNZxCgqzxmqwO7m6RAIFK3lJ6KpcythEaZ1v+fDGG+EOR6OBg6vz0zJV5wMjAAPpZJS/k6hCsCw1CBAEDi72ZhYMFVpYPy7EezKSqXldoDV0kDYIWFiiQvRUCpJtcrPL45e8m6rqgROq/AEN4YTUtFWCtkAyhOl6sxRK96RSlw7z3FVnOXBoJmWokQEx9o7yGlxtXy6oAwQ8tHdHZWCu4yDZbGDnm90uSZPVf/wlmuBftwA8mOQgfDu2D4+Q3SJNKCdLVVTyYPX0nCtO0tPrdBikyMfviFLeo+NSSD9QMRDxEfIB11d7ejvJDO4wg7AThvbmnOQgEeftqenuGfpj8F2fHjqoCRKvcfYchIg9h8iQNAFlnABE+FbvqC3ox/gB8lJpKWtObHAAAIABJREFU2FOIAqSUnJofNDJ042yfEsGSfcaRxOAEo8hs/g9MiqTZayUkCO0qxE50vrrGhRBhBCGEgA3FbSwYjlXdT67JGk5hQ+EedbL7XpqkCOKDA+R3ZaZBHswM13FPlCU0cikD/MAWEGVFlPHCiNslUcpLVhYv38V2QkUuXOiTajTExCI9OZ1VlnWHshCdhwUMeSdUX1mBHpDCJAzBYgDxR9DAYtiwM3wAP+wEDYddzUEcHuFqOexqkg4EeXNQPnR/dDhAAxT5Yd8rpj/Av9q/RYFwjJD8AHywgwxB0wqlB77ZOENsNhQhwd6NzRdfP9omqTmRHwMHy82LeJ2iBou7WFvDdXcyzV5ClRAgHdqlws0CpJQ6RJYOjxlAvkr8Pw0iNc4OsrQC4cTF6btXniJDQIfwBnXeTtikpujAD7O5BaN0IIlvfX0IhmNV2wELXYxIEOIHn2PCDSzGjwMUpZfHp+av1bEe9/fdeikr2jYmggdvBBGXJVGJxbvSoQf99LmaFThL0duFzGtkhCo6di9vPYoGkGVqAVEyp++EG/DlSOT6s/98JBcZN+ygQIAfnCCCH3bxyKFDCBViHTx46OyzfqY8aQAv8sPSEEjc+JH8Kxxy1akvvPpAh4/eGIiP9lgrFyBEDKSHdprxBNs7H776t387Kpas0ek81GChh8V1iJtLDrdKD+2OfU0bA8gid7CcFQJEyBE4HRSRoBIBfpSSubmTFgMgxnlPGJECkcTE4ytP85whMGaRTwKl7WekQBAg7DAF4vK5fD4XD0IS1alnE/xG5WjJLQ00EQpE5UeZm1hzqVDd1iSeHCnIMiQgniXhXfEcXcFyLFmt6pXJxFpCgGQLI301+xMR6H+eVX4LIYdKDxUmqibhV50GYQIqU5i8jj3o/tDwT3yJFBAEAg+ZEQPVhwPQgQpEfeQQCoQTpJj99GZcX9UH6wcticevKD+nGYkqQnbpynk3NnpjRxg8GDmAIe3curIRRzhBGm22VSRIz75g78MXX0a348dLGqRttggJeHc73WRXuUl+8PIs0WLIrkkCSMmpQ4fuRlUlosqXekVglvuJBgMgxnl/vorVH0aGQKqehGJeJ/UtrVGCzujRZCb3Ct7ZYQQxC4LAHo9qfiNN1sRMbgrHKlIh716RoHcjRQ6IGCR3LWGtz98Hi//M5IICAsSjXwrLHsBcXsVDEsSuH5ElLzH9oWRvnQnU7BVEeOSSsgwAWVY4JhRRhlVxdCVaCJCMkr0/AttJLNbAsTgYWIgPOzACSQHEgMeMKB56mn8GCWMninR1vSlmP5+MV1TwwmLcyF9ebb7t3C92D+7famSB/IjhAXbERABiqzjNwA8uQfbt2xfceHhjWyp5pYl5iNAJEG6BECfHCaqRw15+zymTTI4vltPukooNTYHwhyWn+lyJ8hDoQ5//U7jBaAMxzvv92yaFoilgCHsZhBlIEy0ewB4QCtLFafFhFg6rBGGX4MxgoEoBHRi8e1mYWDDHhKYqcnagAIGGwvHL8+frc7KPCc0iRSTlaFx5UHJ4FF09Lzwta4OwZDuskapde4zUN/kSK7CUSlTolIdOhqhRyIrCBMizfmohDGMLIfIDFQjgAagBD4AUHnrA20I4XYQGeVP8/PS5cEDfmMpe0kQmfmD6Y79+2yCOLOE+1i7AB9hXvWr6wT0sXnmlN6/g2ggEadzXc+Thn7/cjpAtMJ0baBMmldvtFqhAlAA/2pgiOcz1CT4PbYQAEISEU0tBNAmC7+hbiTrftZI3PTb3RcAAiHF2AEPCiem7IEPSQ0NrpQ7Kz3kjYRM1o7taMADBrnJ2xSj921SVdVPWwAQF6Xv2CP/KxzUIiBBuaOFqkFA9foNNofitDM/KRQehpkPsAioy3i7hrBNaI5W9cKZ2RA2f+x7m8BI/UHkoy5UOlrh7rTYVMoDISubl9/EoyAaTP8pbCO2kOCg4d3hIgqgw4WaW+kmHvQs2ThWzZ0f7Kia4myxSJHXjxVsccLXxM/hQa69i7b29FH2oEci7EsTWSCKkGUnSEzvy2R8jtZcg1vC9/NE27lVxfHDxQfYVOFpu6A1xi7e2ZHqRANJBrYTOd0J0/hR/mhdkudP5mWPGKF7j7BAZkpi4O5sfG0unYVAbUaNJEyAYpJsZOVxivyBE6d9+US1BoueBIDTFBNFR9hE+usnKYv9AM8iDmRN1mKOb/CefF9DAopJdcrJQhAiUgPSAe5mLFBzjnsmefVK7ugJL3+hCRkE8aEVX6o3uvFZTEJQrSiZzdnQ4zABiskb+evM+GVjoYZF5hcjgOLFzgsC/6oQTO265dRQPfjLZH7LoAdIghSZu/GOz892lUB92ijZ0nFoCygOnXrViBALsaEeGBCtNLPSwVm09eI0d+f3Xqdq/PvEn7o4dFQ6WV3eDOBGph1erx2IC5OjU4iIWYa2pAqRSfnB6lCg+JwWSHMtNG6N4jbNTjtUfuTh9JQ8qBHwsl5kY4moym0WO7moBDeIy+8DFgiDkwVyqumWhVunk9PzU+jqW8GITISmQ7u4DajcIDnafT9XhdkJLNH4pq0D5q0jPtSTEo9C9mK+o9oJACdbCrVrtsQX76dzVheOKWmXFIaEsb6XHa12aDgBZeB7H1bMWafgZtIB0Ociv4gIE83IBD4+GErUpBL/OUSweunonLFkqOkACw/d+PLWpWVckQAQ+dgn5QdkH+FftqEG4FGGg6NFFIKvNzauMHI0MJI2/ZgD5+O//jNb8Pzucwm22W9nhdmuyxCs8LR6BDC0uDmEVL4kMp9NZKUCcRA58mgTImjc59mA6YLQRGmcnyZBBQMhYemhoiOHDzOWHWojV4mLkaMEkhF3X18dhPG9VP8MmSyDxGIL0vbRPylf2lbUUXczEKo+P52YG6246nEnqn1yQ+RoQu4JlVxSDcHigFIEwHY0sdpXBypLll5fikVp9M0zW8O1C5riia0BXRBehshUfqi7ZrRzPFm5HQwAQayQuKrA8uLgEruRVYfghWIHVWfgpB9EF7oryoU9HhyVeu8sbQKwn7kEBln5DLd51fshntm9wfvDoPNYaE/hgpwdMrFWEx2oz1l+BicUg0tzYuLoajH382WzNW0EsJ649HfgZgGjEoMthr7C4KEO/nHYzgMDO0A5esevknpVTFPJ2eMVz8NCbzH9nTFI0zo76S2eRwipCiCAul0sM5G2BNhCmPKAf3QUmlms9PZWbSQWq+iG2+i/O5cbLvAYLU3SfKj0O8DQdcvTpumsGkSK3C7gGZGm36PvQJMgKFGItUTWvKkGwoVDOfPS8r3adC/9l7+xC2krTOF7WsJc1J5N4scJcjGKguEOGqcHEYmJaJJoU2SK2TuJXTXDSiPi5xnamddXGWV1Thy4dVJbF1WFGoQzUTmEGZ3q1u5RlKMNeZi8FCSlnd2Vwj4cZ3Pd5nvc950SdqQgZiuQ9yfF4oqUk5vzyf/7Phzf05FmS7A81p+KDkyKj4yOTgUdUXp2e3LzV64UmJibv2sa/oISwjI9OLCutPrywpJDoUmY4zfRV30xIj4CaTGZGpMBH/3ykF4C8zed90JwovXbw3DkjNioESRg+giRCZIxZyTK7MxkCR0VFb4AJ8vG3+b7kmiJLqy125yF+8HwsceN+CBcgsUQ6EXVSZ0VD0YdOC2AH3LEHaiUUsO9CK96OggAprFeKIBwhy6vgpgNCKBGLGyEl4KRDNTo1aK/C7rxLHccaMmUy+2+uJxJMg1BP9z225S5s7I7FIKfsWcUuvFTtkcW6860sha6yWgQLkKGWqqRFgCBQhJ6M9/ukvCmQ+v6nSTW3ePBgAm9GJYRktDNuq1VNMV3kwC4mASghVDg+yihlt9TQvEQY55TNa9Al7CcUmIfr1wN0MItQ8nzy/BEvQNclCFroHB/IjwokiMBGsKJJ5iwBfAQpfGVDiFiQHjbZVvTmG3Kw7srV333iN+f3HeR4f32EAOI8iBADP5waQbCMsGucA4TgcZAfgiKAD0jodUEYKzayejdSECCF9aox5AxXIQwhaKNXFXN+FKMMKS6hghA8Qid96Zi5WI52qAbZJ1oIJSLgcfESnILxhA8en7JiEOn6KDroIC+sWb0IfYsn8ZKjrgp7fYsaLZaqyrOhkCOP/6tbD8Pq9o+sDGGDqxDYQctF5If6cLbVKzGCePyhGSZAhPwQEDlyYXCLaxDsmVWqpOL9AU9OAq/k6/jTox8OGiCkP2jox2UkB/oeuvFhQEmFLBSIbOE7G2wMIG9abHWXr139MM8f2iXvzeU2AIhTxKeczgPiQ7BFOOrOaEsind6PunR8cISUV4qwFVMmla5yzhBorgWteBeH/YXrVWG9goEsj//OwuLqCDghZH/wkSCcH5jICw+UFFdxghzriu/pWBhP7L2OvrkRH/uaCUI++rD/NClzk6/3tphji2jQ8nhLiR3VW2q1Co9oXIFQlqqm+gbYE5Gvz5j1vU+TAJCMMdXKjTdxTsdHRpco4eTgUD20MPH6bszFm1PfUQVIKd8fiRAQHjyKJUSIkurLnSGF2vfDrwzxKx0fNFYQigdpysc5Eb5i2LBg8CooeiiShy7zjXNEZhKkCBN5ry7edOT11Zb8H/2+rcWQuGv00DV88IoQSuZlABlPp7uiu//OxQfRQ8SvKnmAC/eV5buu6ORij69wtTriDQcd2iQJ2nNKfJnN5oJW+1lfAm9k+N4yqBAoRS8p4QihXF4ACHY1waysrq7YOESxjvPm8t1cH9/b07TH/oEQFlgi0FTxcc9pajEqtfbDHFtdX2xlc0pB+GlVy/BFDaKqysOZ3vwF7M3sf5VUjVLDjewghGQymRyEsJMkQNxuNTU152XvUU99oHumL6UANKgKRNFrCMuqoZ+JwmkBwMhWk8fOgaIoY7O9PochQMf+5qZXvjpYQajxA7N3gR9a2XmT1nZXfCs3yWxnYAfBQ4ajoM1iqWu6cu3jlXxWTjD5Hll5ry3qtDsPLq2viYhgaTaJPRodT+8zgJRrISxXuUsQBJUHbwtfru1c5c7o5ESkUAVylAa88WX3Wvcav7H79Nr0dKg1UO/zHK/zJPacRZevwJ0TX18kH49j7b72GmADzA/EBxyC/7GHE0K4D7JwrK7SJnPk7npiby9Hfhxc0Nf97ilKbzd7Pp1NKWL6oEjB4n14tzhNSJvoTFFLmQCJd+cxQiEN3BJFICQwiB5ugwoxaBM3pwhY6A+Hph1nJIc3MD10Hwf08jJ0pEg1H4uuyRCFH0Nhi8IwwlmipG73+yVjAYjJE1h5/u4Pv9YBkuODUO+SOpj6oeFDM9Flwofex13WRUiR4IkNAfLbD/I7+NLTc++9aPQwP4z2uU4TBpDfOKPRaJqSsIgfLiFCXHzj+Vcu44PlsejyUnvBQz/iFWid+/sRa2NjLnT9WLF2GJ4UCM19M9cdavX7CnluJ/0w5fD3LCyPxGKYhwV9EBEfVaRASmqQHzhnCgiywj4MHeOZ9kSWxhP7uvK4yJuZ4DGEsC5hEGvpzukpBnEE/pFKKopVzZLK4Mm6Ah1bGkl4DhZ9xyRL52ggfxiVvH8gAZJBtUF3rjgyyBTVcNcx4g4D1yToXXDjmymtiSKVEfKK89xYFeEkW01pvFnkh6KkOkdbveacCFbgL2Cg6/i4kIMQkh/QNzFn7gepjiaGEMCIjPpDI4hFJhNdhlLCuqAtiACJ5PXDiXd+sS16/rydNIid3w+BRG9xAgJkJJ1OxGjALU/k3SXXQ1MglTkKhG27sbblhfbCxe2Ia0xotK9zrNOwBtnq7By7Pfrpyz+Ymszso1Fobmbq/uBgPD41MxfyFxrmn/giE5mfWJ4kL50XgpRQMQhGsECDQGveqi7I5j3WYALJN6wT5JJhpNRFEcNiFElMrj+OnBLwm87UD3zN+JEl8QE7YxuTwwub8Ga3FDV1ayCPgTxH4MmzcJjTguMjI46JGvQNLSZN3IAPd1h9uHHDAwAJrG0MavzgYSxqk0jH3CznzEDbnAiCFZJjU90+yaQNsTVBlvfEX0ULXk4RgwDBmbVNFWKjiYMyFn5UVAQtMmRisS1oUB/onguEWCx1tjqQIFc/z69x4FtZbovaz9sZQew6O+y5kawcmjCAxNLprpjLxc2PSl17uIStjgoE0neFie6Ktq3fLVggR70CA7NjjYbVzDb8kor3v7Tzi0ny+AeG4n3sVxoa2C91Dk4NheqlAqhPRhBH+817y5SORZ55CeIDIlg1hknpMKRwffg4E6ZMjsD8gwRUg/D2JUaSoAfyq/39vckHn/WckuGEZkfv7KYK48SpBkSHh/UgOqz8HJSLqDDwr1XK57vs66TI0c0IjmxnMrrxIcyRDD3uhsXIsjn7JbzQkncaa9DJOC/DKSCcIeyGp5Vq2LI8boXBLDjaggqQVN9cq0OfgW4yn3G8s/I34McvqQnv2znr+8vnQH7U0chzoIeM1gfbg+iwVARloIdsQ3wU2WxaBIsYgkc43Lbpyufz+SxGl9rvrba8ZSd+HL2MtjrCJRqdBA+dsQE9811oh7UrwKG56qQ7yuGOo6miI0t3ChbIUX/a/fHmxh1atTvaYjQYHG31vEx+1IdG42OphoYd+CcaGESaB6f6A4U41sk+PpskbwemY+3t8WL0EszDKoZKQqE/qroYQbomoZHuy59mydOxtDyZwGReQxW6mCqF56Al1t13HKfiKZT8ECqyblmtP4KNXILQHQb+QRv3/P3Vmq9/sRkOZwgQ27oCyWwbNv2U261uI0DCyadD036HxBQMNlEsFU2wCCTkn+N3Cnc7gBxbgA09oAUlhNADy+B/mM2++efvCgFCALmgSRDiRx1UfODYczF1UMajIMauGEModGUrKirCOvQcBSLbgjjgtunaH++9n8+AZWRiBAACoiOHIPYc1ZFz3BIdT6djMRp/y+s/9GwsQyBrFwsISYFE20ZWOhyFa9ThP+36oXjjTu2htdPQHO//6RAWu9y19t8ea2xA9tTWvjjLANTQ2BkHEVJ4Zk+EELMnMD+xOtnVtYcKpKa4SqRgIUOEEKlhBJkYbpdeqkHMJv/wOgeIUB0XDQiBLzV7ifHPhvPrdf5sDkjoyaZq1aJWgh9qlgQH31n5oZUDRFXU21+05y8DxOyBHF7Ah9sYqKLFE3eF/8F+JLy9HUYJsq0mn3S/U88A4lvbuN8oatAV0XiXI0RBE0Sh25bupjOMMA2iqErqVrfxHQlzqSIfPPof8uOCPgNE6I9zFcAPyraCru1NOLAWEWIJWsj7kHn6lU0ugroPvGlxLFjUkrfp+6uL3+bx46Sv58/Rt9ABsdsPuh+HGEInzrfEACBOPj9dpGLtCgUC7NgVBsguYQRGUK3OBwoAOUoDjg4eBZDaneb7/T/NAckXGupr/I7xo/Y/L/774hdnz9YCQRoaB2e6fQWCnPQS6B9eIiMEyj6qGEP4hHRqrAjteeFrV9cxCwo9kYUHAJD9XAmCNKH5hDWvw3z0yGl4d0i+0b4kBLCQINYs24AR2YORKxzTpGOECZAnIW9eddFmMkxxKQxPgc0h+KHtSX+EsZUJ/Izb/X/2zjem6TuP46YtPrgH8GtTZoKGB47YhMym5pBYMKVU0pSCRzSEjbZQRBrmYE2Bgg6cEhFORRHvLhgk2cJ0unFBLzundzm2e7Js2ZPtEp9cQngkiSHlmkIm1zaau+/n8/1+f79voQX0rg+Qfn/IjzE0AQqvvt/vzx/P0EyHywHVkFX/+AGGKLL4/O1VU0x272bVV7spOhhEmJcVRzNaEvlharn5DeoPxAfLQA7L+Ud5LthU2GlO8LFP3HuO9KgJ76PjS2D4lVptxCmKuTrZv1KH1bAUBFpBjh7//F76xsNoGkfv11EDy7BKgxhS+Fl0FC8WYQFB3ikQinmVDKSAe1cIlhWiQLonezNPi5M9tpv7Op0cGtnZAAFyBxLUXgys9wtKo7F19PmJ/CDSY0mFf3mXivzFSIQQpOu31syX9nW/I/bW8THUINgLQptCDhKYwC1WSkVI7CAt5t3Ev2dlOfoqfBxh76jIz4PFIFPn34QuW2v98EhcrxhXIb3CDfmiL/PIEDywsOlqOp/yoC6iAEFIlKyRIQusHouSJb7gwbtnZrjdbrdZy6zuH6CEl5XvRncnO7AUCzIQLkHIHQbYH4pGp7vcNnGLrbbMcfPn756/3L9zJ679SIhAwL/CxVCs30Nhh24fda3IDTmCDehqo1GtJsBgk7CYAlGDAoFewvLC4z1/TGOfqneiGwDC8ZHKxUp4dwMAhE7CMvPQgzcMmpUAhCMEjSwCkKneN6lb6v/32G7ua3LK/LDABRyxLDubLq5blgJLQ/2VlRGLRbWkAvLsQn4QgliWKzu7mjO0ft1nVdqyltEpFCGlB7EQixtXOTxFp7VYA2PjmxHV2qrgGCHIanzwW0VFBZhYYw+92q3/89EcuAsChGkOcZGUPvFSDiTo0Zm+9nR+9tarf/+bh+XinmceJjDwknUI0iMuEIUIEM/dQGOZzWazuk7+vjZKuQGG1dusaJdV78LrEPxhXSHzeJE7SpBoLaGQ2EIoae3nL331/nPgx2G+9EOWIEcLcRsUAgJ1SLmoQCg/YAAWSpBcndoYJgjBEYq5CRkI0SFq7CV890b6sgMtG4RFGVJsKCBX8QbH19A/N3vGZ6CL0uVmkBXuYhXgWzT6WAF8kHPM7Lsz8bE2A5AkDkfzcFNSB8vZdGXdyUDa+oDf+UtkcWkpKztblZWVpVJR+QIapKmtw7GNg3Rl3cLrWeamxiDW8+Ja8xyh/opX82It1gqUYm0iBinzToyBBDmSUMybjxN5WWlWLHbmcXDL245QgjUSj8/r6ZLzeWEIlhx4sLf1iv4AA2s6rQ9XkwNqeONYVsXYIJpY7Cjw8HCADD1yW01Wm93x5ZVp6EEPKXqDD0uElg/sOkcFAkW789TcgrEtcItHzwUIP4SAR2v1Xn/y75dEgNCFtfv3/zohP89lAkSH8kNhh7B/EDtAsPRKHSYECUMQogvLVVhhoklyiQpR68rLa967FExX9ZLGdG+y4V9FFCDFFCRUezA9YlijR8zQhz43O8AUiFmou+Ls4L0fBceAMCv043x3xlsybdLJAFIvAITqD4tlF0QgTeuOlpPKOtqclb9ElghBFlVZi1lLKtQhkeyIJVLp9He5t7EEgZkw/9OjTWvrnZgcOHUiRhfb8gzkrYNvUXpAnB6LnRqY6rWbNmoo1EiOQcjRk0mQI0iQvHxMQT7Y6lWKGDXEgQtsTrsgQPTcs2IkUVRIHEqw6tP5udvc3w55PB5MQEoWPCWMEB7hzyo7y4P8iP94lfzqL7M5XIG2kSg3rqLKlCuZIwk+1iEYOoztIDDiKzpy2m0VH44ak2v0CUvQ94sChOcfxlzs76DVVihCdLxZUCdPvgINApAACwsUiE7H83N0sAAgasjSq2veu387XX621g6DsIoMBt4GYmD0EN/gaGEYKfJ1z871dyNAzLwRhHeds+sdxhXABz0GX2aSYgqAtA/XLlt48qG8Wq71d61TGK8xVZ3udFYSfpBDRAjRH0SFqIAf2ZYI9b+2La81WpPN3ljlcmEAipPFNK/8o9FKCDJw4mCOKEAoRhhBiAYZuDMR3ETXTZlrHJpB8pMhpIJunIrF+h8PbvUGHpP70UgUBIheaDxPEB3JTjw+5P9rWjvxmwN345QfhAo8CElyMPgoYZk6wcxQW4dJIgCpcvf5CUBCuzdziAYJgXsFTTCEIjgikvwr+BDEJVJaa++Fr6CE91drCfIC9UduLmQaqDS44uCyg0KlmvWgAyHAwwKAoIuFDDHmAlNQgRDQ1Lz4/Po/0/UN9944y7pAqIvF0xAFJsUcHOxuOOAbIADxUYCY5XklNOpQGELnYZkZQop9p2612jO0SGbPtp+rXVYECGoQqkD8gap17BH7yeFa53KE0AMQogIRQiUIgQjUAG9UwvVGCxCT3Xvz9sSDBz/99KfPzrscVtMru6cayUajdLlwl76WK3lLc9h2kE1M5tXagg/6uQT5j0IPtlYqv5RKkAmvdWt/2W2np4eQH4r+CAkGliBCBAESig+NPHKnU4BI7X0zhB9cgSBHUmkPyg9a8RufueKGlnGH+xoRIOhQpQjPqfIQGEIHtYBlF/VfqcchdQwgEnk6cePJ+88VAQIputgAQrREtZG7WDqRIKhGMBthq6MoL4xUgVB+GKkEMSKE4MMKX/RcStcIkLLghYa6A0UG8RRzPSJLEUOxUKFl8DX0z87BMhBzgZCi05JdTM1XeP0VVF8xBYKTFK0ZWqQGCLWueIqOVbzkmUvqX01SfRck6It4IotAD5Vql4rgg7ygBIEuxG2qQYg8C176/g89PWcv/+V3jx88HGz1OmymV+OpRksIQst5E08pu8DbgtnuD70bdqRrTC2DU/3JTSyIQPJKaSHWZ1XS1n4ofzsSnw/p2RpCPdbxyq0ferHuShAk81CClc559pL1i+khz1MPEyAeThAx74A3ngkEgf/yDE0HqsArdl27+BH5vCAnD1EPC3ERkrGRwJUQpCAh+HAcXA+jtOQV6BpJ0u6wB38W+SEKkKM4+apcR3s4wgo/qkF01CgKhLedywcycxQfiBEjNofQubw1x3s+/cSUJm9w/H4D70OX8VHMinoFKaL0qRsMdd2zs7Nn6ooFBWI2K+pjpcCc0I+OOTrBzsD1RlOGFsm+B+3nnMs8/dhj2UMRkk0BokmdgLRfrK0EAbKYbQETC+UHQQgnSGXtsNu6XQEiaVtGP+358MMGcs6eJRS5dWF88LzXUfYqFhEhiHd8ajVBSksZQ3LogEVCkNGNJ5Zprd6JsYEY22crlmHRk5dPC7G28spnjdQcuBvFNSB68WL9g4mFVwkOFpRgpfHz1rquEn4sMH4scCcr0boSFUgJelgl8R/b3Dbng+yhAAAgAElEQVTgz5d/9kfjBAihkKw2Uh8EyiH8aNAh0c4uId6BsdmmT7CFUCbITiVEP3q0EKcn6uQYnUOENYBUs/JdNjYR43Os2SV3Hb2xTB1KshAg1fuOv/v1x+kZIiU1Xr/zGwSIQYEIw4ZY0yu2iPgQIKfq2D5bszAu0Qw9g7T3wywU+MLx+SbH7VKGFkl+7OxfAED2sORjD3aCYEdgU1tHKmOY6GpHRycBiIVwY9FiYUJE5kd29vKyc/ikbYe0bQFCnho11OFBinRfvjM5NR702l+BIRpNmXd8bABWhMCiwhwWfzAFgg3qpeBiTZzf8MdTkuxBKkHy1s5zRw2SVxo70b+lC7FgjPsMjN/V00m7IkFCnBvcusLXJeQiABm6G2hOazLT8WiIBSAlCyBBnike1sIajlBt4nnm8cT9Xc0mqAy4dnEkHgdlAS/RjTKQEEYfzLuLfpTQ0wst6FX3vnn5XKTHfjYMC9bXEgmC83eZZRUWZiXSsiv2fuGoqf7At417+XuN1TRJD4fLa45/3Zue/BnmmKyxsIRAXUAJXMcMxWwUb7/vgFlpAMFi3hUZHSsJlVkrBehgdY+NZhyspKex4xzOIdkDVzbRIKyXkACk3ZYaIK6An3AHPnaRKpCsRajj3RUhECFKxLLsbLtm394AIY9s8tAuKvKRAxg5e3lyYrC1yrr5PEQiBJlEggBAcnAkVoxPNEF+QJA+NtGyUb2CBMsJx9DDqki2EwSwAhJk3LV1C7FMVTAFK0RogWN4KT1CcjN6KgFCnugP16f1d4Pt6rTnaclTJUIXHKw1QUgJQ0i8xDMD80c0O6wfXOmEBe9RqkBCa5oHRSeL6Q+w8GD9YnzkXECcuSlJJlvvpe+gB11I0A/z/bXkFBZyhJQLqwa5HNnHFp9zhhj3GkWWhPeiBqHpRzW+pxo6Qb6/3ZKWr6y99VY3+zFbFYIkZugGpZDX4GvonpuTAcK8K/SwVpQBJgo/jsH/JbqleyqYmaT4X/bO7qepPI3jplQvuMAeZNlYmyExE0kwMzkXbKOQ2G5jSKG4psTgAOVF9CwUWAMDHURelhUpjjDAzCQYYceNI+MqE9xkd+LEESdzYSbO7sX+Acabgbgxp2EQFOiJZPf3/N7Or6eFQkKTbfA5tS01eqGn53O+z/d5iRm1Qx2LWHKkAUEwPzBBACDrT5eTG9prcOYL6Q9MENAfpjQTESGm3QsAEPcOBsgPk5V4RI8XTudcJZdApAtkyDmXvNkSX4uzeoIQhG26xU3o+VSHQD4LRru3eeIKB6mg7Vu83vZ4lPywEoTk470gyTuw2tkyGIQSLHTt1MADIPQAWuBXXsHL4j8ZVIBMP0houYdUdX/GN5vH4wX10teLh4QsvuD3Q+VOBBDPJ43QQwjpqDkRH+o6qSzilRwBKbKq9bSXOSO3EIKDvibIjz1kHhbOXxF8UBWSHrnng3QQzgv0IMTgkgPUhq5AiCRBH6UfOlly+lJC5imay/vhNi1Kgdj1wx7xA/xSAn3QBZJtZ3VWjB/kYDN4OT680AyCZMtE3VsLJOYlqra9Y+GYCQZZgf5Is9lIFutYUc3lpvVvbOWKzg5inWB8mLADAvzAEXq5sHhqZwNkAgBi93qz4ZHtRee44lUUkCHjI6Obd0MsTnDS/cu//GYfWYmOJUhYHO5+xj/5tzZnvEugRa7+BkmQ/JgSxIoBkh/uG/smWVfmmC1VrAQLNAhLW3H/PLqMNw9TRNOCgwktwdrlavo+CAoEMcQnPCL60Jl1/pDpjxeab+ZBhRvUagUMwZrDrjh1QFQakQxRRYSQFSfa8GBFRPEGVHc8oRW8qREpLKI/dAlCVAiHBxMjwt5BYnYcnI8K8ikTIOgoOT3+10Qg2lw3EUOAZLOudF68my32hpQGep89DSh2O23wYNW6/EfOEQwQdGALZPJW+dvRGjEvLE0AEFqJC/jIsmXhSSaLNZfL1meuo6LzVBFtH4E/TOp3cSHW7gWTaT8GyA5OYVVjgGSjcxsQgsOODr9fCXR13bs0WudxbO58lFzQD+JfXv5l317SU7g3TEeZ5JOxWGfO9PVer45bsGBx/5EWYh1/J2q9FHZB3gmf6Z1I2pGKzqaeYQ1PMcmY06jVodJC3QxjERZHyFze6vRQQoesmmubZ3wYH4IKEaQIcc2NKPFpwdswRlGW5JbPh7GiUqkJwg7qqYv1uxQwRyhYtGAPNCJaxLOp+4rYQriHv7xh9DAQBObtpv8Ki450IizSmbwg9DiID5y6wmW9FCFAEAKX4t+WnP7qa2cCLgXyxamuGA7I+m2F6EOlNDBGAILXE5KBvEcjIcI/ZCks9K2dHPW8BUjMC1TTYBEGiCmEJYgtjSiQxaIPOzcYZyUTgGB+gJPOxMduE67nNS0igJx17dwqLAoQ0B6gQLKRFkHvvIggfn8g0HVv6npdwaYSWRbcUUh2TMF2EESOvdRHZx0hsBukP/5IE8e5iTFWyWuNMtPzreCjX5hqS9LdtpKneWYV7wHJwP0frO5K1Q30GAFTTBqbHIm8NMhNnUiAzM6K/PAxgrxgHMEd6sJUE59v+H6Zu8DlcLiHagAgdA8voQgTIYIEUQ2pLfRrdXWmvSlihskuueFTMEBID2FEHyExQE6ISSxGEFqQm0IKreg7jg9DJospkGL6A2yeOlny0afxKwW3/i1zjI5VlsbWH2zDLWsE4T3pMIr32VMFAwTvmXqXl/EejUhlsTosrxdbIDcvJvegH+gAssCADGhrJiGRkEk4HA6nQ95yNaJFvtNTRIqooHjKBpFlyjKlIYBcXR8gZocOEFyJxbNXNBBAdnQZLwII3BuhA2wQr92O8eGlCFEquyYvjVY7pc00qEvOixOTfj8ByF6GjXwiQMhkXn/vJjYKWly8F8RKkla6gQ6fYICM9Vcn5ffELLd0BjWovQIqqLTciisQlRdh6fJjLg9PMZlurbUkUChLrjvTvp+N4oMLEP6OaZA8suEWOzOuAvSoGIQElnqE799Vqf44oqoHYpnq1ElXVW24p8UtiQCxuK79u16o4E0lDjoCyBuMj5wTogAhy9BhZnvKPDn0F1GB4Jf3hYOjgzwVnyw5faV6+9OEUsGtSQwQgpDcbPImN7qfkOEjWyGTFHsrFTslCPVAqA/CnnSawBs/ki1T3cm9qdsiyU5Pw8DdgYGBhoaGARp3B+7i+A4d8GhwbvXbLzmHzheGWAbLBAksBBATViBXa80bKJDWGr5FxKQrEBMoEPR3LZBGwl07GSD4rPWSg8dRAhElELg30nbOuRniS+62qV4qQfaSWSb5mZgeYXRkIpKEL9y8Hn/iqaOBFGIdF7DBcAICxGrFi6WScQKNGRYRatoBjAmVNhAK2asoBYLoMUemYPWcLUjkfY5c/q8Z3895kMCKliAMH1SKMAMdCRAtONjicrrd7rLmHr7U/QgjSJQHoh6I6g9RV7WOwTKHRZiBtUv2fPFj/dra0nt4h5SeyWIGSE5OpALJEQkynyIc8+uoD8oUoTareD69uOSDv7Rt+92kWS4fgWWEBgmSG+2l8yfEj1IdIEftOkB0B8TgiiD9sQwWyERyT1I0W+Sqiz/8+Z80+Bsen8Hjs5EbW71mSwVDHYVUfxwLERM9KysLA6S1aoPvRVlzDZuAYkOKJTJCLwEgO3d/l0XqRgAB7UHKB2n+SkCIFyHk4/GJNvcmVgyYJU//lF6KxdpBIHBDCACkb6o/rgSR3W3f9nIFQrNY+USMYH5gCTKalBNonBX3g5qetJrL4C0fqogR4xQsn5bo+xxnC7bQDQDhhsjzF+IrpkcwDwAyM1TucBZ4yisGhzX1AKHHnEgPowfCc1mwXgonsIYbW6skPoUNmtHdF5+svV5LTRUViGigRyexMEPS01MYNLj4iEQIyBAS5DMRKoeKi09+8NWtqm0GiHmXsw622XIFEgMh3E4n+SwFSZDSwNNnT/sQQI4yBUJGlRgZInLED22EnqS+Ipmlgu4nj+tjxAp/XqlfeXytaqs3SO6hIqJAjoVsJBsVgjRWaLGocX2AmCHl/CEHCGS9TAg7WVh/mEK/Ni0UFu3oWVh0TYEXIcRvpxpEESDi9XvBC/l4/Hr1ppYKll8fm0QE2beP4oM2E4YxQ6Af/UJv/EFWFgcUYv0XU4MnrqiBDtW8mZmZ4c38Pf+P/+BVD25rGtn6gVsH0a06d9HVmBNM8kgJVmNzYnPbVQ+mfbOzz2dnDTYIQAMd+AUeL54LzYU+X3D6jkt2uhvutk5DAovvxzIAJEJ0qPqgdxRzwzWdAy6zWQeIxdx95e+vSQ8I90DARn/zZl18UCMkhU5tTzmMk1XvM3xQB90Ak4MshcWMkJMn/jRStc0VNeZdVf3jlUpuPICI5VhIgIAFMhZQCEAQNrxMiPASLEaOd6kCgSKswHhbkk9StJRfe7SCov41jpXY8fjaVjkpl7UXLeBKXAQNE20oD9nSaCPgBqmvO40YIHgAis0EAIFHGsxUDKUtFnZcbtmxAkQHCLgfiCAYHxQcLJaxnT6JREh8M502FIbZTinigoRpL0g+lSDxRLZF8nw5dQGgQ/QGoYgVRIgVqnit1kxioyeddWVxkD0geIAgIQhzPgT3wyhC8jSYYlKR0NNUrh386fdIbxgBwt4/F+0QZqNrPt9PlyscstNz95PLw6sqXZClqqqRIFEWOn+DBMjnzWIOwGyRXV//uGYYgiUmsBhEcgxBJQixNw7jXJaxfRAfWIDQT0QJghRIyUfjN6RtB8jE5O8U0qsrsiM3qhJLbwhRSpXeZzDLPTebUMNu0B9cfXiFyixFCVyqcyU7QG49RuBYWlpKXUpFZwF6QfGaRf0KpsqjLY4MMMMw98JXoVeEHDbysh+eCk91nt3o30wqu3q+cBGPzrKlQRkv1iDo+eXLUGhhseh8a5llxwMEqrDQjY6gO4QAgihdk1iExDPTJVf1xM3AmTCf6A70yETPmeFMDJBwX+9UXRwHzAxtiWSeSb6VGemEIceJILHiVpBzUrL9z0m4CT0jptKgCaw5ff+g/jt4XGFCBUhBy+2gL4/W8M5S+8OXF1XT+5ArEPQMFvo/yiTZ1fDd1elhjQ5GxAMi1Tl6cA9EjZqNBUvTD6wOn796VjwhLOh//4v6tTVWdvVeVAeIThCDl55zKD2F9JwDQw6DDNGxYbRCDgrahCGluOQP97q3uZDXLN24BJWOmBnGSqxcxg++DYQMysqFIt5nvZWluXbGjQh4iD/hESYAkmVF6Rs5l+SGrlQ9ggCylJq6Z8+e1IhY4iRZqX/UXbBVgFQMvqL44GHbj1CyeKp94/6qqrP/Y+9sQ9pKsziu7MUP/bBNwJFtIi5kS2XWrVwxlaaWJhskxMRlKKQu0fhu1qlaiW/jW+u47ei6alOnAy0qs4vU3Wk72EIHptMdZ/phodOyLP1QFnYp7helUjoY60uNYaX7nPM8z829SfQ2oLubtffm5SYVadPc/PL//885T69jCSQIFP/SOe6EIOkHCD9OLK26Gkr38PR8SYEYof6KAyRTRo8AIgR9rK9QhKj9RmvdBATpVXwibxosjw4JOtEgOIYE5pCIan8tW//dzo0NojVQdOikDESXwXTIRlXf7QpLggFEMDf3zGAPSNi14vOvIut2lRGI/37jrtYMaNz3ZmAOFhMcc3M8/piTdupkPZPmm8wdgyaQ+xedWtF+44tP/EFUHmH3aj6WAolM0P3BoKvhYon8baURy69JPehK/fEvWQKC7FD2gxwCDcLKq2L0DS6GIcL/HLMQhhB4VPTemT9023f2XaWxnBtvp10gxi1aCSPGKmbmeTECmb1QBo3ocu/KZDJFPcFDdAKQsslrie7HC3UEIMiP5GSCkJR9ySlwT+QIXAEhKysAEEucALE0KwHyEi/pREO4Otzi9ulJRwssiJ5O8/cTqEEO/Dg9/cT3y3t9TXSNCAAx5hmBIPIaLOUWQBnSPnWzrVaFIAIsUUiDdKJC0tIwBdnPDax8AhCYxt6msjKIoDHXjREJwiwsXYEyCYHyrPyNvpttidYyJdrvNQ2EUrff5qO7CKGGd3c776G42OOZm5M7V9TMkhGE5h+MIehkeaZ7bti1Yv1fv6sMhoKYoTN0RGgQQpBUJEYqa/2QHCx/U2upTSYlIUX98521w7lR/IgQIL+IwAczsX6wmJ1tUBAkSoHwQ6o/KEQoQYqKTv16tGSHAWLvniLnGAEE50fMjkJey8vWAilunyUAKfbyBF2ysOQXWZqOd972yVFLonckdJ8nAEmBLRlECAMJ4oOKEAKQzW/irMISkqy+3igFgpujskOl94ecHFjIC+0jMM0XNEh6+g9PEP3hqOwptexdfiQJFCCZhCCnZQ6Wkh3kciSA5Vjtl0dL1NZOEbTONrrGLYxR3J92JA0LsNKOUICgBJlQ1dnkl1xBgBToqATRUQkitYTkv+6cHKtPMIBYoVRJDSDRmwcmfezq21RrG5nmXYQe5lxRdDB2yGXIc16d5fEMNFyst2rFG1+0+Ak/iP7QUwUyH3GlCiQ1SoY80vv9PTVO+bwcQSy59g0YWLk4OPEwJ0kEP6h/FRWEHEITyxCzcDeiJ50eZVF8LHKCnPpgom5n31XaijFYzZYuh27cEh0yhMCqHmUXZmefthfzIt7wLsdHnjIRwUmKYoJ/JGk+e/z++so+ho99YSsL5AezsdbvPIxz4RYhyRYBEFQgB4gCcbSMqKg2HAS/uoSNIHwII+KjsLDyoxrrXm78pwoE2s8zodBj2w2z9PGxWtV2aNE5Bh3prJY3/wisByIpECAI0Q52tRzdXHG7rypfV1BQwIJ0XTgCoRIEW0ES6+Wubp0OhRbiBsix0PSIfTc/GASz+8tHHo9Uxculx5x0Q1nyzAP8ePYMfwBikpnWGyVW0fKn7yr9QQRHkEkOOUbm5QIEDmQmFhEgPrdVLmu1OIWXjk3MjSlAkBwxQxAkyDvZhmwDbxs0xLSxmG/FCYL4yMoyoIf1y8vdO/uJINZN4BwTIIiCHzmxOQIKxAiDsGb7CEBMTJOwWiwT70uPsrAIQXCSovb/ACBriA0UHhQkkgKhEAGAxLnqXVJ5RxMCRIIIW9pj1dHSrGaFa8t9vY7C5eVlvpI6boWFjsqGGqdW2NsAGQeAQN1uLAXyimwnq1gUYiIImZocq1NtKjTXjVEJsh89LMIP2AEfkGBAN+FEnQqGBG1t/5WqjQwdAqSAZegFyqHud/vVF8n9n3qxYcXYOATIQuoCWwq9odm8i/9Sou9rvkUHaw7jDw/zr6SSrHBtFsFHOAvxDHzr+43TYrZd/IcfxvC+oGvzMnBwfLBYRC81hMhC9GBw+qNmq1nmYME6tg82N3MpPnK5/ohpYMUoxPop5ujZHA/yOt2iRVnswTIPwg3ODwMHyFdXd5bV5tHLZyPnmORkbu1iAWlyaIbensPgIeMGUyEKZ4vpEa93ajThJylqP3tCAALGVTKiIzmZHfEkfR8okMfl8Z0PmqTy4S6Fg/WS3Rc6GppVV6cTbc3DXQ5KEBgAv0wuhYWulqEau7iX+UG+6ANAtso+XsH+ihxUsUevTnvbJy/V2VQIQmMQVstL6ZHGFQjZX3f2XRlVbd60fnizkwAkjSKEOlg0C2EYgVVBEqoFVGuHFWPpfHbVGITNcV9YwJUI77l383NBEKo7ZngCMueRSY9IhlB6oAyBCGRmpLTebrG4O1ooP3jugRc9PQJNMh9kwiOV6Q/EyE+I/njUdNGtVUzBKm97iAYWEkSSIFH8kLlY8jIsKkGyDYbI5EOuQbhptbjICII/lwVuVtF7p357dUdjBMF6bbKs2ChbzHbbDX7KlFdcNvV09umU12gycX7kUf0hp0fk5m2/tdMVAP+Fs+TzJ2trEjfI9TjZwwhhFtZgnH2EQlL1sGs1rDvwCBmy5Gi4rn5yaayNHU0OUCEEHcuOZYfD4apsGCq17fHBlQiQnDx552AYH6aTr5gKQQmC9VhEJRP5oLYwN5EPkxeqWCVvGvOwdBQhGW+2nodgrh3r29jIyOcpiI43pnMbK7+z72ZCFb2L9R0zoeeIj4UopcF3xdPwzELIE5xu3tVVSjXmxvsDv2LpefSmeA7oQS9zHs/frteXOK320mF/kC9NKxlZ+hA9QlFCRUhqmCB4Ewz6XcOltvAQEyFJEH83+GCdlu/KAhBlCzoLP6IkyCEuQRT8MMRoA1nk1DBkcXpkvQuHiz8/dfbjHf1UEO2Xpsqo4jhpzHwziOQVn4FJiu1eaa1byciS9IeUqUtP5AFArIn+hVj8/M7aCvKCMgQAcvw4O04GgqytrT8Y/Hucb3Ftda9r9eXLKAWytNrV0/gmJ5dYDSKEbi6Xy1H5yZDPbdEIexsgWkv3OM1AojcTXgg8AmhknQwEApiEQE+h2ikGy0tBCkIHmJANb3VkBxvrdSc0caiIB61t9C40E6KDVcBaQdDL4kbWRufNfnvivNaCpfn+QCi0sBA2pzgntrSwaA3vo+HqXR2QR6TRDFvL1hObINLuYSIEnvQM/MVd4nTaqn29XIC8COpDoDxQfujRwOJ1vIweetlwEwKQllbyZUR2Emrs3ZCgU/WRq+wglLehy0wsRRkvJUi2NK6E5x2G8N2idE9us/jjLGAIQUjRqQ8G1arM49osFYM4x0QysYzbTDOh5bxGr7fsyuzsU5xjYpJiEC5ElBCh7hYCpLh9/NxuWp3/ma+0n95BBQIFWMlhiCTTByn7VjZX1teffBwvQEQKkJffryoZcmK1q7XxTSggaCzVIx3DTV1dLldlU1NPq89tfTs3nwMkbysPC7RH4ODBnx0MUIIETlYRgpxvs2/rYglaa9vEBdoLAv5VWr7Cw8qAHL1u+y/Vgsb84e2+qo38DB1NQdC8QgnCi7FedxIMJc75orV1TIeeL1CAcIIsbKNAUpkCCfX6dne9AbH+3gwL0I9trz9AgFCEEJZ4/jhiszud9sbhmSBb9eMFm6LICBJCPaKX649UaUov8MM/VGNWeGnaikt3GD94hp5CAKIwrsL4iOwjZBA5BDE6H3hlkCZgLcrwwRhCiJFFExHQH+BmFRWd+X2dZQdfXFvbLZjEmyPvQs+BFCQnE2eb5GRmRs048RaffTo7e4WO4lWoD0oKCR+UJdTYyvOWTZ2vTfRIV2v9dHNtjeYdKbSYl5pY9AE0hGyurT+5Fud/kcbSGKFAmARZLezqcL8x3GzVjc2+oaFWX6nbbnmLD0wrxs+Web1e0M2nTcoOdEqPAFwPBig9ApCDYEPI9lVBsKAcjjSh4AAPi8oPjNHJR3/npNo4dkGs6J/spAAp0LFBipCCFFAJUgBZyu0Eml1tgQX/YAY65YLMpdo2Qw+F/F/W7261GZFGX3vCrYPR+uPYnHLHpz1fD1+32p0l7uu9QZhPfxTiD+gFOUpEiH6e3MwfRRUSQmcrVf8iVR/e9QiQJp889BU0WsvVxxQguYcPSyFIrkx7SB7WVgoELu9wCWIIF12Fez6koYpZBtmGJta7IEFu9Zfv4ItbOzZV9qMcY46Rz3CP8rGMERLEmFlcBm2EOIrXFBYhprCJZVJk6gwnBCATCQ8Q0f7P96GPUEGQcKAOAFlbW384GmcbiMZ6vcmBCiQiQ19abvJVx/F7tKLFZreaRa1G8xYfYKucG/w3e+cb01SahXHNNiTyYdObNERx4wdSbSrjpM02JPzJtqmk6VLBsNHuKi0dkIIiGhypIv90caw4IuJMAgPuOGFAHZmAWXej6y7oJppdzX4wk/ngJLNmd8XQkHF1GKGWZgh7z3ve9973ltKmY0mmWW5Le1uMH7Ttr895nnPO5Rafz+sTIeLdty9qIwiID+1LLXaEBHODQS9WsWK9VAUDFrFI9UoWIJILUnEi7nZbGA7fWEH6zgtp/qqQIISVsBbmTgw3pY6LVVl/JRwIEAUSoPdUiQQCeBKFJYGAyz/Subxa2WC/PeJySbN3FZrDhQhxybleUYTgmcvfucti31275+hYSN5ey1oIsYZFlAiRH99I+MBIrwYqWCPvlfElF7Xa7PiY8gMjWAU/jxiBtbk40gKJcEE20RqWfrEC4UUIeyKbOSJ6UYPoiQTZfvmvSQSIqrXd51wrYsPI1bBMuBOEnshQwWcBIENPHn990m1kESw5yMtdpF2F9JHXPdpXnuqbjQxV914zgGCEd7VkgKShCSIC5FGiAX7BfuhgkUiNac5FnyYUEQGSYB1ctcINrjR4qbdjdPSMyBCRIlEI8pKrZ2nFn5eQxQpCFet4TCddJUr34ZMVc/lon2dmUg99Lp8M2F2YO9kzGCdCpYbNhBXgghTSHG8m6I7CQgTIVpLD6k5qvXo5US3UnR1zITiAFwGmPriTSEMkAOOwwv7muuWFpKX25kPXxBTyYzJPUblCbFDTg7khhCrV4bHP7GZ77bXb6ICI1xDaIIiO9YwhpIolSQ8ECZEgoa62cw7ehVSL3xkezM9LCSwsYsEMrF8VL1HEiqxh0etPKEBkD4RNvGJUiRAgwA+iQPQl21vaLyWxpN866naCh+5FG4SHBSMGDxWdzmg0ut0nRID4nF6mO5QI4fQH1yei87r7P7Wl+Meb+I32wWtoA6EAWS0DJI256LOze+/VJPi2Fxz1x74TmTEd2Yf+bdHBQ/YVEPzwjzVrlaem4VTfxfZ+ESNukSGlOh1Urhg2tPKZNgi5XvFXkOYd+l1MBaFaZXb0gYWRjzN18/FC5rqT+/hBLJVQfmqY2uiZdLeUeLe1kGmQhQXxL6lJkV5CwQIZXio9AoEAhxL6FO+KSGd+jf9KAhL7Bx32emgCYc2Bk1R6SHleuY+Q+ug49b3af7fOYnac/sP+MREgz559I+d4Mcz7jLaEoC2iKF9pcBH6juYyq/LF2NoxLgkQ6qIrl4BsLi5eOoXFcliSjU6oQU7fhj4PqekjS9IfxLdxtLMAACAASURBVDiHypVevEUNsvPI6BdJI7bg6D1DQryKkpVJx6NEYgg+YTRiBasHAZKjUCBUdaBvjk+wxnSd09d+3Jrqn0jWJhEgr3CWIrPQ+QMB8rEnUYDsOnrsuxmpdrVOqmHNFLUdsq2A4A0IIhgMZovNXuVp6r3QMUoYEuT0B+xaJqfaUq2oP4KoSYAg52stsW0r8NHnQHLQJVCZZKUU5nnnGhuHT5XHnO2rUls9F0/M4UAspAYWsFgJS9Qx0EuYItJ81z/8xEKfYgiRhAieRfNDApqpcNedOsvyvgQqm8dcrimKh8lFBayJCE0yKRJkcnLC9bC50mzZfe7vI/4QmcELBNFwzSCUHc9IAQvVB0cQzfpQ1/56hZMmWGoHv7wh9YBQgkAL4WYFQZQmSGQGCzpBRAnyNnM23oYrXuBKTfNsVr5C3QHSA/ghHiXbDlxuTVoniFBzvsVpxM5BEy84ON1hkue74yl0gTx+MkDGZOdECpBI+SF5IF5vvLdkKpREvuoeFwEy+2oJgKRRgCQ6Bc9QdhgAsliBPN/RVmZd4cCbfYLQapalvKrpwicthCG5Qep/iAAhHkjpW8QNIZ56KQyO9g30VcXqwlQJu6EZBLd6ZGRkAAYyWJwXZir2XIw9mVGlNti7YSBWBgthITy2YiFrQVQgC409ffbUMEGse876w4G8AFzlQ8PRhI1vD3DZLH84/PBmgk23CVcx6/b7q11T0CXIKZA8RRGLUyATrkkEyMhhh8Fy+vCHD8NSBks2Qbgxihp6KzMEtxOGxg6X8fMIVAbbp+336Rx36qFTB4QVrejJZjaKN1KByDksJkFeZGe/gHwuuSH3L7DrXFIgrHQF+FijBxf9wG97Hcn6Jzc0tLc4pU0gnOXB9IaO/ZIsnMJcFrFAngy5ndx4RQVH+LqWVNkyegcGU3+3avkFAEj6qyUVyKtXs/P3P0/Q+oQx2EUwyWSaEx9EgMzsaFvmL2j/RyARGVLZNNh/ucW3T1YhpbD6DIQIXF5qcahJLixL72/YHctIJ0s9ToIEwRBWBrVBwBDBiVhxHHCVYG4abmRBXqmGtYHVsBYgh3UxNfYfCOVHR1xEfEgEkQpZYRLWlRRIgJofxGUP+9s6l/f1rSZNIC5sEQSIKOVH5DEJA7GAH/7mc3aDDfaAhKj3IQNEI1+kO/kBZnvDXSOHFNsB1IL16j1YZjovMuSjLSzH+73ECIoLZp1H6yPcxJQIAgSiV9kRRxbfQ5hF+aEnCoQQRF9y4MigJ1nfSqzdH6AFYjItViDsKRPSA/+MUeeEQVgAEG8OUyC5OVE5ojicvp7ulO9MEL7quIEmOp/AknNYkOOdnb/xeYKLHFSWQ+8VgQCZXqfIYBEFUmde+exPXkXLXN7ae37U5/buQwmiDWpLg8APUCBaLato5ULqfLjBFuMbj5psSAcTI4OID5AhcjfIwlzjQJ8nziAZwdM30DiHbSC0D6SwEKtYWwlBSD9JCtiGKmvdnS7I8Cr0h/Kgg684m52MwYqzrODN37K1t3EMFl1EOBkBjMiHeaL8mHz61D9y+JrdbIc9IH4RCutlEx3kh0wQ5R2MacFFvqHwseZKg6B4vZgv/ftf4+Pj9/e+fj370W9IIUvUH5u3IzWijW9f8qBJXg4gWfRCT+EWPA/KD3KgBinZdqQ9WSMJBdv5Ifd/TSbOI9cpa1g6PpBFXHYjDMJ6/ORrn9uoLGHp6LKQ6IfX6bvVkOpthKtWXXp0Az0QKkEKClgfehojyOz8+NUE0/tqS/2HRTPSFhBZgDz/5Y6zlYaVD/6kljSspJLl8+bQeYpAjZdMgaCpHhRfsBDmPW6L1ctvqYG9gqQGBXHeTPGC/KAS5HpDnG9MKnsDtIKwChYQhFWxQH8AhYYbHKkwTgAyvIQfGgkhmrxFAMGML8v1QhN6eKxzeYPKKsOeu39xuaSMrqxAnpIrIQj7mSAiZSLP9bTaf/fcaZtl1/v/hD0gCgWiECDIDv4xrkwPh0Jt9TbF9nGVIFjKW2uaegc7HozvxW5CKGAx+REhOKIsRVeOVKRSg7nnjCDSCVgf2dBAyNwPODau2VhS8usPupP0mWKuah9yryUKg2MFJ0C4KBaljBEskFuPwUM36XheLIUPmuj1Ooeu16T+R+GlBzJA0nmAFKSlSQD58mqC7wnBSgGyjqyxlRjys5mZd5orVzoCk/2ZYqlqElWIl4V6CTzgppQpkGApmHbugeueWN95DPbuWyTKm4HtIJwCIQTp6XPEUY8WT3tjxYbCQroYHQK9zEQHiJClIJ4U6J0SYA7vFKlf5WnQCcnTcOUsZobIhjrKEZe/7bNl/lZpuT1S7ZJWENKBiREahFS3JoAdMAZL/Kl2XXn/z7U2e9l+skgKO81DmsUCZDFFCEDCz0JdN3dFrpZRQZ+W2Wqrqrnw6P7sPAlhcQUsjhYyPaIQpJgPYqHcyGIKRPEQrA9AiF5GyJo1a/Tbdv4p0UbnJd5Iq6w1/T69kXM5dEr1IaWw2NVoMhmd7oEnj2GdrbQsXd6VniM/Vh468ftcn0ed+gAZn6cASU+PqGAVpG1J27I6Lf313kdfJKwEj75b9O0vZHRM41p0UYG801y+0tiR9EKWwebp7W+BPFZubikVHwQgQS2uTMfRCb6BU7HGR6vNNX8cIDWsfKZAMqVmQphncjHeMEShvA+2ghAJQqYpUimyVYphQZD3R/+2ESydB8MTgSnmoWvyNMiRQKSjruEzvYFweKy5TlAv63+1HZpAUF+wHVJy3erpBAPHBL0hx0T17++cu1Zrd+xpgz0gpLnDLznokXUreqahVghoEJE6pD0y6ltXpTY4mjr+BiJky/fE2djEeSDF8cpY+IcAIDRmlZWtxAi5ovpghSy9pEA2btSX7DxzPimyT7XKAXNM1jKPA0tUvBAx0dnukv4weXVOp7uHWCBruY23OdL9Em6I1+kbbXCoUv6T5z/j87MwcRf4ka4ASAGbhjV7vyNRgNCttD99vm4dl+Qlk0zebV5J8Sb//xG8EE6EvCVetNRRRwsE7nRe71DMlRxqwQHN5NgMQgRIBhJEVCCZG/LnTg6fiv2SV6mt3cMV+RI/NhRKK0G4ZvQfv3NocHQ+DOeJCiRvKhDvoHUsQpGwf6T+f+yda0xTaRrHHXJiIh9ImxAzukQToxCWnaRkGhLR2JOuaQoVDMZlp7QFpC1gHZNKwVEG1LBAHRRlMEFBZjZiRWHjamBWEYHhgzFewrATPvBhs18qwTRD1hHpMDTTuO/zXs4FepGRGkx8Ty+nJMwcDnJ+5//8n0tJbC8KuMGKmG7FWiXSGNYzCT7IfqbX6532lnbfs7odeqNz6NepABIVUF+OdgKgMOCjGLRCX5cpEOhUjxRI4BwiIxf+OsIXfT1c7v/k09/+uBfxI3mJ3BDnoeeEYQjN5KXYkGAklQSvwP/Ywix0ASHrACCHvzq9IqkZ3BobDCNMZ3CQ8kOSh0UbY4F/ng4OiKXm7uTkfzzYAsHNTTJCKZHFFoilqqPsvb8UcpofHwTnYebHEgWyc+1O0hMLAPLtsv8AvyjOIgqEBLE2MBMkq8L1IYs3Fr9JhVJbywjyIg9b6Dh0tRXjY3ve9ow8dNdj8Zwv4iPcT2hskIhFYlYb11MX5PWOhU2kq3vbrSjxJ44vuwwu+m4yk3A3HSZF4AEPKEZf9Ym8HG8aCQQyseSA2FXm89DaIxGnZBH/AzRIoPHcSIyT1Dm9tdvsncbJV8RDlyoQL7M/puFBBAgCiLfUPOLscTsKjpwZCjBe4N6JU3Sk1JL4lTSChQiCBIjTGOk3r1AWXnzUF5TkYIkWSI48kBXZRheiVwQixPwgzdsRRvBT1B9IgaAtd0/N6RWZE6BQ1vbW5OanpxOESKvP4WFPSZF3N8FRLDu2QCbvVuWnS4dMUZDIHREZQDx1tvc/nYj/8YHfj0cPiqXolCPghYAhggByftkAMWKAxG3YsCGJ2R84gjWXdegDQGIlQvjaq0yD/OkFm0pIptvmZaBHnt1uqelosIW/ECgUhQ29OJMXR7AEBUKKQRYOnLpbFjkfj1PZWk4t7GAKRJQfr4UYVlv7cqtS3/0qvNdtDkAJoYgOtucLl5AFMGl8fCfWE89KXEOlzzBAcHoVzuTFRoegObzPvJJQFiCk1Hz/qcntdjvOnmgMgCUOoSlSeD4FrRMTQ23wmMLxKwjNnYtavqXgrz96EPxt796lISyJGskJH8ciNroQtBIECAgPXHjOakCkAEH8gFLCv1euRHsLhab6iiXXrk7HjbDUajk/WOcSqj/IQgIkF1eBtFnyJQ3eBQdd8jFFAhJEI4vncmwLht7J0l1/EIShtcI4dOGd+elIgQy3LLc3g8Z4Zv/srl1xMAQ9aSZuJi6JEgQBxMl/uNrHaGlsLR3QIYsGsViHdyI/ACOIIF/1VodvaaIQErFoNSFx0RdIGOv1ASQfopSUKnWVbcdILbs0ckVfSSXIydV+46X6FtpgIeHhy8z0UR0io0joBaNsnbEdWaNQ3vj+fql3WtQZouCgrge84YQsvHmJABk663D3uK1PhwIYComsbwmWGlOh2IHxMcVafAVufhkteZJT6K4P913ahwFCEBIuWiVpYiJLxIKWimnEKqdBq9RU4YVuNJlXSOKFtecv19pLVqCplFJ/EUewaOd2tVjtIXkItYSYH2oEkJq2ycn/enLT5U16KTSkNjrjCnpHuuVKe+H7f8nR/+MBFiBshC2kYgkFIRgg8UH/8HLxzvEmApC4uKSEpISEXQkJSSyEdcb6oQwkZpcXdP/f4amyExuEZl8RGXIwLwVPl7JUea5GUgCQiIVbYm0kABF7KuLh6Kfao2QeCrWEGzdu3CT3P1g7rFtdq1yDKnQ3uhvNcqmRSeEhfNVHHz4xpoUA8qVVFdPueErtjSGIYE17vcwfJ+CgCMHw8NKUXqJFkAApvT9yo8DdM+gcCQSIp4Ezc0n+VTj1web0JpLySGfUXxq3pvDriUuf4TqQ5EWAyJHnZSWHVCE4D4uBQo4NYSNSBKEjbZ2oRHL3XOusXYHzrnJcrYFW7qQTr9hMUcAHo0o6kx8YIFUQwfLkqhdNKZQKDxbPwiQhE0QsHZWx+juA5DiVhue1aPE8r1EplTHSOkobAQjtphjPUnepGYIVSDA4XLbcnpFaKwXI5iREEPIkhejZZ0wfABJDghRW1nmqmJPO3HNQIOiJlIjdbq/pbYngoyv5ylusFgT4wdq6YxGyAGUcfJQjEPphbVq6oJ3JsbsNq9w7VBrvDQV8Ph/BhmiCiPrDFyqI9dzcOORyxNbfURU8bTTj0JWQYEVyrQhCsAIhASzCEaxBzKVDdz43OHqaz3RjgFCGQAJW40+JtPeVtPwjUfTP8TIHzr1ReaTG9s3Dz3IgiCVHRE4IOZK8hCLJuCcv0R7glrN8K8YUsiNJ36UrH0mQo621K3CN5KGPCfCDFXywmnNJ4aCkqTteH+M+JpN3q1LVMgtEBg7ZPgGIpaZuxfuK4ukXMPLFffJkV1fXbbq6unrcbkeBXqtRKriVvb1R1X5DpoGspQT5aDFAdq71Bx8V8WvYHGSO4xSyFToy1nwoe3ZXQtxmTA+kP+IglDXzcmYuO9aFur/LPlAolbhDocFIlkGv0+EhJO8+zQ6dXjgYrVan08P4ODgSdA8BNxHRj4ZTqHTVdR67PY826N26HRvomB5oIekM5l0EH12pKvqu7dgxBpD1tAhkgRIkei8rpa39CmnJu1sWwPozft8BJsh3q1u6c5oj38MkKaQuMiGRFyfxosV4IseHqEBgEojTEONO7kdGzFiBMIAIeVcsoIVfMD0oPp6Vlpq7jxj07sH+E42kfdcUWzjrKhBSgfxEPRAMkMYTN95onpuquuOvOftyBBckXMIVa4IVwkanISxS7pEm0CONxbJwE6y0dRKAbNu2bc/hgWrN2595bfuVw/lCoCoFk4RRQ2hcopY4IDiEBVUgk1dEgDAFIgtfpUj0R4YdBEjN1ZWdbKBQaXQFjpNdo6Ojna0D47Amxicm0NvAQGvrkyc/3L496C7Qvc1pguskNHNFFyOOhBv01eMMIIsqQTBGgB+v/H2PynQK/F1wldWi6xpbcG0LCX49AchmAMguECAJTIEcP2tYXTk46KRotHqjyepsdjWJy+VqbrY6ANrvkCEckMOAjsXa3Oxy9ffTI4FDMTmMeq0q+l0Wp9BXd4CT/oI0MoG+WKBDfoHykLyMjIN2e9U/G2zK8IdgqOw9xQCygDbc3J1JkAOnLhdFliAcjJXCiVi7QyoQqASxreY0LE6pP3sTj9ughYRC+CpTggxfCCFifnzItMyeP8s9Nh2MkjJTbkwz1TEtKBBGD0F9YII0jpj0end//RBt/5go8mNJ6fkfxBiWEMAKDH1hfLO/A0P1v/bl5GB+7A0TqKJfXqpASDU6rfaQc2NLquidb1msQBBB/nf42sW3zu3jlIXnPRZ7ithKUS2THpIolkgQ9ccWsEB+oFUg6hSWyivUoafI3siOGqrXL65gywJ0KS842TBah4gx3NfXVw4rWC5Z6IsTEwOdt253OfS/aygoujfVFvQMkgUZfQYDErVjoxPl/njqf5AQ1kd0wwBBW3z8pfHbPQXuHvjmsbGxf8vW2GCorBNFiasiaxaRAwFkBimQpARqor/MOh6t0wNHvMJFC/Er+o/NofPIQ8yPLfigjSTcOHTijSanq6n+UEVFcfF+stBOcXFxxYUL9U0AEf7dMESpQhyzIorVk4NBB0E2dCgVFYfqm1zoYAz4p4niBLb0klysrVh//EIiWVCTDkoEWih0RvLRtUWX2/4mKJD1O8S5INDc/VhvFEOM05UBgGgG1g5KDlJI+Hr3azxevWhVRzG1pjuNGCDPfUiCQDUh2jKJnZ6ZKQayfMI71h++QOBmkzG2/1ZUJXcekzYm09L1THhhO6KHXooUyOM7Bl7f01/xayARh7CmEqcCpP9uYlgHXQxiQQrWm45gUJacPnopBzx0FsdKDomQ5GiZvGlLzY80sfw8ddHKzT161fHW9/N8UR20I1GzCkL1IvdD4qwLHkg6TeKFKhAMECHrSpaJxfwQViViz69qrV6ZglqoAdMXVZ7vGJ/oK5+fn/fP+/3+YDAYj5/xwVev/LDmYZX3PRzvHK0s0i//vlihKbnY+USyOjvh48DDV2yerdwEYS46gssnD1s762TfK/3PVJYsPQ0KY1PFLFIgCcT/mEEvM1BT+HIu63gULQx6wOCwDjYPWq3WHngIWzRyKpRaU3P/GGzNwoY+NTt0qqXnC+JWvP5zpwtdrvdnZ81l0TU7O5v18yzZz95fXFHvchrR+Y7pjSX81DoEj6b6CxXF+7Ozs9H/ey5rjqysn/HBncMHg4hm0vORY2uqgpbWKstBCFpt34oDWAeRANlO6kEOIoJUeSKoZ4XK0ID7mRAPhDRzl2TyXmm3RSYY9PT9P3PnH9Nkfsfxs2lN8A+uvXAqQtZw2UG4+6c1wAU0LesfDRR/hIRjthRB+SFcsWlBhvzwxxggqCCMROaZi2Gam3PR2+k2zuw4LxmJM5fMLCTbXPYXGqWxW1oKok2I+34+n+/3eZ5SKJBCwvdpnxaw1+9p+bye9+cnA8iuJeQHxkAYgzZzAZVaC22wnOSzeuEjalAcJI96mvgilIfUq9cZ7nH1F23s3izeL3ucOEsKM3eFBFGesfTjOdcgmIJV++fb9wvMRf1dJeEXhATEB96jvVcpXHy8ZLARAHm0+v51lsFrh/ZjKSGe0w9GQyN9+VKQ96jnbiZ2U0xgR6T7iioIE+RWipjFiwQ53hl3bp/aeuLzZsjBkmcQisOouCvkB/CDPFhjzeXGLCkCElkDIj/yHCxowFjecattXQSI1sDoMfQYO1oyegA10IyzE9TySeJgLsQpUnd3svP7M478tXanKhoZr5snZbPAbqBpJu5O4NvR4qUg27YtBkho4W6EGgJBxF5eh0Jpovfv0bbV0NBVyQBiQteVCZxYqSpNKiPIbKF7hVZBhny7t6nr4ZMnTx4+eRi5qlZonq/L954fZi8clg+4DT88XxXNHoZta4O3yeUuAWsN5to/6w+w5afDPxsA4w0QcbuaquyWDby0RHo0dQ1X4l4AGgF5BYOB3ewgijCIuLrYbmJdQai15orv73SABsktxhAIkuNVLj8V19Q0d8ZIANFZfw1hdJHGu523c+fryNlbx2KD3FB95TIDyB5SH3veKgIhIghyomjzAkRrhlG2MK4J+ZFHqgMZolQgPqUISYJHZ/hR+283mIwOz7dMgDglB5ZCgMgShGo/UIFM1045GUAeVFnN9nvDr8MvnlF2FSToQiU6BUD4+A8uQFKQHylJsgAJu1ssq/30GxxDP4cgCBWkkyuL4JEeqUCWxEj6/3C0LRZ8AD8SRCqW4EVECUgCVqKjV+vAp7/szo8XII7uO+U1RkEPHkA3cnIY+VdZSgeWcWfpAehj8s+xDgCIAiE5chBEjn3k0A+xer3vasV6uFvzj7YN/RXbIaPuQBu+QEFtqZkhmfdQaEESIhOTvYPVazNpuoqhCXzxHK0QnUKKAIhSf4hYCGXybiMVVDcnrXnaCdtL76no/y1DgwuSsPwmE8bQGUQSVSp9cqp/1ua+Gdv86Cw3L7SWCGeStGwlJZUtDSsA5PDF1gFboW3xKnH1fxb5phBrtntbTrvhcp+JDuAGDdz1c4Lgs0CAdImt1e3ylFk3pkJMbbDYCWRsJwGGjlk4oBN+MLibHcFgGjvP7oYfwF5wN0g07bJyxnoMnLnFOYQPqAF5BfCoL859Vcw0SA2koC/7r6DNP8cIcCSbBhLCVBAxHx2aLB5h5n+5nkjChXYFXGA/2rNHcmBJCGHffvv25Gh3xebtAaQr8N7ucfryCBugQGR6RM2XUlAkHO75T5NjY31z2OIRJ9RG+6+eRnqypigGMj1dW+v8+v45i7mh61EYPFhSGCT8DFTGy2gFQgzpEYm8z8I9F8pW7x4yt3X+lMrRkR/ci4VP08X8waiRIPLXvBQkIQHj5AmZIvjxcZTvKoHK0BN4Jcg3V+JNitVVXO0rr+FVHsroB3YsgTueFSuDAaS8Y4zKCEX1ulQGIj8oKgw5nGrK73RXx+/0Ljg18pdx9FvNhUIRsWwMRmzdG0kQhpAQWH5mtuvGH49UWNcQDdGd6pXeiL/TViU2YgAEcnm3AtdC6FJboL2ESBLVDUVXqavzASCMIKngxUIFwgACCiRgc92MzT2d9eLpAYTADCwb3U0zNltru9cQm8ZHfxiQr9/9s8IFZGu8d05h/LVanbmgzNPeiNf7M7DPgGJmuwoXzFIMAkNMgJEZuPJvamB/3+tr+MCLVsToAVuZmSGKAb4AHmlpafCQzB7YwUCCRBNCxN3uaVj2n19tsJ642lzDCAIDmCkEkptbn1ucgwqkuD52IpbZ0Y2lINTTHaixi7d1Z0+zj5y94ohV66DWWbvHoBKEmLGYIVBKOHr12OaNohvKWiCHl1ODnixiiI8fUl6Wz+cLh509w/0b26RFa775gPpgPY+MgTyPjog8J/cVerC+9HxmsTS4BsK8ilBazzDe0SM8VylJ/JaUlCQXg4RfD0Diy2o/+eqjg388dAhkx/soQJAc6Vx0UGD94EfLIWQ/SBDkBcAjgSdbAU0yE6LWh3wBSz74tO9SnHXdakPbrQ7oZyVJDKW3KsuYYYwoQkeSGP9LjbD+NooAwcKRHGUpoYIaUo16RlYNdFKM249rsHLxMT8nJjpJJpzM9t6te7csRsg2qBvHy//xx9crVp/zoWsDgHBOCULtld9yMUDkfiZ8UWLWNnx/3Ao51SaGji4Rh/U2ggJhC+sI4UYKhAGkQb0CQFrchcgO9moghzhsJVCkFfMvtOFPDCARU3QDQcgcbryneKXWkF9Uxq74QXnMBEwMcezPMWRo/EHs+ghnjV8j/2dMYLlnCm2V7R77OsfTdRZ7VZOr0lY4GwAVpFIlUuviYDJbmmRNmiZNrCDgBPFimgkAFQEhlqURAt1RT4wygtTkgBeLCRDQHhgKwVgIJGINLj8E1FBw5quzvKPidhoutYsXFr77bvYbaKcb08xZsJJkqQwsioOcPPtVm2HTAsTsYUY6T3AjnCdiIBj8wEdfRP4VZvvmMYD0fHu+amP7DOsKLj5y1k4pBEieiH5E4uPp8ykn0x/T01PTT521X1+ocliLvLcHmPgABQIaJCwo0ZMi3Fb8npKkTMF6xgAy4L65ltxPc3Xvzw4d/AkARKCDTkSQqOys9Ijx6O/RtA+MgSBE0JPFn8L6OJIg/PTBvr7OOOcM6awj39AwQgkbUr6VkQiSRU1O6DsZGAI5QFUgN8pLuQDJWdQPS87KEj/LAgHS/HlFPC43NfstbfticgLDHhEhbBAdiI29oiEut+4hvGPbKoxLQDTk8WD1akWI4TeP6wQ/iA78xFkSAyC8LZaYkU774BpkfmIk2p+tLgCAoA8rMZHq0JkCUemZ/Wttb3hnJYBU4tU4ihe+2BMASFnsj/G/vKeZAEHfDzUAZlRgFjjIAMJfiYHzIrLZMxSkSdXr0VgnJwfhCDJysLsGvoCnfpIjYLbBZnuLzOsmQtQMH552dyuSzLQDFpALtgI7SUsW4EgLcogkBzVsT2xDAXBmlbhdnmVEkRaqOUbLgSBCgLwCRxajyI8hKYsR5OryFeW6/GN/gNHm3G0F/IAbBUWy3/ziVuwKWugJfxYlyC7AxR5lFhZvyDt2YmOzXeMyI/dvO58qNYf8nAkNrjd8khxBmjCmMAFye6OrCM2QHjYlNbnKW1aBOEmCTE9PO2tr//Hd/SpHAeiqMIJDUiDCmUXkkLTHS/E9kcPbet6+hg+9+p38kWuYiPW+EB/p3JuFYgP5cTBagKRL7UywCD0BgyCZwI1MWX9kKvmhECEfZu7rufFzSAAAIABJREFUuBaXRQbhfb0PMIDMMBolzUHQEPCQnVgMIDuNpfsgiRc6KZZK40Mk9ZGxWIGQPsEQyI1Lh+P4sGD//HGKfJAplhEiXfVviRjrBNDAP4Zn+Ar8R+O9bQWr4q4aAQL4CUWRYqsEhmiAbJHGE4riECnmTk6s8SUAoi3yyAoEU7H0YIf1qsBMa9MKPWt0hy8wgIAwSFQBQRJpmUy2yqYVAGJpcSv4oeEX88HZksZ+/M2GMhhzAeLDRhInkcFDr9cDaGCp/Du49wiNNzPkKsYS2IkKEMZEiKvFnr8+RkKL+CDfFcOHZgdfKr0eEELkYBJEo9nN9sOVSDIAMY1hZAcTZ4WoQpaK7qvf0WqtZzpvlGNBIQRB6nNz64thWAjNB6mvaR4dWbapus7g+P2tk2+yJYJgT0V+355df7n7cCyDojY4ui9jN5Ol6kCon+KgdbP6sMx2GLeR91TpuFKqEFQgPt5nUbizfEkMII8eVG1wm2GL5zuIgCzhr1p6TWMI5N8/9J9zFHkvUBFhWDivhM5AfPQI9ZEih9Hpx3nh16c9a+tkpKv+4leH9qenS/D4SBCEAuqEj/3Cl5WuDLJDNTpNtJUpIT1djA8FPzL3Hb8Wp0/IcqazAwAC7EB5kZUVeTNmKRQIT8Iq39c3xgByuaN0p2j+nhPpr5IzszJEnq+xpvT4jUvxTHa2HhuaRN/VAsJDDktQJR9d9eNtiyKWzoVIiCAAeb5z83WT1ytWo5u15t9Nzs+HooPlnBRyE8WoH2yR90SRGZkgAJC2gmgPit1TSQDxc/uvV4EE8Qdm3E0r9GVkACkphGBAYiqUIaL/K1GPAGmxx/79PNzSygDyySegHsAHlQy3NAYQV79DS3X+Fnt/VyNc8pv+z9z5xzSd3nH8aNomxx/Nt8bY9Wwkmh0XvHgpDo/oGorMNEBPiQtjAkX5rYKYQuHGAcKdCjd/3U6XaIBpwiTz1HhmePMHQ13iZnSLZzKz8Jf/QAJpbGbb8SM2R9zz+Tw/vk9/UEYZCc8X2iIFnhp4Xs/78/58Pg9s+QkXCD7MOjYCdJiRISgD4EZngKeS6aMKIiIkx/j/aNuWDeoDnR6Yio4DRMyFkIKwA4aO3QNMgCgm+nRASD5BSJXTro2KChKF6+w911HETrndCuGrrbsxCWtmZvfr3ZjJa5+XbbldWEvIFch7VITQypA3Fef746bDaa25zShg3tsRAx9w13r+snOlxrAcjQ96XDI81MdceKAOEUlZ6JJMel2up+2HlrmKcO/tkVpXePrVuAhlxWDK2FgtAci/7g1frSs+3RkKrZYH/ehVD7XLpbFWegy5AU9P1S1ua6/Yr7zYs3N76kbhgKRGuiCRNSGCHxDDAtecYiONYiMtjCZpkQGs9+mhUn/qXlpu397uvoYiSgrscUWlh8qRDCFFhANClETD3Zejoy8HyihAMtQkLLWlCWeI6O9LuNPQ93XieslafeH5ENCDqgqePouJV2zDr5aDJ0mbfq4/kmmRH8SzQIQ0/w/bOWP29ccEICKCZcMiQRbHmg8gEW66KkTobMGMmYsBkHeMdZ7y/CCLPiE/KECIAllwN2OtPFUY9EHpCCZw8TJ2Q1ZhuTs+QBTylVOZ6zMh+mNGEWFGH5oApAqq37WK3Vl1sqkQ8WGA1ZpOTYf6ww9XwMcEDOEG5YfFAjOHp6VYLGTNLixvd1dal7rRJDNxt9d/Bh5+Fvx0k6Q/iAAhF6EZwUaA0AOSeAlCyEc6YAlwBfUIAVuWfyqvsN5TGqvMxZjT1T/YwkwQzMYCATJDBhySvrWm5WhXzvyxtTqoJVzHDiYE5fFTrkLW0GL0eArEmL3/zuetb9fJpegihPUzNEF6S1ZoKaEWi0C4h64qEA4Mr5cGsNQYFn6WKJCeG55l7rFgPfSwBwQIx8Z4bAEyrmZiTYxDH0X38NUvS//Bq9DDMSKYsVZcPIeXBbB6mu4tVlgpl44+/mF7KvPQOUI2pvL4FUNIgeqAcIKkQkdFrPngeVicIcwOkb10hg94lEYA8sVflpIXq1Uq+wdZKhVjCCNImAJRLRAGkI5zo9iKtyg9DCAihCVrD/4AuHO0OdG/AMVx5OL9AxC6StYzVyNs6aYHkidRC8Qmb/nDvBIW6NLPTQ+9uFy9YIapMefi0Ox0Mg1/cRygTa9nkTI1H4u5IuxK0kcCBD+Nk58GgEQLR2PpSQoQS5aqQGC9JgBZqKTVXnkq34/4gDUbYmDURwGAOJW4G9/KTgTI+kyI/pgz15OHEPAhACmFPwHF6qyCmFGQBshMkFqs02hMGrHpDwQ0QI+AjikRwg8zlLBQpWJJIdMI4oq9xDCW1VHqqS9nMwE8qfwwkytFA6ZMAKa0mczFFDBt1pmAH5tReugIX9jTTaCKyo+7i6N7iCvWku5rg2VggqDwOAgtecFEn9lNrpmDLX29e+dRUlrFmtt95xg3QejRtpDOi6eDbKlovdaVq42bXbjvJlSC7JBlhyxE4Fjb7JXJDwUTZb3bqK4QNSBMcniFja7mZNGjbkOur05VObTL2sk9F3oE146NLRS5EseATIxDEcht9/BwFdFVUgSrJ4wla2MjhQHkq+OLb5+9t+2fPxRshypCiR7MKC+Q07AKVHzw7N7Ujxg/3hUqhJMkAiEcH0iQXb/49HdHliAAtfZ9fS1ltIwwg/ODChEhQdIlDx1N9KIyCpA7g7tqhL74WD5RStR+SEepI3d+k+ihOPbq6wQfUv1eMjdAWOsQ1X0QCkRCiD5J7rUOY26aiJAF/x6tuRcPUIDoeUTKxsgRoUBogq+oQ5GTeakZIrkg07NzT45Eb2SNVSfRQ/dzD4TwAyngz+88tMBMsw91EoD4LJhMazAIDyRYeNidG/cXJId85VRmJsUG2s80dYkCRAsJ/vXlaFiDoDCgAoEdP/gzOkjCCrA3eNeRy+zTmFEIWShBUizUCWnyLOnUOaO92F1fnk9NGPofw/hh0AA1wdQ3a1CEoJ3PLh1VKmTuqmHCAln1nuKo/rpao2M/+OgfQCYv1SE0gAUhrNczMzWD/dVGZV4J0nzzWAWm7eLJtihFACNAkjfHBrpLlLj2TjWY8Hgg4Q75RHRho7f2d63Mju6K/ZsbZJeP+Fit1hBShLDMLK+U0St69bpCN+6VZC8rQKBHMAECBUj8wRWIa8zl+uO9M8PDZ341AtlXk5wPr1bHHK+iiEKE1b3iRW+X7M5Hv/x5AQ9eqTEsqYaQcUT119nNRmjJS1tdcQGSFsP9ECPtfVotsuGThr4rS+kT6Gj7tqXoR0xZUBEibiQrRJYg6UW7Gu7+fRQ6KaplhOF5vJIIEQoEywgvJCZXifx4BPwg67iN7fsFP+ROVDY93e8zfqiVflJeLRk/IRIkeW5uduh5W278BFOr8yJRPUJl2NRza3kMSz1QijOEE4TnYNmY/BBWzPT07NCTI9H7E2vVcdxdYwQLVEgK+tAGv7+wszj+dkZLMAAWCHwB2WIbqFSgAGl0KPGj14cRIAEqPMzohkMabzn4BIrR4a6HTX8QKj1STCkYwUpBMBCG6CDnCiwP3xSBiAls+IDOp9FYWCgNn4tKKBgsbDp5KOF8TcXqaPRwHQSvz2/wk1eaRS4N4gwkiAXTeFEI6SAxywcAgQCWCSRTxCCiqOlkaY41EgJ25+/7B2tqDtJiECgkxGtm5vUMIUjNsWtH5gvZaxX7l98NtL7ZguxA6QEIQYBAQ8WB7+LVcWgVrbP7Gs3jjQpiYQjrbeu17pXZkNeYe3qEVhFuowiRvPNtctTKy2NZaKR7Q66eJrdjec8itJa2/9kF2bmqxQEwGZ+IskFEnXotFoEMP3vmeTASYgcnMk6EYvPjlaxQUIAcbsxZ/MvKPvvFnp0FqalEhaxS3fSIEhBuiXB+MJqs2pAm3A4qO6gS+VBErmJxZMO/G05cWIIHpZR8PdhSRPUGAkS1QqKcdKpQGEC+Hx19ebejiBWwZ4Sb5swCYQ3gM1iHrZqism+vJBTFsFZef/JXSNzVs/K8JLEay+62ja7suG5TUSICV0nhBKEImZ498PxCPFtSS4TPI9p2N1lqVUJrQZhZLysQVmbIhEiSPsKXYZYNKJChJ5eif67V/VsBECxEJxt+UBP+YOGCTXUcjZ15PjgIVwPRJbo/pwBp+iY77m+y0w0AAecjsD5gZhcRIFOH28/UOYzkGxdS+YHfUgNQ4/wwp5gtNHmWWugBvw5WbaFAQAllGVhiMSzYnkR70ivWSnd7ed6UHw5LMVGu0gmZqBzC6WjQl2FKShcQEkQTjY/Nm03+qfym9qrcCCOEkKqud6CFAGQr62cCoSt8f00AcvDYQNv8sW1rSfdAa8WWNbySkB5ui6UgAJCbzfEAqrwDDXnfrosoIlTHGwCIdiUWo1uLbxMBojrnwguZDLuDNu8IEB7QCoVGjjdal7eKMPv0Q1eta1wSIGMTMSx0qZvJBESwHlQNP7vV/ocQNKaPoEVodfwBFvqN9srFr8pape3Xf9tTAPRYlZoaRpCdGyWMsC4nQn/g/aqPuIf+4buiAEREsSLxAUYIapANn3x6dglZcMr+3hOsGDA9XXLRIxWI7IHUFO3qOPc9rQJJz5BFxgdRBGE3eIh6ellHX0LHl2RfungfG5YQNmyy8dARh8dcMm+Ay3wQ5nPb+JKtpmjZVIxsgnZVc9MHXlyuNMYBSPa+R7PT7NxBcrsJak1A5vD6jlgKRPTFSlJDWYwg9BsBQJ5fiv6xdgoQP9SBgA9iMaRgIqw/r/zUAtnPyl73Z0Ef9n7X0B05y+IlAFmgk0mx53DeFHVACAZ87AKAHL91tRgDXHl+sWJjUIorEAvww2dm9Aj40XnQ8RmAjS8SAkzwMvLrPYn9rmohfFWI/KBZYAYM1BF2aNgPQ5xRfARYHM6MQkTng5RjARC/KSge+qfywAgJ7/gI/RmbQYLUfMzOBPkxZGAR/cEIMti7zzj/TpwgoGILgGPLGh7DWoNmyJo3Fa13mnPiSZB3crr6P3/7NuI0ECFCiAI531ttXIkAscNxG5NeWYBs8wovhL9N4r9J5SBeV+iGZ7kb8TpvP62t3TY+4aJHfaD8iI0QrkBcBCAjt6uuPrv1sCeE7VYmIxARCoMI78TLQ1jQnuXhmUSSYxXnhcd7dqauIkNCCGNGgbhnaVob5SAW9HRPi865Co9ZhRME7wEg1Ynn9lmboQw9Q87RzYilQIQEwbOkGjpujmIjLHTf5x38YEM2aspOJHKAojHnynMiP5LJug2rPrelRYIua6CuR9XBXG5RAc7xkSSVZ9Bm6+Sbkc/OHrh/dn5bhvxJtz2Z/Y+eOygAoCRW684Sv2QFoueNToAU/2XufGOiSq8wXm5nJnE+TGaMEccSJxrBgDEBA5rKdKBqCH+aNW5YqjIgKOC64AYQioiyRmFq/Ydow2aXLBsqNWIDbmoWs8LWJt3q2gaXxg/1Qz9pIpqd7M6wV9BJDX3POe/73nsHZqbMhsQ7ZAAD4wjj/d3nPOc8R6teiYF08VxBgdw9XT73B5HT0iibsLARVygQBpBY3c/7WlohB96f5If4LBdd/rOjoKK2zh4DIK0FahAqWNiHC3dqUN2svmQAGT/f8M/CAthQAi6DwktS+Ak/aTN8cO/ciZf8AagW4VkdmoiTBD9c5kTUIO378+No5rXnlbY1FhaoMPgBRgayQ0GD3oXqgoFEjqVA5y75OebVIECcZnDYpf9hS1QYRbD1F36yxR2HjfFYsOeE6YhmAsg0FyDTO6GAhQBpPnk0J/Jr9cCtE6BAgB9Zy3mqIvVhZVWe6rmYH1XvYiAvI8jsdixjbTMKEFhL1VsV11KCxT4enbvqfa7r3QUz5LnmousVyBbekQUyhFZJLS4Rt5b+ZRQtdA0eUfx0TpCamqv1pYPjZ4ZC3hCEzgvvPBRTfmAta9J3f6Q0nnYHU+6/Pt/13xTAx1JNgRgzTNJ4R1YYP3ASRDd6nqpNgUBNay4+uJOe+qt3Tse/4s+ee7G/LHVFpm5iMDMjmgUCBCkpKRu4MUEAQVvdwIzMOQTh+MgoKRv+qGqhpw+To/zDr9+decH7p8SEHp7PLVqKCbZdJaAx4da6n3R+tiCAZA8/qc/M3O2uyolsLXz45QwY6AlhFrzUIBaRxCUrWFTAkqUrrnvIb6fmMALIPK8eHUBsSRRnYiOAtMQyT+vaECBJpECwgATdXJ6pio7oEySOujOtKnRfMYJsDBI+oCVXfdnecfPmmbPtjB9Bpwvbu/CanykL9oErSXHhqhI+B7I6SO414gNNCvhCGxWx4BvYqZsRpKKjdKGrvSB9oKGNQU4NBDgDPH4b4cNJo5aAEHpvxiZeBg94J4ZAnEyDIDEU7IpOBDkCbVmKLaDCtMtuw1OyQ6gibCdcx2tY02vZDeEBdwcP9l+MrCNy9t5gAMlaLvGxMnu5OCoro7fhMoDs6e05MovrP7gE2Sb1R/aqVa9enbixN+cNBIijfGRMizFBCfIctxJqCHm+RZ+ORZPpTIHcv1O6yG0B+fVXa7zPnsmU9sdz3XSdDhmFtyc13tGR/e8N3qzlU+iTyyZjQMPgrv8s5PvPF3FK7b7Tv9+1YylKEBFkkpYSdpNTInovnUmQ79aTjS6KWNRulax5IMlh04RQwlq/5p3h+Gcr0vO7B8qEh64vYmUYKle6EULcRdjc/2Bi4kEPB4iW46stEeEsqZYuCCT4lg035S/4tVn14cPXTARo1SeRJGLVJgUtG2Q/r5vrDVQpbvFl7gQDSSwbLKA/oIr1w8zMl119ESeEy7sJIPwv1Q+784YvGa9okZGOVmGiJ+hcdP4M0L55MfOwax6AbOUAgQqWjc+ikwJpbInxKzbV1bYG/Ek2xc9uvHrlQeMhFkDsDR2F6mYcI99M+oNrELW9496991vVgEdZbQZXHE/CJECSEA5JfhFBhcEhWC9KVMBCh1IXmiBJZMWQX6FA82zL7gVe7pjS99XXFgM+lOBqM1WwgGa8E4wGU6j5TFEIZqBANm7kVgjMNjqd2L5LxS7yQHAC0h8IMILUG50ZkyO96K9MgpAJAhpkenrt2u+1GlZXRN/MBI1UpyoRINIFWcnXpGdVnuiNNltm+klOESS6z66iNqxt4Ub67KsT1w9sfQMBklunTREKanBiSFmCmmOLHAkBwHhD3qG2H5nEFOsK2bGvbaymhgGEcaOG8yN6Q9aWJwwgYyODv719b8gHQbyygsXFx2QkJ10cPnR24hNW5Rc/RxMk3ANJMwx/pKRpCkR+svSn6yGmXVe0ghsnCJMgqUYJAiYIJLqv2fHHrrhbM3IPnKY6lNauqxMg4UdGRjW7AUAufTbx73/wJMV1Gj/oThMiwv7Aby4pO/bpgYVebqQXdd+F8pU4ccuuWH1uu0UrZLm1HigtziSBJv8sop9WgIc9mBVnCv8U8YxQ/gkAxG21ICpEMxd7Z9GooLM+rIbERS4/EnT8QPnDFMjDK4/msjLvLI6B2LCERYMciJFAYWNLjCYsx7VaGANxKU5IFuQhIsSeMzEUCAdIELOjgnwmkOmRQMXlyxXsvO0xB9m1Oo6AsHMvTgYSoPzszR/gwSccPWZewMKt7lxBJfKuYgUkSEFtfd7CToHpu+vbC9Ugk1Z8dBB6vPjfotiEsoB/Mk9UwX8JqI/VZoSIGTp8XSRSJEBogh62BRcUd+w3jJSa7Pa8P1xvrs78OUmQ6Z3Aj+nvqQ1rurL5ZMSXscle1HmdACL4kb2S17BgEqT3g9zo13Odt46gCbJ91S8M+oOysRhAmt7EMJP8BjCbt8xBiKEJS6c/JEG8Q1/kLWoFy7712lVfzTMK2H38NIIEEeKDOyHemtGhw4OD5+9d8IagfEUCJLRMfAQImZxPgPj4KKFvLI4eXn5G3vu3X7+dprNAUvTISNPF9OoTs6gNCxp5k5eEhyamikpWclgjFgAE1t7uOHayL94XVXnn8CHAALc8MnSHfvZcr0AyMkveGrj12cQEeuicEjt1QYzrNIZoi3Bxh2Fz1wLdGpOjrxuGB61a4UgXcWuVjbqvOU42WLhFoZ3dxZS6jDUUOVnSu3gxM/OwO9J13aNPvnohSlgEBt6cK5qwEiwWfcb7a2tYx5YuVcVKZTc00b+5Ms8YSPlZWidlIw8dV9rCSThQWFufE6NJ6dr7ABDFaYbkE7wiD9iYFgkUxApBSW+4XKjS/B/Ue8hBh/up4oriKQYQBXMI2WO5Es1iqoPLGwxKx+x3kCxwPjabSReQCKJYepsAIY6DVLTFGmkJv4Sory1UVQz7dSJCaNJFHrxrGS0QJdEc5G3IsBJEaI1El5AevOBFo+l+KLsF1ALo5g2rJX3QO1CduYl2STEFAkUsJAi7rzzYH6WZlqHnCNSwsrOWaxIEVoQgQGLkKUKiu+aih+kPMkGait44gJjsdSNjXqPeiHqIcpY35Du7P3dRn5uj6NyYlwmQZ5oAQYLURJAfo08h9t3r6zg/ePtwo48AEtLFmPiWTYbmVR5aoLsvdL+9bmucXHTkwWIpfR+WPhsrRVsQkhI2LsJrWMlG35wGzkl8MJToZgjpz1GB/ObT4/H+Fvp6f/dWyQqOiwzjTUOJnEAHCZJRXX2o/8H4+INLzRjFu45nYfGJdG2dofBAeLAvOCddC7t8MjmqGD9mXlvcc48Ei3SuxSyIGy/73UJoJHCXBA1vXT+tWwoVClfEptrjeRFKkl//+QUaJtJQEaPlFvk4VgNC9OsJxVC61Ez0IACQecqOOZBG4iF4ePhlPtwrUwwg0cnryEWA+BEgfDMHUwgAkNro7SD29HONeH3v55PlfjMhJAjDdgGV7HGz2eliAsSV6KLaGN84wrfZqgFaIwtrAINOKi3ZuIPu8QgfxMbDgRsP717Afy7HvvNYv/IHKWQLXHRFTLlgVArSJAmevUI826jCGqmA3E8IssXFfXT62ZgJIBAezL6poLjxZl26Q+uPhUSszh5Zw5pGgpAAYQcDSG/knTYMPSewDSub++dooMMsSBYAJPochz0XEt1nUX2s2j5rNNGzMQ2r880DCK3b4KuklsXEh1bU8vrGWn78Ru7oL5/SkVHgxzPyz6MIEO3wer1j98YHb7dd8IVCooc3NInzhJN0B856uC/i43e+b31Dbfvi/i2lH/3477vQ0kCCLNWZHLEOqGEl67uskklnLMHwK2GJ6L5iyZI1OEo4DKsu4yGe4/jHxxhAVkj7PEyCyI5eLeYES1GXHtwex10g2qygJjc4PfQcYd9VXVJ2qH+BZk06FJBmftjgtoQJEFlGMqRPgRfCm7FE6joul3XLblppa2t1L9oS8tXp4/M1EzIFhACxkuDQVaXcVMSyCAVCj/faIjbcWg0zIPpgXvbN1hfvftOUO08lub2Y77NFhtBmdAgyKY6xEwrWSbVOMQgkOf0uBZY7+ZUAIwj7sLB9f/QQ8VwOEJ5KYg4iQdgJNhiE9VKMCFABUugC3knZiLAE8MKFwlZ+wGfqBVVlJAmgia9AnqNHC5W3eTxCg0wVFHc0/P9GsKOoAfiB+Vo0JWjmaVyegIwcxnod4o4dL1X2VGjBrYp7ryB10eyUtSuACAARw7Hw0dhTuly/J8du1wO56dYAtWHhJAgeUL9CG/3U9eMRW09z32MAqdQrELqBAnlV2fNRuSlqtzIBZFaOEm4LGwTp6dzzpgHExKcIn4cDIjJB+Jd6fUPnFjmIN6f+DgDkMQCEKPL4aQSGPKEqFgiQ0aGb47dv1oIDQiUsvejAP9DKWXMY8q3Pd6c+/s4AU9WVu2/v+OXSpSlzFIiWbhIBIN+tQRM9mb8ROqR3zvMT9TZIKs6iQxxWXILJvvXocFkqCZCMFZkyxsSgQIzaBMcBB25MSIBs2iSzStYZb1KBEEEYQK43LeRyw2Tv62b8eL3BrXOv/8fcucY2dZ5xHIdjS8sH5IMQdiIEAiWgiDE5EZk0EmHLFCsxVRBRGkjjXGQItMRYdgC5ucxNuXgFhwHdNAYUUCcWPBCBAltpCTBpTIMPUFf7UmnfQINEMs1JQsigi9j7PO/7nosvJ05QtBznYgEGB8L78/+5/P8agLDswXKTuqdezhroJqoSDGxDxKSUsHDcl5Ww8NwfHR+7lrYNYrZ/d3uCAaSce/1SgDA8ySoo2XjLpGq0a4weyxEgZ9JMzjmDYffIWkYPdt5CO3rtyKSRHrYNITcBSF4C0EEFyDzY3ZAkd1R/nlB09rRVAkAINJZyBZIzDONMRkwWh51uwg16dMNSIxER7e3hcDRErkAgGAjAnWg4TEgCYkRCZuAiChMgjIa8iOVuC2XtKSs6A63tlS8SYNTOwqLkgVzEEmcHWuwi0fz+ML0QbTT+SsJtwxw1QJhHr8Wy1AjWigeOaBcKxaYb59kmSMFLxg+UIKUIkI6MCLS/fxK66KUcHpQdCzlAbuj6ks2xQSTIG6o/VFsg62SAdB9sss0ygNC4Dc8azRp6NpfHE2mNzexQmdn59eXt/0YFMvB4+9OMc1jqsd41nu39rfGH3xzGFjruBYIAUefwYpb7gmcpCIFyVmQQZnin73kpuH755+pqnORVttGVsaskZFCJQj/NxyaIsuQhK5BC/kGNE76JXlT0bvVvP59e1KW47VhXQ6G1OP2VqkAQEy1Vuz57FP/T1SvgpIgAWZ32tkLTX29BI6wpPU3bhku3wYfKlMsaDwpDlFleeYiXuYjIBzdvpMut9HKTQdMF4UskhlyYihq7f8yZ7h/zwu2JUZNio6jIiVWqhrw8v6u6DIZUDcK7JqMEIDtTv8VcgTALa8I09LV0CgtazzWhyQBShwBBgqB9LyEIhgKO1ET1p54giGpEghgQCM2AvQmCD+OwRSohx27Cgj9ATm04tmnlyu0Ph3piPq/L6XQ47PRyOFyNXl+sJxoGp1wOECZAlH10rGOBntrqzPIlREUQTOrXEnoKf0/3AAAgAElEQVTQG/DDaFmiEARiD+FJudv9gLRAsN7nq/N5vV6fzxcL9hCw+dupjbCyjI6TvWhxUkK+YnKPtkEqRPVZtuFgH9SwCgo2Yf+DtkDgKh16uf+Ljoy1WFvFwX/th1jCUrmIxSQImJl0n96m+w8pNp3spnO8aRVI2UfdJ2cdQAQHxG0MZt0BUQGkf7dvZmfK7LBFSAHyeICIj4GneIfgRGcIy+PpPRx/eKSTAwS1xjPcB6GVq8EIfn6WdrwX/IXfRlcJ4tlzm7cQCbJcrmBlkh7zlyf9GrZKCH1zjhAFJOm8TDAXvap682d7prNeJIg7ju6qAn5YrdZiayo5uCBRZrIgl7aq66tH8W+ufrW3oYXFgNBGSKoCkZVICwqXP07NCKvx+H2iP3JlUxB5DsvAeyD0pf6EbJ0obw1SRsiVLpjaVeND3lJHDZKLBEnrLWLecOLeRK7yoHKTQbNgzumkLKFrfILV6yDcAJ5uol87837Kn2ZuDPipFS/esPVMPhGAuGsmifQQ7PVRIl6olWKCipB5BB8JApCQ/pwk0S7kiM7Jka0HE2BmlRguGZbI7cUw5mrkEbpYEB/t4WjM67TbRM3gsyAIZkEUbY2+nnC7G89rRYKgouISBEZ5K9t2N2almEVXsBOiSpYyk3l68C9hAJnHtAcERIVDAV9dhctBnpgomvEiT8fmcHl9QcSaRHfYkR8WFhDCXN7JjwxL4BWs2QZx7ThFAVJQIAsQdr3cf/5Yxu9k6IMTgGgUCCth4Ryv7hiJIIIVyhtwdKcEWaeM8+ZjFx1ycWfZKrrQGLqssjHJ4nrGBUhvsGJmn5uz/k5kO9UfWMV6TPGRqkDWKJNYTzxf3r3+8OGRO/2R1wuI4kBuvFayeDXBvAtSOyGvH7TG3srdq/H4J1uSa1jJGGH6RKNAiAT5YWWRbHtVKJey5H7IT9IiZNnGzTePOaeDPPuxU7uKrIAPK2KkWKbIasXRpJhPYxXT2NvahkMAkJM3uxAgmoGrFapNEN5U//kKukbY0NDXMZUZ9ooO1B904w+b10r9ylQuj18BPiZ4CUueoIUdEJViUUI6ND0TxdWXaIJ7J7aleUF4nANEE3IIvRbNgJXJlCJCVEntKrrRKd70FTNvCJYuWOmK2bEvSiQw0mMS9DqCUfJCfVFeHgTg5lhgolUiGoS83G8O6Ucv2uuiNZIEmeKYJW5EF8JhC64TkjeJSBGLMS8vkZAQH6FYoz19MJRAMDJHdPpC4RqcRaZeKvMYPLgnFlTBKpsPZGeJ5ajvxCX5pSg/qLHuEmhncH6A9qghTyroq3CAfkj1iQJjEm8sRLAGbpBK8BQ0fCRLCQUIBK40/2Or5i/K3rTvfMuKXxRsGioYKhhS4QO66DpuJtAHBwWysFQuXpUxT6xSApCLTbrnv7hhz+9wjveddxa/WafWH2WL88GQEQBinl0AsXvv/lp2cp+SAoncqZvZGSzBG+BLIFDBGqA3ECLrb6Wb4KVTvLf6OwlAdvdG/kNVh95FOyKDC+ANr0EIOKl7q2f9/Z5zv6/eqKpQpXTRGTySETMf7bCKODAKk+5k4AcByHuHppVUJrqOnq8qsj6XEWJVFIjiaKJ0P2g7o7br5qM4AQg1wlJbXvFbi1zEUsawoIJ16rvsKWe2Q5TshDwSa1C3zsuxhUF+cpUpdxWXESaVsQl3d5fX/vAhq1gzhG0bUlsq9j4x/sG3qa7GRKLdG8tlDXBNq95kkA0bleBDBR+K/aKSWcJjQwhAJq5dShW5gpe83JanlmgPBA1JRmqae/Qd2QVHAL14h420ByJxBQIA0X9tQbQLAQh5mJFVqxLYRYexLGm4RBrGPCbMtKp0h0OQJa7/X9bmioX8Ncx8EcpYLNuENtNx6HakuTWYxfS/YKvrbKt8IYFagG2OEnruQzMc9lEoP2raW0P1lB4Z62CinSOEPMyyhEgYC3yxEqRhkbtEXM2zvHD/5vqv1KeZ2AiOiqBAhnCHUEWQDz88nzkZXbB/fKUbAKJWH6yEBWNYO3TnO0UMJaS76EmO7vmgQV59dGXWxaK7gr24RTioXjbXwQb//MTz4C8zu0U4R/B13vqRFbB49wMYAgpkPeHG+nQlLM+t3sPx+PXOfgIQWr9Kj5EFrB1CuYHvIE0iDybN7pmsdr/tzJbqjXS5PI34UDGE/Tzrl8xfPvcH7mZSqJEghSlr6FpD3ve6ju6cBsodTZ/urXpuff7cyq5ipZClVSDFypZ5C8xgxeMPTx9qqK3VDGEpU1iqnRC+RVhcW9W17+wUXtY0/Q3Co3L5voZBWSVnZonqzHMeWzuKibWoS+BB2rlf+C1WqQIDFX91eCOq4EzKa3Vbx6cEILxuxYaDFafdckO6KELtLG+uOiWE1rAgj/BSmiL6WTrFi11nNoWFdoTgyD6Jdvs+5K9MJBYljBihjpOqIEAIQNp69A8c59aoeyTHiMNTYHueoB7obMdcAkMQ8to/IVW6/aEgwcdkBz8c1wEUIeTrYI6O8KVY5ACPHKnGH6ib/BQ0ewN+wg8QIHRArMSCYggJgB2ZSndbZwCYJuhb1JpFhzeICFlrwcY5CBFwxKIAARNGaQT66Ko2utl58GIDAORlwdBP2fiVrED2Xsyci4Z98FelC+HG4UEX0cteAUB00Wl27bjY/eqNHAgi8yM/f3EZKBAAyOwawxLqAv0EIE/WTFmAeC5/PbNr9WZb7LLnR0g4H+AUGcAGyMBTRAf5MPCUiRFFhGz/MnqdACTaz1vo6KaYeg1yCTJIIcLmtSIPom+JRdFx6RMabZth2EotPqgUmc/8F+f+bCUDRbIAScOPlbTjvnIZZIL8YerQE1x7+hqKAB/PFYAUW7V99GJ1oC1ctbv6Po/H41f3dTVwL3dmf7U64wVbhLVVfSezXpgXzI1n7o0TfhjouJSJhXwweJTLs7TUXgQxMDY6MTY2zi8w7wWWmJh3OxueUlQEKzvJAVWjE+P3O5xJxRnbiW8/GMuV4z3UnlrYE+E7JZqBYiWBxJSblIrI3LvGJv55IUUXmOdAJBRrFSyiE7wcIG0x/cK34Ar5X+CRbwSA0E46tEAAIPoDIU6iXUboLjee7rBdhyKEbZhDkUdCy6iAN7vqu1l0BqPtbon20vm2H9Mh6GQ10ny43jb5f6Ngq5vxA9CBff0SIzv8UX40YyxtVt9PBCE9UWiFkMdTl8UcIyEIFTV58CVCH13NWvvHp1GBvAQFgu9wbSqlAMk8kG7bCZEgZdxHkd3KwNukFBYBdbWk2UEBknLl440ARN/Q9/9wifWdkddTKF95uAjxRO4GZzagV3T19Hv4DBbrnsM91CBUfsBHDhN8hxZ6JzngDvTKLXRN0yOJJSA7mAJ5RpcIIwSLb/u8L5z6+39pgG0acvDWh4ohlB5wzV2mGuHVtkAK05SvECArl71b3XdjGm4m2/56qKpWJT/UZSyVANG6YtV2nbqCAMEh3tWq0EFu+K51RKE2WAQgu87tyfov1lxx4fY4GigyC0JlJ/B/zF3/T9PpHZdeS6I/cJ8PI+tBcEQ3RhRNCpEzsYR2ZGv65XRhUXZigVoRa8AG9AxKgbtxR8MUZ4gXOWS4ODwhGnVT77bdqP4AyVgWJm5/wSBykHVegSIZWbM97/fzPJ8vLbRUZeH5FFuxrQXK8/q83q/36/VmlSN2CyAER/xR6PB4PKNseTwAIzQCvjhFSrBKLVawkFTJPA5PsvSg87ogqH+dAUAWFCUpfkvq501VsBB5kBUrZqG6olwAdGQtEQAxrwAgXgAQDURJZafRyk92CU9kj3+KXdXkAgCBgRiUgeiD6CQM2esSOEiqznhtIY1O8tfhSEFyvp/J7IS6zDkYIX7e17jmjUsrltYTBLGXlGhQSaelqzSJgpAv6JNjCSv5UFuzhfSYZ1VYCJPXC0M6BJA58KIQ+uH1HbOahLXJlYJgshJYgzZjPYScZOo0c3qkNGyFwq4rl5QeC0PFwM2T75YR7rELkUNmIC9Pnr3au+q5M+rgR43fpgRExg8jlrBufBC3j1cwVd9mfbzR6JFl/A4wkN91bKwsE62psW7Z+fVssgqIkwDIl0cM6/rSxMN/+WPtc7ImmY4+yYCEHJx+qMpXk5NgArl1ZmLiT3WcgGTwAtasLHvIn5AFEKan+/0XX/+rqhnAqSA7d6q6rNJVmrkCR2j4O6Ug23ewJiw1fqxUwGIMhNx48ZOf97mT//a23m55AfxDwhB1M5ZSAkEkKKNSRvujiYnxR9cqeYqi7BaMghCejpUH8SeVLZ3Vaz7fMIAAsihl3CoHnzPskIwhdMQ4wY7RQGCsv7u7h66B7v6RscCoB0AkVTGQkBlHipXFJopPhBcEnqm3BdHa/XcEEMX+zx/Ca2nMVVKszi2h8EFWhIAbOWAtsmeJwByrwahMWq1WEJ6BmRx3cj6OiTOQBInsWsF9kQBIdmaQAkhQD0I6MJCgvW4ofv8WAkiabNDWwDwo8jwohMzNZYKfMGxrazqcTOldKD2CsV6S+oHaB4agpAGA2K80JNoGRbfPSwV0QkBo8qEOGqjIXzUAHzZCierNorDWdhcYWA4IAiQEfPXURajTwwwqzOYN210XjskcSytae24QAAEE+WYXD3P/pogcR1+evXF51UZN0dFx9dzRIhUDQQ2kCPb/G/GNgIKh+j4FkP8q4IMJIEZkIB1Ww0YCEHKWfxdm2cYDkEn6MUVxgxOQ5eEux/p+KYbGx7UAIIAevBELWEitZAXhvIPfBgAZfnKJEBDaw/s1EhD/rEo2j1bREUFmsYa17PcPvwFvpKX5b+/vV4aVpKsKVhxGJC2dpr9TBpKvzN5Vaemx4ocEIBCHlWw1UTA33zv1AkDjXxIBWaGExV0ge9AFQgDki77fEAbSe61yj1S6YjKIFHmyh4dr5RXksRDG8sqz3Wt+uxgc/Q/Ixk92bG61KE5NlVNJiuUZ6NCCBUZygh09g601llIzeBMMJnOpxeqoGeweIRiyGNlSDFZAOYVdNoco0SASGe1WN9eYKsjrWFpUL6yOIQlJ4REp9EVJ/brUlM7uvKRci+zD87Q1BkBEceg8AEgOAxDcdoGBhOZdn9Qn+Ia5Lx5EBiJpIMBAgILYffXx387uC6dho9dwgQIRBAf7zYX0kCq1LRy21yX5q044CASwz7NZhHSiFE1hxBKW3dXkSBDu5Wj0EgKCY3bRsEH4ENn5Cwv3btOVUErUkOxOKlqQg4RR95B6sfBrJQASsh28ckkBa6K5+QYyEKxhUQT5FqcgH6+e6iZAIxUBkLclE4iRgghlIB3VYtzGgZr7V6kVXcVAOIL8+9zVXseGAhCcRbhvxR6sSX6R15Rcxpry3x1a32qc1tx1C00gz7kGQlUQSkcIYMygGwQ0EGzL+hFzEfrGJyZkAhIroCuKWLMZ/KBTQ5aX/d6h15/YIl4f+el/WNxVerT2obxw8EiXdJAX+ZtzY3t4V+QgO2QG8uNT91qTfVuJjp6WA9vfYQhSwBlILAEpOC5PBCkob/lVL/n+TvTdK9+jnHpOExPVFESZwFheeXNgzW+Xqh4oYMEpvyRXpMghu3SuExXEt8Dp/OhYd3ON1WwQo2aTioZSR2s3zsKNMA4i7fPKIhYzlUPAyKBqWzNY+wMesiLwxxIeuEDd30JfiTRGV2FgRJljER+xtORRHexJAneuR73LCICYhjCNhOz8OcFsDYaYUAZicyUI1N1kcrcBgGTqdJINRK9JAwnkfFN88iK4fS7GFNI0UlYUtAHP6UIs2d3e1uAWkmxsF62NbbwloIQ29VIGosc4E1cCf7xgavTZCX5g/xXyD10wSOBDX0glGZvX15h0KYfBWjhEnlRCEHZNeFHYfvqMoq1UNLReO4sM5HuqChaKIB+3r06nrR9CnOLbyhoWYogRx6L3xgcQkQLISvgBTATCUCpMGwlAzEce+5dpXPu++BxkCuBjihKQSXCBPKlf52G2li+HCYBMMgDh9atpvJ6h+gfVQLCcxRQQ55MzX01AkPs/sSQlMQ6ACfQTqgkIvQN0ZJFb/gz/sM/9+kOHtVWdn362f2e0ZVBhOlfqIUr8SH8rP0r4yF1NAuEzb3fkb96efurz1uSUG+0mQ/XlUwd2sBJWgaSDRBOQApWIfryypb1jfHzir+0ygPD+Xh7eKzUAI6rgCMN3yssrf99jXuM3Vnw2hgo6FIEYRSiWu3N5Wy64MSKRRU9gZLDGAjEUK/zcwAXAIIRPU9/C4EcZyMuaehc9D/qVu5JWMF0f7Cerkxwj5MB1p39klPaHKTiRetwIyOSBsU56/86Rp3R1suun/Xf+UWWKDlPSGixd9vngHOz/2VQHoVNByHbrTQggMHcWNZBMXQ41EyKSlBAAccdXT9x1rvkQN/lBiBXVQ+C8HMZLEQyCAPakf9EFg7vJC0UstBMyJZ0KIkBBDtYds8TnoE0u7MDKhBoW9Tcifui3ZeqwI+yIRdAm/6KskKwVmkMRBPX4zBzMaKEUxOUjr0or3bn19s3jZWWooCsUEMpA2qvNqzY0nLgNQwlV8CEByEePTiQAkD41gBjZhPSsH2ZlZW1AAKlquMVisJz7nDFUQ0IP+dNOyYbuc29a1yYsg/uxv5YVsGaAbzD9Y4ZKIor61QzDDwhS9D95OI4AkpFAAsFPzWZQaEEUIQzEf6vhTXgjzT1ffLY/1n0ey0HS05UM5C1U0XM3R2sgcbp483cQAMl/772f9SQ5GVJr+qD90IHyXNqExczo0X50PtxWYhPllZ/3/vorAiDXWmQGwn3nKhGkIE9GkDwMYGxeI0cSHXcQPxaU6ba7U9mun8KmgqCVMBIh8OE2xxuqTDbmZsIjFhdS+fjAFClZl48vZ4pIJBIZU016IBzGbLGU0oMus5lA0thuBiDFzLVIXYY8QSV1y0JktPtEBTijsZhmdTgcVite1VTUOCxAloSY1+nusoeCfDH5GYpY8wkT2SGGEckLnkwzPSOoC6YF5893JQhzrwcA0eRo2MgOSLfNoRACrkJysm/3vkpRV0te00X7fBrzo0vZ64SClIAIUncp7u+Z5dhFWzgMEsw2jGYHQQbUb5jvQSiRt6ne9ConrzCbqo2pIDpU0CFfC24QcIKOgzNu6QcjiK2/vHn8JUDHLrWIXgYAcmJVACxFACmSGYiRgwgFEEN8AHlES1hqEKEkJAtKWH3V5g0FIOQsf2rfvtgmXgIb0wrsmKbwMcURBXJM1hlALEO3nLVbt1LAgIrVNO3Gok1ZIKFPU/4xg+nuTqhl1Tr9vofjD6/8wi9FJ0YVsPzREohMRjL8/j+/GW+koXVEZiA7GQPh8bwSiHDxXKIfwEB4I2+uspSVGw8/CAl5cejTy9XJ/TC0pQP3Dh3IZQDCJZBoBrJHHgzCp9J2IIDcq0R8eJdpIEoKIj00jw1Rz6Pa+1oBxDA4RhgD93JLqSC75ekegAE4lml0rKciLnzQYnb1QMCztJCawkcFpsT4N7ActhBZCgxUKctKiptsCYJgqgpElAwkJUUK/GX5juSZAoNWIBla6dHkgVqlXUEbA+j1TbYwFLCCwWyysWXTCeQ5BEDsbYnOakopgEDUYI4ep2VQDkIAJL5lj/yvdQfnSzR83DkCCB3uhyOiwuFwW4P7lSi5WNrltQUZ7cBxUpi7XpIGDGT+dDxM1Ipun4vs85ihSBCjUIdzrgoLv7t32965kM3b5H41O7ZWazqM1AZLV3oGIDp9CEhICKY31ptkAKnuu3n8JEgguxh+lBWRA40gJ6+tOltTa8aptsYio1FJQeifRz+6/+FaAMQYxT/Ah44M5Fz8oYb/9x4s8frjYWdUfy6rVjHc4Ae5kE9P4X0gcMrfRs4h1jOVRXT/4be1z7cyAYRwEH6DCiGyHb12mvfyTjtrncMXxscvcAIyGw0grKmXHpIMwv6FEJC7TW+iSU4gJ9Gfvb9TyUA43/hB+vfpJT1drl7B+h9z5xrTZJrFcSltk+mH5u0EFiVEMpOdNYokhWAmEQJNMzbQOmwwwAStyKDbBbmEqiPhYnWNsCBmFE2WjOsl6s6Ibhg2rrM7EVg/LOsw2eyi6wczyXxZSCpNys4rFLsyNrvPOc/lfQvSC5eEt1yb0CCxz6//8z/nf5KTOUBE5O5So4PhBMnIyNj6btlHp1vj+8XNlee7d7+7lQBkmhMkS2nDWsQRRpDyTy7ffPDg8T8Hv9z/CzTPS1Rr0HNUiw3FD+GHjQQgkYu/aqvz6r25OYNBNVKBCgS/z6NrPmD0A6pXXa02UywjzY5b4zVzc+RgT2Bpi3xnINUheVQ3GELB0fEnSz4gvV/SWk+MhELhJSwUNRwgCQkAkCdWUzzPDq0EaSSBFxomQKgHThWI3XPQFu21FlMgMGSHxz+sltJp/DON/ZFLm5b+RgEQtvGV7odNwYWvgaIqclgv82ypb2uBrrIUmrjO1kDl093oR85GGCWUbO7GUhlXgGyiCoQBBK4A4UdFwTKPHq2pAGwQWdaxyhVXICkQPlxUWqc4K5J0YJACBAlC+UGlSElt7Y2lAULXoufm7sj9iaqEBR46BUikaRqt5GAAyd3MKUIhAgKEAuSX1nUEEEv/F8oyW19YAQupoeiPSXYjX3nRAun5tXUtASKZ6x8O/Yg9WFNillBhiAtFCbkNoTRBDTJFANI5QATImW87eYC7L2mJCUIxSehL4neAhd60KgVGU8HtR9CHxQHC9MbSF8FHMrIEFcji1N0lL1AgGRkQh9UXn4tuOXC9vZjwAxRI+XTYKPqbBgrR3CBCovs0AuRu+/4cZZOUuotXTIBk8SVUdB365xdiTFK0tY7VhBbESKFIwNhEbjLogR+3DsRYyDA7+sZHeTAjSzYUrVjoxyegoxKsGbkd1eq3tY4oHghbK0X7sVhKIwVIfK+RtZLV7QGAwFB4GiGAH2f7aJKJZ1+UM6PQ3TiDK6HSMdkJD2wdeSR5xhN5/Z8WjmoEiIYd8ulKYq1flmH+Y7nBcNpCt2dG1hhTZMIM3AOYolIgZyN0h5n2HW2ZwfVYm5jZDX1hL97Phj1RRS3N9cvPqoOAXw8sOBQAgc/Z6NUHAqVHmkSXrVY6dP8GAAQGQRhBRBGr9kaHIzJACD52MOHBGnmhhPXq1OCxiOOY2soOApBcho9c1sOLbx9glMmp355cRwCBVSDzTr4fShCEgsKrCBCmP4gCmcQPO53zA3+qWFMzhyjgAdePU9wD4eBgl5fVtLzYjEVDspxTE07X8CUCkIeduLKWNecq5OiEt+e+ebUAUYiS5JzvbFud0Rat9OT6315vU6pXeEtmNyQGJ8rPBEAS0QZJZAB5L2aCwDD6z8u6e+OLBXAc+4p56AAQZRSEZvMunAdBJKAVfuXkHQKQG+3l6spVmAciBhAFQrKy9rfHmKSola51jQYNzNfOE1aFXh/K1LOt5HRysGaszxHrIU0k4YWxUHCW5+PqExLCR8hhyxPMk9SM9kZb2CNV9o3MzapLWHy4kYeb5OnnQiP/jrOZT7I11eFeDpgBRw9D42crmEqjtCxt2FBN10npKECMfmOaBsxhjWz31Ed8lpLjlABEFgBJNypbl/xEgNg9y2+11MKGRRkGP2T05xEgKZhqkg+dyUs+0yQLLLGVjRrUB1C/ghUluhfvZENJraWt3rKSF64F1c0w+aJTurCIAkmBwC3we46KDXkKQH66fft2Ag+VC1IbCSDmQ7SEhTulFpggH5/6c+QsK6my4y4rYVF6MP+DFrHWH0AqmodolPvkJEeHkBqTjBpeRMaksEAQIM7vj65tP7LZcW6YAmQinB4uL/0KbXRgBw048XrJJ5dz4JvH/zg74BQCRKgNcMx9Ahi+cCWCb/POzuGm1dr3de38o9d0kPBtHnalXGr3nH5IZiWsxEQqQd6K+aIA2V12vCuufePSgc9+tbsYHJCN09PT5SoBsvENDb2UBERHNFy8f/jwg8eDv9tfLoZAcpSdtur+X3UrV3lx++UTMZ2oJsvtkZo5A12/QcNrQXtkgiESQg8cs02IVnh6u9Aca8McTJHdeoqdXfqEsLVSCJFMfSY1VQhBuqLuLLnWO4oPpDReUQWiF4sHoQnrmim+U85U2QyDc9hvpEnT+LktYZRnqnqivVarbmYA0fEFr5p0sMLl0mgAqWhqsc/IGnERfhipBCEAgQHCSmnZp7WpsqdFlkGApKQoCiSFA2RJDBRU9FRhwjyc7iwIy6+jnsx/7T1u64oKH1prUw/5J9NlhKyHN5tGZAWKWpSMFa1WKBBat3opJEhJNID8BhTIDmF9MIRszv3fqygA0WoBIK9EeGIqb+NFJZKau84AojW7Hw45fYrsYJRgN6o4qOSAd3ofIsTZealpbUfqLbDMFrt4JxZUr8j7Lucur4v56V4KE5hDd7mGBp49/uPDYafAh7rlKrz/alFliwCksX+10r2qL/zrNY0yeVvEJYq35PD6FRIkkXkgQoLEeGUwgJRdPxlHHJZkbr3csLv8PUoQ9SRIVpY62yQs4B2cjCs3HXvv/OFu+/4sPkHIUxZVEyAKQXLYDzZ0n47tJDIfuFoTChlYhq7YFGUw5IX4TIhh1jAXrBlrjSv9SzLv7R0NBsM2dKi2owOW0JavGY9aCgSJxAGiZxhKUE2YwETJvbFr8XWDa03VzVVFqD38afDJj1kkRg0mskd5raataG6RaQUrnXInLR1WQMn+0rrIwenkFSQBiF/hh1Aguk0QoNizkjKD1nrOUyRraEWM7nPCEhYEWVXVLZ0PWd3koVDj6zsAJuiFwEyje6XnjrmiudEuGyklmQKhue5EgrQdLFADpJYAhGqPkh9evixhdayXtZ/c6DgUHSCgQHaI+hVEkRAF0hEpDFEFEF65Un1OTUWA2NYNQCQrjqHvVLDBxAaXIpM7wz6gGIF6FgHImYNr245sbfrChQBZ6H+ACEFH3ctVCaInLE0AACAASURBVLZk7ZqYmJxyDl8iAPF0zuNyQV9S2BbCJFAgnYoE8XEz3YfXvNP5bbSx3dgvW+tXez7ctk098hFOjPD5wWQiQBKBHgiQ+CQIpGH9p2zP55854nhxaOvrboAmXipBwlTHmyUI3YbePXiz0HHn/kXaxKuO3YVeqxxVCLxw4ilAIEkxFjZb+saCIZqjqxoYVxLTaZot4UdfnKiXzCegNqZIkDwuQfhYe55+djYYfNob7f/1k+sCIDRUkYOIeekMIHEahOZq8rLb/wIn5jBLhHnO+bL9SNTOjvo2OwJEhwDxG9MoQIxyaU915A144DbMgOvOLyZAyJFvlO1151a0fAK3lCAHFIAYmQIhIJCWMj/PVBVBbi79NVhc1Tt0Jr6xSWm0Xa4wsrjrSuV8fHCqQciXuK9KDhQpx5rKA/mhpAQlSAkrZJXEAJBc1oelMtFzN796FRtACGuI5vggVa1AyD1MgawfgJgL/z7sdLKWK6E1qPWBMOF3TqrAgq1YzuGzd9a0giVBf7HLNfUGB8QF5rnLy+6ZmFL2hLicA989e8x7sJ7TgHY2a45vQI2kIV7RCrs9x00g1av2pz10/fiH2MnLC1XwRTIzP5IXeeqJCJB4a1i4Fv2tDMxTbD99IvZnVsHe3vaGYsKP6cVZJhvDCSLsEMiz+vr+HZvj5ODXDeU5SoLiFvXIOefHFgQIH0NvuHwsppYLU+XVezVs6I8pEIM6PBf2wZJjfm7k946455ALj41BsNUCCZKnz+Mp7+CCBO9dtWo3ROyTeTIeCs4auPwQXVjURccuYwKQ8Wtx/nqw2CkADsgLPzVBYKMHB0g0WPbX2akAodhJowrEmB+oaosGkLbSmXyBj3QiQeDYlumSpWhj7FELHPXNRbKflYmEiR4FIKZC95FSyDzkFxJkE1EI7wcCVT3VK96nJJkqjjbOyGqAZGNmY7aOAKRpEUC4AuE2SEkJUyDaaAqEuyD0HdqpPo4VICKANxX8ED4Gst4AYqn4S6eTmeMq0cHtcuUOTg/+jZOctYfXtIJVUP2wk/BjIkx3cLkxNbELJgtdXtqPRVfc7pqacA19/92zb+pwFWHYDKGPKRDcT+hjDojv+c7nO8U3PqfzU2gsWy13qbLrOPZhKYElghULZQh6IEKAJCbGqEAyOECghlW85/iXJ2J/blmOdZUVb906PS3Uh5ocb+AH9mA1tF/sOGx1nLzSXVyeoy5dbVHxQ5lBpBqElr7Ox5akaGsdCYUy8zKV3YN6sVmD5iqCgR4c7YrXYoD/Uo6rjyDhV8/0B43SVU+lw2Pf+2ulKRJAJPPtpyHWhSXyePmKEpxx1OtDEOwb73Ox3lMq+6H5lioQqGXhDB4AJIqHbuqvK4JtUtizBD+bBgMdGgqQiH8nk7sNqkWYdciLWKhBiHwJ2Fe8Gaf6XItMFwnqNNQJofoGAoaXAoh539EqOxEIzDxJEU5Ftlz0aY/bsvLWT8nm9tjlFKOG7sb9P3NnG9NUmsVxKYVk/UB6jQxgHAmT1USNSXH0w5aGNs0OQXAwbpiqUEAQrvJmisC6YPGFCIKyEcdEF1+YKLLKGNCwszM6gDOJuxv8ssb4gTWZTxBAEsxeCkhkJLvPOc/z3HtbSnuBknCpWAk2F5H7u//zP+d/8LVxZZVuYqrYafUCyH42R7ifz4GQR2HhnccBACKzQ2Whw/X/hzpbIIDkfuBjHx5R7uTdavNAko48czhUwx+K7+GFD/4B0wh9RgDiTDWs4JnpYc0VChAehCWi+SHiUDoIEHGQDqcrYyLDothzdWAAp9DVI4JcgowhKnjFCvHBETI2ZpqFIZAg9gVY29oPfvySuh9bVO65QpJIhpBIPELXqWpYmzdra+MlnweD6BCsuLf03CJWjmfDFCE08XpE8c5DiHrJVHSBvfTJo7sZ1oy7X1dmxfte/KHsoaIKBKlk35qlcWWiPr+tbzpcxQ8znxfnF/nJSYiZ6q9Zwg8RDWdn0YlqAWLmrw0RVnP9+X6HDPSW+30EIPJIYgiPZwyhJSw45cmZvobFxuvbMhlAQIFEsBLWOCqQq4F6y40wsgdJJjEx4zHgnoAAIQCRpo6X+z8PY1lxiiRhXYkpkChCEBQLEtzuL+8mUUjiABkP4xUs3EwuLQwQg815Pt0tJTIhJAMkLm5CSqlqygvCbaseXHoicWSXZSdvx/ICSAsByP79v1WaeGEbCLDkfeWd7wIBBPuvdis9vJtYF5Z/BWLgAEnYIAdgcUd906rrwsp72is6FNMcDY75CFHxgz1ziC+Kl9kLEeh7fOhprwMlxzCPLpHLWCPyDAi2ZKmqW2Lvm4GBq72sgjU6q8wKjlGGyNqD6Q/yRh6AE8eYo/64M4jbIo3NNxhA1PyggiNUpUIi2ZsiQChANIkQrkDARt/7x8tHtf50GfNrG/dSfnisI5zfiqUyQ2Ap7b87MqxFdU8q7fELLI7apWQw8oGSaHta6ZPrmrpBhZqX3dPhfJO598I/tmJjeub1w6SlkN6Yg/1T9KpvZlm6bLchXys1fayPwMmP3y9YH3bDIHoIVSAecyDhzESf9Jxo13YzV+alQMIwEGscs8+NAcjYBP47jN0BQcZRgsTG6BKlqdNO/xrC0gQAwcsoQQebQscyGCaoLLNYItgeMIDQa7WOra2K8GOiG/PKT8DmQNVBPZAJaaqquCQoC8GFpJPH3RKbTaHyJg6TWwAg/LQIQOq6KgvBRv/de3RB6APbeAsWBsgaBpBP+E4p2CSI7zahB+K/C4sA5BoCBBeAqHMU8bfVBRBD6ykCEAoHGSFDctOu4n6oAUItkBfnlzHMo4EfQuapHuqAsMKVKD+luVjkHXJEocfIoNjT+WbgDQa5ywpkTBW5q/gelCRMgphMMBkSvCEQ9t/o6OWDB7dt4yWs0Hmjg8oz8D8i13kpkM1aFchWlu2+90Bthca+Bn1ydZeLOiCUH3bf+sNDgdjtpe23HnekWotaGrGJd5dn5C4NUvQkCH0BexoEYWlxQGwP/zU3CeTYwSEiKxAzLzLNTR9rqFnSN0pIBvHAw3eVLF2+2zYc/fm+69n+AGJIeghZiryJl3KIrrZio+hm89xMX/MiAWJIduI2EAoQ4AcE62KWYvpVpxDoRv+wm+iPcYaPcZwojyEKZM9pZ4BBdOcJFUB0MkCiEiV3yqVMyzJ/iq0wIY/1KwYQFhofBTPfPgGit2UWH96Da0M8ATIhacgE06xFQXgpCoRNK+4M26kGiJDd3OWqLCgoIAyBx3soZ/33PeTzFhIFkrPw3ZkMEEoRShA4/perBSB/+pBA6AGe+QY+DcKUyIZVBRCD8KqzXhwaGvH2PEwKS7wFCVMgjs6LhwwreWrWsp96xLdffCHjYfCt6KMdy/P4teeXgYE3LzDInae2r+c1rDGmQGSEmGSAoAJxzPY6g/k1CRnXD/xhHwMI8mOLlwkSySGCQyBqBbJdYwPW5s08Nws7eZ+02bT1jgo5Le2laZQeOInuIUHU2kNlhoCO+PnHC6nWozddWdG7WNBVvJof8aoHfIzRhwDkliaD35hxG1t4P8fLsMeeWLnKNDkDOVNLKmQYLDX93ZCqKO9WlzuF+epy8vL/uNLqr19MSL5NkxnlFe2oOlS/EYBM91cs9qc8z0luisdjmAJhACFXXFjfVyYE6IU5me6mFSxCkI06FklCxIv7Upnf8zDYTp6ga14JQKAHmGuQCC3dw4H/n3GAREkSAwi9aEsLAyTVWQzbcOGzo+RLPDlBQsP0S5lBunZaMsm/mI69OlSv4tBLj4ubUqYT9AZbTUN7YyUcBZWEInjszwV+EIA8zvADEJbGy3dKQQ2LzgYGViCpLQiQBOqAoPMuF7BWmQIxWB/0OkQT9TVUmoMJEkWPzC9h1Xf+LXUlT01IftrpQIAMDg+q5j98YUPkIVnir71XBwau1sMUISXHLMOH/GDNV4gPmSDwMdjQ2+k/d27RJsj9cwe+3EZDsEK3hHpoEOVPkZQfVIEoNSyNFgiig37u1s++arycrenCajAeveVKU42fv1PCTHzYIFyBpJ2r/Y4AxFbxrQu2ofPcdtn78EgxiWemejSWsNpb8rXcsVqr+2cm6a7BHbIFAgPoO8Jp+C7tk2poFZZEeoOxteGfM5PKdV9B1FqW3QgA8V5s6315uM3XpIeHyAsSacA8TzOBVF/rIk+upLxqjwQbPTDQHVpycRREJ7nTLwYCyKGTKVSBTJB3Oozy3Rij0yWCiLAGqOUc3iPRdiRawpIBAhMXViEIAJkIC+MkgJpcBDyLAID4upAahJKLBKSJEayeFgunFUWrXiknguZRGlObqmDSJFZWIHTtIQFIuQIQS3Z1y60frl07e+ceHK5KVyWCJLew8N6NMwtmYRlplAlPc+deOhDkQ+7ZR/4BgmGK5G+AhU5bsFieInb1JiQQgFxYLQARkpt6HIrTMTikjKGrJIcnQUxDuHSj/qc/r2gvmaXo+3qHKAcnevBiUOV5KAb68LAoiqyCBQJkdpQ2XMkEWU+d8zE2+MH4MWuaRQvE5Bh6URzUqpze8OrGgY/b+ND5Fll5KOhg7jkckaHqY/v23yxiEIQdn5W6GrQlPQtJzV+DAIlmOYrRXvhQRgoVBQIxJu03HwNAmu9k2WVuqA0QTwUiV7De2bO6KjSF5P/nyutpmCH83MwWz1KGmLmHTluw+pttS4uBNgh5ba85QMJDzEqo+xz3QAhAjr185Y9PxpzbM9NyphbNZZQrWHR0Ze3c3POcxVZ/Si5WTSUSgABCoAMLJ9J12ExbnmkIcD99CXJ8J8bD0AXBVSAEIboId3qAQUCBaJcpbGjFyzsTIOi/76k6XyLogwMQCg++rio2JlYnpReX+AQIzGhMuROjUETp5NoaVWLO4Iz56sGcgWUluliEGzNBonZKEyqAkPsNa1Jq0Zm7d+vqKiqqq6+3Xa690XWvstKV5XKRHzXbghZ9zk3Mwtr9iSoFKwHjrYiAeHTG4hcgeS3ggWAT1u83KEkmmzDJZHWFKcLKcQcUsExDDh+uuY+2LPJpJly68eJUx4p+FbYjzxwitz/4CpC382IVqfaAremfEpqIWMFiq2xZD9ZY/XrOD+6DqJqwUIhQfow5OsuDsEpKfbRePvdxH9t4LmuOUPorlCsRKj8iPQmyNICklWq6TuvXGDPaGku3RqsMdHv0Ox8GiMeWW7vd1dXyY8eFjOS2ewQgXttu43fFqy109SwhAYjrG01kE1pfdiNAoIC1A+/tESLqGhYMaix1o47BkFTRD+UnmpnLxtwxo5HjAwFy39+iNGP1c7qtXZ5lZzm8ZjMPNpmc67692HtloeR8lUQBgsojNkYFEP+lVT0ARJLQq4YtILEQhQJ9WAQgJ/P8ngeuwpV0qEBAH2zkAJHcKcfLl13RJddpChAdFR6UIBwgPkIF9eSm9kTKFKxIlPlBAKKjiS4XgzS7jNsfT9MMSbbGFxwQBhD5O6c3CIJgNBotFiMcFlt2fk51c0vtjTtPuhruZy90t6m35nx7NvfD7t0J3gde/wOk8YICyaUKBIcHgSDQ1Ms3Eq6mOHdj2fcOx8jgyEJdV0Pz2nqhR2sEdoF0nlrJr0K/JvvpX0XRwYAh+phEZ/AQhxEfb4fFT8lbLxEgv6CFvn7WY2nUmHKMyo9RyI4cHXWMYpT9bP2zI0FOF85u/vtf9smThKEq8SEXr8D7QHao+bGODqMvBh6YAL/3q/af87X869rO1LrSACDKDLpvCSI3YZF39ixXQ11Hx4WijCuurHfxqvXnvFy1ywc/ECBpjQ2aamu2mr5uOkS4gy2NMlMnxEznCWEIHa7vS+2VM+htRc/nJidDmFwIp4UxebEUMmR67vV9fxm/luv9sG13LW/hpQqEZXfRNt61BCCL3tf94HyKNL4RBzl0EigQHYZbRRGABPLmrGWnpySJzo5wGxwAMu4+3OT/PCyHLoFzHzYBE3UqgJDLdfrpI8n65QOkyo0X6P8zd64xTaVpHBdoSYYPpDUbcIir2U3YhCFO6sb5AoZ2m9BUatjEILOUmxZSiFADjFmQojgioFK3w7iBHRw1TnW9ENFhcJz1MvNh0I3ZbMzGbNQNn0qAIaHmiDQTMM3s+zzvpaelPS1SEp5TT08LpRTb83v/z5VF0QEg4DCaW9gXWe/rylohhxcBIuIftCBf3il31QDRwRiU+XQEJ/5SGAORfi+1nJZ5iFShLgUCFD0RJdV17e0XDNFVKgPIYv5iRig/suJRIAAQpkCQIZjPCxER0CL5MFBq/QDE9QMRINPTk/GZd3ISFcjkpH2NOymqNDYYc2Wnfa6ihD74fJApOjJkauqtfeIlhtCXwjq4U26IpiUzAiZ5TIJAJ+KlJ62JHhVpqLv48Z4PlvdxT2F6BFu4o/gICpBXSmH0XKV03uzs4r1//vJIbK+DRlXVPbK3Up54JbKxItSBMBFSWlo84um8TghSd9FRukneY1E2yDaMH9SJBY+MS69aP3sYoABJDdJDBNPTECD+cfeRdz2NaFR663mIolOHE2vVmCpmVyFBfg48HlZIOVbp+5+FAIS34d3J+7nvTAUFstKGTbprDSUSxMFp7BzqQObAj6WWig4ql1ypNhiaKEDUgiCoQJLn5ltcytnTMDVQwtHnmGq7dXOyAMi+vsZVn6igDoQCJHMuBCDSwj5nRIAYmp3kxF6QLiQLAgSaZ83vO9FsShRANFpb32HyPMm/UXPHGkNIUcMZi/J7CDii1WpUUd0VRgKQrv2L1EQJIQIgToCAAsG8X8Yd5AgGRNbVREKD62aF10sA4mV8EDYNF7pNsi9Py75m7zl7xryGdegafSOUoXu9rOHVMoQUyudLQcPeKQihQxn6xF+WKmaWaAWIaNjOxQftayJcWJB9BX4sApClip6bLmOCX5LOcp4AhGuPlOUgSaGXEHulGEbPDdvkCiQ7Z7fju/bYq3ONtvbcqd2lLAcLrko3bYpeTsiLASsdFw/19l6/3vnZxeJSPiJkOw92bJeVEMr4QctAHEPt8bBZU+0eZ2f3nanbknZuS5IxBAGSRADy0FP9jqEqWEBacFhVkkyBCPcYC6X7Aw+HlU5ULwAgaW9S5QqE8g7DKhwgK4w/a/TXWkCBYDMSKRPb42IybzIBSLOiFCCKEsa00tLDYFMrBMhBl/L7wQgTOyQ14wedpZ6JANm1z2lb9RpRawaA0LzguWSJL/YZQCKtdYxNDUXzBQXo8wrm8RIBMl/UcrpMn6hPqEYF/YuJ0AEJks5rQWAu+sLhVacK62vdly537d/PGQIYgS0fYyBjsQByjsiXjKwsqB9h86TQjQWVJDjSdt3MRFcZ//WAACRv2huGD4oNxgy2m54MKpUKaMVrXEOAaM3X/n6f8qMwqvIQCgRFyE92u/0+DaHTgR/cVSUrHJwNMVoBgpEQSOLtcTZrE1zYojX2f/qnP4o27fLxH9j0imIlZblRH9ZyguQqO7FyfuuIp+BbYzgy1FFcGnRcMfnhi6JAtu+gAOk4WUcAcu8rz53KTYIbvPZjR2QXFjjBfJWO/up4zkXa9qf1P6eloi8olSc2cYbQSR5p/tE73b1GnYYuA3EpKDvGG9EM3NlGa//jgAwgqaLDL71AlldgdFhpdfTi/GNspZgUMhs3aacoBNmW6g88G15hwZvG4IIykM0gAZAf4MKS5tRzaqkkxlBB1YYXMOBiTq5A6AFZTl9T/sObmo7C4CZaKk6e9H0kEANI1aoj1tjKhAoQkYeFS31p4eDpSDXl2qrWll0gQNRygKRj6TqRBrpEnXRUG6pcRLWJchPe1Z38YoedjZrVnQi0VYPHhy4da2vrIhvYIkPJL7+0tQ2MxYqBQAQ+IyND1I7wqVJYG7K4f+CL2nUCEG3V9z0V0ERKCJA8DonpoArhOw4QcGRVPDhRk5CK0Gjvu+p/fG23w4RBwIR3GTwK4ZpzhPqv7FN2+xPwYFXMwmRB3rQkxG8lGDITKkHysAjkk7KEF0bqB0cIQDYGAcKTeVMYOiLRA8GyQgXiow3gc4odxztjvru0lvaRShQdPh/nhi+WBCktdpxyHzhAANJ9sqN0E2tytQwYkTxYOcUdg3HpVd3ws3o/PRWzRf22JFlHE4iBvPE/Grp974DFZDKbLRar1WKxmM1wSI6t5NBkMhnJBjtucNME30O+y2zpdT8DgLChhNw3xlr90ii9f3TYqnDaffHjKEwD4cMN2UR1pkCQIBBGGVyhStIaoRawYDMGMiQIgrAYiBrzlWKcDClA1Mly20oBovyHr2qCR0ILYDV3nYECgSSsltbVhwQhv5jW6wFCsH06AwjUBGoixmRKdkkAEEEPHFACHixnuUmn1agSBBATxo3ITyYbFyAgQRZKTpSvLhlTpTFUd3aPjd26e/fuwMDAsWPHurq62o4hStq6BsZ64wJIVkYWK0BHgtBmvESBEICs7RymFXiwbP+tIArESwDipbENuPBr2YXzwyuqQB58U76GL0KlhypCVCCF09GCH4WCHrC3owfr+fOJngqYDDW7NCPiHrOi9DxcgcwyAZI3MwtFIOaEvw5t+/FHe/4gqx5kzqyUjbItMkE+jJSHlatUUejLfi+7eO9QtzHmb1X3RQePgPjoLBCfMkMoQC57rAd67/177GKlCIGEEWRHJIKQR45cjcehozUMP/b7WXwiiV7LAiGoS9L8f3s2dPxkP9pJ90m3mx660Tz9Hs/gILmEmQe+4Cb7QY/76SMcZ474wCHrkIK1jbfbQgkyel4BIJoXUIuYJrjDFQhLyEIi+QNPr640hm5ylRCAUApkSjwGQk6kCyUx0ssJQHD+EuvAyHuREBhIsJpWfFqb8/ACKJDXr+cwdA8PJACBootgU6h3/wDoIMSCRFRnJs/xGAj45QAgEZKwjI2QHJUuAMKKQMg5vujs6Zoyk1FPGALhB2JUV9JjVXiQQ6WUUAlq1NZ0VJJo9hk+D9cgCyVnm1e5OFZpdXqjyWKt6+w81E1Icu7WjRuXiBGOXL48dMiqU2zVyRUI1K9nQRSEz0RHAxfWegGI8dr/ECBcgEwDRWhV4bQ3BCF0J1xY9p6bCRvcF+XDBFWEOLW2MBwdhVyChMRACD/ePph4/vLm0iQ2Zg/JupoNZ4c8kZcpkCd9azCgV1vr+eue3/H2V0J1RHVdhWTyRkzDyo2gQaDrSbYPgiC+nL2n3LG6zakMh24QgGynY0B8XIIso0cpr1PHEHrlbsdAt8Xae+/2l1cqfUyZhIz/CLshA0jH0BFtHB9JnRniE6mitiLMMPc27U2AWH2ojdeP1pPL6PjoOLFRuNAtaKNgeEQe/gZbuqeKmebyIAiE6evPH4j+EVVVMYCkibHtaWJOLobmIYzytH2Fnw+t2VUkEYCACEiX0uGUm0zr0QEgis5VDQEI5OKqQxQIxKClw62Nyk97AQACA//grI4EIVoBc2ZLnAnImdXTeSCop+AnqzOxwOX9ZOixEmnBxgbsqlmfXFrdiN1758/+85szNTU15eXlZcRsNlsZNXIEItTEzcwNbxEJapCZHsxAZGlZzemDUkGwVwqMrUqGIDoAZPUd8WAgAGCKPJfJXFtdV0ckCVEkA58f99QatLEBkp/FouiskDA/nyqQ/MW2u93mdQIQm+tr6GNCASILeHAPljeCC8vL6tCjtWJOjOfH+u0Tu927nB8MIfbwe39NJMhbrCLsqUC/VMUS5cOsXH+EKxD0X4EjC/OSP6lK/CvSmK5+uucD0co9JdR1tTEk6CHfMwWSHa8CQYQAQ3J2nxqqNsZYHpk93zlECpZP7CPqD34neLBufWUmABn7vKPYx4vTI+mOEHwAQBxX3EdUcf23/0h7hNCuhLQfFu0yxf1YWKkRwMmzfm71+I9sAXIQIBvuAnA/3lnPNm6EHwwgaUGEBCkSB0ACIQAh8oV1dqcuLfCCja9kNAtdq9taCUDSERqEILhQB5hguNkWCyBHcZJIcqipJQIQ5YCwqrGhiM4gUb+ew7l/IBUIfeYJQMp1q3VhqXCgVCaLgEAQHX9HQNWuozWRKpHLmqC+D8oa1aK/41YcUVJQ0tLQ0HCi4WwDtT6yUXP29fW19rXKzUluO8UtV6uLGO7AmvGWs6UIx7VnIkW2YhQI5oIAQIwJPBVg0pZOT0sSb98+VGvUKQJEDznAH2VkIT/yaQR9yxauQLZ8tI4AcuHb+/afJpenYIXnXDF8TPM7yXL9h8a1DIGYar6/b2ddE8nmFeyQqQ+ehzVFC0EIP+5PvHw5gb3pZ6gAyftV3kyw7CMcHhwooECgsr7ZkPgXotH/587H0JD3lcjE4tojsuuKb+R7c+OKgeQG8eHL9r2XU9wx0h2jx4yh2g1FICxC7hMNsZQIkl2823FqrNNoJgC55MgJn1e4zIslc2L5Kh1X/s/c2ca0dV5x3HauLYUPyI6WXPiQWZnkD8xictD2hSLsIYHAZESKGG1TBwitzEQMStIohJeEjTYkDKQk1bQsL6PKaBKWKjSKuqgZpJm0TAvqh4pPa6R8AgUayY6uDVWVRWh7zjnPc+9zbWObghWuwWDznsD9+X/+5/zP+Rz6WhRLoP0xTOjJ+554KUtoEDlxZGmJrtkBkgJdiRViAq1Od6zoVNDnzFeWCpaEf0H3yF1YpEoKVjICxDX2AAFC2VnGpyHZhI3BDCDnWtZ47vVHRur4VnOIwtKitjjVpBAgGc/kitIGOb4kIiR+2CsTPYfbspSYuhhA6GtCHYtJkTjKFy3Y2P32+osM2B6mYgkLviMoYVGdbDk4kg4gSqSvhwfx0p5ANx1go1cmgsFgY2NjsDEojjp8CgZ76GaPeAXeUdyzypFIJLS4KhstFL6FCmTDG4Sg3gZ1rdraqiw2jjNw8hYqEOjC4h1YiBKcLNyBCiS/q8RzP7vN3pgK8yZdFBu4h1CWHBI+5nUTfb48HJoZKJuKWQAAIABJREFUWfdayUxHPSyzFfxIss/D1aKSVf2M3aIWrJ0gQIbQQgeAQDQ7d8czHYt6L1YoND26Pw9YdzrHPv7DW3uFiZ4kOFJubdM1CHv5MxM/vBweqw+BgIvuKWlouH6lPfN/Tf2xyc6mppi0ujamF7LSHB54h6aGX/dfvtPhr+r4+9XhAx4QIE0ipte8+daEFSp+9X/cXpMLQGrOP+CbYqV9gVYK5RVmSCmvFhWkOUwZWvSytEJeLVIhY6NAWjMiA6Qgd4DQ+KH4hHz9LmDqu0fj+39IsUdDgkD3FcMHKRBVq+v6fWaAOF1jGAQvctgFQGyVia7Mxp7TP8EAAkMg0MIVhZe4UhdCtBpH69d9nlKqIDVdmCtRMtGhthZlAEmXi+hiAOGFJbsqEQR9kEoYBqFDS2jsWIYrLa5pqiaOOrhKaKYjvqzBJc4u7GWUfdwyfSSXOfoBbcb5AYjBkWyPKwggL9+QWrAo2h3wsWMzAcTpm50OzQl+zOlzH4IgZgPEkCRwup3pa7bkESBtfdNhcMareXK7JD3gKkzPEIBVDSEmpEBgme3TmRBt58X2KmzlTRIf5fgktWJBmQtyFCfy8UujWJov/O6tfRBksoXn7fL61fZUlmwzSRAAiIeo4fV69fJVmi4sXD2FbVhMgZTs6f/omC9Ll8dwQxPPSDRmBWPSU5IA8cSKGECGrw7U+gIddwahgkUfnnZ3unwU0RKRs7n0HbJ/q3EAyJK+MdBKSetmADhKaQZQDx8pEFIAS1LYDlVq4CPJRuEaRl9viNLBQROFopy1lBkg/jFMhHeY+EHUQwUCumjl0cW1Ro0GcJQDZABuA1HFIKEGdnNzlr/kSBcAxO7GtHQ4uALJtlHQWTXRmliGIRBUIKh/wA4prNSCraPrP08pzQAQUCDUGgAnbPgWbfHlxpG3A2kU0ZFDweVCw5awYaIJ1bBwF1WlqlVq0KQm9gjyXYUYRMIv8lGmsjfg52L6SitjNxguGTvKysrESltDgIBPo210CWuttmng5OAnMIVInb//w0nEH6MC2bG5AOKqujmNFjoSBOfRpfEPmRsSSUSW+/s1+SRb5OHUK9MICK9ZcfOD17CeVYfZPaKAhRWs20MhDKMvfw4XJi0Wn2fTIJhjEprui+RDUimWby7+7U/7fgnEkMN2U8ITJftDAGSLN8n98Kb1QDyGAolBH9aLzi/OZ+qZdVX1Xu5v8BhZV7sz4IMESAwA8uYXn3dUuQIdn08eKEGANBnLQorMyDDLkKYDwxdy+YNULGNn735P9SWRlUvrniokG6SUaxJ9BdQKP5ELN1zgg7billbI23FxdxREX+k1LAcXNFbeSQXXWTyQwOyDFW6BCIKs8BqWHte18qB3jS19yjeHDyFAMIk3GtVgLgNNdC1xKstfmzMQ6QpqxiYoARC1svFUpCqLc9+agDF0GFqEXexxUiAQxds1sX4r2dXc3QoA4d8cdWFpABCtsTtN04orMHq0btlG1SuVIrTgQAkCr+CyXRvRg/qmit3F7Jl3UKl25EcZPbGDgGKXRj12wd5BeEMZ30Eo8YOXsD48Enh9AHHCEMm1a7/FARK8enmC5tlfvvGLHS8xzXeTAKT2q6nwszl+LFCiycK8IEkaBWIA5OHhDU6NMn9jE9OhV6YRwmpzExZID3o9DBKEiRCsYD2BCham0AM/sDtXH/kQwsMsP7CE9SMGkBuH8xJOr1gCvf9kANmeCpD0FsiWbboU4WkmXgEOgZDkKRBMdGcCJAb82Or5yZ7+c2cyrI127R+/jj28u6XtHxI50jfzlnQeH7yzP+AKtH82vKdE2nbL+VG0W89clMtatEd9cjyXdh5FGftaBgit19BzppILUSK6SnjZNA+OfrhBG/NHFeg9U4YHgvkoAiH0BbMApObmI97FW1BgKBAJIEtLDCBr3rhb834XKZCoFsV6Eqa5RxEgWXZCOWsmehAgxYIfhXS6BoBkdPZc9d2NTIHY8YvCEQcFUgarcINHJ9YfTe1qGwGAFGJTAHroPDUknm7XiGLx1Yy21sVxvRMFBOOP4y7kCkQV1/rYBkMArIEvtrv1QQ47lyB28z519q7FuyByl10TV9hdbrfJAsEQgNcMEIvF19x++tKlK1du3foj9P7iEMkHB0/wkfYT1z4b2BwA8UW+wmFvkCDEjwVqvJpf4PklC6aqljGbHhoaeTeQR4B03J8K7wRvozplehAvVMhC/cFLWGCBzDx58nQoRArkOT6DAimnqJLn5XIRy1TTWgwthoa+jOQpW9jf8ud/7dsLANlu1hzbV+GH1OEr9IbXu0r/lZfXr3QTBHwQGAWpWbXAqPgHrh5vkNWDhJC0E+meGIwCdk5e+mu9n8mXj/r3eOTqlf5pKLYkxQUpauoc7M3FXlJcY49XOEAcRjK61ZGCj1IDBA7BDi4iKpLxAQIE6loOPY0RsndXHA5DgUimPVIgM0CU5k8lgEhVNP4JsY3r7uOTa2zJcDb3tS5rUVgFotoohZf2gcS14EiW/g5nG+62wC5eqPNwF0TVACCZw9xhj0gcjXPiB4CL3bbBvqfI+oMZfAgQphsK5TBFm4oAqU0DkPruYJ0mAKJSR7EbmOFGBaKmrClk5CjmF12UqHRRDaaQo1KsY0fjH8++EH0usVgKF8F/+I7/dQLE6QrU1Na/19LSDlMkSBIcIjlx4uDBgx98cu3SwA9a57zxp7aJL0Phb+d0CTJH+JjDi0hPFLeMpqwFAMi9M3kcpve9+3Aq/EwfEpR1SDWCo1ocUNECguwMh19N3f7Pk6ewHWteuCCYcUXPKfRY1DVJ+fPFUGjmXr4643y1F47v2yvGy0XQ1eoWujydbrI+0vZfyU28+rF3+Op7LteqtiZsAmlKWX1O2GiSnvm9Hmzi3dN/6/SZer+v/vzwgYZYctSiLkiS61g/Rw99vCWXR0yKbxbc6SXeGIV+hbmJl7BgZfwoLRDdt1aRiahbGHoJK+XgY+cF5i2H1qSmr2weyNiFR9zqFwHwUMKStqojQMbW+PvkauuDTlysIVEmu2annVJatp1QgIEeWvBto9habqNridZTmeOsXO90BzXKwUJ+aHFQP3EYFG89FNmA3/62kUb8ztRC3oQFIS2q2x6vO9qd8jhagTn0ujotvssuvAmVG+jQz4toLBQrcRESblAegBAJDnY7f6OafNNGefduepPo8zIDiaGTAcTnfK2nZoWn8/h8MEXCWHKy99j4OVQklwfH2+sDm0GBKFWjN2DYGwWIPo6OwOCFKyQKyhNRyuJACU3f68gjAwP3b4choR0JYipecYJUi5dkgex8tvPbV+Ghp9CDRdt4uQQRzCgX6Cg3K5BFuhUKDd2+ny/bzBn49Pq+nxJAtsn8SOOB6AokabGtd+vqCsTUhVVCoe79l3tXE7mKq/7ccGeJIR0kDz19HxasLWwq6bz+j7901Pr9HeP9DSWxpHWFSZtvTYYIbKG6mNPMkBIggJC/4LBaxbldNsFLMWtKBGRhXJbV8DAqzBKkIq2Hbk5PNAMEsk1wDmT1ljzn2NnfoE4Se9QlF5/zY+n7u4/XOFSkQLr4MqoAO9kf0ShvXcq6E0qB1qWEhroDTrKVEGWLj6kTrSOZpkrZI/4jfQIgNvDv1ThoIFtxHKMUN+BBagQAws/7NpQCELFSDABJDdNTLDA2AgDZVYymu4ordsVIIbdDCkV6Fdag2NMuN5awDISouuZIK0jYj8n+jTU1riZ1YeF7sZ/8368bICmcpzmSlvZjx06ONcMw/mZowmq+N80Bwk0QogXvyJKBYeRiIU3mQjOjeRymd9bcmwnziPbU4fNquuJKhCwQUCBYwcIe3vL5kNGIJV5Jdc8XDZj8d2jkSN4Ule/m5Td/hbOB2168SF+6ShkFkRfb6mojSX94U/BBFaytWxs6r59eBfCKparlLMaY7C5K1h9GEcsj3+0BhBzonzw9sL/WHxgY7GQAiaXbHiIkiLjiEVol/ZOzORXTFTAXvlvSS0LU04QGiFWywZOH0+WTv7Ui42EY73wDoUMfBJEolAUgltmv/8/e2YW0laZxXNMkoBchKQypF0HskoGMKKlzJxKzgmJM1sJgpGq00pYo1YjaUhmrs0yZCW7rYqUDZcpYYTutXUqF7TLLDLbTi1l2O+zFsLs3HeiVwWwLRpKmIkwp7Ps8z/u+5yM5iVKzlMU3xzTnNGljjOeX//N/PoZ3trMCIAIhfC9LI6kezA3s8W3S0icBYrJACQjjh43LiGJzXAEDEiAm3ybwA+vQgQL2wo8cwU5YNQpAIIxVk0m/HDu3DwDxY2MStXAABQLNeDuujed8jrZDb+DAqwwDSI042ZMCgfm2TrBC5IBboUF2sfR6RCoSpzwgs76caQSIw1z2ri0zihKv1+vwOhzvAt+8p76PC4AkIIAl+AEwkTGr9YQOKHCf+P35EvZyb4YnttG60arq1C4Bomy0gB6wwSiQn3+MRhp5/KqRlAhHCQqSRr37IXz0SDz+XU/JgOiYXWAAgbyqrUNse09RIPXGVrpGgtQWkyCaEFZFxdHwha/yj10222HGVayfknh1LrqOB90ijpVyd3tCtxd+e7Y36G/5/EasE/rAp1IG40P0EgT6mNzc3a9jkACSVRX4qfRHOe+MVa6TFOIiNw0vRFirySoDWGw1KRMItZUglQSQB/cKlECsPGEKBJ5muSQG/2eUmYaPlp7u8W0CLTxgGghUYzgzJiwmRCJsgltQZCL6xEhHmgAC+Nj0Mf3h5AAZKKx7xkcC4KGTAmHiBwBiqWIACYyN70NrONHZihQI6QgmcKpMAJBmfU0Ee3dOEUCqaqqEw0FTpRgRBT00BAFXPB9GhEuuIogobpcCRee1QxlIA+NHYPLPPfayd3YV6fL1v1v+UXaeJl5wC0RRI5CKBQtkSVLukUZZT0Tjz+ZL2Mu9pe/OWtTVusEveMVzr1q1K9rqQoCwWwCQZwSQhFAgtCKNMq03V4o0AkagCKR0eQ1maocFygIEyNbhQ0W5IWJZhhLEgxdtK0UqJHSn3BWeUPjbq/k9HTvD2e1QN0/BOnak8HLDlkq5PZ3h5atne3uDLQMLX8c6MbG3O3cCrtgERY4QQG4v3Nyd8uy9LhVIVmtUUFxKF8+yYucQhAYfKagKY1l5zUilaFKiFPlh0i1cvREMYfeqA2eeJ/cWbuduX/k3ACQrM7A0CgT3t3ceLe4VIMHxsS7QH1WMH5tORYHAYKepIr9tzfMMIHCGxi/w0CkLKx2YvFg4Abh5fDKQBgFCnX8zFrTxLRDCyt9pZI+r7S4BBADACeJjAIGxTZ9NePMBZOxVGhQITHYHj7uqWiaW8Xbw6oiTE+s/KH9XhQ68corbFhUyLPqyQYvqUAPMI0wHOhhAzGUHq+jPduJORFggCQIIFyHcEElSVCtBxxEgCSBOYiM+MlG6NAXzwPifoq2trudYab7BM3aF7EjCpgIJGCAoQOKQgwUASQhoqLRIXgEidEgkEh8ZLWHQs336XwiQrUNbeg+kPp8KOawdjS4L0GtVzUzytsJyp7CcsKIiFJ5ZGMrruzr806uxkFvtXuS2UOQeOpMglJPFABJbHIJu6W0Dc78jC8RAgSgihF939/evXt1dOMd+clGtQGSfKjlRSh+isjapuofweR5WqwYjxBJxs05dO1IpbinZXDxNCwBi+IHC7L33aGeHnqWV4+NNpdYSYQC5vkeAmHvOjb1EfkCEfhMKw7kCSXdMFpkJZffPQ1sn6p/o2/ShAsGHBibPFR4k0jw1KRQIuS9koiNA+t4+L9HcNvFJByoQp88JWCMFAlY1AESfyGm3Q29gVCBVVRnQIDA83cTBiN+frkhQqR1soGJBJ5/q4eRM0aDFwh8kr9O6QvQGdgl0MYAc4GE3H3keRqLrOQIkybN6yUEnFQIgwQ33mQJhP/xSMdpcduova6+RDQomuPPxXC9AokAQl6uVknh/pBxenoWF9SA4xp2b6jkAidCRSOR+kVYRbxmSm/0m/MFh0h55evDWFxIjahtdShFPRa4AQfEBzbDABDkaCq9+nves7Q0uzsQ6C9NDnb8LhkjKvRWbWWlvaw/2Bs8scw+9QOP3YzLDC8rQO/vn8rMsF24nF4e30UTnENHhgMe0ZOxKWiBKFMtqVfMirw3SxPN+6f5N5ao78piZdfvN3+4Z5rnY/fce7OxkFc4JBaLczG7vPFnx7/Fd0nd58CVXICZACE/lBYBcG28u+O50tDAMpHEILJ5obSZFgRQGSJl/ahAUCHYyER4IA0gGcof3ozk15BczgFAQi3JwfTY0dj6+3OfIAYjj1MVBBhCIYGUYSkGFmKj3Cf+ObCYlgKVqmOVUhbF4gpXTqREd/EYaNuVikgm8iA8oLwwEuoqMtD1YtEZhZNO6zMIizZFQISQpDmEaFh1ASyT6EH74pQKI9+5jAIhLVfXRKk2PpIYgLrYBP1pfwzDbn7EIBHqtqGNYCQEUJYQV0QqQX+KPf99eylf65vKF4++D/MijQPIgRFWTrkxGr9W2U6yo0BBEmCAwEgR2O39z4dJsHlFl9p+fCyt9FAvFsLqlsw6Dclf/6fW3BXvPTi9LD90IId3HRHyMADKzuLuEC7N9aG54O5tVzsqixkMYGHWVdVaVI2LlY0MUGSJwU45/Z5CHJUsGxYOx3gTvTnswDWrFUGF725fQQ89q8FGpLgoBgMzu8exr77sMFghMRM84MYuX+FHtYwCZKPwCOtoAAz5iB14oo9eXDowUAchTAgjNkuIeCDZVTHddeft5tgwgMDYW6eGTMSwbVtd/fK4nFyDeUyNdoEAYQqCjSg3GsZQidigLcWJ+gDiEdYOSHJjmBT3EMpBjlYZUK7wFvb7Yltbql7TNlrZhiYqIZzF+pBsYQE63H+Ch+O/r6JW1qARGMimVSGJdihHhgyTXxTEgSSJSitl9ym/D/MPoa7UAIYQk8UIMUQpBXBsMH4wfrzEHK0pVhKQ5EpwduPdCp0AiSgoWTALpaynlS/108dOP3kdOHObVIMX0h9LzvTa3Ey8XIbkKBNq5067ng/DqdJ4wvmPg1mq4s7uA65FyH6ELXqUoghW6vXDT3NwS7B26+k2s041TRFLGAuaY0CJQht7/9a1dZkg7pgVA4PRcl1W7GlZePajlgqSGHEerKfAw4IemEkQ0ji9vkvlcMI92xTCk6e1d4jopV4FkJUB+mN3j2dd++u+QhFUFISxTxkTDaaurTSbfy67PJgp/XHO0T8EQP4r1mIQDAh/zi82EsrdcGQxgFi/+l3hjE1sqpgev7IctOEoAIQ3CqwC5AhnPdaodzaMEkJpMhj2bKirbwBdC8c8VFx2YQaMULdo6EN1qkD2znJqLyam1VWpqoEHWq8GLpT0d/J8sx93HuggWSg31rghmUY4WgYRtEQaQ3pJxzdvzjzUOEKXsI8c+FwpkAyRI1BWVESwRslJxpFFRIGsvXqy90MqQ/0Ti96dKOuHL/PT6Nyd+jdlXW9DRRJWFVa8g5HCOgc47KuZLvPIYKBAwQWAdPRr+YmEo95vyn5mbCXmUObbH8jRvT6lH3EK+lacztnx+oMzbEjx7/tIXIY/boOu7ktsrStOZBumP3bi+yxeXAyRbKXq1SwXC8VGnj0aVK/1INH0VNb5G3l6K+hJydS0IKhDDPM7moR90ABFGioxgMYAsndnjO8pMACEFws5t4ILAcHMY7FQEIGZvEKbAMm5AIpYtLfhhA4CcLggQBwyiQmyoY1iMIOnA4NQ+VEbZsTm7jeND5GEBQDrGxoP23PAgB0gGp5NkqtjTYi9INZQL5tjnmh4l5LkXRIilQZ3IqxSWqMNhTIL8KsAA4j/gQ9HlvXs/spHQAoQn9HIbncCR4OokSTIFABIvUeMoOsed/p7xw6WxQORKauJYUYpgbbRGo5Fn0MYkSgEs8NAjaKQLnvDWWDoXBAtEfonEJ8dL23yzeXr5xPH3DOSGQUYWNs6isVLqboq1BlOl3DKIhVyp9YQ++vZWuz5GYG8/v4oKIpUyGF+Lx+UVLiZAZuZO+hlAev/45Wos1J3vsSmt/86rCtlef+zSbkfzEUBIf2Q1aVhYk96ErseHOXUdGiJYFXToerWrex3mIUhTHc4TxKmHO8M/zRoCxH/+yY6OH7IvFzfWt7eHl/b6kcQxfo0rkIwFOtdCOi8W06FbUPjt2dxzpeMleehpaReYYKhgR5GhglAojgBB1WFBgEApIQJkH86ijrsjHVhGCLWNJjpb23DUbtfYRLs518wZ/YQBpCGTEVGnDOKhutqZUzFOZeUW6h5sWP+hybKSsSve/R06++JEdDRE0IpPv3oVmLzccwCQ4p8N/PMPI88TMmYl/9DEsWTsiv4STZD1aPxOCYOEA9/deY0AcbUWXi78AoKAhf4MqggpgCVamfCakIQqFUvT052OMoBcPO0t6UvtPbN04jhIkPqcCBYeqzduqwh3qCi+3NSTFyJYHg/GsELhC3NDbWV2daak2XHyy09D3W53KmWgQFT2OPADUOPxdIZXF9u9ZkdL7x++mglteUQVSErzOJUC6VYNUu+/fevM7uhsdkz/NCw9dH0eL60PjWsD1cAQo0TIH1cJFyUPizKF6YRfZ62ssyqtrLI7f71hOEDR3HKVAPJf9s4upK00jeM2PRG0IIkgVhhZUshAkJGz3giDJJlAQ77WglS7sWmmpCUjTRRTlxZrR+kwtc620+7sDgxtpy50xtbdotstu7NbdjpdsCyVXgyz3vRqmTU0KBhJNOKFBPZ9nvd9z3lPzJfYzPbC58QkzRjrzOj5nf/z8X/Wa0UWVXOAoBMWAchO56QIQDyZlJ4qkBQ1ckfTJqgWRIsnjO3HESD0Qp9b8jbiVtrzx4v+aNtCo0yB6NJQdUnpyIkbLU3cZ18DQAzy9FnoL16xgjiqo+28jRQgkZhzO0CcsQFPpo0BBNckNumbTE1N9LRvXdMefN0HrAmBm3YJCFsKspbzEt7W8oUbDrf76O+GvLY9QJQuNbwYD6h9V4lFkR38hcQimxxMCJ9BADJTOYDIoW++RQVSBkKAIM2vml9tsR6scByn0ANxPj8YV2nCvbGWVTVCZ9THx7993FtZZwCj68GxIzSHhZtAGlR4tBYZR6d7C+tbasoKM/NUtLRYyEPLIV/31O3TRs3yM6P9AthgUWGRZ/85wwd9yhQI4Yfv81u/cRol2XnmIXm7xSy8O8m5wXiS7BGWUIEEOXFx6oKzzHoZKJBNBhBuFVK9zaGkWpkQ7IDqRY4C0ewYpFpEqZSos4V5l1HxQcLa7OazG+8XLmh9tZBXgXCC7EOA/LhDTSvJABBY54QKRK9rImd08OlIQbKnRFepA3plofixYuVLpcCE0AoAKT4gS674PejFiwPoAC0UICspch1+bfdnUSP2F0M5H1vErIoCSQFAHFX5AdLOAEJFiAlsTchjxu32CLHm8biLhue6233d44Z7fmNx3QMHu7k99I/XlRiODDqMe4Ao+QPrfTEeXlriCoPCIiH0YzF0aCQIiSVQIE+PV2wbiD167x9b2F11uKwAK96tMEwRwhDIclxp4AWOsJ4sWgvho4RCPov5YE1Xcr07XIjZHlzqOkK5Ud+Q68pLNUhrAf2hLaOb+faP/AoE71GC1Fg6j3TP3nfaRILI3q9m+1fN5oItVEmEB9UQiJCDFhAgl26POY0G2Tv2p6+7O81MgSQFF3gNPnqENFZP58XZsvuRZAqQ2nW1CUtNQvG1HuSFbEe2trojKwyW877f9VwqZNF4tyPb0QHbbWEAHXaBZOEDDtiFq4yS02LGenZjY/PJ44IpWsl541/bFEi1UoWBoUacI7HtdKEtUyBQFcYaiKpABkoljJ2Do55UnboHBPVHIwDkZAnHCGdsdC2lp6VzPVrHQzILFi55Itfk13DlBNtAYLbRCv1OXIHUgT1LJI/PvMHFANIO8DDBd2ICVxOdLpM5evLswMCoJgbggCCP6h/yxmjOW0lcZY8R+oHvhpevDkblvTnC0j+wUbDiXVoU8lOaeZC40N2raBE6hx6Yf1q5KpMrdi+8RXtzuQRp1syDbFMguIwQBUhgmRphBWgHFjyysrpGhajpKwTI/Eio0j8wxvu/P/aL91pbUX6IBBHzVwJE6vfzHbi0CkKbq1RKwP5BVi7XMMTMAdJS07Lq6z42ccFFCMJPfVWOsYlzPguvcOSpYQjq4SBmsIAfvv6pm1ccRqOt9+4fP/FZgD9CCUVESFLbjgVj6L6LH02WS2dIYdERb7wJduu09Qp3m9dmhdggZ3uIzY0N/kR5SiO7ns2NDXooN+WgAfqh8DYoqSo48QQAgnsTNRmsauQQ2MXDHMkOr2FxFhABAsxoTGMNRA/n0MzRgViJy7Xg4AD14iUaRMlgQZ5/rdRSQdcgBQgamEAKS5+maoQAJLZ7gMh+AhAsgaxY61QFQp5lTo5E5TzAQYCYqPww6akAIQRJpYYjv/70VDQUCoZCIb8/Sg64yx/H+UFv9EU/eXNO+CH4e0jEyEHCvydAyghH7DuNjwkbSE+oaayEipM4d1vE5+H5EX+FkoSSwf/4z1skCEEO0BoHzWYVQcirZhxDHw+wKXSODCZAtARZXhaECAXIzOswjSsRkxMCQOo5QFoLN/MiQIAjb4MEUQFC01SMHcn8ygSLIJDE6ro08SuvTMvBUpVkDN6cJQriYLLwICDXJiw1ZQaAdJ27dfkMAYj9ysO/X8QeXlqDT2rSX2r+C+HB/uEJ39SNcl0FJZ7CWlcFCNv8xPytqt+pJvx4RqMPDrjlxCbc6LEttn+2Jjb6CHL6Njef/SdkKwiQlxOPmAKprdbmsJSlIBt9C/d3eEmCs4AZKgb0WANBL3dyZs+U2gkFC6ApQFaURSBMgXjOxooaf0uhweG1FFY9UIHAX4nn7ozbMxLb/WnUdvwqdcJaoaM/lKQVAAAgAElEQVSEVlYDsa4RgOSxCaYKpM3E+EE+2oAfIImGR0756b+LZNBYQUmGKoPBQF400DCqYcAbew4hVbHfBXwPvEn4bBmMCmXZZpONewKkdDiv3QvHE9pB9MSi6qao1DwSfLBwkZqaLIYDMyOvY8Yof2YNpgi3sDX3wOEDYr28YCH9MBEg87hKihEDqiDwEI+rBIm/mxCNeRU5EgiMPz1V+a7vyS/+3fVeAyFIg6pAGjQSpDWnArKqSpH9LVpQJJEdyXwIQQHSYkHgHCIa5NLtMReRV5IEv2D29z+62E2nOAqPDya5CoH+KzMhSOex2dtjvQCQsb98og6BJLd1/aoFEIIQM62hn+gv18dErYFgIyxPDLHhczb8Qfjx6K937v/w4MGDO7kxQW5z5JjAe3LcuTM3d6eMmCOfNzf3HGNhYeH587kf/2s3FpRNsDUxtwai1FwoQDYJQHZckoSJPjiJpxtT6RTw42dcgYyW+m0LQa+slQ0PYhoLLvRTAJDp4hY9/qHhjDWVXtFB5YPamcBZuw36t3Y9KyxV2U9Bdd/KUmvUaB5EiHXNPTAUkgookDZTW7oN6h9N6XQbEIQ8ZoZHojt2T5IkTReilPvtCeTiTAI6SXv8KCPAyz2+uKTyQ0WGKkQYThJqNxb5NAKQoUp58Rrt12Ygg7XVjPw4AHfN2/kRVvABvb7NW+O0B+vdeIJ27rIZQpEfEAmFH8tMiyzHx+e/8Ve+58LxIQEIQEIFSL1qx6uZB0FurApFdAEgZg0zxKdMoiA+LJYaM5i9H+r0dU/dGHMaJbguMxi80MNrMedx383nY0JL7ZZDvnO3Hl7xEoA47v4NbEySvAafVL8Or6PnTCj+3NzZX66PiQIQtaLB+3FVB8Xq9ey5G6ftNrvD4XCScNBHV9DrIoc35CURCoXYE1fQFQw6g/hZdrypYcePl+xwBINBl/c0xPunQ0G7bCx0ESoZXn6vKJA8CEGMbPZ9/8NOkz1YLYDxQT2abUAfrw46WIkCKbrSA76naORoyorqo64uZeUAabRmPJHp4lfT0RECEB1dJqVjflh6EzmBrw2fj+4eII7BiBsViI56PFopQOrqACB5LixYDQTm+YjqINxAgDS1t7dnhs/vGRy+UUV0AMiiJhLamnlcHE0XU13h8MyQs0L/M+XeF+PQg9W89Qq7sIgGOVCsgr4EEAlvEQEyD6tAEhQaAVAfggBhSFFzWOqakEBg5tpPsGBYnpzrPsLK4vUNBVfa4qwhiI96xpD9wiwITpvXcPWRzKGJWVtabyFBTv5dv5z6cswLutwmyx/cvIRNVCANkgcLDYKoTbzQxWtZJQy6e8XrlG29l3/b77PQ7l58d09SXKGepLtvVQFCa+iflb/p0fgBA4hqcIuWVfuUDbXvZDcWJrwyZCT4NaZELyWZxzVePLJUBaiufFeeymtSlfhFDHhn4F+tYI518vkjWgPRfJvVoiX85rOJD3ea7IHd5HSR4EojHrq39HQf4cmrwRKqne/cYOukdFyBZI5+HC16OW0A9KR0KbQxYRzRp00mfdpNTti7B4hzCAECC0p0uKfESpfTEgUSGXIWBkh7GmZBmogsggnAJhNVIIa90/abE8ZJ8HJX7dsFAxPxVTr7kYiLL4YDTz+tUNJHsse+C4dBf7za4gIENUih9BUApBmd3MepAtEiIy5ChAiQhMabFyvu45GY/Sf4yQzOfX7k7XqQGQ0F7NxbKT2wAWs1Z7Ut1tHNZrMoPsw8jZVnQQhYLbbUWDo7fV3Hpr68DEbsLof9wq1+HzTxcnlRgCGs/oEzhOAMf+uffzjT65QdV25/DQCh0yF8Sj2pzBvCkx5zT7IHd1CBJcrBZGf/7Bdl/9dFL6xcgOzTrATpyPYBQAyG/9vFqME4+SSbk8LKGVcEgHw2ucOva/ez1a8pXaMOTukEJG+hQ1Vm4HyJJKAtOsB2bgBAUkyBkLM0nHWLV52mI55Mivy1ggJZAW/3DFEgu96JIVUFh866UzyBtVKH3lM6/NY8kcE85xCJA4QrEH26zUQTeZ6Pp/dK229QyCpAEmIOS11PiCXzeII58woKJEAAYq/UeRamCMP/Y+/sQptK0ziumRNhG7YkhZIIhqGFLERpCe2FIKWJhYb0wxSkzWjNdkqVKrUJtg4rjq2DMlO/uuw6O7AOqw7rMLazMo6Kdl2r7i46ogzs7Iw3u+BVw5QsJJC0Cb1IC/s+z/O+55wkJ0lDm9aLntZ+R2vpOb/zfz7+fysO8RpQgWiWsNJ66hBm+99XY0JxzIZyHaKKpc4K8T8+fmAtfjFd185QDSvPUZsnWEokRpH4iPKlwawjzSLLXl3d3t61970ffnfnziMGgcsj7ViCogErVSnLpoAkquYHuJh0fXb2k3MD3R6n58ZfRgK8hOWLWixim52DiHGDwQPp4gN+wFfZvYGzo8v/6YIb70IyY5dDLUHqGUBePCup7UzhJt2PDCDz8+mxV7I5I36/8wvP/1jsXEYT7AJihK0+YqYk23e3gSaItQRP5L9dM7omgwgfBEhMbqQ3zoFhYYGOIwDEDAIEpoYxUwpb9wwg422rAJCLDCDkEQxsAwUS4wC5pOWxYnQLBVLHyCEUSFV8Z12iZTWmwjaO1bvVH7zJASJbKc5mSBAKCJnlKJGPsH/60sFSDWH1TT1OpQwGXDBvhtcGZEmOMayf0eTdCmvo5OSemx1KCUsABNTI/9CVZS0A4rz1YN/u2nRYVBY2NFG5uqPVFdglRokj4klrpxAdTXYwgHgZAa4sPX/9w9X79z8HI100smLXfFs0Y/Mc3RPxbZ/MDxsEgXz1+UcDkEV46P6f+RYh6IyoRewaQjyhjx7gs0d9QBHiB3s3cGa5a+ioQLovP19Iqi7Mm2kJUKVAypL3Xh5yreOJYxS57RmhJYQP/GbL5pO5x4BzAuQgB0hEh/yI6N7dxgFyOr8fIl11ycxdWUY3m8sZQAqk0krOyWEECHtIhIkfPojFbvwTrcEhj3Hlp/PFXgYQHa+u8U0VBEinlt+UZGwaOt2ZqKuqitfV8R6IHowV43W42LhRw3p7jqZJCANR0KBND8gilEUK50y/f2zqQIluBpywRZiyGgyMG1DDshqshma+E5KlQ6zo+D4TTvW/efNGOLmHKBBEmyHKPjrfU/f7X/19cC0qWJscaIdVUTgJRMuUl1zdBUGQImIZJNdWOo5jVdvttZXb65cWjhy59+LMg0A754eFW+6qmuDKFBYKDL6tHvV2jTz8YACjpN7/9kIXt9ESlSufmOYlFeIjhMhfYfMGHhRzJTW2USLhlrQ4qTQ3xC1L914edm9av3aq0T3xXK1AVNYpwhy+bH7pyWixi7awC4h2Vjpwn6UKFhaUYi2XhvIDxOQZD2KclBlIwINtwcgEVhA9BbRLb2sCgIUr7OzxABAY5U10Dg+tfLsW0z1iWL2CF408rMQMG44nBpxa3xCYKdZV7cQx3q0whUXrhLgZv7Ge8fYcRvfkXf/M7Kxq3UMEfmTO9ap76Pief+zEQIkA4pm8288EiAG5AfrDCgjBVRBrrmnefl7BkjdAQrvSGuhpPRFRuqJ2SIgBZKpvLaa+JdMo2GFVyNiA8d3KQtKjIkuCkGU7R4hNS4DwZrqd8cNu99prK/bU19RcWVpI1nR5vWiDhVd7yopCiETVHog4jRsVZSymXy5cPdzWxgjiOfzpSIedOh12n0/0ULj4IJqQCFE6It7AF8XEYhg9lIkuz+82iDRaBSBlS09+71lHgEiU2y5LkHSAbOYAeTlapEqSPMeDLQAQ2YoEFQiaUl064CxwmR4/CRUsiEGn6FiyUmyMtZ7Ov4Joco/jorg5Ug5FLL0ZFEgEGg8MIJMrvrGSTH1HASARXsIq51El8J31anqsGJ0EkKr4TiY8wBYsrtdDK4QBpGAw/MaxludB3/hdf0gGhroDQiWt2SxNgp8LowIZL5F3lGn/36YRIND7sOIfQgkZY6XVssRHECAwg5XZNNfWICGlfgX88H9zbG2s/01tt77bu7sid7dDFhsKNtgblWpDE8KHRck+t+XwxIIKFszzVtura7cvMoAs1Vyp2Rf4td1m4xLCpjYjUVeyYLaK5quoBRJ4eL/b7enuHhj44DY3gidW8KKVhV74hAShz1l4C2TkfE8RvynGpoknYMdLC4SqfEHFSBF9qg6t46A+z22flwtt6WbwWzhArhd7h9V3PJhABQKDvNiTYPxg7yFAHAXOmhMAEHMcndK5m4k5Bk5YBVJpmXYBG3god+HlnQDCXjEFcnTlfh4S4gDUFDoFx0RWe3njXOuwJg6MDnhEvAokCKx/oASBCpY50dJ5Yv+GxeHbo0D6xqf98qBuWCgQfJu9NyM+kg2QUL//8XiJ2gamyal/QgGLz14Z8AmeBTys2eYm1n7/qzdvKAlkVwGChLhGmYWB3xBUsMamDqzJb6VkdN96sZcP8nIJUlmbJjgqsuNuKyrVALHZZA0SpZHebAViEwshoD+qq+3eXy3W1NTX12ypWezwVu/YwRUIdbnF6oZNsS+xCBBQFro3MHL1hsflbhs499GXX0ELnXteRWWRIvsu4rNPmJxAA8XbdfvLYpLBob8AY1iiq6DE2MpxHgCQ86Om9SuGS+9jnyafAplP3nvZU6yTCXQLGhtVAkSn2woKJDbXWsAPcZMDQptiPLpVxEmRlWL+HXaJoacTHmmG/jaABLroukiM3fAzgKz4HJdcg0EASEQnFkEIb7gir1mQMpr6CCBQwaIalp4AEktot903jnUCyODUdD8HSFgpYhE95JLWjMaBACnN5oTRNX4TBEgz4cNgpSksekKKWJutancT9iLMBAgCZFcoHz5maDiL+ysygQXvsOPx92s002N0TpzZyx151Zm2KgWSnZZOZibviGxbG6oPBSQ5+h820QGp9np3QwGLHfWL29u97DM0gBXFuauMIV6VGXuUuuo+X3vg4T/ONTkYQL7+5OxvvD47L1vJuBC6Iyq3PiycTNCA7/riw2LOeaNDBRC4nW/AHKkGuYqFTrlHXk+41q+WYRo9f2QhKXogJEA2b84EyLOe4hAnQbdgrhEVCCbwscv4tsi2rcsDyBCauWNQBm9TE0BaegvEmjP0MIBg5jj23nn7Ps4u150fr3ztQnIPBTtjONulg+Fk0QMpn5vr/IPm8Dz+HBLAjip4EcFEEGih18ViLUd/6964cL81x+RTjCMEYqDowCfCBr2pfYTRzH2yNO0sR9v30ylsgXBiGJpTBisniFUQhF5xERJutqZeQQUrtGs5CkQIEAAIzPCy/8qatNDh3PjxwXt7disuWLXaZu4VufsipEEouTYK4efZhoryAK+N4YMBpB34AQip31Nrt3P5AgyxqLrh/MJvs0TF+jlvhfi8XSN/vdHtYgA59+hPtwNeH7XglQaITA8LzfaK6V74J+zeQOByUbl8RhMs6c3L2+dKnG0DAYWymp7fWsdBXg4QSkzU0B8NCJBr/yn2V39QAATKTxE+xgs99LnOAoa6DCBHZYBgCQsaIbpGBEheExQJ0RPTw2p4hGkQ9qgIjGPFY7FE78VVMIiDrQ6cB4hQV4Zn7jbOtXR+rDmUK4GtV4JLEAqKwhksTJodPt6zumfkxmb7SopFCJAwtDvC1C+XSaJK/sgGSBgBUppbwKYDT6mFbjCkYIYXx3ipIQJvNvNmuqAIb6H3v4IZLN4953JjJlN/pBWxuABhEmT61OCa3cxeP/8ZAET2L6ksPMab9iU73hEaRJ7kzX2A/mD86FisoaN+e7VdVL/I50rpdSuRHjbFxMQC87jewO37X7c5IYrw31dHArSEGFVYwXshFtVf5iO80ATwyK2ipKpkvP7s3gJdmDdTBogaIRj+MZ9MLjw7vH7FcOEYLEuQLSqIQLENAPJdsQDBbsEcuFmRAMGDSZBIJNFSyFB3k3OcASQCAd96PWoPrGQ1xhAgeR/qPMgeWa7HrXVKncWLPQAkuAoOo8a2Y8HWBC6463R6rJFhdY19Zye1U3ph9RABArO7jB2ROHk71iHTTvWt3skqkXdB2rFpwwVr2T8+x+RN/898MpdExww+iy6IqGVpVLD6S3TbLkm4RWj4JTKDxq8MsiGWgdoiONUrnlGGQJgtbBHy8SoVNfxp+CCq4MeYBIF9Q7/ff3PIs2Y/8+tf/rSvQx0FUlmbkUaYW32gj69qEgvTzzPcsNL5ASNY3g5ewGICZDcABEeAxQt6zbsYNiVkkHcwQIAELnx655zb4WgaePSvh7BEIjfILYonr7ohYhHtecyhCtyecBiLOql7Lj9ZoChCrkAaFHxgGYshJLnw+nLPup3ojgkBkPmyDIDAzgoApCz54lqRkxmSSwCEHxF43sbkAAAkv96XnMeGW2MRHvOqAIQpkOFTecWL5AKrqnI9hk+RcEGExWEAeBVu9437j52ci+u34jQy+0di5WbeQ5/r1U7plWCcGRWIkCC4BQISBPv6rlW71khptr3CsXcDIMs9nOOP/aImpVIdHBz4AS2CwGZI/1hwshQrPZJjcIpXsKyp5lQzVyDNXIE0i610vlzINUiKtghBVyAXMpbRZ7I1CH3lLHtI/9jTVfuVXIa++vAnaIJU8spVpdwDqU3nR0VmUEgt1x8MIFyDWH4RteXXIPZq8DHZIwTIYocXLBaJPygQLAIfFqUhErUpPoo+H0iIh9/e6G76P3tnG9JWlsbx1U0CKkiuENLCSmmXFLJSudt+K5LcBibExFoY0jurpk6pkpX6QlSopC8uU9yxje3OWBeEYZ2FLdsXhN3WYbqs1d1hW2bdKTMtlH4Y6IfFgZCBpMSYEFgb2PM855x7b1JzTZrqJ881tzFKmqbJ+eX/vPwfUXRP3vvm6klyFzK3wVLRQcNfMhc25CY7B8jFy5fKekMSgMwuYwjrkMmk4YaphV1voRpkoewqWZphkdxulyQ585ekLPDxFrZySRHnn2dx6NUmreiKAikfIJAtSCV5EwdkDAg/yFYb37qBzgBG8EnIMuQDJAkA0e/lcDGA0AqpeloBDFNBkqnxUOUJB2FglABkDQFCH1g9L8Iaigxs/gpwDU+1piGDDuVXRqZADgNB0t6hkO9d7DsGsyCKTpfbgwtsN31g9eMhL45dI/dS30zSk6WAtoKXJ0F4DmS12IqRbbf/jrgNABFcdzCFThTIextcf2woWfQ67m3SqEKE6I+6wMuXL/8XVCpzjxbamaxqYlcKQQhqVokCWXrQvWMRLIOz9xEFiKYLvfkNG/cCY0WWL2lWukFUCaLDD+xB1wSwNABJ8FrgPShIuB0JGzFl05T2EgFy7vK9SZ8kiO67926cOyHLdp770CyZfytToNhkrkBOfnSzvDAI2T7Or2RoDqRFCV2pESzcrNfXM5nlm73lvtENguv8za+2WJ/OXvrcpf/ads7zeYTrBT6K2Ij+lgAx+xAgcdZFTttBCELi8bR3Zli3ntZgpkbwGMHShLCwVnbUpY8tQA+t3cJuceQHlACD00jl5e1C14VwGmqpaBKdK5BqAEgxjxVn15Q3jTVYOBTdeJg2ooO/e2s40iW8gxYgUfJ1nJ3sWfwW1nU4ffHs2bNvFxfvnvXsNruX+F/rfvIwwMuvYppKXiZHijAE6nwDwY8nBrYFIJ3X7gdZDr2OKRCmOxRfd95TqHaobwBAAqs/0hFSqom7Ng+yqkEIzX+wGqxb16QdfM67H33w/sFNpki9OeNW88Pm5ma88DSIkgdJ6ESwapoOHGhuO8Ez6IeOHG9rt9vsdOiUpqEdE+pqGMrGGgnh+i/32NoG//IVeU8RgHgW/3p1sM0u222aNg+14VzO+9aOEsRubxv843lXmQBxdj7qW183VbUUzDA31SrzNogCyfY9nS03C2f2nH+6AEOjFnRWX9/juV7d8KxBmvsaeh1VIxOlA4TOv6p6K4AInaEhLwJECWIlsX87mfbPbGEiKHqmCEAgwQCFvNX1HCBJAIj+67sbAMJ/3YE5bpiKbgSAvIOZo+LwBAxc37+GALGiAsFMeso/dL0IQETfmL8Vs+hGLMECb2AiP2Ameto7EZKEiqNMgrtrNBKJ/BvWDJy+/x6+yIpcP+vaBUhpH8c8TwJBOgyE5kBWCxVI0Sw6AkTYhudZ7HrwLw0/EB/0wr9YOS/W79ZRgxPsIqQZEFZfVdTHhCY/ooo6CQQePthkqub2Pengp3iQNYFYVExY2LEpQhg+mhk/VA2SsCWK4aMJEyDNx44fOcIIAgJEttNBhTWqHwoKEaXtHN2wuFUvuZxq++jybyc7PS5R6rz3zTlMgciKEa8qOxJ71CpePBNUkfOBtsErveU+vaJnbiG3XluliI8WU9UhFtCiDifkRCTIwtxZqazPooL4608eZ7PZTBaWOvCWjsHtw1vgJ4//q+8+b3bNLWQytYr+qNK0EKoAWXhUprIVzo6GUwQCGEiiMiSO02mT6fCEfp2HQaQ+vvWYQ2dVWFYaKJrRB4jQDU4jCBDWpOGIO8BLMZnyT72Drj0nBYhxDVUNzklMcoAUG/MuuK6NtCpJEAhhQU0v7SZMjYz5nJUCxOwcGBsPh8N+XF6/FxZcDYf7/94h7YawSnujnnkRCCjTpFjGg9dhKUJk8xVc2h6AOEP/3NhoZARprOPVvNpDKcRi8SwCEewi/DHwAwWIhiAoQVY12Q+l/irKFcjDJ2d2sqFAnP+StxJqg1UWKkEs+bc2qyEu5AfkQPALNEhC9eXlFu5N2gRIU3t727Hjr4/wABYIEDsr41X9UGRmiMVTIQnmpogpEWgiBBvFTp/b6bn73Y3BwVOQQ5d5pAoHpiscovTA9AoRIHLCXmM/0HZxurvcl4lZmn9O9ueqlhbFxoSxQ534V7uey2SXyX2X/l43kA+288tQfkujTzl+wP3CkHV0kM/kstnn8/r1IYIbAKIYYWnqd1nWhpbxrvSWt/0KXQQgKYfDQaf3YcMd2dGN1Y50ODKg/w+VBpgRPMSirMytENIaBCDXdR+GcAa0S711n3UfJN0pQcBuPdnqH3sHpdLO0EwrBUgcB5SgCoF/YMrf3+MpxkMwCF4zgotJHMJYxv2MJkSC+C/0uCsFiOi5NhT2tvKVhEuKnLze3/WP+sRdgJQWjx94EQwqviVYgxVlX1SBFGsFia0Gg0uR7QCI4AYj3o06XsfLEFK4GrESC1MidBbhf+goqaOYG6d8iBbU8CrhLPyNKAtmBQJLd3bUnk28feVXJxoaLHQoSINSqAv0aLDo1PRqIlhqLRbjR0IdAoLxKUKPJkigAz80AqQdQlh2ih7F0hcbC20cHzQLzuNYMAvqM+CHzy11Lv7h6mD7KRnQwEuv7Eohl3rA3SZkBFUNtKHPlh8FEW4/7cuwznMTP0waBQIxLAhiLd8uwxnJLHTPrmRxDBQLPNGKKW6w1ULpBLGx21vFi+ZyGSV+pe3/oIqJNhL2Lc+WVd1nELsi/pQjWa/woxrGiANAWsORgS3yRsPjaKVYbaQAQSteBIh/IqQLEOcZnFgOugUUD5tHhQA5PVZ5r7BZCo0gQIww3h3/EisOB3EAQIrl6AUYkhjfC03otBALewrBT3EtCXNwK01zu4en/N4UkXuwYPgjvRCG+C9cd++6bZW2JAqQGHphcc0RjSqNhavFmgljsWBgKdKxDcUKUsc/aA0WlPFucF5AP4gqRWhHIb8OGZBG6oN1FIbZIiCQHlEgRpShQwMQgAuVIKs/BKAceTtyOcU3x0vTYIeFqCAAYS3mDRY4LOh61ZBXnaVpAIGjmf756hUlSKImr5KXTSu0EX7YKT/AwYQuIkAKFQjXIQAN7Cpk8MBruNoHr37Si3UqrsnvblxEJ3eZN6FTBWKzFRCE3EA4hXdsb//gyvnyP8QaLk0/ztVqsx+cHrkW1CG4c+dykAZxl3r3ZtE3u6xOGlHa/1SLRhP6NJKN/2bvFh8CfI9yquF8ngBhVcdQJwZ2K2W9tJw9E2QrZ9PDqdtH3FEfN1bDnqk/0uMnnp7xVJJ6IWoAUo8A6dF9ipw4yZABxKECBFoQxyr/bCW4ACD7jTDnneb3IY6FADnd31UMIIYzoXB6bS9THWCJZTxMryfBYGW4ssdldg5MhVtB7FmpYkshPqzkvr0jY127EawSV/fwC9ZGiHGsGNIixkqxeEch/EL+gY3ogaUvOrZhIpyn51ZQFSAqQlgqpC4/psVKeoPvEQHyMfIDpEWU0iOqrcNS+IG3R1kWHYoBli4M7OhkO7Nn/vfvH6TN6MgPJAgBBzheNbAQloUhxKIt8m0i5yasynql9oOwyVIMHDY2T4rwg2zex1gBLzahvz7BIlh2O29CVB21gCDUDJHV4SrDaM999qkLix3dv8EmEO7DmODjbjVtJcoh21GBJGzt7eem38YxzXN7OZfjxiWmFpM2lFXLEtW1KBZWZn2lbdIGp292JW9SFfgzqiaNEHbCeevZrV10nb0cIOjVladAeL88AUjf19Od5dDTGQKAQACLuhoSPQCd4SAjhkL6Iz3AhpEABOdAYaUTzvzDUid/RBcgBgkBwsQB5RaRPfVWsKoaq7zVS4AiLzSziq/FrWtWGPfOJl0RgBQtM/AMjxPs7IXB7FDEa9xP2wrX4mDJOzRamRG42DE2RPSHA6lhPUyOn5MLgCTtnxl2i7toKC0k3H3tfjBG2YGqAzrM+SmKpxg3ycoPYMViZOPdDoAYOkbvb2zUaQJXWoSwPLrSls4a1DdglhQa8UZpG8hRlR5RJkHoV1S5DSVIFIp4b4V8O+oLbnaBHdbBBgYQdm4AMWJhB6vvtfxU2yTSpGRA8I9XtCGkRoEId+VtgoNg4lTbL17z6BUGsKgAsb0hQSAJYpP32NgB38p8TAhkQCadouT2+Dr/9LeLJ+2ykv/YU6A/tCEsG/wt8MheDf75rSyrxM9Xcplayo9D+fqDTxzHE3hizeLNIiMAACAASURBVH5Yyi4nuD6cXs4CPzTFU7UmjU88zsyF6q7lK1t1zxGA9GXW1QmEhTkQfGxYJ3azjCSCQQrNeBEgP3Pw0bRxGN5Xn/KO64/0IACJAEAghMWMTBAgkEM/Parv4+umwS8CkH2geag6AICkvDOhygtaRc/YaZoDgY5yIwIEZy4mUyMTHZKOLvKiIS8QBJsJaUIdh2t5J3renmwGA3lI/cCPlNVhpSuZotVr0JrS9X/2zjekrTQL4zVNAk2pJILYQosoKKSyEvTDwiBJDFSisemXjFs10wYtMagVa5aW1k6XLq06rWVrp1C2Wy2MbEcZZqcTZrptXdsdRgYdaO3gh3ZhF5aUCQ6kJSaKH9Is+57z/rn3mphotMKyXq1GM9WrndxfnvOc85wtLUj8bwPkEQHIPAUExQjHB8vH4nMhKxQIeCDvRYGoTZ1PJ/4jVa4kksQPKTkCFgibVT+02+umq6SouRHiKkPugwR5S69gSAj29HrdfU+abVv7azdBHBYHCF1/nreTkiOP1rHyRBFLXskqK5fxo4wNhKCXDr1YJbIoXqNx10fO+oPCPkeAVDudxcVUgiQVsfaKVCymQOiq25KG+vO3rzeZTBjE+8eHsAt9ryRAmAIRMkbMtcOqEPy6xfUnb/+kz+LxaHg1HFiO5Ug1LNbRq6tKaFkBSytSFf/QZjek/19RTeTHuYEp0B9aneCHTstXjuTgdDtEWJHLvm86Y/YjBYgyQZEiiJ8p2PGEIIHZy+0mvVovOwwGk8VqNaV8akEAEjFTE30/ecHtSxEsQ2VY6aHf0dJ7NhJhi6gwVpcNEkZdHn+7IQNAohEoYakK2cpycF5yYQzk003YHwsduYuoIsIUBIg4HDMhAFnVnTEcu0prWLR7t0JTAUvaNWHy44E08mffHqY3tXR3QPywGUpXoECw6gfdaxEiilod2wWsNV7J9C0PGEBkyoPfZn9C88FUmSbzXveX7wEgfIpwLYfo6o3HWRMv1KV4A1botQwiIVHBCr0WyoQFncw82OpMPvXI3ZsEIIqxc0mC5OelDDPhsYtlePstFrTesh2FDB60foXP/p3O8tLDRH6gAKnkLVhUgAA/jFIJSyJIA1MeIEIaUIBAC9ZXv6shALE3jd+/88nJYmkJOrZrsZF2+ipPSGGQKq6/ODqSlb57dWt6OSYzQcjFmtkf9Oqc0LHd44Qggdnr7TVpnjaqDRZ72+gcw8eKXev4Jasw/hAVyFIi8EVGYx4BotPmrEzgpdHBOfy7xJYJQf7eb8fxdnJYrLYae1P7+ONnz/othhTFHn8PAiRs3s89EJU511yQeaWHfkfnJdcibcLCnCnUEFjCcnkybGu2n+oCgBRpVIWFKrH0iVArilmHG32MWxqvunAMBJfTajAbEVMVI7U9V9KkPNoGL8AsehHygyoQmAohCsQM9vu1rEO6KD+QGWZawdJQfhCCRHt6G63baFjjhcww8mSCeiCpjY55hQqR3xead7u/9DdtPkCaBieSARJP1iCigoUEgSbeX2h7LpUgSn5wAfI6GFJ6IyE34eCjLZ8aGhm6eLg6b0VgO+FHNRAEFUjKaZByoUDesmEQrkLKdslS3cuKy8sJPpj8EA56NXXQkSDGJA+9oUSUsErYOltyy+g8f/t+u81ksjn6H39zA2IU9/LAXdrtSxdbceucvQGWGPGUIMk9O31nOjHsS0Ajb06V0vxgAgQ23uZgKFZiiYiQgdURYiBn3zY0PQXtV/xva3UKbx4mx9ECydHplgJzn2fih1pewlIcVdIZwreBKtbcncufjY/397e3948DOl68ePny5T/uJz+DVhvsZxAgueQFBQi5/odhtg8GMtKn7ej1uLSJLpEqEEvHCUlqXT2n0gOxpRsXUWkAIPvp9AlTIK7UWYfrO6w4VI71pzCCIKyB71WQS3TElTQN9BZMM9HAFDrYIBUY8gUCRAM5vp5Lp7KMcjXZuzvq6NwLUWrIkX0ID1AgdR3d2xtz1y7lECDzaJyLylUwKFDBSRISFS3pv3BP3Lvm2PTQMVPzg+/iq+mNZD+ETRvCGPqMO/gBFrCYByLnR4ioD/jDJYhsON3rftq95Zmur259e/RInnIOBLQH0gPKVpIuUQyDlNNXnm1Sxl9RhpTtApIQeOzMKy09CPyopPzAG+8OUnxQBQIzfvJZkBI5Pmg5iwAEYxTvPAaA1DSNP/vq4YfOBpFhgg4J/7slMnwIF6QEk3jvnsju16u3/jvgoy5IlTA/YGJDJ2kIWnjSJRJLvimKEMjBU8sKV3oDER/tvyX4wPB1XRI/cPCPYQA0CMFRxhYsWQkrSYLQCpZUIItB7vzc7I/PX754geQgx79+fDgXGE6xC9zkgDQSM/RAgQVSCF4EOuqZV3oYDGM9dbD1L6JiCSZYw8pFgKQPPVW3wCIqMN8BICoaV0VOIBKJYmjIRg8aa1WEaVb7FmjYI46kw4SjffUzMzgGz9YuEn5UQPGqghKERkySU3N5/M2WLNSR2uDovuDC5JbCAkpZWr3CHqw6z5nmbQd9zY9RS+e9Ca/kfdCq1TwvYfHboqIlPo0lrD4CkM1WIGpr9724UmmkViMSReI4BcIs9A+YA8KDsEKvFT287AV6e4NuLGl53RMPmrf8GYf14+/fHakuFSa6SDKh/MhPIT5k78t3sgrWihZfuAO6uvIAH+9Y+YpRpPJw/gqAyPHRwKpYcAPxgV295EPn6RvfjDfZTOQi/Pj5jfMEIGwTFZtff7OiECZHEhUg54ey7anX/zQ7tYRFLHmxSacVVSgttb0RAKBCJmdH207Ya6yQhYgHWv/Hz40OTPpw6jymk1WXdEoNwkyMqsRSYHokM/JMKTwQSYHodHzNFPggMNoeCPwwNzv7cHZ2dg6SUpZ9voH+FABpPOOJRvgYOgHIfjMQJAIA6U270oPIrLGuOvRAaKZVhGZhIUA60kYOqfUIkAVowirE/bkoQMKwL/Csv3nD6lxd03qhNgLgWAiHw1DBWqAKhDzd/zTdbiiDFWYJI9C9CzPoGtiTpWJhjOZoFG2QdUehEUh3d7hqo2YECEEIgWahMNJrPRvtD/7/Aoh1jAJEoGKe0USwRIiRkOSSUL8dAbLZCkR/DKYI18ANJUKwBwtWQ3EF8nql+wEB9EExC0LoEQoRgrjf517etLbi90dXAoROEeanDMQqX221lDRWyD4EflSj/hAFLCBJJYSYYGPULkjCSmWjcxkC73BhVAMIkIt3Put3AED6n2EPL7PQS/hbDguGjDdC2BgBLsb6rKYI2XHs1iTMhmtZZxOnh1apQNgBIyG+qemBodFz546fOHGcHB+3nbs+OjA7OQX4SMAlncaMxHRyD1024E5BNDdkW9O/YIICSYkPmQLh3yYWSyBElnyYwUWjUpYDQykAYmm86hFDIIVUgYQJP6Bik2EJBrnaeurI02rIzpJKWNAAXOu51Jl2XkvfeeZsJBLGLl7KD+6BEIA0bvwRfqybAAQ3QoUX9mE0u2pBRTueLl1L97s2dPq7CHp+TcQL2OcFFRFxcmbQIB2EIOt67BJBamnxd8AAIeu+gl9SIVoghNRR+JIt20G863Ks3UoFIpWtKC2E8hBVLTEH0nevddMBYmp50hdXDHywicJU3OAz6fHdbgIQyQGRra+FPl3ewUv4EfLidhAv3OHGOpa37+nY1genGWzDN48eBBckj3npbBSdFrDyZekm5Vx4SPJD1ta7giVIpNLSIwel+JJK5qDnO0uM1GIXCsSYhA98g029uGPwI+fpv1yGGEWTxTF+/6+fYAWLk4Mv/GDwMCpYwuYInfW/+X0WU4T86c3IdCCRiLFuKz6DzgZA6McSQKq0iQRcn6emJien2TE3NwnXbKAHxQ2THzGw4OUEYZvXyc2lJd/w8TWcMYR1gQdCRccqHojU7IU9vQlM3CJMBNjNDaVo3QC7OWoW+gMlCB7RjCs9DDWDFCAqnIxT4U4PIAlhz5X0I4iGzl4ofmHwCVMgkMAFAOnqbtyxYRO9xd+1SBRIxQJVIFSD0BJWb9r15noHQQ/66EVFC+B0axbopIoGEleida4ef/N69IJab7I1+7vIDxuJ8PbdAlQiKgbMrjPbDvp6rmP2sb+5f56X1a+CqapXCn6wYUMsYbXaNxkg6po26ME6tEdAY48MH/LZQj5pSO6N74nPzMz8Mk/1R0hKUaR9ukHewOtFhEBMSyjkJe/cRId4YYpw659yqC1ffHv0cDVUm2g3r1AgO5MkSH5SrqLoyVrBEAYQKkCk9t1KcryrxgasXUwccAUiHyhsUCLkDW6y/fOfiACpsZqsjsfPb5z+EKbQJYJQfAjjQ1G8MhpxCv3kzdHjWes7vW14chmUA9UGVVx/aKX6E0cIPvEnF+kEuUhDtcrnIzTBW4mE9ldwVw413OGiHtMpq1jCviCfgE3ra5l8wCysmEyAVDF85GhlRSwcOEHVk4Onp2PSJAbDKykufTKAID7QiyAKBOs16UuBJvsgNKbiIpAClQa2NmEubzham2mpoGmso3ZRrkDwKm2G3uFVsw7XDxD0QMIID+qDEIC4etNm/aptnVddi4vhon2aoiIwuSMFtEWgSJOLBKnrudK69iQbtcHiaO31kJ+1gE7rF4gpEHJDsxCpPdu7XcBaH0AGvyYACUq0UJLj5/kUBGE+OgXIZp9Qy6OvvQeE6NiTLEDiuxVkie/ZfWB3/MDMP/tAUMgVCNjmIZkC8SJK3EF8JfqDfCIIFvq9TVjZmcUP+vldBMhOaLxShCmmqGHlp9gYUp5U2fove2cb0laaxXGT5ga0RKIg2UCH0IUUbosS7NegMbAhb1oo0V2NY4MOWdGpaLpURlthwdXWKqUv4GyZdmCWbluGZbuzTJl26uwwdYvusGX7bT9HlAzEchMtfnAL+5zzvNwnMUadWPzijaRRQxKt3p//8z/nf+ooPqqbmppObuHHyTq1jQ2qO535LkgBFYIiRA2fv/OHyQ4AiLfv3xDk3ubk0Vesa1eO05ItEJhDJ88QPn9/1m/9+ZgdedGL6qFCisESrgU5JdfqAOETI0RcvH33lpBkjWYjymPmrIC1JukPigB6hY733OyuNvBVeb98SQCio4PfcMt9Yjwoiw8piglDCNsqwClywgxmae3J5mA1LDBB0G72mYpr92lYa65QBQKTIChA0kSBDMz4izuhDwcC6+kMBwhOiVfSEK3EPmzqrOqGrF8oQmUyit2ObbyIEPL4w33F7CaY94MdWRm8uy1jozla4qSfJS9wfLB9t8G8ID/60ZaHURSJHuRmpS2T0SJjQ6FDfuzlvzY0jWMgYuYjV4DkCg9dgbA5kInviALZXwfE9fGTH2iAe179ynJU0iS5n9zc3IwTAbKUZFMg3EZPLuniAzyPJWQHbzJLxlcIQg5gipB95y9f/+fZE9VQcGoCCUINdIwzOVKzfZ6iTJG6PCOEHieAH2wAROdHc41OC7Vc+Oj0bQtL2vCtXIUUrEcEIH5vox9isFoIhHhUIl8BIumOVckCWVVV8vZh+NKdyyXkmlb5v4RGrAoWXfLOTGNz9XHvd26zWQqywrvRoER90azgh5kRhKZo8foVPp6ZmuuYD+/fVckN4oJ731IbH9Dh1l+U22zOkzisBmdw8xQWBEiBb4x3aAz22VJwkOPYMdqG1ZCN3Cq+Ewr8dwIQIzv5w1UlzKQrBCBjPb7iLJxGgKA5QVdY0YeBobqhkvcRmqqwvziDfbwIEE1BImjk8YeLBr2YrJ6h0WBAg0VSNETLqNlw4S5tm8Ip+1tTUZ9rx2Yek7XK0z4zngisrxvxRSgKhwc8HGFJRgsSqXY4g76nX1AYushRHfKRTKUKKhB2AwDi2+fXg1OEH2zvfFiOygIEqIIISS0udiZXpAPKVdQzZwEmkBJJ8UHuGGefSS6lDmCKkP48fzT78jcnq7HgVE1DsGiSYp4CeXOkWjT6yuh4Qy66C3JK8tCbms5IBazTCJDmpl9KfFBzLqzgxJast9GoxV8AP9rCF2/+cbKPAMTn6fgCeniRHGzuPF+A5HQFr9KGr5bW+9dL0Xcm6+vP52H4T8Rf8TXplBW1ZnOt5KMbeDXLrIdd5Rz6vie2UURIBJY88rb3xYNd/jg06nHBBszTEkG80hSInmrirsW0X1ZrW9uYvzmyFSAmAEiW7ZSlBEEJAtPk44Oe4moteg02URkVdvZHHYEACY4VXSqI7gkAxE4BgofDiE1JsX3YPm5qRICkcZADe7EUDQFCztix6eK4NrlCADfNVo9TGtD8W0kVSL1CTvswZh8gImQm6tvhxG91ebt7RhMR8lga4YddcSgOARDQapUNgLOop+zQQd/LCbtdAkgePJL5siT/HwKQ6D4DxNXxIwTxspASBgxLYY5sHrVsEnxsEgXyQefiIq7Dkg++uh3br+D9FToJAh/FCMUkucQ7/zJ9MMGb/gcvzzbTnlsECGEHJijW5OwlpEGL1QUbsd7QWZA8utTUYH67LEBqTzfXqc5yxojycr2TF7fblrOPOHVXhE5wwBD6Fx0doVDI55t8fPNSaxtMp/O4K1bEklyP/HfII7R+/rvSfkR8Iwu9LPQWTQ7pj3qzeQsg3PRvfdGoJesPg9AgskDgJIGT+toahMPvtqPCdfkKn1IB/YHxu3SkxM3+zT10lYQD6vOf/bZAsaRrcCyrsR4omAQ5VskVSHC0p/jQg2foWgAA4uD6ge1Ut2mRoksFTWz3H2uQAgGSdjCABAhASp6RsnoeDkQ0HDMhT2AHF6SeGunrwcR0UWPHVFbVCKHuGkTx2ux2+nXJ5ndlNhsMRhJTM1F/47YqhIgPf3RwdOyTIPADB84VqRKGBNGy2UMDZO/isv3HAgBZxreUQEgqZ0CEv7/8HgDiGfpO7LLl9rmFqw35wj5psYACAQEykYyv5B/YwYvXKxwgvJEX1EgKLJBvR/ch6+dnfamvv/71mRPV9IAs3pqCCiSHE3XSXkJ2JcpXfCtuGAyQ06dp79WnlCDN6KDT5SFO5AU/nJQgqiokCFUgqtqmtoQvffPqUQgP/7NXGIMlmq54jvvqqqxshKShCqQlfPFKR2knoCrv3ZdSfG4FN0ToGdpt4LKDn8elnbdCrujqg9aZDHwnrujFAl9kDUMUb3Tt+pV9NDvP44Ldbj1IMQcfBnZxC7owd2Rj/vtzBUjVNTyQ1fgUCCUIDoI0gN1cPFPESwHiAIDAlY1CxKZpxZcKmsoa24dx+7iddkfZ00KBrMfG20vfBuIbggEVAg4bEkRR6rGGZVS0YGKnYXKTlTA1GIA+LDt+aUac26D1JwUlCCAklhi/0NMe8jayQVKTiV1bYRaoPTozNU7URyAAqz+UAgRpaNACkbEh/yE/9vjr+fETDpDksk6O1HIyt5CVlEpcwiR5DwDpespysH7FxYflaA4yxG1BmE2iQ4gA+YkuapcEyFKSbsaiH+uUFQj3QogAef60/WCKnq57mKeIbVg8zB1jsPI9kJoCuVj0HnViwZRugdTUQAFLlyC4RupkmC4BoVlZYILwiwrXEkBU1t6rqh8S+XD1s8eTfn+ogxyP/3X1fAtsnZL8j1VRz9pywMOparj1/o1SN/NUnbtLR8iZJb1GbZBC8sPNZgrzIkqkoF0369d165B5x0Y11iAZ/qu7u69nVvkezLG4YHctZ5PZnffs6I4IyHF2Ea0z96eOAjjoJgBpkPlxjPXxZiPDO5zKvYP9ASJA7A67AwFipFlaBCCxa8W+KgKQKAyKZ9IIEGNaoSUsSBoJxMa7S/71qPIjQIzQREWeARWIDfwWbT1466Frx9Cxbkh3ydjtx20OO2IRq08OB75GOr5BHikSuzU+daEn2u73eTF4rLHR4/H6Qn09M38n9IgFgR4KaJ96an/IAAE7PggTIIdI2ONZTAeIwMcyvZEzByLjg7/zHhSIq/vJ801cUis5Hrn8kCiCLVggQjY7iQBJxpM5+ABwsD4syg5xgerWUqoTlEl84s8PfQdT9DR1Xbn9vzOsgsUVCCwDKTxJWCPf4Peok+tapyg/TsAMulhBiB4ItvA6ucRwwqldpSoEGSIAglMizLyA8tPFm6+e9UGKe1/f5Pc3L4ahhVckoPBFIJL8kFqDkVdq+PadkVLDwK2NrxcYQeTxP7Y0ltePdKNcGgusZS266HCbMepKwgdY8BVi1G8NgnNh+9Pu/wNd9xa+2qgQT8x3JrrZzCM15g1smaJBsl/gud7OjRTqj+2+BhN9RpqxwUwQzDKJRHYYd7V6hwcoQBwMIHS1IBgZw8X+sjZBVFWAKhA8sSNBYDi7ErMOS/8rNTQIAFGMRIFk0oo9Y6vXsIqlrUd2sRPb6h0a/SSQbjAet9mY7+1AgMCBH8C171DJiiUAIjMzMz090R5ykFtTBB6JWARqVw027AVGetTTtVa6AsniFqlDIuxdgfwQ59zgFCnoiOSpEbjnvgMEhkC+3cyxOix6DaswSeAtNbH4U4ru5C1yADviK+wqjnyJxyf+0X1Qy4//e+NrDhAsYfEC1pECUSZ8zvAInRMRKqUuDyGCH7U8hhdbeMMt0tQg1x5OVSplSRkntLDV0hI+f/Wv/3nWB/yYfISrbBEaqkjddUoEWc11UOiDtLTevn7OVfI3qmt2bmNjrWJrjK5BX0RrYE28Bs4Pnp1loE20jDRuXkZy5xkhmDfSu/B6D7gzlXXdnd9Yk1uEpcQV1hiM1ggaJOI+bOv63Eih35171yIAELoLHbuwWA0rGyvuFpRZfQIgRukgFMgmim6lNaF7QgCCrUmakqYlLAfGMCamuko/ybRDVKMtDZPkACg7j0VEgJTt+B2H6JGg1qBlJMWgEIDY7Y5KxhOHMa2trweysNA8EhsYSCT6+/sTtwg6gB1YuqqvP263w3pD5Ac2ccFXyVJMAoGBC1HPoQDZ85/8DwlAiORYTsn4WJYxksxzR1Kp92aiWzue/k0K4rVIEqSQDbJpQflhsaxMTGBUsKhgdW6HEK5AQJykUoQgz4e7DqaCVWb1jLz4tPkE90CY/NhWgfDdUmJSBBfiCn6c4gY6M0CYBKEtvGFpjW15jgJR8yHi5DdawmeJACEACUH2+LPHdy6eV3FrOpMgq9JC9Rx6MFRBXEq49fez+9BW7/LfncMYqwp9jzkVIMI6p4MWDAtm2WhnIiVvX7nZYMjjB4TmLjzYSw+Oqcw7u9D7TqyicvOtiRV8yxQLaIQnpBqEDsKD37LNykPrvbEg7BQUYSKihLVjHmJVF8Qwpo0Ou+MYHQekobpAgeFifSJW6B1eX2cpIxnWxuvAuk6g/8L/2Tu3kDbzNIxrTAI6GJKABMEiDTQQpSGkd0XUBCpNxipIndbWumKLK9ERbWHEcXWZZRi72LLTnUJnh9GFXXqQsnMoTGfGjl3YdsDtYg97tdcOEV20fImKFyrs/z38v5NptDGLN36mGq2Jmtrvl+c9PE9dDgACTlsK4MMDTXRQIFBIUpTo4JWWnR9xV03LlRFgAHbNdQQBcMDHSsthrAqSbsURFSBZBZDEkBzRaApyzz1gBV8Kn2YLET7wQArRtMDQ+YMY9GwA8lgABA5ZwdLgMWdSHmYxknsFEuwfAgFi3B4s1usQk/zYgCZ68YbgB8YnSlBoJDE0RSRBqDcCDGxtfXwxsl+Pfc2l8bOnKoggPMKLr3SUMDQ9Sthm0Y2xt2jba6xhBQIl5IFF/Dh27HPAx7FNnzEGXRaqCtNoEPVo8NY3f/X85exk/N346NTsN1/eBhtFuUL4xsNPTRa6e2/9+98N58IlJjh84+kaOeliDYpP1FpngViilqYMVu35+h63qhMMAFnB4KeuF3ffMuIueGn8wVaRXoFU6bvn+ZRPhRU0O/PEznJHAGRiuw+g1dUDAEnyBJXDUc52WNUpAZDMg6rBDszcILtatiMpo0bG5YwDwE6M3YAhLBjj9SSXyPDW44Es3O7rkZwBxAJeVrREGIJikjjZ75DSKx+VyPkBnOUVsLBpE1gIEDxIdcGeYlJZEloFjhQdAF8PmjfCDQ7L7Q+cChb4IAGipNqHLkYOLLCyBoiGjTQSRGVGwrSm3pnjHTxX5NrfpJN7sVGCaLJDX8ki/VH8zuIn82xET/jQE0R3LMgeCM1jic9v/eRfLTX79NBbXXX3z5xlgKCBO/DB7S7RHWaAFEiEqL69+gnegNAfyA9sorP8OLZZ8dp/wa820akHUrgdHQ3G9+qbb3/5zezUZPzc6OTsy+df3GymCtZ7mg/8shkepDz8RygSsfJ182+uTuTif6W1ZmLm6Tp6pxMwjsq9C62GVWUgCLVJqqRPibrtxx0JdnAniypZv5q+W/fW3xfvEhJBdABTFYhdtkCIJ3IRfm39wUxbmjWQ4L3BlFQgKCEEQWiV8HT3PZd1NwCxlC/p5ngh1jz6Wca4Amde3QAoENiuEwrEowIEAm279/4Ey+k6DwDhwlHSAj0Q4FxInOR3SOlV/6vU9gwMRkFHlKrGuUQQXpu3ybEsWHe3cJ+j2qMgPWwg5jyMjhAFn9sOlwpBIghiQ36c7u4/0B9ZAqTzUEISBC4qTBJz22Z7jWBJ5BogwXM//nNjw+h+ZZjc1c/wqvqj+NCJxUU055L4MEkPqlotaM30TprnFVdaf7q2f4PfzuD975qohiVHeN3SSrHErELU90r4s9V534CsbwkBIvmhHpu0gw4v0COH7UCYujqCF9lE344Qr7eh/sxXf5qanJyMxyenXr78/qPmeq9uY3B5m287ownghF/hSKW3vun2X9t2LnHv5qgdfgJhgpwuBVUiXv9Wtwer7KqTSRGurMukWpPVOvUjNClC+FhbX5+5lcXv8oSQRqSEDA2QIk2ByDFefketlz140rYdCM6IChAuY1FCIObv9ewgaFugfUInfwdLkDJsosc+6wtmBEjbQO8qrWnYFJvCeR3insSJNbPXZiMYlAAAIABJREFU4a4LCwgQUiDi/G5JijN4KBRajY3sas/d6nRFesZ6o6lqIcmw7wEQsLEC8ciNSRvWqeAK+mZJiyuOVrFo2gVuDdUsgooSjbZ3Xzx5oD+y+re99riTSlhIEX69kJBVLXpDaJkzttnncg6QyOjjRxvFJC2YEbqxXfVjfPAVcYMFUCBCUAAk5uZ1CYqq8tDjg5cLBXJ+6Xz093v793tjdb66+vOmz8caxF3A1asAvUoDEFnc0hSI1CSAlUAANwgZH59Lfvi83Os4QruExI5CwzYIQcPv1fGj+YM//GV0FEL0QID88WZzPWXgyjDDZX/6+V2skPkLKytfCwZd/XVtbh4qV82rq0AQaWfFw1UqFVCCkLBgs0W7ySeRi0lonEs9CbY9WYE8Q+h/ZPEU1BoZntnCxJJ8Az+K5AYIt0Hs+bohLLBYRIBs33tz1V1DgDhglc9iKXfAqCqXsD7ODBBrLVS/aA0dp68QIGXiA0rs44yrTk5n28AgAKSUzsHySIJV1dD5mlwAJIYKBPI8JD8AJkpsZJd77lZnpH9sMApRjQ6pQehHtHkUj4IAEboGgqcgd4rToao9xA6IBLY4dPiwCfnB9yIEWqx9qK8ueACD7AByBwByKKE/FvhFuyaxkdDeJHJdwrLmtV2/IwQIrgaaGucqOVR8EDtAg/z30PziIvkDc3g7gcTcQEdwgPrgY36htfPbH1v28XmHdeLGz5uNPjikukBGBBAfBYZSlrwWkB10t0SIO4xvwrSBvqnpj81N4EdFgDQHgsMvM2/paqUOH/4GgQ2BDjxeC3788KmARzx+DgDy7PfN0IgX+kI2zcHpSmfiq69k0Wp7pV/cx42cucRYayeePFjHrQu0JJRVKZyVxXKWXUsNKSqy640SjfqjSnYl2DhrbQ2iqGaG67LxsLD+Z3x6fW3LbgxYL9KHVHEli4Z67ZoCGY9s/4LODgRIEjxnsa7vKWc3xVT7DgDJq+sHgJAPoqNM8gMAMjiUMZXW6eoYI4BgIxoWNYgkFhgAju8dIDX93TEuYYWwQIYgCYWU6OmxXVeQnbU9Q4NRaGkAKxzkWG/hwhQRRHzPwBDxioKn1DVzT7V0TVS4Ay8Agt9PdbWyGus96J9n/29LAFkw0iMhK1kJOaCVWDAO+v4fAJLn6nj47QZvl6cZvHpHUyXFGlEEQk7MH/8F4aEJD7MCMe6AMD/mO1vv3Kvbz0e/7e6/zzb6wr4wTvJKaATwT6BkO0AK6KO8bkgICbt97jASxKfrf5yVDKlw+yU+/GpkOgenF5qbIN4GL+oPECC3v/7tOTqmZsHHHf6Gcz+OoBbx+9/QSKd790MR7G7uBiOdtb8af7q+vrUC6SBHKb+comjt6hZ4vpZ3zirEIEDkNobsheCxsrK+vv50fDhL0tUMj3cJBK2sSHAZDYPzZR0LL3Z1CItCq6xp281LyaWk4Af4dkBingNPgKkdIj3ynCcRICRBNAWyZPOkBocyJm46oXsShf4CRv550GwdzrKWpABIy96fAtT2MUDAjR0USAjEgjjVC4B07PruXZGegd4oIMShTd96bCQ2LLQhguUrXjMX2EW3XYfH4fDoD9AnOLEsEKasrsa6r7REXM4DFmQNkER6BSIxYtguTOhXRnILEPEU4w7PYJl6Hdt0iEQMSZBDx+eRHuQxz0UswwWxoatfgQ4Rnyi+/47gfj76ta8EQFCChN0lautD+mHpJYgeJqxA6CIESIlP3Lg+rK9fMT2EAHF72cGED+5QkEyoNJSwhATxygJW4wdffDP6Lq6gx6dePrvdVI9/tVyoLQou+zPwA30Ub/5uOIdP7JzBSzemu9bQoT3fuHhhHrGCE/mWaruoOa3zUjg1T3glA+pX0/cnXFn/1t59wVnrRdLw0V5kTsqlby2/SK4RIkC2jQxb81w9A7GU4Aea1pbbYEioHJ2aUqmdIj3yOvp6UwrPI5VpCkRQYPBKRoC4anpGIEgE1/MULazDllxNXR7Yu4Z0RgYuawoE9Q0KkJCyenqs7S2yPGoFQWLRFLgV47Yk8oEb5tiVx+R0m8xN96Q7sIN+WPyktpBHSaUg7bevJeg86H9kWRhggKTjh3pJGAWI9janY7xWdJbfOGHoluu4oeeH/vVG8YlFgMc85yhyEWtBa6dLCYLNc7ZYFNdbOzt/eti2r785roknZ5oqfOEw9EHUjkaAX9KSQ+amu7F0ReWrMLyEeQH9mNQfgBMoYBl8qgp53ZyKWOYmSEMDIES8bWz64evZOPAjHh8VAuTmKW9lJS2rkwKBsNpl/3tpxnhZ5wgeNX/06aVc/q7mBetuvejq2triAha7JspTNG9+q00IeR43dkDoljJIHZoR0P7IfpLCagW3R9Ws6w1R6yrrtKWTF7fSWCMG+8diq8mlJWVpiXYWgCI23Cbvvb4DQHquDKaqLaW0RV6OvfeyMkETcdO+jCYozggChPrQNht4VsETeQETJXa5b+/FHddJCRAb71+I0/hhLGG1D+z+7q1WV03HtZFBCKO1yBUQ0B/wgpU7EiDYRucpMk/6A9VKEuRHtH3ooH2eAwWSniELUoMk9C0Q1S+rM7d7IDXnH/5jAz1MiouLTQwxcEQrcZEAmTs+z9HtuNshhQclJ7IcebQwP6f5KQJCWuc6Wx/31+7ro+9sg1xbX9jXGHYzQQrSKA91krdAbYBA6UqdxAJ8NKL+0AsQ8d6pCrc6uyt7E4Y/ZgmCtibe+uamm8+e0w56fHRSCJDmRm+ll617ueth0h8X6KtcwMIWKBBv/ft//jDHBUJn5NWTaYGQKjmZSwO7Kj/y7aZzt2kGS7PFYv2ytbbWNT0+sSc7Zlfk/kzX2tqK6rVyVOakm8WRunMCU8MvPqxJg8j+bvQUUWApoxSGU7GSZVlSYiOZM6H+x97VxTSZZmFhKAkYSUti2CbTYJtAUhtJw94aW5q0oQUlIUVlINiAaQiwhEoiqSxOZuOujqBZx0k0m8G52ChLWB13ZseMIDGu7AzOxF3cq7lmg2nMN+YrYLhANvuec973+2utg/0Ic8HbFkqlP3zI+/Q5zznPw8jLcFI+BLRDIpOPsjKp7P1Ku0WOvAVAbKEEA5BDXJSmvMB02mmpOAT9W/l3Kfpah2MAIHKFRU4LsYLt8xUw4RjaRO2oyOoNJUaTEejGUvgFDJTzly7J6TRvIauwGEGjUlPBgn+l8lX/xZ323fykybEHeglEqV/xW9UhdT0NQQYyc8s8ALEF7j98tK7v3NXiSKaOzq84YIRQdZ5fJAmErhFsxFFVF7ZY3Ejxv/H4zA8mFHjzWj9e+RomQaoZCSmnItZ7XEOv0TTu1mjIB+EHcg7ezltXhwlSOuyAHiwsYHk0vbZqEUuIIOowOm75gCDAHRqbT3/DZ9DPn5+c/Ncnx5peMgbiIcryhsKVICACQI60/PaC+QVCXwPs1hu8DUsZ5ihQ9fPiLEm1+sBAZe4PBPS5+an6PF8lmCpC6vqKgiGiQUzzCtg1Qg9hu/X4jDezhOUbOAUAAiTEbpcsMN0AECIBgOQO/7R6E+eiACDS+4x3IAGRoNRjh5SkREOubdrWkOgHAOHtsIz3SGmcp5Dl6NWBTc5WZiGOgbbhWFhGBZtnleAchrMWACSwGexmJCTUN0plLNI+qGuskNqeZYvM8K+2tkIbFiWW3cBAgH5EewfbQjv8I68/yB8exB0ggaRSWbqwUqqantKoIfwcj7ffMi9QyvfBvSfryriH0sqrZR46CiIasfYEnz/XpV5R7SoFiJGaCVLdikY/qILVTjoIGPFObLf7v2/i8+uHq6sZA6krVwtVNeKsmR58gyDC7mXEj+sqAamuMbbX4ic3KSGABh6NnwnWr0o8riMtzTe/X1iYPg8eWJPT05993NzocnkAbzw4OZJ1At0tgtDpE0OhO3/egiF/a2hkfJa94S8VdSxF9dCghyGutiCLXFJ88GApDA+O3zBhVP7HCahiCRJixC1NwO0KX+yZx09kAIh1lx/yWy1phhhpxj8KRTstZK325v5Ts/oTvQxAyiSaIAEskCSGBs7a2sjZRM5QYVsreB2K9/OihxcmxVejV7t8RfkCSKirNxqWjVUkApDBzf4Xsfpbh84mwxEgIWBFgm1YFj4HUmhRFBwL+dFnSCAcWWRwzWL0o963I5/np4EggBg5yJLCQnRSiI6PQA2r3cRM9MCHPAnEABF7DITDeN2hTsZzAOGT6NSFtQhfxFNCACGfXnDjja9v6xAIHX7vyDgACIMAgRUwT26Ejwz04I4nOP6RhX8coE+H99eUGFkC10D4HIjODwv7dz3YgXWMERAGIOChOP307p9ON5e7XIywAAnxqBFUbuF75a7StGS5ySgFh0C2ZMjf1zHxeI5k62JtRm1GSpRWRD9YQDGzFPoEwMPgY23uwkSHGSTJ6oOXtLaBMx7a0fcCjX0inkpVAPkgk4GA3AwT4exEQoTFCapwGrby0dz9KrZAojciyzIjHlKhkDMYfjhrV6NnE7kMp4tsbYN6AKlAvyjY4KPfdeV7fIp2NVzqjS5nyBB2ePyrmwaQXTZv58BoEnKhZEnwDLLCQqRNw8ED/QjaDzD5VrfKGAkCz6zlcCR2bqf7Kv/l5wCiSuecZmggJaU78clCcDIxFUAa7t56JJp4d+/RsRA9IzHgi0NvNb/IdQ+6EgSLEyIeogWLJ4MswhBI53Yffm/91D+bm0DDEGIHV9ApOeo93cy5EULwAgDSpMWP64oF1uG9ov+qSrEYQS9ejwd6eNVBQoAFD9SvXOyfGHU4dueLhYWn0+cZfjx9uvD3my1UwfK42LfhGSteJSJRXZwRPo5W0bMc+c3pKw1bw++s/htIQjZERpRICilVN+oNvEn1cicEOUD9vZRJvtY9f+VkwJz+G3xJazCmUizsVnT+7cpr40Us9uRTmQBitYWGYmgpggI66ASw2K7IUGC0x5+7jjZwCjI3YIpQKsPMDMQPhiDRs325CkVF3raL5DRCQgHVf9Ds0BQAsbZeOpUFQJwQaHv10uZFSKs30AckBOpYhVjCssNYBztiTjpmdjRJRBWo0tiAVQbJtTJjH7FeRj924s9NKmFlUdBThps05SzFL4sByECDSZuCre/hzPq6dswjFwPRAkhQk3GFH7VtvKpoHteMg8AH9uIToe0+/Fb/xEfN+xUFHdUO0YRFAEIoUU6tVlojXu6axeDDqH9gNy8WsEqqaDvnGoXKQDwlJToAgfoVjKIzAvKy5fi3YII1jSYmMIR+urkR8YMzEA9VwLh1LyVQKdqImyCr6mjj6TsTvq36+7QGno3PMhbyqrhUCZpaUeBDfCwVcU4i0QlE9hVgKuB89eX8lRHTKpjQIYYk5NUKo0YFasitWr3SOccz8jPF4NXIQGwdo7EwAYiEEEKmHAxBVmNvmZjw1gOA4IC2VChJvCGJGEjuWHOrL3EuiRJIpao1I4rIy7H8AcRqa/3qlCA4FZZK/gz48JFzXb53ONaghHAIkSsgqtBZiT7t6NZuQTMs7mSf2X1VxuAjEmXw0dXq32neNYmBOJZyrtRSKvMWasN6YBaA2EJ/uf0PBJDd2ZBDGS7kAPOCnwSAaE2CNUpIalFdz/V9WNBC1urfdgCxPfv82GHox9WG1iL5EBwEWq7KBXzU8YvKS2j8gwfYkgPva+rgravx6Dyq0KdKJ6W7tRQEfEw8REBu/n5ychJNTKYXFr642bIfCcjLEo4fHm14SBVHEZ24DhWsj343soV/oL6OM4yFwIa9wicrRI1IW8ASYYCqdA4xIWz7XjMVPng1+MbUPLyiDTEPUnxQU8FSZuTJuXHty6n6DACBib5YWGZvqQvtaXs6TT1F+PmtDa/e1qHYMqV9F0oVMmrvTmQgq9HhvlxChtU/cC6qpiCWCZUbB9G/68r3IFm9fRdjYUYWYHa8UEMJZDkSvfiO+GT11ieG+qEfa1lG7y67QA8nj4zKENGXYRrz0DJoHzFIvw3s0A+zGMi6AyCEnYNLP3PxYlc8/rdBk6pAtp77M4/Wd7+RZ2Te/oLf7sjMviIMoclC/iW0ZbUDoAh7xfb4k3vbH4BctOvGhW+b63S2ujXa5HMx80F9VxoGQrpII+gfJHpQ+IdwwPr16/2AH7/6qUR1cKc8dLfah6WFDzfK5Aw/mo7f/OxDMsHqQQLyaVO5QkA8LjfpICVuXf2qygAgRxpbvv5j/ZZCr69jBCGE8RBsgOIgYtQ/Dhao0+cFYvBj9t/XTphv3m31MwiZUzCklKfnGiQawo/uWRjSNzIQXyf4PbHdX5IkHCeEJaXl9Gq4fyi32O9tGIqBMFBrgTESWZbw7nZnenU1mRtAbH7GQCJoew6Lm6FjskbEPADBx0dTlkMVMgxooAwx2PaOBKfI5u9MMBYSCa+yHxqjBnFZaskKywgfkMi1DOgRjmJ4Ovvt79APEwEEYQFQxGEgHKk3IQgqIfEHgyaNivm6Hj5apxKWCg5ZIESlIHte0HcFs6UmLipcJI7hg3GaPW8PKq288faHY9tOQMD/69p/jjfV7RXAgakehB34BRWw6spFlYuseMs5A1HljwOCgIgyFiMgJXr+geUrfg2hRDtHSKzC43I1tnz6yV00werpOc8IyPfYguXSVrA8uvApoiBHqrR5I9jDe3KLD6/VGxqZmp+dWyMQgeKRCiG6/iu1eMS+rXtufvxMp39L2idsgZGpx7OIIUpLltIZtqII6GugvzzzZuxhVl8njFqHZVCIV9nOuMq2R1rh3rHc/bTe+rEk3JWfGJasynTPy2cHW3MCSCDRm4xEljHODz7gBTKZwpH+r9ryBhBf33DycgS3b7yEaSOHBNrbA3n00dt89X1Do/3JMGJImsp96ITF8w65DxYaweDTQ1hh7/BgW4N/p3XXbADBVl4HwYhjyfEzOAhoIfEHF80xI7SG7t/+6//WOc3Yp6KGuBo00hAsYTEM2R3MGsC7qIyFLIoEqeBMUNi8tz+Pt8/ca/P+An4B/pF5ABBN8keNSKpFFEEAYfhRvbeuvK5cdeJF4R3brw4cUBPQrwsIeV3NR9B/UhQQNxfSuS1Wla6Ehfq5G/EDZtBxAh1teL/RKiAu1NE53FDrrspAjqrzIIyAfHzFjCSptyxv4KTYsQlFOBFRY9O5XcnGxqsNAA+GHheunQh5t4p6sjfGHc/GGap1d7/ir0dp3QX0grXWzdbsVIfXZs0EEJi0pgW7OY/UYzvf5dGEL/cTh8b6o9GIdvG7J0cHOnOpURA53p+MKitCj3KZXaKnvurJ91DZfGBAgo+Ll4h4lmg01p/IqwjA3kL0DQz3AoYg0qZluaKW44dCPBA8Isvw08SuMvLRs9O5uzUAsqSihyM3/VhSzN7X/zDcZ8ovw9tw7wkSkBdELAAeGHbsUxBjX9BYyXpBGogGQJb0kVfxRTgzCpICDoJxhYKBPIchkLGGX8IIqrfjMfZhAWZw+Pg/e2cb0tZ+x/ELN2/CEJKCbG8CIeDgNEQCvhXyAAmOJCcgZDZVFFJJR7WlckuLWju8FFJR1tpe0N3VdtxStfTe0sooVWvvbiuju8XW0Rd3b/bGEQmBhUEZe2EM+/8e/uehaluW1AY8v1OTY0hOjknz/+T7e2T5ATego4q7vcsr1h5gCeQHogPYMd3i4yqQRKKZyzX+pY2xbSJsEEh4bIfEh5d7mcRTHaNQgw78yOXurK//YyyV9Hg4CQvbmXi1vF+DAFFkEETFC/Vkx9dX9mVQl8Mf7B6ZwiVbQoSW7e0322/ebMMVo0PAY+XZ5FBP207XUW0RAmd0d+b5Kp+RyfAsXr+6NDUS3aX/EuBnfmK8D218fLzvQl8fDve+cGF8/j0F0w5/ZmL44sU+o10T1jd+bj4T9r8zCyszMHFOPFbc++K1i2TXxJHE1Rfpqr8GOPzd/eLo19Do2HJveCBTXSDC4XAG2/oHzo2DLwun14LnDRub/By9ZcAOtMHBU0J7HOtsC/ot51WtAeJi+WFUHi5TTfoeAiS/tfx9f00mzoU7Z59uVUBSEDqMPix3BLedMRC4sxZDf9uy0pnFfdyx+65sjbXRlV3+bj5QDwCxhWf+Mt0eh9JzCp/r8fNmrAlBdIQAI9h3F3ZDUDjC2VfkuGKCaE6sREjV8q/kDFtjFbqyIwsL9EcpnuI56CewBH2JUrAAHx5dfxh8WJIcdG2njOFfKCrk8Pbs16trcwaisZG5mWcaReRq/V/kBizaq6srlybPHI+F/ftwVg6nMxAWZyQosrIinnqVz2Fl5fnzmVtXjh8/Ggvu+iXYJhZEfyDclklnYplMWyaTTneCpdPp2PtThpyBWDqWlhbLwGOPHetMw5r5zmXa5g+Go7G0uHMu15nDZ6SrE53pQNWJEEDUaEYcXBy+8wT8RTnYPyaOnwnWpIuhIDZC5MLg4K9+R9438P/9G6WbQMfgqQsIj1g04LQSr2oNkAnKwnLtKkHyOxN69RC6BEgtJEjs9Gx2a6tIpgdB3CZ3lsl91UB3+1kkYhrYbhi4CwwBFQIJvMuRTSwA4VmEXV3Zx8MZR10o2cDd575yMtQMxYPNWvxDi4hgtIPUxy/FRo1LkB8Jdl/52H3VwrtUQmgagd5kN1UQ6hgxIsTj8aSwBGQNSggFP2gOSFIAROIDRAhVHtrfhghOCyEZoqjxs7fnovv56joERDIjQ2LNFhwRtiKWbrFew/b82aXJW1NDI71iId2/U7KJMwq39Y6MzE1N3ZoUdmtqauh4T28sGkTXlW3PoJgZKAJG8CMuPmjls0G7D/yGbbPBw/wB/wc82EH2GT5CM9x31OK9gTOQTwJ/DR/eWbPlHF7sTP/A6XPjAiOnhA2eEtgAE+gY/uL0QGc6GvC/42W37P/9fw7NFF0ul2sHOVzvzsHiGAgUcztq8GnrHV7eqjA+hAIpNrzfyNmFAGG9YQqAbID7iscUFjagoHAT25oAQP7Z1dU1ezpTH++Af+TZti+RbDQRRAbVCSCcs4suLFQfjRA8L7dozED9gT94W/kwTLFVZAGhnGDbpBingeh5vHaOgqhqe8fodcGPOznqYbL28pHgh6dUKmEJIVxQLaGCfU3sBoZgGhYGVwRL1NTZr0f23dFsg6/vgWC4G+0GbDduiL1oOCwW7U8TNhWnJM6JjJby/X16pMmHuGzEfRw6gGz6g2vwvhiP8tHcR/DuB4V4y2T6+wfI5gf6+/vTmSi9/RY7PpICmcU0XskO1/uD6Nq0kEIBuoHU4EuKwz///Q+VSlEjSAOHQN4OqZtyePGOrkghomdecT3hhu7GygqIQBQEiLLZFemCFlkFIUBqPIy3CnNmZrZ9LYmQpEczTo1q5iysz3lolN72iuVHmZxXuIHzqnXa55OpWImQiiqBUq8ohddAjibtQtFamYDEUOPto5fvLy1BDQg1Mbl6/ogQIHFqceLFVidciO6Vriw+iIrRD/pFAOT2nz8Vnmmh0JcL22dyZTyI3w8P3tmAGxBlDuAa9lB2WPT4qADhDKw9BYjL/Lve5R0iCTUAiDM69wAFiJsAUiwW387C2q0EBEPokUiksKsHi0UJVqBnIR0LFAgIE8jpzf71Yc2GrVb7x4fnVrd95cThEAOERxKyAtEq0RsbD5m8V6w9gButLQs+aRQAAU3B1OAaEOpkghNBZASkiVZ/JokHSghvnslhCQjyY+1PY6mkkB9CgwA+vMgR4IYXhhnifBBZE2IYso4erJtnPm2Rv/V982A7VmzaNwnrxfj4ABHgkAoE5YeLCwtdeT0ukneZ+izKfu9dj+dr0K8ikH4hBIhUIEWtyHxP55VWi+6KRDYjEZP3ardQ+oYmUXAkOoTQF/chy/QD5dffXi+8gdlPoUb0Y8nh5zQD5PNDXHJ+iPteCePguaH8o7VFA0g5kYyrqsdr18efNxk7KGoOLLhVYaVCUwg7bl/uOUoVINAFCwbZCvVRKqH0wDg60APjITAdxBRRx+NhDOTX8dTY5V6/9dmyzLIDAhBz+YdpF/dMTi1tum0+nxUAqXZeACQiDcx+Wyk2VIrEEMzCcu8VQTd4sIoNyI9IwdwkuGCKioDsKGQ3uCp9M4uN3JeHB+pmhbPdeCUkCI5/CpkI0gj00IaAmPBBQXPpw1poadE9WGXBD2iLqJj5oWNEJwsDpAlD4p5kavT6NzGeQri0tr5+/XZ70gM5vAQQDKODAsGWi3pVIffHwh68qEDiqUe36gXPlllm2Uc0P7qwKAmLxQepEP7H+0aEGKaFZLOP52ow8rL74YM/SnromVh75WG5dRWCHiyBkPzONF44u7whnZfmE9LcQsG9xaP1M4fs75MrAiBEEEJIKM4IoTpCGlmL/DjMpR96/FxumgCJw2xzjzFgzgNsKW7eBG107TTWA51O5HvyxNu/uvf7XFu0DRCSoyYmAiAQQS+RAPGw/qCGJh5uzMsCxGvwYH315ZAlQCyz7AA4C/0cRGdM0J4hK0u6r3Y0XMTs3mx2eaL6hlLB/idPpQeropWC0LaDI8UGvY8ihEBYgZg1iMw+ljpEo4i4yIMHa7YGwqlWb4EtOrTyHx81sEokQqHm5jhWChpaJxJBkhD7KHOxh0/mX01zGQgVFJYTIVWFzuxeux4AsWupvLoLS8FCQ5YgTYqnFErde3k/1wb8OIE16FdHj7RD+IMViEerBdHUB5WPaOF0IogaPzl6JWYJEMssOygKROoNSQ8DQXaAxEQRmApbdT23LXbmwQ+VittN9HDDvwbJD5Mni25DF1eRW7mDAtlRhl7YLawu2ywWNoRuepipnxXOFux9tg3agaYIJpJJoTXi8Xij2EJ42Sgj5+UWreADw+eUt4tZWNOtiJBEMt6Mbdm9iilpF0WHTL4SPyqm3TY1cfhC8YRSY9fX13IxGoO+tL7+cqzjCORfCYA0cwqWHDkFjd/lppBTy8NKRIUQ+r2RoBW8tMyyAwE+l/c5AAAgAElEQVSQJ1KBaPiIiM1YGrI3QQRAHp6o1lvh7Fl8iilYFXeRNrrSGWLOvHLLRlhUhi5j6HmpPPY2bs2bzc5OROvnLbA522YW0IelTfIAX5bRyHMlpw1S3NzXaqgAYQFSxgAIuLAUA0CobwkrEL0TL5WJQGMTL3TPhRL0tdxRGoO+tv7T1Y4jXITOAOEYCEGE0EH8UMWTqYqHJAjk8F6+YQkQyyw7EACZB4BowoPZ4dKdWjpAdIvIDifZbFfVLQkdQSgCEdAQzKgU3UWdIjo/pPBocLslPxrMfbAMCiSb35se0NokL2RTOlBH74EjfPf1to/bsMtx5kYrl2XcXPZKFIKDuUHKg34R+iMkAIKhCkySsnspNiETbRVDFhYzhbqvq/GT915CCSHIjzt3ltZ++nHsSHuqVCrZvcAPjKp49GtFMRAERYhKPiwYiHvzTLf1wbLMsgNgNgKIER4RnSLs2GJflrFaXSZpZbPfn65yLfbHXjz4toL8QJMEcbsb3IZQSFEvK3RrjXgjm2IrmDFCHNlVixBB8tnHL6LOenoXAnOvfrPtk6OgDKMFy/otPp9h4PmCzMBa8BkkCCRgNaP6kOFtr12GQhQ9DUvRK9J5gCAMML/3h7U1GEMI+FgSAHl0tj0VL5Wwh6KODwV9WeTCMiJEZcGjeISUmewJWJ8syyw7IArk6ZYW+ND0R0R3auVdOkaYLmITv0HcOpv9bjFY3RmEf/uEIiAAj2JRVyBSgsAlQ8SoSnSAEDqMQZD8jnzeDRkBKWxA/xV/XfnonSMzqxAF4Va66MjazabJgyX2WuFqoZWC6NLKiRBnYHm1fCko+WOHFWbaSnhwaTp3zIqnzn/5zdKa2Nju/3i+vT2Jfdw9JQ0hiiZAYFNBdYgLr4oIIVkDUmYq7LQ+WJZZduAAEjELEM2zJesLARt0IQPsAJBoVYuxo3vxQWULCEK6g8vRixpA3Fow3RBbxxAIhNCht+6eioNvMw6aghDI8mJ/Xa1wNmfb3f+xd74vbeR5HO8Dn4RB0AMfBmTAQgyZC/h0QRMYERwnEBhic0sPumUeeF3uCkselC2H5VjPw+Wui7A56drjoGrpnlXPSqtdy1pabitKe7BsuYcHKUHo/APjyn0/n8/3+53vxFjY9BYC+X7GJJMmNYIkL9+f9+fHNz/y2twqYELxO2L4GIr+YWMoqr5S+OG6JrX48eoouf2cKrJSShMIFfEOvE2Yrlf5YhOVB4gPiM3ZEuNHADsK0+mgIX9lEj7IPadRjC52goCW8So3rml+6NDRGdF7ZauJAmE3dTWJRedcekiJwmAS+t9tXXqfz4uu7OUne7/l+OAlWEf934pMVlSK1S+rsIAfIoNVf2OfHudeq51RlYUk8T9cXxnraatfQs/Iq282mJbgkMgIXGTEsHaVI6Q/eFILvBByQ7ADHadW4WrzFFXbggaRCkSoj5TccEtbQByv8vBwG+e3Iz9eHqzdqAA/+HcwG+FBuSyQHi6/FlW9ruNNfzmuS7B06OiI6MrGAGLHffQGPz1WpsVwUkv6yfC7J+9nSI+tYA3vEbnowv4Q55EXotTwQhVvP3Sh8yJePtC9Fl2ibscYRfBZ/s7uYntlsM719Cw+ffYjXwaVqXJcRJMSq4IgVfI/qtGjov8D9YdjUs9fCut40yhA4IZPLpHmOQkRDhDXdUoP7x+QfQ4Aefny5f1VGKJoBmnugQRms8Dh7vhSrpWyUjSOsXL7unZAdOjoQAViKybIaYTI59i2zHPZAJD3Gmvbe+HRXnjyy34yQPplGe+Rcib1R+SoH+EYE/DPUYH8t6EHveGoi77COrg26/vtViTURc3oVWGX02ookBZDvGlQiJNGAcJHYYH+4P4HKQ8rlZZ7aGUplpyimMB/wByW6X7szd95ccgAQhIE+HG4MM/48YuAugib04MHEyAcJWmcpzU5ffOiFiA6dHSIAum9st/ogZyJj1iZFj7X9sPPnnw09h4/AA5yR3ooBViNR7fihuANUAUtdCSGXClVOwMg3GCHAmQGkN2VkbYDSH75X9AUCOYHKBAsz+XroTbwa4jO8IIGCFclfJfUcbHABAifemilXZw04nINogxQTPMjwaf1wvLA0jR0gCgA+eHFdDEXBLgGhPJXZzIEhppQURbAxHG8ydvXRvTbSoeOTlEgF/ZVD+TssNUbiZIw3Fn6fPw9Xj4/t/71CeWsjngvutpM2NhSCE56v7RAECGyDitqB2mKEF/2zl/Ktt2vIXv5q2o1IxQIVlYBJTIbInelmCAbIsEly3eHjgcxf0UzD7ECy01LAZKQAkQ5YZ/4iYG3AynXK00vYAfIjADIDy9mSwWLGgcDdNBN5yyAoAkiDBLHKRTnb45n9btKh45OAUh5bgcAYryDHbV4fZYdUYQRxF/6vNz6yw+X9/dkBRbVX50cNRUhQoXIaYsIELtJ0dVZCPFBgoT+4+W2GYOlgvTe88lj2fLxwQYs+RAGOo0qyUh2iNW1GTFVkfoHhQBJWJjDshKUvcIkVkq0E3KO0AistzA5t7KwiQ0gCBDsQX9Y8nLQT4IWCPahm451Ch2Ko5524StwnGJpdXm4R7+rdOjoFICMz+34yfAnKhC4rUEVbdL3H/9zqvWk9+gn3wsBIkzzJoda0Av3u1UBUrdPFWHBHF5x+PyKeuf9JCzhbcNUYnb5dokTJCO88SoIEHYNZkg1o5ggqEjkInSwPyz+Cc9Nj3SCdIjF20FSJESw4lbMUhwgAVJZ/StwA/nB96DfKebA+gh44spyrTMzWEzJuCY8brmmZcFGw+vaAdGho8MAEoXR9BxFhy1u5OO2bfj++p9+1eonclfv4tbe307iHehn2yBHQqTADQkQlCCnU1jsy1ZWJ9LwFULL+qNLbfmLuH5zvljgo9oxNjKyTbAar+JFaVKV9ge2f1jRZzohJBq/nuKVWAlSIGlRijVA/Nj8PYxP5PyYmTk4nK14fWCLC4AAQRif4hSh+5ArA/OD6R2XIcT7+Pa1Uf2e0qGjcwAytrLuNxUgBl7gsEX5VYPHDp/ffrjzh5YB0jOyskRjsMQgxeYCRCGIyGHxDNab0wKElibWYpks3ya0JP0Pl67k2/IXkV9+UCoMTsSmI27gvESewKJCrCqfYyLSWKQ/TCsI4vhACcLnH2KtbYq3FCaozRBGnUAD4eytg6kxmMCLHvrd7e1NWEPoprB4NxCosFx5BuCwJKzMFHvMgWIsuC1W/ngxq99TOnR0TPSMAkAMI9ktuWEk+VfsEp3iM4Akhm0YDCC/udrqWvTe8txeeHJE+kNFxonoAZGFvTK/Rfd5BqsuFYgv9YcY9Niw1B3yWj40gVxqyz5pJsaelopOboIkCJog7BhiJx/wiqvM6dkmGewetExX6cwgiFimHJ8rC3oFQBhRcAmh65XuvFi7Oz46Joa4bx8c3LrjeS7vOxc5LCE4lHBAmMC3B7ZY7PUsx/WKq3/J67eUDh0dpEDyCJBYzsqIOGEIlNgGJa1UEQLPYAB5crVV3zR7dQubCBWCxK7EI/HCrCMJEMCHUoYVNXzEw0/W2cVPJuu+/3i/XT/iXt97MJlzCpwgDCHs4AN4eWdINT7VBAe/g3se9yjYp7pF6GhwvQVA2ClNUGT8uLW2PTWWH4U1UrQH/f4q6A8YUkLfwJI2SPygDBY+QggxHccr3fy1FiA6dHSSAhl+RSsJBTAMVYMYMScE8QEPc5rgEfr/mBtp7Y/6nvyjJW6h96t6QyFKU2ddAOQNthGKIzI8YosTcfy8z57IrtkPu9s+u9AbJMjwq6eTnpPjGmQIBQiN261izS61DlbVWb2DID+ChiLbNEfIqZopDhDMXuEKkNI048fdqXHgBwAE1tiuVjxaXyvyYexbgUEOpCCz3OIXyRWH1oU4Be/Osh6jqENHRwEku7i0F6q5q1gai+MkYkbcJWH3Q//xXIvD0YfLuzsnJ2JyiZQccQUSM0bE3SODF/HiQineji7azk8pkLoNDYTseeH/Y4Hiz6YFR+89KzIi5CInHcftDoETUs1E89w5PWCDuuOaPyGijkKGCKtQnP7z37fvzkyVx8dhDXoZ19jOe24K20TS1NGOLMGEGHkhEh/sCgJOAnwMSrAWu3QNlg4dHRRdvYu7ohEkss0V7cGubFWE8FQWqhEDAfJZqx/KFz9a+vZErAFpFCKqAmnwSKImEHJAxEQT0fARlx/1pM/4wRhi+6G/tNK+bQrZVw+eTcAm9MLEMWWxRKNHRtRdMXJMitW3gzlMHr170ki8ciqyQZj+KH668MnM1MzUVJkHVPDOlhxsGUGCpKGhhP0vCwuthOAQOSxSIJZjYf+J5Xil29fy5zRAdOjoJID0LO7vhCHRIMpfRUckQWxejyUgghHCX/XlVtJCXb2Xt6QA6Y5xRCVIbKyisNSVLkJRzRsdMLAEq3iFg07bFGHwys7WlZ72/YhbvPfvyQIQRCIkw5ef04TFTCQ+Js73WTi6HUuhzHSj4dGkc8NSCOLCCtuFtanxsozx8vbLw4clzx2Aab6JdBS8AMsVEoTnsgQ+zKAvCPqcnPepLsHSoaPTAHLu4v56GBqhwQ1zI+Z9GPGslSGMECWFFfq7LW217cUa3u4GAXJahCin3WJliBF56JTAQoLU6ALwsHkriE01WNRP7/tLv7vYxn8jDy8+nSwygDANUigeD/Exu7EKLL4xHfFhpSxs9ZCehVIhFbNFAnkDAEknBkzHK8IGkPE8uh88tg8fVopOijZ80FLDdAJeJG2J1g83stFdTGE57Ctgh+MUSgtf6jG8OnR0HEDmGECS3arhkVS0h5FUHfV4gwhIEDSmW/nkyMIQlQggR2dR5NTjNEiR9xDaEUK4DvHtWrKeVEt42c/rJ/1aMtzZvTDSxr+LntdfPZ/M9WEWCxEimgYbrY8+2ONkgaBIxRZ2vCMCUww6YQhxYADW2nY5P0IFWKhAptZuVYoFF4eTwDyU6DCBFYoEAT89TfY5OiEMH47nzd+8rB10HTo6LV6v/IcBhLJXahZLrcayRf0upa8MhSBMgizNjbTwd/3w1d2vQ5HA6u5/Ryh1WXSHACKxQVGjo0arEpNybzumsELGEHBrRtv4M67rXPYVSJBcro/9QQ8xcXw8xMe1I0UYPM7n+iyGDxIGRI9m/HC45KCJ7EEgAGKmE2nT9UrzX2we3C2P5vOjVMILbYS3ZkueKzoEEzyNxfiRVpwPJAnemkKBBJaTY4qm9OBVG84Y06FDx88bI1e+D30SFYYo45UWiEhsSXUSZblEhOH61usWXhdqeGlvbXMJ0t8gQeTpkRhjAhkqflYnfOB4Lk4QPvMRTsMaI4gPBcftnWTpHb33fLJYOM8owTDi5HKFwQkWx3hMTAwSPkzqCUypHsVZokM9zIDGW4H+uMH4MVMeY/xgMYY9IJur85TAkgW8gI//sXd2rW2jWRy/sG+KMUgGXxpKLgrFIOsbSBbEGKSNwWDsqoMN3WCDtwO7EHyR2SJiyNpdZsgLgaaJk4BDkmY7k7jZNk3rtpO24zCdpdOdLQtzsbe56YW+gJeyzzmPJMtO7NhmBxKio/ilri1LtvT8/D/nPOcEKTAUgx0KYmME/8YwDUv360R/xFJT5VXnXHLMsUvnwxJuAUDsSAicoIjl22qjiOnDqr9KD56+yd96Vf98tR/71AkXw4Nl4QNuj80rECFAjVGzczvG0JsQAanv3zzfThaG/WWt8V8iPQgo/AoIkTDaNbIQXYJZs2NWRUQrys2dBRDjXxQghB8bxep2qaTK0UhEAhWilrbfP14qxBWatTtitKHisLAvig8gB6GIDqJjRMd/cRZCFBAgkILlmGOOXTbjCUCaFB/eACwekwwmTlosCZjpVy3aEAlS31wdtJiJ2x3JPcIcXm8bHkJdMdKacOhFgEA94JYCOab6AzUIJl2hBKEXVCBZnLCinncv/a9b/yISBGDhh1gIZDnhAn9YrzAYbLUa7E+CtPxYiA8lDvMH86oqIz+IiZK6/f7n+UIyMYYwCnLB64Z7DBTIdZAciiE7yGpQgejGNBCUIOFEPFWYi/LOueSYY5fO2Mi/XzcRCiY/LERYcY4WPFpaxISIt/nF5oPIoACBVra0jKKhKnrjo02RUAWCnKAkCYA3yyZCUIEAPQJmBhZ4sOrfPZCYc/5l8OmVhVRc8ftdLj+aMUpbAQgzk8omQLoHznXdip4bibzhWDy5UanmI9R5BfgQBQKQf0IARCGKwgjLc0b1LCMFC99dh3AHBzPf8a7JD58PVrqz5fDDMccuoTEiTATxeA394fWcsID9buDEf3uzj57dGPCnPStCK9tTcnj7YIgXkngNfWEWBaZ+LHoVwFujaQnG0In6OM42X3x14/ynCfG/lBupWNjlc3Ec8EMnI3UQwYH8wOZQHfIjeKKQidGHFl+GsQ9gCYa746nkDvBD4AVBFJEfIi/la7sbCUUBfFyHt8PQOdzQED0NoSuoO1B66LS8OyWIyxeOx6fuOSlYjjl2KQEiIECAHfTPc7q1BIiH+rkoPQh3mvWvbvKDBUF49R/1bz9/Op0QIVxsNAmdAhDqn8IeJcejVjQEDR8LmAoEEELwkf1i85vouf8y3Gx060kyFfP5XEAQMj4bQQ4d2wOaxdpt/Aie6FJub9lBBnvD4I4SSy3sHFZLssQTgAiUIRFRre0eYAIWB9XZwYIUI5gqbDb/4JAaCpUhNH0X9ZHLH0sl11adRoSOOXYpTXgIMwm9Xq8ZBLHw4O1UIQY9zCfQ2SOeZv0Pvx9w/BC1V9/aPVgtUISMawMjIWJXW4vpwWprt4uiAz1XNISO4gRuYDoIPqt53Mz+ZT8vXgCc86tzU6l42HfNRV1XQeooIiIi6DI9S50UOd2NpY9gnSrKD6JmsGX52qyWlyMiT02AiSByCWagQ312DqteBW1OLBQgdC46p48g0QAfOtwQfeTnXC5XOLb4ZO5Xp4iJY45dSuO3NqEjiOXEsqsOO0Ks1KtAM2Dxg04l/M8fB5tgwaSfPeoqQFo0CdnvIVdCIEBwZgqg49hwYQUM1TFK27cfj5rOK2MaSIDm8EYugpfFLeXKC6mY4vO5qIuIjOI6tifXW+P6FZsAMRd77IP6vEZM9aHo/rB/TImnpooTqhyRRIFnKUHEiJwvTe8U4liWESMewaClQIJjdMVmCAa9WNyIH0UIIAmvYvHGyjg/JEDcDOOQxzHHLrCxDzZfIxJM/WFfTndnmcF2GmFvZt89k/mBBMjtzTefP3eLgIRal1DHndDVT4Y3bdTWJBEJcmzcsxSI0UmKxkCy9e/PayH3TieWNFleiMcUvwt+3pMrDt1XLoILF1y7gidtpFXPRIe6ItgiHcmh+Ihu8PnCCoQ/Ngg/IGou8DyLxovR/Db0IEyMjdHqiah4glzQRAiNwMBkQj/VHejCwvQwCNH4IYLeeLI1rAOLgS1xCHJ5jPxgIMYy/6/VuZ36z+cAIK8wDatrEN0DrQc91kT1E9ZsvtsvDeIeYtRnj5on6vCGOsIdIZtPK2Q9YALE3mN3tMUOnPYxamMIIuS4mX3x7MaFCPO63Wx0ci2ZSigcoAIgwlGvEo2BdOWH6cga03Han44o8ROKuHxEJiQgfH6oydR5xcLCsgwrytu1pUJCUVrNPyg4ggY/xmg5XtQfdBoIh74rMIWW7Uodza0OeRYzvJyPdp/A7mZYQUTrnSZORiQWojr82SxiqPQ6g1rkfemzmD5GRJa3eIwbYbwBM8TQBjti7AlZAf2H4Wy0Gb7dGcKNEUBnkmcON1S7jTc2PgbcANFmkmEC27eCJJ+TFFXzuVIul9PyalQShm1k6obPXIjI6ngGDFf1253bcBBKKNoH+izxZdFxYmpGBafxQD+UkLMsaxxXrcOAxePinDGTub3/uonBDVsyb/dg+on0rECzWf/+eWSAT4eHFCw7QEIdcfJQm+PKUiAhGkL3jLZVeOxo1W5MITSmhwA/cAs3b5/7HF5rVE3PrjXisbAL/FU0ju6yll5G53yYczaIEoHgOSQEKzFwX01rskRGFNYyhpVK0/NT8TB3nVYtucIZGsTUH0GDHjS2TuejKH76Bxwh+iOe/PGONOyeRraf57ungLP8uFatVjVNk3sNNm7CwUyOPFPLSGyvYdvNCjI8LZeRpV6nMxvJa+RJavTMTmluRpBL1W1NK2FXeU2rGgs8QMeNAU53Ny9GxvNatQa7okKNmUyerJNYtc20TPSMFbNSvlbVYAv4oUYbVpLVHH1bTctnyKfbuQ1kI2u1mqZKfF87SL6ivDZ9WKnMU6scTlfhxcNsHStE1NwErKxYrBCDVeWH3NE+UEqOmdp78g7k5GH6f1FkPDdxf7lYgaWyfH9ay6mR/l/PgHNAJUdRDrstGEeBViKHlarKSMxzNJrd3n/TpNV4vZ4+sHGSI83sd3+PDvCVRL5+0fzcK/jRJkLaBYjXVCDtCLFPPDdnFNKyJnQeSH3/1kVxlbjdgjy7lEzFgSBXQAu4gnaGmCP76QQxE7BolVyiP1wuJQzuq5mJvBwR6G8aIwTCimoNJhByV2jpqyum66rFDoRREAsoGtMZOVOCQAQkDGRaSTND7SbDS+rz57LQ/UBJP/ywtFQul2fu9Gp1yIjj6+Xy0sHBQXkr0utbZoRf5sjTPpRXtnpVnncLW8X54szcvTvpMwHCp9dhTKzMk6GRLpaRkeNweoKMG4K7b4Ckt+aK9NXk/edmZorF4vwpVr63KvYcQcTc4U9kFetb4+JQxyArT84Vl+bNTemyGcTm7kh9nFduUa4+rsxvTBUWktQWChsHld1aKTqwDGEFVZuuLO1MFZJJcuySNZFV/bRb06K/DUL41dkKfJnrk3K/jlpCy9z9maWNPxcKX4KRnb07X/m5pskC2ydAeOnObOXp06d/qywvzywvE0w+pba7u7xMiJkjuos/JyOa+9bX9aYR2vC0Bz5Ow4m3c1YIlHR/99cBHERi5tWb5qkJWJ3JvFfbLyEqQDz26vK0x24HT2hYBArzIj+y2ezmny5QsyOWV2fXjlLxaz7uhAJxBbsDxAylIwc4XVd8uk/3h3+XSi2s3c9g8Jyn/ACECAIvV4sbkIBF24QY2sMIfFCCjFAFEjTnDSpG+hWNokPd+WR5cqgKYwz8xrr5zfMeqQ3i1tu9vcW9H/ZePuzVcoZX731oLC42FvcaRAz1+Jb59Epjb3Fx8YeXK3d6rE9YfbvXaDSOflxZPfOgjk4+OYKBjFwWkmR0TCQTiWQ8mSIL2NTOfOWxpor9nepuKbPysYErgTEWLJFIwAUfwMfhTuPow8N0r+GSSc9twB68fDuZHm7UzK9/PEomyOBXIMsCuSWbkTQXujVgex/Xx89CABGIqvZ4/m4hGU8klAQRxl+CR3UxlSwcDPDhmOsan1he2igkUylcWyJGlniycPfg6eO+x+fBtNi9D4VCIXn0ZD3XV+tuNy9l/kfd+b22kV1xPGC9GGMYGQT7EigGpVVC5TENfdUPsBBYHoFgpKnKWOBIFnF3IAFlHlwJdUTTSBAY2YjVDytW117Fu6SrbCBKnM02a2LsDYFl185L+x/0Zf0PyJiec+/oZyJpqgYSH8nSGJurOyPpfO73nHvPhS5mJOgeR0zksFq1lFl/+ngrqIe3MLiyb95TZCkuxTUT423LZL74fP3h42+SK86PAiGM++7z5cYAZEwQYYIPk43JCfjPRve/XVxu/O37T+06z8VwYfHZo7Ozd0236s6jd+GD4OQ3RIDMTUy09knUqgRP9AKECpA5bZ4W2fTqHG1WgV+TbPow4LtEVoKMackPzKprEsTaR4J0GFkkjms/qPwIOtlm+oMGVW12lytaJvygG001k+jjVnqn0OCsrQOPpkDoM/CDrEFXHrhH+doyNjcI82vffmUfoARiFfT3AIZ0csDbZ/tKldGfBITCm2yw/8eQcUZfFQqCECj8c20QQOzR/QMB3fT+JjvsNEJZJYCewkNq2hP36EGsgldDgxeTM+sbyXl9QXpXNC1jRQBO6rh5OMlDGybTI+A4EKiuzQ+a98aG03JB8B0cvNoOj/QJtCVV8F+SCM5PQh/Y6o0Hb2B4whJccaUcHTIuZ9h5xIcEZ8C1bJrsAOAT4OI8TuqfHcmwrmixVCUXnLbDWfAJq7H9j03pBoh7LRNAhB+mYk4drSPh1FocLhLnJ2ax4CNARJLiu9BFfSV/nImKLImiX6Tmbx2B3cKfzOefPcXGPoZIluvLRxQgF7UcyFtiA5eJNCYpQ7qTIM16il/f1FvNhGE3X7w8e/fS85leBTLTgRQUILgIpLUg5WL3DlhNUaLNyqKleQEw/5lrLN+/az9PK6Uxu72aVgI+r4cShKzYI1OyxsbaK/165EebHVRDnKAv84GLL+0lgy62nZJDszndK+AlfD6OO5luz7girzRubUkRzbi2AqH0oALE4RMOK0cjhWPZlW9/3Lr5x6B7oLS4Bw5/QSgUfsoOSLPYt1KkCj72Rg0NeJ8Xs8fQ3MKC8CY/P6DP9kSFuAylMhwgi9k6Dy7WQh0ZGM6gpg7WyqG758kbULzj0nOVECAAdEuzMVHkLKJ2jB7TSo+ga2th24Dcg3EpVfXx4ODrxdEAwt5RFYmzmP1m0Qzuy8IhSt4yDw8ASQwBCBtMPqzJ0JhITwVLupnINHN6carlpN4tsYFFsVQ1x2sQQrPQH+wLn9vV35R+gLjWMsArSVLKMR1ZVKMdCBeX4J0j2LBY8EAkDLFwEg+aa0vXeMu+WYmLkcjV2dlIJOKPROB5NkJ+QbsVueUX45ndh1tB20eQUrclyEKQjtWB3bKjiY1GH42CQ/zvbugtVMi4v3zUkwGZ+VVnwrzn1lxMiA8kAzLZsa6xN6nfWhhC9+Cd0wTIyyefnqvJogxjZN1RtV4QvB7HFPXkY4iQkzHtAX/tZMh0GyB0J1ia6loAACAASURBVPNpkkWHIfBhqUgSgFryQ8ueG22ula1UFSd7dabMWzbeiY+W7mjhA6fzmi45vIJQXx1tfb/zx59/2LsWdA2IOhiMrgcB4fTywmlBUfvnWQzOYk24TFL6C4HSKttf+m6qB79duHT5VKgnBu1dYgvt817AUW44QBjnah184/i42UIGwmRw3jzAhZZAES/PkwnUOkaezlBaxglxlivQHHhuGgARW3Di8A3wINvSYfsggCym4j6AmK++NxJADOydbQCI+RezGXuBHWlzDOFITpGQbBhAGNftchUcqtnsJ6ch8cSghWkY4aCEzZWy8/rCA7ZgtlSVJCxI7W9eZSpFCEI8vFLKvu+anoxzLSPh8CBXjunY8MYZVeHfARpmFA0cUQzkXfTDBQA5J2dSsXkdvogFgPhnr/766tUIcCRCyDGLd8qQ6+QxnintRV0fXoSwm/e1JEivS9YCVggPDSSNpiTpAcjzZ3pLpbOhJy/P3iU6ZrrjV5QdXRghAJlsi5+O0FV708RWQgQEyAQptLi8/Oiu+8K5MgPDsM7Q9k8HBR8PCDFRhIyNTU1hmcUxLJJF6ot0qo6WkS094KvlRXzU1FjY5SSTEHH+vQYQaH3ldlkJ8B5oarqd+LhC5cd4CxutorsmcsfUB5l/ZfWYpi55fQV5xI3QjfM///tPN4bM4WHYBwoA5PLp7+R02NY/4K9mfA7SxwWhmu8rNRnjUfoAWls4DVQGJjds4QpcF10AueBMUIBcwfE0dY28A8NXXjwE9wYyDf8gr2d1LJWiABkftxDvKFGD0S8GjnhJa57nfQf1wQqEWUxlvJ5pj0/ZCI2aA0GAfPKJGXvS7AaHMTqtD8QCB2/U0ODonDOaykjEA4sc7wsc19GOc3CBHCSUhRK5lA3r8YKsO1sCKYOqDNrieSmngOV40OnYOuCVj5duL77foaIBAAJSDOSDDoAwbEitSYCPWT8QDq+aHJdzmELCgJaF8DO+rgdy7OY+BYhfPAYt0g5m3Yq07ZYIBEl+BGWwN18AQOZ6ENKkRXfkqiOGNdke9+NE3mv6zsPovHv/H2ddeY7O2lczHTmPma5yJloEq6uwSrNwcDuONdfMglAFQgDSeP5i6bxt120wGFlnOJZ+cwBO3mHC8JV17ATQcWI6IVV6x2hFEU14WNshrHELag8O85TCYT11e8VtpwsH6NRyzezBb8qKsED0jSY2ehRHtyLRBIiplQaxOkwer3CQXh3t4+tO/vX13pJhWLpspxY4XUCXX4+6+vv7tOyl6/a9Pnmtn582MPadukAAoqwtDppRYQ8BQKwOrw6AGIgCgavOSXUllwtoCXViQkAAN+l1YFYEV+EUw0NdW1OBWD2ilDveP64TD6nkmnaoPR3u7ywOmINjMBKAWD1epTwSQAwaQMxmTpQluWk57U5u+BA4fJVfGgQQA5tQUTOYwZ/yklJZ2zk6SiQSRw/SVZk4fuSuEKhmdcQvGPdqReZxdA8fbileS6nb2Ww+v5auyVTSoAaRa9n3u2cDYycA8SNAhoaw2HC+GocORlBsSPHdkqpuqKqaKmXiEuoSVE6SDJBjhra0WZEAIMCPyr0H+3Ul3m2iSIWIP15Tk+4PHsVafPK88a7iu01yaIVOiArpFh8N/AMM+hvL39/Ql0W3/+HFy7+fkYRGd7nEmd7JWL2BLLoVSFv/aHtddYkQzKfPkfw6YQiRII3Gd89Gmmj6oTWI0eYK5SuKAF+0aZyOq1V4d9CnMSyq3h24orlzK0bKcZiqVNQYWTFAl/9qRpclBWMlbNjR1h/d1qVBTkgArSlDPJoO8XgWBGVnlLQlY3Pf3Hv95zvDl48kUocAkMvwQv2z4+5oPeClde8dvkA62q9Vdj5/KGBjhXp24CvbEwgQEwAkMXTcsYgA4YAflXw+v40GPgMXJ5RxDm5NyeHUI9Ak4CV3s0OjWAgQnNTgkf7ytHi0ebQDbRa3i+qeurFBW6W2vbpkHzSJ07jUVCDl/0uBmEXxi8+ebuBZlXvsNdyfvi5nQ65BHbEFt2sw+oaGJFmpbEfnbTayONEZXi2WlIDPgSMdHjXI0HG00b6aUniR5BJy1VIxFprH/QjsrnCsWKoGsJgCDPH53Pp7jmJRgJg5aX0YQIDb20R/EH5k1h/ejgaJhZLF8i4gBP70i1+U4qXY0DyIHQAi+mcjkVoxsZnIb5MP1UYZPgUpsFItDkrk+u+vR8R4rRz90Pld5l93sZxicw+QnmXmTYxMtoDRkwfBiVGN5a+f6XMl7huPUIDMEFnRjlO9VbfkXXkQKkCayxcvtnL47b1KiPwgSkTLgcxhpZUXN8+bAKEIMbI2d3StjktCCDWmPFMO+JlyOKZMRJSctFdtUIYgCVA785i5VWNBuuAMrQMgrM05n03h5rmOqenpMWsfeFzpiGDBS5m0UoomGsyCQ/70v9Sd70sbeR7HCzvPZGBGyMOCFOpVCzr7ZJ/mBxgCMyYlyzRz2dOAnW240HB3EPMgNyEkICrckkTkorE2e2rWvW43q9ymVTyqu0VhV257dSm3XO/+gT7oPxCR+3y+M5lMNDOJUfA6SjXaiTOTyef1fX9+zs88Oj+ZKc4dube9++Nn7aOJlLz388LoYP/g8f6SaXQ8OJWWfDZyGk6fVJoyS1y1h/P7oyBnRhdKYcv7wRFGF1ZHAKE8uTQsfm94q/kQ73Fjd3yXm5eDkWBQ5nk5nAOGkOxVr08KzE3BW4Sy1DMEIKAclDffRhyM2uwSNx6ejEdTFImEI+Fgm0oyipURIN6uAaIpkIEbXuXNfzem8ZyCkenpSCgUhI9IKDIdnia1bSFSmkqZR6BjxbgXgwHRdCWb4B3kZoSb8BrnkFOLRUX0oa/O74/PpNxtxCiwCGMp6BoCfKS0qB6D3thgaq9YFv2Cd2BMEJVMyn2ZS/K6Aom3UyAU406UQH98CvwYWwN8THs4rebKhaUrW4rovXsTCVJeSrUrKYFFDPLm7uTjGG8ntxQW3cOVJ8X3yUS2gjH2jz767ZiylYtctRPL9YfXZCLIqWkfDW7QKjmMiuRU9Pr+D087aYfFsA92v//45IzXani4EUI34KSpI29fH0339JySII35utqPVN2B9FBL1EdwEqGHfS8BwrAM+rGy1X1J8mGaUS/io5eMuQWAaPDQi8iJVScxVukgPbOaCrrV0AfVRBCWc/HhXAmoJAqkIHCo3UbAYRP0CYTqMCkBu7h3M8fWHvzrZ4eHT/8x3cGLwseqEgGIZBodZ0NLBxJKKUxSc/rLe+Nm0dBcaYGomcCy9a3qCpdA9AkdKRAZAQIsPVqe0OoZSCk8pUut8OrLA0nEZgBSPBNqU4xEAAIazx9/s6JaK3g2YnDV7yn9zrB+Hu6CAFEVCOheQXn2U8Su/m0Ge2ioB8WQg9L6aphba8YRypRFYvPTMznZWPsIOzs84b1ywI+RcJ9U3rN28IF1jhXRpMJzVbIxXi8eIX1NXHxqrwLo9d4FglQW5cuMKzswiN4JQBjirgP9AbJg7eHGtMcOx0iRK4d15aEY/NZLoutKsW1AzJUsYf6WdzIDlw2vs3rNtHYmjH0cEXL3w1+hBnk8dcVtYin7g9daHu8p/VGj9bAHrT7Q4WEoHCE77Tz/pANjwnrWN5/cqYuPPl2DDDcUyBkRAp8nsMet4bcN4VO7XtPHsuszd5EZOj9GtJFSI7Wd3S+597LjGqW9O+REvgTrWL8Pp6XD5uwHmvSiT+v2B410WwwiqvSYT5eyOayAVgMfVH0jDzBDOAVvXAmd8yBqUFjYhj5oj5A6aYR36mpf8EvlfDd3Lv/Pn3afH96LdND8BpbkL/alQbT65ULrECbFJeYCBCDkIH3xjEmAnB3PVxEgxwsHX1km9FOuROcACe2hAhGiR8utqtYxF4KPzcT9g/02p1+qLsqslQ2iHAQgNp8//mPsIjbQLhcx9/QCQfSgqkAEZW7D3fVhwLlXosLAgFdQMonTvUaAhqTjgii8uwHELFomxgGKZUxvApOqVAryqdpD7DvFL84BQQZuDohKMXGZBpVkYd3sIAuL8xSKKEAAEJXFMMGHcS3I2eXFiubFQpXUHiD4VGtZuK9atOeB65ErKujjAlothV1Xa6k4/lDL4zUChDbSw5DUezaIjhb9Ps5ramunufDTJycnmqjoa4Bk2DAA5JQw0VOw+t7SZ5VP/UN3v430qM6rnno8/bvN7Ylr7+WmWn0WF1iAkCOQIX5CEScwBJ1YWigd0TGEJWYiptUH0qWZXFgm3dsa7GhoEJbjU9nyAioaMnud4KEDFSLoKBFUnGANerIL7cxF/vWfl9sP3B1VDdsnlknc4hiHrrfcgXUVtgJkjDyKkN7B+EsTq2+XZ+ZVgJTXrRcU7ti5ASJWl39hzNw4OThA0Iw+6SCTtD5rR6gUF52CEwCSunYhgGQQIN6uAcIiQAQASDyz0rVxoji4OiQBK1qZ4ls1KWODuXIUo/1OsVywLOHADqMK8GMsms4mW4XtueDUVly8MXBXiJYv06dTT+MVQIFYR3ntwdVZ1YG1thRytWh5aJdX1zCwASdR+VbuACCAy9n8L6Yqc7U4Sf6cUtwIXm0cnXUd7tQa5RXalxpNY/kgjSShycApuqbH0um6JKnvUtv546NrTDunjGt78/M7d4aHDXOiDH6q+k+HT+VgaRGQt7TqSwP9AV9qWhjEGPi/rjHkemOEYm3ni09c7ys9cNParocS+RdH+/vAkFEiRZzappZA+/wYitw/qBLt4XGoWbvUaYBgAWEwVjxYwPgHcYnZOuCH/h9s9U5YXjByo4FqstPiUeO9Ftne3Hk+0eE7nBpfBdnQPzrqDyy37iXA8fkyFlwK6Nbr7R8M/Jxwmzmm9hdGnb7j/Zmk9WG7Y1W/WgfSIUDA/rVWIPUgTTkwCoDzB6oFS2cqhQABMUUUyIVWhBpAxK5dWAAQEs2Pz210/e5hMOxNBMhstmUWNsXYQ9/MYikSXOxs2OKeoFg5VwXje9OLEeiWC1Uu9M0WShQBS/7sVwAQVzirEDwozzbcLZt6cqFsOjoGoiE6+zBp6Waj6i6s2bxZ/g/nCi9WEDKfjs0+DF9tMQhlX9+s0We6l9Bk076oHDmlQAz71Ha+xpWBNQixC9bnJ3VUqEKjLjJ0UhjDIs05vDTdcjJJ8wys6z26KNG6mHRXqXDlAGlOneLs7olX68svjoAioEXUDRSHPyBJ2DcpXa2W8oVEiDRM1FqJUwYSaT5UB58rHsCOKoFUGWNNEJsBI3orEx82UcyOn3fZQzEOfvuL73e3HR17oBNq4ALkTqrlTo7pbNw/6vNh3yaQZj7/QSHY8pk8JJziHJQO2rX3GD8vQGxOcd4CIFgXjorPH0ivWq+NXQQgRIFcHCBe75B4EQUiYgwkfgEXFutOFOcRING5KZMXnPKs4DQBzJ4q5izsM4iZRbC9sHY3YRFevFRGwWRerLm5PB/WOQASyyioCCbX9qbtJguEZEWVUcpcm0QsDSBwuiYAoRiODxcniZ9rci52xVEQBmdKGbRH3YdV0/DRU5chxm+acrFGar/5+5du60R36hqPKVgnw7d0tdEkMvT5tfVfND3u0yB2qplK88wrY0iElKSTLibvIz/Usj9Gi2JoEHG4xh+9Wv9q+cWL6tHR0QHZqkCOmZl8AeAhe9SKwTOrH02BsHZPKFeaJ/Xtzn6nmto1pE73aIsPbI2iPSA9FOMzofNeWMy/+v3rza+3O3cxYOqUNDjoG5UqU+6zyxPmmnuliDg8FtfWFN+g0yftZ8Ot7kJKXkyrMfRqwt0RQDrKwpIJQGyWAAHTUgz44dj885mUoy1AhKELKxBM48WGH6BAkt05n1SA2C4CEIr1FAAgQ16v8jDFmWmuSHZWFLGm3TKgxtjDWRUgW4tmspfjV7eicNZiYDZ7vvl21t4ZDSDz7QAyToISH45N/nnKzBtHPcqWyVnAabRZShCADCBAWBMDwdrlxb+oScNrmCF+lU4sCju6G2MbtIoPHR40bWxqQvec4UdPz3c7h7+2ftlYLrn73e9Ohk9uNfBh9FoZvjP+YrjeBktVILWmYhTj3JLrTWER9F+N1Gptj+r/c2PYxggZylDCQbogAkYeJV+9Wl9fL6wnkslkSNbm1Gp5MZRJNMURXMmWA5JfIKOgnP3w7ztbfTaUGT10hfLuXT0QIjgxdf/8YwhdkZXt1/9+/rdI5x5btXgDVu8L5ez4WRcpw8l75QUQIMfxN2+2QIk4pf1KoeVxJR8eHA8625ahE0tQlc6pQHwAEM7CIZQHlYSzG4tTrrYAsQ05Lwcgt7t3YbERAIhzqNd3EQUCr10lKtwe8ipLphl3HJ/bCkiiGAhYNRtQi0CiY14LMYPBprl0IBqP49rm0rzWTKcAYQEgUfRgrT0z1wPjU8V4VFGi8fJem6VEQ4GwZhaCcq88VqP2s6uRqy1UoCZUgNBNPiztk9ZjIXUFohOENkqQ+7v3HJb6g/P8afPJx/+j7txa20jPOK6LuVmCYMYgyI2hBNbYClUmbO9nZIgQSLIWLYomKpbB610VsWZ3WUcXqoyxQLUEWXzARYcoTmpXPjSLkkCcyAlryye1dXDiJLVTwu4XyEW/gNzQ93nnqNOMDsauBxODCWhmNPP+3v/zfw7YAekutzyUhwIf0h/4HF7eAtEr84vlzl2d/JkpC9PxST1aZs9jDi9SG/zcN2E4HSlFogAFBJ/Qh8fTMfz8O/F/1A2IERQbiKbHsX3e0WEwdOB/RIKYqiNZBqUCwfm7Jjs0670M7Zg8q6r9CGvvSCcONh69fzESaOLtpnqXsq5js9nIQXoVWSXjLf5I8LcOl4uL//orZGM5uWR2utZSToXynmOz0ZEMxv6t8ZmW5gDi0gQIwSTiCCBmBxcv+NTD6AAQw8kAxNTTugLBAHG2D5DssL3PNBxPBeptySnLSKS4u+vhdosxv6V+QUmvAJDw03mmLmT8mdWiJxgsvo19eWLV2YIC6bHPRtSzsKjBhdwwlgNP6zcotozFxmc9CHHBvXm1qBPBAkD6QYHUEVOQUc0g+QYuSH94cuyMwyy+W+9LUmIuDl2J8kPwzJVhLGHtrjAktGoJCYL1r29CAKu7Ch6KRKwrCngoOiniKvTyMJoYw7pQNkiRd8+x/6EHC31jjiTPI0CQzrBC6ZhFNsSrYlI62SdXF7DYP+/1L+SEghJgB4JHh0HUH/x8QYkXl6viV1ItyOVPoISQG4/NUU2vJz/+snV0uGxtZmoDSY/Cwo8A4nlVPVUKUgJeeT5zODhP/t27p7MceDPBOzXy9aneRBat4Qggrxa0qIAVSJezYYCgG+qevaOaF7CU9yCZhAAyqdoTgQfICYWw2gAIrgNxOQ0IIOnWs7BobyI3CznO9QECEjI0HYulc/n09CCjUpEoAiRTFyAE5RtNTMdgDtbaDfakXnpZgWgCJAUA+QoAUjfLj7El8MXm8wW/ai45X0iIABIbolV25FN/5QESGek92zwsy7ICIBcUxNDLFnpZZ159pQS5Vir96ckNtReO9vEpWB+7r6gcv6n95w8fynoDy366rECUjeg7RagtfufTncciEJJmfXO/X3n2LICLyWsDRHFoGCowBXQkMs5BTTuPDShIFAECZoi9ppluUIoQPoJ12WRwQwZvs5qZtHy3sbV5uNzcekSSo5kgQM/hWQ1VtTGleicKbznOcZwM7r07eLy664LpJ9sD1efGQBTJiGRFA927fFEMEEcjHogMELVUDXJ0BgDi5OIR1SGHABD3SYWw2lUgLmdHl9OTnm9ZgTA4hHXJMBwuqBSN0qzFNzQwMTZgoUkNgEAzwqd1Q1gwyB12XYGJgJUmTuqlJy0KgKiOSx5MpcNfYYCE6ioQgrZ4Yfryw3mv+jaKEQASjg0xda+FZEMzOPErHImeca00K5YSXpD290r3XPZAlOAokyDXLpSer39pVekQavGvb93jU3i7m6GH6IDgDyzp9dXwEhSIKEE6+ZlTuMfjeoDV6c4pQF7fenhwsAIFgSTZzv6CwHOdU5B95TR3CZXsvAoRe2uZpWQsQ4V9bpBsELtB8ED6XJ7VpSYDgyTSCoub9/651vSDPlQYxwDhiqlA5YtJW+czu0kX91kyvnewH40VOSMiyOpUdZyInY94nF1gQ0xrNttrAiC8AtEKYel0ozOzDqfZyWUjg1oAET2QdrbQOAuLB0jLleizIkBaVyA2UCBo3xGsa6IL4VUoT1Kf8Q4AgZYxKh6IrLVPMuYA80CGL2kDREcjgAxfv3qx/+ZMqK5UIbC3ybAsq5F3y+BeWD194ciASt9+CgBy8eL1cDp6cmkDre04Bg+fl0qKokFh/qBCeyiEiKQByjr1lr5+9MMNqt59IamBNXBAgB3d3Wr4qEURPodXqkpRNujS1+gCKdkyjXbo+r87oBnv6/vrf3+3v4LbDZFES3sqgndMegNT6fFd3PwK8QNrDokfEkNMZn7YuTJuJRca2qVaQjBAppqszaQtE2vrRz9tFSaa/ToIW/SVhwP3e7d6JBwTiKZ3kxyXTM683F/xL6xCDCsZzMxVS+xUjnMggCD0aT0RJADE0WVsCCB+XoE4VbOwdCCjsALRAohsoo+1swhSGCDomxrP+Ft6bCgAiLHL6GpHgWCAmOE0ZqJtmtrYA7H39Zjs+dunu1SCArHbL2kDhLJGEUDQan4zP6U51krzS2kIIAR6ruIAkP50auhsXXTK9+JRCZZnPnG3JGRg8dxQVBQqjYjybKxrUAryx+/rbkwpy8jG5hcfBXx011MgtSNYfAqWhBD5BDr1Fa27lDT5urS18T2tO58HQdLWpfdvYWH0Kko7mn7+IfnXOzKZhTp2pxlCVwaxAATAYRa6+5oNlUdZGSE/gRBXESJ+zG4PNndbqcCPTw6PjhafDDX/dcCuHEkQo8OTq+ogZFkpwIVxyWLm4YrXFrqLM3qD+ddVd9OXiWMdU7z7WrPmarCweuxoUIEIAHGpA0SHAYIViGrtjBIg7cRgeAUCdSCtAQSysIoAEIcn3WYdiLsPXU480mazDTDIx919n162w2b7NIPS4IEggFxqACBjkXD/dbSah2+3b2lDO/c+AEhMTYHoRm/H+69eBYCc9chuviGvSAu5cFASHYIGKVUk9CpXbbThv1V3GgMbePL83hdgoXereiA1jm4RICW9kFwsN1fpLGNImf6AOYm3vOdTgOCln329vbOTfry/wvsgrb150Ak0lZsVagcNHXL4itcgZsWPlJBlkrKypAiWgBTED7ARmntaadsPv2z96+hwzd/Ci8V4Y0EOpzBlJyvikYR1PwPCKrm7WngWsPQObHMuGB4Sr8owpofSYYfRbD4uTmv3D/bJANEcUeB/0FAIKzQTdJjtGCCq14oAYuazsNpqZaJUIC09N7R3+gQA0juSAYAYnO7c4wG6nTcRAQTypT/9xOQOZ0LsKY4XhYFS7v9gBRJSB4hlDOdE9fQP/yUFxkU750jQogJRHz05ejvbf/V3GCBnHKpnlw+xAhF8jpJUBFIqN9H1FdWECoKAC/Jkgq2jia1rixDAQvToVjFB6vJDOi8+jbgkK6AK+1zGWenj841vGFJ3Xg+C9CX+8Yed1czD/WcBK0M1a4MQ0DkRt7oWSgf5Lr5mWYCI1DAL4JB/KQx1ESeCQWJ3ecaXmjQybNHFrXtH75cGW/k2iN6FOOcwGtBiVtnzm/S+zPMC5O4UukO09U7QhWscF7wVH2QJvQqCUuDehHyanzhUgPYpXScIEDI043ZAN6zspGoOMTsUQwABBfKgLYDwCsTU1zJAKG+iyIew2qlEZ0CfOQFkwXyqrdmrJB2I5qDVFeR0TY7YmFPbFxIsBsgl9+ykKkAIkg1M5cN48GA4lxqwNP/CVioQwURXBwguBEGy7IwVCEHfeLFZEhRGSa4hLCslrMzGkrubiC7I5sZ3vUTtzYh/Y+vbzz9Xs0BUACKSTcgrlkpBOvW1p7QLaWGLaz6C0J1fgtC2O8WdnZ9ze+8O0AabFnvrNkYPPPcD8DEO80TsGBzY/QAdAoEsKXillB+Qz2vHY2srGQK/OyCANT45RzSzFNDW5cXNez+9v+9r7a1nQunksdHc5eDuRm1lLxPjfxlPcg4u+Wbab2UpGB7nckAeVmas/KMI7xRkpZqdru057RfNVoCa9aYA4lIFCMkk8m6HweD05BZYLYDwIawH/nYViJNXIAMtKpBEkWsXINCN967HYTYZzG5PNhOFGR4tRmIpyuqPZF12TJBsujDGvw6nsrXmAaKlQKAmaSSDJ17124dzkegYP4ynNYoQjEKB1L9l1OjfbsL8XASQsx5sS1nvb5U+6JX4UMaxZE9dts4lxEguCJ79R9VcCgO8g45gcEUQIY0ffA2IjBBZ+ODyQambiTy9BErVS0gPfcPqzvNBMInYzzv/TQbzey8PVrx4NC2pnbWLG8GTFGsNzPP4cGP5IWRflVnnZskBkf8uWOmGimwsoQcvp1oxXEtA3Fhb3Pzzt1stdwSgBiZ3OQgpJSuGRpCWsb1gkuPe7GwnhiCthUpAuYWL251JVTyF/kwRr/PBOw3MphzEAOFDWJoeyIOg6IHUvzzKthB3GxEYPOkp1XuHp/Ma7E4NgGiuSXgioQlXoo+2tmCfhAIhKHZgMovEL9qtuF2zuczj+Qlba+EngmKGomkPAkhPD9Iz8ZnHD3F6InFaAOnTBsj/uDv/1zTyNI4HMr+FgAby48FRaDZJwViuv+sIJ4LfgsdkBsEIvWQFWVkW2vnBNYhCSAIFjQQ0Yr6crumG9hKzl2xsb6/NFwwlpbmL1z2WhYP2V3/oP6CUe57PzOiMiXFMtte0n0nE5lt1dD6vz/t5ns/70Rq8e6TjB/ZMDBV34SH6LcZLhp4BIB4hBwJXW8skuj6YuE/sG6MfuyVIl8b4cKsqZRokiDTCC4qeZwAAIABJREFUV1W5FpEHsBqFWYKj4rNz5myKIhn096OjIwoBog4jg5KLSa+U3Zea6wr4OGOv2CPy48u1B2btJw0QWEkmX5RSqdQPiJBX634r2VaoVfjsnvNWxqpIszu8ndngWdF3lyYahGz5oBXVu3UFQtc1CBbsCqbt8tGN8SuYKTtLgOitf/5x6z+rX+8/n7psUxaNRWpFC+tpeRhEiw7eKTtX+sfSlNBYNZ7APuRcqhjTK89IMCH44ebnVSwpJhAgTrUAaR/CogzZKEamdLaFWZ++fQgLQbdLCl8lR035y0zqVNtNt2QfyOUBQiFAsBINAHKCnYcVPS1lxjqaNn/GHI7yjNNG2tVzfHH35CTrt3QeyEQfHtNMDve1o7kv4wKEbJ4AQ0wf3oXWMD8XEKqwfIaLW16hSpojfQTHQCcBQvAh+i+HOWEfyM2LAaI1Jf8yiSkQ3Ej4kUMtlPZ0bb9Sty3prfTKh9zWpCoTIL3yct5eUsn7jfWs453G5H/y0+qf3g8OCjkQuBlVnQep86NHZs4lihCy+0NeFFYXItVq9eDHr/TUpw0QjWF5qZzC8UMJVcirpzNus9Fwrlm7dI1j5MrinilsJtD2ikGzcaGGqkEJuqE+aDlLlCJEYefeDV96Z7PhDpBOPNz11sLzg9evXx88u3yZIaU/3WE5AEiNTwflm8y16ydz7B9qtVR5Sex2d++YR4Bw+VmD8i+gNMHt7BtJFTJonCiQYU51CKvNRkKtdbvoQocS58L8hFYFQGzOwG7Bb8RXEjvamkmrXDJMZrPF6ra0S0gLCuTyZorwkJNl13DfgJNJ/PdfT/1uv98/I46w+InD38Y+VSjEctnovn4H6CoXCwuhzULY3XmCgMJK3hj2XnGMeRyeAAMTNDAke5m/1bkCEaqwgoaL7R4o7Xg8ymPb3THsgRIIzBUTuyeF7GVqYGQhrNYA0btz9ydvf4FWJr6P3rRbs/zsoFIRyVGVwaMqj1Y1siE9in+JM3p1/+9PvGfeU1q9NbsGAoSIDwEioyMiSs7kO1qV8MqIVSUs+V1vk8ujpIOEQmR0wbJ84gIEG6gEDwEfNdzqwOYTyBDUIQYhHyINStnv3L9e2M4UeZZlGQbbDkrlVlIWXaFAaFkky9YvT4X017cS9mMHdh2mEFwruQ483DX6mb/99WB19fWvL7/SX+Wtmea5YXq4xuaDspeU0r86PkrVQIG8eCTuYvadRDhhM/ovlGKlNp8nKRA2eq/9W4Ky7pHWhepyIKKde6R1GS9lCadDLlqng596ZFYBEF2/LfBdIna6PBVMxnOLuXg8GQwGk8l4PJ7LLS4u7sXvGi6cM2EmA4Bga9xL70S3Jndcw+iOHyoeH2cymePj411y1AfezYTbXWIaa3yHFVJwNgbHAoqHQvgyC3OLbzbCMg4Pie3A/Mzz+WJiG3mk/4CxLAMBCCiQ2MUKRFgvxdM84/F4hN678BBDc0WBIZ09XcooA0iLiDXVZbwX9UzeuXMNzBRJ5PfBAXADGFKt9FaaFEgLajQjpeeP1f3n3zerSnS8+3Zr9f2oSA9hjArlvINN9FAyBX9G2gOiED4tHpu01RD4UcWuRZquT33ozY92UinO7nTZaymOR4acCDrEaDAQt17xwA2uoDz84ex2JlGM8CyID5Lw6H4Hs3+3YosHLYtf9ctz6bLvSqW79dLebppxcZH5TrZxGf1PkB+Pf31090pacBwdd4dpuyuSk5kqUabCcQlOTa10+FAMNWPrJmzbyL5Q5Mr11nne5QT+sTGvVs1/t6NagUhuvOUWCgRXzuHNEOOkQVcszJ5efB4AIAtOYjvGLJTfvDk8PCyXyy/KL/AO3sVxVC4dnv5y8aIbAeK6AkC6CEDsA0gQUHQsGTzD8/AZgIMMtnSUj7ctk9eO51bgvQjKwUYPkJ7LoEPy6Sh2zezs+tRozfdi+QUXg2mGm0Poa8KwAJF0ZjoMf+tDLRZFBcKoAQg2MI7m4cnC3D+EJlUeoEgItdJ22GvuJHQHCiRE3HhbA0SjHY9955n8YtJzvxi/BmtlYodF0PH7KhEirTnSRI56eAnrsH560LxdWAPzyNa+uAVENsRs+qCcIBJDGkezApG7q/Sie4lwo6wOgwfyeO2JueszGJqJ5FGKGx6gh+12kCFw0RaPN08KT9dnZvxuq9VChtVqdbv9M1lQHplinmc5kjgXJER3X19fd9Ouc1F80ESWSDf12Ja4Sb2b0EMiiA6beh/Nd9DEVmuceLL2eHV19eDl3autj8bvrZAkCFeSe2Lo3XtFECD2VGl+Srw2jd40n3K5ak3VuibfLKaC7EwkaWl/EeNOdLUKhCIA0emcESmKJgQzKGklrzf7s5k5BuWAzbWTbFNDbPSKANH1MwCQN4cSNcRREj4AINT/AyB03wC2fnEx2EmZoYGCNNyClAAQYD0e++9kuz3X6PgXBOHgcsIvORw3dDfEWFY+HYsHJzrSDrAS9eZWiAi5eRPmZ48D5mfQNCHkUXDiA+VDDFIIS02YSKO3+GIbfMDhIKkQbNYBFAlgvC2zGO4gZWOQOhK2BIhWbw1uhCZv35n0zCWC12C7gmHi5y+rlfeoQSqVBjoqcguTM+hovlvd339pVQbtKL0lixn0kTo0GggRZMdg/WbkbFQLO9kqAmqK7fB1hvT2KsxNsA/INVB1v0UUS788e5Sy0/TAMK6hgSGpEkj3zObJ9nYhK43pwvbeHiiP/BE6e2CH13oSvLu/W3RPRANeWbqcbj7oxtfqoayGELEx3NHssvqLVGv2Pdl6/PXq6v6zb674Shi8SyXSGT2VmG4kC03r0XyKA2VWSk6IPnyau5m5FAdn6SgmdzMZj6+Qbeh8/qFBxXxFvLCcTvUKBABSXvJiNy+N2DiYJKmwgZe/cJIIuQAKDpuLbZeUp0SA3Lp1Yyhw+ObtGYCUyzQcHACkqz1A6KsBJMLZsd5bbJpss2EjSocNngcs/R06B2ZY+LwKIGtgIZFciXApWNPAr98augG/D0KEXYhsRHM+awemanhCg7l0hME4lseDIgQDWgwDj2QjGvdaPgRCBAXiYFQBBAhimohH8wEmQOJYaG0iIiQ0l45O+ywGdQkbI+mJflMAyLm/YgCxE/JM3pkEgGx7r0GyVzv+s1DIW+klFJFESGvhcfY7ler+Y1xuyp+OxuTf+2l1VGCEgh8yHTLYDJFBRQq9R14K1uIR9DRMujAZs/a9Sdv1WRDEOHXI1ewAkGE0XYLZESDCsUd8Pp/f2EhvpNMbG/+E+5EjrNdKkR3nMOUPDBAB0t0vr7ySoYFucxDmCNJDCGc50YLXqNpFQnN3+vkB0R/wSlzxutaal7AOy15LFfcaITRrIc1zdnuNO5qq53LHt4sp+MlaaeVUtrRdjgl+jHziVM0JR4C41AFE6EgI6iwym12f8YMmFCShxWw2m8yWGcDHHHZsJ/zN59qcCE1dgdzSlZfevj19s6QkiI7cuhAgXe0BYrs6QNC5AJcRths2JIdNwodNAIi6igoKETK7s8BxGMkagqc35LCBDmHYUmQlFvd2cKFSgBAfIGSBYQK4zHdgVRYOxsVGVnK+3343BCUokHfqFAiIzy69yRuPboT4ALY/Hxu7jQyBWR4gArJr0WdVtZpCBYK2KPejcHrO2U0Cp3Q6OucZI/xIhy3XYaYyvtwi6Q/8ECp6K6rZIYqVanX/4JFZ4aWs0buzzw8aAmR0ZPQMPUZEhozIGHJ+Cv3cxL4oQnoa4S2yB0RLfRYAwZ5KO6UUqcZFhNBOWHEhRnCw5CghUxAepOoKN5pj0kMnhZ+aRj1sJabV++ufwtH3P+7O7zWNNY3jgQjnoieggnBuDhShNrocY9nc63ghgr/KLMZpuomQTRFChRbcuXANWYVQAwWTIJsfTbWn7iRsE0wKNaelkOYHycUppLSnewiFXc659SL/gCL7PO87ozOpqWNi2ZB3ktTYYMw4vp/3+3yf53nxMJCyET26593dtINJNr2ifpcFW/jV8s6Tj08+7m5FnOdn6GoJg1W+eSE15ugSL6/BQ4EDslZDpVz9pXZuzIY4X8DHJVcakzW8GbMcnDouuTSqKmKGCsRCANJSsIwuEAVijRbXXxwevtjAMTn5NEbG5NKskOVYmG3RwM/OhFtNb04ASBCT5qzMh9+Ojn6nGmTvQ8MC8X0IUAXy5UtmBADiPbcCCeC+x6DFiPvtFT9hROFG1JvNZksr6tYGiJD4TLqUDBE7xGi0/oHoELiMs0JqetTeHkLCc5m8kMyGgtjg3Ww0X7s2YCYIKRbGO75sdMhMdLVCCf7aQqqYRIYARO7QUBYKEURIWE1xAQHIDQDIswkP3TiO7k4qDgd2104AP/rvDAz9uP3/bcVbR+3D5bWaaHyU6/goKyNYV5qCRHIlACDLD52Kvv46Z+Rvz2t1A6SvT8rBqjOkYXfIw1i9ii5YirywK4p/vm+SaVz583LE1XVpxuhcibRCpJXklgCNKgBG4AiyAVgtwyfGqUF8BEyM2LRKbM9+CkIY6YtBgRADtsvCw4AIEXe6xd8a4t/F3aqR7Lq9+Rzlx8df3453IJfatpLer4IEmQ8tPnV3iRtohdf5eRAgP4TSjS1f7A8yPEdqCWVd293xEjk5nDA5rOaNQD0Qny+bz9lbKhAACDlH0WKxKEzBIMIQR6kEcxyGE/1GK/A3mRpvGWFBBcISdyq69/uRjhJk77c9tEP+2xAje+8dagHy6Ezt3LEOBBUIJigHswivg2w2lOVlI5lMlkrv3qteUmjtLphV0wLPB4kbYjabjQCRgI/lhVR8uJ3Vntbm9ISnM4tCEh4LEGI0AkMGsDyE5ReBRp1dOLblgUgqRGtzEYYQHTKE3UZEGRIMJhCYagEy8Nd/bIy5PINjD/5FTM9BNDsHw5HYwrN/wsNev44pWOtPL0aw3nZ7c6dCg1eVshjMKve0GFdkLXsrPbXK61d3bQrBZR+8t7z2J1KADmAA/dF3U8aPPiVIGh5IrxTBkuOq/Fk+2GcZYZjGW6msPX87rLs8ANENwwqcYy0m0dCmUkRMyyWihAmgQxKw4I8w9Z0GZS44cUK6G9m89RgWfSAZRWjJOt4K6ImWARbBezP0bm5Y7WSBi4bdJzg+vR3pxPtZNz6DGszHzQsbg10kc1mni/zM/9HHsvPJwpFs5VwQuCrwdD8dk1ZlmrGFAw7ODRvKhx0qFQhWonMqANLlmaYKBBOnWDbE4giBNGQxGYy4UWIHfD7dWomhB8KzDGjI6I9zRzrcIOkoNzycG87hR248vkKP963KuQlASAjr0Rn3RAeAsCyq3anZpXgu936usPBo6dE2jgU8Fhamp6dj7U38OmBIZDqTT2J+uZdM/Ea0Q9iQUAi3l+aqtTnc4VghnUcdQu15fDAvPNRCpLO9Fu1teSBypeQKT0wC5hIiQ1CEDGBaVjETaVU/gx4Iae175+/rG7ENELeH/znE8QLG+vqzYiLqH7jRfx0DWLOxC1KuoPPQdlg9MhXS0xohssBSpfZ6KyKPimo0WufE5k7tG8oGMXiFEOk7aYMomdJHxUojh1d6JuXmz+d7GWfKoIPO7dteLBvE5lndB4IwijxcxtBgiIkxmQLw0WBKY6NzaaOougDRy/qYMEo7pPFFj+ELBkNYyA8uVJxTq5M1Nvf9zd21J3CcO/9KesjBOUzYBYAk18NaUcXHX/LVqo+dz8fqWNBo4V5c9bPzQr3rlC6e2ucCjI/jH6uqgdSIJroqBTIyTRSI32rt9jLk9KMMtDBEDTJ6r5WIRi6UzMRVuMUEILgSSPyEBSsNRx4+MU/bbnc47A67rZURSwFiAIBkRs90wm2DhSTrY0yB4MvDCRcWpzpcHjJEg8flcmJ1Y5tTtYZM/PFCXshmybTvNRL/gktmIm0aZWSXTQ/hUVYMjB0b/QEgSAaesKbTADn2Ztsu1oNn6PSAWJCCWTQvayjKJ1OxVmYNrUS/gdvVCiVBSEzhMZVICAkcUeyY8t0NbOSeWHwxqr0YwXqtc2W3UsMJuFaWpuzTNUj5pAQAfGDurHzlD9e/zf1quXZTrOkQ8XHSRO9tQg/x26tlOcPKPWokEfDj+UP3JRIgeCJzMwfoj1vQG5ciT5ghQ+UHQ/hhwQhWXVYYxPI//FAWglCxoWAGvc+E0NAzBpP4HdEyGMXgcAsplW9wje7Wq61dwMeTtV871QtA447/ss+h3OB/jmA42G6ze6anQlVgyn5avoOtLo7F6AEsRpd0iW7uJcdZcEPyGXUIpACxqFIgbgRIN93pF1PfiHKjHDGZ9DCsfm8A8FtQFfl2hPO0YIX/SdGNV9OFfQe0XWpTGESAMGcGiA4BYjEFsJUJbS2BxpN0QyOuDs/WspwEszAClSV9EkiBakhYCp8hE5UEs+KFdOkAtB8i5BhzFZYinTRCKEC8ZwBIQyotPFoUKEPM2O6dn1p66vnyqaN1IIgIfxREi9cbRdxGaUKc0W8m/zUwNJSYnR68KGtl0s2khgZ6uYGO0+fs8klnHQDyevO2Q7FI0LkjWzs3JXpQ4XFCf8jzsBr46OtVFBG2QRAAyO6bu5eghlC5JBx5DGvwACMBxOA9xhRLvZcwRC+pEJMIFy9DasmlHN5umaPOyHz0Zqm8IlwM0sa3mDu8XywMq9Uf9ttY/bEGANndynXq2naMvwvNg7Cohl7GXbAOdzqcYwUeM7M4XlndHd6mxeh8XlrKOGYEDkhTDS3GVV0UYhaWRY0C0bqnRQ/E6iXlEehNYbEEChDCbQbwIWADclV/5mieB/wEzrsfiLYjCsQCCuRc3XhPX5pTFwNoSTIMELEqahKb2g06mwN4NEdKTRgAiBceavuBrdMAMQazZ2wXoiF/LUilYjKIjbLMZn80OLUe+aJ7pKEeSD+a5MCJAaJehuhNYJD52sB3SKKokIp5LlC/ppHN3RopIhTrQMqnhLDkLjup/iijbKnUdt7cd9kUghVmk91ara/v216Kjt4mibxNFIgEnKs0aFU+8Tt7PjfWGzm+6IDcG9FoLhdANLb36QOOY0R8IBSwJ7teGiY9apD6Vh/kZ+olICc99EYETMEOSqJ6aAt/DIkE7+5Sy4KxxowaeYP2OYlf3e3Y+1iXS/E/gCyocsKc2+F0uV3uicx+1Yd3rCqemjuWD2GwK1SK05nP5knzpN7woKDSD0APhFWZhTUieSBZHKEgFslx1AoJoDCxMsGp2cmwSq/ZDgDBhT/H/xw71+k6L0CIB/LVAEIvaIcnnhGCrNdoJZRNxexn55FjNJ5OsgHvMZEzs53sTWtvoxL9VMyhEBkvFHmx1WKQfzk5ZmvhgQwN9F/v70ehQYYZxzX84iff+v3RBAhbp/YCzXTD9z/V0AkvS3UgJ5f8kjfSjCzAj+V7HvnKX6NzeB4ur9282tf77Rex0SyA1df7DREgIj7KzZ5O0wE6aOuWo+uyDViTpA9IMi/BBsmvpcWBeoYgBEsNQYU0XA7ridpzRQFhE4ZItYT1llkMiYwRfqjdV8XmuYfVH6A/1j69zek6JwNHtgUQYAGOS84NYj/BwbHJPGDBUuUWV04s4gG0mId1sE3nTudEHkNdVS654m4LIFVVabyiAvHura6uPn68CgeOvbyQZU2UH+tPVWdZ2hAgcM65UEcAcuYQlubrA4S+VpOLfDCAKYPs/FTm7Mmomi6tPVwoRknBDcsJqQlXhwFy3LqZYqvXxDYcS01F/aAehvxRuCqc6gCCKcA0CRjhYx4i1S9RL6iPYpvZa19/2G/9e6dSt9Dl+bzyO8pKl50WgJR7amvPN2855XOGzub+y9ZO7aaYvat2SOWGYhGhqIfEo6z4zRXa372xhQmWolSWHzq1XZdvOMcfgwYJ0J4jjU0FaZU58S+oh24yMHq9wXBaDYgyl1cGC1F81E14kR/sfv5/3J1tSxvpGscDnXdrYCYgnJelYKiBdVP2A2QSOCGQaCRldmZTmoAnNCAndAs2L7INEkFMoIc8ICRmU+PRY600WAONWF1crYwsLa2tpadl4XyBvOgXiIRzX/dMkpnEjNNm3LXe8YW1Gsc43r/7fz38r6zKAx1pCUD3R71eh/orn1nDH96+nueRsBj2HKS9iB/j4zNLuDXk+GBJvkVSvmwlx1mtx2wmIuBgdxmn39niW7NqgHBuozozRREgrqMH876P2CeZMpsttM+fymOCmDzLTyZVn4fNY8VZrEDYv1qBOLOQRHd7zhQgOsoxAT4veIYWW+yt8p7ypXACCS567amX0BIgeCLhKTPRVVwhHZxLhFwDPwyMhMKZp4q8FAAC/LgZisVCwmLwAyndWKUYT2cjgXM2b5Wg7C+3cQVvVS/dtfWynHq7Cqk2Sp+eb9yQWdugp7uxUV4YPSVqdbVrTv1ytdoERrWjMKyqP6m8V48TMeYLyA/wdk8fcB4hgmUVRIhIAqxAjCZACE6DywBibWdIq/xKApBmIMuA0+cmiF9BfwnHHmZVViSQdFDgR6m+98eKpnXUBL06FfYgfnD8Az+Uxc9MgsEL+sBRtO0kR0fiPHqRhj2JFbgCIlAIf49Ak4vF51X+uTlSABBVM9EJESBM8bEPW3YLSo0gzYFUBRxMrMPsZkp1f7R5bJ/1QL6/V4D4egMIgQFiEgBiO8ub2jb5S8LjsQ71u7nKbqDH3SuVh0SIlUHQDmqWBLU0JxL2ChAdYQn8shYaHBgYHGE2C+M2xdMiBsi1H+6uYVG7X2yseDydzq5EfTAa6LzF6aGXENdhtT3kH9HX9Z0KBAJYjxwWSvIzURZhDCGuwOpr5NC/U0EPMYMuAKTJj4YCaTWoiAKk4UCPP/lC2Lh321/m0xXOw1hFQBggiCVmug1GXP5jwirE2OoEkZmXSN135R3p/S31YQQQIYaAc8owxyH94VM5RNdxZ2e7tFCv1RdKf9z3aRubNXuhwWMY6aEHUa93ZnV1cZ/PDZuO2Yq8O4XQQckz54YGtTS6DwhzdJP99hgpkMqST+X38qkHiKhA+pn9FbrtT2k+Hmas4AAzm/aqBohvX5h80iNAyCZAdntQIBgg+bMFiI6eKMyy6JZmuHAh2lvME1vHgzfycTgzoVkWRAqQnqFE+5OJ0JVBJCsSmUXnaQC5dm3g7r+n/XZfIBDw+4P+IFr+gNNuoy0aRoc1lSD/fLlXq9X0bVKjkYeADbxW7ajvhW27duvhv5zyEcBmx0+/7d2uy6NXYhGvCkkCAaymAqnqWwSRwEy40hpmmnBZtXr55wBFXEyA4I5C2B2NhkZzoAFCV0aD0QD5bqNbjGKJ6XXsSdIZxWqFsiTt6A09YsIMARqh/eM4x8cjKmsizd77D/dK9VJ1r75Qfqy1owRFZzdZBJBhfn/FP7O6tTj3Ow996OF4u6sHZVuJwWBblo2Pm3WUI7XMYgWyH1G7E36WAlmKgc5w76+0p4Bt03kWfhserpiyfQZAhsH0iy1ENACI1VOZ6wEgRpeVCecXzxYglHdibVYYN5yJ9LRDEyTtn4qBCbE7vJlSDe1TfyfaKRCYzpDKhFwwVTG8+Xpc4ens2Avrb4N3p4I2wZuTEKdAyudTnrcoifP+81qtddRvHvxFZjSSEE0p0Mw7lH7d+JEmyKaPNXrXNrOxvXAdEuhYf0iyG2oCWN9dbrCi2pIfkqsRq4yb0xOFWSbV2q2df9h1F3URpC+LCMK4mvxA4HBDCyHmh9DJAUEsDI8mP052xWqV7TaWCcsOsS0RHeIh7hNVWeZB/7hRLpXqaI1qHb8Sbs1IAfrJPfzR48nVrVfrySPoLMwlknT7jmR+e4iHgnDQYUjN7IbBMIvL7fvVVvl8lgJZEkbatisQtFeML8VYoSa3GFX5rbECEQAS7OnV0gIgjPVTbwAh8ZQatEjFuCfa9Tl4CcMKUy2IxnMp3YwE5UytQbetO5SASl5CW4AoV2HBFQqNnkrHV4oOFmIjkAsPJV7PKMgIm2DnfvM/yTGtfpA/ZdFvyxDD0rdO/M335WGsqoQg3/wdzAsnaar5k+Kx3GPPyqXRUQSPvm5tgycv9AV9AkBkeqPBEemV1KQyqYrt5H99qb0j53kiiD1bZBuJECjlxc0fIj/ACcuNi3ENDUvEftHI5OSMumRMIdYeJjd+M5kgee7JcZW0ykm0FB2F5nPgRx3iV2dwy4+l3mGP3KP96a1Xr55OAUA4Nj/dfoEkGZ06yHmGPbnD1EedZbHAHiOA5NgHqgObvonPUCBzAkAqj+mOnTGSn+UAIFx7ol8xB6IJQD5iKxPmSwFCtAAy9aUAIcyO1a0tmDUQtJsVz0SpImSL3OFEt1YQgrQ4Z1bRWpx00t0RQpL2iThj7f/kCiWebGnVgmRW5YVFUvbxxa3FrfX1rXEFywHC7J9bHhkZHLnJJF5PKpDVHq0I80DSqg2EzsX+RMzv7NWxF29r424Ro1qV7eiNBDbSH9u/3ZEWFYAFg+POw73bo1e/aPU1MiD6puqRSBBpaqYmahGQTTAGZG8jaCZ0F3hRdijn5dwiQnASxNi0M7HiXhCRH41AFXYzudSOEWvTEqXxBNhRy2RE/ADnwVyOLaYCqnKRaK+4vyPyY7RUXrGfBcJtUZiMjiTI77vrb948LfI5D8cdJCfbvxcBDrlYgcSSPsIGQ6cAILHHqosw7QAQq1GdAhEA4ukECEEFkJJBYtHN8Wsr6m5KzQDSsHP/CxUIZYsWMpl8Pp9JKrmAkejlLsIAGzeTkM6bbIPMxG4BrUxhWuGOJAlbMM4y/UMu5p62ABEViMJtTVr8KXR5mUzhxbq3+51GmL2p5dDI4OBpAEF3e+grBIiO/LhRrtf0smBVRwFvtdaqisKbd6mzAwRptY3n9esCDvr6FHExCm/Sz+lrRbCkvKqemALB7wgY+aZeKz9ykLoLvUhLIF3hRXPeS7j8CkkHmD5qxF68RhEgLUss3FJ4QhRLgiDsvQGe3zGAAAAgAElEQVRpD5MQvYLBVXw8oq4Sl6JvPCvvCfID6Y9H9jPJQVG+Ihjtuvmjqddv3hRi6CXI8cvZEw6toCA8HmyGSDuTiRzix/e5eFT1fSEoEFzGe9ouJCgQKwDE1nlsDsSRBBmCVPQDdT0O50WBCAAx9AQQ0pl9d4AWzx9OOxVkg86GAAKwY5YVAJI+fBebnWVjmUj37DhJ0Aggrk9D6LILqxoBhKBUAYSiV+Ix6CUNbxZWu29BBIUAMnJFAEhQ4e/EHsEAuZlIfmWusLY77wVHxY7iK3kuQpJeh+lN971SaUmQFO18Vl64Pgr0uNp4yCSG8LG+q6Oy/x2VZkBk6keiQ9q5JlAM52K2N8YoQnfBF+VYKfKiCLmEAWAUyAG96KKfolEy+BzYcal7X4hQtgsWfmL2w4TnHlbS6mYrIPnx087zhdsCPkrvH51V0vVjchkcxtF5/vWHDxme445yfP6kvCvtL+KhIGwl4p2Zgjb042N+Sf1OalcPEF13gCApZEmt5dxWA8JxMWJTE8kGgAybtFEgTM8KxIDYF/7iMl5qPPWOZUMhhl1+4leQDTpbpIgrxpAC6RbCouaT73iWYTzhTQWbEgyQsGvoiptZ3l21aJ8DUQKIPbvGelwuhk28eDPeNbkhAAQUSAgBRCmJjgEyMHL3awOI2ftyuwGQaud+LWbPhSN/M+9QfuaXDQEhKItz4n3p9nVARF8HP8R/9skekmQJ+orLl1uKQ6ZA9G0KRGxaqQke9Ld27th0Fx4gBGmLxmM8OmRjPBiE5Lkb48OIxIjVaJX0k/fLutJPIIjBIPH0NRjRzon4cVDMBlRN36Qs/mcPn6OzQv1yfWHhv+/f0md0wxOW3TVI/gzzsRcf/geDB7ncUfKkaSNmRxxrFW52aWs9z+KphUcR+1kAhAzMQQmRGwBCnLBbLM3i1jZuVtUwYEKrKiwBIEMIIEs9AaSfCX95I6EjshyGcR2ee0qG4wQBORCcRE90T6L7dg9ZBtwE7z3ZshFKORDWNTTkCmloh6UOIIQl8n/yzvc1jTyP4z4Y2DvWwEwgcA8lsNLMUjv/gTM+8ARHR6ZMdIVGSOUEqZRC1gdZg6sQjFBIKqGx1jY5G/vjItZAfkxb6CY5UpZbLtAuvVv2yD+QB/0HDMN9P9+Z0Umio20S7tJObH51NDozfl7f9+dnaV7yq+lVua7vgVYMxJ+o78UtpgDBQfR8dpy5UMaJcv2yqkuQg4EjSVe6+dY6nWj5vAPN2s7rGy6GMlgbkvHc+mn7ZiBg/cqqCQ3tUxseBmoEDEjBwDE4sFoMOZ7De6RIHX/CY0A+5wi68aqOLiy+ATcW7qBohyJCAcfQdQWihTU4bsh8cwwZ0rBo/EhQ/JGZmerrSBKUOwejoxTFdkVRlrbfP2TP7TU7K9ldkeZ8oeDmv/fzuLbj544zSghonwioCZb39uqIHyJMLez/wnDhGEi/CgQBhKMRQDq0iieot6UkWpZyYuhdX93E2llYp6sDAYAIpwYIpyqQTwQIkg2llMQPO7iEvJZzdt9tfLYqDEEar9w9jdeFyIDMs4OT/tHo6g0kGe+9uogUCJ/If1Jrxs6XXV8AsVBTswggUCKY3690PdekM3Y/wwNAkvVG2JS+6+pM9Gz0gg2mYJDpb36tl++1SzFahlpTIGjR37RBAL25/fq6mzpSAUK5chs7SzevBjQiqJuez2tthT50ehiFifXSV+0awlbYXv9GGTAqk5aDC/41oRb+BvPZ6w/tSnRFHuAG7wJNQ+6tKkC0ZFw7ruag1YkexxjSKaXXoSVhCRA9F4vF3cW5cF857+gte/unnSUIf1xRAku190/P8WpncrNvsGEPFfYLUF0e2v17pONy1LlQKoYE2ifKm/sIJbhcZKx/y2cASA8cEkR0C2kMOx3KPOjgaiBwRjAMGYZ+MH0cGqxAaN+pAaJWogNA5sb/ZwAhx7aQOR/+ludTm42ukQuSnZpJCmodyFQ39zPBxu8koSMVJ0GIoYuTgWQjs1X0F/2mGcHnBBASSkr934z6pVSh0ZWXlGuiMM/7r/kTKfNB5mMTVezCymf7G4L2f+Qf+e7FTrM5YAw8GNvzHuhjnfBNaUIA/baHMVaAIMx6XzxeuhqAHF6rtR0FOebKOhH8CGj80ATIgU37UDdlQDGg5IhA0bq4Qw36F8IPWLmNPZnJFIsQLqaBIoKqQdRyDk7rR2J0Y530ZWk/INVBg/KgBQkHz9fvTLn7yb4iEMVePN5WMD6w/njrPEeHLRVeqAZ9AJDl/yxLkFn1bqWzg5iKze6GRASQ1N3NJJDkcP3Rb/3/Id2FFewJEAsR2ZoP0d0AorYCDgk8FIPM9LGUpFourNP3whIgroCEz6cCZF0aGj4NQOA4ItnAD4/wyOqn3RayY/0bFbm3HhQcDvOJ9YwXnXth+NsPQkrei2N3x0mPIROerickJECgJvHMWpmwhjoQ02XH1GKSB4Ik8psND9V5WAobv7cMkz2glYnpHA/vHABkBAEk5rpYNo1wP139SxO6tB8cy4MaODBWFiogQg4QP1ZvH03AIkjKc/3xNvAD51ap4qOtQIyCI9ByaF1q5WtZDQoEfVH0m44NW7MlRQa0ndRpurVXGxfMX3jaJfn4yuIuIATZHNhAQOjV5LRdd2Lpoz8GO3iv9PbusItAizh4/uvMpMdJ9PP2A0flq9pVyN0Ffuw8eHiuaptyT5bmfeil+VLL1wQAyMnyb23P+CPoyEsLifyyhL76QouTH7GOG2sDpFcAmYjcn/chgPgQQDpee8yCHBKRBhFCfbRSIQAghz5aPDVAoqoCkdYnP6kkh6A8ABCkQKRTAIQN36lK4K+R1LhAh5AawXinC/Mi53eIwcWJ7ktykp3Mzov+EQyH6TBLUWSHy7FSnhchBCJVtyJndtm5+gOIhYnOViX/6Kjfnyg8T3uoDi+XZKKNUgra6UroVZiCQQXIqAqQi0UQavz1K6X59UA79nGkIKSVD4XtulJ7fHvcwA+oQKecsQ3gh1oQ2A6A6CQ5HkAPtCMjqiABftgODOLj4MCIEP3blitLrURvNl/fYi1f0gbB9JWfMUKw+wkrD1r7wH4su2HC7eAJhDjwoCkVIVD7IRYvI3zMRftrKEGAzgT5YcP6o/avlXPOFyGdkdn5QwRGH+/nIFWp+CBKdVk/T1aDhwI6IHxCbUr+IPIRS4uPAIglUp732TFAOi9eyAhimcjz/GGwPtXzwFJ6DCRUmDiN1WCiWiX6u0nvJ2UlqgrEcToFQrkmS8nEtW+QRU/KW2nPSVGATmmjkILB8VwoP2si0Ugmci8Do8n9AriI4u4TjQRJxlsp5yWJd/B80tw99JG+4n5bmbgnSkn/CEzqSMlrac/JdlVQK1JI4UYmifz9tNkVSUTndBdWzH2xAEKQv71YrWljpY46sVppvdC8HVRAU6mt3v7OOBgZhhBCD8WlP+MM3gC6XTLEQFpCxHo0+cqq7ntJ1x82zI+WFwshA/9COVAG2ggxqBIF5ll9bnNs+zhXFsb1VkOIIOAqQBgKggFi1z63NlxaaFAfDl2E4J2g8Ly4++viQsTVXxiJYsF9dTOg2K5A+Lz2+8q5zyZARmS9iCteQG/5QrsrXU44nox+GRl2POWXo8VjUwt7uV7mdID0bJ9FAkCwAunioSJck/Wg6sTq4UQ3KBDfYXBz2kVZ0JuJYVknw1DtDfp5UL0aIgFABM7BieuPYl4WG24C5po78Z3xeHXzXq4YIIMfBoXE3b2cGy0KKTyRndGfitajxLwfLKFafccf/X4pWC9XwsZLC+a9M+70mpyEKkJODBbmzBb4pHsK8hGGkQaRUqW1ShwMtHYQoO8F48pNF0DvIFpJ8uzZ5dKQbr0SvVczRWf4Edpz9E+j1xIp+X4l54XMIhI/SbWNlTt2768p/zAE2lPynGlSBRltu7Dc5AXzYbG3Xm83291B9Li5oauiasaVg1rtd8QP5ihAnOMQAPmDJiha4fM2NHSWtMMgAWurGsSqFqFjH5aCIx+2AcVIizZCdMbhALqi7Gw8/ML4odoKhJDF3eLlkCjStDrTFlqR4J5YNC5Mt0N3XjVJ90QcBCdhCYIEwY/dzEzf+CAYz8TGq9pNpD/Q+UL8WF050/Efnc2rF0kDHw2ZxuiV+sTMky7zEAgqUk4WfTQ3CDjlfGL1ycckV4z1DxBLL4AgU7CFU8I4ISQ/6oUxRgUI7ZPu7lU8zrForNJoNCqVNN4q+paOY+NkYssAIDCmJHV/Dd0/HYvBvRv4sSrwOPAdpN6bAgQmxCZ+3N9rxOPo7g3t7nhrqD820lHWhCGkK5JNiWrWajBTwkbViXnIMKzb441Nl/NBKCLkfL1G2kLHkxJEVIY/IBRXC2uNZ3GvB/rSOlmXxxvOTZflJOLHMM9LmXL67K5FCgNkBAPEfMwQ5ZzMZsCJBQOjUoXnjZe5MDxFF8vipxiZKC8nEAJH/IlE/nnE9Iq80ABhvDAVRMPG8TRenSZIE4D++GWcPeLsgwoQ3MJEVx1tilgNUqRVHXLpaJoW5giGh62lNBTNmaXYNIrYWjSpaSEQ0B/b72+4LF/iRlCuqYWZN0iFIONqx74oaK6IrBpUloO8GOKG7IODHNcpE4vjYAprKFR8s56di7oosr93FXsDJn9cRVfBFXBgoYXE+PnTm3THoELQjkf4Ivu+/rbrWysKAwxpqGoZ4ujD4LGphT02tRuvHQDS030TK89j2GRmumXLuNPZpKiNTEp7zKuUnKoLi/b5UsullZU72VJBlgty4fiWnZ30sibnyhlRAWKXqnX0CIYtX5frcl7O5/PVxYXxrgTRAfKB//7Hu9ofleEmw8MVWh/yjNlQPIJyT2eTCUwQSQxm5Odr0+l0Lh4Ph3Ppytra35DNh1ANL4nV8hRjLrbRAr+OEAHeJDEUzBc29/Ya/3z58tkzhLO1tbKckrBQQAKlMHGG3SgwQDQXlnlhLUF6JkopMPuIIHxCfYbtp7iVrSckzA/0f+VKDx8bAAQCKt9fPIBYKNfTx9uGCINhEqCmSRQcRFeaOxsxJ/CDaB9Dp+f6D/9l7/pe2tjyuOBAWmhgptD30Ae5Va4d2D9gYh7SQH4ykk7WiwmIECgVt+DmIRhKAuVOoRBHcsk0t0bpkGYXg10FbUvRWt0ZZPsgXtml3Lf72of7D8SG/X7PmfzQWyeTYmXd9hsdY0jOnDlz8v2cz/fX2Vm6dclxxeE4ZrzqRIomA6Gp6ISDmEDTTEJ3NR0glIk0qC3L6eowX7UtWA1nA7HMy/V9nQjCcp6J6sKmHgMJimI4GMZNPQYxrYPU6R0hG9+CNkUvSH8nASGmq5gk6cZ6fmbMazNyBeucbdDc85uRCClf8i7OsV8eQNxYGyQ4gAgyEDwqyOXTMeDpYgzfSRIjjwq5TC/naTOQ7j4QBBCMYCvIiVPey/u1l5IYGAYKkt1O8JaTlGSiE5+KKOq//AI3RjohqSg8DONwIeOxWPq7AUDEa0OXh0eiUSkWk2ItgaciKRQWW9tUMt0AZKj/agBaiLZOL8LDfAYiSeqhYrlxMQY+IDEIEZSQpOxKKffkyc/bPz+Zn1/JFkRivgpEpaw80w2rGS6jZUWM0oWmoFOphy/nX7x4/vxf0NTLSkHEs4RC0FbpweQZagLO1zZhddMwnLdYArwECBkfn5qamjV7+Pz5C7zaFCBcCEgFUqSZbqVtJk0n+l9L933n8NU62+8pf/fVTr3ln+7IBzfjsJx00b+08yYJs7gTH2HJ8XdQLaOjwEAcV+xIpM1EEEBMD4jLZCEUMFpHChvOJkNxYmQvPkEC8q4XN+n/nbB8PKMsGugNAQ0hBmlMFkkRoamGqErb+xQ2/SJRUCQxQA95LuFz23VhcMKfH62+xeSPCKEfS7V/V88FvFnep1W+Pxq52t8/MBg++sUirMn9YxNqYCBi6w96CWZl0AeCNMAegEhHADZiSj413JIHkBGjuOeeVClaKg6Gn8Q8EEQ9TMgR0bFFBBQmKs3olPlE0neTXgu14kmQKKyh4f4RaAdbEMmfqPmLNktVz50a62pW4x26fHkYND/ISDSAtdKOCTYdM3LWu0ABayzNSqjcsRmRwE+B/EjQoZHA7/iqlM3b2XUG45xiADkh/BQZDilVSIHgsEShIdDNYqE05z9DTcC0AWT+QddZznrSpdkoaP5x3LscMSRFZJZ0ERFuPBSVHgJ+dGmJ8ZkmrNnSU/9FAxDcWg4jeY/XEmn7QUg2Oiw7X2/d84HS6XTmce7ENpbAijgcxynHp6QdnGUavBwtD3or/6PlSTdfQBLicra4iWnnquF2iG7uKwYQuA28p1xV5ENdXSPWLECRIA3vRTcIHAcJjBAPCYn2RfBQVSO7n3ucnvTwdnkyrBHuYeXd6Ugk4nLR9I/M+exBz3CemRzuAkJc6OqeRZYG71cq6tEgfae0mOzJuokMBAvH28gDoQCCXu/Td/Rm/DMrhRgstVHdzli2KFAAGRygd2uQxEDAEh3Dj6gKJkdAkPWkz8r3kMzNxsL9/UNDw9cCZMEQGAigaTMcCA8EcBqEozG9lBYsGAgmEsLniVwbxnYCreppZmoR1mjpAiDQl5lcBRAE3dtwIQTKKDQCvCN8hEWpkkvaWoHwCW0lBSQkFLqOxqpOIeMDZLpSmhnjz3LSUQCBxgFAbLjmvencQ6Bc44AgoP6x+ApFfdJBJEhRYr/quljzp9en8P0AIGMXDUD6GPfk1ut65/5RzahZ6lN31Z31Ru3tm3u+Y44ghmH4sb+s1m6NRhxXIt0BpBXVa5ZUpDmElIEQR0eLhrQeruZrFD6c1KNer9dXX00wbN/XLRiKMnGg7O5tAhFRicGCrmGDQYol4eZSFC0YSD30w/38XDqBAS22zaxAP57VpqeBfkQiJP0c8MN9PkZahhV+zBsqepnDQVXatQgbxghS3LEwGIRVckruLT+IVPPF1bWNarzJJ4YKWB0ryKcCSB8Xx5UzqBFRr2xb5mW4E7sGsbw1w+dAa8Ny+3fQvvBAwSNoJH3dioGg8zoVEwP9/f1028mrgTBqb1TX5NlIOAAAkjsdQHh/cV0KX79OAARPDgBCEISCCDRBDtHuAILZptpiSkJjFbIEAmO4aw0iEqBHTEq9fGwz2xp4dlquYFOhFqCSR4DoZlFMYcbi2S4k0QeC+Be1BSC4K6K2mEXAGL8NcuMGBY7QjdvY36gYnX25nbTBtuLpdWAymLD+dIy/cJqN8756VjONWC5nhxOkTuuY1Ou12s5W0ncigZDlvY/e1EZv2TNeUehoedsdIN81CUiThtB/8KfxwdUGkRYDceLRWQcydNES/r/YIt0dL1eXF/YMHVFEJUhCTN5i2w6uxyTJMA4XZW0u6cdQHMa2Bme9P2ysLk2PovMDESSy9J+tA+HcJjjotUP1o6oeHX3/0Viw2t/HncxvflRj6p9U9Z/7Wm/JvN6ZvTUYNlXfPeiaGZkAAEExTvWBIOjeUVLkDqjGvqVVzJPY1XH7EpH4KZpmJ3jgDxUEIomYsE5fxYLOllM0tJsYwkQqQbFDYqoVgHBjRbJ3MpxexC6InxS8ILncdYHMezMacDAsmoD2M7SI4S9awGJSFnS+37bOZ3k/gRDsVMAEEYIgUZjXAB8P7px1LSPWg4XV0OJXslUeBb6Bk0WAENG0WOFh/Pb4eIj4gCrzz/9hq7gV7n4D3EVKXUgA6RNoJO+JmiHNEu/1t7Xa63c/nPS5YqDz1tulUbRfUWRw2POC4K8DEeSKyT8AL9qWLFcLOsirNCXE1VHnhGQzutlv6EFZIMvxACIZQJHd3T1jU0ckWTPBRDcAONbXF2VFK6Yzkz4P31PuBiOQ0lfTEYoejcb00s67yXOEbk7IyAZejK7q+1XOypvgr+4SJqZvbi5kejNqeDJ7a2swbpsL5W7qiJ3QDuEswOUWLMaB4aslQHSQtc20zxJAFvZ01YR5Kk0/ekHC3SYK9B9jb6Fs4bPCLWMOdfpBXYKm8E/nIybBrDBOd6IzHAyfAR+LSp8UQzdIO5K+t2wjfILlfUltH3pk0mIKPriMqeTm7o8JTA/zG64tnVvP0oEANQ0P6tjPlraf3vGcuR2bEaqLBo7jYT5tj9ywCCFyBe4V9cwQgV4Wsiu5x/fv2GqEcZd38axSRb7vv4AAwvkfva436k5zse9sukDoEfjH6sbdE5HoDMd7727s/DQa+Y4Ah6NFLiz4x5W286NNQP4gHzqefWi91AKSRn3nkZ/7Bh7HJzEveOLl8sFBtbq8vIA/cFherlarB+VyPO5xC1zPeX+wsN1YRfNVJHLJgQhC8IM/1wsTykU5l88rSrFsaTiDb/H736rLirJ88Nv7Hit0sUJVzuWU5Wq567KE4eNKbj6nFKtly5O4M0oO5Y1iWRUY+OMBdFqWod94r/DmESnivVvGf4uKgmd7bwX9DMuXq6SNToHP0yfQQl7OKdW4xS4d/PvyQbWo4EjD+ZRisaMjZs+wJ9ARW2PL8N7JtCIvguYvICoahSwuY4oZv6dn9ci645miJq9UstkCNJfNZnFJpKUnfcKXSGVl3Qdw7/JKNRPnbfsJoYtVuFzoYjY1lUpBF1cW89BFr80uQgsHRZhY+WLGy1/AHY444W/P3jbqnfvYtlwgSEBWNxKeY/V3ccp5kxs7Sz9hDRNCLBy2+QegBxwAQG7e/AN0fOhwqn8SXVyNxs5WmWO+gcYnZz9uLsxj4jBnZhHT9N3PGS7BP4P0Y3p0dPQSWq9Gp5d+fTfBsed8SYLH6/W43d1AAYvqwKXzHPsZlSB4j8/rEXgbriGWdfvGfN3eyzCcx+fz+cfGfJZKiBJIniTbYb1AlgjHnshE57veQAaGiaSws6TsINPH9tGmaBOYfSdY5+3h6JGUdf5YIjwVsyWet43McGWcACAyp2maogEgZcoTcfdnrq0ZJNmJ9ByKNgdcGsi0+8vV4WYFrw9Hs4epDveR2AGKxaKm5TVtDvm+276WwnkgeP1+e5Pwf9ASwk5s7NT+y97ZtLatpXG8C4MEo4L0DbTUTvoGMoYrGbI5oFVaSMAECsEgymQ1Q+lmmMLFdylmNUHMwtclGhhzweBbcEbeOrdwF84iHyFfwXCY8zzn6MWx8+JUHnrb5+/EdR0ZWqk9P/2ft7Na2SrT8FIVQKkNbMfT1x2rtZa1Nq3g9WQex1CAhQSBnMaj+NA0PA4OrRLod4xHEcRaf9fFYBYCZI+b4H1zAa7nf9TqHE/Rfgh+MAZPcfpVb7/yTEx++am6539USy66X3AJXjzjb9Ra/3x5Xlo7f3zj7LRaO50kFV0V+A+6Yj3eZTneej5hNEu70wnk0r7XRbb1zH8SFpJa/H2D5/0ZdzzDX9X/vu7bYZ6tap2EtirlXWXz4XRz4oXl94EfUMHLNBWW2gYR+YZTHgHhLk2H40p+uPeHsGrv8cJ/ZOOLgAJYe7/v745g39o0UuJxnI0pckh6Hpe/q4DBdxkd8Q8mf8/4y6roCSzID39a8Ww+OdsyRsF/tcD4lfAfihqasiEbMtaSHwwPYpgAcSU8OFJkez7ELg6AZw59CNeLE1rG9iyr08fshzCYMKY/Eq/ifDY4MunUkEikTZmd6b/BgtguoENu5fTyBwhfTd7cmVQMsVrvaArVnUwiglWhqQcAovyHPBIMSAUNd4sV2fQh7i3nMeyiSuvYvu8mBrM8TcT1jfRQFwSJkzSfjQKPTg2JRNom73T6KePFMCqIXoH9yIfT0461Hs6DcOTB4Ab4wUoelAGshxxI8Y6uOZgBcdFcwK98w4Lc1s1H4UA4z5YDSoDs139bwUjaD8GPUPIjjqF8lwoXSCTSvVGL2TzGcbi2HDu1WuXjy7NXvvViPbdjWu2DwTC9SkKxvEhwGE8wIJhBL45zlAG583ggjAUo4VE2/5rzuN+EFW33psMM7YfgB+AjSpJsfNGj004ike6987SOBjfiFh/iVy9Xt6vbTNiPyfvuZlWy3AEkDqMoFGYC5/BK96E9UbqmMWgBAWIgRxQ83C0Z9boD4SmfL6iCd8/3ESMozk4wc67rzGBRnGQ3oyPKO5FIpAdCF/7hYs5Rq1vxnY9ng8Mt+9iY3uF0nCW4B7qghi4tyGPQUB5Fl0+67CGU4HAQHu49FoQXVOG3MMfvvE2Xao/yejD5KpH0AIBEUSLO+qhD/CCRSA/ffIrFg3OIXqUw+0riY6OaGbbGTq9ggdHBfugqi/5k+yE+JHvQXdicyBXfds2H2O7Wml7IkvAsu/mZ+LHXfwHYGxpD5wfiQ/ADus/PfeIHiUR65PbzeJJnfAU7PlwvF33oqW/dtSmmdTSA+isFEF16ige9x2YES/UQliGsO48tcsGAZPkFNSLsT6bfGyxzuLZhFIYADwhfpeNFz6eTQyKRHltBuqNhngoJfLzbOvPbNL0DwQ8IcTBIfxQI0TWmP8ANo+ZRivhV4TvWc+hbGKKKtWAjitn5H3DO2B/m9qF7BtsORgAO2f4h+HGVjf8fm9eSSKRvYA3pTcaxwMfFeWd7J77V7i3GECLXdabphUpK1L/umA5dMkRHgNSMx9ZiLNt2672F4pBbwY/Vst+hBPqeZHX6kNmKGWe6YbAwhDRIkmTL0RGdcxKJ9LhaZru/mC8X57Bf3bZlw2qfTNX8EkNT4JAeZEsoixVf4mdM/lylTUp+SFo4MpJVaM2BuGUFFhf3wpTK3Z/9GMDkkogLfoCjxCKsJL6efd8bP5JIpF3uQ/3zUS+4J07UMmWONYpCXa/ZD/hidWIobsioFcPwVgUQ2YOuyq7c9fT5ZlKkIIjgB81w3x8+gtFkniE+IhzcHmH3eXyz6FHMkEQiPVWm59+3W3bL6o5meYI5Vl0PVQZEEmS7ARHkYJpWI03Bj1rZlTQiTt2AlB0hVXOIy/l8Qh0ge7rmnePpEDYG464jwIFPMKQ8ESYAACAASURBVP0qG/9MUytJJNIOum+icOuFByn2+AqSrJHKnhd1WBiiYgoYkhyFA4FhvXiIOthw1lCx9loFs+wyjFWWasEeIP02XZ19yD+ZwrYfnLsuDJhhjkyfx/lyFBCxSSRSA3epFky4SJOQoQGJdK0WxJKFWLokhl7GsxRLZJZEfUBDfjiuU7oQ+cKxNXsjDVLm2DnPZyOfVrM93C94B29nn7KUccbEpcEtv3D4VTZf9Kl6l0QiNSEveD29lu0f0CSgr0krn7W1oJZ4FanOQaZVBgTwISVfwVtoPuDZKRMjVRkWj7PxKDDpKjR/WxC8mYyzVNADnIcACFgQAZMkvRn0KGJIIpEauU/tvsUiHdU+GOlMv8sQrUCIfDD8gkBWlf/QdcdR4HBLhEhp4EAKF2KvjzXBAqwjk5azxvnRPp4O5ynYD0EPJvyHuByM8xhmt1PFG4lEaoAeLcs/HkCPAPIj1CN9Q6X7UEaDqfbCqJ7/0LEFHR8CFY6NzkO+VukPW3qQokxLtoBAAdbigMIpTV9W0zvB0t0YE+fCgbiOYUAoK03nkz4FDEkkUgMLjeV1cX8IwAcAJKzHrcocSM2GaGXpFf62NCuagUlaFbmqvIitlQ/HXZfsAJkv+lRN2ripDN7irh+cIz0Y7tDCGE9TGF7i0RkikUhfLqtzOh3m2D3I9PWS3I0YFtPrsa1y1ok6mCl8yDiWU/ICEx8YvrKdEiMyg27f3gr/sTyn++HGr+prvKqMY+2uQLrDDOZwnsb5eNSl8BWJRGpgofF7Z7NPYD9kTEpXOZBt0u5ak+rIUPIDjAdTYSx0HgoYChuahInMhMgdCzlLqRyocZmdwylErwQ+GCQ+HEigQ/kuh9m7fdp6kEQiNXKjClU6cRIxB3cTvB8f0n+sZTxqEBEAMQQ6hAFxQIIOAhmSIFX5FTAEFjM4ymZykxCeXi/e0TDxZuX3BjOISQI1DLwgzIXiXc7j7OaCZieSSKQvVsv02q/OIM6Bw69KfiAStifStUjbBpdQ5c8hgMUKgsjOQUyIyHS64EdZpKWqe6GBcEl7cTd8U9DF0l1hP1yDCX6gM4Q6Xh6l2XJEO86TSKQvQoeQafnd47PZXG6OzYxicKIe6s8RNIAo+wEFoxr8pijHckuMSP+Bh4gDbZtxsaK1qYC3SXwErydDgQ+4qo4h/QdmzyF8dU3VCiQS6RnAqEaYtEzTsrzOwYcpxDlwdzq5H+1mauNRhfUCLABD4T8cZTQEQSp6IEAw0S7F4nz4O/UjNImPdn8wzAU+OAN+SHxg8gPCV+PFkUfniEQi7UQPs5Ilvjw/ODg8mwznWXKV1OyHtrPvCDf9RyG3AElBDhnggofDxQ2x42hRiuOYyH80hg//ZDAUnhIuqq6x0n8gQah5kEQi7QAO4EUhz/KEfL/d7nRfffjX9HIM9AD7YRhyg6hyP49wB36EMq+OCfQ1fGDrGj6gAIjZTPkOB7O5mNGNomxIS1pzMts9aBxMkmLTQVm5C03oHHc+P2nTSSKRSE/BB4Sp2kG3GwSdNqrTCboHr04/vP/pv5doPiQ/WIGP52Q+QtkGYmD97h0DorIgzLGZSpi7jGOfiFjSIhlSoYaE5uR3oXFQXFXYKkrQQ3gQw0CCcLAf439Q9RWJRHoiQCzLDw7f//brrx8/fjg9Pf0g9PHjT3/+6+VwjPS4gs5z6Dqvyq+0ZwWwNMPZiF1hNkT6D1dVZxXhLCgK4uA/cJw45c8butxedwQZLYmPSLaEYgkWjE6M43z2l4DOEolEerID8Y8ulpd/+/z58y//+UXoxx8vBTxyhAfcp4ZXYYgrDdP0terccCeEoP8oy30ELTSsG5Wzl4owlosocWVBkCH3o8goJN+UTA+H7saY0Sq2k2RwVRjOvoLR7bRzLYlE2oEg7d4/r9M0y+eoPM/SBOGRJAnAQyiCyYmwnEPVlabvHMcKC/9hAEBqQSxNVVsViXSmhrq7RVFQHF8v3xE/mpEcW5IkUFEHm4EJSwmJLV18w6lOs+XgyCOrRyKRdpAXDG4SwAV8AzsUPuICHzIHjl2DRecg215l9bD9KLignlytQgkkcjGL7qqNpsSPNOQHzS9pCh9BH6ZeJbHiRzW5DHc/h9G7b8h+kEikXQlyuLhOYWFRFBHgSBAd4gUyRACjTg81cZdVJVZ3HxVRVAGWUeXMFUe0OjvcqiRL5dlxICzw45zmlzThM63/sXf9rm0sW/gWgdliCum/2M77H0io0ArcDEzlGGSwAwETWIeXLpiUDx5Oua1ZbiHpYTVqDOaCHal7aBuDJS4q4vv+EfPmnDMzOys7eTe289Pnsy07VpJiF/ab73znfKezBSs/kD3SDOlDQ1USJSVuHpzMdzmqksFgfCkarcPBEoYCLGnQl9UfRCBrQiMoYqW1T/dSveP8841Aflj6EBvC/gr8EEU84lJ6YyiqzOa7nF/yGOqjs39wgZ27uIlY212SCkL5NS4+X56PeglfKAaD8eXovVmMDYOknwJUOYS+I/rKEkfqPnFLSFpjFVe/itesD/OCDCIgz8R/Q0Nk48bQx01eTOZbfCh+DPrYOYB5Huy8ivB+mjtpmMOoEAOjSsyVftFp8JViMBj3QNIbLa7Ksla3CkDEoe5s4U0jopjUF7CcDkmD8Q8LGTvlIRyPgAIRGyRBbD0L6UNn49XRLtevHiwvm92ds4s/MElZKbsxEu8N9fECfywHQ5YfDAbj3ofU3mhVlEgdZVi9KsMKFtBIXYKkjjaIQiyVRAGhCMMfoQCpiRHLI/gRAZFIn+hn+GNw1Et4/uOhN7a7D2kCFGWGBwGNLKINgZiTgc7yvJjNd9p8pRgMxn3xrNk/WsDoR80FSVNPEZEW+q7sREcf9YqXN9Pr/VdIH6JOJsoyyIZ5rtHvMNKvmJ2Pek3Ov3oofWwTfcDGKAVuuTL30VUioXyVw5wmL65lMBgPfNYMQYPkToR4KkD28A669s6HJ5dKfkTVP3P1q0B+KBnDRyylsNoDf0O2ulEqSuCYCAb6jSfznQ7LjwehkTj6KCAIU0plLrGKiD802R95sZq/6jQbfLUYDMaDREj30jBIngX8gSSQEmnQQycSum6gp4Hxkda5ZD29RPoPlCEipiVGQBrS+unYUqpusvFitMkjbQ9D0jP0MRsXBe5xMQyiYF4QSlgKuCPVSuflcjHqss3EYDAefmJtH4KTnoceuiUKOrRi7Vw4ERJ0XkUVbXhJ4rp36wxCBCKokCWl9J6IMJoEQv2UVjlMD3b5VPyg00DS+yfQR0ZBmLAyCubNYWIQtAeGxOSlkR/HPKbJYDAeA83W8dwySFmzM9ZddOSTqnc3rXOIIxDhPA7HEq6ERfyh4qqAJdEIERKbgsar+W6ryfWrh9zI3kvovELxcYPyw1xv5A9sx04NhWRZbuRHv8mXmcFgPNK5tX9yXZblmh2u0UH3QyA6Chp2PXOE/kdauR9uXap0CkS4AhYcilXwlvmz+b8zWB7VT9g9fwB9tJ/jFrAsAz1nGRrEHgg8hbklWpf5eHXCo+cMBuMxHz7d4XVe5mm9iKUq20NbX6Tq1U0DL71SLJX9YetU8E047hDEG9IpEHzCSSm0LmYXr3tsf9wbDRg6fzuYjjOyPqQQ4H4QFPjoCnVejiGVDb5gDAbj8TRIow8MUlEIdV+l2lWvUhwhuLPpqmq+otkP3DIoKwEC5ofvv8IPfA9/pGecUDf/uXi/3+a6yn3pI+nuv7+YTGlbLaoPWQGoA+kDhjRPdpmmGQzGY6M9tEPpOnIzhLqeXEJ5JfXBj+AliiRuSCUDXQZfovrCmpXfxo07VQ2/GAL51783Ez4Y34/9E7A+JuMMMq9UbHWHoM4F1yIN8qOYLUacXMJgMB4fzc7xfAllLG3VhA0w0UFySXTX6GDYfEXsoXyTlfROeVy5ILYuH8PDTsGDTkR6OvjHdpfPxvfRjq3Nd2dgfUDmFVavcN2HAxUMbZfC0QvOiGEwGF/lUdTqD1fIINobIDrIbY/uSltMbbBJVE8uUdLPf0ibWSJwkrB6sIH2QC0CZKKz8eR0j02QL6f99ua7D4Op3fWh0S2H0UxF4kNWG7oKdj8YDMZXFSGXCxAhWqe+7YrGQdIo/Uxk763RQRnOD7oJdOIK+82yCLSYWgbJZud8QP7iG7Z1cDqYFmWmXbkRrigY6FZ9kP4wV3e6GPLaQQaD8TXR2j1ZXeVudbYVIendyVdB5jsyxobfFOUfXkQllj/o1yRC7HChwCRF80OE822T+XaXjZC/C8rbBeccGq9s25yGGEsgESvuBJHzeDI/5B4FBoPxVfEMnJBVnsMgM+YmQe/VLcoow+z3KJJrkbtS2gloJAoR1LBsWcUVsajDlwhEKQj4Gxxt8XrVv3ejWhRZkuG90tqnBghYOKhwdBCD8q153mdmZjAYX/vB1Eg6l/Pr3G4h0jQCssYdQeZ7dGtrFNVNlKUI6OyVIlAg7pujESXQ842V4ZC8zGanL3v8qPv/9NHe3PswmI2h3qhswhVs+kDasNFiSkFCvtbFdHL0osXXlMFgfIPKSCPpD8EKwedSVGu9urV6Sqh6YqL9JqT3PqTtwBKx1x5xIEMk9mYJECGQE5vnRoTsdDjQ5LN3KOnuoPVhaZ5iEuElUhpMdNrGIm1CzGR+2OXqFYPB+FYH3NYxUAgk9Kbr7BFIECi2xy6VxAVexVS7Ml+Yk+hmCEV8B33YdyyXwLH5JssLMNM7/MT7FHsY8fEarI+spNoVTX2mqDkMjWgqXmHAmMKrOdplScdgML7lY6q9O1wtszxP81Q7zVH6lVMlWLZ24DkI1/VtV4omEcDPFbJiEPtuRSH0jsCkRQHjILCrojQPvTebHNd0531p9fbfnwJ7WPLQhirA9cCttToyBCLwR0Gjg+PV/EWb6YPBYHzrg+6uUSGwaiorq523Vn1QaonvtbISJHYuOQ4Hug8hP6VAnLlu597gQUjbjmAoZNRN+C6sIek8fwcj50UGiVdofgCRA1/g3CduHsTkdhAkGZjnh5yPz2Awvstptz+cr5aQkIWH3dKzR4TjzqKaVAuSEa2BThlXyB8yVCC3i1gK1Iewf5soJM+z6WT+ilt618TH9tkFpu3SpiiBzIGhAQJ9D0Vp+2kKWe7a0PBiyLm7DAbjO+FZq398slhelZZDIiyw49ygImqQlfcR+xYrG6VB+gMQVxPocUAfCvp9zVvKeSb4OIQIR52X2XTA66WqO5F0NvdoTy2Om9OFhUEdvGR05RTNfsLWD5XnhaFgDr5iMBjf8dibtPuXJ6vlFU0bQNQiFteVm3WWNQfdyQ77YhnEjg/GwQCI9F1bSlDXFn2B+4uVmDTNC2rI4psAi6K2D94OZlC6slsG3ZWOfF4ytl1HwPBKl2W2PB/1WtzMxmAwvuvZt9E0HPLXx2vDIbnr+4nsuu2AB5QzOYg4lGcRUYv2W2vihcwmZf8KFrwEZPpSUxFMhZyfPflCVjPpPv/9A7RdGfa4uYEpD9ugIIXPTBag22BkR0VoIi0XJ7ut35g+GAzGj3AENjpkcU0kQixCBOKnP5Q/FsMKbmHdD2Gtktimwq4pEDxMx9Zxp8V5WJmJUttFpMezwdlTnixsNMk3n42hdLUBaTHS9xwYaBt3iSoEZ0JSIz/GUL1i6cZgMH4cDukegxC5vroqsAtI253bVnb47XeCOISkh2UGeacHYkN5nWmi4J+pSFCLlxDxhkrLzFAIDKc/0Wve2z94C0vOIZ7M0AdOaMaePohtq60t2MNmrhhUr1h9MBiMHwtJ+8/j//718eP1clkYGoHN29Kn7wYaRASlK0Eio7JAgkyT2Ddr4V5CynBCi57avDZuIMlpOjnd22w3n5YMgbCr/d8/GPbA0tUGSg+c8q8qftZKpzIWKhBMbR/2ObiEwWD8gI+1Z82k1ekfXw7n55NpYRlEVvMf/mQsvDP+GQgrWhAKQgAFDMI59lG4ygLTnC4OntK+KWCPnTcYtZtR1y4xdHzrigq7+At6dzWmtnMmPoPB+JEfb781mq3Oi9enk3GmNuhkHJCHwk+nK4LJwnXucIUryzc0zCBwI5KrhwE/KXWji/EfF2fbT8QMaSTd53tofEBSO9GH021Ox6mQgwU2NegyX7L5wWAwfgY025tHi6sMjW/rlitRg7SzIjXBUdMlyjbv2qkGSx+eP9zcocBQwNngw97zzq/OIY1Wd2sPs65wsxf1uvlrIdZ4mBrXFKmP8QomZ9j8YDAYP4EQSXqjxRKWT+EkW8gcnkE+KUB83Inv310nHrfQG1dS0VLW6eDi7OVm65d9RkLlausNjJsXeYlhJUqKtWsZxzUBAvLDEIjOc0Mfhxz/wmAwfh4R8mqxzFJsA/KPfxVQSGh1iFCDuBch5Bp7VPZ7HAYvQiErz6GSBTKk+QvKEHTND6hlN89tk5ugnCu6UjVdVnkgCrc5zuYjXlnLYDB+pnpLsjtfFhk1kkINSkUqojKU4w/X5nuXhS7WtcfacdtW/imuF0cXQYZMLs62f7GmrGeNpP0/9q6mtY0si87C8N6iFtK/0C76BxJaqAzaPKhVLLDBDhhCoBzi1YTGqyEQJsvaNUZ4YWeIBtoMGEQgtrUbrI3B9kKL6X9i5t37vu4rVclKmumJ7XuSdCdOYhsT6ujcc+85mj0u0DXHkg+VmchKIfwXqmJ6hbtrWVbc3HHlIIPBeHwMsnk1BwYxGYugP6QSSVjDivetFvijFuFqpOVXhIUwFRdgqO+87LefxigLFtt6gyGwh9Ue9qtp4HYLXDYMgcLKqMxu7rJ3zmAwHhva61/m48I/8YR3Q+qMj9L8ZZFHlKBXh8geL15AtXpLv290iyEm6/3kYPD4R1lrsM822D0y2iMvTEA7xlWaAw9z6CEqNYjmD08frD4YDMYjRBOs9FmRifBq2baFVDCIIN/wXt0/FWMHpeZsROLKEd7LjafH7/82XH+8o6y1hiaP/uD1zuTseArskWFEDKENG7ELmk4K367ipoKY/AKpVyfsfTAYjMeKRvfN1V0+S20Yu9+kijatKH+U9q6SGgdE1Ey8ZAoOQYEc8mhHWY1mu7f++mDvDM89cmOaZ9Lnk/jhlYkqUeRro9/YevFCQX9jfjc/OeThFYPBeLwE0mhvnsxHszQzgyzyqCM0IAh9JDXeeWl5q9o0wUMReK0+mxXoqGsOeVybvUAeg9f/+HRx/s/TS7Q91D2uCLhuKDMIxIpBQx9SRfQqbPnv3fzLYZfpg8FgPGo0e59vb4oizYIG8WdvgTbcUGupeR74Q7nVVUss/uAQY8xN+OwMt7LO9rfWu+3mT99+sQZjKyCPAySPqemmJQ1RKhCIHQWarqhwZmNHV8b7APrg6RWDwXjcWGt0r2/vClghEjLkYJUGWYLenT+4geVTGRPnlniXHXtb8T9a9OBm77ezveGg+5Mvsq412931DSCPY0setl4QyxhbPhox/IABloi2sSQuXqkcGj8On+Q9DIPBeHYMstbdvprfFLNwvEC6beOhVrIqgdT9QZQf0lGIynK4MJwen03evvxJTXUtPYzngeRxOc698rBRxq2W11dCEPqQ0pXWuh0DpTBydw70wf/uGAzGk0Cj2dciJC9SW+dBYtoTUnK7ggKpuhRRhD0QyrxWx6ctdrjO8vHlqSaR3Vf9TrPZ+FloBKij2emtbwz3J2eoPPJZkZtCR+FHdFp/tBJCIDLikDDAwtQSHl4xGIynRyHdQzxLN0zRCgY6uWKgkyjpv9WuYbmRlf4zmdDfM1xphYN36egDf2LTBGEx6/TbZH9r0PtJVrPwzOP1wd4EuONyNMp9naO9tCcDu5LK8spDehIJ3keP6YPBYDwxEbJ5Mh8XGTjCLVIx5QXIih5IbIRYAWLdAOEeppLIETTYFa5m5aORViKaRIaDfuf/54nAyAp0x+uDo4v3uKmLloeZWzlKjbOtSgQSKMTdaGZplhVwNrjN6oPBYDxFEXKNIkS1aOifCAMs8V0I9yLmaQpJW7FicdMeSyFWiYzAEjmf7L19ud7r/LnbWTix6vYHG8ODo3cXv+KiLsRbAXWAdUMvyg2ptpIkRF65kZZ0Bog57k9TSMcqIPPqZJvvPhgMxlPEGp6EgAghDBIqbkWyCmdUG+ciulP07CGcAjEcYqoxYJqVjy+n4Ins777qd9t/CodY1fFh5xNQx/m/v16OgTxmGhlmlFgmFJ4yFkJehO1nlMJTSIr0gQEurD4YDMaTppAmiJC8UK1WyQxPhEhWlB2Vm1dkL0mGi22nQqANV1qeUi1cVUIlYljkr29erffwUuR/8fTFeRWqDk0dH8+16vg6NZtW1vIAz8OmhUWlJzbzhdTHK0ey9g4EF3k1f2ga0urjerPTYPpgMBhPXIS4MRbNbU/IQ//HFIiw46rIKPArS/TtZpx1rzLHIt/OJntvhy8H6/1up91sNv4wleB6FUiO/jrOq7TqOD8/PtWqg9gdyB5wrSLTMJWqMHtE3Nnovk7G+gD6KG7mV9cc2M5gMJ482r3P0DOlWuGJmCxlh1UoxG20+s0twh5lUrJ5g8gi9/f3RoyAFvl2pnlkf3cLiKRnmeQH9AYIjp5WHK8/7OxNJhfvtegw1AGaozDcca9VUIrGf0rD2UlccUXnlgod8W5DIMuKGdMHg8F4PiKku/1lPs5AhLjLwYSqAym+H36EhZcfMtrCck9l6Zoz6JPZ0EhmaGR8eTnVRHJ8rplkMtl/uzvc2trYGGg+0YTS7XTamlNitAGdTlczhtYag42XW8Pdt/uEN6aXzupwG7pAHUZ0oP+NNCBVSSvReJIQOCn9eMvTR1Hg1WCbh1cMBuNZMMhau/eLX8cij0mfhriS9KB+RziqCy/jya6Sf79OjSR2wQle0ptnuv4xQmdEq5HRaGyoBLjk/NePHy/+9e63T0dHRzsHBwfD4fDDcLg73P2wOzwA7BzsHB19+u3dxcVHTRrnx6enp9MpsIbGvc9hx4+Bu1b6/1KBKaNEZq5UooaoeIqVhIgXqkXwnlDTR35jjs5ZfTAYjOfDIe3Nk9sxMEjLcAN93S2DqFiuOsKhoU+IUsRJJzOsyGgvbTjBTYpyMLaEWdRCgwTZRNPJ5fTr16+aGzSnBOhfnCJfaJ2hKWNsWMO5HJo4cqCLTNnT8oxUZKGtb/SWjCAChyRR3L1lFMw1kdJktNzdnvDVIIPBeG5odg+voKtQKng9nQQLI6SVx95FUjG2ooFQpWha+kiOhY1fa2r5WvXEPJYhSkqrg8wb3MAASCT43YgT/JnhiXv4lfu93GkNyhlO3KgszlyRosRxJQYhxY3+SN9+6qBZXuhPz1ofneZfmD8YDMYzQ6Pdu76aj4pMqWh+IwUJnH1YgdD9q/CX/SRLVmWhLDaKAIuoIA3gYgT3Y4FIVCATVCdpmhuVAhtUKV5hUBi2UDhnUr73yXUp0vwu5dQRuiB0Cicl/dMhuBhu+I1OKkZ3mj767JwzGIznSiGbkPIO2YHUBQiaYiUFQuiDUorvz5U1N+zBUmgZCsFHuYlHz7wmyCADBelEekGR6V8h7enfdEIDZkrKyx2FQzllU1Yc3SXuRjCQBJEcGWXQshHilg3gw9wrPBpE55z/ETEYjOcKsELmkNGbloyAICJW8ECq+ENGdkpVKZUqiRB41JtHvpRxWKG56HOP9RLJWbYyzIDqRYmkXOOuQl4wxj2aEkESq7swybKjvLB2JZz8KIpci4+TzQ5bHwwG43mLkEb38Mv8BsI8ShpEREUXlfcfMjgJS+4PaydY7mkvolxG2zCuYhM/fCrVvFbOHImLThyRKFxRNiu7QooFvVUq+bD0lXgLRKn7HON2+eqDwWAw4O6udwhWSGFqBDHdqfYsu16BCBklwMvaDN+4kio+8xZuIyz4KSKqGxdCltJSYnap6ytx1+MufF6IklySyCpKLnZEhWt0BXmJI967YjAYDDLH6mHXVJFhi2CsQ5Z7IFISHbIgT2IXQYT+wxJ9iHDPaMNuhfDzqZqURx96KGuN+djDEMp/038lk9TwX+yI8hQizXzMZECicb7Z5rhdBoPB8IMsuApBCrGTLOF0yEP35+QIvUqfVA2blpbkJnZTlqxySRUaExfflwxnJXWNu6WYSGlD5yVe3IMlAkVYMvqgxGwxPYNw9IHGOe9dMRgMRixCmt1tTSEFeCEqkypBJbJqiokoOwrUga8/bE+SpcFa2FGVGQaJiUeGxSrDK4rymRLGny+zlj1vIZ+ukGrBNzeMYXUYDvSyewU5KOP51WcOa2cwGIwqCukghRQ4yUrJjpN4IGixtH1FbZB6NyRSBWUioeMlkT3cjWjeHzYJKktNlJzc20XJpSEGyAKQOlITtltgU9SXN30Oa2cwGIxqCsGFLK1CcrzPW7ZZFSY85Wdy/HQWrlOjToMs1TQ1Hz68ve79hrON8HGkoJzmRliZoM65ZROzSmDP4YtiVqDz0W3y7IrBYDBq0ey/uUIVggV9ctlqbnjg1vFHECKVD/qkdt+XRhqa95DUrgYnpf2ucDke+MmdAJoNXnrzoajgCOrDyA9gkBkcnMPaFTsfDAaD8YAKaaMXMjIbWU6E+ELXUg5vKeyq9CZZMWla2VORQTGgD0ItjNJBu6B9JqVyE9LUK4NvIsNHyRboAwWIVmBFOoO0K80emx0WHwwGg7HSIMtRiK0JL7++XzjCoxtTEaksOQh5aK/L+S+4KqWkkgvnJws6huiOJPEmS2JuFaPaRLpklfpic8IeWTor8tEYLwb54JzBYDBWppBm79Xnq/kN1r5KUTEjopGJJQMhPKKFXLaDVdMtUpYwhIbom6rHYLiNlRi+CAziU3St7aEojWTRAAuVRwbsYWzz620eXTEYDMZ3Ukhn85crI0OUu+5LQg5h9eJSKRW99hBk+VG7qIgXgX1eUjNSySAubl15zRGq3kkqVuZSE+ngDjYNLwAABbNJREFUyngeKazsZim45je/356gbc7ig8FgML4b7d7h32+no7zQz1QJbR0ibqmVS3hksVXjBxQIyoPMkAcNyZXlVMaFxeAk0h3uNxJRwX+uD93EuKSaO/L85vf/8OSKwWAw/gAaZpKlZQh6IYmvEySzn3odIlYI832IQKgkUdUBwaVr84TcrCfBQf9ve3eP4zYShGHYgQAyYEDeYkPeQIYCdyqAuQJfgCfwMZgKk00wvoknEcAZEBNI1E2WVd0kuyXqxx7Pr98H9u5iMZ5deAF9W1XdXWGEHMWHzRCpPWRDLXMPAHh2IyvN8m/r24fHn2VlZCHscAcjvsA7yvt7J68mq5DY7Qg5/zzXGBJB7eFli/7lkEjG3nWRJpvR7eYy99iRHgDwt0Ik+/pdypDy3hSaIXF8OT3Ge4T+Oo3fr0Bc96qIpg4NT11s98qNJDiUNVmBuAQxkh5yYldeuiI9AOAvtrLm337cPTzelKXdF+uPns3kJMQ7ifWcDtbS+95+iJw+hBUdVCHJwRWU4b6K6euP7o/3XXhUzD0A4IXKkNXm7unxp4bIMmwvTaWHv5bwWQ2sfvgRXVqSeDD6SPwo8dtZ/m1zvWsuY4/dtt2vFzlnrgDghVpZG52oV2VhDhbLTq/Cvf4I7+lv5hakRydaWMlkAeI/s5UkycHLJjr0sCp75KrdN5QeAPByCTJL88X3219PdV1V3f+6L4MHFYPXQLwFt/GfZ8dUIXJQgyTnn9ZKwj0hSdKvNJRWXGmH5tuWxhUAvEKIdBmy3rRPj7V9brErRaL+OJOJL0+6r+9emX7A0h+xnapyLjzyPqwc0fXriR2ELGNTSOlR1bZxRe0BAK8mm682dw+7IUSK/t2rIEOiqyPkXNlh4qlHtk4sQDw+ldW3rf5LEtkpqKT0KGt9YbfhjUQAeNUyZDbL56v1bfu0q+X0q9EMGcsQc37afdx1mihBjJ9Gp64sXvzm4+NddietG5l34XG3WS/mzMwB4C1SJM0Xq0277TKkureFiAn7T/GzSxAzBkkRzECuyafEe/4xcaVHqW2rdrNa5PStAODNEkRXh0gzSyYi9+7t974OMf0ukfj4Mz2YdsennmY0x0eDj75warduuH1kGcnFla72KKXw2LabdfM1z/ivBwBvLsvnzVoKkZ2biJjCpoctQrzbe/0RqCjYNHtuIflEjhw84TguLZzcKWKbVkVx0xUeNjzmXPUAgHdUiqRZvmj2GiK1nI01wy3vwyIh8T/gLz3m24eQiQv9qaOQKHhBtz9HHBzhlWqlcErJDjlstV9p4UF4AMA7y5BZls0XrhLRECmCz/ihpRQfdZwu3f4oxt0dJp46Knz8K4qlDsurG82Odt/IuJzsAID3XIjMm2bTlSIaI5IiMrrW073e0yJJPza/9ILJWbr7yZjhYWCjM3YdlRdyxcNlh048UrpWAPD+QyRN87xpmr3taFX6/KJ8qI8FSZ8aB6evoviq+yBBDWLciySF0aqjrPSY1W4rLavuX4K6AwA+UILoB/Ysy7LcpkgXI101Yper63Go6bG4tz8k+BFuuB2OeI3RoXPysuyLDu1Y6aj8S8rEAwA+ZpKkmba0uhjZt0OQyHxEG1tyr8OVIia+Yg7i8iLWamNQueCwySFVR07HCgA+X5C0LkhskpRV2eeAXmWXH/H4Z/1p5+GjsqiLUjLDxobmxhgcrv4BAHyeENERuwuSPklslnRpsquvsKt3jvxKjQ0bHJm92DHr/0EAgM8nnaU2SGRA0gWJdLc0TVygTGq39gv0ayUyJDXmuQSHTSZ+XwHgHylHvgQf+l0GzLpAkUhoJsjf17BIZ/p41VhjEBwA8I/niY0FMUZDEDADfrMAAH8QMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+hP8Bg71U+P+wxk0AAAAASUVORK5CYII="
    
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // 1. Logo de la empresa
        if (logoBase64 && logoBase64.startsWith("data:image")) {
           doc.addImage(logoBase64, 'PNG', 14, 15, 45, 22); // Coordenadas (x, y, ancho, alto)
        }

        // 2. Título del Recibo (Alineado a la derecha)
        doc.setFontSize(15);
        doc.setFont(undefined, 'bold');
        doc.text("RECIBO DE PAGO", 200, 20, { align: 'right' });
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text("NETLINE COLOMBIA ISP", 200, 28, { align: 'right' });
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text("Conectando Hogares", 200, 34, { align: 'right' });


        // 3. Información General del Recibo
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.text(`Recibo #: ${datos.idFactura}`, 14, 50);
        doc.setFont(undefined, 'normal');
        doc.text(`Fecha de Pago: ${new Date().toLocaleDateString('es-CO')}`, 14, 57);

        // 4. Datos del Cliente (con más detalles)
        let clienteY = 67; // Posición Y inicial para los datos del cliente
        doc.setFont(undefined, 'bold');
        doc.text("Datos del Cliente:", 14, clienteY);
        doc.setFont(undefined, 'normal');
        clienteY += 7;
        doc.text(`Nombre: ${datos.usuario} (ID: ${datos.idUsuario})`, 14, clienteY);
        clienteY += 7;
        doc.text(`Dirección: ${datos.direccion}`, 14, clienteY);
        clienteY += 7;
        doc.text(`Correo: ${datos.correo}`, 14, clienteY);
        clienteY += 7;
        doc.text(`Celular: ${datos.celular}`, 14, clienteY);

        // 5. Línea divisoria
        const lineaY = clienteY + 5;
        //doc.setLineWidth(0.5);
        //doc.line(14, lineaY, 196, lineaY);

        // 6. Tabla de conceptos
        doc.autoTable({
            startY: lineaY + 2,
            head: [['Concepto', 'Monto']],
            body: [
                [datos.concepto, `$${parseInt(datos.monto.replace(/[^0-9]/g, ''), 10).toLocaleString('es-CO')}`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] }
        });

        let finalY = doc.autoTable.previous.finalY;

        // 7. Total
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text("Total Pagado:", 155, finalY + 15, null, null, "right");
        doc.text(`$${parseInt(datos.monto.replace(/[^0-9]/g, ''), 10).toLocaleString('es-CO')}`, 196, finalY + 15, null, null, "right");
        
        // 8. Mensaje de agradecimiento
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
       // doc.text("¡Gracias por su pago!", 105, finalY + 30, null, null, "center");

        pdfActionModal.classList.add('hidden');

        if (accion === 'imprimir') {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        } else {
            doc.save(`Recibo_NetLine_${datos.idFactura}_${datos.usuario.replace(/\s/g, '_')}.pdf`);
        }
    }

    imprimirReciboBtn.addEventListener('click', () => generarReciboPDF(datosParaRecibo, 'imprimir'));
    descargarReciboBtn.addEventListener('click', () => generarReciboPDF(datosParaRecibo, 'descargar'));
    cancelPdfActionBtn.addEventListener('click', () => pdfActionModal.classList.add('hidden'));
    
    
    /**
     * Muestra el modal para imprimir/descargar el recibo usando los datos de una fila de la tabla modal.
     * @param {HTMLButtonElement} button - El botón que activó la función.
     */
    window.generarReciboDesdeModal = async (button) => {
        const row = button.closest('tr');
        const cells = row.querySelectorAll('td');
        
        // Asumiendo el orden de las columnas en el modal (ver loadRecaudoFacturas isModalTable=true)
        const numeroFactura = cells[0].textContent;
        const idUsuario = cells[1].textContent;
        const nombreUsuario = cells[2].textContent;
        const concepto = cells[3].textContent.trim();
        const monto = cells[4].textContent;

        if (!idUsuario) {
            alert('Error: No se encontró el ID del usuario en la fila.');
            return;
        }

        try {
            const detallesExtra = await obtenerDetallesCliente(idUsuario);

            datosParaRecibo = {
                idFactura: numeroFactura,
                idUsuario: idUsuario,
                usuario: nombreUsuario,
                concepto: concepto,
                monto: monto,
                ...detallesExtra
            };
            
            pdfActionModal.classList.remove('hidden');
        } catch (error) {
            alert('Error al obtener detalles del cliente para el recibo: ' + error.message);
        }
    };


    saveStatusBtn.addEventListener('click', async () => {
        const facturaId = modalFacturaId.value;
        const newStatus = modalNewStatus.value;
        if (!facturaId || !newStatus) {
            alert('Error: Datos incompletos para cambiar el estado.');
            return;
        }

        const activeModuleForApi = document.querySelector('.sidebar-link.active').dataset.module;
        const apiFile = activeModuleForApi === 'recaudo' ? 'api_recaudo.php' : 'api_facturas.php';

        try {
            const response = await fetch(`${API_BASE_URL}${apiFile}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_invoice_status', factura_id: facturaId, estado: newStatus })
            });
            if (!response.ok) throw new Error((await response.json()).error);
            const result = await response.json();
            alert(result.message);
            statusModal.classList.add('hidden');
            
            if (newStatus === 'Pagada' && activeModuleForApi === 'recaudo') {
                const tableRow = document.querySelector(`#recaudoFacturasTableBody tr[data-factura-id="${facturaId}"]`);
                if (tableRow) {
                    const cells = tableRow.querySelectorAll('td');
                    // El ID de usuario está en la segunda columna (índice 1)
                    const idUsuario = cells[1].textContent;
                    // El número de factura está en la primera columna (índice 0)
                    const numeroFactura = cells[0].textContent;
                    // El nombre de usuario está en la tercera columna (índice 2)
                    const nombreUsuario = cells[2].textContent;
                    // El plan/concepto está en la cuarta columna (índice 3)
                    const concepto = cells[3].textContent.trim();
                    // El monto está en la quinta columna (índice 4)
                    const monto = cells[4].textContent;


                    const detallesExtra = await obtenerDetallesCliente(idUsuario);

                    datosParaRecibo = {
                        idFactura: numeroFactura,
                        idUsuario: idUsuario,
                        usuario: nombreUsuario,
                        concepto: concepto,
                        monto: monto,
                        ...detallesExtra
                    };
                    
                    pdfActionModal.classList.remove('hidden');
                } else {
                    console.warn(`No se encontró la fila para la factura ID: ${facturaId} para generar el recibo.`);
                }
            }

            if (activeModuleForApi === 'recaudo') {
                loadRecaudoFacturas({ status: 'Pendiente' });
            } else {
                // Recargar el módulo de Facturación para ver todas las facturas con el estado actualizado
                loadFacturas({ targetTableBody: facturasTableBody });
            }
            loadIncomeAndExpenses(); 
        } catch (error) {
            console.error('Error al cambiar estado de factura:', error);
            alert('Error al cambiar estado de factura: ' + error.message);
        }
    });



    // =================================================================
    // FUNCIÓN loadRecaudoFacturas CORREGIDA (SOLUCIÓN DEFINITIVA RESUMEN)
    // =================================================================
    
async function loadRecaudoFacturas(options = {}) {
    const { searchId = '', startDate = '', endDate = '', status = '', targetTableBody = recaudoFacturasTableBody, modificadoPorId = '' } = options;
    const isModalTable = targetTableBody !== recaudoFacturasTableBody; 
    
    // Colspan dinámico (8 para modal, 9 para tabla principal si es pagada en recaudo)
    const colspan = isModalTable ? (status === 'Pagada' ? "9" : "8") : "8"; 
    
    targetTableBody.innerHTML = `<tr><td colspan="${colspan}" class="py-4 px-6 text-center text-gray-500">Cargando facturas...</td></tr>`;
    if(isModalTable) paidInvoicesTotalSum.textContent = 'Calculando...';
    
    const hasDateFilter = startDate || endDate;

    // 1. Lógica para la TABLA VISIBLE
    let url = `${API_BASE_URL}api_recaudo.php?action=get_facturas`;
    const params = new URLSearchParams();
    if (searchId) params.append('id', searchId);
    if (status) params.append('status', status);
    if (modificadoPorId) params.append('modificado_por_id', modificadoPorId);

    // En Recaudo, la tabla principal (Pendientes) filtra por fecha de emisión. 
    // La tabla modal (Pagadas, Anuladas) debe filtrar por fecha de modificación si se proveen fechas.
    if (hasDateFilter) {
        // La tabla modal o una búsqueda específica de Pagadas/Anuladas debe usar fecha de modificación
        if (isModalTable || status === 'Pagada' || status === 'Anulada') {
             params.append('date_field', 'modification'); // <-- CORRECCIÓN CLAVE
        } else {
             // Si no es la modal y estamos filtrando Pendientes, mantenemos la fecha de factura
             // (No se añade date_field, se asume fecha de factura)
        }
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
    }

    if (params.toString()) url += '&' + params.toString();

    try {
        const response = await fetch(url);
        if (!response.ok) {
             const errorData = await response.json();
             throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorData.error || 'Error desconocido'}`);
        }
        const facturas = await response.json();
        targetTableBody.innerHTML = '';
        
        if (!isModalTable) {
            // 2. LÓGICA DE CORRECCIÓN PARA EL RESUMEN (Pagadas/Pendientes)
            
            let paidCountAll = 0, paidSumAll = 0, pendingCountAll = 0, pendingSumAll = 0;

            const summaryParams = new URLSearchParams();
            if (searchId) summaryParams.append('id', searchId);
            
            // 2a. Obtener Pendientes: Usa filtros de fecha normales (fecha_factura)
            const pendingParams = new URLSearchParams(summaryParams);
            if (startDate) pendingParams.append('start_date', startDate);
            if (endDate) pendingParams.append('end_date', endDate);
            pendingParams.append('status', 'Pendiente');
            const pendingUrl = `${API_BASE_URL}api_recaudo.php?action=get_facturas&${pendingParams.toString()}`;
            
            // 2b. Obtener Pagadas: Usa FECHA MODIFICACIÓN para el filtro de tiempo
            const paidParams = new URLSearchParams(summaryParams);
            if (hasDateFilter) {
                paidParams.append('date_field', 'modification'); // <-- CORRECCIÓN CLAVE
                if (startDate) paidParams.append('start_date', startDate);
                if (endDate) paidParams.append('end_date', endDate);
            }
            paidParams.append('status', 'Pagada');
            const paidUrl = `${API_BASE_URL}api_recaudo.php?action=get_facturas&${paidParams.toString()}`;
            
            try {
                const pendingResponse = await fetch(pendingUrl);
                const pendingInvoices = await pendingResponse.json();
                if(Array.isArray(pendingInvoices)) {
                    pendingCountAll = pendingInvoices.length;
                    pendingSumAll = pendingInvoices.reduce((sum, f) => sum + parseFloat(f.monto || 0), 0);
                }
                
                const paidResponse = await fetch(paidUrl);
                const paidInvoices = await paidResponse.json();
                if(Array.isArray(paidInvoices)) {
                    paidCountAll = paidInvoices.length;
                    paidSumAll = paidInvoices.reduce((sum, f) => sum + parseFloat(f.monto || 0), 0);
                }
            } catch (error) {
                console.error("Error al calcular resumen de recaudo:", error);
            }

            // 3. Actualizar la interfaz del resumen
            recaudoPaidInvoicesCount.textContent = paidCountAll;
            recaudoPaidInvoicesSum.textContent = `${formatCurrency(paidSumAll)}`;
            recaudoPendingInvoicesCount.textContent = pendingCountAll;
            recaudoPendingInvoicesSum.textContent = `${formatCurrency(pendingSumAll)}`;
        }
// ... (El resto de la función para poblar la tabla con la lógica existente sigue igual) ...

        if (facturas.length === 0) {
             targetTableBody.insertAdjacentHTML('beforeend', `<tr><td colspan="${colspan}" class="py-4 px-6 text-center text-gray-500">No se encontraron facturas.</td></tr>`);
        } else {
            facturas.forEach(factura => {
                 // ... (Código para construir las filas de la tabla: rowContent) ...
                 const monto = parseFloat(factura.monto || 0);
                 const planDisplay = factura.concepto ? `<span class="italic text-gray-500">${factura.concepto}</span>` : factura.nombre_plan;
                 
                 const row = document.createElement('tr');
                 row.dataset.facturaId = factura.factura_id; 

                 let rowContent;
                 if (isModalTable) {
                      const fechaModificacion = factura.fecha_modificacion ? new Date(factura.fecha_modificacion).toLocaleString('es-CO') : 'N/A';
                      rowContent = `
                          <td class="py-4 px-6 text-sm font-medium text-gray-900">${factura.numero_factura}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${factura.usuario_id}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${factura.nombre_usuario}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${planDisplay}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${formatCurrency(monto)}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${factura.fecha_factura}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${factura.nombre_modificador || 'N/A'}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${fechaModificacion}</td>
                      `;
                      // Añadir columna de Recibo SOLO si son Pagadas y es el modal de Recaudo
                      if (status === 'Pagada' && modalOpenerModule === 'recaudo') {
                            rowContent += `
                                <td class="py-4 px-6 text-sm font-medium">
                                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-200" onclick="generarReciboDesdeModal(this)">
                                        Recibo
                                    </button>
                                </td>
                            `;
                      }
                 } else {
                      rowContent = `
                          <td class="py-4 px-6 text-sm font-medium text-gray-900">${factura.numero_factura}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${factura.usuario_id}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${factura.nombre_usuario}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${planDisplay}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${formatCurrency(monto)}</td>
                          <td class="py-4 px-6 text-sm text-gray-700">${factura.fecha_factura}</td>
                          <td class="py-4 px-6 text-sm font-semibold ${factura.estado === 'Pagada' ? 'text-green-600' : (factura.estado === 'Anulada' ? 'text-red-600' : 'text-yellow-600')}">${factura.estado}</td>
                          <td class="py-4 px-6 text-sm font-medium">
                              <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200" onclick="openStatusModal(${factura.factura_id}, '${factura.estado}', '${factura.numero_factura}')">Cambiar Estado</button>
                          </td>
                      `;
                 }
                 row.innerHTML = rowContent;
                 targetTableBody.appendChild(row);
            });
        }

        if (isModalTable) {
            const totalMonto = facturas.reduce((sum, factura) => sum + parseFloat(factura.monto || 0), 0);
            paidInvoicesTotalSum.textContent = formatCurrency(totalMonto);
        }

    } catch (error) {
        console.error('Error al cargar facturas de recaudo:', error);
        targetTableBody.innerHTML = `<tr><td colspan="${colspan}" class="py-4 px-6 text-center text-red-500">Error al cargar facturas: ${error.message}</td></tr>`;
        if(isModalTable) paidInvoicesTotalSum.textContent = '$ Error';
    }
}


    
    // --- INICIO CORRECCIÓN DE BÚSQUEDA INSTANTÁNEA: MÓDULO RECAUDO (PENDIENTES) ---
    const handleRecaudoDetailsSearch = () => {
        loadRecaudoFacturas({
            searchId: recaudoDetailSearchIdInput.value.trim(),
            startDate: recaudoDetailStartDateInput.value,
            endDate: recaudoDetailEndDateInput.value,
            status: 'Pendiente'
        });
    };

    if (searchRecaudoDetailsBtn) {
        searchRecaudoDetailsBtn.addEventListener('click', handleRecaudoDetailsSearch);
    }

    if (clearRecaudoDetailsSearchBtn) {
        clearRecaudoDetailsSearchBtn.addEventListener('click', () => {
            recaudoDetailSearchIdInput.value = '';
            recaudoDetailStartDateInput.value = '';
            recaudoDetailEndDateInput.value = '';
            // Forzar carga de totales históricos al limpiar filtros
            loadRecaudoFacturas({ status: 'Pendiente', startDate: '', endDate: '' }); 
        });
    }

    if (recaudoDetailSearchIdInput) {
        // Se ELIMINA el evento 'input' para quitar la búsqueda instantánea.
        
        // Manejar Enter en el campo de ID
        recaudoDetailSearchIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleRecaudoDetailsSearch();
            }
        });
    }
    // --- FIN CORRECCIÓN DE BÚSQUEDA INSTANTÁNEA: MÓDULO RECAUDO (PENDIENTES) ---
    
});