-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: tinder
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `block`
--

DROP TABLE IF EXISTS `block`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `block` (
  `block_id` int NOT NULL AUTO_INCREMENT,
  `blocked` int DEFAULT NULL,
  `blocker` int DEFAULT NULL,
  PRIMARY KEY (`block_id`),
  KEY `FK8ecy7eel41a08ib5hhsiclgj` (`blocked`),
  KEY `FKoo7kqmshed44xvwy35lff7pwn` (`blocker`),
  CONSTRAINT `FK8ecy7eel41a08ib5hhsiclgj` FOREIGN KEY (`blocked`) REFERENCES `member` (`member_id`),
  CONSTRAINT `FKoo7kqmshed44xvwy35lff7pwn` FOREIGN KEY (`blocker`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `block`
--

LOCK TABLES `block` WRITE;
/*!40000 ALTER TABLE `block` DISABLE KEYS */;
INSERT INTO `block` VALUES (2,32,1),(3,1,32),(4,1,37);
/*!40000 ALTER TABLE `block` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookmarks`
--

DROP TABLE IF EXISTS `bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookmarks` (
  `bookmarks_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`bookmarks_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmarks`
--

LOCK TABLES `bookmarks` WRITE;
/*!40000 ALTER TABLE `bookmarks` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat` (
  `chat_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `chat_group_id` int DEFAULT NULL,
  `sender` int DEFAULT NULL,
  PRIMARY KEY (`chat_id`),
  KEY `FKflvnhwlrugquroe7jaxeirvr3` (`chat_group_id`),
  KEY `FK9m5ernoohmy6vr17b7mdpp51r` (`sender`),
  CONSTRAINT `FK9m5ernoohmy6vr17b7mdpp51r` FOREIGN KEY (`sender`) REFERENCES `member` (`member_id`),
  CONSTRAINT `FKflvnhwlrugquroe7jaxeirvr3` FOREIGN KEY (`chat_group_id`) REFERENCES `chat_group` (`chat_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,'1번','2025-02-12 14:14:33',1,1),(2,'2번','2025-02-12 14:37:49',1,42),(3,'3번','2025-02-12 14:38:09',1,1),(4,'4번','2025-02-12 14:38:09',1,42),(5,'5번','2025-02-12 15:56:34',1,1),(6,'점심뭐먹지','2025-02-12 15:57:32',2,40),(7,'글쎄','2025-02-12 15:57:32',2,41),(8,'캉캉이랑 먹자!!','2025-02-12 15:57:46',2,1),(9,'6번','2025-02-12 17:43:41',1,1),(10,'7번','2025-02-12 17:44:01',1,42),(14,'안녕하세여!','2025-02-13 10:20:02',12,1),(15,'안녕하세요!!!','2025-02-13 10:49:26',18,1),(16,'1111','2025-02-17 14:46:26',19,42),(20,'안녕하세여','2025-02-18 09:30:48',29,1),(21,'안녕하세여','2025-02-18 10:55:01',30,1),(22,'안녕하세여!!','2025-02-18 10:58:12',30,1),(23,'안녕하세여~','2025-02-18 10:58:37',30,42),(24,'ㅎㅇㅎㅇ','2025-02-18 11:12:34',31,1),(25,'안녕하세요!!!!','2025-02-18 12:00:21',32,1),(26,'안녕하세여~','2025-02-18 12:01:16',32,32),(27,'안녕하세여!!','2025-02-18 17:01:00',19,32),(28,'오늘 좋은 하루 되세여~','2025-02-18 17:02:25',19,32),(29,'8번','2025-02-18 17:03:06',1,1),(30,'오늘 뭐하세여??','2025-02-18 17:04:19',30,1),(31,'안녕하세여~','2025-02-18 17:13:48',30,1),(32,'안녕하세여!!','2025-02-19 09:00:31',33,1),(33,'ㅎㅇㅎㅇ','2025-02-19 17:03:29',45,1),(34,'gdgd','2025-02-19 17:04:12',45,42),(35,'ㄱㄱㄱ','2025-02-19 17:09:31',45,1),(36,'ㄴㄴㄴㄴ','2025-02-19 17:09:38',45,42),(37,'ㄷㄷㄷ','2025-02-19 17:10:30',45,1),(38,'ㄹㄹㄹㄹ','2025-02-19 17:10:33',45,42),(39,'ㅎㅇㅎㅇ','2025-02-19 17:13:09',45,42),(40,'ㄱㄱㄱㄱ','2025-02-19 17:13:15',45,1),(41,'ㄱㄱㄱㄱ','2025-02-19 17:13:26',45,42),(42,'ㄱㄱㄱㄱ','2025-02-19 17:13:28',45,42),(43,'ㄱㄱㄱㄱ','2025-02-19 17:25:18',45,1),(44,'ㅎㅇㅎㅇ','2025-02-19 17:46:53',46,1),(45,'ㅎㅇㅎㅇ','2025-02-19 17:48:35',46,33),(46,'뭐 좋아하세요??','2025-02-19 17:48:42',46,1),(47,'맛있는거요??','2025-02-19 17:48:55',46,33),(48,'ㅎㅇㅎㅇ','2025-02-20 09:01:17',48,1),(49,'안녕하세여!!','2025-02-20 09:01:35',49,1),(50,'오 매칭 성공','2025-02-20 09:03:31',49,1),(51,'뭐 좋아하세여??','2025-02-20 09:03:45',49,40),(52,'우리 맛있는거 먹으러 갈까요???','2025-02-20 09:04:30',49,1),(53,'9번','2025-02-20 16:51:31',1,1),(54,'ㅎㅇㅎㅇ','2025-02-20 16:55:00',2,1),(55,'ㅎㅇㅎㅇ','2025-02-20 16:55:23',2,1),(56,'ㅎㅇㅎㅇ','2025-02-20 17:06:56',50,1),(57,'굿굿','2025-02-20 17:11:42',50,1);
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_bot_history`
--

DROP TABLE IF EXISTS `chat_bot_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_bot_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text,
  `role` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_bot_history`
--

LOCK TABLES `chat_bot_history` WRITE;
/*!40000 ALTER TABLE `chat_bot_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_bot_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_group`
--

DROP TABLE IF EXISTS `chat_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_group` (
  `chat_group_id` int NOT NULL AUTO_INCREMENT,
  `created_by` int NOT NULL,
  `member_count` int DEFAULT NULL,
  `chat_group_name` varchar(255) DEFAULT NULL,
  `anonymity` tinyint DEFAULT '0',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `activation` tinyint DEFAULT '0',
  PRIMARY KEY (`chat_group_id`),
  KEY `FKbhtgwavm37kgn2dbra6868aif` (`created_by`),
  CONSTRAINT `FKbhtgwavm37kgn2dbra6868aif` FOREIGN KEY (`created_by`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group`
--

LOCK TABLES `chat_group` WRITE;
/*!40000 ALTER TABLE `chat_group` DISABLE KEYS */;
INSERT INTO `chat_group` VALUES (1,1,2,'첫번째 채팅',0,'2025-02-12 14:14:33',0),(2,1,3,'두번째 채팅',0,'2025-02-12 14:14:33',0),(12,1,2,'2인 매칭 채팅방',0,'2025-02-12 14:14:33',0),(18,1,2,'2인 매칭 채팅방',0,'2025-02-12 14:14:33',0),(19,42,2,'2인 매칭 채팅방',0,'2025-02-12 14:14:33',0),(29,1,3,'New Group for [1, 32, 37]',0,'2025-02-12 14:14:33',0),(30,1,2,'익명채팅',1,'2025-02-18 14:14:33',0),(31,1,3,'New Group for [1, 31, 32]',0,'2025-02-18 14:14:33',0),(32,1,2,'익명채팅',1,'2025-02-18 14:14:33',0),(33,1,2,'익명채팅',1,'2025-02-19 09:00:25',0),(43,1,2,'익명채팅',1,'2025-02-19 14:41:35',0),(44,1,2,'익명채팅',1,'2025-02-19 15:11:24',0),(45,1,2,'익명채팅',1,'2025-02-19 17:02:47',1),(46,1,2,'익명채팅',1,'2025-02-19 17:46:21',1),(47,1,2,'익명채팅',1,'2025-02-19 17:51:07',0),(48,1,2,'2인 매칭 채팅방',0,'2025-02-20 09:01:12',0),(49,1,2,'익명채팅',1,'2025-02-20 09:01:28',1),(50,1,2,'익명채팅',1,'2025-02-20 17:06:11',0),(58,1,4,'캉캉이 의 5 인 채팅방',0,'2025-02-20 17:59:01',0);
/*!40000 ALTER TABLE `chat_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_group_member`
--

DROP TABLE IF EXISTS `chat_group_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_group_member` (
  `chat_group_member_id` int NOT NULL AUTO_INCREMENT,
  `chat_group_id` int DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  PRIMARY KEY (`chat_group_member_id`),
  KEY `FKlutmrmg8vj22cspv6n4m2w36s` (`chat_group_id`),
  KEY `FKfs7sexk31ru6i1ureeppbg2eo` (`member_id`),
  CONSTRAINT `FKfs7sexk31ru6i1ureeppbg2eo` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `FKlutmrmg8vj22cspv6n4m2w36s` FOREIGN KEY (`chat_group_id`) REFERENCES `chat_group` (`chat_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group_member`
--

LOCK TABLES `chat_group_member` WRITE;
/*!40000 ALTER TABLE `chat_group_member` DISABLE KEYS */;
INSERT INTO `chat_group_member` VALUES (1,1,1),(2,1,42),(3,2,1),(4,2,41),(5,2,40),(18,12,1),(19,12,40),(30,18,1),(31,18,38),(32,19,42),(33,19,32),(59,29,1),(60,29,32),(61,29,37),(62,30,1),(63,30,42),(64,31,1),(65,31,31),(66,31,32),(67,32,1),(68,32,32),(69,33,1),(70,33,40),(89,43,1),(90,43,38),(91,44,1),(92,44,35),(93,45,1),(94,45,42),(95,46,1),(96,46,33),(97,47,1),(98,47,35),(99,48,1),(100,48,31),(101,49,1),(102,49,40),(103,50,1),(104,50,35),(142,58,1),(143,58,27),(144,58,28),(145,58,29),(146,58,30);
/*!40000 ALTER TABLE `chat_group_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_group_quiz`
--

DROP TABLE IF EXISTS `chat_group_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_group_quiz` (
  `chat_group_quiz_id` int NOT NULL AUTO_INCREMENT,
  `transmission_time` datetime(6) DEFAULT NULL,
  `chat_group_id` int DEFAULT NULL,
  `quiz_id` int DEFAULT NULL,
  PRIMARY KEY (`chat_group_quiz_id`),
  KEY `FKtbx18h2kelnydfsiydkpfm4p9` (`chat_group_id`),
  KEY `FKjbuwg40eepsvcfwlr8ut4sw0i` (`quiz_id`),
  CONSTRAINT `FKjbuwg40eepsvcfwlr8ut4sw0i` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`),
  CONSTRAINT `FKtbx18h2kelnydfsiydkpfm4p9` FOREIGN KEY (`chat_group_id`) REFERENCES `chat_group` (`chat_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group_quiz`
--

LOCK TABLES `chat_group_quiz` WRITE;
/*!40000 ALTER TABLE `chat_group_quiz` DISABLE KEYS */;
INSERT INTO `chat_group_quiz` VALUES (25,'2025-02-19 14:43:00.000000',43,15),(26,'2025-02-19 14:44:00.000000',43,2),(27,'2025-02-19 14:45:00.000000',43,22),(28,'2025-02-19 15:13:00.000000',44,17),(29,'2025-02-19 15:14:00.000000',44,4),(30,'2025-02-19 15:15:00.000000',44,15),(31,'2025-02-19 17:04:00.000000',45,22),(32,'2025-02-19 17:05:00.000000',45,21),(33,'2025-02-19 17:06:00.000000',45,19),(34,'2025-02-19 17:48:00.000000',46,16),(35,'2025-02-19 17:49:00.000000',46,20),(36,'2025-02-19 17:50:00.000000',46,5),(37,'2025-02-19 17:53:00.000000',47,16),(38,'2025-02-19 17:54:00.000000',47,17),(39,'2025-02-19 17:55:00.000000',47,6),(40,'2025-02-20 09:03:00.000000',49,4),(41,'2025-02-20 09:04:00.000000',49,17),(42,'2025-02-20 09:05:00.000000',49,21),(43,'2025-02-20 17:08:00.000000',50,6),(44,'2025-02-20 17:09:00.000000',50,19),(45,'2025-02-20 17:10:00.000000',50,3);
/*!40000 ALTER TABLE `chat_group_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_group_quiz_answer`
--

DROP TABLE IF EXISTS `chat_group_quiz_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_group_quiz_answer` (
  `chat_group_quiz_answer_id` int NOT NULL AUTO_INCREMENT,
  `chat_group_quiz_id` int DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  `answer` int NOT NULL,
  PRIMARY KEY (`chat_group_quiz_answer_id`),
  KEY `FK3eto6iwgn98vhlr10547vtx27` (`chat_group_quiz_id`),
  KEY `FKgc1ynq0olo4uosonlj3lso33r` (`member_id`),
  CONSTRAINT `FK3eto6iwgn98vhlr10547vtx27` FOREIGN KEY (`chat_group_quiz_id`) REFERENCES `chat_group_quiz` (`chat_group_quiz_id`),
  CONSTRAINT `FKgc1ynq0olo4uosonlj3lso33r` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group_quiz_answer`
--

LOCK TABLES `chat_group_quiz_answer` WRITE;
/*!40000 ALTER TABLE `chat_group_quiz_answer` DISABLE KEYS */;
INSERT INTO `chat_group_quiz_answer` VALUES (15,28,1,1),(16,28,35,2),(17,29,1,1),(18,29,35,1),(19,30,1,2),(20,30,35,2),(21,31,1,2),(22,31,42,2),(23,32,1,2),(24,32,42,1),(25,33,42,1),(26,33,1,2),(27,31,1,1),(28,31,42,1),(29,31,1,1),(30,31,42,2),(31,31,1,1),(32,31,42,2),(33,31,1,1),(34,31,42,2),(35,34,1,1),(36,34,33,1),(37,35,1,1),(38,35,33,2),(39,37,1,1),(40,37,35,1),(41,38,1,1),(42,38,35,1),(43,39,1,1),(44,39,35,1),(45,40,40,1),(46,40,1,1),(47,41,1,1),(48,41,40,1),(49,42,1,1),(50,43,1,1),(51,43,35,1),(52,45,1,1),(53,45,35,1);
/*!40000 ALTER TABLE `chat_group_quiz_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room_members`
--

DROP TABLE IF EXISTS `chat_room_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room_members` (
  `chat_room_id` bigint NOT NULL,
  `member_id` int NOT NULL,
  KEY `FKb8loxg45rk5vh1wckd0vb6nfe` (`member_id`),
  KEY `FK4i0s5ls4fjs63gaf2x2vhvf1r` (`chat_room_id`),
  CONSTRAINT `FK4i0s5ls4fjs63gaf2x2vhvf1r` FOREIGN KEY (`chat_room_id`) REFERENCES `real_time_chat_room` (`id`),
  CONSTRAINT `FKb8loxg45rk5vh1wckd0vb6nfe` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room_members`
--

LOCK TABLES `chat_room_members` WRITE;
/*!40000 ALTER TABLE `chat_room_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_room_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow`
--

DROP TABLE IF EXISTS `follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow` (
  `follow_id` int NOT NULL AUTO_INCREMENT,
  `followed` int NOT NULL,
  `follower` int NOT NULL,
  PRIMARY KEY (`follow_id`),
  KEY `FK1vonb4i60v41qii74nnsmc8hr` (`followed`),
  KEY `FKon174ytyau6iulr7uyxfoui4m` (`follower`),
  CONSTRAINT `FK1vonb4i60v41qii74nnsmc8hr` FOREIGN KEY (`followed`) REFERENCES `member` (`member_id`),
  CONSTRAINT `FKon174ytyau6iulr7uyxfoui4m` FOREIGN KEY (`follower`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hashtag`
--

DROP TABLE IF EXISTS `hashtag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hashtag` (
  `hashtag_id` int NOT NULL AUTO_INCREMENT,
  `word` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`hashtag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hashtag`
--

LOCK TABLES `hashtag` WRITE;
/*!40000 ALTER TABLE `hashtag` DISABLE KEYS */;
INSERT INTO `hashtag` VALUES (1,'말차라떼'),(2,'망고주스');
/*!40000 ALTER TABLE `hashtag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hobby`
--

DROP TABLE IF EXISTS `hobby`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hobby` (
  `hobby_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `hobby_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`hobby_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `hobby_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `hobby_category` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hobby`
--

LOCK TABLES `hobby` WRITE;
/*!40000 ALTER TABLE `hobby` DISABLE KEYS */;
INSERT INTO `hobby` VALUES (1,1,'골프'),(2,1,'달리기/조깅'),(3,1,'당구/포켓볼'),(4,1,'수영'),(5,1,'스키/스노보드'),(6,1,'스포츠 경기 방문 관람'),(7,1,'스포츠 경기 시청'),(8,1,'야구/축구/농구'),(9,1,'에어로빅/요가/필라테스'),(10,1,'자전거타기/사이클링'),(11,1,'춤/댄스/스포츠'),(12,1,'테니스/스쿼시'),(13,1,'헬스'),(14,1,'기타'),(15,2,'게임(PC/모바일/콘솔 등)'),(16,2,'낚시'),(17,2,'독서'),(18,2,'등산'),(19,2,'만화/웹툰 보기'),(20,2,'미용(피부관리/마사지/네일아트 등)'),(21,2,'생활공예(십자수, 꽃꽂이, 비즈공예, 뜨개질 등)'),(22,2,'어학/기술/자격증 취득 공부'),(23,2,'요리/베이킹'),(24,2,'유튜브 SNS 관리 및 콘텐츠 제작/업로드'),(25,2,'기타'),(26,3,'공연/콘서트/뮤지컬 관람'),(27,3,'영화관람'),(28,3,'전시회/박물관 관람'),(29,3,'기타'),(30,4,'국내/해외여행'),(31,4,'자동차 드라이브'),(32,4,'캠핑'),(33,5,'사회봉사활동'),(34,5,'기타');
/*!40000 ALTER TABLE `hobby` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hobby_category`
--

DROP TABLE IF EXISTS `hobby_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hobby_category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hobby_category`
--

LOCK TABLES `hobby_category` WRITE;
/*!40000 ALTER TABLE `hobby_category` DISABLE KEYS */;
INSERT INTO `hobby_category` VALUES (1,'스포츠'),(2,'취미오락'),(3,'문화예술'),(4,'여행'),(5,'기타');
/*!40000 ALTER TABLE `hobby_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `images_id` int NOT NULL AUTO_INCREMENT,
  `savefile_name` varchar(255) DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  PRIMARY KEY (`images_id`),
  KEY `FKalwaag9bmtnbjaiv4wlp99fhg` (`post_id`),
  CONSTRAINT `FKalwaag9bmtnbjaiv4wlp99fhg` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,'KakaoTalk_20250117_1915009131737165055774.jpg',3),(2,'KakaoTalk_20250117_1915009131737165055774.jpg',4),(3,'KakaoTalk_20250117_1915009131737165055774.jpg',5),(4,'KakaoTalk_20250117_1915009131737165055774.jpg',6),(11,'20221007＿205530.jpg',7),(12,'porksoup.jpg',8),(13,'매머드.jpg',9),(14,'매머드.jpg',10),(15,'매머드.jpg',11),(16,'말차라뗴1740311166469.jpeg',12),(17,'말차라뗴1740311648897.jpeg',13),(18,'망고주스1740312073901.jpeg',15);
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `member_id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `age` int NOT NULL,
  `gender` tinyint NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `profile_msg` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `pwd` varchar(255) DEFAULT NULL,
  `sns_id` varchar(255) DEFAULT NULL,
  `zipnum` varchar(255) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `account` int NOT NULL,
  `member_name` varchar(255) DEFAULT NULL,
  `temp` int NOT NULL DEFAULT '37',
  `member_info_id` int DEFAULT NULL,
  `opponent_member_info_id` int DEFAULT NULL,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `UKdtosu0xko6992osyytbrv01kf` (`member_info_id`),
  UNIQUE KEY `UK8i25k6ssgp2jncq0gkejrpwyg` (`opponent_member_info_id`),
  CONSTRAINT `FK183h3t3hj702inftl640d4amj` FOREIGN KEY (`opponent_member_info_id`) REFERENCES `member_info` (`member_info_id`),
  CONSTRAINT `FKb5pg1b1jg7j8y0w952o57wtkh` FOREIGN KEY (`opponent_member_info_id`) REFERENCES `opponent_member_info` (`opponent_member_info_id`),
  CONSTRAINT `FKpd3sepb0sw3al1deejfqex7mc` FOREIGN KEY (`member_info_id`) REFERENCES `member_info` (`member_info_id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,NULL,'a',18,0,'캉캉이','010-1111-1111','캉캉이.jpg','캉캉이에요',NULL,'$2a$10$32lteT/dEqmtc9wizM84cuvL8G/x0WawDxE4Y46v3BCkXXlYTc/tS',NULL,'11111','2007-05-05',37.571896,126.987163,0,NULL,37,1,1),(2,'Chicago','johnny@nct.com',28,0,'쟈니','010-1111-1111','쟈니.jpg','NCT 127',NULL,'a',NULL,'12345','1995-02-09',37.540996,127.059238,0,NULL,37,2,2),(3,'Seoul','taeyong@nct.com',29,0,'태용','010-2222-2222','태용.jpg','Leader of NCT',NULL,'a',NULL,'23456','1995-07-01',37.583402,126.943595,0,NULL,37,3,3),(4,'Osaka','yuta@nct.com',28,0,'유타','010-3333-3333','유타.jpg','Osaka Prince',NULL,'a',NULL,'34567','1995-10-26',37.507681,127.09517,0,NULL,37,4,4),(5,'Beijing','kun@nct.com',28,0,'쿤','010-4444-4444','쿤.jpg','WayV Leader',NULL,'a',NULL,'45678','1996-01-01',37.463317,126.815868,0,NULL,37,5,5),(6,'Seoul','doyoung@nct.com',28,0,'도영','010-5555-5555','도영.jpg','Main Vocal',NULL,'a',NULL,'56789','1996-02-01',37.597886,127.14497,0,NULL,37,6,6),(7,'Bangkok','ten@nct.com',28,0,'텐','010-6666-6666','텐.png','Dancer & Vocal',NULL,'a',NULL,'67890','1996-02-27',37.593991,126.811612,0,NULL,37,7,7),(8,'Seoul','jaehyun@nct.com',27,0,'재현','010-7777-7777','재현.jpg','NCT 127',NULL,'a',NULL,'78901','1997-02-14',37.492861,126.615892,0,NULL,37,8,8),(9,'Wenzhou','winwin@nct.com',26,0,'윈윈','010-8888-8888','윈윈.jpg','WayV',NULL,'a',NULL,'89012','1997-10-28',37.678444,126.597435,0,NULL,37,9,9),(10,'Seoul','jungwoo@nct.com',26,0,'정우','010-9999-9999','정우.jpg','NCT 127',NULL,'a',NULL,'90123','1998-02-19',37.674675,126.608242,0,NULL,37,10,10),(11,'Vancouver','mark@nct.com',25,0,'마크','010-1010-1010','마크.jpg','Rapper & Vocal',NULL,'a',NULL,'01234','1999-08-02',37.412829,126.979675,0,NULL,37,11,11),(12,'Guangdong','xiaojun@nct.com',25,0,'샤오쥔','010-1212-1212','샤오쥔.jpg','WayV',NULL,'a',NULL,'11223','1999-08-08',37.503682,126.939652,0,NULL,37,12,12),(13,'Macau','hendery@nct.com',24,0,'헨드리','010-1313-1313','헨드리.jpg','WayV',NULL,'a',NULL,'22334','1999-09-28',37.442502,127.036307,0,NULL,37,13,13),(14,'Jilin','renjun@nct.com',24,0,'런쥔','010-1414-1414','런쥔.jpg','NCT Dream',NULL,'a',NULL,'33445','2000-03-23',37.534399,127.132962,0,NULL,37,14,14),(15,'Seoul','jeno@nct.com',24,0,'제노','010-1515-1515','제노.jpg','NCT Dream',NULL,'a',NULL,'44556','2000-04-23',37.463064,126.69951,0,NULL,37,15,15),(16,'Seoul','haechan@nct.com',24,0,'해찬','010-1616-1616','해찬.jpg','NCT 127 & Dream',NULL,'a',NULL,'55667','2000-06-06',37.648628,126.69403,0,NULL,37,16,16),(17,'Seoul','jaemin@nct.com',24,0,'재민','010-1717-1717','재민.jpg','NCT Dream',NULL,'a',NULL,'66778','2000-08-13',37.672352,126.990988,0,NULL,37,17,17),(18,'Taipei','yangyang@nct.com',23,0,'양양','010-1818-1818','양양.png','WayV',NULL,'a',NULL,'77889','2000-10-10',37.637034,127.082507,0,NULL,37,18,18),(19,'Shanghai','chenle@nct.com',23,0,'천러','010-1919-1919','천러.png','NCT Dream',NULL,'a',NULL,'88990','2001-11-22',37.640484,126.848742,0,NULL,37,19,19),(20,'Seoul','jisung@nct.com',22,0,'지성','010-2020-2020','지성.png','Maknae',NULL,'a',NULL,'99001','2002-02-05',37.431888,127.183534,0,NULL,37,20,20),(21,'Seoul','sion@nct.com',20,0,'시온','010-2121-2121','시온.png','New Member',NULL,'a',NULL,'11112','2002-05-11',37.581522,126.548473,0,NULL,37,21,21),(22,'Tokyo','riku@nct.com',21,0,'리쿠','010-2222-2323','리쿠.jpg','New Member',NULL,'a',NULL,'12123','2003-06-28',37.565921,126.869182,0,NULL,37,22,22),(23,'Osaka','yuushi@nct.com',20,0,'유우시','010-2323-2424','유우시.jpg','New Member',NULL,'a',NULL,'13134','2004-04-05',37.698795,126.778206,0,NULL,37,23,23),(24,'Seoul','jaehee@nct.com',21,0,'재희','010-2424-2525','재희.jpg','New Member',NULL,'a',NULL,'14145','2005-06-21',37.699821,127.063269,0,NULL,37,24,24),(25,'Fukuoka','ryo@nct.com',20,0,'료','010-2525-2626','료.jpg','New Member',NULL,'a',NULL,'15156','2005-08-04',37.411448,126.998258,0,NULL,37,25,25),(26,'Nagoya','sakuya@nct.com',20,0,'사쿠야','010-2626-2727','사쿠야.jpg','New Member',NULL,'a',NULL,'16167','2005-11-18',37.547116,126.697476,0,NULL,37,26,26),(27,'Seoul','karina@aespa.com',24,1,'카리나','010-1111-2222','카리나.jpg','Leader & Main Dancer',NULL,'a',NULL,'11111','2001-04-11',37.688174,127.167733,0,NULL,37,27,27),(28,'Tokyo','giselle@aespa.com',23,1,'지젤','010-2222-3333','지젤.jpg','Main Rapper',NULL,'a',NULL,'22222','2000-10-30',37.667258,126.909643,0,NULL,37,28,28),(29,'Busan','winter@aespa.com',23,1,'윈터','010-3333-4444','윈터.jpg','Lead Vocal & Dancer',NULL,'a',NULL,'33333','2001-01-01',37.480329,126.873612,0,NULL,37,29,29),(30,'Harbin','ningning@aespa.com',22,1,'닝닝','010-4444-5555','닝닝.jpg','Main Vocal',NULL,'a',NULL,'44444','2002-10-23',37.668935,127.111842,0,NULL,37,30,30),(31,'Seoul','minji@newjeans.com',20,1,'민지','010-5555-6666','민지.jpg','Leader & Vocal',NULL,'a',NULL,'55555','2004-05-07',37.606804,127.062498,0,NULL,37,31,31),(32,'Melbourne','hanni@newjeans.com',20,1,'하니','010-6666-7777','하니.jpg','Main Vocal',NULL,'a',NULL,'66666','2004-10-06',37.688869,126.780884,0,NULL,37,32,32),(33,'Newcastle','danielle@newjeans.com',19,1,'다니엘','010-7777-8888','다니엘.jpg','Lead Vocal',NULL,'a',NULL,'77777','2005-04-11',37.439263,126.774315,0,NULL,37,33,33),(34,'Seoul','haerin@newjeans.com',18,1,'해린','010-8888-9999','해린.jpg','Vocal & Dancer',NULL,'a',NULL,'88888','2005-05-15',37.582189,127.084023,0,NULL,37,34,34),(35,'Incheon','hyein@newjeans.com',17,1,'혜인','010-9999-0000','혜인.jpg','Maknae & Vocal',NULL,'a',NULL,'99999','2005-04-21',37.512223,126.727597,0,NULL,37,35,35),(36,'Daejeon','yujin@ive.com',22,1,'안유진','010-1111-2222','안유진.jpg','Leader & Vocal',NULL,'a',NULL,'11111','2003-09-01',37.560535,126.968133,0,NULL,37,36,36),(37,'Incheon','gaeul@ive.com',21,1,'가을','010-2222-3333','가을.jpg','Main Rapper & Dancer',NULL,'a',NULL,'22222','2002-09-24',37.628162,127.046166,0,NULL,37,37,37),(38,'Nagoya','rei@ive.com',20,1,'레이','010-3333-4444','레이.jpg','Rapper & Vocal',NULL,'a',NULL,'33333','2004-02-03',37.590264,127.063949,0,NULL,37,38,38),(39,'Seoul','wonyoung@ive.com',20,1,'장원영','010-4444-5555','장원영.jpg','Lead Vocal & Visual',NULL,'a',NULL,'44444','2004-08-31',37.445557,126.69954,0,NULL,37,39,39),(40,'Jeju','liz@ive.com',20,1,'리즈','010-5555-6666','리즈.jpg','Main Vocal',NULL,'a',NULL,'55555','2004-11-21',37.405213,126.615727,0,NULL,37,40,40),(41,'Seoul','leeseo@ive.com',18,1,'이서','010-6666-7777','이서.jpg','Maknae & Vocal',NULL,'a',NULL,'66666','2005-02-21',37.64504,126.90295,0,NULL,37,41,41),(42,'Seoul','b',18,1,'캉순이','010-1111-1111','캉순이.jpg','캉순이에여',NULL,'b',NULL,'77777','2005-06-06',37.532833,126.814513,0,NULL,37,42,42),(43,'Seoul','youngbin@sf9.com',31,0,'영빈','010-1993-1123','sf9_youngbin.jpg','SF9',NULL,'a',NULL,'88888','1993-11-23',37.682471,126.749192,0,NULL,37,43,43),(44,'Seoul','inseong@sf9.com',31,0,'인성','010-1993-0712','sf9_inseong.jpg','SF9',NULL,'a',NULL,'99999','1993-07-12',37.687451,127.004036,0,NULL,37,44,44),(45,'Seoul','jaeyoon@sf9.com',30,0,'재윤','010-1994-0809','sf9_jaeyoon.jpg','SF9',NULL,'a',NULL,'11111','1994-08-09',37.619324,126.833951,0,NULL,37,45,45),(46,'Seoul','dawon@sf9.com',29,0,'다원','010-1995-0724','sf9_dawon.jpg','SF9',NULL,'a',NULL,'22222','1994-07-24',37.464097,126.908756,0,NULL,37,46,46),(47,'Seoul','jooho@sf9.com',28,0,'주호','010-1996-0704','sf9_jooho.jpg','SF9',NULL,'a',NULL,'33333','1994-07-04',37.495934,127.060796,0,NULL,37,47,47),(48,'Seoul','taeyang@sf9.com',27,0,'유태양','010-1997-0228','sf9_taeyang.jpg','SF9',NULL,'a',NULL,'44444','1997-02-28',37.42588,127.176324,0,NULL,37,48,48),(49,'Seoul','hwiyoung@sf9.com',25,0,'휘영','010-1999-0511','sf9_hwiyoung.jpg','SF9',NULL,'a',NULL,'55555','1999-05-11',37.584303,126.602994,0,NULL,37,49,49),(50,'Seoul','chanhee@sf9.com',25,0,'찬희','010-2000-0117','sf9_chanhee.jpg','SF9',NULL,'a',NULL,'66666','2000-01-17',37.672848,126.56996,0,NULL,37,50,50),(51,'Seoul','jin@bts.com',32,0,'진','010-1992-1204','bts_jin.jpg','BTS',NULL,'a',NULL,'77777','1992-12-04',37.633373,126.902299,0,NULL,37,51,51),(52,'Seoul','jhope@bts.com',31,0,'제이홉','010-1994-0218','bts_jhope.jpg','BTS',NULL,'a',NULL,'88888','1994-02-18',37.566457,126.514046,0,NULL,37,52,52),(53,'Seoul','rm@bts.com',30,0,'RM','010-1994-0912','bts_rm.jpg','BTS',NULL,'a',NULL,'99999','1994-09-12',37.538326,126.646179,0,NULL,37,53,53),(54,'Seoul','jimin@bts.com',29,0,'지민','010-1995-1013','bts_jimin.jpg','BTS',NULL,'a',NULL,'11111','1995-10-13',37.606085,127.050986,0,NULL,37,54,54),(55,'Seoul','v@bts.com',29,0,'뷔','010-1995-1230','bts_v.jpg','BTS',NULL,'a',NULL,'22222','1995-12-30',37.666686,126.553126,0,NULL,37,55,55),(56,'Seoul','jungkook@bts.com',27,0,'정국','010-1997-0901','bts_jungkook.jpg','BTS',NULL,'a',NULL,'33333','1997-09-01',37.616267,126.750529,0,NULL,37,56,56),(57,'Yokohama','shotaro@riize.com',24,0,'쇼타로','010-2000-1125','riize_shotaro.jpg','RIIZE',NULL,'a',NULL,'44444','2000-11-25',37.592889,126.581904,0,NULL,37,57,57),(58,'Seoul','eunseok@riize.com',23,0,'은석','010-2001-0319','riize_eunseok.jpg','RIIZE',NULL,'a',NULL,'55555','2001-03-19',37.6025,126.501418,0,NULL,37,58,58),(59,'Seoul','sungchan@riize.com',23,0,'성찬','010-2001-0913','riize_sungchan.jpg','RIIZE',NULL,'a',NULL,'66666','2001-09-13',37.699497,127.189804,0,NULL,37,59,59),(60,'Seoul','wonbin@riize.com',22,0,'원빈','010-2002-0302','riize_wonbin.jpg','RIIZE',NULL,'a',NULL,'77777','2002-03-02',37.67995,126.993515,0,NULL,37,60,60),(61,'Seoul','sohee@riize.com',21,0,'소희','010-2003-1121','riize_sohee.jpg','RIIZE',NULL,'a',NULL,'88888','2003-11-21',37.619581,126.868555,0,NULL,37,61,61),(62,'Boston','anton@riize.com',20,0,'앤톤','010-2004-0321','riize_anton.jpg','RIIZE',NULL,'a',NULL,'99999','2004-03-21',37.536487,126.9609,0,NULL,37,62,62),(63,'Seoul','s1@triples.com',21,1,'윤서연','010-2003-0806','triples_s1.jpg','TripleS',NULL,'a',NULL,'11111','2003-08-06',37.685015,127.040111,0,NULL,37,63,63),(64,'Seoul','s2@triples.com',17,1,'정혜린','010-2005-0412','triples_s2.jpg','TripleS',NULL,'a',NULL,'22222','2005-04-12',37.406905,127.014012,0,NULL,37,64,64),(65,'Seoul','s3@triples.com',19,1,'이지우','010-2005-1024','triples_s3.jpg','TripleS',NULL,'a',NULL,'33333','2005-10-24',37.594054,126.505221,0,NULL,37,65,65),(66,'Seoul','s4@triples.com',20,1,'김채연','010-2004-1204','triples_s4.jpg','TripleS',NULL,'a',NULL,'44444','2004-12-04',37.436877,126.873088,0,NULL,37,66,66),(67,'Seoul','s5@triples.com',24,1,'김유연','010-2001-0209','triples_s5.jpg','TripleS',NULL,'a',NULL,'55555','2001-02-09',37.502183,126.541687,0,NULL,37,67,67),(68,'Seoul','s6@triples.com',17,1,'김수민','010-2005-1003','triples_s6.jpg','TripleS',NULL,'a',NULL,'66666','2005-10-03',37.493588,126.734259,0,NULL,37,68,68),(69,'Seoul','s7@triples.com',22,1,'김나경','010-2002-1013','triples_s7.jpg','TripleS',NULL,'a',NULL,'77777','2002-10-13',37.630527,127.075745,0,NULL,37,69,69),(70,'Seoul','s8@triples.com',20,1,'공유빈','010-2005-0203','triples_s8.jpg','TripleS',NULL,'a',NULL,'88888','2005-02-03',37.64571,126.930826,0,NULL,37,70,70),(71,'Toyama','s9@triples.com',19,1,'카에데','010-2005-1220','triples_s9.jpg','TripleS',NULL,'a',NULL,'99999','2005-12-20',37.589759,126.703995,0,NULL,37,71,71),(72,'Seoul','s10@triples.com',22,1,'서다현','010-2003-0108','triples_s10.jpg','TripleS',NULL,'a',NULL,'11111','2003-01-08',37.574026,127.198459,0,NULL,37,72,72),(73,'Tokyo','s11@triples.com',20,1,'코토네','010-2004-010','triples_s11.jpg','TripleS',NULL,'a',NULL,'22222','2004-03-10',37.482663,126.734763,0,NULL,37,73,73),(74,'Seoul','s12@triples.com',17,1,'곽연지','010-2005-0108','triples_s12.jpg','TripleS',NULL,'a',NULL,'33333','2005-01-08',37.664366,126.774366,0,NULL,37,74,74),(75,'Taipei','s13@triples.com',21,1,'니엔','010-2003-0602','triples_s13.jpg','TripleS',NULL,'a',NULL,'44444','2003-06-02',37.498989,126.80008,0,NULL,37,75,75),(76,'Seoul','s14@triples.com',22,1,'박소현','010-2002-1013','triples_s14.jpg','TripleS',NULL,'a',NULL,'55555','2002-10-13',37.45749,126.932238,0,NULL,37,76,76),(77,'Beijing','s15@triples.com',22,1,'신위','010-2002-0525','triples_s15.jpg','TripleS',NULL,'a',NULL,'66666','2002-05-25',37.565406,127.111804,0,NULL,37,77,77),(78,'Gunma','s16@triples.com',22,1,'마유','010-2002-0512','triples_s16.jpg','TripleS',NULL,'a',NULL,'77777','2002-05-12',37.62131,126.534129,0,NULL,37,78,78),(79,'Tokyo','s17@triples.com',18,1,'린','010-2005-0412','triples_s17.jpg','TripleS',NULL,'a',NULL,'88888','2005-04-12',37.416229,126.542215,0,NULL,37,79,79),(80,'Seoul','s18@triples.com',16,1,'주빈','010-2005-0106','triples_s18.jpg','TripleS',NULL,'a',NULL,'99999','2005-01-16',37.456567,126.994923,0,NULL,37,80,80),(81,'Seoul','s19@triples.com',17,1,'정하연','010-2005-0801','triples_s19.jpg','TripleS',NULL,'a',NULL,'11111','2005-08-01',37.404707,127.123595,0,NULL,37,81,81),(82,'Seoul','s20@triples.com',18,1,'박시온','010-2005-040','triples_s20.jpg','TripleS',NULL,'a',NULL,'22222','2005-04-03',37.536336,126.894,0,NULL,37,82,82),(83,'Seoul','s21@triples.com',17,1,'김채원','010-2005-0502','triples_s21.jpg','TripleS',NULL,'a',NULL,'33333','2005-05-02',37.544021,126.973654,0,NULL,37,83,83),(84,'Seoul','s22@triples.com',18,1,'설린','010-2005-1130','triples_s22.jpg','TripleS',NULL,'a',NULL,'44444','2005-11-30',37.689376,127.05342,0,NULL,37,84,84),(85,'Seoul','s23@triples.com',14,1,'서아','010-2005-0611','triples_s23.jpg','TripleS',NULL,'a',NULL,'55555','2005-06-11',37.421959,127.15209,0,NULL,37,85,85),(86,'Seoul','s24@triples.com',21,1,'지연','010-2004-0213','triples_s24.jpg','TripleS',NULL,'a',NULL,'66666','2004-02-13',37.544828,126.908928,0,NULL,37,86,86),(88,NULL,'3931016965',0,0,'.',NULL,NULL,NULL,'kakao','kakao','3931016965',NULL,NULL,NULL,NULL,0,NULL,37,88,88),(89,NULL,'enghd00@naver.com',34,0,'권두홍','01082497531','21740299591993.jpg','119/1401호',NULL,'a',NULL,'04701','1990-07-16',37.5666029325047,127.024082467223,0,'권두홍',37,89,89);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_hobby`
--

DROP TABLE IF EXISTS `member_hobby`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_hobby` (
  `member_info_id` int NOT NULL,
  `hobby_id` int NOT NULL,
  KEY `FKqgt6l199wnvg2940e80wvy1pg` (`hobby_id`),
  KEY `FKjkmjnxykt01c49evebhd618ln` (`member_info_id`),
  CONSTRAINT `FKjkmjnxykt01c49evebhd618ln` FOREIGN KEY (`member_info_id`) REFERENCES `member_info` (`member_info_id`),
  CONSTRAINT `FKqgt6l199wnvg2940e80wvy1pg` FOREIGN KEY (`hobby_id`) REFERENCES `hobby` (`hobby_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_hobby`
--

LOCK TABLES `member_hobby` WRITE;
/*!40000 ALTER TABLE `member_hobby` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_hobby` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_info`
--

DROP TABLE IF EXISTS `member_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_info` (
  `member_info_id` int NOT NULL AUTO_INCREMENT,
  `ei` tinyint DEFAULT NULL,
  `ns` tinyint DEFAULT NULL,
  `tf` tinyint DEFAULT NULL,
  `jp` tinyint DEFAULT NULL,
  `smoke` tinyint DEFAULT NULL,
  `alcohol` int NOT NULL,
  `date` int NOT NULL,
  `speed` int NOT NULL,
  `workout` int NOT NULL,
  PRIMARY KEY (`member_info_id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_info`
--

LOCK TABLES `member_info` WRITE;
/*!40000 ALTER TABLE `member_info` DISABLE KEYS */;
INSERT INTO `member_info` VALUES (1,1,1,0,0,0,4,4,1,4),(2,0,1,0,0,0,5,2,2,2),(3,1,0,1,1,0,1,1,1,3),(4,0,0,0,1,0,2,5,4,4),(5,1,1,0,0,0,4,1,5,3),(6,0,1,0,0,0,1,1,5,3),(7,0,0,0,1,0,5,3,1,4),(8,0,0,0,1,0,3,3,3,1),(9,0,0,1,0,0,1,1,1,5),(10,0,0,0,1,0,4,4,3,2),(11,1,0,1,0,0,3,5,3,3),(12,0,0,1,0,0,5,5,1,1),(13,0,0,0,0,0,5,5,2,3),(14,0,0,1,1,0,3,1,4,1),(15,0,1,1,1,0,3,2,1,3),(16,0,0,0,0,0,3,5,5,5),(17,0,1,0,0,0,3,2,5,3),(18,0,1,0,0,0,4,5,3,3),(19,0,1,0,0,0,1,2,4,5),(20,1,1,0,1,0,4,5,5,5),(21,0,1,0,1,0,5,3,1,5),(22,1,0,1,0,0,3,4,5,4),(23,0,0,1,1,0,4,3,1,2),(24,1,1,0,1,0,1,4,2,5),(25,0,0,0,0,0,2,3,2,2),(26,1,0,0,0,0,2,1,3,1),(27,1,1,0,1,0,5,3,4,4),(28,1,1,1,1,0,2,2,1,3),(29,1,1,0,0,0,1,3,3,3),(30,1,1,0,0,0,5,5,3,2),(31,1,0,1,1,0,5,3,3,3),(32,1,1,1,0,0,5,5,1,2),(33,0,0,0,0,0,4,2,2,5),(34,1,1,0,0,0,3,5,3,2),(35,0,1,1,1,0,5,1,2,1),(36,0,0,1,0,0,2,4,2,2),(37,0,1,1,0,0,3,5,5,3),(38,1,1,0,0,0,5,4,2,3),(39,1,0,0,0,0,4,5,3,5),(40,0,0,0,1,0,4,4,1,5),(41,1,0,1,0,0,5,5,4,1),(42,0,1,1,1,0,3,4,3,4),(43,0,1,0,1,0,2,2,2,1),(44,1,0,1,1,0,2,3,3,2),(45,0,1,0,1,0,2,1,4,4),(46,1,0,0,0,0,4,5,2,1),(47,1,1,1,1,0,3,3,4,1),(48,0,0,1,1,0,4,5,2,4),(49,1,0,0,1,0,3,3,3,3),(50,1,0,1,0,0,2,5,4,1),(51,0,0,1,1,0,5,1,4,1),(52,1,0,1,1,0,5,2,4,4),(53,1,0,0,0,0,3,1,5,2),(54,0,1,0,0,0,1,2,2,3),(55,1,1,0,1,0,2,2,3,4),(56,0,1,1,0,0,5,4,3,4),(57,0,0,1,0,0,4,5,5,1),(58,1,1,1,1,0,2,2,1,2),(59,0,1,1,1,0,5,3,2,4),(60,0,1,0,1,0,2,4,4,1),(61,1,0,1,1,0,4,2,3,1),(62,1,0,1,0,0,2,5,5,5),(63,0,0,1,1,0,4,4,2,4),(64,0,0,0,1,0,1,5,1,3),(65,0,1,0,1,0,5,4,3,3),(66,0,0,0,1,0,5,4,5,1),(67,0,1,1,1,0,2,1,3,1),(68,0,1,0,0,0,5,1,1,2),(69,0,1,1,0,0,2,2,2,5),(70,0,0,1,1,0,5,5,5,4),(71,1,0,0,0,0,3,4,4,2),(72,1,0,0,0,0,2,1,3,5),(73,0,0,1,1,0,2,5,3,4),(74,0,0,0,0,0,5,3,4,4),(75,1,1,1,0,0,3,1,3,2),(76,0,0,1,1,0,3,4,2,5),(77,0,1,0,1,0,1,1,3,4),(78,0,1,0,0,0,5,4,3,2),(79,1,1,0,0,0,4,2,4,2),(80,0,0,0,1,0,4,2,1,2),(81,1,0,1,1,0,4,2,5,2),(82,0,0,0,0,0,2,2,1,5),(83,0,0,0,1,0,3,4,4,4),(84,1,1,1,1,0,4,1,2,4),(85,0,1,0,1,0,1,2,3,4),(86,0,0,0,0,0,5,1,1,1),(88,0,0,0,0,0,2,3,1,2),(89,1,1,0,0,0,1,3,3,4);
/*!40000 ALTER TABLE `member_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_likes`
--

DROP TABLE IF EXISTS `member_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_likes` (
  `member_likes_id` int NOT NULL AUTO_INCREMENT,
  `liked` int NOT NULL,
  `liker` int NOT NULL,
  PRIMARY KEY (`member_likes_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_likes`
--

LOCK TABLES `member_likes` WRITE;
/*!40000 ALTER TABLE `member_likes` DISABLE KEYS */;
INSERT INTO `member_likes` VALUES (11,42,1),(12,1,42),(14,34,1),(15,1,41),(16,1,40),(17,40,1),(29,1,38),(30,38,1);
/*!40000 ALTER TABLE `member_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_member_role_list`
--

DROP TABLE IF EXISTS `member_member_role_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_member_role_list` (
  `member_member_id` int NOT NULL,
  `member_role_list` tinyint DEFAULT NULL,
  KEY `FKnjkpfkm2akst91klvj5tsn18c` (`member_member_id`),
  CONSTRAINT `FKnjkpfkm2akst91klvj5tsn18c` FOREIGN KEY (`member_member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `member_member_role_list_chk_1` CHECK ((`member_role_list` between 0 and 2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_member_role_list`
--

LOCK TABLES `member_member_role_list` WRITE;
/*!40000 ALTER TABLE `member_member_role_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_member_role_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `indate` datetime DEFAULT CURRENT_TIMESTAMP,
  `message` varchar(255) DEFAULT NULL,
  `messagefrom` varchar(255) DEFAULT NULL,
  `read_on_not` tinyint DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `FK1xep8o2ge7if6diclyyx53v4q` (`member_id`),
  CONSTRAINT `FK1xep8o2ge7if6diclyyx53v4q` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (7,'2025-02-11 12:01:01','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,1),(8,'2025-02-11 12:07:30','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,1),(9,'2025-02-11 12:08:01','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,42),(10,'2025-02-11 12:08:15','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,42),(11,'2025-02-11 12:15:33','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,42),(12,'2025-02-11 12:16:36','캉순이님이 회원님에게 라이크를 보냈습니다.','캉순이',1,1),(13,'2025-02-11 21:19:31','캉순이님이 회원님에게 라이크를 보냈습니다.','캉순이',0,26),(14,'2025-02-11 21:31:14','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(15,'2025-02-11 21:32:14','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(16,'2025-02-11 21:32:20','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(17,'2025-02-11 21:33:20','캉순이님이 회원님의 4번 포스트를 좋아합니다.','캉순이',1,1),(18,'2025-02-11 21:44:47','캉순이님이 회원님의 4번 포스트를 좋아합니다.','캉순이',1,1),(19,'2025-02-11 21:44:58','캉순이님이 회원님의 3번 포스트를 좋아합니다.','캉순이',1,1),(20,'2025-02-11 21:45:14','캉순이님이 회원님의 3번 포스트를 좋아합니다.','캉순이',1,1),(21,'2025-02-11 21:45:28','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(22,'2025-02-11 21:45:44','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(23,'2025-02-11 21:46:12','캉순이님이 회원님의 6번 포스트에 댓글을 작성했습니다.','캉순이',1,1),(24,'2025-02-11 21:46:27','캉순이님이 회원님의 6번 포스트에 댓글을 작성했습니다.','캉순이',1,1),(25,'2025-02-11 21:47:47','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(26,'2025-02-11 22:06:47','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(27,'2025-02-11 22:07:02','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(28,'2025-02-11 22:13:48','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(29,'2025-02-11 22:18:21','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(30,'2025-02-11 22:25:19','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(31,'2025-02-11 22:25:34','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(32,'2025-02-11 22:25:59','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(33,'2025-02-11 22:26:02','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(34,'2025-02-11 22:26:27','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(35,'2025-02-11 22:26:43','캉순이님이 회원님의 4번 포스트를 좋아합니다.','캉순이',1,1),(36,'2025-02-11 22:27:17','캉순이님이 회원님의 4번 포스트에 댓글을 작성했습니다.','캉순이',1,1),(37,'2025-02-11 22:27:40','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(38,'2025-02-11 22:29:26','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(39,'2025-02-11 22:30:05','캉순이님이 회원님의 6번 포스트에 댓글을 작성했습니다.','캉순이',1,1),(40,'2025-02-11 22:30:59','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(41,'2025-02-11 22:32:06','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(42,'2025-02-11 22:32:36','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(43,'2025-02-11 22:32:56','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(44,'2025-02-11 22:33:36','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(45,'2025-02-11 22:34:47','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(46,'2025-02-11 22:35:10','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(47,'2025-02-11 22:35:33','캉순이님이 회원님의 4번 포스트를 좋아합니다.','캉순이',1,1),(48,'2025-02-11 22:35:52','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(49,'2025-02-12 10:11:15','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',0,34),(50,'2025-02-13 10:48:16','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(51,'2025-02-13 10:49:06','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,38),(52,'2025-02-13 10:51:00','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,38),(53,'2025-02-13 10:51:13','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(54,'2025-02-13 10:51:36','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(55,'2025-02-13 10:52:21','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(56,'2025-02-13 10:53:08','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(57,'2025-02-13 10:54:39','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(58,'2025-02-13 10:55:02','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(59,'2025-02-13 10:55:06','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(60,'2025-02-13 11:02:30','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(61,'2025-02-13 11:02:45','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(62,'2025-02-13 14:50:07','캉캉이님이 회원님의 8번 포스트를 좋아합니다.','캉캉이',1,1),(63,'2025-02-13 16:56:38','캉캉이님이 회원님의 8번 포스트를 좋아합니다.','캉캉이',1,1),(64,'2025-02-13 16:56:44','캉캉이님이 회원님의 8번 포스트를 좋아합니다.','캉캉이',1,1),(65,'2025-02-13 16:57:01','캉캉이님이 회원님의 7번 포스트를 좋아합니다.','캉캉이',1,1),(66,'2025-02-13 17:31:10','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',0,38),(67,'2025-02-20 16:51:31','캉캉이님이 회원님에게1방에서 쪽지를 보냈습니다.','캉캉이',1,42),(68,'2025-02-20 16:55:00','캉캉이님이 회원님에게2방에서 쪽지를 보냈습니다.','캉캉이',0,41),(69,'2025-02-20 16:55:00','캉캉이님이 회원님에게2방에서 쪽지를 보냈습니다.','캉캉이',1,40),(70,'2025-02-20 16:55:23','캉캉이님이 회원님에게2방에서 쪽지를 보냈습니다.','캉캉이',0,41),(71,'2025-02-20 16:55:23','캉캉이님이 회원님에게2방에서 쪽지를 보냈습니다.','캉캉이',1,40),(72,'2025-02-20 17:06:11','익명의 회원님이 회원님에게익명채팅 방에 초대 했습니다.','캉캉이',1,35),(73,'2025-02-20 17:06:56','캉캉이님이 회원님에게익명채팅 방에서 쪽지를 보냈습니다.','캉캉이',1,35),(74,'2025-02-20 17:11:42','익명의 회원님이 회원님에게익명채팅 방에서 쪽지를 보냈습니다.','캉캉이',1,35),(86,'2025-02-20 17:39:02','캉캉이님이 회원님에게 캉캉이 의 6 인 채팅방 방에 초대 했습니다.','캉캉이',1,1),(87,'2025-02-20 17:39:02','캉캉이님이 회원님에게 캉캉이 의 6 인 채팅방 방에 초대 했습니다.','캉캉이',1,1),(88,'2025-02-20 17:39:02','캉캉이님이 회원님에게 캉캉이 의 6 인 채팅방 방에 초대 했습니다.','캉캉이',1,27),(89,'2025-02-20 17:39:02','캉캉이님이 회원님에게 캉캉이 의 6 인 채팅방 방에 초대 했습니다.','캉캉이',0,28),(90,'2025-02-20 17:39:02','캉캉이님이 회원님에게 캉캉이 의 6 인 채팅방 방에 초대 했습니다.','캉캉이',0,29),(91,'2025-02-20 17:39:02','캉캉이님이 회원님에게 캉캉이 의 6 인 채팅방 방에 초대 했습니다.','캉캉이',0,30),(92,'2025-02-20 17:44:01','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',1,1),(93,'2025-02-20 17:44:01','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',1,27),(94,'2025-02-20 17:44:01','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,28),(95,'2025-02-20 17:44:01','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,29),(96,'2025-02-20 17:44:01','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,30),(97,'2025-02-20 17:49:19','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',1,1),(98,'2025-02-20 17:49:19','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',1,27),(99,'2025-02-20 17:49:19','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,28),(100,'2025-02-20 17:49:19','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,29),(101,'2025-02-20 17:49:19','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,30),(102,'2025-02-20 17:53:46','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',1,1),(103,'2025-02-20 17:53:46','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',1,27),(104,'2025-02-20 17:53:46','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,28),(105,'2025-02-20 17:53:46','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,29),(106,'2025-02-20 17:53:46','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,30),(107,'2025-02-20 17:57:31','캉캉이님이 회원님에게 캉캉이 의 4 인 채팅방 방에 초대 했습니다.','캉캉이',1,27),(108,'2025-02-20 17:57:31','캉캉이님이 회원님에게 캉캉이 의 4 인 채팅방 방에 초대 했습니다.','캉캉이',0,29),(109,'2025-02-20 17:57:31','캉캉이님이 회원님에게 캉캉이 의 4 인 채팅방 방에 초대 했습니다.','캉캉이',0,28),(110,'2025-02-20 17:57:31','캉캉이님이 회원님에게 캉캉이 의 4 인 채팅방 방에 초대 했습니다.','캉캉이',0,30),(111,'2025-02-20 17:59:01','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',1,27),(112,'2025-02-20 17:59:01','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,30),(113,'2025-02-20 17:59:01','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,29),(114,'2025-02-20 17:59:01','캉캉이님이 회원님에게 캉캉이 의 5 인 채팅방 방에 초대 했습니다.','캉캉이',0,28),(116,'2025-02-23 20:54:15','13번 게시물에서 캉캉이님이 회원님을 언급했습니다.','캉캉이',1,42),(118,'2025-02-23 21:01:20','15번 게시물에서 캉캉이님이 회원님을 언급했습니다.','캉캉이',1,42);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opponent_member_hobby`
--

DROP TABLE IF EXISTS `opponent_member_hobby`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opponent_member_hobby` (
  `opponent_member_info_id` int NOT NULL,
  `hobby_id` int NOT NULL,
  KEY `FK53myk6lv997fgowxd1bows3ny` (`hobby_id`),
  KEY `FKlabav7hqbtswmn22lfb5dhorq` (`opponent_member_info_id`),
  CONSTRAINT `FK53myk6lv997fgowxd1bows3ny` FOREIGN KEY (`hobby_id`) REFERENCES `hobby` (`hobby_id`),
  CONSTRAINT `FKlabav7hqbtswmn22lfb5dhorq` FOREIGN KEY (`opponent_member_info_id`) REFERENCES `opponent_member_info` (`opponent_member_info_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opponent_member_hobby`
--

LOCK TABLES `opponent_member_hobby` WRITE;
/*!40000 ALTER TABLE `opponent_member_hobby` DISABLE KEYS */;
INSERT INTO `opponent_member_hobby` VALUES (1,1);
/*!40000 ALTER TABLE `opponent_member_hobby` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opponent_member_info`
--

DROP TABLE IF EXISTS `opponent_member_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opponent_member_info` (
  `opponent_member_info_id` int NOT NULL AUTO_INCREMENT,
  `ei` tinyint DEFAULT NULL,
  `ns` tinyint DEFAULT NULL,
  `tf` tinyint DEFAULT NULL,
  `jp` tinyint DEFAULT NULL,
  `smoke` tinyint DEFAULT NULL,
  PRIMARY KEY (`opponent_member_info_id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opponent_member_info`
--

LOCK TABLES `opponent_member_info` WRITE;
/*!40000 ALTER TABLE `opponent_member_info` DISABLE KEYS */;
INSERT INTO `opponent_member_info` VALUES (1,1,1,0,1,0),(2,0,0,0,1,0),(3,0,0,1,1,0),(4,1,0,1,1,0),(5,0,0,0,1,0),(6,0,1,1,0,0),(7,1,0,1,1,0),(8,0,1,0,1,0),(9,0,0,0,1,0),(10,0,1,0,0,0),(11,1,0,1,1,0),(12,0,0,1,1,0),(13,1,1,0,1,0),(14,0,0,0,0,0),(15,0,1,0,0,0),(16,1,1,1,0,0),(17,0,0,1,1,0),(18,0,1,1,1,0),(19,1,0,0,0,0),(20,1,1,1,0,0),(21,0,0,1,0,0),(22,0,1,0,1,0),(23,1,1,1,1,0),(24,1,0,0,0,0),(25,1,1,0,0,0),(26,0,0,0,0,0),(27,1,0,1,1,0),(28,0,0,1,1,0),(29,0,0,1,0,0),(30,1,1,0,0,0),(31,1,0,1,0,0),(32,1,0,0,0,0),(33,0,0,1,0,0),(34,1,0,1,1,0),(35,0,0,1,1,0),(36,0,0,1,1,0),(37,0,1,0,1,0),(38,1,0,1,0,0),(39,0,0,0,0,0),(40,1,0,1,0,0),(41,0,1,0,0,0),(42,1,0,1,1,0),(43,0,0,1,1,0),(44,0,1,0,1,0),(45,0,1,1,1,0),(46,1,1,1,0,0),(47,1,0,1,0,0),(48,1,1,1,0,0),(49,0,0,1,0,0),(50,0,1,0,1,0),(51,1,1,1,0,0),(52,0,1,1,1,0),(53,1,1,1,1,0),(54,0,0,1,0,0),(55,1,1,1,0,0),(56,0,0,1,0,0),(57,0,1,1,0,0),(58,1,1,0,1,0),(59,0,0,1,0,0),(60,1,0,1,0,0),(61,1,0,0,1,0),(62,0,0,1,0,0),(63,0,1,1,0,0),(64,1,0,0,0,0),(65,1,1,0,1,0),(66,1,0,1,0,0),(67,0,0,1,1,0),(68,1,1,0,1,0),(69,1,0,0,0,0),(70,1,1,0,0,0),(71,1,0,1,1,0),(72,0,1,1,0,0),(73,0,1,1,0,0),(74,0,0,0,1,0),(75,1,0,1,1,0),(76,1,0,0,1,0),(77,1,0,0,1,0),(78,0,0,0,1,0),(79,0,1,1,1,0),(80,0,1,0,0,0),(81,1,1,1,0,0),(82,1,0,0,1,0),(83,0,1,1,1,0),(84,1,1,0,0,0),(85,1,1,0,0,0),(86,1,0,0,0,0),(88,1,0,1,0,0),(89,1,0,0,1,0);
/*!40000 ALTER TABLE `opponent_member_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `writedate` datetime DEFAULT CURRENT_TIMESTAMP,
  `member_id` int DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `FK83s99f4kx8oiqm3ro0sasmpww` (`member_id`),
  CONSTRAINT `FK83s99f4kx8oiqm3ro0sasmpww` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (3,'첫번째 게시물','2025-02-10 14:20:14',1),(4,'두번째 게시물','2025-02-10 14:22:26',1),(5,'세번째 게시물','2025-02-10 14:22:26',1),(6,'네번째 게시물','2025-02-10 14:22:26',1),(7,'다섯번째 게시물','2025-02-13 13:10:47',1),(8,'여섯번째 게시물','2025-02-13 14:42:24',1),(9,'일곱번째 게시물','2025-02-17 08:38:00',1),(10,'여덟번째 게시물','2025-02-20 08:49:28',1),(11,'아홉번째 게시물','2025-02-23 16:39:58',1),(12,'@캉순이\n#말차라떼\n맛있다','2025-02-23 20:46:27',1),(13,'@캉순이\n#말차라떼\n맛있다222','2025-02-23 20:54:15',1),(15,'@캉순이\n#망고주스\n망고주스 맛있다.','2025-02-23 21:01:20',1);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_hashtag`
--

DROP TABLE IF EXISTS `post_hashtag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_hashtag` (
  `post_hash_id` int NOT NULL AUTO_INCREMENT,
  `hashtag_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  PRIMARY KEY (`post_hash_id`),
  KEY `FKrohvofkvcdt18d3pfk1ch9gm5` (`hashtag_id`),
  KEY `FKrk684kfi072l3a8e810ule20s` (`post_id`),
  CONSTRAINT `FKrk684kfi072l3a8e810ule20s` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`),
  CONSTRAINT `FKrohvofkvcdt18d3pfk1ch9gm5` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtag` (`hashtag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_hashtag`
--

LOCK TABLES `post_hashtag` WRITE;
/*!40000 ALTER TABLE `post_hashtag` DISABLE KEYS */;
INSERT INTO `post_hashtag` VALUES (1,1,12),(2,1,13),(4,2,15);
/*!40000 ALTER TABLE `post_hashtag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_likes`
--

DROP TABLE IF EXISTS `post_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_likes` (
  `likes_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  PRIMARY KEY (`likes_id`),
  KEY `FK31v89uqgytp1u8jm6vcn1rpsv` (`member_id`),
  KEY `FKmxmoc9p5ndijnsqtvsjcuoxm3` (`post_id`),
  CONSTRAINT `FK31v89uqgytp1u8jm6vcn1rpsv` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `FKmxmoc9p5ndijnsqtvsjcuoxm3` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_likes`
--

LOCK TABLES `post_likes` WRITE;
/*!40000 ALTER TABLE `post_likes` DISABLE KEYS */;
INSERT INTO `post_likes` VALUES (2,1,6),(33,42,6);
/*!40000 ALTER TABLE `post_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_mention`
--

DROP TABLE IF EXISTS `post_mention`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_mention` (
  `post_mention_id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(255) DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  PRIMARY KEY (`post_mention_id`),
  KEY `FKsd5wi047dtaidv18n6tr1603` (`post_id`),
  CONSTRAINT `FKsd5wi047dtaidv18n6tr1603` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_mention`
--

LOCK TABLES `post_mention` WRITE;
/*!40000 ALTER TABLE `post_mention` DISABLE KEYS */;
INSERT INTO `post_mention` VALUES (1,'캉순이',12),(2,'캉순이',13),(4,'캉순이',15);
/*!40000 ALTER TABLE `post_mention` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `quiz_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`quiz_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` VALUES (1,'1 짜장면 2 짬뽕'),(2,'1 산 2 바다'),(3,'1 초콜릿 2 사탕'),(4,'1 전화 2 문자'),(5,'1 기차 2 버스'),(6,'1 돼지 2 소'),(8,'1 된장찌개 2 김치찌개'),(15,'1 강아지 2 고양이'),(16,'1 놀이공원 2 워터파크'),(17,'1 액션영화 2 로맨스영화'),(18,'1 바다 2 계곡'),(19,'1 치킨 2 피자'),(20,'1 핫도그 2 토스트'),(21,'1 말차라떼 2 밀크티'),(22,'1 호캉스 2 바캉스');
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `real_time_chat_room`
--

DROP TABLE IF EXISTS `real_time_chat_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `real_time_chat_room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_private` bit(1) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `creator_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKompyeuimwd4y631ys77yf7tco` (`creator_id`),
  CONSTRAINT `FKompyeuimwd4y631ys77yf7tco` FOREIGN KEY (`creator_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `real_time_chat_room`
--

LOCK TABLES `real_time_chat_room` WRITE;
/*!40000 ALTER TABLE `real_time_chat_room` DISABLE KEYS */;
/*!40000 ALTER TABLE `real_time_chat_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reply`
--

DROP TABLE IF EXISTS `reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reply` (
  `reply_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `writedate` datetime DEFAULT CURRENT_TIMESTAMP,
  `member_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  PRIMARY KEY (`reply_id`),
  KEY `FKen6vrmi5oth4bg6ybfc202fmu` (`member_id`),
  KEY `FKnpyg5e6pqr2v1y4y6pacte11q` (`post_id`),
  CONSTRAINT `FKen6vrmi5oth4bg6ybfc202fmu` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `FKnpyg5e6pqr2v1y4y6pacte11q` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reply`
--

LOCK TABLES `reply` WRITE;
/*!40000 ALTER TABLE `reply` DISABLE KEYS */;
INSERT INTO `reply` VALUES (1,'첫번째 댓글',NULL,1,6),(2,'두번쨰 댓글',NULL,1,6);
/*!40000 ALTER TABLE `reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_online`
--

DROP TABLE IF EXISTS `user_online`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_online` (
  `member_id` int NOT NULL,
  PRIMARY KEY (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_online`
--

LOCK TABLES `user_online` WRITE;
/*!40000 ALTER TABLE `user_online` DISABLE KEYS */;
INSERT INTO `user_online` VALUES (0),(1);
/*!40000 ALTER TABLE `user_online` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-25  9:46:14
