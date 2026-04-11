export type FilterType = "all" | "bingo" | "correct" | "miss";

export interface HistoryStats {
  totalMatches: number;
  totalPoints: number;
  bingoCount: number;
  correctCount: number;
  missCount: number;
}

interface ScoredEntry {
  points_awarded: number;
}

export function computeHistoryStats(entries: ScoredEntry[]): HistoryStats {
  return {
    totalMatches: entries.length,
    totalPoints: entries.reduce((sum, e) => sum + e.points_awarded, 0),
    bingoCount: entries.filter((e) => e.points_awarded === 3).length,
    correctCount: entries.filter((e) => e.points_awarded === 1).length,
    missCount: entries.filter((e) => e.points_awarded === 0).length,
  };
}

export function filterByResult<T extends ScoredEntry>(
  entries: T[],
  filter: FilterType
): T[] {
  if (filter === "bingo") return entries.filter((e) => e.points_awarded === 3);
  if (filter === "correct") return entries.filter((e) => e.points_awarded === 1);
  if (filter === "miss") return entries.filter((e) => e.points_awarded === 0);
  return entries; // "all"
}
