import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Feed Items (보상후기, 상품리뷰, 라운지)
export const feedItems = sqliteTable("feed_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // "claim" | "product" | "lounge"
  cat: text("cat").notNull(),
  tags: text("tags").notNull(), // JSON array string
  title: text("title").notNull(),
  desc: text("desc").notNull(),
  author: text("author").notNull(),
  badge: text("badge").notNull(),
  star: integer("star").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  date: text("date").notNull(),
  prodName: text("prod_name"),
  status: text("status").notNull().default("live"), // "pending" | "live" | "reject" | "deleted"
  userId: integer("user_id"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertFeedItemSchema = createInsertSchema(feedItems).omit({
  id: true,
  createdAt: true,
});

export type InsertFeedItem = z.infer<typeof insertFeedItemSchema>;
export type FeedItemRow = typeof feedItems.$inferSelect;

// Balance Games
export const balanceGames = sqliteTable("balance_games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tag: text("tag").notNull(),
  title: text("title").notNull(),
  image: text("image").notNull(),
  optionALabel: text("option_a_label").notNull(),
  optionASub: text("option_a_sub"),
  optionBLabel: text("option_b_label").notNull(),
  optionBSub: text("option_b_sub"),
  resultALabel: text("result_a_label").notNull(),
  resultAPct: integer("result_a_pct").notNull(),
  resultBLabel: text("result_b_label").notNull(),
  resultBPct: integer("result_b_pct").notNull(),
  participants: text("participants").notNull(),
  commentPlaceholder: text("comment_placeholder").notNull(),
  commentsJson: text("comments_json").notNull().default("[]"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type BalanceGameRow = typeof balanceGames.$inferSelect;

// Review Details (에디터에서 작성된 상세 정보)
export const reviewDetails = sqliteTable("review_details", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  feedItemId: integer("feed_item_id").notNull(),
  rating: integer("rating").notNull(),
  emotionLabel: text("emotion_label").notNull(),
  helpPoints: text("help_points").notNull(), // JSON array string
  bodyText: text("body_text").notNull(),
  hospitalToggle: integer("hospital_toggle").notNull().default(0),
  hospitalName: text("hospital_name"),
  hospitalRating: integer("hospital_rating"),
  hospitalTags: text("hospital_tags"),
  hospitalComment: text("hospital_comment"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type ReviewDetailRow = typeof reviewDetails.$inferSelect;
