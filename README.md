# 📡 AdminISP - Sistema de Gestión para NetLine Colombia ISP

Bienvenido al repositorio oficial de **AdminISP**, una plataforma tecnológica desarrollada a la medida para automatizar y optimizar los procesos operativos y administrativos del proveedor de servicios de internet (WISP) NetLine Colombia ISP, ubicado en el municipio de Yacuanquer, departamento de Nariño.

## 📍 Contexto y Justificación
Este proyecto nace para resolver la brecha de madurez digital de la empresa, reemplazando los procesos manuales descentralizados (uso de papel y hojas de cálculo) por una herramienta centralizada. AdminISP permite escalar el modelo de negocio, reducir ineficiencias, evitar errores humanos en la facturación y mejorar la calidad del servicio al cliente.

## ⚙️ Módulos Principales

El sistema está compuesto por funcionalidades críticas evaluadas bajo rigurosas pruebas de caja negra e integración:

* **👥 Gestión de Clientes:** Registro centralizado, control de estados (activo/suspendido) y persistencia de datos de suscriptores.
* **💰 Facturación Masiva:** Generación automatizada de facturas para clientes activos, previniendo duplicidades y omisiones.
* **📦 Control de Inventario:** Trazabilidad en tiempo real de activos de red (ej. antenas, routers) asignados y disponibles en bodega.
* **🔌 Integración con RouterOS (MikroTik API):** * Sincronización automática de planes de ancho de banda (Simple Queues).
    * Suspensión y reconexión de servicio en tiempo real desde el panel administrativo.
    * Monitoreo de red perimetral mediante Ping para detección temprana de fallas.

## 🚀 Tecnologías Implementadas
* **Backend:** PHP
* **Integración:** MikroTik RouterOS API
* **Reportes:** PhpSpreadsheet (Generación de hojas de cálculo)
* **Servidor Local:** WAMP Server
* **Control de Versiones:** Git & GitHub

---
*Desarrollado como proyecto de grado/investigación para el fortalecimiento tecnológico de la infraestructura de telecomunicaciones en zonas rurales.*