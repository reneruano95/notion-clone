import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  workspaceOwnerId: uuid("workspace_owner_id").notNull(),
  title: text("title").notNull(),
  iconId: uuid("icon_id").notNull(),
  data: text("data").notNull(),
  inTrash: text("in_trash").notNull(),
  logo: text("logo").notNull(),
  bannerUrl: text("banner_url").notNull(),
});
