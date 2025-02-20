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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,'1번','2025-02-12 14:14:33',1,1),(2,'2번','2025-02-12 14:37:49',1,42),(3,'3번','2025-02-12 14:38:09',1,1),(4,'4번','2025-02-12 14:38:09',1,42),(5,'5번','2025-02-12 15:56:34',1,1),(6,'점심뭐먹지','2025-02-12 15:57:32',2,40),(7,'글쎄','2025-02-12 15:57:32',2,41),(8,'캉캉이랑 먹자!!','2025-02-12 15:57:46',2,1),(9,'6번','2025-02-12 17:43:41',1,1),(10,'7번','2025-02-12 17:44:01',1,42),(14,'안녕하세여!','2025-02-13 10:20:02',12,1),(15,'안녕하세요!!!','2025-02-13 10:49:26',18,1),(16,'1111','2025-02-17 14:46:26',19,42),(20,'안녕하세여','2025-02-18 09:30:48',29,1),(21,'안녕하세여','2025-02-18 10:55:01',30,1),(22,'안녕하세여!!','2025-02-18 10:58:12',30,1),(23,'안녕하세여~','2025-02-18 10:58:37',30,42),(24,'ㅎㅇㅎㅇ','2025-02-18 11:12:34',31,1),(25,'안녕하세요!!!!','2025-02-18 12:00:21',32,1),(26,'안녕하세여~','2025-02-18 12:01:16',32,32),(27,'안녕하세여!!','2025-02-18 17:01:00',19,32),(28,'오늘 좋은 하루 되세여~','2025-02-18 17:02:25',19,32),(29,'8번','2025-02-18 17:03:06',1,1),(30,'오늘 뭐하세여??','2025-02-18 17:04:19',30,1),(31,'안녕하세여~','2025-02-18 17:13:48',30,1),(32,'안녕하세여!!','2025-02-19 09:00:31',33,1),(33,'ㅎㅇㅎㅇ','2025-02-19 17:03:29',45,1),(34,'gdgd','2025-02-19 17:04:12',45,42),(35,'ㄱㄱㄱ','2025-02-19 17:09:31',45,1),(36,'ㄴㄴㄴㄴ','2025-02-19 17:09:38',45,42),(37,'ㄷㄷㄷ','2025-02-19 17:10:30',45,1),(38,'ㄹㄹㄹㄹ','2025-02-19 17:10:33',45,42),(39,'ㅎㅇㅎㅇ','2025-02-19 17:13:09',45,42),(40,'ㄱㄱㄱㄱ','2025-02-19 17:13:15',45,1),(41,'ㄱㄱㄱㄱ','2025-02-19 17:13:26',45,42),(42,'ㄱㄱㄱㄱ','2025-02-19 17:13:28',45,42),(43,'ㄱㄱㄱㄱ','2025-02-19 17:25:18',45,1),(44,'ㅎㅇㅎㅇ','2025-02-19 17:46:53',46,1),(45,'ㅎㅇㅎㅇ','2025-02-19 17:48:35',46,33),(46,'뭐 좋아하세요??','2025-02-19 17:48:42',46,1),(47,'맛있는거요??','2025-02-19 17:48:55',46,33),(48,'ㅎㅇㅎㅇ','2025-02-20 09:01:17',48,1),(49,'안녕하세여!!','2025-02-20 09:01:35',49,1),(50,'오 매칭 성공','2025-02-20 09:03:31',49,1),(51,'뭐 좋아하세여??','2025-02-20 09:03:45',49,40),(52,'우리 맛있는거 먹으러 갈까요???','2025-02-20 09:04:30',49,1);
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group`
--

LOCK TABLES `chat_group` WRITE;
/*!40000 ALTER TABLE `chat_group` DISABLE KEYS */;
INSERT INTO `chat_group` VALUES (1,1,2,'첫번째 채팅',0,'2025-02-12 14:14:33',0),(2,1,3,'두번째 채팅',0,'2025-02-12 14:14:33',0),(12,1,2,'2인 매칭 채팅방',0,'2025-02-12 14:14:33',0),(18,1,2,'2인 매칭 채팅방',0,'2025-02-12 14:14:33',0),(19,42,2,'2인 매칭 채팅방',0,'2025-02-12 14:14:33',0),(29,1,3,'New Group for [1, 32, 37]',0,'2025-02-12 14:14:33',0),(30,1,2,'익명채팅',1,'2025-02-18 14:14:33',0),(31,1,3,'New Group for [1, 31, 32]',0,'2025-02-18 14:14:33',0),(32,1,2,'익명채팅',1,'2025-02-18 14:14:33',0),(33,1,2,'익명채팅',1,'2025-02-19 09:00:25',0),(43,1,2,'익명채팅',1,'2025-02-19 14:41:35',0),(44,1,2,'익명채팅',1,'2025-02-19 15:11:24',0),(45,1,2,'익명채팅',1,'2025-02-19 17:02:47',1),(46,1,2,'익명채팅',1,'2025-02-19 17:46:21',1),(47,1,2,'익명채팅',1,'2025-02-19 17:51:07',0),(48,1,2,'2인 매칭 채팅방',0,'2025-02-20 09:01:12',0),(49,1,2,'익명채팅',1,'2025-02-20 09:01:28',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group_member`
--

