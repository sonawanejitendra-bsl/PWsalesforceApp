import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export interface HealingEvent {
  at: string;
  intentId: string;
  mode: string;
  found: boolean;
  applied: boolean;
  missed?: string;
  suggestions: { score: number; reason: string; match?: string }[];
}

const events: HealingEvent[] = [];

function eventsFile(): string {
  return path.resolve(process.cwd(), "test-results", "healing-events.jsonl");
}

export function recordHealing(event: Omit<HealingEvent, "at">): HealingEvent {
  const full: HealingEvent = { at: new Date().toISOString(), ...event };
  events.push(full);
  const file = eventsFile();
  mkdirSync(path.dirname(file), { recursive: true });
  appendFileSync(file, `${JSON.stringify(full)}\n`, "utf8");
  return full;
}

export function getHealingEvents(): HealingEvent[] {
  const merged = [...events];
  try {
    const fromDisk = readFileSync(eventsFile(), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as HealingEvent);
    const keys = new Set(merged.map((item) => `${item.at}|${item.intentId}|${item.applied}`));
    for (const item of fromDisk) {
      const key = `${item.at}|${item.intentId}|${item.applied}`;
      if (!keys.has(key)) merged.push(item);
    }
  } catch {
    /* first run has no file */
  }
  return merged;
}

export function clearHealingEventFile(): void {
  const file = eventsFile();
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, "", "utf8");
  events.length = 0;
}
