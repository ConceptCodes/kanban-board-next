DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('todo', 'in-progress', 'done');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kanban_boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kanban_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"status" "status",
	"board_id" integer NOT NULL,
	CONSTRAINT "kanban_tasks_board_id_unique" UNIQUE("board_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "kanban_tasks" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kanban_tasks" ADD CONSTRAINT "kanban_tasks_board_id_kanban_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "kanban_boards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
