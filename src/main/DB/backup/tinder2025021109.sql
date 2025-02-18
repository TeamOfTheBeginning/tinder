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
  `createdat` datetime(6) DEFAULT NULL,
  `sender` varchar(255) DEFAULT NULL,
  `chat_group_id` int DEFAULT NULL,
  PRIMARY KEY (`chat_id`),
  KEY `FKflvnhwlrugquroe7jaxeirvr3` (`chat_group_id`),
  CONSTRAINT `FKflvnhwlrugquroe7jaxeirvr3` FOREIGN KEY (`chat_group_id`) REFERENCES `chat_group` (`chat_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
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
  `createdby` varchar(255) DEFAULT NULL,
  `member_count` int DEFAULT NULL,
  PRIMARY KEY (`chat_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group`
--

LOCK TABLES `chat_group` WRITE;
/*!40000 ALTER TABLE `chat_group` DISABLE KEYS */;
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
  `nickname` varchar(255) DEFAULT NULL,
  `chat_group_id` int DEFAULT NULL,
  PRIMARY KEY (`chat_group_member_id`),
  KEY `FKlutmrmg8vj22cspv6n4m2w36s` (`chat_group_id`),
  CONSTRAINT `FKlutmrmg8vj22cspv6n4m2w36s` FOREIGN KEY (`chat_group_id`) REFERENCES `chat_group` (`chat_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group_member`
--

LOCK TABLES `chat_group_member` WRITE;
/*!40000 ALTER TABLE `chat_group_member` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_group_member` ENABLE KEYS */;
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
  PRIMARY KEY (`follow_id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,'KakaoTalk_20250117_1915009131737165055774.jpg',3),(2,'KakaoTalk_20250117_1915009131737165055774.jpg',4),(3,'KakaoTalk_20250117_1915009131737165055774.jpg',5),(4,'KakaoTalk_20250117_1915009131737165055774.jpg',6);
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `likes_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  PRIMARY KEY (`likes_id`),
  KEY `FKa4vkf1skcfu5r6o5gfb5jf295` (`member_id`),
  KEY `FKowd6f4s7x9f3w50pvlo6x3b41` (`post_id`),
  CONSTRAINT `FKa4vkf1skcfu5r6o5gfb5jf295` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `FKowd6f4s7x9f3w50pvlo6x3b41` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
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
  PRIMARY KEY (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,NULL,'a',34,1,'캉캉이최고',NULL,NULL,NULL,NULL,'a',NULL,NULL),(2,'Chicago','johnny@nct.com',28,0,'쟈니','010-1111-1111','쟈니.jpg','NCT 127',NULL,'a',NULL,'12345'),(3,'Seoul','taeyong@nct.com',29,0,'태용','010-2222-2222','태용.jpg','Leader of NCT',NULL,'a',NULL,'23456'),(4,'Osaka','yuta@nct.com',28,0,'유타','010-3333-3333','유타.jpg','Osaka Prince',NULL,'a',NULL,'34567'),(5,'Beijing','kun@nct.com',28,0,'쿤','010-4444-4444','쿤.jpg','WayV Leader',NULL,'a',NULL,'45678'),(6,'Seoul','doyoung@nct.com',28,0,'도영','010-5555-5555','도영.jpg','Main Vocal',NULL,'a',NULL,'56789'),(7,'Bangkok','ten@nct.com',28,0,'텐','010-6666-6666','텐.png','Dancer & Vocal',NULL,'a',NULL,'67890'),(8,'Seoul','jaehyun@nct.com',27,0,'재현','010-7777-7777','재현.jpg','NCT 127',NULL,'a',NULL,'78901'),(9,'Wenzhou','winwin@nct.com',26,0,'윈윈','010-8888-8888','윈윈.jpg','WayV',NULL,'a',NULL,'89012'),(10,'Seoul','jungwoo@nct.com',26,0,'정우','010-9999-9999','정우.jpg','NCT 127',NULL,'a',NULL,'90123'),(11,'Vancouver','mark@nct.com',25,0,'마크','010-1010-1010','마크.jpg','Rapper & Vocal',NULL,'a',NULL,'01234'),(12,'Guangdong','xiaojun@nct.com',25,0,'샤오쥔','010-1212-1212','샤오쥔.jpg','WayV',NULL,'a',NULL,'11223'),(13,'Macau','hendery@nct.com',24,0,'헨드리','010-1313-1313','헨드리.jpg','WayV',NULL,'a',NULL,'22334'),(14,'Jilin','renjun@nct.com',24,0,'런쥔','010-1414-1414','런쥔.jpg','NCT Dream',NULL,'a',NULL,'33445'),(15,'Seoul','jeno@nct.com',24,0,'제노','010-1515-1515','제노.jpg','NCT Dream',NULL,'a',NULL,'44556'),(16,'Seoul','haechan@nct.com',24,0,'해찬','010-1616-1616','해찬.jpg','NCT 127 & Dream',NULL,'a',NULL,'55667'),(17,'Seoul','jaemin@nct.com',24,0,'재민','010-1717-1717','재민.jpg','NCT Dream',NULL,'a',NULL,'66778'),(18,'Taipei','yangyang@nct.com',23,0,'양양','010-1818-1818','양양.png','WayV',NULL,'a',NULL,'77889'),(19,'Shanghai','chenle@nct.com',23,0,'천러','010-1919-1919','천러.png','NCT Dream',NULL,'a',NULL,'88990'),(20,'Seoul','jisung@nct.com',22,0,'지성','010-2020-2020','지성.png','Maknae',NULL,'a',NULL,'99001'),(21,'Seoul','sion@nct.com',20,0,'시온','010-2121-2121','시온.png','New Member',NULL,'a',NULL,'11112'),(22,'Tokyo','riku@nct.com',21,0,'리쿠','010-2222-2323','리쿠.jpg','New Member',NULL,'a',NULL,'12123'),(23,'Osaka','yuushi@nct.com',20,0,'유우시','010-2323-2424','유우시.jpg','New Member',NULL,'a',NULL,'13134'),(24,'Seoul','jaehee@nct.com',21,0,'재희','010-2424-2525','재희.jpg','New Member',NULL,'a',NULL,'14145'),(25,'Fukuoka','ryo@nct.com',20,0,'료','010-2525-2626','료.jpg','New Member',NULL,'a',NULL,'15156'),(26,'Nagoya','sakuya@nct.com',20,0,'사쿠야','010-2626-2727','사쿠야.jpg','New Member',NULL,'a',NULL,'16167'),(27,'Seoul','karina@aespa.com',24,1,'카리나','010-1111-2222','카리나.jpg','Leader & Main Dancer',NULL,'a',NULL,'11111'),(28,'Tokyo','giselle@aespa.com',23,1,'지젤','010-2222-3333','지젤.jpg','Main Rapper',NULL,'a',NULL,'22222'),(29,'Busan','winter@aespa.com',23,1,'윈터','010-3333-4444','윈터.jpg','Lead Vocal & Dancer',NULL,'a',NULL,'33333'),(30,'Harbin','ningning@aespa.com',22,1,'닝닝','010-4444-5555','닝닝.jpg','Main Vocal',NULL,'a',NULL,'44444'),(31,'Seoul','minji@newjeans.com',20,1,'민지','010-5555-6666','민지.jpg','Leader & Vocal',NULL,'a',NULL,'55555'),(32,'Melbourne','hanni@newjeans.com',20,1,'하니','010-6666-7777','하니.jpg','Main Vocal',NULL,'a',NULL,'66666'),(33,'Newcastle','danielle@newjeans.com',19,1,'다니엘','010-7777-8888','다니엘.jpg','Lead Vocal',NULL,'a',NULL,'77777'),(34,'Seoul','haerin@newjeans.com',18,1,'해린','010-8888-9999','해린.jpg','Vocal & Dancer',NULL,'a',NULL,'88888'),(35,'Incheon','hyein@newjeans.com',17,1,'혜인','010-9999-0000','혜인.jpg','Maknae & Vocal',NULL,'a',NULL,'99999'),(36,'Daejeon','yujin@ive.com',22,1,'안유진','010-1111-2222','안유진.jpg','Leader & Vocal',NULL,'a',NULL,'11111'),(37,'Incheon','gaeul@ive.com',21,1,'가을','010-2222-3333','가을.jpg','Main Rapper & Dancer',NULL,'a',NULL,'22222'),(38,'Nagoya','rei@ive.com',20,1,'레이','010-3333-4444','레이.jpg','Rapper & Vocal',NULL,'a',NULL,'33333'),(39,'Seoul','wonyoung@ive.com',20,1,'장원영','010-4444-5555','장원영.jpg','Lead Vocal & Visual',NULL,'a',NULL,'44444'),(40,'Jeju','liz@ive.com',20,1,'리즈','010-5555-6666','리즈.jpg','Main Vocal',NULL,'a',NULL,'55555'),(41,'Seoul','leeseo@ive.com',18,1,'이서','010-6666-7777','이서.jpg','Maknae & Vocal',NULL,'a',NULL,'66666');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_likes`
--

LOCK TABLES `member_likes` WRITE;
/*!40000 ALTER TABLE `member_likes` DISABLE KEYS */;
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
  `indate` datetime(6) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `messagefrom` varchar(255) DEFAULT NULL,
  `read_on_not` bit(1) DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `FK1xep8o2ge7if6diclyyx53v4q` (`member_id`),
  CONSTRAINT `FK1xep8o2ge7if6diclyyx53v4q` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (3,'첫번째 게시물','2025-02-10 14:20:14',1),(4,'두번째 게시물','2025-02-10 14:22:26',1),(5,'세번째 게시물','2025-02-10 14:22:26',1),(6,'네번째 게시물','2025-02-10 14:22:26',1);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_likes`
--

LOCK TABLES `post_likes` WRITE;
/*!40000 ALTER TABLE `post_likes` DISABLE KEYS */;
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
-- Table structure for table `reply`
--

DROP TABLE IF EXISTS `reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reply` (
  `reply_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `writedate` datetime(6) DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  PRIMARY KEY (`reply_id`),
  KEY `FKen6vrmi5oth4bg6ybfc202fmu` (`member_id`),
  KEY `FKnpyg5e6pqr2v1y4y6pacte11q` (`post_id`),
  CONSTRAINT `FKen6vrmi5oth4bg6ybfc202fmu` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `FKnpyg5e6pqr2v1y4y6pacte11q` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reply`
--

LOCK TABLES `reply` WRITE;
/*!40000 ALTER TABLE `reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `reply` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-11  8:55:01
