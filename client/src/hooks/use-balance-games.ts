import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BalanceGame } from "@/lib/balanceGameData";

export function useBalanceGames() {
  return useQuery<BalanceGame[]>({
    queryKey: ["/api/balance-games"],
  });
}

export function useBalanceGame(id: number | null) {
  return useQuery<BalanceGame>({
    queryKey: ["/api/balance-games", String(id)],
    enabled: id !== null,
  });
}

export function useBalanceGameVote() {
  return useMutation({
    mutationFn: async ({ gameId, choice }: { gameId: number; choice: "A" | "B" }) => {
      const res = await apiRequest("POST", `/api/balance-games/${gameId}/vote`, { choice });
      return res.json();
    },
  });
}

export interface BalanceCommentAPI {
  id: number;
  gameId: number;
  name: string;
  type: string;
  text: string;
  likes: number;
  createdAt: string;
}

export function useBalanceGameComments(gameId: number | null) {
  return useQuery<BalanceCommentAPI[]>({
    queryKey: ["/api/balance-games", String(gameId), "comments"],
    enabled: gameId !== null,
  });
}

export function useAddBalanceGameComment() {
  return useMutation({
    mutationFn: async ({ gameId, name, type, text }: { gameId: number; name: string; type: string; text: string }) => {
      const res = await apiRequest("POST", `/api/balance-games/${gameId}/comments`, { name, type, text });
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/balance-games", String(variables.gameId), "comments"] });
    },
  });
}
