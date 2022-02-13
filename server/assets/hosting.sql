CREATE TABLE `hosting.users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `username` longtext DEFAULT NULL,
  `password` longtext DEFAULT NULL,
  `address` longtext DEFAULT NULL,
  `status` bigint(20) DEFAULT 0,
  `admin` tinyint(1) DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_users_deleted_at` (`deleted_at`)
)
