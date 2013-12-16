CREATE DATABASE `leadman` /*!40100 DEFAULT CHARACTER SET latin1 */;

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `provider` varchar(20) NOT NULL,
  `provider_id` varchar(45) DEFAULT NULL,
  `displayName` varchar(128) DEFAULT NULL,
  `familyName` varchar(45) DEFAULT NULL,
  `middleName` varchar(45) DEFAULT NULL,
  `givenName` varchar(45) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;


CREATE TABLE `usercredentials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `passwordhash` varchar(128) DEFAULT NULL,
  `passwordsalt` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_usercredential_user_idx` (`user_id`),
  CONSTRAINT `fk_usercredential_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

CREATE TABLE `splits` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`user_id` int(11) DEFAULT NULL,
	`session_id` int(11) DEFAULT NULL,
	`name` varchar(128) DEFAULT NULL,
	`startDate` datetime NOT NULL,
	`activeTime` decimal(10,2) NULL,
	`distanceTotal` decimal(10, 10) NULL,
	`activityType` varchar(10) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	PRIMARY KEY (`id`),
	KEY `fk_split_user_idx` (`user_id`),
    CONSTRAINT `fk_split_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
	KEY `fk_split_session_idx` (`session_id`),
  CONSTRAINT `fk_split_session` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;