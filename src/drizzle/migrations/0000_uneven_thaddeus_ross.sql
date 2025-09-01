CREATE TABLE
	"profiles" (
		"id" uuid PRIMARY KEY NOT NULL,
		"username" text,
		"avatar_url" text,
		"created_at" timestamp
		with
			time zone DEFAULT now () NOT NULL,
			"updated_at" timestamp
		with
			time zone DEFAULT now () NOT NULL,
			CONSTRAINT "profiles_username_unique" UNIQUE ("username")
	);