import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { seedDatabase } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed database with initial data on startup
  seedDatabase();

  // --- Feed Items API ---

  // Get feed items - supports pagination when page param is provided
  app.get("/api/feed", async (req, res) => {
    const status = (req.query.status as string) || "live";
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = parseInt((req.query.limit as string) || "20");

    if (page) {
      // Paginated response
      const { items, total } = await storage.getPaginatedFeedItems({
        page, limit, status: status === "all" ? undefined : status,
      });
      const parsed = items.map((item) => ({ ...item, tags: JSON.parse(item.tags) }));
      res.json({ items: parsed, total, page, hasMore: page * limit < total });
    } else {
      // Legacy: return all items as flat array
      const items = await storage.getAllFeedItems(status === "all" ? undefined : { status });
      const parsed = items.map((item) => ({ ...item, tags: JSON.parse(item.tags) }));
      res.json(parsed);
    }
  });

  // Get single feed item
  app.get("/api/feed/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.getFeedItem(id);
    if (!item) {
      return res.status(404).json({ message: "Feed item not found" });
    }
    res.json({ ...item, tags: JSON.parse(item.tags) });
  });

  // Create a new feed item (submit review)
  app.post("/api/feed", async (req, res) => {
    const { type, cat, tags, title, desc, author, badge, star, prodName } = req.body;
    const item = await storage.createFeedItem({
      type,
      cat,
      tags: JSON.stringify(tags || []),
      title,
      desc,
      author: author || "익명",
      badge: badge || "신규",
      star: star || 0,
      likes: 0,
      comments: 0,
      date: "방금 전",
      prodName: prodName || null,
      status: "pending",
      userId: null,
    });
    res.status(201).json({ ...item, tags: JSON.parse(item.tags) });
  });

  // Delete a feed item (soft delete)
  app.delete("/api/feed/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteFeedItem(id);
    res.json({ success: true });
  });

  // User stats
  app.get("/api/user/stats", async (_req, res) => {
    const stats = await storage.getUserStats();
    res.json(stats);
  });

  // Feed comments
  app.get("/api/feed/:id/comments", async (req, res) => {
    const feedItemId = parseInt(req.params.id);
    const comments = await storage.getFeedComments(feedItemId);
    res.json(comments);
  });

  app.post("/api/feed/:id/comments", async (req, res) => {
    const feedItemId = parseInt(req.params.id);
    const { author, text } = req.body;
    const comment = await storage.addFeedComment(feedItemId, { author: author || "익명", text });
    res.status(201).json(comment);
  });

  // Like a feed item
  app.post("/api/feed/:id/like", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.likeFeedItem(id);
    const item = await storage.getFeedItem(id);
    if (!item) {
      return res.status(404).json({ message: "Feed item not found" });
    }
    res.json({ likes: item.likes });
  });

  // --- Balance Games API ---

  // Get all balance games
  app.get("/api/balance-games", async (_req, res) => {
    const games = await storage.getAllBalanceGames();
    // Transform to client-friendly format
    const parsed = games.map((g) => ({
      id: g.id,
      tag: g.tag,
      title: g.title,
      image: g.image,
      optionA: { label: g.optionALabel, sub: g.optionASub },
      optionB: { label: g.optionBLabel, sub: g.optionBSub },
      resultA: { label: g.resultALabel, pct: g.resultAPct },
      resultB: { label: g.resultBLabel, pct: g.resultBPct },
      participants: g.participants,
      commentPlaceholder: g.commentPlaceholder,
      comments: JSON.parse(g.commentsJson),
    }));
    res.json(parsed);
  });

  // Get single balance game
  app.get("/api/balance-games/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const game = await storage.getBalanceGame(id);
    if (!game) {
      return res.status(404).json({ message: "Balance game not found" });
    }
    res.json({
      id: game.id,
      tag: game.tag,
      title: game.title,
      image: game.image,
      optionA: { label: game.optionALabel, sub: game.optionASub },
      optionB: { label: game.optionBLabel, sub: game.optionBSub },
      resultA: { label: game.resultALabel, pct: game.resultAPct },
      resultB: { label: game.resultBLabel, pct: game.resultBPct },
      participants: game.participants,
      commentPlaceholder: game.commentPlaceholder,
      comments: JSON.parse(game.commentsJson),
    });
  });

  // Vote on a balance game
  app.post("/api/balance-games/:id/vote", async (req, res) => {
    const gameId = parseInt(req.params.id);
    const { choice } = req.body;
    if (!choice || !["A", "B"].includes(choice)) {
      return res.status(400).json({ message: "choice must be A or B" });
    }
    await storage.addBalanceGameVote(gameId, choice);
    const counts = await storage.getBalanceGameVoteCounts(gameId);
    const total = counts.a + counts.b;
    const pctA = total > 0 ? Math.round((counts.a / total) * 100) : 50;
    const pctB = 100 - pctA;
    res.json({ resultA: { pct: pctA }, resultB: { pct: pctB }, total });
  });

  // Get comments for a balance game
  app.get("/api/balance-games/:id/comments", async (req, res) => {
    const gameId = parseInt(req.params.id);
    const comments = await storage.getBalanceGameComments(gameId);
    res.json(comments);
  });

  // Add comment to a balance game
  app.post("/api/balance-games/:id/comments", async (req, res) => {
    const gameId = parseInt(req.params.id);
    const { name, type, text } = req.body;
    const comment = await storage.addBalanceGameComment(gameId, { name, type, text });
    res.status(201).json(comment);
  });

  // --- Admin API ---

  app.get("/api/admin/feed/stats", async (_req, res) => {
    const stats = await storage.getFeedStats();
    res.json(stats);
  });

  app.get("/api/admin/feed", async (req, res) => {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "20");
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined;

    const { items, total } = await storage.getAdminFeedItems({
      page, limit,
      status: status || undefined,
      type: type || undefined,
    });
    const parsed = items.map((item) => ({ ...item, tags: JSON.parse(item.tags) }));
    res.json({ items: parsed, total, page, hasMore: page * limit < total });
  });

  app.patch("/api/admin/feed/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, desc } = req.body;
    const updated = await storage.updateFeedItem(id, { title, desc });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ ...updated, tags: JSON.parse(updated.tags) });
  });

  app.patch("/api/admin/feed/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!["pending", "live", "reject"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await storage.updateFeedItemStatus(id, status);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ ...updated, tags: JSON.parse(updated.tags) });
  });

  // --- Chips Config (static) ---
  app.get("/api/chips-config", (_req, res) => {
    res.json({
      recommend: [
        { id: "all", label: "BEST" },
        { id: "cost", label: "병원비_0원" },
        { id: "dental", label: "치아보험" },
        { id: "cancer", label: "암보험" },
        { id: "worry", label: "#고민상담" },
      ],
      claim: [
        { id: "all", label: "전체" },
        { id: "dental", label: "치아" },
        { id: "cancer", label: "암/중대질병" },
        { id: "brain", label: "뇌/심장" },
        { id: "dementia", label: "치매/간병" },
      ],
      product: [
        { id: "all", label: "전체" },
        { id: "dental", label: "치아보험" },
        { id: "cancer", label: "암보험" },
        { id: "dementia", label: "치매/간병" },
      ],
      lounge: [
        { id: "all", label: "전체" },
        { id: "balance", label: "밸런스게임" },
        { id: "worry", label: "고민상담" },
        { id: "tips", label: "생활지혜" },
      ],
    });
  });

  return httpServer;
}
