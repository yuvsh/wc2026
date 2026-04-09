"use client";

import { useEffect, useState } from "react";

interface CountdownResult {
  display: string;
  isUnderOneHour: boolean;
  isLocked: boolean;
}

const LOCK_BEFORE_KICKOFF_MS = 5 * 60 * 1000; // 5 minutes

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}ד ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function useCountdown(kickoffAt: Date): CountdownResult {
  const [remaining, setRemaining] = useState<number>(() => {
    return kickoffAt.getTime() - LOCK_BEFORE_KICKOFF_MS - Date.now();
  });

  useEffect(() => {
    const tick = (): void => {
      setRemaining(kickoffAt.getTime() - LOCK_BEFORE_KICKOFF_MS - Date.now());
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [kickoffAt]);

  if (remaining <= 0) {
    return { display: "נעול", isUnderOneHour: true, isLocked: true };
  }

  return {
    display: formatCountdown(remaining),
    isUnderOneHour: remaining < 60 * 60 * 1000,
    isLocked: false,
  };
}
