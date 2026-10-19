import type { Locator, Page } from "@playwright/test";
import { recordHealing } from "./log.js";

/** What the test meant to click. Scoring uses these fields, not a guessed XPath. */
export interface HealingIntent {
  id: string;
  role?: string;
  name?: string;
  /** data-testid, or a stable class token when the page has no test id. */
  testId?: string;
  label?: string;
}

export interface HealingCandidate {
  locator: Locator;
  score: number;
  reason: string;
  match: string;
}

interface HealingSettings {
  mode: "off" | "report" | "recover";
  minScore: number;
  maxCandidates: number;
  gap: number;
}

const PROBE_MS = 3_000;

function settings(): HealingSettings {
  const mode = process.env.HEALING_MODE ?? "recover";
  const minScore = Number(process.env.HEALING_MIN_SCORE ?? "0.9");
  return {
    mode: mode === "off" || mode === "report" || mode === "recover" ? mode : "recover",
    minScore: Number.isFinite(minScore) ? minScore : 0.9,
    maxCandidates: 5,
    gap: 0.15,
  };
}

function compact(value: string | undefined): string {
  return (value ?? "").toLowerCase().replace(/\s+/g, "");
}

/**
 * Same weights as the core framework:
 * test id 0.5, role 0.2, visible name 0.2, label 0.1.
 * A stable class token counts as the test id when the control has no data-testid.
 */
export function scoreOf(
  attrs: { role?: string; name?: string; testId?: string; className?: string; label?: string },
  intent: HealingIntent,
): { score: number; reason: string } {
  let score = 0;
  const hits: string[] = [];
  const classHit = Boolean(intent.testId && attrs.className?.split(/\s+/).includes(intent.testId));
  if (intent.testId && (attrs.testId === intent.testId || classHit)) {
    score += 0.5;
    hits.push("testId");
  }
  if (intent.role && attrs.role === intent.role) {
    score += 0.2;
    hits.push("role");
  }
  const expectedName = compact(intent.name);
  const actualName = compact(attrs.name);
  if (expectedName && (actualName === expectedName || actualName.startsWith(expectedName))) {
    score += 0.2;
    hits.push("name");
  }
  if (intent.label && compact(attrs.label) === compact(intent.label)) {
    score += 0.1;
    hits.push("label");
  }
  return { score: Number(score.toFixed(2)), reason: hits.join("+") || "no-match" };
}

export async function findCandidates(page: Page, intent: HealingIntent): Promise<HealingCandidate[]> {
  const handles = page.locator("[data-testid], button, a, input, select, textarea, [role]");
  const count = await handles.count();
  const scored: HealingCandidate[] = [];

  for (let i = 0; i < Math.min(count, 80); i += 1) {
    const locator = handles.nth(i);
    const attrs = await locator.evaluate((el) => {
      const tag = el.tagName.toLowerCase();
      const native: Record<string, string> = {
        button: "button",
        a: "link",
        input: ["submit", "button", "image"].includes((el.getAttribute("type") ?? "").toLowerCase())
          ? "button"
          : "textbox",
        select: "combobox",
        textarea: "textbox",
      };
      const aria = (el.getAttribute("aria-label") ?? "").trim();
      const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
      const value = (el.getAttribute("value") ?? "").trim();
      const className = el.getAttribute("class") ?? "";
      const role = className.split(/\s+/).includes("slds-button")
        ? "button"
        : (el.getAttribute("role") ?? native[tag] ?? tag);
      return {
        role,
        name: aria || text || value,
        testId: el.getAttribute("data-testid") ?? undefined,
        className: el.getAttribute("class") ?? "",
        label: aria || undefined,
      };
    });
    const { score, reason } = scoreOf(attrs, intent);
    if (score > 0) scored.push({ locator, score, reason, match: attrs.name.slice(0, 80) });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, settings().maxCandidates);
}

/** Portal header Login. The stored class is the stable token; the test locator can be stale. */
export const portalLoginIntent: HealingIntent = {
  id: "portal-login",
  role: "button",
  name: "Login",
  testId: "comm-user-profile-menu__login-button",
  label: "Login",
};

/**
 * Probe the original locator for 3 seconds.
 * off: throw. report: record suggestions and fail. recover: click the best clear match.
 */
export async function healedClick(page: Page, original: Locator, intent: HealingIntent): Promise<void> {
  const config = settings();
  try {
    await original.waitFor({ state: "visible", timeout: PROBE_MS });
    await original.click();
    return;
  } catch (error) {
    if (config.mode === "off") throw error;
  }

  const suggestions = await findCandidates(page, intent);
  const best = suggestions[0];
  const second = suggestions[1];
  const clear = Boolean(
    best && best.score >= config.minScore && (!second || best.score - second.score >= config.gap),
  );
  const snapshot = suggestions.map((item) => ({ score: item.score, reason: item.reason, match: item.match }));
  const missed = original.toString();

  if (config.mode === "recover" && clear && best) {
    recordHealing({
      intentId: intent.id,
      mode: config.mode,
      found: false,
      applied: true,
      missed,
      suggestions: snapshot,
    });
    await best.locator.click();
    return;
  }

  recordHealing({
    intentId: intent.id,
    mode: config.mode,
    found: false,
    applied: false,
    missed,
    suggestions: snapshot,
  });
  const detail = snapshot.map((item) => `${item.score.toFixed(2)} ${item.reason} ${item.match ?? ""}`.trim()).join("; ");
  throw new Error(
    `Healing did not replace ${intent.id}. Suggestions: ${detail || "none"}. Mode is ${config.mode}.`,
  );
}
