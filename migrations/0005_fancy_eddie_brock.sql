ALTER TABLE "folders" ALTER COLUMN "emoji" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "is_private" boolean NOT NULL;