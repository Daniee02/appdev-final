-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 15, 2026 at 10:15 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aqua_trade`
--

-- --------------------------------------------------------

--
-- Table structure for table `buyer_requests`
--

CREATE TABLE `buyer_requests` (
  `id` int(10) UNSIGNED NOT NULL,
  `buyer_id` int(10) UNSIGNED NOT NULL,
  `fish_species` varchar(100) NOT NULL,
  `quantity_kg` decimal(10,2) NOT NULL,
  `desired_price_per_kg` decimal(10,2) NOT NULL,
  `city` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `status` enum('open','in_progress','completed','cancelled') NOT NULL DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buyer_requests`
--

INSERT INTO `buyer_requests` (`id`, `buyer_id`, `fish_species`, `quantity_kg`, `desired_price_per_kg`, `city`, `notes`, `image_path`, `status`, `created_at`) VALUES
(1, 3, 'vbb', 555.00, 885.00, 'Vgg', 'Gg', 'uploads/requests/req_1768307500_6320.jpg', 'open', '2026-01-13 12:31:40');

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `fish_species` varchar(100) NOT NULL,
  `quantity_kg` decimal(10,2) NOT NULL,
  `price_per_kg` decimal(10,2) NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `fish_image` varchar(500) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `status` enum('active','pending','completed','cancelled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listings`
--

INSERT INTO `listings` (`id`, `buyer_id`, `fish_species`, `quantity_kg`, `price_per_kg`, `total_price`, `fish_image`, `delivery_date`, `status`, `created_at`) VALUES
(12, 3, 'dragon', 1.00, 1.00, 1.00, 'uploads/fish_1767724943_4469e691-3716-4c7a-a44b-7a2d9d19b52f.jpeg', '2012-11-11', 'cancelled', '2026-01-06 18:42:23'),
(13, 3, 'dadad', 313.00, 1312.00, 410656.00, 'uploads/fish_1767753491_Screenshot (3).png', '1222-12-12', 'active', '2026-01-07 02:38:11'),
(14, 3, 'dadad', 1.00, 1.00, 1.00, 'uploads/fish_1767763104_Screenshot (1).png', '2011-11-11', 'cancelled', '2026-01-07 05:18:24'),
(15, 1, 'dadads', 1.00, 12.00, 12.00, 'uploads/fish_1767767992_Screenshot (2).png', '3021-11-11', 'active', '2026-01-07 06:39:52'),
(16, 3, 'baba', 848.00, 5454.00, 4624992.00, 'uploads/fish_1768308703_listing.jpg', '0000-00-00', 'active', '2026-01-13 12:51:43'),
(17, 38, 'Yellow', 30.00, 130.00, 3900.00, 'uploads/fish_1768318820_listing.jpg', '0000-00-00', 'active', '2026-01-13 15:40:20'),
(18, 3, 'Hey', 5454.00, 88484.00, 482591736.00, 'uploads/fish_1768460586_listing.jpg', '0000-00-00', 'active', '2026-01-15 07:03:06'),
(19, 38, 'Yellowww', 5.00, 180.00, 900.00, 'uploads/fish_1768463375_listing.jpg', '0000-00-00', 'active', '2026-01-15 07:49:35');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `message_text` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `listing_id`, `message_text`, `is_read`, `created_at`, `image_path`) VALUES
(1, 5, 3, NULL, 'hii pKYY', 1, '2026-01-06 18:46:39', NULL),
(2, 5, 3, NULL, 'asasas\\', 1, '2026-01-06 19:10:50', NULL),
(3, 3, 5, NULL, 'sasasas', 1, '2026-01-06 19:11:17', NULL),
(4, 5, 1, 15, 'sasasas', 1, '2026-01-07 06:46:11', NULL),
(5, 1, 1, 15, 'sasas', 1, '2026-01-07 06:46:27', NULL),
(6, 5, 1, 15, 'helu dan', 1, '2026-01-07 06:47:47', NULL),
(7, 1, 1, NULL, 'sasas', 1, '2026-01-07 06:48:26', NULL),
(8, 5, 1, 15, 'helu', 1, '2026-01-07 07:03:21', NULL),
(9, 5, 1, 15, 'helo', 1, '2026-01-07 07:03:31', NULL),
(10, 5, 1, 15, 'hiiii', 1, '2026-01-07 07:26:06', NULL),
(11, 5, 3, 13, 'sasasasasas', 1, '2026-01-07 07:27:32', NULL),
(12, 3, 3, 13, 'sasasasas', 1, '2026-01-07 07:27:56', NULL),
(13, 1, 1, 15, 'asas', 1, '2026-01-07 07:29:06', NULL),
(14, 5, 1, 15, 'hgelo', 1, '2026-01-07 07:37:58', NULL),
(15, 5, 3, 13, 'helu', 1, '2026-01-07 07:38:05', NULL),
(16, 1, 3, 13, 'asas', 1, '2026-01-07 07:38:27', NULL),
(17, 5, 1, 15, 'sasas', 1, '2026-01-07 07:42:30', NULL),
(18, 1, 5, NULL, 'asasas', 1, '2026-01-07 08:03:00', NULL),
(19, 5, 1, 15, 'wassap', 1, '2026-01-07 08:03:42', NULL),
(20, 7, 1, 15, 'dasda', 1, '2026-01-07 08:28:55', NULL),
(21, 5, 1, 15, 'asjahshasahsjahsjhajhsajhsjhajsgvdmnsnas', 0, '2026-01-08 04:44:28', NULL),
(22, 3, 5, NULL, 'pakyu', 0, '2026-01-12 04:02:56', NULL),
(23, 34, 3, NULL, 'hi', 1, '2026-01-12 04:32:56', NULL),
(24, 3, 34, NULL, 'pakyu', 1, '2026-01-12 16:15:55', NULL),
(25, 3, 34, NULL, 'pakyu', 1, '2026-01-12 16:15:55', NULL),
(26, 35, 3, NULL, 'hi', 1, '2026-01-12 16:17:54', NULL),
(27, 34, 1, NULL, 'hello', 0, '2026-01-13 13:45:32', NULL),
(28, 36, 3, NULL, 'hii', 1, '2026-01-13 13:55:37', NULL),
(29, 34, 3, NULL, 'Helo', 1, '2026-01-13 14:03:03', NULL),
(30, 34, 1, NULL, 'Hello', 0, '2026-01-13 14:03:28', NULL),
(31, 34, 3, NULL, 'Helllooooo', 1, '2026-01-13 14:03:35', NULL),
(32, 37, 3, NULL, 'Hi', 1, '2026-01-13 14:04:53', NULL),
(33, 37, 1, NULL, 'hi', 0, '2026-01-13 14:10:37', NULL),
(34, 37, 3, NULL, '', 1, '2026-01-13 14:47:04', 'uploads/chat/chat_1768315624_9824.jpg'),
(35, 37, 3, NULL, '', 1, '2026-01-13 14:47:14', 'uploads/chat/chat_1768315634_2490.jpg'),
(36, 34, 3, NULL, '', 1, '2026-01-13 15:08:02', 'uploads/chat/chat_1768316877_4418.jpg'),
(37, 34, 3, NULL, '', 1, '2026-01-13 15:08:16', 'uploads/chat/chat_1768316895_5539.jpg'),
(38, 34, 1, NULL, '', 0, '2026-01-13 15:25:07', 'uploads/chat/chat_1768317901_8634.jpg'),
(39, 34, 3, NULL, 'Hello', 1, '2026-01-13 15:36:59', NULL),
(40, 37, 38, NULL, 'hi', 1, '2026-01-13 16:06:40', NULL),
(41, 38, 37, NULL, '', 0, '2026-01-13 16:58:59', 'uploads/chat/chat_1768323536_5780.jpg'),
(42, 34, 1, NULL, 'hi', 0, '2026-01-14 15:00:32', NULL),
(43, 34, 3, NULL, 'hoiij', 1, '2026-01-14 15:01:03', NULL),
(44, 3, 34, NULL, 'Helo', 1, '2026-01-14 15:07:01', NULL),
(45, 34, 3, NULL, 'Hello', 1, '2026-01-14 15:07:56', NULL),
(46, 34, 38, NULL, 'Hiiii', 1, '2026-01-14 15:08:50', NULL),
(47, 36, 38, NULL, 'Message 2', 1, '2026-01-14 15:11:20', NULL),
(48, 34, 38, NULL, '.essage 3', 1, '2026-01-14 15:12:44', NULL),
(49, 36, 38, NULL, 'Helloooo 3', 1, '2026-01-14 15:13:34', NULL),
(50, 39, 38, NULL, 'hello', 1, '2026-01-14 15:14:46', NULL),
(51, 36, 38, NULL, 'Upper 3', 1, '2026-01-14 15:15:33', NULL),
(52, 34, 38, NULL, 'Ehlslsks', 1, '2026-01-14 15:29:04', NULL),
(53, 39, 38, NULL, 'hahenne', 1, '2026-01-14 15:29:21', NULL),
(54, 38, 39, NULL, 'Hello', 1, '2026-01-14 15:35:58', NULL),
(55, 34, 38, NULL, 'Helppo 3', 1, '2026-01-14 15:42:04', NULL),
(56, 38, 34, NULL, 'Helloooo', 1, '2026-01-14 15:43:33', NULL),
(57, 38, 34, NULL, 'Hello w2', 1, '2026-01-14 15:43:37', NULL),
(58, 34, 38, NULL, 'Hellooo', 1, '2026-01-14 15:49:36', NULL),
(59, 34, 1, NULL, 'Hellooo', 0, '2026-01-14 15:49:44', NULL),
(60, 38, 34, NULL, 'Helloo', 1, '2026-01-14 15:53:07', NULL),
(61, 38, 34, NULL, '123', 1, '2026-01-14 15:53:10', NULL),
(62, 34, 38, NULL, 'Hhhhhhh', 1, '2026-01-14 15:55:27', NULL),
(63, 38, 34, NULL, 'Hjh', 1, '2026-01-14 15:59:47', NULL),
(64, 38, 37, NULL, 'hi', 0, '2026-01-14 16:51:49', NULL),
(65, 34, 38, NULL, 'Hi', 1, '2026-01-14 16:53:33', NULL),
(66, 38, 34, NULL, 'Hellow', 1, '2026-01-14 17:01:01', NULL),
(67, 38, 36, NULL, '4', 0, '2026-01-14 17:01:32', NULL),
(68, 39, 38, NULL, 'hello', 1, '2026-01-14 17:01:40', NULL),
(69, 38, 34, NULL, '12345', 1, '2026-01-14 17:02:16', NULL),
(70, 39, 38, NULL, 'hanekw', 1, '2026-01-14 17:02:41', NULL),
(71, 38, 39, NULL, 'Hello', 1, '2026-01-14 17:03:14', NULL),
(72, 39, 38, NULL, '2assap', 1, '2026-01-14 17:03:35', NULL),
(73, 38, 39, NULL, 'Hellow', 1, '2026-01-14 17:03:54', NULL),
(74, 39, 38, NULL, 'ruo', 1, '2026-01-14 17:04:07', NULL),
(75, 38, 39, NULL, '123', 1, '2026-01-14 17:04:45', NULL),
(76, 39, 38, NULL, 'asjame', 1, '2026-01-14 17:04:55', NULL),
(77, 38, 39, NULL, 'Hi', 1, '2026-01-14 17:05:33', NULL),
(78, 39, 38, NULL, 'yuu', 1, '2026-01-14 17:05:48', NULL),
(79, 38, 39, NULL, 'Hello', 1, '2026-01-14 17:07:49', NULL),
(80, 38, 39, NULL, '123', 1, '2026-01-14 17:08:00', NULL),
(81, 39, 38, NULL, 'hNabsbd', 1, '2026-01-14 17:18:20', NULL),
(82, 39, 38, NULL, 'sasad', 1, '2026-01-14 17:19:00', NULL),
(83, 39, 38, NULL, 'gshahje', 1, '2026-01-14 17:19:11', NULL),
(84, 38, 39, NULL, 'Hellow', 1, '2026-01-14 17:19:15', NULL),
(85, 39, 38, NULL, 'hahahe', 1, '2026-01-14 17:19:27', NULL),
(86, 39, 38, NULL, 'hsna auwnw', 1, '2026-01-14 17:24:44', NULL),
(87, 38, 39, NULL, 'Geroeo', 1, '2026-01-14 17:24:52', NULL),
(88, 39, 38, NULL, 'hsbebe', 1, '2026-01-14 17:25:01', NULL),
(89, 34, 3, NULL, 'i', 1, '2026-01-14 19:12:07', NULL),
(90, 34, 3, NULL, 'Hi', 1, '2026-01-14 19:45:10', NULL),
(91, 3, 37, NULL, 'Hi', 0, '2026-01-14 19:46:05', NULL),
(92, 3, 34, NULL, 'Hi', 1, '2026-01-14 19:52:47', NULL),
(93, 3, 34, NULL, 'Hiiii', 1, '2026-01-14 19:58:01', NULL),
(94, 3, 34, NULL, 'Hiii', 1, '2026-01-14 19:58:18', NULL),
(95, 34, 38, NULL, 'Haha', 1, '2026-01-14 19:58:37', NULL),
(96, 3, 34, NULL, 'Hahhah', 1, '2026-01-14 20:00:58', NULL),
(97, 3, 34, NULL, 'Bsnns', 1, '2026-01-14 20:01:00', NULL),
(98, 3, 34, NULL, 'pakyu', 1, '2026-01-14 21:10:21', NULL),
(99, 3, 34, NULL, 'wtf', 1, '2026-01-14 21:10:33', NULL),
(100, 3, 34, NULL, 'Heeko', 1, '2026-01-15 01:34:35', NULL),
(101, 3, 3, NULL, 'Hello', 1, '2026-01-15 01:34:44', NULL),
(102, 34, 38, NULL, 'Hello', 1, '2026-01-15 02:02:16', NULL),
(103, 34, 38, NULL, '', 1, '2026-01-15 02:11:44', 'uploads/chat/chat_1768443102_4321.jpg'),
(104, 38, 34, NULL, 'He\'ll', 1, '2026-01-15 02:28:55', NULL),
(105, 34, 3, NULL, 'He\'ll', 1, '2026-01-15 07:03:00', NULL),
(106, 34, 38, NULL, 'Eed this', 1, '2026-01-15 08:19:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 38, 'You have a new message.', 'new_message', 0, '2026-01-14 17:24:44'),
(2, 39, 'You have a new message.', 'new_message', 0, '2026-01-14 17:24:52'),
(3, 38, 'You have a new message.', 'new_message', 0, '2026-01-14 17:25:01'),
(4, 3, 'You have a new message.', 'new_message', 1, '2026-01-14 19:12:07'),
(5, 3, 'You have a new message.', 'new_message', 1, '2026-01-14 19:45:10'),
(6, 37, 'You have a new message.', 'new_message', 0, '2026-01-14 19:46:05'),
(7, 34, 'You have a new message.', 'new_message', 1, '2026-01-14 19:52:47'),
(8, 34, 'You have a new message.', 'new_message', 1, '2026-01-14 19:58:01'),
(9, 34, 'You have a new message.', 'new_message', 1, '2026-01-14 19:58:18'),
(10, 38, 'You have a new message.', 'new_message', 0, '2026-01-14 19:58:37'),
(11, 34, 'You have a new message.', 'new_message', 1, '2026-01-14 20:00:58'),
(12, 34, 'You have a new message.', 'new_message', 1, '2026-01-14 20:01:00'),
(13, 34, 'You have a new message.', 'new_message', 1, '2026-01-14 21:10:21'),
(14, 34, 'You have a new message.', 'new_message', 1, '2026-01-14 21:10:33'),
(15, 34, 'You have a new message.', 'new_message', 1, '2026-01-15 01:34:35'),
(16, 3, 'You have a new message.', 'new_message', 1, '2026-01-15 01:34:45'),
(17, 38, 'You have a new message.', 'new_message', 0, '2026-01-15 02:02:16'),
(18, 38, 'You have a new message.', 'new_message', 0, '2026-01-15 02:11:44'),
(19, 34, 'You have a new message.', 'new_message', 1, '2026-01-15 02:28:55'),
(20, 3, 'You have a new message.', 'new_message', 1, '2026-01-15 07:03:00'),
(21, 38, 'You have a new message.', 'new_message', 0, '2026-01-15 08:19:15');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `reviewer_id` int(11) DEFAULT NULL,
  `reviewed_user_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `reviewer_id`, `reviewed_user_id`, `rating`, `comment`, `transaction_id`, `created_at`) VALUES
(1, 38, 37, 4, 'S', NULL, '2026-01-13 17:54:47'),
(2, 3, 37, 5, 'Hii', NULL, '2026-01-13 18:14:02'),
(3, 3, 37, 5, 'Hi', NULL, '2026-01-13 18:14:56'),
(4, 3, 37, 5, 'Hey', NULL, '2026-01-13 18:34:06'),
(5, 3, 34, 5, 'Hi', NULL, '2026-01-13 18:34:23'),
(6, 3, 34, 1, 'Fuck u', NULL, '2026-01-13 18:34:32'),
(7, 3, 3, 4, 'Sjw', NULL, '2026-01-14 19:46:34'),
(8, 3, 1, 2, '', NULL, '2026-01-14 20:35:01'),
(9, 38, 34, 5, 'Goods', 25, '2026-01-15 04:22:16'),
(10, 34, 38, 1, 'Not bad', 28, '2026-01-15 04:35:42'),
(11, 34, 3, 5, '5', 23, '2026-01-15 07:03:37'),
(12, 40, 38, 5, 'E', NULL, '2026-01-15 08:23:38');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `fisherman_id` int(11) DEFAULT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` varchar(50) DEFAULT 'cod',
  `payment_qr_code` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `buyer_id`, `fisherman_id`, `listing_id`, `amount`, `status`, `created_at`, `payment_method`, `payment_qr_code`) VALUES
