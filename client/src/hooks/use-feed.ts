import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { FeedItem } from "@/lib/feedData";

interface PaginatedFeedResponse {
  items: FeedItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

export function useFeedItems() {
  return useQuery<FeedItem[]>({
    queryKey: ["/api/feed"],
  });
}

export function useFeedItemsInfinite(limit = 20) {
  return useInfiniteQuery<PaginatedFeedResponse>({
    queryKey: ["/api/feed", "paginated"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/feed?page=${pageParam}&limit=${limit}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch feed");
      return res.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}

export function useFeedItem(id: number | null) {
  return useQuery<FeedItem>({
    queryKey: ["/api/feed", String(id)],
    enabled: id !== null,
  });
}

export function useLikeFeedItem() {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/feed/${id}/like`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
    },
  });
}

export function useCreateFeedItem() {
  return useMutation({
    mutationFn: async (data: Partial<FeedItem>) => {
      const res = await apiRequest("POST", "/api/feed", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
    },
  });
}

export function useDeleteFeedItem() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/feed/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
  });
}
