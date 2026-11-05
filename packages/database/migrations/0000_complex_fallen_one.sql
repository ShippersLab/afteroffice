CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"handle" varchar(32) NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_handle_unique" ON "accounts" USING btree ("handle");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_token_hash_unique" ON "accounts" USING btree ("token_hash");