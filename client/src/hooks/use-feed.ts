import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { FeedItem } from "@/lib/feedData";

export function useFeedItems() {
  return useQuery<FeedItem[]>({
    queryKey: ["/api/feed"],
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
