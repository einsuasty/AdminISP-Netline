-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 16-09-2025 a las 04:57:20
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `netlinecolombiaisp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `activos_asignados`
--

DROP TABLE IF EXISTS `activos_asignados`;
CREATE TABLE IF NOT EXISTS `activos_asignados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_activo_id` int NOT NULL,
  `cliente_id` int DEFAULT NULL,
  `fecha_asignacion` date NOT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `serial` varchar(255) DEFAULT NULL,
  `notas` text,
  PRIMARY KEY (`id`),
  KEY `tipo_activo_id` (`tipo_activo_id`),
  KEY `cliente_id` (`cliente_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `activos_asignados`
--

INSERT INTO `activos_asignados` (`id`, `tipo_activo_id`, `cliente_id`, `fecha_asignacion`, `ip`, `serial`, `notas`) VALUES
(6, 3, NULL, '2025-08-29', '192.168.5.2', '', 'Sectorial San Felipe - abajo'),
(7, 4, NULL, '2025-08-29', '192.168.5.1', '', 'Mikrotik San Felipe'),
(9, 4, NULL, '2025-08-29', '190.90.154.115', '', 'Mikrotik Principal- Ip Publica'),
(10, 1, 69, '2025-09-01', '192.168.6.129', '', 'Granja'),
(11, 4, NULL, '2025-09-12', '192.168.4.1', '', 'El Rosario'),
(12, 1, 55, '2025-09-12', '192.168.6.123', '', 'El Rosario'),
(13, 1, 49, '2025-09-12', '192.168.6.114', '', 'San Jose');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conexiones`
--

DROP TABLE IF EXISTS `conexiones`;
CREATE TABLE IF NOT EXISTS `conexiones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `origen_id` int NOT NULL,
  `destino_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `origen_id` (`origen_id`),
  KEY `destino_id` (`destino_id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `conexiones`
--