LOCK TABLES `chat_group_member` WRITE;
/*!40000 ALTER TABLE `chat_group_member` DISABLE KEYS */;
INSERT INTO `chat_group_member` VALUES (1,1,1),(2,1,42),(3,2,1),(4,2,41),(5,2,40),(18,12,1),(19,12,40),(30,18,1),(31,18,38),(32,19,42),(33,19,32),(59,29,1),(60,29,32),(61,29,37),(62,30,1),(63,30,42),(64,31,1),(65,31,31),(66,31,32),(67,32,1),(68,32,32),(69,33,1),(70,33,40),(89,43,1),(90,43,38),(91,44,1),(92,44,35),(93,45,1),(94,45,42),(95,46,1),(96,46,33),(97,47,1),(98,47,35),(99,48,1),(100,48,31),(101,49,1),(102,49,40);
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group_quiz`
--

LOCK TABLES `chat_group_quiz` WRITE;
/*!40000 ALTER TABLE `chat_group_quiz` DISABLE KEYS */;
INSERT INTO `chat_group_quiz` VALUES (25,'2025-02-19 14:43:00.000000',43,15),(26,'2025-02-19 14:44:00.000000',43,2),(27,'2025-02-19 14:45:00.000000',43,22),(28,'2025-02-19 15:13:00.000000',44,17),(29,'2025-02-19 15:14:00.000000',44,4),(30,'2025-02-19 15:15:00.000000',44,15),(31,'2025-02-19 17:04:00.000000',45,22),(32,'2025-02-19 17:05:00.000000',45,21),(33,'2025-02-19 17:06:00.000000',45,19),(34,'2025-02-19 17:48:00.000000',46,16),(35,'2025-02-19 17:49:00.000000',46,20),(36,'2025-02-19 17:50:00.000000',46,5),(37,'2025-02-19 17:53:00.000000',47,16),(38,'2025-02-19 17:54:00.000000',47,17),(39,'2025-02-19 17:55:00.000000',47,6),(40,'2025-02-20 09:03:00.000000',49,4),(41,'2025-02-20 09:04:00.000000',49,17),(42,'2025-02-20 09:05:00.000000',49,21);
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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group_quiz_answer`
--

