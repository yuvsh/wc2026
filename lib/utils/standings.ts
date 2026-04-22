import type { GroupStandingRow } from "@/lib/types/tournament";

interface GroupData {
  name: string;
  rows: GroupStandingRow[];
}

export function buildGroups(rows: GroupStandingRow[]): GroupData[] {
  const map = new Map<string, GroupStandingRow[]>();
  for (const row of rows) {
    if (!map.has(row.group_name)) map.set(row.group_name, []);
    map.get(row.group_name)!.push(row);
  }
  return Array.from(map.keys())
    .sort()
    .map((name) => ({ name, rows: map.get(name) ?? [] }));
}
