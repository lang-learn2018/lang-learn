# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.22)
# Database: learn_hebrew
# Generation Time: 2018-06-15 13:55:04 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table dictionary
# ------------------------------------------------------------

DROP TABLE IF EXISTS `dictionary`;

CREATE TABLE `dictionary` (
  `dictionary_id` int(11) NOT NULL AUTO_INCREMENT,
  `dictionary_word_he` varchar(150) NOT NULL,
  `dictionary_word_inf` varchar(50) NOT NULL,
  `dictionary_word_en` varchar(150) NOT NULL,
  `dictionary_word_tr` varchar(150) NOT NULL,
  `dictionary_word_type` varchar(50) NOT NULL,
  PRIMARY KEY (`dictionary_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `dictionary` WRITE;
/*!40000 ALTER TABLE `dictionary` DISABLE KEYS */;

INSERT INTO `dictionary` (`dictionary_id`, `dictionary_word_he`, `dictionary_word_inf`, `dictionary_word_en`, `dictionary_word_tr`, `dictionary_word_type`)
VALUES
	(7,'מִילָה','','word','','noun'),
	(18,'גַר','לַגוּר','to live','','verb'),
	(19,'קַם','לַַקוּם','to wake up','','verb'),
	(20,'טַס','לַַטוּס','to fly','','verb'),
	(21,'סַם','לַַַסִים','to put','','verb'),
	(23,'הוֹלֵך','לַלֶכֶת','to walk','','verb'),
	(24,'שׁוֹאֵל','לִשׁאוֹל','to ask','','verb'),
	(25,'אוֹכֵל','לֶאֱכוֹל','to eat','','verb'),
	(26,'שׁוֹתֵה','לִשׁתוֹת','to drink','','verb'),
	(27,'רוֹקֵד','לִרקוֹד','to dance','','verb'),
	(28,'מַכּיר','לֵהַכִּיר','to be familiar','','verb'),
	(29,'מִצטַעֵר','לֵהִצטַעֵר','to regret','','verb'),
	(30,'סְלִיחָה עַל הַאיחוּר','','sorry for the lateness','','frss'),
	(31,'מָמַב מִשְפַּהְתִי','','family status','','frss'),
	(32,'טוֹב','','good','','adj'),
	(33,'חָדַש','','new','','adj'),
	(34,'חָסֶר','','apbsent','','adj'),
	(35,'בַעַל','','husband','','noun'),
	(36,'כַּלְכֶּלַן','','economist','','noun');

/*!40000 ALTER TABLE `dictionary` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table raiting
# ------------------------------------------------------------

DROP TABLE IF EXISTS `raiting`;

CREATE TABLE `raiting` (
  `raiting_id` int(11) NOT NULL AUTO_INCREMENT,
  `raiting_word_id` int(11) NOT NULL,
  `raiting_user_id` int(11) NOT NULL,
  `raitinf_user_check` tinyint(1) NOT NULL,
  PRIMARY KEY (`raiting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `users_id` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `users_name` varchar(50) NOT NULL,
  `users_email` varchar(50) NOT NULL,
  `users_password` varchar(50) NOT NULL,
  `users_status` varchar(20) NOT NULL,
  UNIQUE KEY `users_id` (`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`users_id`, `users_name`, `users_email`, `users_password`, `users_status`)
VALUES
	('2018-06-07 16:33:58','sdfs','serjio.rv@gmail.com','111','CREATED'),
	('2018-06-07 16:39:24','f','ve.doroshenko@yandex.ru','1111','CREATED'),
	('2018-06-11 16:39:00','Serjio','serjio.rv@gmail.com','jewcards','CREATED');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
