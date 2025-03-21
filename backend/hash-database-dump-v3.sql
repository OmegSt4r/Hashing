CREATE DATABASE  IF NOT EXISTS `hashdatabase` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hashdatabase`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: hashdatabase
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `security_data`
--

DROP TABLE IF EXISTS `security_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_data` (
  `user_id` int DEFAULT NULL,
  `iv` varbinary(16) DEFAULT NULL,
  `salt` varbinary(16) DEFAULT NULL,
  KEY `user_id` (`user_id`),
  CONSTRAINT `security_data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_data`
--

LOCK TABLES `security_data` WRITE;
/*!40000 ALTER TABLE `security_data` DISABLE KEYS */;
INSERT INTO `security_data` VALUES (7,NULL,NULL),(9,NULL,NULL),(10,NULL,NULL),(11,NULL,NULL),(14,NULL,NULL),(15,_binary '�\�[v�KV\�\�w�\�',_binary 'x!eQ��\�;��\�NM'),(16,NULL,NULL),(17,NULL,NULL),(18,NULL,NULL),(19,NULL,NULL),(20,NULL,NULL),(21,NULL,NULL),(22,NULL,NULL),(23,_binary '\�8UÀ\�%w\��8�?m',_binary '5�y\��ݷ[�IU��1'),(24,NULL,NULL),(25,NULL,NULL),(26,NULL,NULL),(27,NULL,NULL);
/*!40000 ALTER TABLE `security_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `user_id` int DEFAULT NULL,
  `u_password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `p_encryption_type` varchar(255) NOT NULL,
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES (1,'example_password','example_email@example.com','AES'),(2,'example_password2','example_email@example.com2','AES'),(4,'5f2c199edd88bfd1ff59318a3f3576f9','test@test.com','pbkdf2'),(7,'$2b$10$sBq2XOvjODgzGURYuPyE1.aNLUIvqSfkN13WdadCPVHiNxQxfdrQu','test@test.com','bcrypt'),(9,'$argon2id$v=19$m=65536,t=3,p=1$Vm9xl+4JTb9NkRLhyW9uQA$1bhSRjLJWhT40A9n234VUGT5v/DL6R/wGk/kW7AUAIc','test@test.com','argon2'),(10,'$2b$10$E5nbXKXaeDCUdyXjND7Jzu3fnV3UkM1Rn3TlP8MDl4cqfn8JAEDue','test@test.com','bcrypt'),(11,'$2b$10$bSL.cNFoQeE0WwKViYak8u3SP7jZVmXAaNm8JMHbUeT1.I1gImQ9u','test@test.com','bcrypt'),(13,'$2b$10$q/VcKgkW52DAuCIhGXCnvucsnSQIWWFNvP5220ubGr4K8NiZhNWmq','test@test.com','bcrypt'),(14,'$2b$10$FV5aRT3eJi9rjoARVD6KHOiz4Vinx2uN8f3ey7zQ2D9iRGc2ygr1.','test@test.com','bcrypt'),(15,'e2211c28da0a2c490f51bff72b1763d3','test@test.com','pbkdf2'),(16,'$argon2id$v=19$m=65536,t=3,p=1$esw5eKK1ouwXulo665S+gQ$lplQg0KNibmfsQabvb+E8uWAtT3olUe+mSd36H8cfhA','test@test.com','argon2'),(17,'$argon2id$v=19$m=65536,t=3,p=1$JG09FUJscyX0lqOwrT7QmQ$xdqTHTJcq0G6+xpH4wWnfVzvM8ukCsM6cD7zLVY0mFc','test@test.com','argon2'),(18,'$2b$10$p4tT0Yu61Psa/B.u/3p17.ideTWhx9h0zrLvGHKgLkV0vOzFRl1r.','test@test.com','bcrypt'),(19,'$2b$10$8l7y.0SUSDxo8YWWT2KJQ.cNKXXdPeOdfnjxy3lfqk4TYMKUvFcyW','test@test.com','bcrypt'),(20,'$2b$10$6IkvAAcDhBB90yjjJg2YKuRNNzITXZnyei7rtPp.pJcZipWpyiUHm','test@test.com','bcrypt'),(21,'$2b$10$8iO7/taByUGiYg6fuWATFuJmQ7a6Uo2FcEYpLWPkuVD3R5THf.DO6','test@test.com','bcrypt'),(22,'$2b$10$5zVm2o138eCpbWjY.ksHvuizUW8y/7Y2hYXvr3ap/aJ1WaMe9KnF6','test@test.com','bcrypt'),(23,'a22eeaa1e0e91784cc8d1d55a50c45da','test@test.com','pbkdf2'),(24,'$argon2id$v=19$m=65536,t=3,p=1$LyQ7ojCbke6lPMjfcWWaRg$KdWozs94SeM92QL5ivrBIDT6kKwG9L968WdIp5XFCkc','test@test.com','argon2'),(25,'$argon2id$v=19$m=65536,t=3,p=1$gKsgHE6weQrJE9mypg09Zw$M7BTXW1HTxZls3ZzGKilxDkxxrggqO6LQtkmSG55dYY','test@test.com','argon2'),(26,'$2b$10$CcsVSX8/F2SjGmwqx.Drs.ZZbDOKabbe5S2eIOyOCeDj2dIDjm4ay','test@test.com','bcrypt'),(27,'$2b$10$WFNbveCpD7ODSTEoXYOF0eHuBEAEzasJQCDT.VzoTW5mVSkLe8Dv2','test@test.com','bcrypt');
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'example_username'),(2,'example_username2'),(4,'test'),(7,'bro2'),(9,'bro3'),(10,'finaltest'),(11,'finaltestpart2'),(12,'finaltestpart2'),(13,'finaltestpart2'),(14,'finaltestpart2'),(15,'finaltestpart3'),(16,'finaltestpart4'),(17,'finaltestpart4'),(18,'finaltestpartsucess'),(19,'finaltestpartsucessagain'),(20,'finaltestpartsucessagain'),(21,'finaltestpartsucessagain'),(22,'lol'),(23,'lol'),(24,'lol'),(25,'lol'),(26,'lol'),(27,'lol');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-21 12:33:09
