-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: student_management
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `class_name` varchar(50) NOT NULL,
  `major_id` int DEFAULT NULL,
  `student_count` int DEFAULT '0',
  PRIMARY KEY (`class_id`),
  KEY `major_id` (`major_id`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`major_id`) REFERENCES `major` (`major_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES (1,'计科2021-1班',1,0),(2,'计科2021-2班',1,0),(3,'软工2021-1班',2,0),(4,'网工2021-1班',3,0),(5,'计科2021-1班',1,0),(6,'计科2021-2班',1,0),(7,'软工2021-1班',2,0),(8,'网工2021-1班',3,0);
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(100) NOT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'高等数学'),(2,'大学英语'),(3,'数据结构'),(4,'操作系统'),(5,'高等数学'),(6,'大学英语'),(7,'数据结构'),(8,'操作系统');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `dept_id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(50) NOT NULL,
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'计算机科学与技术学院'),(2,'电子信息工程学院'),(3,'机械工程学院'),(4,'经济管理学院');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `major`
--

DROP TABLE IF EXISTS `major`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `major` (
  `major_id` int NOT NULL AUTO_INCREMENT,
  `major_name` varchar(50) NOT NULL,
  `dept_id` int DEFAULT NULL,
  PRIMARY KEY (`major_id`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `major_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `major`
--

LOCK TABLES `major` WRITE;
/*!40000 ALTER TABLE `major` DISABLE KEYS */;
INSERT INTO `major` VALUES (1,'计算机科学与技术',1),(2,'软件工程',1),(3,'网络工程',1),(4,'电子信息工程',2),(10,'1',1);
/*!40000 ALTER TABLE `major` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward_punishment`
--

DROP TABLE IF EXISTS `reward_punishment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_punishment` (
  `rp_id` int NOT NULL AUTO_INCREMENT,
  `student_id` char(10) DEFAULT NULL,
  `type` enum('奖励','惩罚') NOT NULL,
  `reason` text,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`rp_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `reward_punishment_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_punishment`
--

LOCK TABLES `reward_punishment` WRITE;
/*!40000 ALTER TABLE `reward_punishment` DISABLE KEYS */;
INSERT INTO `reward_punishment` VALUES (3,'20210001','奖励','获得国家奖学金','2024-04-20');
/*!40000 ALTER TABLE `reward_punishment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `score`
--

DROP TABLE IF EXISTS `score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `score` (
  `student_id` char(10) NOT NULL,
  `course_id` int NOT NULL,
  `score` int DEFAULT NULL,
  `term` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `score_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `score_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `score`
--

LOCK TABLES `score` WRITE;
/*!40000 ALTER TABLE `score` DISABLE KEYS */;
INSERT INTO `score` VALUES ('20210002',3,86,'2024春');
/*!40000 ALTER TABLE `score` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `student_id` char(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `gender` enum('男','女') NOT NULL,
  `birth_date` date DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  `admission_year` int DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES ('111','121233','男','2025-07-01',7,2023),('20210001','张三','男','2003-05-12',1,2021),('20210002','李四','女','2025-07-02',1,2021),('20210004','赵六','女','2003-07-30',3,2021);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-02 15:39:20
