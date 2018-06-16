-- phpMyAdmin SQL Dump
-- version 4.4.15.9
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 16, 2018 at 09:15 AM
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

DROP TABLE IF EXISTS `dictionary`;
CREATE TABLE IF NOT EXISTS `dictionary` (
  `dictionary_id` int(11) NOT NULL,
  `dictionary_word_he` varchar(150) NOT NULL,
  `dictionary_word_inf` varchar(50) NOT NULL,
  `dictionary_word_en` varchar(150) NOT NULL,
  `dictionary_word_tr` varchar(150) NOT NULL,
  `dictionary_word_type` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `dictionary`
--

INSERT INTO `dictionary` (`dictionary_id`, `dictionary_word_he`, `dictionary_word_inf`, `dictionary_word_en`, `dictionary_word_tr`, `dictionary_word_type`) VALUES
(7, 'מִילָה', '', 'word', '', 'noun'),
(18, 'גַר', 'לַגוּר', 'to live', '', 'verb'),
(19, 'קַם', 'לַַקוּם', 'to wake up', '', 'verb'),
(20, 'טַס', 'לַַטוּס', 'to fly', '', 'verb'),
(21, 'סַם', 'לַַַסִים', 'to put', '', 'verb'),
(23, 'הוֹלֵך', 'לַלֶכֶת', 'to walk', '', 'verb'),
(24, 'שׁוֹאֵל', 'לִשׁאוֹל', 'to ask', '', 'verb'),
(25, 'אוֹכֵל', 'לֶאֱכוֹל', 'to eat', '', 'verb'),
(26, 'שׁוֹתֵה', 'לִשׁתוֹת', 'to drink', '', 'verb'),
(27, 'רוֹקֵד', 'לִרקוֹד', 'to dance', '', 'verb'),
(28, 'מַכּיר', 'לֵהַכִּיר', 'to be familiar', '', 'verb'),
(29, 'מִצטַעֵר', 'לֵהִצטַעֵר', 'to regret', '', 'verb'),
(30, 'סְלִיחָה עַל הַאיחוּר', '', 'sorry for the lateness', '', 'frss'),
(31, 'מָמַב מִשְפַּהְתִי', '', 'family status', '', 'frss'),
(32, 'טוֹב', '', 'good', '', 'adj'),
(33, 'חָדַש', '', 'new', '', 'adj'),
(34, 'חָסֶר', '', 'apbsent', '', 'adj'),
(35, 'בַעַל', '', 'husband', '', 'noun'),
(36, 'כַּלְכֶּלַן', '', 'economist', '', 'noun');

-- --------------------------------------------------------

--
-- Table structure for table `raiting`
--

DROP TABLE IF EXISTS `raiting`;
CREATE TABLE IF NOT EXISTS `raiting` (
  `raiting_id` int(11) NOT NULL,
  `raiting_word_id` int(11) NOT NULL,
  `raiting_user_id` int(11) NOT NULL,
  `raiting_user_check` tinyint(1) NOT NULL,
  `raiting_sum` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `users_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `users_name` varchar(50) NOT NULL,
  `users_email` varchar(50) NOT NULL,
  `users_password` varchar(50) NOT NULL,
  `users_status` varchar(20) NOT NULL,
  `users_login` varchar(100) NOT NULL,
  `users_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`users_time`, `users_name`, `users_email`, `users_password`, `users_status`, `users_login`, `users_id`) VALUES
('2018-06-07 13:33:58', 'sdfs', 'serjio.rv@gmail.com', '111', 'CREATED', '', 1),
('2018-06-07 13:39:24', 'f', 've.doroshenko@yandex.ru', '1111', 'CREATED', '', 2),
('2018-06-15 17:38:35', 'Serjio', 'serjio.rv@gmail.com', 'jewcards', 'CREATED', 'serjio', 3),
('2018-06-16 06:15:25', 'Arina', 'arina.y2443@gmail.com', 'arina2003', 'CREATED', 'arina', 4);

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
  ADD PRIMARY KEY (`users_id`),
  ADD UNIQUE KEY `users_id` (`users_time`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dictionary`
--
ALTER TABLE `dictionary`
  MODIFY `dictionary_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT for table `raiting`
--
ALTER TABLE `raiting`
  MODIFY `raiting_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `users_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
