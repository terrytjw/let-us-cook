ALTER TABLE "items" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "full_name" TO "fullName";--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
