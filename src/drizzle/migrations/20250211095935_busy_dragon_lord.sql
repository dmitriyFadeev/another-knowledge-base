CREATE TABLE "topics" (
	"topic_id" bigserial PRIMARY KEY NOT NULL,
	"topic_title" text NOT NULL,
	"topic_data" text NOT NULL,
	"topic_tags" text[],
	"topic_sign" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" bigserial PRIMARY KEY NOT NULL,
	"user_login" text NOT NULL,
	"user_password" text NOT NULL,
	"user_email" text NOT NULL,
	"user_refresh_token" text,
	CONSTRAINT "users_user_login_unique" UNIQUE("user_login"),
	CONSTRAINT "users_user_email_unique" UNIQUE("user_email")
);