LOCK TABLES `chat_group_quiz_answer` WRITE;
/*!40000 ALTER TABLE `chat_group_quiz_answer` DISABLE KEYS */;
INSERT INTO `chat_group_quiz_answer` VALUES (15,28,1,1),(16,28,35,2),(17,29,1,1),(18,29,35,1),(19,30,1,2),(20,30,35,2),(21,31,1,2),(22,31,42,2),(23,32,1,2),(24,32,42,1),(25,33,42,1),(26,33,1,2),(27,31,1,1),(28,31,42,1),(29,31,1,1),(30,31,42,2),(31,31,1,1),(32,31,42,2),(33,31,1,1),(34,31,42,2),(35,34,1,1),(36,34,33,1),(37,35,1,1),(38,35,33,2),(39,37,1,1),(40,37,35,1),(41,38,1,1),(42,38,35,1),(43,39,1,1),(44,39,35,1),(45,40,40,1),(46,40,1,1),(47,41,1,1),(48,41,40,1),(49,42,1,1);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hashtag`
--

LOCK TABLES `hashtag` WRITE;
/*!40000 ALTER TABLE `hashtag` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,'KakaoTalk_20250117_1915009131737165055774.jpg',3),(2,'KakaoTalk_20250117_1915009131737165055774.jpg',4),(3,'KakaoTalk_20250117_1915009131737165055774.jpg',5),(4,'KakaoTalk_20250117_1915009131737165055774.jpg',6),(11,'20221007＿205530.jpg',7),(12,'porksoup.jpg',8),(13,'매머드.jpg',9),(14,'매머드.jpg',10);
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
  `ei` tinyint DEFAULT '0',
  `jp` tinyint DEFAULT '0',
  `ns` tinyint DEFAULT '0',
  `tf` tinyint DEFAULT '0',
  `temp` int NOT NULL DEFAULT '37',
  PRIMARY KEY (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,NULL,'a',18,0,'캉캉이','010-1111-1111','캉캉이.jpg','캉캉이에요',NULL,'a',NULL,'11111','2007-05-05',NULL,NULL,0,NULL,0,0,0,0,37),(2,'Chicago','johnny@nct.com',28,0,'쟈니','010-1111-1111','쟈니.jpg','NCT 127',NULL,'a',NULL,'12345','1997-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(3,'Seoul','taeyong@nct.com',29,0,'태용','010-2222-2222','태용.jpg','Leader of NCT',NULL,'a',NULL,'23456','1996-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(4,'Osaka','yuta@nct.com',28,0,'유타','010-3333-3333','유타.jpg','Osaka Prince',NULL,'a',NULL,'34567','1997-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(5,'Beijing','kun@nct.com',28,0,'쿤','010-4444-4444','쿤.jpg','WayV Leader',NULL,'a',NULL,'45678','1997-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(6,'Seoul','doyoung@nct.com',28,0,'도영','010-5555-5555','도영.jpg','Main Vocal',NULL,'a',NULL,'56789','1997-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(7,'Bangkok','ten@nct.com',28,0,'텐','010-6666-6666','텐.png','Dancer & Vocal',NULL,'a',NULL,'67890','1997-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(8,'Seoul','jaehyun@nct.com',27,0,'재현','010-7777-7777','재현.jpg','NCT 127',NULL,'a',NULL,'78901','1998-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(9,'Wenzhou','winwin@nct.com',26,0,'윈윈','010-8888-8888','윈윈.jpg','WayV',NULL,'a',NULL,'89012','1999-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(10,'Seoul','jungwoo@nct.com',26,0,'정우','010-9999-9999','정우.jpg','NCT 127',NULL,'a',NULL,'90123','1999-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(11,'Vancouver','mark@nct.com',25,0,'마크','010-1010-1010','마크.jpg','Rapper & Vocal',NULL,'a',NULL,'01234','2000-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(12,'Guangdong','xiaojun@nct.com',25,0,'샤오쥔','010-1212-1212','샤오쥔.jpg','WayV',NULL,'a',NULL,'11223','2000-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(13,'Macau','hendery@nct.com',24,0,'헨드리','010-1313-1313','헨드리.jpg','WayV',NULL,'a',NULL,'22334','2001-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(14,'Jilin','renjun@nct.com',24,0,'런쥔','010-1414-1414','런쥔.jpg','NCT Dream',NULL,'a',NULL,'33445','2001-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(15,'Seoul','jeno@nct.com',24,0,'제노','010-1515-1515','제노.jpg','NCT Dream',NULL,'a',NULL,'44556','2001-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(16,'Seoul','haechan@nct.com',24,0,'해찬','010-1616-1616','해찬.jpg','NCT 127 & Dream',NULL,'a',NULL,'55667','2001-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(17,'Seoul','jaemin@nct.com',24,0,'재민','010-1717-1717','재민.jpg','NCT Dream',NULL,'a',NULL,'66778','2001-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(18,'Taipei','yangyang@nct.com',23,0,'양양','010-1818-1818','양양.png','WayV',NULL,'a',NULL,'77889','2002-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(19,'Shanghai','chenle@nct.com',23,0,'천러','010-1919-1919','천러.png','NCT Dream',NULL,'a',NULL,'88990','2002-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(20,'Seoul','jisung@nct.com',22,0,'지성','010-2020-2020','지성.png','Maknae',NULL,'a',NULL,'99001','2003-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(21,'Seoul','sion@nct.com',20,0,'시온','010-2121-2121','시온.png','New Member',NULL,'a',NULL,'11112','2005-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(22,'Tokyo','riku@nct.com',21,0,'리쿠','010-2222-2323','리쿠.jpg','New Member',NULL,'a',NULL,'12123','2004-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(23,'Osaka','yuushi@nct.com',20,0,'유우시','010-2323-2424','유우시.jpg','New Member',NULL,'a',NULL,'13134','2005-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(24,'Seoul','jaehee@nct.com',21,0,'재희','010-2424-2525','재희.jpg','New Member',NULL,'a',NULL,'14145','2004-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(25,'Fukuoka','ryo@nct.com',20,0,'료','010-2525-2626','료.jpg','New Member',NULL,'a',NULL,'15156','2005-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(26,'Nagoya','sakuya@nct.com',20,0,'사쿠야','010-2626-2727','사쿠야.jpg','New Member',NULL,'a',NULL,'16167','2005-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(27,'Seoul','karina@aespa.com',24,1,'카리나','010-1111-2222','카리나.jpg','Leader & Main Dancer',NULL,'a',NULL,'11111','2001-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(28,'Tokyo','giselle@aespa.com',23,1,'지젤','010-2222-3333','지젤.jpg','Main Rapper',NULL,'a',NULL,'22222','2002-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(29,'Busan','winter@aespa.com',23,1,'윈터','010-3333-4444','윈터.jpg','Lead Vocal & Dancer',NULL,'a',NULL,'33333','2002-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(30,'Harbin','ningning@aespa.com',22,1,'닝닝','010-4444-5555','닝닝.jpg','Main Vocal',NULL,'a',NULL,'44444','2003-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(31,'Seoul','minji@newjeans.com',20,1,'민지','010-5555-6666','민지.jpg','Leader & Vocal',NULL,'a',NULL,'55555','2005-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(32,'Melbourne','hanni@newjeans.com',20,1,'하니','010-6666-7777','하니.jpg','Main Vocal',NULL,'a',NULL,'66666','2005-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(33,'Newcastle','danielle@newjeans.com',19,1,'다니엘','010-7777-8888','다니엘.jpg','Lead Vocal',NULL,'a',NULL,'77777','2006-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(34,'Seoul','haerin@newjeans.com',18,1,'해린','010-8888-9999','해린.jpg','Vocal & Dancer',NULL,'a',NULL,'88888','2007-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(35,'Incheon','hyein@newjeans.com',17,1,'혜인','010-9999-0000','혜인.jpg','Maknae & Vocal',NULL,'a',NULL,'99999','2008-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(36,'Daejeon','yujin@ive.com',22,1,'안유진','010-1111-2222','안유진.jpg','Leader & Vocal',NULL,'a',NULL,'11111','2003-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(37,'Incheon','gaeul@ive.com',21,1,'가을','010-2222-3333','가을.jpg','Main Rapper & Dancer',NULL,'a',NULL,'22222','2004-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(38,'Nagoya','rei@ive.com',20,1,'레이','010-3333-4444','레이.jpg','Rapper & Vocal',NULL,'a',NULL,'33333','2005-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(39,'Seoul','wonyoung@ive.com',20,1,'장원영','010-4444-5555','장원영.jpg','Lead Vocal & Visual',NULL,'a',NULL,'44444','2005-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(40,'Jeju','liz@ive.com',20,1,'리즈','010-5555-6666','리즈.jpg','Main Vocal',NULL,'a',NULL,'55555','2005-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(41,'Seoul','leeseo@ive.com',18,1,'이서','010-6666-7777','이서.jpg','Maknae & Vocal',NULL,'a',NULL,'66666','2007-01-01',NULL,NULL,0,NULL,0,0,0,0,37),(42,NULL,'b',18,1,'캉순이','010-1111-1111','캉순이.jpg','캉순이에여',NULL,'b',NULL,'77777','2007-06-06',NULL,NULL,0,NULL,0,0,0,0,37);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_hobby`
