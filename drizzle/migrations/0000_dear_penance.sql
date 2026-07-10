CREATE TABLE `progress` (
	`user_id` integer NOT NULL,
	`title_id` integer NOT NULL,
	`watched` integer DEFAULT false NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `title_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`title_id`) REFERENCES `titles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `titles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`year` integer NOT NULL,
	`saga` text NOT NULL,
	`phase` text,
	`subgroup` text,
	`blurb` text DEFAULT '' NOT NULL,
	`sort_order` integer NOT NULL,
	`essential_doomsday` integer DEFAULT false NOT NULL,
	`essential_brand_new_day` integer DEFAULT false NOT NULL,
	`essential_deadpool_wolverine` integer DEFAULT false NOT NULL,
	`badge_reason` text,
	`episode_note` text,
	`is_released` integer DEFAULT true NOT NULL,
	`is_optional` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` text NOT NULL,
	`last_active_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);