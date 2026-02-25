import { useQuery } from "@tanstack/react-query";
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