--

DROP TABLE IF EXISTS `member_hobby`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_hobby` (
  `member_id` int NOT NULL,
  `hobby_id` int NOT NULL,
  PRIMARY KEY (`member_id`,`hobby_id`),
  KEY `hobby_id` (`hobby_id`),
  CONSTRAINT `member_hobby_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`) ON DELETE CASCADE,
  CONSTRAINT `member_hobby_ibfk_2` FOREIGN KEY (`hobby_id`) REFERENCES `hobby` (`hobby_id`) ON DELETE CASCADE
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
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (7,'2025-02-11 12:01:01','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,1),(8,'2025-02-11 12:07:30','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,1),(9,'2025-02-11 12:08:01','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,42),(10,'2025-02-11 12:08:15','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,42),(11,'2025-02-11 12:15:33','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,42),(12,'2025-02-11 12:16:36','캉순이님이 회원님에게 라이크를 보냈습니다.','캉순이',1,1),(13,'2025-02-11 21:19:31','캉순이님이 회원님에게 라이크를 보냈습니다.','캉순이',0,26),(14,'2025-02-11 21:31:14','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(15,'2025-02-11 21:32:14','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(16,'2025-02-11 21:32:20','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(17,'2025-02-11 21:33:20','캉순이님이 회원님의 4번 포스트를 좋아합니다.','캉순이',1,1),(18,'2025-02-11 21:44:47','캉순이님이 회원님의 4번 포스트를 좋아합니다.','캉순이',1,1),(19,'2025-02-11 21:44:58','캉순이님이 회원님의 3번 포스트를 좋아합니다.','캉순이',1,1),(20,'2025-02-11 21:45:14','캉순이님이 회원님의 3번 포스트를 좋아합니다.','캉순이',1,1),(21,'2025-02-11 21:45:28','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(22,'2025-02-11 21:45:44','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(23,'2025-02-11 21:46:12','캉순이님이 회원님의 6번 포스트에 댓글을 작성했습니다.','캉순이',1,1),(24,'2025-02-11 21:46:27','캉순이님이 회원님의 6번 포스트에 댓글을 작성했습니다.','캉순이',1,1),(25,'2025-02-11 21:47:47','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(26,'2025-02-11 22:06:47','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(27,'2025-02-11 22:07:02','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(28,'2025-02-11 22:13:48','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(29,'2025-02-11 22:18:21','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(30,'2025-02-11 22:25:19','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(31,'2025-02-11 22:25:34','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(32,'2025-02-11 22:25:59','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(33,'2025-02-11 22:26:02','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(34,'2025-02-11 22:26:27','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(35,'2025-02-11 22:26:43','캉순이님이 회원님의 4번 포스트를 좋아합니다.','캉순이',1,1),(36,'2025-02-11 22:27:17','캉순이님이 회원님의 4번 포스트에 댓글을 작성했습니다.','캉순이',1,1),(37,'2025-02-11 22:27:40','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(38,'2025-02-11 22:29:26','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(39,'2025-02-11 22:30:05','캉순이님이 회원님의 6번 포스트에 댓글을 작성했습니다.','캉순이',1,1),(40,'2025-02-11 22:30:59','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(41,'2025-02-11 22:32:06','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(42,'2025-02-11 22:32:36','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(43,'2025-02-11 22:32:56','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(44,'2025-02-11 22:33:36','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(45,'2025-02-11 22:34:47','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(46,'2025-02-11 22:35:10','캉순이님이 회원님의 5번 포스트를 좋아합니다.','캉순이',1,1),(47,'2025-02-11 22:35:33','캉순이님이 회원님의 4번 포스트를 좋아합니다.','캉순이',1,1),(48,'2025-02-11 22:35:52','캉순이님이 회원님의 6번 포스트를 좋아합니다.','캉순이',1,1),(49,'2025-02-12 10:11:15','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',0,34),(50,'2025-02-13 10:48:16','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(51,'2025-02-13 10:49:06','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,38),(52,'2025-02-13 10:51:00','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',1,38),(53,'2025-02-13 10:51:13','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(54,'2025-02-13 10:51:36','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(55,'2025-02-13 10:52:21','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(56,'2025-02-13 10:53:08','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(57,'2025-02-13 10:54:39','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(58,'2025-02-13 10:55:02','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(59,'2025-02-13 10:55:06','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(60,'2025-02-13 11:02:30','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(61,'2025-02-13 11:02:45','레이님이 회원님에게 라이크를 보냈습니다.','레이',1,1),(62,'2025-02-13 14:50:07','캉캉이님이 회원님의 8번 포스트를 좋아합니다.','캉캉이',1,1),(63,'2025-02-13 16:56:38','캉캉이님이 회원님의 8번 포스트를 좋아합니다.','캉캉이',1,1),(64,'2025-02-13 16:56:44','캉캉이님이 회원님의 8번 포스트를 좋아합니다.','캉캉이',1,1),(65,'2025-02-13 16:57:01','캉캉이님이 회원님의 7번 포스트를 좋아합니다.','캉캉이',1,1),(66,'2025-02-13 17:31:10','캉캉이님이 회원님에게 라이크를 보냈습니다.','캉캉이',0,38);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (3,'첫번째 게시물','2025-02-10 14:20:14',1),(4,'두번째 게시물','2025-02-10 14:22:26',1),(5,'세번째 게시물','2025-02-10 14:22:26',1),(6,'네번째 게시물','2025-02-10 14:22:26',1),(7,'다섯번째 게시물','2025-02-13 13:10:47',1),(8,'여섯번째 게시물','2025-02-13 14:42:24',1),(9,'일곱번째 게시물','2025-02-17 08:38:00',1),(10,'여덟번째 게시물','2025-02-20 08:49:28',1);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_hashtag`
--

LOCK TABLES `post_hashtag` WRITE;
/*!40000 ALTER TABLE `post_hashtag` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_mention`
--

LOCK TABLES `post_mention` WRITE;
/*!40000 ALTER TABLE `post_mention` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('a'),('liz@ive.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-20  9:16:27
