<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagos PSE - NetLine Colombia ISP</title>
    <link rel="icon" href="img/icono.ico" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        /* ESTILOS GENERALES Y RESET */
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background: #f8f9fa;
            color: #333;
            line-height: 1.6;
        }

        main {
            max-width: 1000px;
            margin: 2rem auto;
            padding: 1rem;
        }

        h1, h2, h3 {
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            color: #1e3a8a;
        }

        /* ESTILOS PARA LA PÁGINA DE PAGOS (PAGOPSE.PHP) */
        .simple-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: #ffffff;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .simple-header #logo {
            height: 60px;
        }

        .simple-header h1 {
            font-size: 2rem;
            text-align: center;
            flex-grow: 1;
            margin: 0;
            color: #ffffff;
        }

        .simple-header .btn-secondary {
            background-color: #6b7280;
            color: white;
            padding: 0.7rem 1.2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s;
            border: none;
            cursor: pointer;
            font-size: 1rem;
        }

        .simple-header .btn-secondary:hover {
            background-color: #4b5563;
        }

        .payment-portal-section {
            background-color: #ffffff;
            padding: 2.5rem;
            border-radius: 1.5rem;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .payment-portal-section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 2rem;
        }
        
        .payment-portal-section h3 {
             font-size: 1.6rem;
             color: #1a56db;
             margin-bottom: 1rem;
        }

        .payment-search-box {
            background-color: #f0f8ff;
            padding: 1.5rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
            text-align: center;
            border: 1px solid #c3daff;
        }

        .input-group {
            display: flex;
            justify-content: center;
            gap: 0.75rem;
            align-items: center;
        }

        .form-input {
            padding: 0.8rem;
            border: 1px solid #c3daff;
            border-radius: 0.5rem;
            font-size: 1rem;
            flex-grow: 1;
            max-width: 400px;
        }

        .btn-primary {
            background: #059669;
            color: white;
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .btn-primary:hover {
            background: #047857;
        }

        .btn-primary:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .client-info-box, .invoices-table-container, .payment-summary {
            margin-top: 2rem;
            background-color: #fff;
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border: 1px solid #e0e7ff;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }

        .data-table th, .data-table td {
            padding: 1rem;
            border-bottom: 1px solid #e0e7ff;
            text-align: left;
            vertical-align: middle;
        }

        .data-table th {
            background-color: #f0f8ff;
            font-weight: 600;
            color: #1e3a8a;
            text-transform: uppercase;
            font-size: 0.85rem;
        }
        
        .data-table th:first-child, .data-table td:first-child {
            width: 1%;
            text-align: center;
        }
        
        .data-table input[type="checkbox"] {
            transform: scale(1.2);
            cursor: pointer;
        }

        .data-table tbody tr:hover {
            background-color: #f8fcff;
        }

        .status-pendiente {
            color: #f59e0b;
            font-weight: 600;
        }

        .payment-summary {
            border-top: 3px solid #3b82f6;
            text-align: center;
        }

        .total-amount {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 1.5rem;
        }
        
        /* Utilidades para JS */
        .hidden {
            display: none;
        }

        .text-center {
            text-align: center;
        }

        .error-message {
            color: #dc3545;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
        }
        
        /* Responsividad */
        @media (max-width: 768px) {
            .simple-header { flex-direction: column; gap: 1rem; }
            .input-group { flex-direction: column; gap: 1rem; }
            .data-table { font-size: 0.9rem; }
        }
    </style>
</head>
<body>

<header class="simple-header">
    <img src="img/NetLine-pequeno_1.png" alt="Logo NetLine" id="logo">
    <h1>Portal de Pagos PSE</h1>
    <a href="index.html" class="btn-secondary simple-header">Regresar</a>
</header>

<main>
    <section class="payment-portal-section">
        <h2>Consulta y Paga tus Facturas</h2>
        <div class="payment-search-box">
            <label for="userInvoiceId" style="display:block; margin-bottom:1rem; font-weight:600;">Ingresa tu ID de Usuario:</label>
            <div class="input-group">
                <input type="text" id="userInvoiceId" class="form-input" placeholder="Ej: 1087960039" required>
                <button type="button" id="searchInvoicesBtn" class="btn-primary">Buscar</button>
            </div>
        </div>
        
        <div id="loadingMessage" class="text-center hidden"><p>Buscando facturas...</p></div>
        <div id="errorMessage" class="error-message hidden"></div>

        <div id="resultsContainer" class="hidden">
            <div id="clientInfoDisplay" class="client-info-box">
                <h3>Información del Cliente</h3>
                <p><strong>Nombre:</strong> <span id="clientName"></span></p>
                <p><strong>Correo:</strong> <span id="clientEmail"></span></p>
            </div>

            <div class="invoices-table-container">
                <h3>Facturas Pendientes de Pago</h3>
                <p>Selecciona las facturas que deseas pagar:</p>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="selectAllCheckbox" title="Seleccionar todo"></th>
                            <th>ID Factura</th>
                            <th>Plan / Otro</th>
                            <th>valor $</th>
                            <th>Periodo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody id="userInvoicesTableBody">
                    </tbody>
                </table>
            </div>

            <div id="paymentSummary" class="payment-summary hidden">
                <h3>Resumen de Pago</h3>
                <div class="total-amount">
                    Total a Pagar: <span id="totalAmount">$0</span>
                </div>
                <button id="payTotalBtn" class="btn-primary" disabled>Pagar Total Seleccionado</button>
            </div>
        </div>
    </section>
</main>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '';

    // Credenciales para la pasarela de pagos Wompi (Pruebas)
    const WOMPI_PUBLIC_KEY = 'pub_test_HConPIc9S9j6t34cW8A0c49s91wG75Fq';
    const WOMPI_INTEGRITY_KEY = 'test_integrity_c9S9j6t34cW8A0c49s91wG75Fq';
    const WOMPI_PAYMENT_URL = 'https://checkout.wompi.co/l/VPOS_wK6elU';
    const WOMPI_URL_RESPONSE = 'https://netlinecolombiaisp.com.co/respuesta_wompi.php';
    
    const searchBtn = document.getElementById('searchInvoicesBtn');
    const userIdInput = document.getElementById('userInvoiceId');
    const resultsContainer = document.getElementById('resultsContainer');
    const clientNameSpan = document.getElementById('clientName');
    const clientEmailSpan = document.getElementById('clientEmail');
    const invoicesTableBody = document.getElementById('userInvoicesTableBody');
    const totalAmountSpan = document.getElementById('totalAmount');
    const payTotalBtn = document.getElementById('payTotalBtn');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const paymentSummaryDiv = document.getElementById('paymentSummary');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');

    const showLoading = (show) => loadingMessage.classList.toggle('hidden', !show);
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
    };
    const hideMessages = () => {
        errorMessage.classList.add('hidden');
        loadingMessage.classList.add('hidden');
    };
    const formatCurrency = (value) => parseFloat(value).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

    const searchInvoices = async () => {
        const userId = userIdInput.value.trim();
        if (!userId) {
            showError('Por favor, ingresa tu ID de usuario.');
            return;
        }

        hideMessages();
        showLoading(true);
        resultsContainer.classList.add('hidden');
        invoicesTableBody.innerHTML = '';
        selectAllCheckbox.checked = false;

        try {
            const [userResponse, invoicesResponse] = await Promise.all([
                // Corregido: Usa la nueva acción pública 'get_user_for_invoice' para obtener los datos del usuario.
                fetch(`${API_BASE_URL}api_users.php?action=get_user_for_invoice&user_id=${userId}`),
                fetch(`${API_BASE_URL}api_facturas.php?usuario_id=${userId}`)
            ]);

            if (!userResponse.ok) {
                const errorData = await userResponse.json().catch(() => ({ error: 'Error de comunicación' }));
                throw new Error(errorData.error || `Usuario no encontrado.`);
            }
            const userData = await userResponse.json();

            if (!invoicesResponse.ok) throw new Error('No se pudieron cargar las facturas.');
            
            const allInvoices = await invoicesResponse.json();
            clientNameSpan.textContent = userData.nombre;
            clientEmailSpan.textContent = userData.correo;

            const pendingInvoices = allInvoices.filter(inv => inv.estado === 'Pendiente');

            if (pendingInvoices.length === 0) {
                invoicesTableBody.innerHTML = `<tr><td colspan="6" class="text-center">¡Felicitaciones! Estás al día con tus pagos.</td></tr>`;
                paymentSummaryDiv.classList.add('hidden');
            } else {
                paymentSummaryDiv.classList.remove('hidden');
                pendingInvoices.forEach(invoice => {
                    const row = `
                        <tr>
                            <td><input type="checkbox" class="invoice-checkbox" data-monto="${invoice.monto}" data-invoice-id="${invoice.factura_id}"></td>
                            <td>${invoice.factura_id}</td>
                            <td>${invoice.descripcion}</td>
                            <td>${formatCurrency(invoice.monto)}</td>
                            <td>${invoice.fecha_factura}</td>
                            <td class="status-pendiente">${invoice.estado}</td>
                        </tr>
                    `;
                    invoicesTableBody.insertAdjacentHTML('beforeend', row);
                });
            }

            resultsContainer.classList.remove('hidden');

        } catch (error) {
            showError(`Error: ${error.message}`);
        } finally {
            showLoading(false);
            updatePaymentSummary();
        }
    };
    
    const updatePaymentSummary = () => {
        const checkedBoxes = document.querySelectorAll('.invoice-checkbox:checked');
        let total = 0;
        checkedBoxes.forEach(box => {
            total += parseFloat(box.dataset.monto);
        });
        
        totalAmountSpan.textContent = formatCurrency(total);
        payTotalBtn.disabled = total === 0;
    };
    
    const processPayment = async () => {
        const checkedBoxes = document.querySelectorAll('.invoice-checkbox:checked');
        if (checkedBoxes.length === 0) {
            alert('No has seleccionado ninguna factura para pagar.');
            return;
        }
        
        const totalAmount = Array.from(checkedBoxes).reduce((sum, box) => sum + parseFloat(box.dataset.monto), 0);
        const amountInCents = Math.round(totalAmount * 100);
        const reference = `NETLINE-${userIdInput.value.trim()}-${Date.now()}`;
        
        const invoices_ids = Array.from(checkedBoxes).map(box => box.dataset.invoiceId).join(',');

        // Generar la firma de integridad de Wompi
        const generateIntegritySignature = (integrityKey, amount, currency, reference) => {
            const stringToHash = `${amount}${currency}${reference}${integrityKey}`;
            return sha256(stringToHash);
        };

        // Incluir la librería de hash SHA-256 si no está cargada
        if (typeof sha256 === 'undefined') {
            const sha256Script = document.createElement('script');
            sha256Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js';
            sha256Script.onload = () => {
                const signature = generateIntegritySignature(WOMPI_INTEGRITY_KEY, amountInCents, 'COP', reference);
                createAndSubmitWompiForm(amountInCents, reference, signature, invoices_ids);
            };
            document.head.appendChild(sha256Script);
        } else {
            const signature = generateIntegritySignature(WOMPI_INTEGRITY_KEY, amountInCents, 'COP', reference);
            createAndSubmitWompiForm(amountInCents, reference, signature, invoices_ids);
        }
    };
    
    const createAndSubmitWompiForm = (amountInCents, reference, signature, invoices_ids) => {
        const form = document.createElement('form');
        form.method = 'post';
        form.action = WOMPI_PAYMENT_URL;
        form.style.display = 'none';

        const params = {
            'public-key': WOMPI_PUBLIC_KEY,
            'amount-in-cents': amountInCents,
            'currency': 'COP',
            'reference': reference,
            'signature:integrity': signature,
            'redirect-url': `https://netlinecolombiaisp.com.co/respuesta_wompi.php`,
            // Opcional: información adicional que puedes necesitar en la respuesta
            'customer-data:user-id': userIdInput.value.trim(),
            'customer-data:invoices-ids': invoices_ids,
        };
        
        for (const key in params) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
        }
        
        document.body.appendChild(form);
        form.submit();
    };

    // --- Event Listeners ---
    searchBtn.addEventListener('click', searchInvoices);
    userIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchInvoices();
    });
    
    invoicesTableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('invoice-checkbox')) {
            updatePaymentSummary();
        }
    });

    selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.invoice-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
        updatePaymentSummary();
    });
    
    payTotalBtn.addEventListener('click', processPayment);
});
</script>

</body>
</html>