-- phpMyAdmin SQL Dump
-- version 4.4.15.9
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 15, 2018 at 08:21 AM
-- Server version: 5.6.37
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `learn_hebrew`
--

-- --------------------------------------------------------

--
-- Table structure for table `dictionary`
--

CREATE TABLE IF NOT EXISTS `dictionary` (
  `dictionary_id` int(11) NOT NULL,
  `dictionary_word_he` varchar(150) NOT NULL,
  `dictionary_word_en` varchar(150) NOT NULL,
  `dictionary_word_tr` varchar(150) NOT NULL,
  `dictionary_word_type` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `dictionary`
--

INSERT INTO `dictionary` (`dictionary_id`, `dictionary_word_he`, `dictionary_word_en`, `dictionary_word_tr`, `dictionary_word_type`) VALUES
(6, 'wqj', 'jojio', 'ji', 'verb');

-- --------------------------------------------------------

--
-- Table structure for table `raiting`
--

CREATE TABLE IF NOT EXISTS `raiting` (
  `raiting_id` int(11) NOT NULL,
  `raiting_word_id` int(11) NOT NULL,
  `raiting_user_id` int(11) NOT NULL,
  `raitinf_user_check` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `users_id` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `users_name` varchar(50) NOT NULL,
  `users_email` varchar(50) NOT NULL,
  `users_password` varchar(50) NOT NULL,
  `users_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`users_id`, `users_name`, `users_email`, `users_password`, `users_status`) VALUES
('2018-06-11 16:39:00', 'Serjio', 'serjio.rv@gmail.com', 'jewcards', 'CREATED');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dictionary`
--
ALTER TABLE `dictionary`
  ADD PRIMARY KEY (`dictionary_id`);

--
-- Indexes for table `raiting`
--
ALTER TABLE `raiting`
  ADD PRIMARY KEY (`raiting_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `users_id` (`users_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dictionary`
--
ALTER TABLE `dictionary`
  MODIFY `dictionary_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `raiting`
--
ALTER TABLE `raiting`
  MODIFY `raiting_id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
