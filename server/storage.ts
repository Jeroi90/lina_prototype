import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq, desc, and, sql, count } from "drizzle-orm";
import {
  users, feedItems, balanceGames, reviewDetails, balanceGameVotes, balanceGameComments,
  type User, type InsertUser, type FeedItemRow, type InsertFeedItem,
  type BalanceGameRow, type ReviewDetailRow, type BalanceGameCommentRow,
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

  CREATE TABLE IF NOT EXISTS balance_game_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    choice TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS balance_game_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    text TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
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
  getAllFeedItems(filter?: { status?: string }): Promise<FeedItemRow[]>;
  getFeedItem(id: number): Promise<FeedItemRow | undefined>;
  createFeedItem(item: InsertFeedItem): Promise<FeedItemRow>;
  likeFeedItem(id: number): Promise<void>;
  getAllBalanceGames(): Promise<BalanceGameRow[]>;
  getBalanceGame(id: number): Promise<BalanceGameRow | undefined>;
  getReviewDetail(feedItemId: number): Promise<ReviewDetailRow | undefined>;
  getPaginatedFeedItems(options: { page: number; limit: number; status?: string }): Promise<{ items: FeedItemRow[]; total: number }>;
  addBalanceGameVote(gameId: number, choice: string): Promise<void>;
  getBalanceGameVoteCounts(gameId: number): Promise<{ a: number; b: number }>;
  addBalanceGameComment(gameId: number, data: { name: string; type: string; text: string }): Promise<BalanceGameCommentRow>;
  getBalanceGameComments(gameId: number): Promise<BalanceGameCommentRow[]>;
  deleteFeedItem(id: number): Promise<void>;
  getUserStats(): Promise<{ posts: number; likes: number; pending: number }>;
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

  async getAllFeedItems(filter?: { status?: string }): Promise<FeedItemRow[]> {
    if (filter?.status) {
      return db.select().from(feedItems).where(eq(feedItems.status, filter.status)).orderBy(desc(feedItems.id)).all();
    }
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

  async getPaginatedFeedItems(options: { page: number; limit: number; status?: string }): Promise<{ items: FeedItemRow[]; total: number }> {
    const { page, limit, status } = options;
    const offset = (page - 1) * limit;
    const condition = status ? eq(feedItems.status, status) : undefined;

    const [totalResult] = condition
      ? db.select({ count: count() }).from(feedItems).where(condition).all()
      : db.select({ count: count() }).from(feedItems).all();
    const total = totalResult?.count || 0;

    const items = condition
      ? db.select().from(feedItems).where(condition).orderBy(desc(feedItems.id)).limit(limit).offset(offset).all()
      : db.select().from(feedItems).orderBy(desc(feedItems.id)).limit(limit).offset(offset).all();

    return { items, total };
  }

  async addBalanceGameVote(gameId: number, choice: string): Promise<void> {
    db.insert(balanceGameVotes).values({ gameId, choice }).run();
  }

  async getBalanceGameVoteCounts(gameId: number): Promise<{ a: number; b: number }> {
    const votes = db.select().from(balanceGameVotes).where(eq(balanceGameVotes.gameId, gameId)).all();
    return {
      a: votes.filter((v) => v.choice === "A").length,
      b: votes.filter((v) => v.choice === "B").length,
    };
  }

  async addBalanceGameComment(gameId: number, data: { name: string; type: string; text: string }): Promise<BalanceGameCommentRow> {
    const [comment] = db.insert(balanceGameComments).values({ gameId, ...data }).returning().all();
    return comment;
  }

  async getBalanceGameComments(gameId: number): Promise<BalanceGameCommentRow[]> {
    return db.select().from(balanceGameComments).where(eq(balanceGameComments.gameId, gameId)).orderBy(desc(balanceGameComments.id)).all();
  }

  async deleteFeedItem(id: number): Promise<void> {
    db.update(feedItems).set({ status: "deleted" }).where(eq(feedItems.id, id)).run();
  }

  async getUserStats(): Promise<{ posts: number; likes: number; pending: number }> {
    const allItems = db.select().from(feedItems).where(eq(feedItems.status, "live")).all();
    const pendingItems = db.select().from(feedItems).where(eq(feedItems.status, "pending")).all();
    const totalLikes = allItems.reduce((sum, item) => sum + item.likes, 0);
    return { posts: allItems.length, likes: totalLikes, pending: pendingItems.length };
  }
}

export const storage = new SqliteStorage();
