import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq, desc } from "drizzle-orm";
import {
  users, feedItems, balanceGames, reviewDetails,
  type User, type InsertUser, type FeedItemRow, type InsertFeedItem,
  type BalanceGameRow, type ReviewDetailRow,
} from "@shared/schema";
import fs from "fs";
import path from "path";

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(path.join(dataDir, "lina.db"));
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS feed_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    cat TEXT NOT NULL,
    tags TEXT NOT NULL,
    title TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    author TEXT NOT NULL,
    badge TEXT NOT NULL,
    star INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    date TEXT NOT NULL,
    prod_name TEXT,
    status TEXT NOT NULL DEFAULT 'live',
    user_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS balance_games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag TEXT NOT NULL,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    option_a_label TEXT NOT NULL,
    option_a_sub TEXT,
    option_b_label TEXT NOT NULL,
    option_b_sub TEXT,
    result_a_label TEXT NOT NULL,
    result_a_pct INTEGER NOT NULL,
    result_b_label TEXT NOT NULL,
    result_b_pct INTEGER NOT NULL,
    participants TEXT NOT NULL,
    comment_placeholder TEXT NOT NULL,
    comments_json TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS review_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feed_item_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    emotion_label TEXT NOT NULL,
    help_points TEXT NOT NULL,
    body_text TEXT NOT NULL,
    hospital_toggle INTEGER NOT NULL DEFAULT 0,
    hospital_name TEXT,
    hospital_rating INTEGER,
    hospital_tags TEXT,
    hospital_comment TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllFeedItems(): Promise<FeedItemRow[]>;
  getFeedItem(id: number): Promise<FeedItemRow | undefined>;
  createFeedItem(item: InsertFeedItem): Promise<FeedItemRow>;
  likeFeedItem(id: number): Promise<void>;
  getAllBalanceGames(): Promise<BalanceGameRow[]>;
  getBalanceGame(id: number): Promise<BalanceGameRow | undefined>;
  getReviewDetail(feedItemId: number): Promise<ReviewDetailRow | undefined>;
}

export class SqliteStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = db.select().from(users).where(eq(users.id, id)).all();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = db.select().from(users).where(eq(users.username, username)).all();
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = db.insert(users).values(insertUser).returning().all();
    return user;
  }

  async getAllFeedItems(): Promise<FeedItemRow[]> {
    return db.select().from(feedItems).orderBy(desc(feedItems.id)).all();
  }

  async getFeedItem(id: number): Promise<FeedItemRow | undefined> {
    const [item] = db.select().from(feedItems).where(eq(feedItems.id, id)).all();
    return item;
  }

  async createFeedItem(item: InsertFeedItem): Promise<FeedItemRow> {
    const [created] = db.insert(feedItems).values(item).returning().all();
    return created;
  }

  async likeFeedItem(id: number): Promise<void> {
    const item = await this.getFeedItem(id);
    if (item) {
      db.update(feedItems)
        .set({ likes: item.likes + 1 })
        .where(eq(feedItems.id, id))
        .run();
    }
  }

  async getAllBalanceGames(): Promise<BalanceGameRow[]> {
    return db.select().from(balanceGames).orderBy(balanceGames.id).all();
  }

  async getBalanceGame(id: number): Promise<BalanceGameRow | undefined> {
    const [game] = db.select().from(balanceGames).where(eq(balanceGames.id, id)).all();
    return game;
  }

  async getReviewDetail(feedItemId: number): Promise<ReviewDetailRow | undefined> {
    const [detail] = db.select().from(reviewDetails).where(eq(reviewDetails.feedItemId, feedItemId)).all();
    return detail;
  }
}

export const storage = new SqliteStorage();