INSERT INTO `conexiones` (`id`, `origen_id`, `destino_id`) VALUES
(2, 3, 7),
(3, 7, 24),
(4, 7, 18),
(5, 7, 14),
(6, 7, 15),
(7, 3, 4),
(8, 4, 22),
(9, 7, 13),
(10, 4, 23),
(12, 2, 9),
(13, 7, 17),
(14, 20, 21),
(15, 8, 12),
(16, 8, 11),
(17, 7, 25),
(18, 11, 26),
(21, 2, 27),
(22, 7, 36),
(23, 7, 35),
(24, 7, 37),
(25, 7, 33),
(26, 7, 31),
(27, 7, 34),
(28, 7, 30),
(29, 7, 29),
(30, 7, 38),
(31, 7, 32),
(32, 7, 28),
(33, 4, 45),
(34, 4, 43),
(35, 4, 46),
(36, 4, 41),
(37, 4, 44),
(38, 4, 42),
(39, 4, 47),
(40, 4, 39),
(41, 4, 40),
(42, 2, 52),
(43, 2, 57),
(44, 2, 58),
(45, 2, 55),
(46, 2, 49),
(47, 2, 50),
(48, 2, 51),
(49, 2, 60),
(50, 2, 61),
(51, 2, 54),
(52, 2, 53),
(53, 2, 56),
(54, 2, 48),
(55, 2, 59),
(56, 2, 66),
(57, 20, 67),
(58, 20, 62),
(59, 20, 70),
(60, 20, 63),
(61, 20, 69),
(62, 20, 68),
(63, 20, 64),
(64, 20, 65),
(65, 11, 73),
(66, 11, 76),
(67, 79, 76),
(68, 8, 79),
(69, 79, 80),
(70, 12, 71),
(71, 12, 75),
(72, 8, 74),
(73, 12, 72),
(74, 12, 78),
(75, 12, 77),
(92, 95, 2),
(93, 95, 20),
(94, 96, 95),
(95, 96, 8),
(96, 96, 3),
(97, 97, 96);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dispositivos`
--

DROP TABLE IF EXISTS `dispositivos`;
CREATE TABLE IF NOT EXISTS `dispositivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(45) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` enum('router','repetidora','cliente','switch','servidor_vpn','proveedor_internet','firewall','equipo_borde') NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `observaciones` text,
  `fecha_agregado` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip` (`ip`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `dispositivos`
--

INSERT INTO `dispositivos` (`id`, `ip`, `nombre`, `tipo`, `direccion`, `observaciones`, `fecha_agregado`) VALUES
(2, '192.168.6.4', 'SECTOTIAL RS, SJ, MH', 'repetidora', NULL, NULL, '2025-08-03 13:23:21'),
(3, '192.168.5.1', 'ROUTER BOARD SAN FELIPE', 'router', NULL, NULL, '2025-08-03 13:26:21'),
(4, '192.168.5.2', 'REPETIDORA SAN FELIPE 5.2', 'repetidora', NULL, NULL, '2025-08-03 13:28:48'),
(7, '192.168.5.3', 'REPETIDORA SAN FELIPE 5.3', 'repetidora', NULL, NULL, '2025-08-03 13:30:12'),
(8, '192.168.4.1', 'ROUTER BOARD EL ROSARIO', 'router', NULL, NULL, '2025-08-03 13:32:15'),
(9, '192.168.6.116', 'JHONATAN INSUASTY', 'cliente', NULL, NULL, '2025-08-03 13:34:29'),
(11, '192.168.4.5', 'REPETIDORA EL ROSARIO 4.5', 'repetidora', NULL, NULL, '2025-08-03 13:35:54'),
(12, '192.168.4.4', 'REPETIDORA EL ROSARIO 4.4', 'repetidora', NULL, NULL, '2025-08-03 13:36:07'),
(13, '192.168.5.12', 'CARLOS PIZARRO', 'cliente', NULL, NULL, '2025-08-03 13:38:51'),
(14, '192.168.5.39', 'ANDRES RECALDE', 'cliente', NULL, NULL, '2025-08-03 13:45:40'),
(15, '192.168.5.28', 'BERTILA BARBOSA', 'cliente', NULL, NULL, '2025-08-03 13:53:50'),
(17, '192.168.5.15', 'GABRIEL PORTILLO', 'cliente', NULL, NULL, '2025-08-03 14:09:46'),
(18, '192.168.5.37', 'FAVIAN CADENA', 'cliente', NULL, NULL, '2025-08-03 14:25:24'),
(20, '192.168.6.5', 'SECTOTIAL RS, SJ, MH 6.5', 'repetidora', NULL, NULL, '2025-08-03 14:37:26'),
(21, '192.168.6.121', 'DIGMAR INSUASTY', 'cliente', NULL, NULL, '2025-08-03 14:38:25'),
(22, '192.168.5.11', 'LEONEL PORTILLO', 'cliente', NULL, NULL, '2025-08-03 14:44:19'),
(23, '192.168.5.43', 'MARITZA PORTILLO', 'cliente', NULL, NULL, '2025-08-03 14:44:38'),
(24, '192.168.5.42', 'ALDEMAR RIASCOS', 'cliente', NULL, NULL, '2025-08-03 14:50:42'),
(25, '192.168.5.26', 'MARCELA BURGOZ', 'cliente', NULL, NULL, '2025-08-03 16:15:26'),
(26, '192.168.4.21', 'EDGARDO INSUASTY', 'cliente', NULL, NULL, '2025-08-04 23:20:04'),
(27, '192.168.6.109', 'DIEGO PORTILLO', 'cliente', NULL, NULL, '2025-08-04 23:39:52'),
(28, '192.168.5.29', 'ALEJADNRA LASSO', 'cliente', NULL, NULL, '2025-08-04 23:47:50'),
(29, '192.168.5.32', 'FERNADO PORTILLO', 'cliente', NULL, NULL, '2025-08-04 23:48:19'),
(30, '192.168.5.19', 'HAROLD GOMEZ', 'cliente', NULL, NULL, '2025-08-04 23:48:44'),
(31, '192.168.5.41', 'HOMERO RIASCOS', 'cliente', NULL, NULL, '2025-08-04 23:48:58'),
(32, '192.168.5.33', 'JOSE URBINA', 'cliente', NULL, NULL, '2025-08-04 23:49:12'),
(33, '192.168.5.44', 'JULIO RIASCOS', 'cliente', NULL, NULL, '2025-08-04 23:49:25'),
(34, '192.168.5.18', 'LEONILA BURBANO', 'cliente', NULL, NULL, '2025-08-04 23:49:48'),
(35, '192.168.5.14', 'MARIO ROSERO', 'cliente', NULL, NULL, '2025-08-04 23:50:25'),
(36, '192.168.5.25', 'ONEIDA RIASCOS', 'cliente', NULL, NULL, '2025-08-04 23:50:39'),
(37, '192.168.5.31', 'RAY MUNDO FUERTES', 'cliente', NULL, NULL, '2025-08-04 23:50:53'),
(38, '192.168.5.40', 'SEBASTIAN RIASCOS', 'cliente', NULL, NULL, '2025-08-04 23:51:05'),
(39, '192.168.5.27', 'PAOLA RIACOS', 'cliente', NULL, NULL, '2025-08-05 00:07:09'),
(40, '192.168.5.38', 'MENANDRO APRAEZ', 'cliente', NULL, NULL, '2025-08-05 00:07:38'),
(41, '192.168.5.13', 'DANIELA RAMOS', 'cliente', NULL, NULL, '2025-08-05 00:08:06'),
(42, '192.168.5.16', 'VIVIANA PORT - BILLAR', 'cliente', NULL, NULL, '2025-08-05 00:08:24'),
(43, '192.168.5.20', 'OSCAR LOPEZ', 'cliente', NULL, NULL, '2025-08-05 00:08:35'),
(44, '192.168.5.22', 'ROSIO INSUASTY', 'cliente', NULL, NULL, '2025-08-05 00:08:47'),
(45, '192.168.5.23', 'HAROL CADENA', 'cliente', NULL, NULL, '2025-08-05 00:09:01'),
(46, '192.168.5.34', 'ODILA CAEZ', 'cliente', NULL, NULL, '2025-08-05 00:09:12'),
(47, '192.168.5.36', 'VIVIANA PORTILLO', 'cliente', NULL, NULL, '2025-08-05 00:09:32'),
(48, '192.168.6.145', 'ALBERTO INSUASTY', 'cliente', NULL, NULL, '2025-08-05 00:12:40'),
(49, '192.168.6.118', 'AMPARO NOGUERA', 'cliente', NULL, NULL, '2025-08-05 00:12:51'),
(50, '192.168.6.105', 'ANDRES RODRIGUEZ', 'cliente', NULL, NULL, '2025-08-05 00:13:03'),
(51, '192.168.6.113', 'DIELA CHAMORRO', 'cliente', NULL, NULL, '2025-08-05 00:13:10'),
(52, '192.168.6.130', 'FERCHO BARBOSA', 'cliente', NULL, NULL, '2025-08-05 00:13:22'),
(53, '192.168.6.119', 'JAVIER MUÑOZ', 'cliente', NULL, NULL, '2025-08-05 00:13:34'),
(54, '192.168.6.122', 'LENY MOHECHIZA', 'cliente', NULL, NULL, '2025-08-05 00:13:53'),
(55, '192.168.6.132', 'MARCELA INSAUSTY', 'cliente', NULL, NULL, '2025-08-05 00:14:02'),
(56, '192.168.6.126', 'MARTA GONZALEZ', 'cliente', NULL, NULL, '2025-08-05 00:14:14'),
(57, '192.168.6.129', 'MIGUEL PORT - GRANJA', 'cliente', NULL, NULL, '2025-08-05 00:14:34'),
(58, '192.168.6.106', 'MIGUEL PORT - CASA', 'cliente', NULL, NULL, '2025-08-05 00:14:45'),
(59, '192.168.6.120', 'OSWALDO DELGADO', 'cliente', NULL, NULL, '2025-08-05 00:14:55'),
(60, '192.168.6.107', 'SEBASTIAN INSUASTY', 'cliente', NULL, NULL, '2025-08-05 00:15:07'),
(61, '192.168.6.117', 'LEIDY INSUASTY', 'cliente', NULL, NULL, '2025-08-05 00:15:29'),
(62, '192.168.6.128', 'EDGARDO ORTEGA', 'cliente', NULL, NULL, '2025-08-05 00:23:32'),
(63, '192.168.6.114', 'JAVIER CABRERA', 'cliente', NULL, NULL, '2025-08-05 00:23:47'),
(64, '192.168.6.104', 'JENNY ZAMBRANO', 'cliente', NULL, NULL, '2025-08-05 00:24:04'),
(65, '192.168.6.103', 'JUAN CARLOS CHAVEZ', 'cliente', NULL, NULL, '2025-08-05 00:24:16'),
(67, '192.168.6.123', 'JUAN CARLOS GONZALEZ', 'cliente', NULL, NULL, '2025-08-05 00:26:07'),
(68, '192.168.6.108', 'MARIA HELENA INSUASTY', 'cliente', NULL, NULL, '2025-08-05 00:27:03'),
(69, '192.168.6.111', 'NIVIA INSUASTY', 'cliente', NULL, NULL, '2025-08-05 00:27:12'),
(70, '192.168.6.124', 'OMAR INSUASTY', 'cliente', NULL, NULL, '2025-08-05 00:27:24'),
(71, '192.168.4.24', 'BAYARDO INSUASTY', 'cliente', NULL, NULL, '2025-08-05 00:30:57'),
(72, '192.168.4.49', 'CAMEN INSUASTY', 'cliente', NULL, NULL, '2025-08-05 00:31:09'),
(73, '192.168.4.20', 'DANY GUZMAN', 'cliente', NULL, NULL, '2025-08-05 00:32:01'),
(74, '192.168.4.23', 'DANILO CORDOBA', 'cliente', NULL, NULL, '2025-08-05 00:32:10'),
(75, '192.168.4.26', 'DARWIN BURBANO', 'cliente', NULL, NULL, '2025-08-05 00:32:22'),
(77, '192.168.4.25', 'NELSON INSUASTY', 'cliente', NULL, NULL, '2025-08-05 00:32:54'),
(78, '192.168.4.30', 'WILLIAM ANDRADE', 'cliente', NULL, NULL, '2025-08-05 00:33:06'),
(79, '192.168.4.6', 'REPETIDORA EL ROSARIO 4.6', 'repetidora', NULL, NULL, '2025-08-05 00:35:46'),
(80, '192.168.4.22', 'JAVIER MUÑOZ -PUEBLO', 'cliente', NULL, NULL, '2025-08-05 00:36:56'),
(95, '192.168.6.1', 'SWITCH 6.1', 'switch', 'Yacuanquer', '', '2025-08-07 00:04:37'),
(96, '190.90.154.115', 'SERVIDOR VPN', 'servidor_vpn', 'YACUANQUER', 'IP Publica', '2025-08-07 00:10:10'),
(97, '8.8.8.8', 'CONEXION FIBRA', 'proveedor_internet', '', '', '2025-08-06 20:26:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

DROP TABLE IF EXISTS `facturas`;
CREATE TABLE IF NOT EXISTS `facturas` (
  `factura_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `plan_id` int DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  `fecha_factura` date NOT NULL,
  `estado` varchar(50) DEFAULT 'Pendiente',
  `modificado_por` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  PRIMARY KEY (`factura_id`),
  KEY `fk_factura_usuario` (`usuario_id`),
  KEY `fk_factura_plan` (`plan_id`),
  KEY `fk_factura_modificado_por` (`modificado_por`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `facturas`
--

INSERT INTO `facturas` (`factura_id`, `usuario_id`, `plan_id`, `monto`, `concepto`, `fecha_factura`, `estado`, `modificado_por`, `fecha_modificacion`) VALUES
(1, 26, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(2, 27, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(3, 28, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(4, 29, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(5, 30, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(6, 31, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(7, 32, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(8, 33, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(9, 35, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(10, 36, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(11, 37, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(12, 38, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(13, 39, 10, 30000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(14, 40, 2, 40000.00, NULL, '2025-09-16', 'Pagada', 123456, '2025-09-15 22:16:29'),
(15, 41, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(16, 42, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(17, 43, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(18, 44, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(19, 45, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(20, 46, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(21, 47, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(22, 48, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(23, 50, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(24, 50, 4, 50000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(25, 34, 9, 20000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(26, 51, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(27, 52, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(28, 53, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(29, 54, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(30, 55, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(31, 56, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(32, 57, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(33, 58, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(34, 59, 4, 50000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(35, 60, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(36, 61, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(37, 62, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(38, 63, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(39, 64, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(40, 65, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(41, 66, 4, 50000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(42, 67, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(43, 68, 4, 50000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(44, 69, 4, 50000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(45, 70, 9, 20000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(46, 71, 10, 30000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(47, 72, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(48, 73, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(49, 74, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(50, 75, 10, 30000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(51, 76, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(52, 77, 10, 30000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(53, 78, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(54, 79, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(55, 80, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(56, 81, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(57, 82, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(58, 82, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(59, 83, 1, 35000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(60, 25, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL),
(61, 84, 2, 40000.00, NULL, '2025-09-16', 'Pendiente', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos`
--

DROP TABLE IF EXISTS `gastos`;
CREATE TABLE IF NOT EXISTS `gastos` (
  `expense_id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `description` text,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`expense_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `gastos`
--

INSERT INTO `gastos` (`expense_id`, `category`, `description`, `amount`, `date`, `created_at`, `category_id`) VALUES
(6, 'ARRIENDO', 'ANDREA INSUASTY', 55000.00, '2025-09-16', '2025-09-16 04:34:30', NULL),
(7, 'INTERNET', 'CONEXION FIBRA SAS', 589050.00, '2025-09-16', '2025-09-16 04:34:42', NULL),
(8, 'INTERNET', 'CONECTIVA SAS', 80000.00, '2025-09-16', '2025-09-16 04:34:42', NULL),
(11, 'ARRIENDO', 'DIEGO INSUASTY', 20000.00, '2025-09-16', '2025-09-16 04:54:10', NULL),
(12, 'ARRIENDO', 'BEATRIZ INSUASTY', 25000.00, '2025-09-16', '2025-09-16 04:54:10', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos_categoria`
--

DROP TABLE IF EXISTS `gastos_categoria`;
CREATE TABLE IF NOT EXISTS `gastos_categoria` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `gastos_categoria`
--

INSERT INTO `gastos_categoria` (`category_id`, `category_name`) VALUES
(9, 'ARRIENDO'),
(10, 'ENERGIA'),
(8, 'INTERNET');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos_recurrentes`
--

DROP TABLE IF EXISTS `gastos_recurrentes`;
CREATE TABLE IF NOT EXISTS `gastos_recurrentes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `description` text CHARACTER SET latin1 COLLATE latin1_swedish_ci,
  `amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `gastos_recurrentes`
--

INSERT INTO `gastos_recurrentes` (`id`, `category`, `description`, `amount`) VALUES
(1, 'INTERNET', 'CONEXION FIBRA SAS', 589050.00),
(2, 'INTERNET', 'CONECTIVA SAS', 80000.00),
(3, 'ARRIENDO', 'ANDREA INSUASTY', 55000.00),
(4, 'ARRIENDO', 'DIEGO INSUASTY', 20000.00),
(5, 'ARRIENDO', 'BEATRIZ INSUASTY', 25000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

DROP TABLE IF EXISTS `planes`;
CREATE TABLE IF NOT EXISTS `planes` (
  `plan_id` int NOT NULL AUTO_INCREMENT,
  `nombre_plan` varchar(100) NOT NULL,
  `velocidad` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`plan_id`),
  UNIQUE KEY `nombre_plan` (`nombre_plan`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `planes`
--

INSERT INTO `planes` (`plan_id`, `nombre_plan`, `velocidad`, `precio`) VALUES
(1, 'Plan Residencial 15Mbps', '15M/15M', 35000.00),
(2, 'Plan Residencial 20Mbps', '20M/20M', 40000.00),
(3, 'Plan Residencial 30Mbps', '30M/30M', 45000.00),
(4, 'Plan Residencial 40Mbps', '40M/40M', 50000.00),
(5, 'Plan Residencial 50Mbps', '50M/50M', 55000.00),
(6, 'Plan Residencial 100Mbps', '100M/100M', 65000.00),
(7, 'Plan Residencial 200Mbps', '200M/200M', 100000.00),
(8, 'Plan Residencial 300Mbps', '300M/300M', 150000.00),
(9, 'PLAN FAMILIA', '20M/20M', 20000.00),
(10, 'PLAN AMIGOS', '15M/15M', 30000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(100) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`rol_id`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`rol_id`, `nombre_rol`, `descripcion`) VALUES
(1, 'Cliente', 'Usuarios normales de los servicios, con acceso limitado al portal de pagos.'),
(2, 'Usuario de Gestión', 'Usuarios con acceso al panel de administración y permisos configurables por módulo.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_modulos`
--

DROP TABLE IF EXISTS `rol_modulos`;
CREATE TABLE IF NOT EXISTS `rol_modulos` (
  `rol_modulo_id` int NOT NULL AUTO_INCREMENT,
  `rol_id` int NOT NULL,
  `nombre_modulo` varchar(100) NOT NULL,
  PRIMARY KEY (`rol_modulo_id`),
  UNIQUE KEY `uq_rol_modulo` (`rol_id`,`nombre_modulo`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_activos`
--

DROP TABLE IF EXISTS `tipos_activos`;
CREATE TABLE IF NOT EXISTS `tipos_activos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `cantidad_total` int NOT NULL DEFAULT '0',
  `cantidad_disponible` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tipos_activos`
--

INSERT INTO `tipos_activos` (`id`, `nombre`, `cantidad_total`, `cantidad_disponible`) VALUES
(1, 'LiteBeam M5-23', 70, 67),
(2, 'Route Wifi', 30, 30),
(3, 'Repetidora LiteGPS 90', 3, 2),
(4, 'Router Mikrotik', 3, 0),
(5, 'Ponchadora RJ45', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `correo` varchar(191) NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `rol_id` int NOT NULL DEFAULT '1',
  `password_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `fk_usuario_rol` (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1087960572 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `nombre`, `correo`, `celular`, `direccion`, `rol_id`, `password_hash`) VALUES
(25, 'ALBERTO INSUASTY', 'usuario25@netline.com', '315222222', 'yacuanquer', 1, NULL),
(26, 'ALDEMAR RIASCOS', 'usuario26@netline.com', '315222223', 'yacuanquer', 1, NULL),
(27, 'ALEJANDRA LASSO', 'usuario27@netline.com', '315222224', 'yacuanquer', 1, NULL),
(28, 'AMPARO NOGUERA', 'usuario28@netline.com', '315222225', 'yacuanquer', 1, NULL),
(29, 'ANDRES MUÑOZ', 'usuario29@netline.com', '315222226', 'yacuanquer', 1, NULL),
(30, 'ANDRES RECALDE', 'usuario30@netline.com', '315222227', 'yacuanquer', 1, NULL),
(31, 'ANDRES RODRIGUEZ', 'usuario31@netline.com', '315222228', 'yacuanquer', 1, NULL),
(32, 'BERTILA BARBOSA', 'usuario32@netline.com', '315222229', 'yacuanquer', 1, NULL),
(33, 'CARLOS PIZARRO', 'usuario33@netline.com', '315222230', 'yacuanquer', 1, NULL),
(34, 'CARMEN INSUASTY', 'usuario34@netline.com', '315222231', 'yacuanquer', 1, NULL),
(35, 'DANI GUZMAN', 'usuario35@netline.com', '315222232', 'yacuanquer', 1, NULL),
(36, 'DANIELA RAMOS', 'usuario36@netline.com', '315222233', 'yacuanquer', 1, NULL),
(37, 'DIEGO PORTILLO', 'usuario37@netline.com', '315222234', 'yacuanquer', 1, NULL),
(38, 'DIELA CHAMORRO', 'usuario38@netline.com', '315222235', 'yacuanquer', 1, NULL),
(39, 'DIGMAR INSUASTY', 'usuario39@netline.com', '315222236', 'yacuanquer', 1, NULL),
(40, 'EDGARDO INSUASTY', 'usuario40@netline.com', '315222237', 'yacuanquer', 1, NULL),
(41, 'EDGARDO ORTEGA', 'usuario41@netline.com', '315222238', 'yacuanquer', 1, NULL),
(42, 'FAVIAN FERNANDEZ', 'usuario42@netline.com', '315222239', 'yacuanquer', 1, NULL),
(43, 'FERCHO BARBOSA', 'usuario43@netline.com', '315222240', 'yacuanquer', 1, NULL),
(44, 'FERNANDO PORTILLA', 'usuario44@netline.com', '315222241', 'yacuanquer', 1, NULL),
(45, 'GABRIEL PORTILLO', 'usuario45@netline.com', '315222242', 'yacuanquer', 1, NULL),
(46, 'HAROL CADENA', 'usuario46@netline.com', '315222243', 'yacuanquer', 1, NULL),
(47, 'HAROL GOMEZ', 'usuario47@netline.com', '315222244', 'yacuanquer', 1, NULL),
(48, 'HOMERO RIASCOS', 'usuario48@netline.com', '315222245', 'yacuanquer', 1, NULL),
(49, 'JAVIER CABRERA', 'usuario49@netline.com', '315222246', 'yacuanquer', 1, NULL),
(50, 'JAVIER MUÑOZ (casa y pueblo)', 'usuario50@netline.com', '315222247', 'yacuanquer', 1, NULL),
(51, 'JENNY INSUASTY', 'usuario51@netline.com', '315222248', 'yacuanquer', 1, NULL),
(52, 'JHONATAN INSUASTY', 'usuario52@netline.com', '315222249', 'yacuanquer', 1, NULL),
(53, 'JOSE URBINA', 'usuario53@netline.com', '315222250', 'yacuanquer', 1, NULL),
(54, 'JUAN CARLOS CHAVES', 'usuario54@netline.com', '315222251', 'yacuanquer', 1, NULL),
(55, 'JUAN CARLOS GONZALEZ', 'usuario55@netline.com', '315222252', 'yacuanquer', 1, NULL),
(56, 'JULIO RIASCOS', 'usuario56@netline.com', '315222253', 'yacuanquer', 1, NULL),
(57, 'LEIDY INSUASTY RIASCOS', 'usuario57@netline.com', '315222254', 'yacuanquer', 1, NULL),
(58, 'LENY - MOHECHIZA', 'usuario58@netline.com', '315222255', 'yacuanquer', 1, NULL),
(59, 'LEONEL PORTILLO', 'usuario59@netline.com', '315222256', 'yacuanquer', 1, NULL),
(60, 'LEONILA BURBANO', 'usuario60@netline.com', '315222257', 'yacuanquer', 1, NULL),
(61, 'MARCELA BURGOS', 'usuario61@netline.com', '315222258', 'yacuanquer', 1, NULL),
(62, 'MARCELA INSUASTY', 'usuario62@netline.com', '315222259', 'yacuanquer', 1, NULL),
(63, 'MARIA ELENA INSUASTY', 'usuario63@netline.com', '315222260', 'yacuanquer', 1, NULL),
(64, 'MARIO ROSERO', 'usuario64@netline.com', '315222261', 'yacuanquer', 1, NULL),
(65, 'MARITZA PORTILLO', 'usuario65@netline.com', '315222262', 'yacuanquer', 1, NULL),
(66, 'MARTHA GONZALES', 'usuario66@netline.com', '315222263', 'yacuanquer', 1, NULL),
(67, 'MENANDRO APRAEZ', 'usuario67@netline.com', '315222264', 'yacuanquer', 1, NULL),
(68, 'MIGUEL PORTILLO - CASA', 'usuario68@netline.com', '315222265', 'yacuanquer', 1, NULL),
(69, 'MIGUEL PORTILLO - GRANJA', 'usuario69@netline.com', '315222266', 'yacuanquer', 1, NULL),
(70, 'NELSON INSUASTY', 'usuario70@netline.com', '315222267', 'yacuanquer', 1, NULL),
(71, 'NIVIA INSUASTY', 'usuario71@netline.com', '315222268', 'yacuanquer', 1, NULL),
(72, 'ODILA CAEZ', 'usuario72@netline.com', '315222269', 'yacuanquer', 1, NULL),
(73, 'OMAR INSUASTY', 'usuario73@netline.com', '315222270', 'yacuanquer', 1, NULL),
(74, 'ONEIDA RIASCOS', 'usuario74@netline.com', '315222271', 'yacuanquer', 1, NULL),
(75, 'OSCAR LOPEZ', 'usuario75@netline.com', '315222272', 'yacuanquer', 1, NULL),
(76, 'OSWALDO DELGADO', 'usuario76@netline.com', '315222273', 'yacuanquer', 1, NULL),
(77, 'PAOLA RIASCOS', 'usuario77@netline.com', '315222274', 'yacuanquer', 1, NULL),
(78, 'RAY MUNDO FUERTES', 'usuario78@netline.com', '315222275', 'yacuanquer', 1, NULL),
(79, 'ROSIO INSUASTY', 'usuario79@netline.com', '315222276', 'yacuanquer', 1, NULL),
(80, 'SEBASTIAN INSUASTY', 'usuario80@netline.com', '315222277', 'yacuanquer', 1, NULL),
(81, 'SEBASTIAN RIASCOS CORD', 'usuario81@netline.com', '315222278', 'yacuanquer', 1, NULL),
(82, 'VIVIANA PORTILLO', 'usuario82@netline.com', '315222279', 'yacuanquer', 1, NULL),
(83, 'WILLIAM ANDRADE', 'usuario84@netline.com', '315222281', 'yacuanquer', 1, NULL),
(84, 'LUIS RODRIGUEZ', 'usuario85@netline.com', '3158584434', 'Mohechiza', 1, NULL),
(12345, 'Contabilidad', 'contabilidad@netline.com', '3155555556', 'yacuanquer', 2, '$2y$10$2ZHgnr79IMTQdNrpCP111.PrngcwTu0Evt8WJRX4fS8f1q8/pIfvu'),
(12555, 'Tecnico Operativo', 'soporte1@netline.com', '', '', 2, '$2y$10$d8WLAyzhlhTQrCrdL.WH/OlS6.Q9LeNZagbZP8EjHuDK.OteF4Lxq'),
(45855, 'Facturacion', 'facturacion@netline.com', '3152522545', 'yacuanquer', 2, '$2y$10$bJ01Q9r/l7B4MKcVfqwOXukzG0/p0vJRwUL4vlD4GtFYTNqXeUptm'),
(123456, 'Super Admin', 'administrador@netline.com', '3156513179', 'Yacuanquer - Nariño', 2, '$2y$10$dmP9z9zgsDc08IJCt97baeWhE01KGZYQgWyR7eeRMt/zlB0NTfVdu'),
(27548656, 'YANIRA INSUASTY', 'yanira@netline.com', '', '', 2, '$2y$10$zgKutDAcfKGPyI1m/3hWHe.Ui8klsZEo/EV.UYm81zJXF55OzwG4O'),
(1087960571, 'Administrador WEB', 'administradorweb@netline.com', '3156513179', 'yacuanquer', 2, '$2y$10$EdiyjbQFP0cRccVscq8QKerzawV8lI.KVJIXr9bYExloxrpqjAZum');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_modulos`
--

DROP TABLE IF EXISTS `usuario_modulos`;
CREATE TABLE IF NOT EXISTS `usuario_modulos` (
  `usuario_modulo_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre_modulo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`usuario_modulo_id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuario_modulos`
--

INSERT INTO `usuario_modulos` (`usuario_modulo_id`, `usuario_id`, `nombre_modulo`) VALUES
(85, 12555, 'planes'),
(86, 12555, 'queues'),
(87, 12555, 'monitoreo'),
(118, 1087960571, 'usuarios'),
(119, 1087960571, 'planes'),
(120, 1087960571, 'facturacion'),
(121, 1087960571, 'ingresos-gastos'),
(122, 1087960571, 'inventario'),
(141, 12345, 'facturacion'),
(142, 12345, 'ingresos-gastos'),
(143, 12345, 'inventario'),
(144, 45855, 'facturacion'),
(145, 27548656, 'facturacion'),
(146, 123456, 'usuarios'),
(147, 123456, 'planes'),
(148, 123456, 'facturacion'),
(149, 123456, 'recaudo'),
(150, 123456, 'ingresos-gastos'),
(151, 123456, 'inventario'),
(152, 123456, 'queues'),
(153, 123456, 'monitoreo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_planes`
--

DROP TABLE IF EXISTS `usuario_planes`;
CREATE TABLE IF NOT EXISTS `usuario_planes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `fecha_asignacion` date NOT NULL,
  `estado_plan` varchar(50) DEFAULT 'Activo',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuario_plan` (`usuario_id`,`plan_id`),
  KEY `fk_up_plan` (`plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuario_planes`
--

INSERT INTO `usuario_planes` (`id`, `usuario_id`, `plan_id`, `fecha_asignacion`, `estado_plan`) VALUES
(13, 26, 1, '2025-08-22', 'Activo'),
(14, 27, 1, '2025-08-22', 'Activo'),
(15, 28, 1, '2025-08-22', 'Activo'),
(16, 29, 1, '2025-08-22', 'Activo'),
(17, 30, 1, '2025-08-22', 'Activo'),
(18, 31, 2, '2025-08-22', 'Activo'),
(19, 32, 1, '2025-08-22', 'Activo'),
(20, 33, 2, '2025-08-22', 'Activo'),
(21, 35, 2, '2025-08-22', 'Activo'),
(22, 36, 1, '2025-08-22', 'Activo'),
(23, 37, 2, '2025-08-22', 'Activo'),
(24, 38, 2, '2025-08-22', 'Activo'),
(26, 39, 10, '2025-08-22', 'Activo'),
(27, 40, 2, '2025-08-22', 'Activo'),
(28, 41, 1, '2025-08-22', 'Activo'),
(29, 42, 1, '2025-08-22', 'Activo'),
(30, 43, 1, '2025-08-22', 'Activo'),
(31, 44, 1, '2025-08-22', 'Activo'),
(32, 45, 1, '2025-08-22', 'Activo'),
(33, 46, 1, '2025-08-22', 'Activo'),
(34, 47, 1, '2025-08-22', 'Activo'),
(35, 48, 1, '2025-08-22', 'Activo'),
(37, 50, 2, '2025-08-22', 'Activo'),
(38, 50, 4, '2025-08-22', 'Activo'),
(39, 34, 9, '2025-08-22', 'Activo'),
(40, 51, 1, '2025-08-22', 'Activo'),
(41, 52, 1, '2025-08-22', 'Activo'),
(42, 53, 1, '2025-08-22', 'Activo'),
(43, 54, 1, '2025-08-22', 'Activo'),
(44, 55, 1, '2025-08-22', 'Activo'),
(45, 56, 1, '2025-08-22', 'Activo'),
(46, 57, 1, '2025-08-22', 'Activo'),
(47, 58, 2, '2025-08-22', 'Activo'),
(48, 59, 4, '2025-08-22', 'Activo'),
(49, 60, 2, '2025-08-22', 'Activo'),
(50, 61, 1, '2025-08-22', 'Activo'),
(51, 62, 1, '2025-08-22', 'Activo'),
(52, 63, 1, '2025-08-22', 'Activo'),
(53, 64, 1, '2025-08-22', 'Activo'),
(54, 65, 1, '2025-08-22', 'Activo'),
(55, 66, 4, '2025-08-22', 'Activo'),
(56, 67, 1, '2025-08-22', 'Activo'),
(57, 68, 4, '2025-08-22', 'Activo'),
(58, 69, 4, '2025-08-22', 'Activo'),
(59, 70, 9, '2025-08-22', 'Activo'),
(60, 71, 10, '2025-08-22', 'Activo'),
(61, 72, 1, '2025-08-22', 'Activo'),
(62, 73, 1, '2025-08-22', 'Activo'),
(63, 74, 1, '2025-08-22', 'Activo'),
(64, 75, 10, '2025-08-22', 'Activo'),
(65, 76, 2, '2025-08-22', 'Activo'),
(66, 77, 10, '2025-08-22', 'Activo'),
(67, 78, 1, '2025-08-22', 'Activo'),
(68, 79, 1, '2025-08-22', 'Activo'),
(69, 80, 2, '2025-08-22', 'Activo'),
(70, 81, 2, '2025-08-22', 'Activo'),
(71, 82, 1, '2025-08-22', 'Activo'),
(72, 82, 2, '2025-08-22', 'Activo'),
(73, 83, 1, '2025-08-22', 'Activo'),
(82, 25, 2, '2025-08-27', 'Activo'),
(83, 84, 2, '2025-09-12', 'Activo');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `activos_asignados`
--
ALTER TABLE `activos_asignados`
  ADD CONSTRAINT `activos_asignados_ibfk_1` FOREIGN KEY (`tipo_activo_id`) REFERENCES `tipos_activos` (`id`),
  ADD CONSTRAINT `activos_asignados_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `conexiones`
--
ALTER TABLE `conexiones`
  ADD CONSTRAINT `conexiones_ibfk_1` FOREIGN KEY (`origen_id`) REFERENCES `dispositivos` (`id`);

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `fk_factura_modificado_por` FOREIGN KEY (`modificado_por`) REFERENCES `usuarios` (`usuario_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_factura_plan` FOREIGN KEY (`plan_id`) REFERENCES `planes` (`plan_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_factura_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `rol_modulos`
--
ALTER TABLE `rol_modulos`
  ADD CONSTRAINT `fk_rm_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_modulos`
--
ALTER TABLE `usuario_modulos`
  ADD CONSTRAINT `fk_um_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_planes`
--
ALTER TABLE `usuario_planes`
  ADD CONSTRAINT `fk_up_plan` FOREIGN KEY (`plan_id`) REFERENCES `planes` (`plan_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_up_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
