CREATE TABLE `sessions` (
	`id` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	`user_agent` text NOT NULL,
	`ip` varchar(255) NOT NULL,
	`expire_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_ip_unique` UNIQUE(`ip`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `role` enum('applicant','employer') DEFAULT 'applicant' NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;