(1, 3, 5, 12, 1.00, 'pending', '2026-01-06 18:46:26', 'cod', NULL),
(2, 3, 5, 12, 1.00, 'pending', '2026-01-06 18:48:18', 'cod', NULL),
(3, 3, 5, 12, 1.00, 'pending', '2026-01-06 18:50:52', 'cod', NULL),
(4, 3, 5, 12, 1.00, 'pending', '2026-01-06 18:52:31', 'cod', NULL),
(5, 3, 5, 12, 1.00, 'pending', '2026-01-06 19:09:10', 'cod', NULL),
(6, 3, 5, 12, 1.00, 'pending', '2026-01-06 19:09:56', 'cod', NULL),
(7, 3, 5, 12, 1.00, 'pending', '2026-01-06 19:31:18', 'cod', NULL),
(8, 3, 5, 12, 1.00, 'pending', '2026-01-06 19:50:12', 'cod', NULL),
(9, 3, 7, 13, 3.00, 'pending', '2026-01-07 03:36:59', 'cod', NULL),
(11, 1, 7, 15, 1.00, 'pending', '2026-01-07 11:38:12', 'cod', NULL),
(12, 1, 5, 15, 1.00, 'pending', '2026-01-08 04:46:44', 'cod', NULL),
(13, 38, 3, 17, 3900.00, 'pending', '2026-01-15 03:15:03', 'cod', NULL),
(14, 38, 3, 17, 3900.00, 'pending', '2026-01-15 03:15:03', 'cod', NULL),
(15, 38, 3, 17, 3900.00, 'pending', '2026-01-15 03:15:03', 'cod', NULL),
(16, 38, 3, 17, 3900.00, 'pending', '2026-01-15 03:15:03', 'cod', NULL),
(17, 38, 3, 17, 3900.00, 'completed', '2026-01-15 03:15:03', 'cod', NULL),
(18, 38, 3, 17, 3900.00, 'completed', '2026-01-15 03:15:33', 'cod', NULL),
(19, 38, 34, 17, 3900.00, 'cancelled', '2026-01-15 03:20:00', 'cod', NULL),
(20, 38, 34, 17, 3900.00, 'cancelled', '2026-01-15 03:37:30', 'cod', NULL),
(21, 38, 34, 17, 3900.00, 'completed', '2026-01-15 03:37:41', 'cod', NULL),
(22, 3, 34, 16, 4624992.00, 'completed', '2026-01-15 03:39:06', 'cod', NULL),
(23, 3, 34, 16, 4624992.00, 'completed', '2026-01-15 03:45:36', 'cod', NULL),
(24, 1, 34, 15, 12.00, 'pending', '2026-01-15 04:10:57', 'cod', NULL),
(25, 38, 34, 17, 3900.00, 'completed', '2026-01-15 04:11:41', 'cod', NULL),
(26, 3, 34, 13, 410656.00, 'pending', '2026-01-15 04:11:54', 'cod', NULL),
(27, 1, 34, 15, 12.00, 'pending', '2026-01-15 04:17:56', 'cod', NULL),
(28, 38, 34, 17, 3900.00, 'completed', '2026-01-15 04:22:56', 'cod', NULL),
(29, 3, 34, 13, 410656.00, 'pending', '2026-01-15 04:24:55', 'cod', NULL),
(30, 38, 34, 17, 3900.00, 'cancelled', '2026-01-15 04:26:42', 'cod', NULL),
(31, 3, 34, 16, 4624992.00, 'pending', '2026-01-15 04:28:41', 'cod', NULL),
(32, 3, 34, 16, 4624992.00, 'pending', '2026-01-15 04:57:41', 'cod', NULL),
(33, 38, 34, 19, 900.00, 'completed', '2026-01-15 08:21:17', 'cod', NULL),
(34, 38, 40, 19, 900.00, 'pending', '2026-01-15 08:23:31', 'cod', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `user_type` enum('buyer','fisherman') NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_reviews` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_image` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `user_type`, `phone_number`, `address`, `city`, `rating`, `total_reviews`, `created_at`, `profile_image`, `is_verified`) VALUES
(1, 'shemkie123@gmail.com', '$2y$10$pHUKjx833rNd7L/X.Zdh/eZeUsq0ACbzHSb57ZqnRw7Dn0EdVDXE2', 'daniel', 'buyer', '13131313131', '4eadada', 'Cubay', 2.00, 1, '2026-01-06 09:53:15', NULL, 0),
(2, 'Qwp@gmail.com', '$2y$10$b9vvocvT3OkPzAoO3dGIguTCL.FIra6JEqU8O7IeNv9sesH2cbUFy', 'Rio Valente', 'fisherman', '09914753613', 'Centro Norte, Culasi, Antique ', 'Culasi', 0.00, 0, '2026-01-06 15:39:19', NULL, 0),
(3, 'Rio@gmail.com', '$2y$10$v83ThzwZRSxPEaHO27FDdu8wPHRWzjv2HkbOQ6iw.UwwjX4sDiXD2', 'Danielkakaoab', 'buyer', '123dad', 'Test', 'Test', 4.50, 2, '2026-01-06 15:40:42', 'uploads/profile/profile_1768416878_5217.heic', 0),
(4, 'Rio2gmail.com', '$2y$10$4A5F0xNvExF8BMXeQMH3O.HVwtjrKP54hozi0N23a3IuK4Jk6aO/6', 'Rioq', 'fisherman', '09951346613', 'Culasi', 'Culasi ', 0.00, 0, '2026-01-06 16:33:07', NULL, 0),
(5, 'helo@gmail.com', '$2y$10$LuJXMVgEzRRxVB3WE9/pWeDOkEabTBkJSaNAk.FEcuuy1LpDlzope', 'helo', 'fisherman', '09951321161', 'Centro Norte, Culasi, Antique', 'Culasi', 0.00, 0, '2026-01-06 18:43:55', NULL, 0),
(6, 'test@example.com', '$2y$10$4VS2/Bmwx7vzit4NCD589.Jfza/neKZ7o1YC6xk5QJLWwnJ8TMV9a', 'Test User', 'fisherman', '09123456789', 'Test Address', 'Iloilo', 0.00, 0, '2026-01-07 03:22:26', NULL, 0),
(7, 'rio5@gmail.com', '$2y$10$PQkeY4T5LQ4PsPn8ODjw5.kWoV3T3oKIBQmiOOQuLdj/h7FnTcLrK', 'skie', 'fisherman', '3424234', 'rwrw', '23423', 0.00, 0, '2026-01-07 03:36:06', NULL, 0),
(32, 'rio45@gmail.com', '$2y$10$PVkJTJeLZmaWcqUIFZZGJe/gOxuf1HhRbgAvQMDzLyKeAxvvn1A4.', 'dasda', 'buyer', 'dasda', 'dasd', 'asda', 0.00, 0, '2026-01-07 05:54:38', NULL, 0),
(33, 'shemkie12dasd3@gmail.com', '$2y$10$z4k7JyruFYYxqvXju3t5suOpDHJPzVdfsHCbJN27Owm9Y5TXkAb4u', 'dasdas', 'buyer', 'adsasd', 'adas', 'dasdasd', 0.00, 0, '2026-01-07 08:42:17', NULL, 0),
(34, 'g@gmail.com', '$2y$10$yV4FdSfW2ICw1IC0aG9FFehLhHgOppNGgxGw3j3OdPK.QOGv4FlQG', 'Daniel Tubig ', 'fisherman', '09953691316', 'Bugasong', 'Bugasong', 3.67, 3, '2026-01-11 18:55:13', 'uploads/profile/profile_1768462603_1697.jpeg', 1),
(35, 'hahah@gmail.com', '$2y$10$HQiPKZO9bWzyg9KOf1xGluOh92duH3yJy1lYTUSXAnv/.nP0Oocum', 'Ajajja', 'fisherman', '896464', 'Hahha', 'hajah', 0.00, 0, '2026-01-12 16:17:23', NULL, 0),
(36, 'skie@gmail.com', '$2y$10$HBKikxlpBW5Lndu4Z9do8ezQgyBgzbNXVAuT7dFEzhJ3tOrTHnSvW', 'daniel', 'fisherman', '54545', 'Daniel', 'Ahaha', 0.00, 0, '2026-01-13 13:55:16', NULL, 0),
(37, 'haha@gmail.com', '$2y$10$kouP9gg2uP9UM/9YMH5GeeTdle4WrW52fllfS9attuJLo2Its.wcq', 'Haja', 'fisherman', '6464', 'Hahaha', 'Hahah', 4.75, 4, '2026-01-13 14:04:32', NULL, 0),
(38, 'r@gmail.com', '$2y$10$XSCaRAT4bqpkTWuXPB8x9eYI5NXg33inwsAfaHtXe3IPMlt6w1JeO', 'R', 'buyer', '1', 'Q', 'Q', 3.00, 2, '2026-01-13 15:38:30', 'uploads/profile/profile_1768415593_3974.jpeg', 0),
(39, 'shem66069@gmail.com', '$2y$10$EYnK/jod8zcfEnqXJbu2NukXhqkM0fUjDkIjLbiC9yG7c8osf6Yj6', 'sam flores ', 'fisherman', '09278821921', 'san ruque ', 'antique7jj', 0.00, 0, '2026-01-14 15:14:07', 'uploads/profile/profile_1768415159_5565.jpeg', 0),
(40, 'q@gmail.com', '$2y$10$8QRc3ojKB/Lk7rSRKkQI/e1Cd2fSgnnj8J6lDpjx78Y3WqW.BXl0a', 'q', 'fisherman', '069513694', 'National Road', 'Culasi', 0.00, 0, '2026-01-15 08:23:13', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buyer_requests`
--
ALTER TABLE `buyer_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_buyer_requests_buyer` (`buyer_id`),
  ADD KEY `idx_buyer_requests_status` (`status`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_listings_buyer_id` (`buyer_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_messages_sender_receiver` (`sender_id`,`receiver_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buyer_requests`
--
ALTER TABLE `buyer_requests`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
